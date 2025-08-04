import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { formatBonkAmount } from '@/utils/bonk-utils';
import { WalletStatus } from '@/components/wallet-status';
import { WalletBalance } from '@/components/wallet-balance';
import { useCreators } from '@/hooks/use-creators';
import { type Creator } from '@/services/api';

interface CreatorCardProps {
  creator: Creator;
  onTip: (creatorId: string) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onTip }) => {
  return (
    <TouchableOpacity 
      style={styles.creatorCard}
      onPress={() => onTip(creator.id)}
      activeOpacity={0.8}
    >
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
        <View style={styles.tipButtonContainer}>
          <TouchableOpacity
            style={styles.tipButton}
            onPress={() => onTip(creator.id)}
            activeOpacity={0.7}
          >
            <UiIconSymbol name="heart.fill" size={20} color="white" />
            <Text style={styles.tipButtonText}>Tip</Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{creator.isOnline ? '🟢' : '⚪'}</Text>
          <Text style={styles.statLabel}>{creator.isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { data: creatorsData, isLoading, refetch } = useCreators({ 
    limit: 20,
    search: searchQuery || undefined,
    tag: selectedTag || undefined,
  });
  const creators = creatorsData?.creators || [];

  // Available tags for filtering
  const availableTags = ['All', 'NFT', 'Art', 'Digital', 'DeFi', 'Development', 'Solana', 'BONK', 'Community', 'Memes', 'Web3', 'Education', 'Content'];

  const handleTip = (creatorId: string) => {
    router.push({
      pathname: '/(tabs)/tip',
      params: { creatorId },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleScanQR = () => {
    router.push('/(tabs)/qr-scanner');
  };

  const handleTagPress = (tag: string) => {
    if (tag === 'All') {
      setSelectedTag(null);
    } else {
      setSelectedTag(selectedTag === tag ? null : tag);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SolCreator</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleScanQR}>
            <UiIconSymbol name="qrcode" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      <WalletStatus />
      <WalletBalance />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <UiIconSymbol name="magnifyingglass" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search creators..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <UiIconSymbol name="xmark.circle.fill" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tag Filters */}
      <View style={styles.tagsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                selectedTag === tag && styles.tagButtonActive,
                tag === 'All' && !selectedTag && styles.tagButtonActive,
              ]}
              onPress={() => handleTagPress(tag)}
            >
              <Text style={[
                styles.tagText,
                selectedTag === tag && styles.tagTextActive,
                tag === 'All' && !selectedTag && styles.tagTextActive,
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading creators...</Text>
        </View>
      ) : creators.length === 0 ? (
        <View style={styles.emptyContainer}>
          <UiIconSymbol name="person.3" size={48} color="#666" />
          <Text style={styles.emptyTitle}>No creators found</Text>
          <Text style={styles.emptyMessage}>
            {searchQuery || selectedTag 
              ? 'Try adjusting your search or filter criteria'
              : 'Check back later for new creators'
            }
          </Text>
          {(searchQuery || selectedTag) && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
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
      )}
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
  tipButtonContainer: {
    marginTop: UI_CONFIG.SPACING.MD,
  },
  tipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
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
    color: 'white',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONFIG.SPACING.XL,
  },
  loadingText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
    marginTop: UI_CONFIG.SPACING.MD,
  },
  searchContainer: {
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: UI_CONFIG.SPACING.SM,
  },
  tagsContainer: {
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.SM,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tagButton: {
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: UI_CONFIG.SPACING.SM,
    backgroundColor: 'white',
  },
  tagButtonActive: {
    borderColor: UI_CONFIG.COLORS.PRIMARY,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  tagTextActive: {
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '600',
  },
  clearButton: {
    marginTop: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignSelf: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONFIG.SPACING.XL,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginTop: UI_CONFIG.SPACING.MD,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: UI_CONFIG.SPACING.SM,
    textAlign: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.MD,
  },
}); 