import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UiIconSymbol } from '../ui/ui-icon-symbol';
import { formatBonkAmount } from '../../utils/lamports-to-sol';
import { SocialMediaPost } from '../../services/social-media-api';

const { width } = Dimensions.get('window');

interface SocialMediaPostCardProps {
  post: SocialMediaPost;
  onTip: (post: SocialMediaPost) => void;
  onView: (post: SocialMediaPost) => void;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'twitter':
      return 'twitter';
    case 'instagram':
      return 'instagram';
    case 'tiktok':
      return 'video';
    case 'farcaster':
      return 'message-circle';
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

const formatEngagement = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h`;
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)}d`;
  } else {
    return `${Math.floor(diffInSeconds / 2592000)}mo`;
  }
};

export const SocialMediaPostCard: React.FC<SocialMediaPostCardProps> = ({
  post,
  onTip,
  onView,
}) => {
  const handleOpenOriginal = () => {
    Linking.openURL(post.url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.creatorInfo}>
          <Image
            source={{ uri: post.creatorAvatar || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <View style={styles.creatorDetails}>
            <Text style={styles.creatorName}>{post.creatorName}</Text>
            <View style={styles.handleContainer}>
              <Text style={styles.handle}>@{post.creatorHandle}</Text>
              <View style={[styles.platformBadge, { backgroundColor: getPlatformColor(post.platform) }]}>
                <UiIconSymbol name={getPlatformIcon(post.platform)} size={12} color="white" />
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.timeAgo}>{formatTimeAgo(post.publishedAt)}</Text>
      </View>

      {/* Content */}
      <TouchableOpacity onPress={() => onView(post)} activeOpacity={0.9}>
        <Text style={styles.content} numberOfLines={3}>
          {post.content}
        </Text>

        {/* Media */}
        {post.thumbnailUrl && (
          <View style={styles.mediaContainer}>
            <Image source={{ uri: post.thumbnailUrl }} style={styles.mediaImage} />
            {post.platform === 'tiktok' && (
              <View style={styles.playButton}>
                <UiIconSymbol name="play" size={24} color="white" />
              </View>
            )}
          </View>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Engagement Stats */}
      <View style={styles.engagementContainer}>
        <View style={styles.engagementItem}>
          <UiIconSymbol name="heart" size={16} color="#FF6B6B" />
          <Text style={styles.engagementText}>{formatEngagement(post.engagement.likes)}</Text>
        </View>
        <View style={styles.engagementItem}>
          <UiIconSymbol name="message-circle" size={16} color="#4ECDC4" />
          <Text style={styles.engagementText}>{formatEngagement(post.engagement.comments)}</Text>
        </View>
        <View style={styles.engagementItem}>
          <UiIconSymbol name="repeat" size={16} color="#45B7D1" />
          <Text style={styles.engagementText}>{formatEngagement(post.engagement.shares)}</Text>
        </View>
        {post.engagement.views && (
          <View style={styles.engagementItem}>
            <UiIconSymbol name="eye" size={16} color="#96CEB4" />
            <Text style={styles.engagementText}>{formatEngagement(post.engagement.views)}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleOpenOriginal}
        >
          <UiIconSymbol name="external-link" size={18} color="#666" />
          <Text style={styles.actionText}>View Original</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tipButton}
          onPress={() => onTip(post)}
        >
          <LinearGradient
            colors={['#FF6B35', '#F7931E']}
            style={styles.tipGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <UiIconSymbol name="gift" size={18} color="white" />
            <Text style={styles.tipButtonText}>
              {post.totalTips > 0 ? `Tip ${formatBonkAmount(post.totalTips)}` : 'Tip Creator'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handle: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  platformBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
  },
  content: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  engagementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 12,
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  tipButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  tipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
}); 