# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

This guide will help you quickly set up and run the SolCreator project on your local machine.

## 📋 Prerequisites Check

Before starting, ensure you have the following installed:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if Expo CLI is installed
expo --version

# Check if Solana CLI is installed
solana --version
```

If any of these are missing, install them first:
- **Node.js**: Download from [nodejs.org](https://nodejs.org/)
- **Expo CLI**: `npm install -g @expo/cli`
- **Solana CLI**: Follow [Solana docs](https://docs.solana.com/cli/install-solana-cli-tools)

## ⚡ Quick Setup

### 1. Clone and Navigate
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
cd ..
```

### 3. Environment Setup
```bash
# Copy environment files
cp backend/env.example backend/.env
cp .env.example .env 2>/dev/null || echo "No .env.example found, create manually"
```

### 4. Start Development Servers

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Mobile App:**
```bash
npm start
```

### 5. Open the App

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go
- **Web**: Press `w` in the terminal

## 🎯 First Steps

### 1. Connect Your Wallet
1. Open the app
2. Tap "Connect Wallet"
3. Choose your Solana wallet (Phantom, Solflare, etc.)
4. Approve the connection

### 2. Browse Creators
1. Navigate to the Home tab
2. Browse trending creators
3. Use search and filters to find creators you like

### 3. Send Your First Tip
1. Tap on a creator card
2. Choose tip amount (100, 500, 1000, 5000, or custom)
3. Add a message (optional)
4. Tap "Send Tip"
5. Approve the transaction in your wallet

### 4. Check Your Vibe Score
1. Navigate to the Vibe Score tab
2. See your points and level
3. View your tipping history

## 🔧 Development Workflow

### Making Changes

#### Frontend Changes
```bash
# The app will auto-reload when you save files
# Edit files in the `app/` directory
# Changes appear instantly on your device
```

#### Backend Changes
```bash
# The server will auto-restart when you save files
# Edit files in the `backend/` directory
# API changes are immediately available
```

#### Smart Contract Changes
```bash
cd solcreator_program
anchor build
anchor deploy --provider.cluster devnet
```

### Testing Your Changes

#### Frontend Testing
```bash
# Run TypeScript checks
npm run type-check

# Run linting
npm run lint

# Run formatting check
npm run fmt:check
```

#### Backend Testing
```bash
cd backend
npm test
```

#### Smart Contract Testing
```bash
cd solcreator_program
anchor test
```

## 🐛 Common Issues & Solutions

### Issue: "Metro bundler not found"
**Solution:**
```bash
npm install
npx expo start --clear
```

### Issue: "Cannot connect to backend"
**Solution:**
```bash
# Check if backend is running
curl http://localhost:3001/health

# If not running, start it:
cd backend
npm run dev
```

### Issue: "Wallet connection failed"
**Solution:**
- Ensure you have a Solana wallet installed
- Check if you're on the correct network (mainnet/devnet)
- Try refreshing the app

### Issue: "Insufficient BONK balance"
**Solution:**
- Get BONK tokens from a DEX or faucet
- For devnet testing, use Solana devnet faucet
- For mainnet, purchase BONK from exchanges

### Issue: "Transaction failed"
**Solution:**
- Check your SOL balance for transaction fees
- Ensure you have sufficient BONK tokens
- Try increasing the priority fee

## 📱 Testing on Different Platforms

### iOS Simulator
```bash
# Install Xcode first (macOS only)
npm run ios
```

### Android Emulator
```bash
# Install Android Studio first
npm run android
```

### Physical Device
1. Install Expo Go from App Store/Play Store
2. Scan the QR code from the terminal
3. The app will load on your device

### Web Browser
```bash
npm run web
```

## 🔍 Debugging

### Enable Debug Mode
```bash
# Add to your .env file
DEBUG_MODE=true
```

### View Logs
```bash
# Frontend logs appear in the terminal
# Backend logs appear in the backend terminal
# Smart contract logs appear in Anchor test output
```

### React Native Debugger
```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Start debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

## 🚀 Next Steps

### 1. Explore the Codebase
- **Frontend**: Check out `app/` directory for screens
- **Backend**: Explore `backend/` for API endpoints
- **Smart Contracts**: Review `solcreator_program/` for blockchain logic

### 2. Read the Documentation
- [Project Overview](./project-overview.md)
- [Installation Guide](./installation-guide.md)
- [API Reference](./api/backend-api.md)
- [Frontend Guide](./development/frontend-guide.md)

### 3. Join the Community
- [Discord](https://discord.gg/solcreator)
- [GitHub Issues](https://github.com/your-org/solcreator/issues)
- [Documentation](https://docs.solcreator.app)

### 4. Contribute
- Fork the repository
- Create a feature branch
- Make your changes
- Submit a pull request

## 🎉 Congratulations!

You've successfully set up and are running SolCreator! You can now:

- ✅ Browse and discover creators
- ✅ Connect your Solana wallet
- ✅ Send BONK tips to creators
- ✅ Earn vibe points for engagement
- ✅ View social media integration
- ✅ Develop and test new features

## 📞 Need Help?

If you encounter any issues:

1. **Check the logs** in your terminal
2. **Review the documentation** in the `docs/` folder
3. **Search existing issues** on GitHub
4. **Ask the community** on Discord
5. **Create a new issue** if it's a bug

---

**Happy coding! 🚀**
