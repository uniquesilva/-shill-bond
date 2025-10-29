require('dotenv').config();

module.exports = {
  // Solana Configuration
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY,
  PROGRAM_ID: process.env.PROGRAM_ID || 'X402Protocol1111111111111111111111111111111111',
  
  // Twitter API Configuration
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
  TWITTER_API_KEY: process.env.TWITTER_API_KEY,
  TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET,
  
  // Oracle Configuration
  ORACLE_PRIVATE_KEY: process.env.ORACLE_PRIVATE_KEY,
  VERIFICATION_INTERVAL: process.env.VERIFICATION_INTERVAL || 300000, // 5 minutes
  DISTRIBUTION_INTERVAL: process.env.DISTRIBUTION_INTERVAL || 600000, // 10 minutes
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/x402-oracle',
  
  // Redis for job queue
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Server
  PORT: process.env.PORT || 3001
};
