use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("3CDmG5fSwYF4CUE86s32x9aNQwiSPvRt1B3bXPKnKerb");

// BONK token mint address (mainnet)
pub const BONK_MINT: &str = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";

#[program]
pub mod solcreator_program {
    use super::*;

    /// Initialize the SolCreator program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.authority = ctx.accounts.authority.key();
        global_state.bonk_mint = ctx.accounts.bonk_mint.key();
        global_state.total_tips_sent = 0;
        global_state.total_bonk_tipped = 0;
        global_state.total_vibe_points_distributed = 0;
        global_state.bump = *ctx.bumps.get("global_state").unwrap();
        Ok(())
    }

    /// Initialize a user's vibe score account
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        user_state.user = ctx.accounts.user.key();
        user_state.vibe_points = 0;
        user_state.total_bonk_earned = 0;
        user_state.total_tips_sent = 0;
        user_state.total_upvotes = 0;
        user_state.level = 1;
        user_state.bump = *ctx.bumps.get("user_state").unwrap();
        Ok(())
    }

    /// Record a tip and award vibe points
    pub fn record_tip(
        ctx: Context<RecordTip>,
        tip_amount: u64,
        reference: String,
    ) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        let global_state = &mut ctx.accounts.global_state;

        // Calculate vibe points (5 base + 1 per 100 BONK)
        let base_points = 5;
        let bonus_points = tip_amount / 100;
        let points_earned = base_points + bonus_points;

        // Update user state
        user_state.vibe_points += points_earned;
        user_state.total_tips_sent += 1;
        user_state.level = (user_state.vibe_points / 100) + 1; // Level up every 100 points

        // Update global state
        global_state.total_tips_sent += 1;
        global_state.total_bonk_tipped += tip_amount;
        global_state.total_vibe_points_distributed += points_earned;

        // Emit event
        emit!(TipRecorded {
            user: ctx.accounts.user.key(),
            tip_amount,
            points_earned,
            reference,
        });

        Ok(())
    }

    /// Record an upvote and award vibe points
    pub fn record_upvote(
        ctx: Context<RecordUpvote>,
        creator_address: Pubkey,
        post_id: String,
    ) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        let global_state = &mut ctx.accounts.global_state;

        // Award 1 point for upvoting
        let points_earned = 1;

        // Update user state
        user_state.vibe_points += points_earned;
        user_state.total_upvotes += 1;
        user_state.level = (user_state.vibe_points / 100) + 1;

        // Update global state
        global_state.total_vibe_points_distributed += points_earned;

        // Emit event
        emit!(UpvoteRecorded {
            user: ctx.accounts.user.key(),
            creator_address,
            post_id,
            points_earned,
        });

        Ok(())
    }

    /// Claim BONK rewards based on vibe points
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        let global_state = &mut ctx.accounts.global_state;

        // Calculate rewards (1 BONK per 10 points)
        let points_needed = 10;
        let bonk_per_points = 1;
        let claimable_bonk = (user_state.vibe_points / points_needed) * bonk_per_points;

        require!(claimable_bonk > 0, SolCreatorError::NoRewardsToClaim);

        // Transfer BONK from treasury to user
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.treasury.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.global_state.to_account_info(),
            },
        );

        token::transfer(transfer_ctx, claimable_bonk)?;

        // Update user state
        user_state.total_bonk_earned += claimable_bonk;
        user_state.vibe_points = 0; // Reset points after claiming

        // Emit event
        emit!(RewardsClaimed {
            user: ctx.accounts.user.key(),
            bonk_amount: claimable_bonk,
        });

        Ok(())
    }

    /// Update global configuration
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_authority: Option<Pubkey>,
    ) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;

        if let Some(authority) = new_authority {
            global_state.authority = authority;
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + GlobalState::INIT_SPACE,
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,

    /// CHECK: This is the BONK token mint
    pub bonk_mint: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserState::INIT_SPACE,
        seeds = [b"user_state", user.key().as_ref()],
        bump
    )]
    pub user_state: Account<'info, UserState>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordTip<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
        has_one = user
    )]
    pub user_state: Account<'info, UserState>,

    #[account(
        mut,
        seeds = [b"global_state"],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct RecordUpvote<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
        has_one = user
    )]
    pub user_state: Account<'info, UserState>,

    #[account(
        mut,
        seeds = [b"global_state"],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
        has_one = user
    )]
    pub user_state: Account<'info, UserState>,

    #[account(
        seeds = [b"global_state"],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        constraint = treasury.mint == bonk_mint.key()
    )]
    pub treasury: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = user_token_account.owner == user.key(),
        constraint = user_token_account.mint == bonk_mint.key()
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    /// CHECK: This is the BONK token mint
    pub bonk_mint: UncheckedAccount<'info>,

    pub user: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"global_state"],
        bump = global_state.bump,
        has_one = authority
    )]
    pub global_state: Account<'info, GlobalState>,

    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct GlobalState {
    pub authority: Pubkey,
    pub bonk_mint: Pubkey,
    pub total_tips_sent: u64,
    pub total_bonk_tipped: u64,
    pub total_vibe_points_distributed: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct UserState {
    pub user: Pubkey,
    pub vibe_points: u64,
    pub total_bonk_earned: u64,
    pub total_tips_sent: u64,
    pub total_upvotes: u64,
    pub level: u64,
    pub bump: u8,
}

#[event]
pub struct TipRecorded {
    pub user: Pubkey,
    pub tip_amount: u64,
    pub points_earned: u64,
    pub reference: String,
}

#[event]
pub struct UpvoteRecorded {
    pub user: Pubkey,
    pub creator_address: Pubkey,
    pub post_id: String,
    pub points_earned: u64,
}

#[event]
pub struct RewardsClaimed {
    pub user: Pubkey,
    pub bonk_amount: u64,
}

#[error_code]
pub enum SolCreatorError {
    #[msg("No rewards available to claim")]
    NoRewardsToClaim,
}
