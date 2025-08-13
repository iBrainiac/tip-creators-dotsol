# Backend API Reference

## 🔗 Base URL
```
Development: http://localhost:3001
Production: https://api.solcreator.app
```

## 📋 Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 🏥 Health Check

### GET /health
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "version": "1.0.0"
}
```

## 👥 Creators

### GET /api/creators
Get all creators with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in name, handle, or bio
- `tag` (string): Filter by tag
- `sortBy` (string): Sort field (totalTips, followers, createdAt)
- `order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "creators": [
    {
      "id": "creator_123",
      "name": "John Doe",
      "handle": "@johndoe",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Content creator and developer",
      "walletAddress": "ABC123...",
      "totalTips": 50000,
      "followers": 1000,
      "isOnline": true,
      "tags": ["NFT", "Art", "Solana"],
      "socialLinks": {
        "twitter": "https://twitter.com/johndoe",
        "instagram": "https://instagram.com/johndoe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastActive": "2024-12-19T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### GET /api/creators/:id
Get creator by ID.

**Response:**
```json
{
  "id": "creator_123",
  "name": "John Doe",
  "handle": "@johndoe",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Content creator and developer",
  "walletAddress": "ABC123...",
  "totalTips": 50000,
  "followers": 1000,
  "isOnline": true,
  "tags": ["NFT", "Art", "Solana"],
  "socialLinks": {
    "twitter": "https://twitter.com/johndoe",
    "instagram": "https://instagram.com/johndoe"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastActive": "2024-12-19T10:30:00.000Z"
}
```

### GET /api/creators/trending
Get trending creators.

**Query Parameters:**
- `limit` (number): Number of creators (default: 10)

**Response:**
```json
{
  "creators": [
    {
      "id": "creator_123",
      "name": "John Doe",
      "handle": "@johndoe",
      "trendingScore": 95.5,
      "recentTips": 15000,
      "followerGrowth": 25
    }
  ]
}
```

### GET /api/creators/online
Get currently online creators.

**Response:**
```json
{
  "creators": [
    {
      "id": "creator_123",
      "name": "John Doe",
      "handle": "@johndoe",
      "lastActive": "2024-12-19T10:30:00.000Z"
    }
  ]
}
```

### POST /api/creators
Create a new creator.

**Request Body:**
```json
{
  "name": "John Doe",
  "handle": "@johndoe",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Content creator and developer",
  "walletAddress": "ABC123...",
  "tags": ["NFT", "Art", "Solana"],
  "socialLinks": {
    "twitter": "https://twitter.com/johndoe",
    "instagram": "https://instagram.com/johndoe"
  }
}
```

**Response:**
```json
{
  "id": "creator_123",
  "name": "John Doe",
  "handle": "@johndoe",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Content creator and developer",
  "walletAddress": "ABC123...",
  "totalTips": 0,
  "followers": 0,
  "isOnline": true,
  "tags": ["NFT", "Art", "Solana"],
  "socialLinks": {
    "twitter": "https://twitter.com/johndoe",
    "instagram": "https://instagram.com/johndoe"
  },
  "createdAt": "2024-12-19T10:30:00.000Z",
  "lastActive": "2024-12-19T10:30:00.000Z"
}
```

### PUT /api/creators/:id
Update creator information.

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "bio": "Updated bio",
  "tags": ["NFT", "Art", "Solana", "Web3"],
  "socialLinks": {
    "twitter": "https://twitter.com/johndoe",
    "instagram": "https://instagram.com/johndoe",
    "youtube": "https://youtube.com/johndoe"
  }
}
```

## 💰 Tips

### POST /api/tips
Record a new tip.

**Request Body:**
```json
{
  "creatorId": "creator_123",
  "tipperId": "tipper_456",
  "amount": 1000,
  "message": "Great content!",
  "transactionHash": "ABC123...",
  "platform": "twitter",
  "postId": "tweet_789"
}
```

**Response:**
```json
{
  "id": "tip_123",
  "creatorId": "creator_123",
  "tipperId": "tipper_456",
  "amount": 1000,
  "message": "Great content!",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "transactionHash": "ABC123...",
  "platform": "twitter",
  "postId": "tweet_789"
}
```

### GET /api/creators/:id/tips
Get tips for a specific creator.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "tips": [
    {
      "id": "tip_123",
      "tipperId": "tipper_456",
      "amount": 1000,
      "message": "Great content!",
      "timestamp": "2024-12-19T10:30:00.000Z",
      "transactionHash": "ABC123...",
      "platform": "twitter",
      "postId": "tweet_789"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## 📱 Social Media

### GET /api/social-posts
Get social media posts.

**Query Parameters:**
- `platform` (string): Platform filter (twitter, instagram, tiktok, farcaster)
- `creatorId` (string): Filter by creator
- `limit` (number): Number of posts (default: 20)
- `page` (number): Page number (default: 1)

**Response:**
```json
{
  "posts": [
    {
      "id": "post_123",
      "platform": "twitter",
      "creatorId": "creator_123",
      "creatorHandle": "@johndoe",
      "creatorName": "John Doe",
      "content": "Check out my latest NFT collection!",
      "mediaUrls": ["https://example.com/image.jpg"],
      "engagement": {
        "likes": 100,
        "comments": 10,
        "shares": 5
      },
      "publishedAt": "2024-12-19T10:30:00.000Z",
      "url": "https://twitter.com/johndoe/status/123",
      "tipEnabled": true,
      "totalTips": 5000,
      "tags": ["NFT", "Art"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### POST /api/social-posts
Create a social media post.

**Request Body:**
```json
{
  "platform": "twitter",
  "creatorId": "creator_123",
  "content": "Check out my latest NFT collection!",
  "mediaUrls": ["https://example.com/image.jpg"],
  "engagement": {
    "likes": 100,
    "comments": 10,
    "shares": 5
  },
  "url": "https://twitter.com/johndoe/status/123",
  "tags": ["NFT", "Art"]
}
```

## 🔗 Webhooks

### POST /api/webhooks/twitter
Twitter webhook endpoint for real-time updates.

### POST /api/webhooks/instagram
Instagram webhook endpoint for real-time updates.

### POST /api/webhooks/tiktok
TikTok webhook endpoint for real-time updates.

### POST /api/webhooks/farcaster
Farcaster webhook endpoint for real-time updates.

## 📊 Analytics

### GET /api/analytics/creator/:id
Get creator analytics.

**Response:**
```json
{
  "creatorId": "creator_123",
  "totalTips": 50000,
  "totalTippers": 150,
  "averageTipAmount": 333,
  "topTippers": [
    {
      "tipperId": "tipper_456",
      "totalAmount": 5000,
      "tipCount": 10
    }
  ],
  "platformBreakdown": {
    "twitter": 30000,
    "instagram": 15000,
    "tiktok": 5000
  },
  "monthlyTrends": [
    {
      "month": "2024-12",
      "tips": 5000,
      "amount": 15000
    }
  ]
}
```

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "details": {
    "field": "amount",
    "issue": "Must be a positive number"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Creator not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests, please try again later",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong on our end"
}
```

## 🔧 Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Social media endpoints**: 50 requests per 15 minutes
- **Webhook endpoints**: 1000 requests per 15 minutes

## 📝 Data Types

### Creator
```typescript
interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  walletAddress: string;
  totalTips: number;
  followers: number;
  isOnline: boolean;
  tags: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    github?: string;
    youtube?: string;
    discord?: string;
    website?: string;
  };
  createdAt: string;
  lastActive: string;
}
```

### Tip
```typescript
interface Tip {
  id: string;
  creatorId: string;
  tipperId: string;
  amount: number;
  message: string;
  timestamp: string;
  transactionHash: string;
  platform?: string;
  postId?: string;
}
```

### SocialMediaPost
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
