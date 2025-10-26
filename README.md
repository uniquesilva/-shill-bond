# Shill.bond - Solana Creator Missions

A decentralized platform for token teams and creators to run transparent, on-chain campaigns on Solana.

## Features

- **For Developers**: Create and fund campaigns with transparent analytics
- **For Shillers**: Complete missions and earn on Solana
- **On-chain**: All funding and payouts handled by smart contracts
- **Transparent**: Oracle-verified metrics and automated payouts
- **Compliant**: Designed to adhere to X (Twitter) Terms of Service

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, MongoDB, Redis, BullMQ
- **Blockchain**: Solana, Anchor framework
- **Authentication**: NextAuth.js with X OAuth
- **Deployment**: Railway

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shill-bond.git
   cd shill-bond
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/web/env.template apps/web/.env.local
   # Edit .env.local with your credentials
   ```

4. **Start development server**
   ```bash
   cd apps/web
   npm run dev
   ```

## Environment Variables

See `apps/web/env.template` for required environment variables.

## Deployment

This project is configured for deployment on Railway. See the Railway configuration in `railway.json`.

## License

MIT