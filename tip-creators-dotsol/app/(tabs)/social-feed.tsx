import React, { useState, useEffect } from 'react';
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

interface SocialPost {
  id: string;
  platform: string;
  creatorId: string;
  content: string;
  mediaUrls: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  url: string;
  tags: string[];
  tipEnabled: boolean;
  totalTips: number;
  publishedAt: string;
  createdAt: string;
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

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'twitter':
      return 'bird';
    case 'instagram':
      return 'camera';
    case 'tiktok':
      return 'music.note';
    case 'farcaster':
      return 'network';
    default:
      return 'globe';
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'twitter':
      return '#1DA1F2';
    case 'instagram':
      return '#E4405F';
    case 'tiktok':
      return '#000000';
    case 'farcaster':
      return '#8B5CF6';
    default:
      return '#666666';
  }
};

const formatEngagement = (count: number) => {
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
    return `${diffInMinutes}m`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d`;
  }
};

interface SocialPostCardProps {
  post: SocialPost;
  creator: Creator;
  onTip: (postId: string) => void;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({ post, creator, onTip }) => {
  return (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.creatorInfo}>
          <Image source={{ uri: creator.avatar }} style={styles.creatorAvatar} />
          <View style={styles.creatorDetails}>
            <Text style={styles.creatorName}>{creator.name}</Text>
            <View style={styles.platformInfo}>
              <UiIconSymbol 
                name={getPlatformIcon(post.platform)} 
                size={12} 
                color={getPlatformColor(post.platform)} 
              />
              <Text style={styles.creatorHandle}>{creator.handle}</Text>
              <Text style={styles.timeAgo}>• {formatTimeAgo(post.publishedAt)}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <UiIconSymbol name="ellipsis" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.postText}>{post.content}</Text>
        
        {/* Media */}
        {post.mediaUrls.length > 0 && (
          <View style={styles.mediaContainer}>
            {post.mediaUrls.map((url, index) => (
              <Image key={index} source={{ uri: url }} style={styles.mediaImage} />
            ))}
          </View>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Engagement Stats */}
      <View style={styles.engagementStats}>
        <View style={styles.statItem}>
          <UiIconSymbol name="heart" size={16} color="#666" />
          <Text style={styles.statText}>{formatEngagement(post.engagement.likes)}</Text>
        </View>
        <View style={styles.statItem}>
          <UiIconSymbol name="message" size={16} color="#666" />
          <Text style={styles.statText}>{formatEngagement(post.engagement.comments)}</Text>
        </View>
        <View style={styles.statItem}>
          <UiIconSymbol name="arrow.2.squarepath" size={16} color="#666" />
          <Text style={styles.statText}>{formatEngagement(post.engagement.shares)}</Text>
        </View>
        <View style={styles.statItem}>
          <UiIconSymbol name="gift" size={16} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={[styles.statText, { color: UI_CONFIG.COLORS.PRIMARY }]}>
            {formatBonkAmount(post.totalTips)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <UiIconSymbol name="heart" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <UiIconSymbol name="message" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <UiIconSymbol name="arrow.2.squarepath" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.tipButton]}
          onPress={() => onTip(post.id)}
        >
          <UiIconSymbol name="gift" size={20} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.tipButtonText}>Tip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function SocialFeedScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const platforms = [
    { id: 'all', name: 'All', icon: 'globe' },
    { id: 'twitter', name: 'Twitter', icon: 'bird' },
    { id: 'instagram', name: 'Instagram', icon: 'camera' },
    { id: 'tiktok', name: 'TikTok', icon: 'music.note' },
    { id: 'farcaster', name: 'Farcaster', icon: 'network' },
  ];

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/social-posts');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Fallback to mock data if API is not available
      setPosts([
        {
          id: '1',
          platform: 'twitter',
          creatorId: '3',
          content: '🚀 BONK just hit another milestone! 1M+ holders and growing strong. The Solana ecosystem is absolutely thriving right now. What\'s your favorite BONK moment so far? #BONK #Solana #DeFi',
          mediaUrls: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'],
          engagement: { likes: 2847, comments: 156, shares: 89 },
          url: 'https://twitter.com/bonkmaster/status/123456789',
          tags: ['BONK', 'Solana', 'DeFi', 'Milestone'],
          tipEnabled: true,
          totalTips: 15000,
          publishedAt: '2024-08-02T14:30:00Z',
          createdAt: '2024-08-02T14:30:00Z'
        },
        {
          id: '2',
          platform: 'twitter',
          creatorId: '2',
          content: '🔥 Just deployed my new DeFi protocol on Solana! 10x faster and 100x cheaper than Ethereum. The future of finance is here. Check out the code: github.com/solanadev/defi-protocol #Solana #DeFi #Web3',
          mediaUrls: ['https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=400&fit=crop'],
          engagement: { likes: 1245, comments: 89, shares: 234 },
          url: 'https://twitter.com/solanadev/status/123456790',
          tags: ['Solana', 'DeFi', 'Development', 'Web3'],
          tipEnabled: true,
          totalTips: 8500,
          publishedAt: '2024-08-02T13:45:00Z',
          createdAt: '2024-08-02T13:45:00Z'
        },
        {
          id: '3',
          platform: 'instagram',
          creatorId: '1',
          content: '🎨 New NFT collection dropping soon! "BONK Dreams" - 100 unique pieces celebrating the BONK community. Each piece tells a story of our journey together. Preview available now! #NFT #BONK #Solana #Art',
          mediaUrls: [
            'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=600&fit=crop'
          ],
          engagement: { likes: 892, comments: 67, shares: 34 },
          url: 'https://instagram.com/p/123456789',
          tags: ['NFT', 'BONK', 'Solana', 'Art'],
          tipEnabled: true,
          totalTips: 12000,
          publishedAt: '2024-08-02T12:20:00Z',
          createdAt: '2024-08-02T12:20:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleTip = (postId: string) => {
    router.push({
      pathname: '/(tabs)/tip',
      params: { postId },
    });
  };

  const filteredPosts = selectedPlatform && selectedPlatform !== 'all' 
    ? posts.filter(post => post.platform === selectedPlatform)
    : posts;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Social Feed</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <UiIconSymbol name="arrow.clockwise" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      <WalletStatus />
      <WalletBalance />

      {/* Platform Filter */}
      <View style={styles.platformFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {platforms.map((platform) => (
            <TouchableOpacity
              key={platform.id}
              style={[
                styles.platformButton,
                selectedPlatform === platform.id && styles.platformButtonActive,
              ]}
              onPress={() => setSelectedPlatform(platform.id === 'all' ? null : platform.id)}
            >
              <UiIconSymbol 
                name={platform.icon} 
                size={16} 
                color={selectedPlatform === platform.id ? 'white' : '#666'} 
              />
              <Text style={[
                styles.platformText,
                selectedPlatform === platform.id && styles.platformTextActive,
              ]}>
                {platform.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading social feed...</Text>
        </View>
      ) : filteredPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <UiIconSymbol name="bubble.left.and.bubble.right" size={48} color="#666" />
          <Text style={styles.emptyTitle}>No posts found</Text>
          <Text style={styles.emptyMessage}>
            {selectedPlatform 
              ? `No posts from ${selectedPlatform} yet`
              : 'Check back later for new content'
            }
          </Text>
        </View>
      ) : (
      <FlatList
        data={filteredPosts}
          keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <SocialPostCard 
            post={item}
              creator={mockCreators[item.creatorId]} 
            onTip={handleTip}
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
  platformFilter: {
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  platformButton: {
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
  platformButtonActive: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderColor: UI_CONFIG.COLORS.PRIMARY,
  },
  platformText: {
    marginLeft: UI_CONFIG.SPACING.XS,
    fontSize: 14,
    color: '#666',
  },
  platformTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: UI_CONFIG.SPACING.LG,
  },
  postCard: {
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
  postHeader: {
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: UI_CONFIG.SPACING.SM,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: 2,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorHandle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  moreButton: {
    padding: UI_CONFIG.SPACING.XS,
  },
  postContent: {
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  postText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
    lineHeight: 24,
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  mediaContainer: {
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONFIG.SPACING.XS,
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
  engagementStats: {
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