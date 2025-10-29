# Shill.bond - The Web3 Performance Network

**Powered by X402 Protocol** - A fully automated on-chain engine that verifies and rewards real engagement on X (Twitter).

## 🚀 What is X402 Protocol?

X402 Protocol is a Solana-based smart contract system that:
- **Automatically verifies** X (Twitter) engagement through oracle integration
- **Instantly distributes** SOL rewards when campaign goals are reached
- **Provides complete transparency** with on-chain verification and analytics
- **Eliminates manual processes** with fully automated campaign management

## ✨ Features

### For Developers
- **Create Campaigns**: Set budget, engagement goals, and hashtags
- **Automated Verification**: Oracle monitors X engagement in real-time
- **Transparent Analytics**: Track progress and ROI on-chain
- **Instant Payouts**: Rewards distributed automatically when goals are met

### For Shillers
- **Browse Campaigns**: View active campaigns and potential earnings
- **Simple Participation**: Post with campaign hashtag to participate
- **Automatic Verification**: Engagement verified by oracle without manual submission
- **Instant Rewards**: Receive SOL payments immediately when goals are reached

### X402 Protocol Benefits
- **Fully Automated**: No manual verification or payout processes
- **Transparent**: All data and transactions are on-chain
- **Compliant**: Designed to adhere to X (Twitter) Terms of Service
- **Scalable**: Built on Solana for high throughput and low costs

## 🏗️ Architecture

```
/shill.bond
├── /contracts              # X402 Protocol Solana smart contracts
│   ├── Cargo.toml
│   └── programs/x402_protocol/src/lib.rs
├── /api                    # Oracle + automation scripts
│   ├── verify.js           # X engagement verification
│   ├── distribute.js       # Automated payment distribution
│   └── config.js           # Configuration
├── /frontend               # Shill.bond web application
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── styles/
├── /sdk                    # X402 client SDK for developers
│   └── index.ts
└── README.md
```

## 🛠️ Tech Stack

- **Blockchain**: Solana, Anchor framework
- **Smart Contracts**: Rust, Anchor
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Oracle**: Node.js, Twitter API v2
- **Database**: MongoDB
- **Authentication**: NextAuth.js with X OAuth
- **Deployment**: Railway

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- Rust 1.70+
- Solana CLI
- Anchor CLI

### 2. Install Dependencies
```bash
git clone https://github.com/uniquesilva/shill-bond.git
cd shill-bond
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy environment files
cp frontend/.env.example frontend/.env.local
cp api/.env.example api/.env

# Edit with your configuration
```

### 4. Deploy X402 Protocol
```bash
# Build and deploy smart contracts
cd contracts
anchor build
anchor deploy

# Update program ID in frontend and API
```

### 5. Start Oracle Service
```bash
cd api
npm install
npm run dev
```

### 6. Start Frontend
```bash
cd frontend
npm run dev
```

### 7. Visit Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 X402 Protocol Usage

### For Developers

```typescript
import { X402Client } from '@x402/sdk';

const client = new X402Client({
  rpcUrl: 'https://api.devnet.solana.com',
  programId: 'YOUR_PROGRAM_ID',
  wallet: wallet
});

// Create a campaign
const txHash = await client.createCampaign({
  budget: 1.0, // 1 SOL
  rewardPerEngagement: 0.01, // 0.01 SOL per engagement
  goalEngagements: 100,
  hashtag: 'myproject',
  oracle: oraclePublicKey
});
```

### For Shillers

1. **Connect Wallet**: Use Phantom or Solflare
2. **Browse Campaigns**: View active campaigns and potential earnings
3. **Participate**: Post on X with the campaign hashtag
4. **Earn**: Receive SOL automatically when goals are reached

## 📊 How It Works

1. **Developer creates campaign** with budget, goals, and hashtag
2. **Shillers post on X** using the campaign hashtag
3. **Oracle monitors X** and verifies engagement automatically
4. **Smart contract tracks progress** and updates on-chain
5. **When goal is reached**, payments are distributed instantly
6. **All data is transparent** and verifiable on Solana

## 🚀 Deployment

### Railway (Recommended)

1. **Connect GitHub repository to Railway**
2. **Set environment variables**:
   - `SOLANA_RPC_URL`
   - `PROGRAM_ID`
   - `TWITTER_BEARER_TOKEN`
   - `ORACLE_PRIVATE_KEY`
   - `MONGODB_URI`
3. **Deploy automatically** on push

### Manual Deployment

```bash
# Build contracts
anchor build
anchor deploy

# Build frontend
cd frontend
npm run build
npm start

# Start oracle
cd api
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [shill.bond](https://shill.bond)
- **Documentation**: [docs.shill.bond](https://docs.shill.bond)
- **Twitter**: [@shillbond](https://twitter.com/shillbond)
- **Discord**: [Join our community](https://discord.gg/shillbond)

---

**Powered by X402 Protocol** - The future of automated engagement rewards on Solana.