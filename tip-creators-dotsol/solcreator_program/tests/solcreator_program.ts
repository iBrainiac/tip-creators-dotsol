import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolcreatorProgram } from "../target/types/solcreator_program";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("solcreator-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolcreatorProgram as Program<SolcreatorProgram>;

  // Test accounts
  const authority = Keypair.generate();
  const user = Keypair.generate();
  const bonkMint = Keypair.generate();
  const treasury = Keypair.generate();
  const userTokenAccount = Keypair.generate();

  // PDAs
  let globalStatePda: PublicKey;
  let globalStateBump: number;
  let userStatePda: PublicKey;
  let userStateBump: number;

  before(async () => {
    // Airdrop SOL to test accounts
    await provider.connection.requestAirdrop(authority.publicKey, 10 * LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(user.publicKey, 10 * LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(treasury.publicKey, 10 * LAMPORTS_PER_SOL);

    // Create BONK mint
    await createMint(
      provider.connection,
      authority,
      authority.publicKey,
      null,
      5, // decimals
      bonkMint
    );

    // Create treasury account
    await createAccount(
      provider.connection,
      authority,
      bonkMint.publicKey,
      treasury.publicKey
    );

    // Mint BONK to treasury
    await mintTo(
      provider.connection,
      authority,
      bonkMint.publicKey,
      treasury.publicKey,
      authority,
      1000000000 // 10,000 BONK
    );

    // Create user token account
    await createAccount(
      provider.connection,
      user,
      bonkMint.publicKey,
      userTokenAccount.publicKey
    );

    // Find PDAs
    [globalStatePda, globalStateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("global_state")],
      program.programId
    );

    [userStatePda, userStateBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_state"), user.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initializes the program", async () => {
    await program.methods
      .initialize()
      .accounts({
        globalState: globalStatePda,
        bonkMint: bonkMint.publicKey,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    const globalState = await program.account.globalState.fetch(globalStatePda);
    assert.equal(globalState.authority.toString(), authority.publicKey.toString());
    assert.equal(globalState.bonkMint.toString(), bonkMint.publicKey.toString());
    assert.equal(globalState.totalTipsSent.toNumber(), 0);
    assert.equal(globalState.totalBonkTipped.toNumber(), 0);
    assert.equal(globalState.totalVibePointsDistributed.toNumber(), 0);
  });

  it("Initializes a user", async () => {
    await program.methods
      .initializeUser()
      .accounts({
        userState: userStatePda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const userState = await program.account.userState.fetch(userStatePda);
    assert.equal(userState.user.toString(), user.publicKey.toString());
    assert.equal(userState.vibePoints.toNumber(), 0);
    assert.equal(userState.totalBonkEarned.toNumber(), 0);
    assert.equal(userState.totalTipsSent.toNumber(), 0);
    assert.equal(userState.totalUpvotes.toNumber(), 0);
    assert.equal(userState.level.toNumber(), 1);
  });

  it("Records a tip and awards vibe points", async () => {
    const tipAmount = new anchor.BN(1000); // 10 BONK
    const reference = "Test tip";

    await program.methods
      .recordTip(tipAmount, reference)
      .accounts({
        userState: userStatePda,
        globalState: globalStatePda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    const userState = await program.account.userState.fetch(userStatePda);
    const globalState = await program.account.globalState.fetch(globalStatePda);

    // Should earn 5 base points + 10 bonus points = 15 points
    assert.equal(userState.vibePoints.toNumber(), 15);
    assert.equal(userState.totalTipsSent.toNumber(), 1);
    assert.equal(userState.level.toNumber(), 1); // Still level 1 (needs 100 points)

    assert.equal(globalState.totalTipsSent.toNumber(), 1);
    assert.equal(globalState.totalBonkTipped.toNumber(), 1000);
    assert.equal(globalState.totalVibePointsDistributed.toNumber(), 15);
  });

  it("Records an upvote and awards vibe points", async () => {
    const creatorAddress = Keypair.generate().publicKey;
    const postId = "test-post-123";

    await program.methods
      .recordUpvote(creatorAddress, postId)
      .accounts({
        userState: userStatePda,
        globalState: globalStatePda,
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    const userState = await program.account.userState.fetch(userStatePda);
    const globalState = await program.account.globalState.fetch(globalStatePda);

    // Should earn 1 point for upvote
    assert.equal(userState.vibePoints.toNumber(), 16);
    assert.equal(userState.totalUpvotes.toNumber(), 1);

    assert.equal(globalState.totalVibePointsDistributed.toNumber(), 16);
  });

  it("Levels up user after accumulating points", async () => {
    // Record more tips to reach level 2 (100 points)
    for (let i = 0; i < 6; i++) {
      await program.methods
        .recordTip(new anchor.BN(1000), `Tip ${i}`)
        .accounts({
          userState: userStatePda,
          globalState: globalStatePda,
          user: user.publicKey,
        })
        .signers([user])
        .rpc();
    }

    const userState = await program.account.userState.fetch(userStatePda);
    // 16 + (6 * 15) = 106 points, should be level 2
    assert.equal(userState.level.toNumber(), 2);
  });

  it("Claims BONK rewards", async () => {
    const userTokenAccountBefore = await getAccount(
      provider.connection,
      userTokenAccount.publicKey
    );

    await program.methods
      .claimRewards()
      .accounts({
        userState: userStatePda,
        globalState: globalStatePda,
        treasury: treasury.publicKey,
        userTokenAccount: userTokenAccount.publicKey,
        bonkMint: bonkMint.publicKey,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    const userState = await program.account.userState.fetch(userStatePda);
    const userTokenAccountAfter = await getAccount(
      provider.connection,
      userTokenAccount.publicKey
    );

    // Should claim 10 BONK (106 points / 10 = 10 BONK)
    const claimedAmount = userTokenAccountAfter.amount - userTokenAccountBefore.amount;
    assert.equal(claimedAmount, 10);

    // Points should be reset to 0
    assert.equal(userState.vibePoints.toNumber(), 0);
    assert.equal(userState.totalBonkEarned.toNumber(), 10);
  });

  it("Fails to claim rewards when no points available", async () => {
    try {
      await program.methods
        .claimRewards()
        .accounts({
          userState: userStatePda,
          globalState: globalStatePda,
          treasury: treasury.publicKey,
          userTokenAccount: userTokenAccount.publicKey,
          bonkMint: bonkMint.publicKey,
          user: user.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user])
        .rpc();

      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.include(error.message, "No rewards available to claim");
    }
  });

  it("Updates global configuration", async () => {
    const newAuthority = Keypair.generate();

    await program.methods
      .updateConfig(newAuthority.publicKey)
      .accounts({
        globalState: globalStatePda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const globalState = await program.account.globalState.fetch(globalStatePda);
    assert.equal(globalState.authority.toString(), newAuthority.publicKey.toString());
  });
});
