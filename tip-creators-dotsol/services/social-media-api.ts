// Social Media API Integration Service
// Handles fetching posts from various social media platforms

export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'tiktok' | 'farcaster';
  creatorId: string;
  creatorHandle: string;
  creatorName: string;
  creatorAvatar?: string;
  content: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  publishedAt: string;
  url: string;
  tipEnabled: boolean;
  totalTips: number;
  tags: string[];
}

export interface SocialMediaConfig {
  twitter: {
    apiKey: string;
    apiSecret: string;
    bearerToken: string;
    clientId: string;
    clientSecret: string;
  };
  instagram: {
    accessToken: string;
    appId: string;
    appSecret: string;
  };
  tiktok: {
    clientKey: string;
    clientSecret: string;
    accessToken?: string;
  };
  farcaster: {
    apiKey?: string;
    baseUrl: string;
  };
}

class SocialMediaApiService {
  private config: SocialMediaConfig;

  constructor(config: SocialMediaConfig) {
    this.config = config;
  }

  // Twitter/X Integration
  async getTwitterPosts(username: string, count: number = 10): Promise<SocialMediaPost[]> {
    try {
      // First get user ID
      const userResponse = await fetch(
        `https://api.twitter.com/2/users/by/username/${username}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error(`Twitter API Error: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const userId = userData.data.id;

      // Get user's tweets
      const tweetsResponse = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=${count}&tweet.fields=created_at,public_metrics,entities&expansions=attachments.media_keys&media.fields=url,preview_image_url`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.twitter.bearerToken}`,
          },
        }
      );

      if (!tweetsResponse.ok) {
        throw new Error(`Twitter API Error: ${tweetsResponse.status}`);
      }

      const tweetsData = await tweetsResponse.json();
      
      return tweetsData.data.map((tweet: any) => ({
        id: tweet.id,
        platform: 'twitter' as const,
        creatorId: userId,
        creatorHandle: username,
        creatorName: userData.data.name,
        creatorAvatar: userData.data.profile_image_url,
        content: tweet.text,
        mediaUrls: tweet.attachments?.media_keys?.map((key: string) => {
          const media = tweetsData.includes?.media?.find((m: any) => m.media_key === key);
          return media?.url || '';
        }).filter(Boolean) || [],
        thumbnailUrl: tweet.attachments?.media_keys?.map((key: string) => {
          const media = tweetsData.includes?.media?.find((m: any) => m.media_key === key);
          return media?.preview_image_url || media?.url || '';
        }).filter(Boolean)[0],
        engagement: {
          likes: tweet.public_metrics.like_count,
          comments: tweet.public_metrics.reply_count,
          shares: tweet.public_metrics.retweet_count,
        },
        publishedAt: tweet.created_at,
        url: `https://twitter.com/${username}/status/${tweet.id}`,
        tipEnabled: true,
        totalTips: 0,
        tags: this.extractHashtags(tweet.text),
      }));
    } catch (error) {
      console.error('Error fetching Twitter posts:', error);
      throw error;
    }
  }

  // Instagram Integration
  async getInstagramPosts(username: string, count: number = 10): Promise<SocialMediaPost[]> {
    try {
      // Get user ID first
      const userResponse = await fetch(
        `https://graph.instagram.com/v12.0/${username}?fields=id,username,profile_picture_url&access_token=${this.config.instagram.accessToken}`
      );

      if (!userResponse.ok) {
        throw new Error(`Instagram API Error: ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      // Get user's media
      const mediaResponse = await fetch(
        `https://graph.instagram.com/v12.0/${userData.id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${count}&access_token=${this.config.instagram.accessToken}`
      );

      if (!mediaResponse.ok) {
        throw new Error(`Instagram API Error: ${mediaResponse.status}`);
      }

      const mediaData = await mediaResponse.json();

      return mediaData.data.map((post: any) => ({
        id: post.id,
        platform: 'instagram' as const,
        creatorId: userData.id,
        creatorHandle: username,
        creatorName: username,
        creatorAvatar: userData.profile_picture_url,
        content: post.caption || '',
        mediaUrls: [post.media_url],
        thumbnailUrl: post.thumbnail_url || post.media_url,
        engagement: {
          likes: post.like_count || 0,
          comments: post.comments_count || 0,
          shares: 0, // Instagram doesn't provide share count via API
        },
        publishedAt: post.timestamp,
        url: post.permalink,
        tipEnabled: true,
        totalTips: 0,
        tags: this.extractHashtags(post.caption || ''),
      }));
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      throw error;
    }
  }

  // TikTok Integration
  async getTikTokPosts(username: string, count: number = 10): Promise<SocialMediaPost[]> {
    try {
      // Note: TikTok API requires business account and specific permissions
      // This is a simplified implementation
      const response = await fetch(
        `https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.tiktok.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`TikTok API Error: ${response.status}`);
      }

      const userData = await response.json();

      // Get user's videos (simplified - would need proper TikTok API access)
      return [{
        id: 'tiktok-placeholder',
        platform: 'tiktok' as const,
        creatorId: userData.data.open_id,
        creatorHandle: username,
        creatorName: userData.data.display_name,
        creatorAvatar: userData.data.avatar_url,
        content: 'TikTok video content',
        mediaUrls: [],
        engagement: {
          likes: userData.data.likes_count,
          comments: 0,
          shares: 0,
          views: 0,
        },
        publishedAt: new Date().toISOString(),
        url: userData.data.profile_deep_link,
        tipEnabled: true,
        totalTips: 0,
        tags: [],
      }];
    } catch (error) {
      console.error('Error fetching TikTok posts:', error);
      throw error;
    }
  }

  // Farcaster Integration
  async getFarcasterPosts(username: string, count: number = 10): Promise<SocialMediaPost[]> {
    try {
      const response = await fetch(
        `${this.config.farcaster.baseUrl}/v1/casts?fid=${username}&limit=${count}`,
        {
          headers: {
            'Authorization': this.config.farcaster.apiKey ? `Bearer ${this.config.farcaster.apiKey}` : '',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Farcaster API Error: ${response.status}`);
      }

      const data = await response.json();

      return data.casts.map((cast: any) => ({
        id: cast.hash,
        platform: 'farcaster' as const,
        creatorId: cast.author.fid,
        creatorHandle: cast.author.username,
        creatorName: cast.author.displayName,
        creatorAvatar: cast.author.pfp?.url,
        content: cast.text,
        mediaUrls: cast.embeds?.map((embed: any) => embed.url).filter(Boolean) || [],
        engagement: {
          likes: cast.reactions?.likes?.length || 0,
          comments: cast.replies?.count || 0,
          shares: cast.reactions?.recasts?.length || 0,
        },
        publishedAt: new Date(cast.timestamp * 1000).toISOString(),
        url: `https://warpcast.com/${cast.author.username}/${cast.hash}`,
        tipEnabled: true,
        totalTips: 0,
        tags: this.extractHashtags(cast.text),
      }));
    } catch (error) {
      console.error('Error fetching Farcaster posts:', error);
      throw error;
    }
  }

  // Universal method to get posts from any platform
  async getSocialMediaPosts(
    platform: 'twitter' | 'instagram' | 'tiktok' | 'farcaster',
    username: string,
    count: number = 10
  ): Promise<SocialMediaPost[]> {
    switch (platform) {
      case 'twitter':
        return this.getTwitterPosts(username, count);
      case 'instagram':
        return this.getInstagramPosts(username, count);
      case 'tiktok':
        return this.getTikTokPosts(username, count);
      case 'farcaster':
        return this.getFarcasterPosts(username, count);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Get posts from multiple platforms for a creator
  async getMultiPlatformPosts(
    creatorHandles: {
      twitter?: string;
      instagram?: string;
      tiktok?: string;
      farcaster?: string;
    },
    countPerPlatform: number = 5
  ): Promise<SocialMediaPost[]> {
    const allPosts: SocialMediaPost[] = [];

    const promises = Object.entries(creatorHandles).map(async ([platform, username]) => {
      if (username) {
        try {
          const posts = await this.getSocialMediaPosts(
            platform as any,
            username,
            countPerPlatform
          );
          allPosts.push(...posts);
        } catch (error) {
          console.error(`Error fetching ${platform} posts:`, error);
        }
      }
    });

    await Promise.all(promises);

    // Sort by published date (newest first)
    return allPosts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  // Helper method to extract hashtags from content
  private extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    return content.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
  }

  // Webhook handlers for real-time updates
  async handleTwitterWebhook(payload: any): Promise<void> {
    // Handle Twitter webhook events
    console.log('Twitter webhook received:', payload);
  }

  async handleInstagramWebhook(payload: any): Promise<void> {
    // Handle Instagram webhook events
    console.log('Instagram webhook received:', payload);
  }

  async handleFarcasterWebhook(payload: any): Promise<void> {
    // Handle Farcaster webhook events
    console.log('Farcaster webhook received:', payload);
  }
}

// Create singleton instance
export const socialMediaApi = new SocialMediaApiService({
  twitter: {
    apiKey: process.env.TWITTER_API_KEY || '',
    apiSecret: process.env.TWITTER_API_SECRET || '',
    bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
    clientId: process.env.TWITTER_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  },
  instagram: {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
    appId: process.env.INSTAGRAM_APP_ID || '',
    appSecret: process.env.INSTAGRAM_APP_SECRET || '',
  },
  tiktok: {
    clientKey: process.env.TIKTOK_CLIENT_KEY || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    accessToken: process.env.TIKTOK_ACCESS_TOKEN || '',
  },
  farcaster: {
    apiKey: process.env.FARCASTER_API_KEY || '',
    baseUrl: process.env.FARCASTER_BASE_URL || 'https://api.farcaster.xyz',
  },
}); 