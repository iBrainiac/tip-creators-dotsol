# Frontend Development Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator
- Solana wallet (Phantom, Solflare, etc.)

### Project Structure
```
app/
├── (tabs)/              # Tab-based navigation screens
│   ├── home.tsx         # Creator discovery
│   ├── tip.tsx          # Tipping interface
│   ├── social-feed.tsx  # Social media feed
│   ├── content.tsx      # Content management
│   ├── vibe-score.tsx   # Gamification
│   ├── qr-scanner.tsx   # QR code scanning
│   └── settings/        # User settings
├── sign-in.tsx          # Authentication
├── role-selection.tsx   # User role selection
├── solana-pay-modal.tsx # Payment modal
└── _layout.tsx          # Root layout

components/
├── ui/                  # Reusable UI components
├── wallet-status.tsx    # Wallet connection status
├── wallet-balance.tsx   # BONK balance display
├── creator-card.tsx     # Creator profile cards
└── social-media/        # Social media components

services/
├── api.ts              # Backend API client
├── solana.ts           # Solana blockchain interactions
├── wallet.ts           # Wallet management
└── social-media-api.ts # Social platform integrations

hooks/
├── use-creators.ts     # Creator data management
├── use-wallet.ts       # Wallet state management
├── use-tips.ts         # Tip management
└── use-social-media.ts # Social media data

utils/
├── bonk-utils.ts       # BONK token utilities
├── solana-utils.ts     # Solana blockchain utilities
└── validation.ts       # Input validation

constants/
├── bonk-config.ts      # BONK token configuration
├── ui-config.ts        # UI constants
└── api-config.ts       # API configuration
```

## 🏗️ Architecture Overview

### State Management
The app uses a combination of React Query for server state and Context API for global client state:

```typescript
// Global state structure
interface AppState {
  wallet: WalletState;
  user: UserState;
  creators: CreatorsState;
  socialMedia: SocialMediaState;
}

// Server state with React Query
const { data: creators, isLoading, error } = useCreators({
  limit: 20,
  search: searchQuery,
  tag: selectedTag,
});
```

### Navigation
Uses Expo Router with file-based routing:

```typescript
// Navigation between screens
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to tip screen
router.push({
  pathname: '/(tabs)/tip',
  params: { creatorId: 'creator_123' }
});

// Navigate back
router.back();
```

## 🎨 UI Components

### Core Components

#### CreatorCard
```typescript
interface CreatorCardProps {
  creator: Creator;
  onTip: (creatorId: string) => void;
  onPress?: (creator: Creator) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onTip, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(creator)}>
      <Image source={{ uri: creator.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{creator.name}</Text>
      <Text style={styles.handle}>{creator.handle}</Text>
      <Text style={styles.bio}>{creator.bio}</Text>
      <TouchableOpacity onPress={() => onTip(creator.id)}>
        <Text>Tip</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
```

#### WalletStatus
```typescript
const WalletStatus: React.FC = () => {
  const { connected, publicKey, balance } = useWallet();
  
  if (!connected) {
    return (
      <TouchableOpacity onPress={connectWallet}>
        <Text>Connect Wallet</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <View>
      <Text>Connected: {publicKey?.slice(0, 8)}...</Text>
      <Text>Balance: {formatBonkAmount(balance)} BONK</Text>
    </View>
  );
};
```

### Custom Hooks

#### useCreators
```typescript
export const useCreators = (options: CreatorsOptions) => {
  return useQuery({
    queryKey: ['creators', options],
    queryFn: () => api.getCreators(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

#### useWallet
```typescript
export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
  });

  const connectWallet = async () => {
    try {
      const wallet = await SolanaMobileWalletAdapter.connect();
      setState({
        connected: true,
        publicKey: wallet.publicKey,
        balance: await getBonkBalance(wallet.publicKey),
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return { ...state, connectWallet };
};
```

## 🔧 Development Workflow

### 1. Setting Up Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### 2. Environment Configuration

Create `.env` file:
```env
API_BASE_URL=http://localhost:3001
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PROGRAM_ID=3CDmG5fSwYF4CUE86s32x9aNQwiSPvRt1B3bXPKnKerb
DEBUG_MODE=true
```

### 3. TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/services/*": ["./services/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/utils/*": ["./utils/*"],
      "@/constants/*": ["./constants/*"]
    }
  }
}
```

## 🎯 Key Features Implementation

### 1. Wallet Integration

#### Solana Mobile Wallet Adapter
```typescript
import { SolanaMobileWalletAdapter } from '@solana-mobile/mobile-wallet-adapter-protocol';

const connectWallet = async () => {
  try {
    const wallet = await SolanaMobileWalletAdapter.connect();
    const publicKey = wallet.publicKey;
    const balance = await getBonkBalance(publicKey);
    
    setWalletState({ connected: true, publicKey, balance });
  } catch (error) {
    console.error('Wallet connection failed:', error);
  }
};
```

#### BONK Balance Management
```typescript
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';

const getBonkBalance = async (publicKey: PublicKey): Promise<number> => {
  const tokenAccount = await getAssociatedTokenAddress(
    new PublicKey(BONK_MINT),
    publicKey
  );
  
  try {
    const account = await getAccount(connection, tokenAccount);
    return Number(account.amount);
  } catch {
    return 0;
  }
};
```

### 2. Tipping System

#### Tip Screen Implementation
```typescript
const TipScreen: React.FC = () => {
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState('');
  const { creatorId } = useLocalSearchParams();
  
  const handleTip = async () => {
    try {
      const transaction = await createTipTransaction({
        creatorId,
        amount,
        message,
      });
      
      const signature = await sendTransaction(transaction);
      await recordTip({ creatorId, amount, message, transactionHash: signature });
      
      // Show success message
      Alert.alert('Success', 'Tip sent successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send tip');
    }
  };
  
  return (
    <View style={styles.container}>
      <AmountSelector value={amount} onChange={setAmount} />
      <MessageInput value={message} onChange={setMessage} />
      <TipButton onPress={handleTip} amount={amount} />
    </View>
  );
};
```

### 3. Social Media Integration

#### Social Feed Component
```typescript
const SocialFeed: React.FC = () => {
  const { data: posts, isLoading } = useSocialMediaPosts();
  
  const renderPost = ({ item }: { item: SocialMediaPost }) => (
    <SocialMediaPostCard
      post={item}
      onTip={(post) => {
        router.push({
          pathname: '/(tabs)/tip',
          params: { 
            creatorId: post.creatorId,
            postId: post.id,
            platform: post.platform
          }
        });
      }}
    />
  );
  
  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
};
```

## 🧪 Testing

### Unit Testing
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { CreatorCard } from '../components/creator-card';

describe('CreatorCard', () => {
  it('should render creator information correctly', () => {
    const creator = {
      id: '1',
      name: 'John Doe',
      handle: '@johndoe',
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Content creator',
    };
    
    const { getByText } = render(
      <CreatorCard creator={creator} onTip={jest.fn()} />
    );
    
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('@johndoe')).toBeTruthy();
  });
  
  it('should call onTip when tip button is pressed', () => {
    const onTip = jest.fn();
    const creator = { id: '1', name: 'John Doe' };
    
    const { getByText } = render(
      <CreatorCard creator={creator} onTip={onTip} />
    );
    
    fireEvent.press(getByText('Tip'));
    expect(onTip).toHaveBeenCalledWith('1');
  });
});
```

### Integration Testing
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useCreators } from '../hooks/use-creators';

describe('useCreators', () => {
  it('should fetch creators successfully', async () => {
    const { result, waitFor } = renderHook(() => 
      useCreators({ limit: 10 })
    );
    
    await waitFor(() => result.current.isSuccess);
    
    expect(result.current.data.creators).toHaveLength(10);
  });
});
```

## 🔧 Build & Deployment

### Development Build
```bash
# Create development build
expo run:ios --configuration Debug
expo run:android --variant debug
```

### Production Build
```bash
# Build for production
expo build:ios
expo build:android

# Or use EAS Build
eas build --platform ios
eas build --platform android
```

### App Store Deployment
```bash
# Submit to App Store
eas submit --platform ios
eas submit --platform android
```

## 🐛 Debugging

### React Native Debugger
```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Start debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Flipper Integration
```typescript
// Add to index.js
import { addPlugin } from 'react-native-flipper';
import { NetworkPlugin } from 'react-native-flipper-network-plugin';

addPlugin(new NetworkPlugin());
```

### Logging
```typescript
import { Logger } from '@/utils/logger';

Logger.info('User connected wallet', { publicKey });
Logger.error('Tip failed', { error, creatorId });
Logger.debug('API response', { data });
```

## 📱 Performance Optimization

### Image Optimization
```typescript
import { Image } from 'expo-image';

const OptimizedImage: React.FC<{ uri: string }> = ({ uri }) => (
  <Image
    source={{ uri }}
    style={styles.image}
    placeholder={blurhash}
    contentFit="cover"
    transition={200}
  />
);
```

### List Optimization
```typescript
const OptimizedList: React.FC = () => {
  const renderItem = useCallback(({ item }) => (
    <CreatorCard creator={item} onTip={handleTip} />
  ), [handleTip]);
  
  const keyExtractor = useCallback((item) => item.id, []);
  
  return (
    <FlatList
      data={creators}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};
```

### Memory Management
```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    // Cleanup subscriptions
    subscription?.unsubscribe();
  };
}, []);
```

## 🔒 Security Best Practices

### Input Validation
```typescript
import { validateTipAmount, validateMessage } from '@/utils/validation';

const handleTip = async () => {
  if (!validateTipAmount(amount)) {
    Alert.alert('Invalid amount');
    return;
  }
  
  if (!validateMessage(message)) {
    Alert.alert('Invalid message');
    return;
  }
  
  // Proceed with tip
};
```

### Secure Storage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store sensitive data securely
await AsyncStorage.setItem('wallet_connected', 'true');

// Retrieve data
const connected = await AsyncStorage.getItem('wallet_connected');
```

## 📚 Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Solana Web3.js](https://docs.solana.com/developing/clients/javascript-api)
- [Anchor Framework](https://www.anchor-lang.com/)

### Community
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://github.com/react-native-community)
- [Solana Discord](https://discord.gg/solana)

---

This guide provides a comprehensive overview of frontend development for the SolCreator app. For specific implementation details, refer to the individual component files and the API documentation.
