# SolCreator Backend API

A Node.js/Express backend API for the SolCreator tipping platform.

## Features

- **Creator Management**: CRUD operations for creators
- **Tip Recording**: Track BONK tips and transactions
- **Search & Filtering**: Advanced creator search and filtering
- **Real-time Updates**: Creator status and tip counts
- **RESTful API**: Clean, documented endpoints

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Development

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Production

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - API health status

### Creators
- `GET /api/creators` - Get all creators (with pagination, search, filtering)
- `GET /api/creators/:id` - Get creator by ID
- `POST /api/creators` - Create new creator
- `PUT /api/creators/:id` - Update creator
- `GET /api/creators/trending` - Get trending creators
- `GET /api/creators/online` - Get online creators
- `GET /api/creators/search/:query` - Search creators

### Tips
- `POST /api/tips` - Record a new tip
- `GET /api/creators/:id/tips` - Get tips for a creator

## Query Parameters

### Creators List
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in name, handle, or bio
- `tag` - Filter by tag
- `sortBy` - Sort field (totalTips, followers, createdAt)
- `order` - Sort order (asc, desc)

## Data Models

### Creator
```typescript
{
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
{
  id: string;
  creatorId: string;
  tipperId: string;
  amount: number;
  message: string;
  timestamp: string;
  transactionHash: string;
}
```

## Environment Variables

Create a `.env` file:

```env
PORT=3001
NODE_ENV=development
```

## Testing

```bash
npm test
```

## Production Deployment

1. Set environment variables
2. Install dependencies: `npm install --production`
3. Start server: `npm start`

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Authentication & authorization
- Real-time WebSocket updates
- Image upload for avatars
- Analytics and metrics
- Rate limiting
- Caching layer 