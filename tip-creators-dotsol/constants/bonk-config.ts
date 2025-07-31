// BONK Token Configuration
export const BONK_TOKEN_CONFIG = {
  // BONK token mint address on Solana mainnet
  MINT_ADDRESS: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  
  // BONK token decimals
  DECIMALS: 5,
  
  // Minimum tip amount in BONK (1 BONK)
  MIN_TIP_AMOUNT: 1,
  
  // Maximum tip amount in BONK (1,000,000 BONK)
  MAX_TIP_AMOUNT: 1000000,
  
  // Default tip amounts for quick selection
  DEFAULT_TIP_AMOUNTS: [1, 10, 100, 1000, 10000],
};

// App Configuration
export const APP_CONFIG = {
  // App name
  NAME: 'SolCreator',
  
  // App description
  DESCRIPTION: 'Decentralized Social Tipping Platform',
  
  // Solana network configuration
  SOLANA_NETWORK: 'devnet', // Change to 'mainnet-beta' for production
  
  // RPC endpoint
  RPC_ENDPOINT: 'https://api.devnet.solana.com',
  
  // Helius API endpoint for off-chain data
  HELIUS_API_ENDPOINT: 'https://api.helius.xyz/v0',
  
  // Vibe score configuration
  VIBE_SCORE: {
    // Points earned for upvoting a tipped post
    UPVOTE_REWARD: 1,
    
    // Points earned for tipping
    TIP_REWARD: 5,
    
    // Minimum points needed to earn BONK rewards
    MIN_POINTS_FOR_REWARD: 10,
    
    // BONK reward per 10 points
    BONK_PER_POINTS: 1,
  },
  
  // Leaderboard configuration
  LEADERBOARD: {
    // Number of top tippers to display
    TOP_TIPPERS_COUNT: 10,
    
    // Number of top creators to display
    TOP_CREATORS_COUNT: 10,
    
    // Reward tiers for top tippers (in BONK)
    REWARD_TIERS: {
      1: 1000,  // 1st place: 1000 BONK
      2: 500,   // 2nd place: 500 BONK
      3: 250,   // 3rd place: 250 BONK
    },
  },
};

// UI Configuration
export const UI_CONFIG = {
  // Color scheme
  COLORS: {
    PRIMARY: '#FF6B35',      // BONK orange
    SECONDARY: '#FFD700',    // Gold
    BACKGROUND: '#FFFFFF',
    BACKGROUND_DARK: '#1A1A1A',
    TEXT: '#333333',
    TEXT_DARK: '#FFFFFF',
    SUCCESS: '#4CAF50',
    ERROR: '#F44336',
    WARNING: '#FF9800',
  },
  
  // Animation durations
  ANIMATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Spacing
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
};

// Feature flags
export const FEATURES = {
  NFC_TIPPING: true,
  QR_SCANNING: true,
  VIBE_SCORE: true,
  LEADERBOARD: true,
  CREATOR_PROFILES: true,
}; 