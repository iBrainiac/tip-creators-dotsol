import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as NFC from 'expo-nfc';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';

const { width } = Dimensions.get('window');

export default function NFCTipScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    checkNFCSupport();
  }, []);

  const checkNFCSupport = async () => {
    try {
      const supported = await NFC.isEnabled();
      setIsSupported(supported);
    } catch (error) {
      setIsSupported(false);
    }
  };

  const startNFCScan = async () => {
    if (!isSupported) {
      Alert.alert('NFC Not Supported', 'Your device does not support NFC or NFC is disabled.');
      return;
    }

    setIsScanning(true);

    try {
      // In a real app, this would scan for NFC tags
      // For now, we'll simulate the process
      setTimeout(() => {
        setIsScanning(false);
        // Simulate finding a creator
        Alert.alert(
          'Creator Found!',
          'Tap detected for @cryptoartist\n\nWould you like to send a tip?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Send Tip',
              onPress: () => {
                router.push({
                  pathname: '/(tabs)/tip',
                  params: {
                    recipientAddress: 'CryptoArtist123456789',
                    amount: '100',
                    reference: 'NFC Tip',
                  },
                });
              },
            },
          ]
        );
      }, 2000);
    } catch (error) {
      setIsScanning(false);
      Alert.alert('Error', 'Failed to scan NFC. Please try again.');
    }
  };

  const stopNFCScan = () => {
    setIsScanning(false);
  };

  if (isSupported === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Checking NFC support...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isSupported === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <UiIconSymbol name="wave.3.right" size={64} color={UI_CONFIG.COLORS.ERROR} />
          <Text style={styles.title}>NFC Not Available</Text>
          <Text style={styles.text}>
            Your device doesn't support NFC or NFC is disabled. You can still tip creators using QR codes or manual entry.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/qr-scanner')}>
            <Text style={styles.buttonText}>Scan QR Code Instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <UiIconSymbol name="chevron.left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NFC Tap to Tip</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.nfcContainer}>
          <View style={styles.nfcIconContainer}>
            <UiIconSymbol 
              name="wave.3.right" 
              size={80} 
              color={isScanning ? UI_CONFIG.COLORS.PRIMARY : 'white'} 
            />
            {isScanning && (
              <View style={styles.scanningIndicator}>
                <UiIconSymbol name="antenna.radiowaves.left.and.right" size={24} color="white" />
              </View>
            )}
          </View>
          
          <Text style={styles.nfcTitle}>
            {isScanning ? 'Scanning for Creators...' : 'Ready to Scan'}
          </Text>
          
          <Text style={styles.nfcDescription}>
            {isScanning 
              ? 'Hold your phone near a creator\'s NFC tag to send a tip instantly.'
              : 'Tap the button below to start scanning for nearby creator NFC tags.'
            }
          </Text>

          {isScanning ? (
            <TouchableOpacity style={styles.stopButton} onPress={stopNFCScan}>
              <Text style={styles.stopButtonText}>Stop Scanning</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.scanButton} onPress={startNFCScan}>
              <UiIconSymbol name="play.fill" size={20} color="white" />
              <Text style={styles.scanButtonText}>Start NFC Scan</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How NFC Tipping Works</Text>
          <View style={styles.infoItem}>
            <UiIconSymbol name="1.circle.fill" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.infoText}>Creators have NFC tags with their wallet addresses</Text>
          </View>
          <View style={styles.infoItem}>
            <UiIconSymbol name="2.circle.fill" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.infoText}>Tap your phone near the tag to detect the creator</Text>
          </View>
          <View style={styles.infoItem}>
            <UiIconSymbol name="3.circle.fill" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.infoText}>Choose your tip amount and send BONK instantly</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONFIG.SPACING.XL,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: UI_CONFIG.SPACING.SM,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: UI_CONFIG.SPACING.LG,
  },
  nfcContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcIconContainer: {
    position: 'relative',
    marginBottom: UI_CONFIG.SPACING.XL,
  },
  scanningIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderRadius: 12,
    padding: 4,
  },
  nfcTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: UI_CONFIG.SPACING.MD,
    textAlign: 'center',
  },
  nfcDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING.XL,
    lineHeight: 24,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingVertical: UI_CONFIG.SPACING.LG,
    paddingHorizontal: UI_CONFIG.SPACING.XL,
    borderRadius: 25,
  },
  scanButtonText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  stopButton: {
    backgroundColor: UI_CONFIG.COLORS.ERROR,
    paddingVertical: UI_CONFIG.SPACING.LG,
    paddingHorizontal: UI_CONFIG.SPACING.XL,
    borderRadius: 25,
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: UI_CONFIG.SPACING.LG,
    marginTop: UI_CONFIG.SPACING.XL,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: UI_CONFIG.SPACING.MD,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  infoText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 14,
    color: 'white',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: UI_CONFIG.SPACING.MD,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING.LG,
    lineHeight: 24,
  },
  button: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingVertical: UI_CONFIG.SPACING.MD,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 