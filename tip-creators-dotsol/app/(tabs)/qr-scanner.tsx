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
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { parseSolanaPayUrl } from '@/utils/bonk-utils';
import { SolanaPayService } from '@/services/solana-pay';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  useEffect(() => {
      const getBarCodeScannerPermissions = async () => {
    // const { status } = await BarCodeScanner.requestPermissionsAsync();
    // setHasPermission(status === 'granted');
    setHasPermission(false); // Temporarily disabled
  };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    try {
      // Check if it's a Solana Pay URL
      if (data.startsWith('solana:')) {
        const parsedData = SolanaPayService.parsePaymentUrl(data);
        
        if (parsedData && parsedData.recipient && parsedData.amount > 0) {
          // Navigate to tipping screen with scanned data
          router.push({
            pathname: '/(tabs)/tip',
            params: {
              recipientAddress: parsedData.recipient,
              amount: parsedData.amount.toString(),
              reference: parsedData.reference || '',
            },
          });
        } else {
          Alert.alert('Invalid QR Code', 'This QR code doesn\'t contain valid tipping information.');
        }
      } else {
        // Try to parse as regular creator address
        router.push({
          pathname: '/(tabs)/tip',
          params: {
            recipientAddress: data,
            amount: '0',
          },
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to parse QR code. Please try again.');
    }
  };

  const handleManualEntry = () => {
    router.push('/(tabs)/tip');
  };

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn);
  };

  const resetScanner = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.text}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <UiIconSymbol name="camera.fill" size={64} color={UI_CONFIG.COLORS.ERROR} />
          <Text style={styles.title}>Camera Access Required</Text>
          <Text style={styles.text}>
            To scan QR codes, please grant camera permission in your device settings.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleManualEntry}>
            <Text style={styles.buttonText}>Enter Address Manually</Text>
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
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          <UiIconSymbol 
            name={isFlashOn ? "bolt.fill" : "bolt.slash.fill"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scannerContainer}>
        <View style={styles.scanner}>
          <Text style={styles.scannerText}>QR Scanner Temporarily Disabled</Text>
        </View>
        
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          
          <Text style={styles.scanText}>
            Position the QR code within the frame
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        {scanned && (
          <TouchableOpacity style={styles.scanAgainButton} onPress={resetScanner}>
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.manualButton} onPress={handleManualEntry}>
          <UiIconSymbol name="keyboard" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.manualButtonText}>Enter Manually</Text>
        </TouchableOpacity>
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
  flashButton: {
    padding: UI_CONFIG.SPACING.SM,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  scannerText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 0,
    top: 0,
    right: 0,
    left: 'auto',
  },
  cornerBottomLeft: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
    bottom: 0,
    top: 'auto',
  },
  cornerBottomRight: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: UI_CONFIG.SPACING.XL,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
  },
  bottomContainer: {
    padding: UI_CONFIG.SPACING.LG,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scanAgainButton: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    paddingVertical: UI_CONFIG.SPACING.MD,
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: UI_CONFIG.SPACING.MD,
  },
  manualButtonText: {
    color: UI_CONFIG.COLORS.PRIMARY,
    fontSize: 16,
    marginLeft: UI_CONFIG.SPACING.SM,
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