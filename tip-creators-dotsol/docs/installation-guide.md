# Installation Guide

This guide will walk you through setting up the complete SolCreator development environment, including the mobile app, backend API, and Solana smart contract.

## 📋 Prerequisites

### System Requirements
- **Operating System**: macOS, Windows, or Linux
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or yarn/pnpm)
- **Git**: Latest version
- **Mobile Device/Emulator**: iOS Simulator, Android Emulator, or physical device

### Solana Development Tools
- **Solana CLI**: Latest version
- **Anchor CLI**: Version 0.28.0 or higher
- **Rust**: Latest stable version
- **Solana Wallet**: Phantom, Solflare, or Backpack

### Mobile Development Tools
- **Expo CLI**: Latest version
- **Xcode**: For iOS development (macOS only)
- **Android Studio**: For Android development
- **Expo Go**: Mobile app for testing

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/solcreator.git
cd solcreator/tip-creators-dotsol
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install Solana program dependencies
cd solcreator_program
npm install
cargo build
cd ..
```

### 3. Environment Configuration

```bash
# Copy environment files
cp backend/env.example backend/.env
cp .env.example .env
```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend API
cd backend
npm run dev

# Terminal 2: Start mobile app
npm start
```

## 📱 Frontend Setup (Mobile App)

### 1. Install Expo CLI

```bash
npm install -g @expo/cli
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=http://localhost:3001
API_TIMEOUT=10000

# Solana Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
SOLANA_PROGRAM_ID=3CDmG5fSwYF4CUE86s32x9aNQwiSPvRt1B3bXPKnKerb

# Social Media API Keys (optional for development)
TWITTER_API_KEY=your_twitter_api_key
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
TIKTOK_CLIENT_KEY=your_tiktok_key
FARCASTER_API_KEY=your_farcaster_key

# App Configuration
APP_NAME=SolCreator
APP_VERSION=1.0.0
DEBUG_MODE=true
```

### 4. Start Development Server

```bash
# Start Expo development server
npm start

# Or use specific commands
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### 5. Mobile Device Setup

#### iOS Development
1. Install Xcode from the App Store
2. Open Xcode and install additional components
3. Start iOS Simulator: `npm run ios`

#### Android Development
1. Install Android Studio
2. Set up Android SDK and emulator
3. Start Android Emulator: `npm run android`

#### Physical Device
1. Install Expo Go from App Store/Play Store
2. Scan QR code from development server
3. App will load on your device

## 🔧 Backend Setup (API Server)

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081

# Database Configuration (if using)
DATABASE_URL=your_database_url

# Social Media API Keys
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_APP_ID=your_instagram_app_id

TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

FARCASTER_API_KEY=your_farcaster_api_key

# JWT Configuration (if implementing auth)
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

### 4. Start Development Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 5. Verify API is Running

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "version": "1.0.0"
}
```

## ⛓️ Solana Program Setup

### 1. Install Solana CLI

```bash
# macOS/Linux
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Windows
# Download from https://docs.solana.com/cli/install-solana-cli-tools

# Verify installation
solana --version
```

### 2. Install Anchor CLI

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### 3. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustc --version
```

### 4. Navigate to Program Directory

```bash
cd solcreator_program
```

### 5. Install Dependencies

```bash
npm install
cargo build
```

### 6. Configure Solana Network

```bash
# Set to devnet for development
solana config set --url devnet

# Or use localhost for local development
solana config set --url localhost

# Check current configuration
solana config get
```

### 7. Build and Deploy Program

```bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Or deploy to localhost
anchor deploy --provider.cluster localnet
```

### 8. Update Program ID

After deployment, update the program ID in:
- `Anchor.toml`
- `lib.rs` (declare_id! macro)
- Frontend configuration

## 🔑 API Key Setup

### Twitter/X API
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Apply for Elevated access
4. Generate Bearer Token
5. Add to `.env` file

### Instagram API
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Instagram Basic Display product
4. Configure OAuth redirect URIs
5. Generate access token

### TikTok API
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app
3. Configure app permissions
4. Generate client credentials

### Farcaster API
1. Go to [Farcaster API](https://api.farcaster.xyz/)
2. Optional: Generate API key for higher rate limits

## 🧪 Testing Setup

### 1. Frontend Testing

```bash
# Run TypeScript type checking
npm run type-check

# Run linting
npm run lint

# Run formatting check
npm run fmt:check
```

### 2. Backend Testing

```bash
cd backend

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### 3. Smart Contract Testing

```bash
cd solcreator_program

# Run Anchor tests
anchor test

# Run specific test file
anchor test --skip-lint tests/test_file.rs
```

## 🐳 Docker Setup (Optional)

### 1. Install Docker

Download and install Docker Desktop from [docker.com](https://www.docker.com/)

### 2. Build and Run with Docker

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up

# Run in background
docker-compose up -d
```

### 3. Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: .
    ports:
      - "8081:8081"
    environment:
      - EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
    volumes:
      - .:/app
      - /app/node_modules
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# Use nvm to switch versions
nvm install 18
nvm use 18
```

#### 2. Expo CLI Issues
```bash
# Clear Expo cache
expo r -c

# Reset Metro bundler
npx expo start --clear
```

#### 3. Solana CLI Issues
```bash
# Update Solana CLI
solana-install update

# Check Solana version
solana --version
```

#### 4. Anchor Build Issues
```bash
# Clean and rebuild
anchor clean
anchor build

# Update Anchor
avm install latest
avm use latest
```

#### 5. Port Conflicts
```bash
# Check what's using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Development Tips

1. **Use Multiple Terminals**: Keep frontend, backend, and blockchain in separate terminals
2. **Enable Debug Mode**: Set `DEBUG_MODE=true` in environment variables
3. **Use Hot Reload**: Both Expo and Node.js support hot reloading
4. **Monitor Logs**: Check console output for errors and warnings
5. **Test on Device**: Always test on physical device for best results

## 📚 Next Steps

After successful installation:

1. **Read the Documentation**: Explore the comprehensive docs
2. **Run the Tutorial**: Follow the quick start guide
3. **Explore the Codebase**: Understand the project structure
4. **Make Your First Tip**: Test the complete flow
5. **Join the Community**: Connect with other developers

## 🆘 Getting Help

- **Documentation**: Check the docs folder for detailed guides
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our community for real-time support
- **Stack Overflow**: Search for existing solutions

---

**Happy coding! 🚀**
