import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { formatBonkAmount } from '@/utils/bonk-utils';
import { WalletStatus } from '@/components/wallet-status';
import { WalletBalance } from '@/components/wallet-balance';

interface ContentItem {
  id: string;
  creatorId: string;
  type: 'NFT' | 'ART' | 'POST' | 'STREAM' | 'VIDEO' | 'MUSIC';
  title: string;
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  tipEnabled: boolean;
  tipGoal?: number;
  totalTips: number;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

const mockCreators: Record<string, Creator> = {
  '1': {
    id: '1',
    name: 'CryptoArtist',
    handle: '@cryptoartist',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  '2': {
    id: '2',
    name: 'SolanaDev',
    handle: '@solanadev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  '3': {
    id: '3',
    name: 'BONKMaster',
    handle: '@bonkmaster',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  '4': {
    id: '4',
    name: 'Web3Creator',
    handle: '@web3creator',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
};

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'NFT':
      return 'photo';
    case 'ART':
      return 'paintbrush';
    case 'POST':
      return 'doc.text';
    case 'STREAM':
      return 'video';
    case 'VIDEO':
      return 'play.rectangle';
    case 'MUSIC':
      return 'music.note';
    default:
      return 'doc';
  }
};

const getContentTypeColor = (type: string) => {
  switch (type) {
    case 'NFT':
      return '#8B5CF6';
    case 'ART':
      return '#F59E0B';
    case 'POST':
      return '#10B981';
    case 'STREAM':
      return '#EF4444';
    case 'VIDEO':
      return '#3B82F6';
    case 'MUSIC':
      return '#EC4899';
    default:
      return '#666666';
  }
};

const formatViews = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
};

interface ContentCardProps {
  content: ContentItem;
  creator: Creator;
  onTip: (contentId: string) => void;
  onView: (contentId: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, creator, onTip, onView }) => {
  const tipProgress = content.tipGoal ? (content.totalTips / content.tipGoal) * 100 : 0;

  return (
    <TouchableOpacity 
      style={styles.contentCard}
      onPress={() => onView(content.id)}
      activeOpacity={0.8}
    >
      {/* Content Media */}
      <View style={styles.mediaContainer}>
        <Image source={{ uri: content.mediaUrl }} style={styles.contentImage} />
        <View style={styles.contentTypeBadge}>
          <UiIconSymbol 
            name={getContentTypeIcon(content.type)} 
            size={12} 
            color="white" 
          />
          <Text style={styles.contentTypeText}>{content.type}</Text>
        </View>
        {content.type === 'STREAM' && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Content Info */}
      <View style={styles.contentInfo}>
        <View style={styles.contentHeader}>
          <View style={styles.creatorInfo}>
            <Image source={{ uri: creator.avatar }} style={styles.creatorAvatar} />
            <View style={styles.creatorDetails}>
              <Text style={styles.creatorName}>{creator.name}</Text>
              <Text style={styles.creatorHandle}>{creator.handle}</Text>
            </View>
          </View>
          <Text style={styles.timeAgo}>{formatTimeAgo(content.createdAt)}</Text>
        </View>

        <Text style={styles.contentTitle}>{content.title}</Text>
        <Text style={styles.contentDescription} numberOfLines={2}>
          {content.description}
        </Text>

        {/* Tags */}
        {content.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {content.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {content.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{content.tags.length - 3}</Text>
            )}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <UiIconSymbol name="heart" size={14} color="#666" />
            <Text style={styles.statText}>{formatViews(content.likes)}</Text>
          </View>
          <View style={styles.statItem}>
            <UiIconSymbol name="eye" size={14} color="#666" />
            <Text style={styles.statText}>{formatViews(content.views)}</Text>
          </View>
          <View style={styles.statItem}>
            <UiIconSymbol name="gift" size={14} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={[styles.statText, { color: UI_CONFIG.COLORS.PRIMARY }]}>
              {formatBonkAmount(content.totalTips)}
            </Text>
          </View>
        </View>

        {/* Tip Progress */}
        {content.tipGoal && (
          <View style={styles.tipProgressContainer}>
            <View style={styles.tipProgressHeader}>
              <Text style={styles.tipProgressText}>
                {formatBonkAmount(content.totalTips)} / {formatBonkAmount(content.tipGoal)}
              </Text>
              <Text style={styles.tipProgressPercent}>{Math.round(tipProgress)}%</Text>
            </View>
            <View style={styles.tipProgressBar}>
              <View 
                style={[
                  styles.tipProgressFill, 
                  { width: `${Math.min(tipProgress, 100)}%` }
                ]} 
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <UiIconSymbol name="heart" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <UiIconSymbol name="message" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <UiIconSymbol name="square.and.arrow.up" size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.tipButton]}
            onPress={() => onTip(content.id)}
          >
            <UiIconSymbol name="gift" size={18} color={UI_CONFIG.COLORS.PRIMARY} />
            <Text style={styles.tipButtonText}>Tip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ContentScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const contentTypes = [
    { id: 'all', name: 'All', icon: 'square.grid.2x2' as const },
    { id: 'NFT', name: 'NFTs', icon: 'photo' as const },
    { id: 'VIDEO', name: 'Videos', icon: 'play.rectangle' as const },
    { id: 'STREAM', name: 'Live', icon: 'video' as const },
    { id: 'ART', name: 'Art', icon: 'paintbrush' as const },
    { id: 'POST', name: 'Posts', icon: 'doc.text' as const },
  ];

  const fetchContent = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/content');
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error('Error fetching content:', error);
      // Fallback to mock data if API is not available
      setContent([
        {
          id: '1',
          creatorId: '1',
          type: 'NFT',
          title: 'BONK Dreams Collection',
          description: 'A unique NFT collection celebrating the BONK community with 100 hand-drawn pieces. Each NFT represents a different aspect of the BONK journey.',
          mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
          tags: ['NFT', 'BONK', 'Art', 'Collection'],
          tipEnabled: true,
          tipGoal: 100000,
          totalTips: 75000,
          likes: 234,
          views: 1250,
          createdAt: '2024-08-01T10:00:00Z',
          updatedAt: '2024-08-02T14:30:00Z'
        },
        {
          id: '2',
          creatorId: '2',
          type: 'VIDEO',
          title: 'Building DeFi on Solana: Complete Guide',
          description: 'Learn how to build a complete DeFi protocol on Solana from scratch. Covers smart contracts, frontend integration, and deployment.',
          mediaUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=300&fit=crop',
          tags: ['Solana', 'DeFi', 'Development', 'Tutorial'],
          tipEnabled: true,
          tipGoal: 50000,
          totalTips: 32000,
          likes: 567,
          views: 3400,
          createdAt: '2024-08-01T15:30:00Z',
          updatedAt: '2024-08-02T13:45:00Z'
        },
        {
          id: '3',
          creatorId: '3',
          type: 'POST',
          title: 'BONK Community Update #15',
          description: 'Weekly update on BONK development, community achievements, and upcoming features. Join the discussion!',
          mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
          tags: ['BONK', 'Community', 'Update', 'News'],
          tipEnabled: true,
          tipGoal: 25000,
          totalTips: 45000,
          likes: 890,
          views: 2100,
          createdAt: '2024-08-01T12:00:00Z',
          updatedAt: '2024-08-02T10:30:00Z'
        },
        {
          id: '4',
          creatorId: '4',
          type: 'STREAM',
          title: 'Live: Solana Ecosystem Deep Dive',
          description: 'Live stream discussing the latest developments in the Solana ecosystem, new projects, and investment opportunities.',
          mediaUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=300&fit=crop',
          tags: ['Solana', 'Live', 'Ecosystem', 'Analysis'],
          tipEnabled: true,
          tipGoal: 75000,
          totalTips: 28000,
          likes: 234,
          views: 890,
          createdAt: '2024-08-02T14:00:00Z',
          updatedAt: '2024-08-02T14:00:00Z'
        },
        {
          id: '5',
          creatorId: '1',
          type: 'ART',
          title: 'BONK Meme Collection',
          description: 'A collection of original BONK memes and artwork celebrating the fun side of the crypto community.',
          mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
          tags: ['BONK', 'Art', 'Memes', 'Fun'],
          tipEnabled: true,
          tipGoal: 30000,
          totalTips: 18000,
          likes: 456,
          views: 1670,
          createdAt: '2024-08-01T08:30:00Z',
          updatedAt: '2024-08-02T12:20:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchContent();
    setRefreshing(false);
  };

  const handleTip = (contentId: string) => {
    router.push({
      pathname: '/(tabs)/tip',
      params: { contentId },
    });
  };

  const handleView = (contentId: string) => {
    // TODO: Navigate to content detail screen when created
    console.log('View content:', contentId);
  };

  const filteredContent = selectedType && selectedType !== 'all' 
    ? content.filter(item => item.type === selectedType)
    : content;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Creator Content</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <UiIconSymbol name="arrow.clockwise" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      <WalletStatus />
      <WalletBalance />

      {/* Content Type Filter */}
      <View style={styles.typeFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {contentTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                selectedType === type.id && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType(type.id === 'all' ? null : type.id)}
            >
              <UiIconSymbol 
                name={type.icon} 
                size={16} 
                color={selectedType === type.id ? 'white' : '#666'} 
              />
              <Text style={[
                styles.typeText,
                selectedType === type.id && styles.typeTextActive,
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      ) : filteredContent.length === 0 ? (
        <View style={styles.emptyContainer}>
          <UiIconSymbol name="photo.on.rectangle" size={48} color="#666" />
          <Text style={styles.emptyTitle}>No content found</Text>
          <Text style={styles.emptyMessage}>
            {selectedType 
              ? `No ${selectedType.toLowerCase()} content yet`
              : 'Check back later for new content'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContentCard 
              content={item} 
              creator={mockCreators[item.creatorId]} 
              onTip={handleTip}
              onView={handleView}
            />
          )}
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
  refreshButton: {
    padding: UI_CONFIG.SPACING.SM,
  },
  typeFilter: {
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: UI_CONFIG.SPACING.SM,
    backgroundColor: 'white',
  },
  typeButtonActive: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  typeText: {
    marginLeft: UI_CONFIG.SPACING.XS,
    fontSize: 14,
    color: '#666',
  },
  typeTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: UI_CONFIG.SPACING.LG,
  },
  contentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: UI_CONFIG.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  mediaContainer: {
    position: 'relative',
  },
  contentImage: {
    width: '100%',
    height: 200,
  },
  contentTypeBadge: {
    position: 'absolute',
    top: UI_CONFIG.SPACING.SM,
    left: UI_CONFIG.SPACING.SM,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: UI_CONFIG.SPACING.SM,
    paddingVertical: 4,
    borderRadius: 12,
  },
  contentTypeText: {
    marginLeft: 4,
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  liveBadge: {
    position: 'absolute',
    top: UI_CONFIG.SPACING.SM,
    right: UI_CONFIG.SPACING.SM,
    backgroundColor: '#EF4444',
    paddingHorizontal: UI_CONFIG.SPACING.SM,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  contentInfo: {
    padding: UI_CONFIG.SPACING.LG,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  creatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: UI_CONFIG.SPACING.SM,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
  },
  creatorHandle: {
    fontSize: 12,
    color: '#666',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  contentDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONFIG.SPACING.XS,
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: UI_CONFIG.SPACING.SM,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  tipProgressContainer: {
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  tipProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.XS,
  },
  tipProgressText: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.TEXT,
    fontWeight: '600',
  },
  tipProgressPercent: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  tipProgressBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tipProgressFill: {
    height: '100%',
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderRadius: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: UI_CONFIG.SPACING.SM,
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    borderRadius: 20,
  },
  tipButton: {
    backgroundColor: '#FFF5F0',
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  tipButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.PRIMARY,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONFIG.SPACING.XL,
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