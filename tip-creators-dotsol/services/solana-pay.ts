import { PublicKey, Transaction } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { bonkToLamports, getBonkMintAddress } from '@/utils/bonk-utils';

export interface SolanaPayRequest {
  recipient: string;
  amount: number;
  reference?: string;
  label?: string;
  message?: string;
  memo?: string;
}

export interface SolanaPayResponse {
  transaction: Transaction;
  message: string;
}

export class SolanaPayService {
  private static readonly BONK_MINT = getBonkMintAddress();

  /**
   * Create a Solana Pay payment request URL
   */
  static createPaymentUrl(request: SolanaPayRequest): string {
    const params = new URLSearchParams();
    
    // Required parameters
    params.append('recipient', request.recipient);
    params.append('amount', bonkToLamports(request.amount).toString());
    params.append('token', this.BONK_MINT.toString());
    
    // Optional parameters
    if (request.reference) {
      params.append('reference', request.reference);
    }
    if (request.label) {
      params.append('label', request.label);
    }
    if (request.message) {
      params.append('message', request.message);
    }
    if (request.memo) {
      params.append('memo', request.memo);
    }
    
    return `solana:${request.recipient}?${params.toString()}`;
  }

  /**
   * Parse a Solana Pay URL
   */
  static parsePaymentUrl(url: string): SolanaPayRequest | null {
    try {
      if (!url.startsWith('solana:')) {
        return null;
      }

      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const recipient = urlObj.pathname || params.get('recipient');
      const amount = params.get('amount');
      const token = params.get('token');
      
      if (!recipient || !amount || !token) {
        return null;
      }

      // Verify it's a BONK payment
      if (token !== this.BONK_MINT.toString()) {
        return null;
      }

      return {
        recipient,
        amount: Number(amount) / Math.pow(10, 5), // Convert from lamports to BONK
        reference: params.get('reference') || undefined,
        label: params.get('label') || undefined,
        message: params.get('message') || undefined,
        memo: params.get('memo') || undefined,
      };
    } catch (error) {
      console.error('Error parsing Solana Pay URL:', error);
      return null;
    }
  }

  /**
   * Create a payment request for tipping a creator
   */
  static createTipRequest(
    creatorWallet: string,
    amount: number,
    creatorName: string,
    reference?: string
  ): string {
    return this.createPaymentUrl({
      recipient: creatorWallet,
      amount,
      label: `Tip ${creatorName}`,
      message: `Sending ${amount} BONK to ${creatorName}`,
      reference,
      memo: `Tip to ${creatorName}`,
    });
  }

  /**
   * Validate a Solana Pay request
   */
  static validateRequest(request: SolanaPayRequest): { isValid: boolean; error?: string } {
    if (!request.recipient) {
      return { isValid: false, error: 'Recipient address is required' };
    }

    if (!request.amount || request.amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    try {
      new PublicKey(request.recipient);
    } catch {
      return { isValid: false, error: 'Invalid recipient address' };
    }

    return { isValid: true };
  }

  /**
   * Create a QR code data URL for a payment request
   */
  static async createQRCodeDataUrl(paymentUrl: string): Promise<string> {
    try {
      // For now, we'll use a simple QR code generation
      // In a real app, you might want to use a more sophisticated QR library
      const qrData = encodeURIComponent(paymentUrl);
      return `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
          <text x="100" y="100" text-anchor="middle" font-size="12">${qrData}</text>
        </svg>
      `)}`;
    } catch (error) {
      console.error('Error creating QR code:', error);
      throw error;
    }
  }

  /**
   * Generate a unique reference for tracking payments
   */
  static generateReference(creatorId: string, tipperId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `tip_${creatorId}_${tipperId}_${timestamp}_${random}`;
  }
} 