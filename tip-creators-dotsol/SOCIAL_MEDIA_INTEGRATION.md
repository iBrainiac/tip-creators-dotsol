# Social Media Integration Guide

This guide explains how to integrate social media posts from various platforms (Twitter, Instagram, TikTok, Farcaster) into your SolCreator tipping platform.

## Overview

The social media integration allows users to:
- View posts from multiple platforms in a unified feed
- Tip creators directly on their social media posts
- Track engagement and tipping history across platforms
- Receive real-time updates via webhooks

## Supported Platforms

### 1. Twitter/X
- **API Version**: Twitter API v2
- **Features**: Tweets, media, engagement metrics
- **Rate Limits**: 300 requests per 15 minutes (v2)
- **Authentication**: OAuth 2.0 with Bearer Token

### 2. Instagram
- **API Version**: Instagram Basic Display API & Graph API
- **Features**: Posts, stories, engagement metrics
- **Rate Limits**: 200 requests per hour
- **Authentication**: Access Token via Facebook App

### 3. TikTok
- **API Version**: TikTok for Developers API
- **Features**: Videos, user info, engagement metrics
- **Rate Limits**: Varies by endpoint
- **Authentication**: OAuth 2.0 with Client Credentials

### 4. Farcaster
- **API Version**: Farcaster API v1
- **Features**: Casts, user profiles, engagement
- **Rate Limits**: No strict limits (decentralized)
- **Authentication**: Optional API key

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your API keys:

```bash
cd backend
cp env.example .env
```

Edit `.env` with your actual API credentials:

```env
# Twitter/X API Configuration
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here

# Instagram API Configuration
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here

# TikTok API Configuration
TIKTOK_CLIENT_KEY=your_tiktok_client_key_here
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret_here
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token_here

# Farcaster API Configuration
FARCASTER_API_KEY=your_farcaster_api_key_here
FARCASTER_BASE_URL=https://api.farcaster.xyz
```

### 2. API Key Setup

#### Twitter/X API Setup
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Apply for Elevated access (required for v2 API)
4. Generate Bearer Token
5. Set up OAuth 2.0 credentials

#### Instagram API Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Instagram Basic Display product
4. Configure OAuth redirect URIs
5. Generate access token

#### TikTok API Setup
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app
3. Configure app permissions
4. Generate client credentials
5. Set up OAuth flow

#### Farcaster API Setup
1. Go to [Farcaster API](https://api.farcaster.xyz/)
2. Optional: Generate API key for higher rate limits
3. No authentication required for basic usage

### 3. Backend Setup

Install dependencies and start the server:

```bash
cd backend
npm install
npm start
```

The server will be available at `http://localhost:3001`

### 4. Frontend Integration

The social media integration is already integrated into the React Native app. Key components:

- `SocialMediaPostCard`: Displays individual posts
- `SocialFeedScreen`: Main feed screen
- `socialMediaApi`: API service for fetching posts

## API Endpoints

### Social Media Posts

```typescript
// Get social media posts
GET /api/social-posts?platform=twitter&limit=20&page=1

// Create social media post
POST /api/social-posts
{
  "platform": "twitter",
  "creatorId": "123",
  "content": "Post content",
  "mediaUrls": ["https://example.com/image.jpg"],
  "engagement": { "likes": 100, "comments": 10, "shares": 5 },
  "url": "https://twitter.com/user/status/123",
  "tags": ["crypto", "solana"]
}

// Update post tips
PUT /api/social-posts/:id/tips
{
  "amount": 1000
}

// Get creator's social posts
GET /api/creators/:id/social-posts
```

### Webhook Endpoints

```typescript
// Twitter webhook
POST /api/webhooks/twitter

// Instagram webhook
POST /api/webhooks/instagram

// Farcaster webhook
POST /api/webhooks/farcaster
```

## Usage Examples

### Fetching Posts from Multiple Platforms

```typescript
import { socialMediaApi } from '../services/social-media-api';

// Get posts from all platforms
const allPosts = await socialMediaApi.getMultiPlatformPosts({
  twitter: 'elonmusk',
  instagram: 'cristiano',
  tiktok: 'charlidamelio',
  farcaster: 'dwr'
}, 5);

// Get posts from specific platform
const twitterPosts = await socialMediaApi.getSocialMediaPosts('twitter', 'elonmusk', 10);
```

### Displaying Posts in React Native

```typescript
import { SocialMediaPostCard } from '../components/social-media/social-media-post-card';

const MyComponent = () => {
  const handleTip = (post) => {
    // Navigate to tipping screen
    router.push({
      pathname: '/(tabs)/tip',
      params: {
        creatorId: post.creatorId,
        contentId: post.id,
        platform: post.platform
      }
    });
  };

  return (
    <SocialMediaPostCard
      post={post}
      onTip={handleTip}
      onView={(post) => console.log('View post:', post)}
    />
  );
};
```

## Webhook Configuration

### Twitter Webhooks
1. Set up webhook URL in Twitter Developer Portal
2. Configure webhook to listen for:
   - Tweet events
   - User events
   - Media events

### Instagram Webhooks
1. Configure webhook in Facebook App
2. Subscribe to:
   - `instagram_basic` events
   - `instagram_manage_insights` events

### Farcaster Webhooks
1. Set up webhook endpoint
2. Listen for cast events
3. Process real-time updates

## Data Models

### SocialMediaPost Interface

```typescript
interface SocialMediaPost {
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
```

## Rate Limiting & Best Practices

### Rate Limits
- **Twitter**: 300 requests per 15 minutes
- **Instagram**: 200 requests per hour
- **TikTok**: Varies by endpoint
- **Farcaster**: No strict limits

### Caching Strategy
- Cache posts for 5-15 minutes
- Use Redis or in-memory cache
- Implement exponential backoff for rate limits

### Error Handling
- Handle API failures gracefully
- Implement retry logic
- Show user-friendly error messages

## Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Monitor API usage

### Data Privacy
- Respect platform privacy policies
- Implement data retention policies
- Handle user consent appropriately

## Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**
   - Implement caching
   - Use exponential backoff
   - Monitor API usage

2. **Authentication Errors**
   - Verify API keys
   - Check token expiration
   - Validate OAuth flow

3. **Webhook Failures**
   - Verify webhook URL
   - Check SSL certificates
   - Monitor webhook logs

### Debug Mode

Enable debug logging:

```typescript
// In social-media-api.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('API Request:', endpoint, options);
}
```

## Production Deployment

### Environment Variables
- Set all required API keys
- Configure production database
- Set up monitoring and logging

### Scaling Considerations
- Use load balancers
- Implement caching layers
- Monitor API rate limits
- Set up alerting

### Monitoring
- Track API response times
- Monitor error rates
- Set up webhook health checks
- Log user interactions

## Support & Resources

### Documentation
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [TikTok for Developers](https://developers.tiktok.com/)
- [Farcaster API](https://api.farcaster.xyz/)

### Community
- Join our Discord for support
- Check GitHub issues
- Review API documentation

## License

This integration is part of the SolCreator project and follows the same license terms. 