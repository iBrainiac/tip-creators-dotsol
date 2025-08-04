import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/components/auth/auth-provider';
import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';

export default function SignInScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { connect } = useWalletUi();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      Alert.alert('Connection Error', 'Failed to connect wallet. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <UiIconSymbol name="wallet.pass.fill" size={80} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.title}>Welcome to SolCreator</Text>
          <Text style={styles.subtitle}>
            Connect your wallet to start tipping creators with BONK
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <UiIconSymbol name="heart.fill" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.featureText}>Tip creators with BONK</Text>
          </View>
          <View style={styles.feature}>
            <UiIconSymbol name="star.fill" size={24} color={UI_CONFIG.COLORS.SECONDARY} />
            <Text style={styles.featureText}>Earn vibe points</Text>
          </View>
          <View style={styles.feature}>
            <UiIconSymbol name="trophy.fill" size={24} color={UI_CONFIG.COLORS.SUCCESS} />
            <Text style={styles.featureText}>Track your achievements</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.connectButton, isLoading && styles.connectButtonDisabled]}
          onPress={handleConnectWallet}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <UiIconSymbol name="arrow.clockwise" size={20} color="white" />
              <Text style={styles.connectButtonText}>Connecting...</Text>
            </>
          ) : (
            <>
              <UiIconSymbol name="wallet.pass" size={20} color="white" />
              <Text style={styles.connectButtonText}>Connect Wallet</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.XL,
  },
  header: {
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.XL * 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginTop: UI_CONFIG.SPACING.LG,
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginBottom: UI_CONFIG.SPACING.XL * 2,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.LG,
  },
  featureText: {
    marginLeft: UI_CONFIG.SPACING.MD,
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
    fontWeight: '500',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingHorizontal: UI_CONFIG.SPACING.XL,
    paddingVertical: UI_CONFIG.SPACING.LG,
    borderRadius: 12,
    marginBottom: UI_CONFIG.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  connectButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  connectButtonText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
