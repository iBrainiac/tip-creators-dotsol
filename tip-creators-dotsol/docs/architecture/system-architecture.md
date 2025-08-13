# System Architecture

## 🏗️ Overview

SolCreator is built as a modern, decentralized application with a three-tier architecture consisting of a mobile frontend, RESTful backend API, and Solana blockchain layer. This architecture ensures scalability, security, and a seamless user experience.

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SolCreator System                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   Mobile App    │    │   Backend API   │    │ Solana Chain │ │
│  │  (React Native) │◄──►│  (Node.js/Exp)  │◄──►│  (Smart      │ │
│  │                 │    │                 │    │   Contract)  │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                       │     │
│           │                       │                       │     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │ Social Media    │    │   Database      │    │   BONK       │ │
│  │ APIs (Twitter,  │    │  (Optional)     │    │   Token      │ │
│  │ Instagram, etc) │    │                 │    │   Mint       │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. User Authentication Flow
```
User → Mobile App → Solana Wallet → Blockchain Verification → Backend API → User Session
```

### 2. Tipping Flow
```
User → Mobile App → Backend API → Solana Program → BONK Transfer → Blockchain Confirmation → Backend Update → Mobile App Update
```

### 3. Social Media Integration Flow
```
Social Platform → Webhook → Backend API → Database → Mobile App → User Interface
```

## 📱 Frontend Layer (Mobile App)

### Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Query + Context API
- **UI Components**: Custom components + React Native primitives
- **Wallet Integration**: Solana Mobile Wallet Adapter

### Key Components

#### Core Screens
```
app/
├── (tabs)/
│   ├── home.tsx          # Creator discovery
│   ├── tip.tsx           # Tipping interface
│   ├── social-feed.tsx   # Social media feed
│   ├── content.tsx       # Content management
│   ├── vibe-score.tsx    # Gamification
│   ├── qr-scanner.tsx    # QR code scanning
│   └── settings/         # User settings
├── sign-in.tsx           # Authentication
├── role-selection.tsx    # User role selection
└── _layout.tsx           # Root layout
```

#### Shared Components
```
components/
├── ui/                   # Reusable UI components
├── wallet-status.tsx     # Wallet connection status
├── wallet-balance.tsx    # BONK balance display
├── creator-card.tsx      # Creator profile cards
└── social-media/         # Social media components
```

#### Services
```
services/
├── api.ts               # Backend API client
├── solana.ts            # Solana blockchain interactions
├── wallet.ts            # Wallet management
└── social-media-api.ts  # Social platform integrations
```

### State Management Architecture

```typescript
// Global State Structure
interface AppState {
  // Wallet State
  wallet: {
    connected: boolean;
    publicKey: string | null;
    balance: number;
  };
  
  // User State
  user: {
    id: string;
    vibeScore: number;
    level: number;
    totalTips: number;
  };
  
  // Creator State
  creators: {
    list: Creator[];
    selected: Creator | null;
    filters: FilterOptions;
  };
  
  // Social Media State
  socialMedia: {
    posts: SocialMediaPost[];
    platforms: Platform[];
  };
}
```

## 🔧 Backend Layer (API Server)

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript/TypeScript
- **API Design**: RESTful
- **Authentication**: JWT (optional)
- **Rate Limiting**: Express Rate Limit
- **CORS**: Cross-Origin Resource Sharing

### API Structure

#### Core Endpoints
```
/api/
├── health              # Health check
├── creators/           # Creator management
│   ├── GET /          # List creators
│   ├── GET /:id       # Get creator
│   ├── POST /         # Create creator
│   ├── PUT /:id       # Update creator
│   └── GET /trending  # Trending creators
├── tips/              # Tip management
│   ├── POST /         # Record tip
│   └── GET /:id       # Get tip history
└── social-posts/      # Social media posts
    ├── GET /          # List posts
    └── POST /         # Create post
```

#### Social Media Integration
```
/api/
├── webhooks/
│   ├── twitter        # Twitter webhook
│   ├── instagram      # Instagram webhook
│   ├── tiktok         # TikTok webhook
│   └── farcaster      # Farcaster webhook
└── social-media/
    ├── posts          # Social media posts
    ├── creators       # Creator social profiles
    └── analytics      # Engagement analytics
```

### Data Models

#### Creator Model
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

#### Tip Model
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

### Middleware Stack

```javascript
// Middleware Pipeline
app.use(cors());                    // CORS handling
app.use(helmet());                  // Security headers
app.use(express.json());            // JSON parsing
app.use(rateLimit());               // Rate limiting
app.use(compression());             // Response compression
app.use('/api', apiRoutes);         // API routes
app.use(errorHandler);              // Error handling
```

## ⛓️ Blockchain Layer (Solana Program)

### Technology Stack
- **Framework**: Anchor
- **Language**: Rust
- **Blockchain**: Solana
- **Token**: BONK (SPL Token)
- **State Management**: Program Derived Addresses (PDAs)

### Program Structure

#### Core Instructions
```rust
// Program Instructions
pub mod solcreator_program {
    // Initialize program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()>
    
    // User management
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()>
    
    // Tipping system
    pub fn record_tip(ctx: Context<RecordTip>, amount: u64, reference: String) -> Result<()>
    
    // Gamification
    pub fn record_upvote(ctx: Context<RecordUpvote>, creator: Pubkey, post_id: String) -> Result<()>
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()>
    
    // Administration
    pub fn update_config(ctx: Context<UpdateConfig>, new_authority: Option<Pubkey>) -> Result<()>
}
```

#### Account Structures
```rust
// Global State Account
#[account]
pub struct GlobalState {
    pub authority: Pubkey,
    pub bonk_mint: Pubkey,
    pub total_tips_sent: u64,
    pub total_bonk_tipped: u64,
    pub total_vibe_points_distributed: u64,
    pub bump: u8,
}

// User State Account
#[account]
pub struct UserState {
    pub user: Pubkey,
    pub vibe_points: u64,
    pub total_bonk_earned: u64,
    pub total_tips_sent: u64,
    pub total_upvotes: u64,
    pub level: u64,
    pub bump: u8,
}
```

### Program Derived Addresses (PDAs)

```rust
// Global State PDA
seeds = [b"global_state"]

// User State PDA
seeds = [b"user_state", user.key().as_ref()]
```

## 🔗 Integration Points

### 1. Frontend ↔ Backend
- **RESTful API**: HTTP/JSON communication
- **Real-time Updates**: WebSocket connections (future)
- **Authentication**: JWT tokens
- **Error Handling**: Standardized error responses

### 2. Backend ↔ Blockchain
- **Solana Web3.js**: Direct blockchain interaction
- **Transaction Signing**: User wallet integration
- **Event Listening**: Program event monitoring
- **State Synchronization**: On-chain state updates

### 3. Social Media ↔ Backend
- **Webhooks**: Real-time social media updates
- **API Integration**: Platform-specific APIs
- **Data Normalization**: Unified data format
- **Rate Limiting**: Platform-specific limits

## 🔒 Security Architecture

### Authentication & Authorization
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │───►│   Backend API   │───►│  Solana Wallet  │
│                 │    │                 │    │                 │
│ • JWT Tokens    │    │ • API Keys      │    │ • Keypair       │
│ • Biometric     │    │ • Rate Limiting │    │ • Signing       │
│ • Session Mgmt  │    │ • CORS          │    │ • Verification  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Security
- **Encryption**: HTTPS/TLS for all communications
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection**: Parameterized queries (if using database)
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Token-based CSRF protection

### Blockchain Security
- **Account Validation**: Comprehensive account checks
- **Authority Verification**: Proper authority validation
- **Reentrancy Protection**: Anchor framework protection
- **Overflow Protection**: Rust's built-in overflow protection

## 📊 Performance Architecture

### Caching Strategy
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Backend API   │    │   Blockchain    │
│                 │    │                 │    │                 │
│ • Local Cache   │    │ • Redis Cache   │    │ • On-chain      │
│ • AsyncStorage  │    │ • Memory Cache  │    │   State         │
│ • Image Cache   │    │ • CDN Cache     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Optimization Techniques
- **Lazy Loading**: Components and data loaded on demand
- **Image Optimization**: Compressed images and lazy loading
- **Bundle Splitting**: Code splitting for smaller bundles
- **Database Indexing**: Optimized queries (if using database)
- **CDN Usage**: Static asset delivery optimization

## 🔄 Scalability Considerations

### Horizontal Scaling
- **Load Balancing**: Multiple backend instances
- **Database Sharding**: Data distribution (if using database)
- **CDN Distribution**: Global content delivery
- **Microservices**: Service decomposition (future)

### Vertical Scaling
- **Resource Optimization**: Memory and CPU optimization
- **Connection Pooling**: Database connection management
- **Caching Layers**: Multi-level caching strategy
- **Compression**: Response compression

## 🚀 Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Dev     │    │   Local API     │    │   Devnet        │
│   (Expo)        │    │   (Node.js)     │    │   (Solana)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   App Store     │    │   Cloud API     │    │   Mainnet       │
│   (iOS/Android) │    │   (AWS/GCP)     │    │   (Solana)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔮 Future Architecture Enhancements

### Planned Improvements
- **WebSocket Integration**: Real-time updates
- **Microservices**: Service decomposition
- **GraphQL API**: Flexible data querying
- **Off-chain Storage**: IPFS integration
- **Cross-chain Support**: Multi-chain compatibility

### Scalability Roadmap
- **Database Integration**: PostgreSQL/MongoDB
- **Message Queues**: Redis/RabbitMQ
- **Monitoring**: Prometheus/Grafana
- **Logging**: ELK Stack
- **CI/CD**: Automated deployment pipeline

---

This architecture provides a solid foundation for a scalable, secure, and user-friendly decentralized tipping platform while maintaining flexibility for future enhancements and improvements.
