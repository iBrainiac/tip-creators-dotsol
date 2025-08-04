import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/components/auth/auth-provider';
import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { useConnection } from '@/components/solana/solana-provider';
import { getBonkMintAddress } from '@/utils/bonk-utils';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { UI_CONFIG } from '@/constants/bonk-config';
import { formatBonkAmount } from '@/utils/bonk-utils';

export function WalletBalance() {
  const { isAuthenticated } = useAuth();
  const { account } = useWalletUi();
  const connection = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !account) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        const bonkMint = getBonkMintAddress();
        const tokenAccount = await getAssociatedTokenAddress(
          bonkMint,
          account.publicKey
        );

        try {
          const accountInfo = await getAccount(connection, tokenAccount);
          setBalance(Number(accountInfo.amount) / Math.pow(10, 5)); // BONK has 5 decimals
        } catch (error) {
          // Token account doesn't exist, balance is 0
          setBalance(0);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [isAuthenticated, account, connection]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>BONK Balance</Text>
        {isLoading ? (
          <Text style={styles.balanceAmount}>Loading...</Text>
        ) : (
          <Text style={styles.balanceAmount}>
            {balance !== null ? formatBonkAmount(balance) : '0 BONK'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
  },
  balanceCard: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.LG,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
}); 