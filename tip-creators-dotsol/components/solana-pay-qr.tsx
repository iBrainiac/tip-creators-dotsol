import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { SolanaPayService, type SolanaPayRequest } from '@/services/solana-pay';
import { formatBonkAmount } from '@/utils/bonk-utils';
import Clipboard from '@react-native-clipboard/clipboard';

interface SolanaPayQRProps {
  paymentRequest: SolanaPayRequest;
  creatorName: string;
  onClose: () => void;
}

export function SolanaPayQR({ paymentRequest, creatorName, onClose }: SolanaPayQRProps) {
  const router = useRouter();
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generatePaymentUrl = () => {
      try {
        const url = SolanaPayService.createPaymentUrl(paymentRequest);
        setPaymentUrl(url);
      } catch (error) {
        Alert.alert('Error', 'Failed to generate payment URL');
      } finally {
        setIsLoading(false);
      }
    };

    generatePaymentUrl();
  }, [paymentRequest]);

  const handleCopyUrl = async () => {
    try {
      Clipboard.setString(paymentUrl);
      Alert.alert('Copied!', 'Payment URL copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy URL');
    }
  };

  const handleShare = () => {
    // In a real app, you would use a sharing library
    Alert.alert('Share', 'Share functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <UiIconSymbol name="qrcode" size={64} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Generating QR Code...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <UiIconSymbol name="xmark" size={24} color={UI_CONFIG.COLORS.TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay with Solana Pay</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.creatorInfo}>
          <Text style={styles.creatorName}>{creatorName}</Text>
          <Text style={styles.amount}>{formatBonkAmount(paymentRequest.amount)}</Text>
        </View>

        <View style={styles.qrContainer}>
          <QRCode
            value={paymentUrl}
            size={250}
            color={UI_CONFIG.COLORS.TEXT}
            backgroundColor="white"
            ecl="M"
          />
        </View>

        <Text style={styles.instructions}>
          Scan this QR code with your Solana wallet to send the tip
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopyUrl}>
            <UiIconSymbol name="doc.on.doc" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.actionText}>Copy URL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <UiIconSymbol name="square.and.arrow.up" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {paymentRequest.message && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>Message:</Text>
            <Text style={styles.messageText}>{paymentRequest.message}</Text>
          </View>
        )}
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
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: UI_CONFIG.SPACING.LG,
    borderRadius: 16,
    marginBottom: UI_CONFIG.SPACING.XL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructions: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING.XL,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: UI_CONFIG.SPACING.LG,
    marginBottom: UI_CONFIG.SPACING.XL,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  actionText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 16,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  messageContainer: {
    backgroundColor: '#F5F5F5',
    padding: UI_CONFIG.SPACING.LG,
    borderRadius: 12,
    width: '100%',
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  messageText: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT,
    lineHeight: 20,
  },
}); 