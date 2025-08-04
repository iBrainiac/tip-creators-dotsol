import { PublicKey } from '@solana/web3.js';
import { BONK_TOKEN_CONFIG, APP_CONFIG } from '../constants/bonk-config';

/**
 * Convert BONK amount from human-readable format to lamports (smallest unit)
 * @param bonkAmount - Amount in BONK (e.g., 1.5)
 * @returns Amount in lamports
 */
export function bonkToLamports(bonkAmount: number): number {
  return Math.floor(bonkAmount * Math.pow(10, BONK_TOKEN_CONFIG.DECIMALS));
}

/**
 * Convert lamports to human-readable BONK amount
 * @param lamports - Amount in lamports
 * @returns Amount in BONK
 */
export function lamportsToBonk(lamports: number): number {
  return lamports / Math.pow(10, BONK_TOKEN_CONFIG.DECIMALS);
}

/**
 * Format BONK amount for display
 * @param bonkAmount - Amount in BONK
 * @returns Formatted string
 */
export function formatBonkAmount(bonkAmount: number): string {
  if (bonkAmount >= 1000000) {
    return `${(bonkAmount / 1000000).toFixed(1)}M BONK`;
  } else if (bonkAmount >= 1000) {
    return `${(bonkAmount / 1000).toFixed(1)}K BONK`;
  } else {
    return `${bonkAmount.toLocaleString()} BONK`;
  }
}

/**
 * Get BONK token mint address as PublicKey
 * @returns PublicKey for BONK token mint
 */
export function getBonkMintAddress(): PublicKey {
  return new PublicKey(BONK_TOKEN_CONFIG.MINT_ADDRESS);
}

/**
 * Validate tip amount
 * @param amount - Tip amount in BONK
 * @returns Validation result
 */
export function validateTipAmount(amount: number): { isValid: boolean; error?: string } {
  if (amount < BONK_TOKEN_CONFIG.MIN_TIP_AMOUNT) {
    return {
      isValid: false,
      error: `Minimum tip amount is ${BONK_TOKEN_CONFIG.MIN_TIP_AMOUNT} BONK`,
    };
  }
  
  if (amount > BONK_TOKEN_CONFIG.MAX_TIP_AMOUNT) {
    return {
      isValid: false,
      error: `Maximum tip amount is ${BONK_TOKEN_CONFIG.MAX_TIP_AMOUNT} BONK`,
    };
  }
  
  return { isValid: true };
}

/**
 * Calculate vibe score points for tipping
 * @param tipAmount - Amount tipped in BONK
 * @returns Points earned
 */
export function calculateTipPoints(tipAmount: number): number {
  // Base points for tipping
  const basePoints = 5;
  
  // Bonus points based on tip amount (1 point per 100 BONK)
  const bonusPoints = Math.floor(tipAmount / 100);
  
  return basePoints + bonusPoints;
}

/**
 * Calculate BONK rewards from vibe score points
 * @param points - Total vibe score points
 * @returns BONK reward amount
 */
export function calculateBonkReward(points: number): number {
  const { MIN_POINTS_FOR_REWARD, BONK_PER_POINTS } = APP_CONFIG.VIBE_SCORE;
  
  if (points < MIN_POINTS_FOR_REWARD) {
    return 0;
  }
  
  return Math.floor(points / MIN_POINTS_FOR_REWARD) * BONK_PER_POINTS;
}

/**
 * Generate a unique transaction ID for tipping
 * @returns Transaction ID string
 */
export function generateTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `tip_${timestamp}_${random}`;
}

/**
 * Create Solana Pay URL for tipping
 * @param recipientAddress - Recipient's wallet address
 * @param amount - Tip amount in BONK
 * @param reference - Optional reference for the transaction
 * @returns Solana Pay URL
 */
export function createSolanaPayUrl(
  recipientAddress: string,
  amount: number,
  reference?: string
): string {
  const baseUrl = 'solana:';
  const params = new URLSearchParams({
    address: recipientAddress,
    amount: bonkToLamports(amount).toString(),
    token: BONK_TOKEN_CONFIG.MINT_ADDRESS,
  });
  
  if (reference) {
    params.append('reference', reference);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Parse Solana Pay URL
 * @param url - Solana Pay URL
 * @returns Parsed parameters
 */
export function parseSolanaPayUrl(url: string): {
  recipientAddress: string;
  amount: number;
  token: string;
  reference?: string;
} {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  
  return {
    recipientAddress: params.get('address') || '',
    amount: lamportsToBonk(parseInt(params.get('amount') || '0')),
    token: params.get('token') || '',
    reference: params.get('reference') || undefined,
  };
} 