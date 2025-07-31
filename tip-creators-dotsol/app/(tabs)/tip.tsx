import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG, BONK_TOKEN_CONFIG } from '@/constants/bonk-config';
import { 
  validateTipAmount, 
  formatBonkAmount, 
  createSolanaPayUrl,
  calculateTipPoints,
} from '@/utils/bonk-utils';

export default function TipScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [amount, setAmount] = useState(params.amount?.toString() || '');
  const [recipientAddress, setRecipientAddress] = useState(params.recipientAddress?.toString() || '');
  const [reference, setReference] = useState(params.reference?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);

  // Mock creator data (in real app, this would come from API)
  const mockCreator = {
    name: 'CryptoArtist',
    handle: '@cryptoartist',
    avatar: 'https://via.placeholder.com/80',
    bio: 'Digital artist creating unique NFT collections',
  };

  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    setAmount(cleaned);
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleTip = async () => {
    const numAmount = parseFloat(amount);
    
    // Validate amount
    const validation = validateTipAmount(numAmount);
    if (!validation.isValid) {
      Alert.alert('Invalid Amount', validation.error);
      return;
    }

    // Validate recipient address
    if (!recipientAddress.trim()) {
      Alert.alert('Invalid Address', 'Please enter a valid recipient address.');
      return;
    }

    setIsLoading(true);

    try {
      // Create Solana Pay URL
      const solanaPayUrl = createSolanaPayUrl(
        recipientAddress,
        numAmount,
        reference || undefined
      );

      // Calculate points earned
      const pointsEarned = calculateTipPoints(numAmount);

      // Show confirmation dialog
      Alert.alert(
        'Confirm Tip',
        `Send ${formatBonkAmount(numAmount)} to ${mockCreator.name}?\n\nYou'll earn ${pointsEarned} vibe points!`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Send Tip',
            onPress: () => {
              // In a real app, this would trigger the Solana Pay flow
              Alert.alert(
                'Tip Sent!',
                `Successfully sent ${formatBonkAmount(numAmount)} to ${mockCreator.name}.\n\nYou earned ${pointsEarned} vibe points!`,
                [
                  {
                    text: 'OK',
                    onPress: () => router.back(),
                  },
                ]
              );
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process tip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQR = () => {
    if (!recipientAddress.trim()) {
      Alert.alert('Invalid Address', 'Please enter a valid recipient address.');
      return;
    }

    // Navigate to QR generation screen
    router.push({
      pathname: '/(tabs)/qr-generator',
      params: {
        recipientAddress,
        amount: amount || '0',
        reference,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <UiIconSymbol name="chevron.left" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Tip</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Creator Info */}
          <View style={styles.creatorCard}>
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>{mockCreator.name}</Text>
              <Text style={styles.creatorHandle}>{mockCreator.handle}</Text>
              <Text style={styles.creatorBio}>{mockCreator.bio}</Text>
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.amountSection}>
            <Text style={styles.sectionTitle}>Tip Amount (BONK)</Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>BONK</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              {BONK_TOKEN_CONFIG.DEFAULT_TIP_AMOUNTS.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[
                    styles.quickAmountButton,
                    amount === quickAmount.toString() && styles.quickAmountButtonActive,
                  ]}
                  onPress={() => handleQuickAmount(quickAmount)}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      amount === quickAmount.toString() && styles.quickAmountTextActive,
                    ]}
                  >
                    {formatBonkAmount(quickAmount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recipient Address */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Recipient Address</Text>
            <TextInput
              style={styles.textInput}
              value={recipientAddress}
              onChangeText={setRecipientAddress}
              placeholder="Enter Solana wallet address"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          {/* Reference (Optional) */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Reference (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={reference}
              onChangeText={setReference}
              placeholder="Add a message or reference"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          {/* Vibe Points Info */}
          {amount && parseFloat(amount) > 0 && (
            <View style={styles.pointsCard}>
              <UiIconSymbol name="star.fill" size={20} color={UI_CONFIG.COLORS.SECONDARY} />
              <Text style={styles.pointsText}>
                You'll earn {calculateTipPoints(parseFloat(amount))} vibe points for this tip!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.generateQRButton} onPress={handleGenerateQR}>
            <UiIconSymbol name="qrcode" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.generateQRText}>Generate QR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sendButton, (!amount || !recipientAddress) && styles.sendButtonDisabled]}
            onPress={handleTip}
            disabled={!amount || !recipientAddress || isLoading}
          >
            {isLoading ? (
              <Text style={styles.sendButtonText}>Processing...</Text>
            ) : (
              <>
                <UiIconSymbol name="paperplane.fill" size={20} color="white" />
                <Text style={styles.sendButtonText}>Send Tip</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    padding: UI_CONFIG.SPACING.LG,
  },
  creatorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: UI_CONFIG.SPACING.LG,
    marginBottom: UI_CONFIG.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  creatorInfo: {
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: 4,
  },
  creatorHandle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  creatorBio: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT,
    textAlign: 'center',
    lineHeight: 20,
  },
  amountSection: {
    marginBottom: UI_CONFIG.SPACING.LG,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    marginBottom: UI_CONFIG.SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
    marginRight: UI_CONFIG.SPACING.SM,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONFIG.SPACING.SM,
  },
  quickAmountButton: {
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'white',
  },
  quickAmountButtonActive: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  quickAmountText: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT,
  },
  quickAmountTextActive: {
    color: 'white',
  },
  inputSection: {
    marginBottom: UI_CONFIG.SPACING.LG,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.MD,
    marginBottom: UI_CONFIG.SPACING.LG,
  },
  pointsText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT,
    flex: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: UI_CONFIG.SPACING.LG,
    gap: UI_CONFIG.SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  generateQRButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
    backgroundColor: 'white',
  },
  generateQRText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 16,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderRadius: 12,
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  sendButtonText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
}); 