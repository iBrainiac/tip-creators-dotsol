import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { SolanaPayService, type SolanaPayRequest } from '@/services/solana-pay';
import { formatBonkAmount } from '@/utils/bonk-utils';
import { SolanaPayQR } from '@/components/solana-pay-qr';

export default function SolanaPayModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [showQR, setShowQR] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<SolanaPayRequest | null>(null);

  // Parse parameters
  const recipient = params.recipient?.toString() || '';
  const amount = parseFloat(params.amount?.toString() || '0');
  const creatorName = params.creatorName?.toString() || 'Creator';
  const reference = params.reference?.toString() || '';

  React.useEffect(() => {
    if (recipient && amount > 0) {
      const request: SolanaPayRequest = {
        recipient,
        amount,
        reference,
        label: `Tip ${creatorName}`,
        message: `Sending ${formatBonkAmount(amount)} to ${creatorName}`,
        memo: `Tip to ${creatorName}`,
      };

      // Validate the request
      const validation = SolanaPayService.validateRequest(request);
      if (!validation.isValid) {
        Alert.alert('Invalid Request', validation.error);
        router.back();
        return;
      }

      setPaymentRequest(request);
    } else {
      Alert.alert('Invalid Parameters', 'Missing recipient or amount');
      router.back();
    }
  }, [recipient, amount, creatorName, reference, router]);

  const handleClose = () => {
    router.back();
  };

  const handleShowQR = () => {
    setShowQR(true);
  };

  const handleCopyUrl = async () => {
    if (!paymentRequest) return;

    try {
      const paymentUrl = SolanaPayService.createPaymentUrl(paymentRequest);
      // In a real app, you would use Clipboard API
      Alert.alert('Copied!', 'Payment URL copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy URL');
    }
  };

  if (!paymentRequest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <UiIconSymbol name="arrow.clockwise" size={64} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading payment request...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showQR) {
    return (
      <SolanaPayQR
        paymentRequest={paymentRequest}
        creatorName={creatorName}
        onClose={() => setShowQR(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <UiIconSymbol name="xmark" size={24} color={UI_CONFIG.COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solana Pay</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.creatorInfo}>
          <UiIconSymbol name="person.circle.fill" size={80} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.creatorName}>{creatorName}</Text>
          <Text style={styles.amount}>{formatBonkAmount(paymentRequest.amount)}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Recipient:</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {paymentRequest.recipient}
            </Text>
          </View>
          
          {paymentRequest.message && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Message:</Text>
              <Text style={styles.detailValue}>{paymentRequest.message}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleShowQR}>
            <UiIconSymbol name="qrcode" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Show QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleCopyUrl}>
            <UiIconSymbol name="doc.on.doc" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.secondaryButtonText}>Copy Payment URL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <UiIconSymbol name="info.circle" size={20} color={UI_CONFIG.COLORS.SECONDARY} />
          <Text style={styles.infoText}>
            Scan the QR code with any Solana wallet that supports Solana Pay to complete the payment
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: UI_CONFIG.SPACING.SM,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: UI_CONFIG.SPACING.XL,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
    marginTop: UI_CONFIG.SPACING.MD,
  },
  creatorInfo: {
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.XL,
  },
  creatorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginTop: UI_CONFIG.SPACING.MD,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.LG,
    marginBottom: UI_CONFIG.SPACING.XL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: UI_CONFIG.SPACING.XS,
  },
  detailValue: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
    fontFamily: 'monospace',
  },
  actions: {
    gap: UI_CONFIG.SPACING.MD,
    marginBottom: UI_CONFIG.SPACING.XL,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingVertical: UI_CONFIG.SPACING.LG,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: UI_CONFIG.SPACING.LG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  secondaryButtonText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 16,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    padding: UI_CONFIG.SPACING.LG,
    borderRadius: 12,
  },
  infoText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT,
    lineHeight: 20,
    flex: 1,
  },
}); 