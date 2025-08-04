const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store (replace with database in production)
let creators = [
  {
    id: '1',
    name: 'CryptoArtist',
    handle: '@cryptoartist',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Digital artist creating unique NFT collections on Solana',
    walletAddress: 'CryptoArtist123456789',
    totalTips: 50000,
    followers: 1200,
    isOnline: true,
    tags: ['NFT', 'Art', 'Digital'],
    socialLinks: {
      twitter: 'https://twitter.com/cryptoartist',
      instagram: 'https://instagram.com/cryptoartist',
      website: 'https://cryptoartist.com'
    },
    createdAt: '2024-01-15T10:00:00Z',
    lastActive: '2024-08-02T14:30:00Z'
  },
  {
    id: '2',
    name: 'SolanaDev',
    handle: '@solanadev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Building the future of DeFi on Solana blockchain',
    walletAddress: 'SolanaDev987654321',
    totalTips: 75000,
    followers: 2500,
    isOnline: false,
    tags: ['DeFi', 'Development', 'Solana'],
    socialLinks: {
      twitter: 'https://twitter.com/solanadev',
      github: 'https://github.com/solanadev',
      website: 'https://solanadev.com'
    },
    createdAt: '2024-02-20T15:30:00Z',
    lastActive: '2024-08-02T12:15:00Z'
  },
  {
    id: '3',
    name: 'BONKMaster',
    handle: '@bonkmaster',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'BONK enthusiast and community builder extraordinaire',
    walletAddress: 'BONKMaster456789123',
    totalTips: 100000,
    followers: 5000,
    isOnline: true,
    tags: ['BONK', 'Community', 'Memes'],
    socialLinks: {
      twitter: 'https://twitter.com/bonkmaster',
      discord: 'https://discord.gg/bonk',
      website: 'https://bonkmaster.com'
    },
    createdAt: '2024-03-10T09:15:00Z',
    lastActive: '2024-08-02T14:45:00Z'
  },
  {
    id: '4',
    name: 'Web3Creator',
    handle: '@web3creator',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Creating content about Web3 and blockchain technology',
    walletAddress: 'Web3Creator789123456',
    totalTips: 30000,
    followers: 800,
    isOnline: true,
    tags: ['Web3', 'Education', 'Content'],
    socialLinks: {
      twitter: 'https://twitter.com/web3creator',
      youtube: 'https://youtube.com/web3creator',
      website: 'https://web3creator.com'
    },
    createdAt: '2024-04-05T11:20:00Z',
    lastActive: '2024-08-02T14:20:00Z'
  }
];

let tips = [
  {
    id: '1',
    creatorId: '1',
    tipperId: 'user123',
    amount: 1000,
    message: 'Amazing artwork!',
    timestamp: '2024-08-02T14:30:00Z',
    transactionHash: 'tx_hash_123'
  },
  {
    id: '2',
    creatorId: '2',
    tipperId: 'user456',
    amount: 500,
    message: 'Great tutorial!',
    timestamp: '2024-08-02T13:45:00Z',
    transactionHash: 'tx_hash_456'
  }
];

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all creators
app.get('/api/creators', (req, res) => {
  const { page = 1, limit = 10, search, tag, sortBy = 'totalTips', order = 'desc' } = req.query;
  
  let filteredCreators = [...creators];
  
  // Search by name, handle, or bio
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCreators = filteredCreators.filter(creator => 
      creator.name.toLowerCase().includes(searchLower) ||
      creator.handle.toLowerCase().includes(searchLower) ||
      creator.bio.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by tag
  if (tag) {
    filteredCreators = filteredCreators.filter(creator => 
      creator.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }
  
  // Sort
  filteredCreators.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (order === 'desc') {
      return bValue - aValue;
    }
    return aValue - bValue;
  });
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedCreators = filteredCreators.slice(startIndex, endIndex);
  
  res.json({
    creators: paginatedCreators,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredCreators.length,
      totalPages: Math.ceil(filteredCreators.length / limit)
    }
  });
});

// Get creator by ID
app.get('/api/creators/:id', (req, res) => {
  const creator = creators.find(c => c.id === req.params.id);
  
  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  
  // Get creator's tips
  const creatorTips = tips.filter(tip => tip.creatorId === req.params.id);
  
  res.json({
    ...creator,
    tips: creatorTips
  });
});

// Get creator details (without tips) for tip screen
app.get('/api/creators/:id/details', (req, res) => {
  const creator = creators.find(c => c.id === req.params.id);
  
  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  
  res.json(creator);
});

// Create new creator
app.post('/api/creators', (req, res) => {
  const { name, handle, bio, walletAddress, avatar, tags, socialLinks } = req.body;
  
  // Validation
  if (!name || !handle || !bio || !walletAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Check if handle already exists
  if (creators.find(c => c.handle === handle)) {
    return res.status(409).json({ error: 'Handle already exists' });
  }
  
  const newCreator = {
    id: Date.now().toString(),
    name,
    handle,
    bio,
    walletAddress,
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    totalTips: 0,
    followers: 0,
    isOnline: true,
    tags: tags || [],
    socialLinks: socialLinks || {},
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
  
  creators.push(newCreator);
  
  res.status(201).json(newCreator);
});

// Update creator
app.put('/api/creators/:id', (req, res) => {
  const creatorIndex = creators.findIndex(c => c.id === req.params.id);
  
  if (creatorIndex === -1) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  
  const updatedCreator = { ...creators[creatorIndex], ...req.body };
  creators[creatorIndex] = updatedCreator;
  
  res.json(updatedCreator);
});

// Record a tip
app.post('/api/tips', (req, res) => {
  const { creatorId, tipperId, amount, message, transactionHash } = req.body;
  
  if (!creatorId || !tipperId || !amount || !transactionHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const creator = creators.find(c => c.id === creatorId);
  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  
  const newTip = {
    id: Date.now().toString(),
    creatorId,
    tipperId,
    amount: parseInt(amount),
    message: message || '',
    timestamp: new Date().toISOString(),
    transactionHash
  };
  
  tips.push(newTip);
  
  // Update creator's total tips
  creator.totalTips += parseInt(amount);
  creator.lastActive = new Date().toISOString();
  
  res.status(201).json(newTip);
});

// Get tips for a creator
app.get('/api/creators/:id/tips', (req, res) => {
  const creatorTips = tips.filter(tip => tip.creatorId === req.params.id);
  res.json(creatorTips);
});

// Get trending creators
app.get('/api/creators/trending', (req, res) => {
  const trendingCreators = creators
    .sort((a, b) => b.totalTips - a.totalTips)
    .slice(0, 10);
  
  res.json(trendingCreators);
});

// Get online creators
app.get('/api/creators/online', (req, res) => {
  const onlineCreators = creators.filter(creator => creator.isOnline);
  res.json(onlineCreators);
});

// Search creators
app.get('/api/creators/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const searchResults = creators.filter(creator => 
    creator.name.toLowerCase().includes(query) ||
    creator.handle.toLowerCase().includes(query) ||
    creator.bio.toLowerCase().includes(query) ||
    creator.tags.some(tag => tag.toLowerCase().includes(query))
  );
  
  res.json(searchResults);
});

// Social Media Posts API
let socialMediaPosts = [
  // BONK Ecosystem Posts
  {
    id: '1',
    platform: 'twitter',
    creatorId: '3', // BONKMaster
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
    creatorId: '2', // SolanaDev
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
    creatorId: '1', // CryptoArtist
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
  },
  {
    id: '4',
    platform: 'farcaster',
    creatorId: '4', // Web3Creator
    content: '📚 New educational thread: "How to Build on Solana in 2024" 🧵\n\n1/10 Solana is the fastest blockchain with 65K TPS\n2/10 Rust programming language for smart contracts\n3/10 Low fees: $0.00025 per transaction\n4/10 Rich ecosystem of DeFi protocols\n5/10 Strong developer community\n\n#Solana #Web3 #Education',
    mediaUrls: [],
    engagement: { likes: 567, comments: 123, shares: 78 },
    url: 'https://warpcast.com/web3creator/0x123456789',
    tags: ['Solana', 'Web3', 'Education', 'Development'],
    tipEnabled: true,
    totalTips: 6500,
    publishedAt: '2024-08-02T11:15:00Z',
    createdAt: '2024-08-02T11:15:00Z'
  },
  {
    id: '5',
    platform: 'twitter',
    creatorId: '3', // BONKMaster
    content: '🐕 BONK holders, we\'re building something HUGE! Community-driven development is the future. Your feedback shapes our roadmap. What features do you want to see next? #BONK #Community #Solana',
    mediaUrls: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'],
    engagement: { likes: 3456, comments: 234, shares: 156 },
    url: 'https://twitter.com/bonkmaster/status/123456791',
    tags: ['BONK', 'Community', 'Solana'],
    tipEnabled: true,
    totalTips: 22000,
    publishedAt: '2024-08-02T10:30:00Z',
    createdAt: '2024-08-02T10:30:00Z'
  },
  {
    id: '6',
    platform: 'tiktok',
    creatorId: '1', // CryptoArtist
    content: '🎵 BONK anthem remix! The community asked, I delivered. This beat goes hard! 🎧 #BONK #Solana #Music #Crypto',
    mediaUrls: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=800&fit=crop'],
    engagement: { likes: 1234, comments: 89, shares: 234 },
    url: 'https://tiktok.com/@cryptoartist/video/123456789',
    tags: ['BONK', 'Solana', 'Music', 'Crypto'],
    tipEnabled: true,
    totalTips: 8900,
    publishedAt: '2024-08-02T09:45:00Z',
    createdAt: '2024-08-02T09:45:00Z'
  },
  {
    id: '7',
    platform: 'twitter',
    creatorId: '2', // SolanaDev
    content: '⚡ Solana transaction speed comparison:\n\nEthereum: 15 TPS\nSolana: 65,000 TPS\n\nThat\'s 4,333x faster! No wonder DeFi is migrating to Solana. The numbers don\'t lie. #Solana #DeFi #Performance',
    mediaUrls: ['https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=400&fit=crop'],
    engagement: { likes: 2156, comments: 145, shares: 89 },
    url: 'https://twitter.com/solanadev/status/123456792',
    tags: ['Solana', 'DeFi', 'Performance'],
    tipEnabled: true,
    totalTips: 11000,
    publishedAt: '2024-08-02T08:20:00Z',
    createdAt: '2024-08-02T08:20:00Z'
  },
  {
    id: '8',
    platform: 'instagram',
    creatorId: '4', // Web3Creator
    content: '🌅 Morning crypto fam! Just finished my daily Solana ecosystem research. The innovation happening here is incredible. From DeFi to NFTs to gaming - Solana has it all. What\'s your favorite Solana project? #Solana #Web3 #Crypto',
    mediaUrls: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=600&fit=crop'],
    engagement: { likes: 678, comments: 45, shares: 23 },
    url: 'https://instagram.com/p/123456790',
    tags: ['Solana', 'Web3', 'Crypto'],
    tipEnabled: true,
    totalTips: 4500,
    publishedAt: '2024-08-02T07:30:00Z',
    createdAt: '2024-08-02T07:30:00Z'
  },
  {
    id: '9',
    platform: 'farcaster',
    creatorId: '3', // BONKMaster
    content: '🎯 BONK price prediction thread 🧵\n\nBased on current market analysis and community growth:\n\nQ4 2024: $0.00005\nQ1 2025: $0.00008\nQ2 2025: $0.00012\n\nRemember: DYOR! This is not financial advice. #BONK #Solana #Crypto',
    mediaUrls: [],
    engagement: { likes: 1890, comments: 267, shares: 145 },
    url: 'https://warpcast.com/bonkmaster/0x123456790',
    tags: ['BONK', 'Solana', 'Crypto', 'Analysis'],
    tipEnabled: true,
    totalTips: 18000,
    publishedAt: '2024-08-02T06:15:00Z',
    createdAt: '2024-08-02T06:15:00Z'
  },
  {
    id: '10',
    platform: 'twitter',
    creatorId: '1', // CryptoArtist
    content: '🎨 Just sold my first BONK-themed NFT for 50,000 BONK! The community support is amazing. Thank you all for believing in my art. More collections coming soon! #NFT #BONK #Solana #Art',
    mediaUrls: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'],
    engagement: { likes: 1567, comments: 98, shares: 67 },
    url: 'https://twitter.com/cryptoartist/status/123456793',
    tags: ['NFT', 'BONK', 'Solana', 'Art'],
    tipEnabled: true,
    totalTips: 13500,
    publishedAt: '2024-08-02T05:45:00Z',
    createdAt: '2024-08-02T05:45:00Z'
  }
];

// Content API
let contentItems = [
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
];

// Get social media posts
app.get('/api/social-posts', (req, res) => {
  const { platform, creatorId, limit = 20, page = 1 } = req.query;
  
  let filteredPosts = [...socialMediaPosts];
  
  if (platform) {
    filteredPosts = filteredPosts.filter(post => post.platform === platform);
  }
  
  if (creatorId) {
    filteredPosts = filteredPosts.filter(post => post.creatorId === creatorId);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  res.json({
    posts: paginatedPosts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit)
    }
  });
});

// Get content
app.get('/api/content', (req, res) => {
  const { creatorId, type, limit = 20, page = 1 } = req.query;
  
  let filteredContent = [...contentItems];
  
  if (creatorId) {
    filteredContent = filteredContent.filter(item => item.creatorId === creatorId);
  }
  
  if (type) {
    filteredContent = filteredContent.filter(item => item.type === type);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedContent = filteredContent.slice(startIndex, endIndex);
  
  res.json({
    content: paginatedContent,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredContent.length,
      totalPages: Math.ceil(filteredContent.length / limit)
    }
  });
});

// Get content by ID
app.get('/api/content/:id', (req, res) => {
  const content = contentItems.find(item => item.id === req.params.id);
  
  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }
  
  res.json(content);
});

// Get creator content
app.get('/api/creators/:id/content', (req, res) => {
  const creatorContent = contentItems.filter(item => item.creatorId === req.params.id);
  res.json(creatorContent);
});

// Add social media post
app.post('/api/social-posts', (req, res) => {
  const { platform, creatorId, content, mediaUrls, engagement, url, tags } = req.body;
  
  if (!platform || !creatorId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newPost = {
    id: Date.now().toString(),
    platform,
    creatorId,
    content,
    mediaUrls: mediaUrls || [],
    engagement: engagement || { likes: 0, comments: 0, shares: 0 },
    url,
    tags: tags || [],
    tipEnabled: true,
    totalTips: 0,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  
  socialMediaPosts.push(newPost);
  
  res.status(201).json(newPost);
});

// Update social media post tips
app.put('/api/social-posts/:id/tips', (req, res) => {
  const { amount } = req.body;
  const postIndex = socialMediaPosts.findIndex(post => post.id === req.params.id);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  socialMediaPosts[postIndex].totalTips += parseInt(amount);
  
  res.json(socialMediaPosts[postIndex]);
});

// Get social media posts by creator
app.get('/api/creators/:id/social-posts', (req, res) => {
  const creatorPosts = socialMediaPosts.filter(post => post.creatorId === req.params.id);
  res.json(creatorPosts);
});

// Webhook endpoints for social media platforms
app.post('/api/webhooks/twitter', (req, res) => {
  console.log('Twitter webhook received:', req.body);
  // Handle Twitter webhook events
  res.status(200).json({ status: 'ok' });
});

app.post('/api/webhooks/instagram', (req, res) => {
  console.log('Instagram webhook received:', req.body);
  // Handle Instagram webhook events
  res.status(200).json({ status: 'ok' });
});

app.post('/api/webhooks/farcaster', (req, res) => {
  console.log('Farcaster webhook received:', req.body);
  // Handle Farcaster webhook events
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 SolCreator Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Creators API: http://localhost:${PORT}/api/creators`);
  console.log(`📱 Social Posts API: http://localhost:${PORT}/api/social-posts`);
}); 