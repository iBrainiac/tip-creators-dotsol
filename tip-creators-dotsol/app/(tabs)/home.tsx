import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { formatBonkAmount } from '@/utils/bonk-utils';

// Mock data for creators
const mockCreators = [
  {
    id: '1',
    name: 'CryptoArtist',
    handle: '@cryptoartist',
    avatar: 'https://via.placeholder.com/60',
    bio: 'Digital artist creating unique NFT collections',
    totalTips: 50000,
    followers: 1200,
    isOnline: true,
  },
  {
    id: '2',
    name: 'SolanaDev',
    handle: '@solanadev',
    avatar: 'https://via.placeholder.com/60',
    bio: 'Building the future of DeFi on Solana',
    totalTips: 75000,
    followers: 2500,
    isOnline: false,
  },
  {
    id: '3',
    name: 'BONKMaster',
    handle: '@bonkmaster',
    avatar: 'https://via.placeholder.com/60',
    bio: 'BONK enthusiast and community builder',
    totalTips: 100000,
    followers: 5000,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Web3Creator',
    handle: '@web3creator',
    avatar: 'https://via.placeholder.com/60',
    bio: 'Creating content about Web3 and blockchain',
    totalTips: 30000,
    followers: 800,
    isOnline: true,
  },
];

interface CreatorCardProps {
  creator: typeof mockCreators[0];
  onTip: (creatorId: string) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onTip }) => {
  return (
    <View style={styles.creatorCard}>
      <View style={styles.creatorHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: creator.avatar }} style={styles.avatar} />
          {creator.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.creatorInfo}>
          <Text style={styles.creatorName}>{creator.name}</Text>
          <Text style={styles.creatorHandle}>{creator.handle}</Text>
          <Text style={styles.creatorBio} numberOfLines={2}>
            {creator.bio}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.tipButton}
          onPress={() => onTip(creator.id)}
        >
          <UiIconSymbol name="heart.fill" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.tipButtonText}>Tip</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.creatorStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatBonkAmount(creator.totalTips)}</Text>
          <Text style={styles.statLabel}>Total Tips</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{creator.followers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [creators, setCreators] = useState(mockCreators);

  const handleTip = (creatorId: string) => {
    router.push({
      pathname: '/(tabs)/tip',
      params: { creatorId },
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleScanQR = () => {
    router.push('/(tabs)/qr-scanner');
  };

  const handleNFC = () => {
    router.push('/(tabs)/nfc-tip');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SolCreator</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleScanQR}>
            <UiIconSymbol name="qrcode" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleNFC}>
            <UiIconSymbol name="wave.3.right" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>255K</Text>
          <Text style={styles.statCardLabel}>BONK Tipped Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>1.2K</Text>
          <Text style={styles.statCardLabel}>Active Creators</Text>
        </View>
      </View>

      <FlatList
        data={creators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CreatorCard creator={item} onTip={handleTip} />}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  headerActions: {
    flexDirection: 'row',
    gap: UI_CONFIG.SPACING.SM,
  },
  actionButton: {
    padding: UI_CONFIG.SPACING.SM,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    gap: UI_CONFIG.SPACING.MD,
  },
  statCard: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    padding: UI_CONFIG.SPACING.MD,
    borderRadius: 12,
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statCardLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginTop: 4,
  },
  listContainer: {
    padding: UI_CONFIG.SPACING.LG,
  },
  creatorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: UI_CONFIG.SPACING.LG,
    marginBottom: UI_CONFIG.SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: UI_CONFIG.SPACING.MD,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: UI_CONFIG.COLORS.SUCCESS,
    borderWidth: 2,
    borderColor: 'white',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: 2,
  },
  creatorHandle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  creatorBio: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT,
    lineHeight: 20,
  },
  tipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  tipButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  creatorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5E5',
  },
}); 