import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/components/auth/auth-provider';
import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { ellipsify } from '@/utils/ellipsify';

export function WalletStatus() {
  const { isAuthenticated, isLoading } = useAuth();
  const { account, connect, disconnect } = useWalletUi();

  const handleWalletAction = () => {
    if (isAuthenticated) {
      disconnect();
    } else {
      connect();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <UiIconSymbol name="arrow.clockwise" size={16} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Connecting...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.walletButton} onPress={handleWalletAction}>
        {isAuthenticated ? (
          <>
            <UiIconSymbol name="wallet.pass" size={16} color={UI_CONFIG.COLORS.SUCCESS} />
            <Text style={styles.connectedText}>
              {ellipsify(account?.publicKey.toString() || '', 8)}
            </Text>
            <UiIconSymbol name="chevron.down" size={12} color={UI_CONFIG.COLORS.TEXT} />
          </>
        ) : (
          <>
            <UiIconSymbol name="wallet.pass" size={16} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.connectText}>Connect Wallet</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: UI_CONFIG.SPACING.MD,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  loadingText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 14,
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
  },
  connectedText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT,
    fontWeight: '600',
  },
  connectText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 14,
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '600',
  },
}); 