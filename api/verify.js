const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, web3 } = require('@coral-xyz/anchor');
const { TwitterApi } = require('twitter-api-v2');
const config = require('./config');
const fs = require('fs');
const path = require('path');

// Load the IDL
const idl = JSON.parse(fs.readFileSync(path.join(__dirname, '../target/idl/x402_protocol.json'), 'utf8'));

class X402Oracle {
  constructor() {
    this.connection = new Connection(config.SOLANA_RPC_URL, 'confirmed');
    this.programId = new PublicKey(config.PROGRAM_ID);
    
    // Initialize Twitter API
    this.twitterClient = new TwitterApi({
      appKey: config.TWITTER_API_KEY,
      appSecret: config.TWITTER_API_SECRET,
      accessToken: config.TWITTER_ACCESS_TOKEN,
      accessSecret: config.TWITTER_ACCESS_SECRET,
    });

    // Initialize Anchor program
    this.setupProgram();
  }

  setupProgram() {
    const oracleKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(config.ORACLE_PRIVATE_KEY))
    );
    
    const provider = new AnchorProvider(
      this.connection,
      { publicKey: oracleKeypair.publicKey, signTransaction: async (tx) => tx, signAllTransactions: async (txs) => txs },
      { commitment: 'confirmed' }
    );

    this.program = new Program(idl, this.programId, provider);
    this.oracleKeypair = oracleKeypair;
  }

  async getAllCampaigns() {
    try {
      const campaigns = await this.program.account.campaign.all();
      return campaigns.filter(campaign => !campaign.account.isComplete);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  async verifyEngagement(hashtag, since = new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    try {
      console.log(`Verifying engagement for hashtag: #${hashtag}`);
      
      // Search for tweets with the hashtag
      const tweets = await this.twitterClient.v2.search(`#${hashtag}`, {
        'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
        'user.fields': ['username'],
        'expansions': ['author_id'],
        'max_results': 100,
        'start_time': since.toISOString()
      });

      let totalEngagements = 0;
      const engagementData = [];

      if (tweets.data) {
        for (const tweet of tweets.data) {
          const metrics = tweet.public_metrics;
          const tweetEngagements = (metrics.like_count || 0) + 
                                 (metrics.retweet_count || 0) + 
                                 (metrics.reply_count || 0) + 
                                 (metrics.quote_count || 0);
          
          totalEngagements += tweetEngagements;
          
          engagementData.push({
            tweetId: tweet.id,
            authorId: tweet.author_id,
            engagements: tweetEngagements,
            createdAt: tweet.created_at,
            metrics: metrics
          });
        }
      }

      console.log(`Found ${totalEngagements} total engagements for #${hashtag}`);
      return { totalEngagements, engagementData };
    } catch (error) {
      console.error(`Error verifying engagement for #${hashtag}:`, error);
      return { totalEngagements: 0, engagementData: [] };
    }
  }

  async submitProof(campaignAddress, engagementCount, tweetId) {
    try {
      const campaignPubkey = new PublicKey(campaignAddress);
      
      console.log(`Submitting proof for campaign ${campaignAddress}: ${engagementCount} engagements`);
      
      const tx = await this.program.methods
        .submitProof(
          new anchor.BN(engagementCount),
          tweetId
        )
        .accounts({
          campaign: campaignPubkey,
          oracle: this.oracleKeypair.publicKey,
        })
        .rpc();

      console.log(`Proof submitted successfully. Transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Error submitting proof:', error);
      throw error;
    }
  }

  async processCampaigns() {
    console.log('Starting campaign verification process...');
    
    const campaigns = await this.getAllCampaigns();
    console.log(`Found ${campaigns.length} active campaigns`);

    for (const campaignData of campaigns) {
      const campaign = campaignData.account;
      const campaignAddress = campaignData.publicKey;
      
      try {
        console.log(`Processing campaign: ${campaignAddress}`);
        console.log(`Hashtag: #${campaign.hashtag}, Goal: ${campaign.goalEngagements}`);
        
        // Verify engagement for this campaign's hashtag
        const { totalEngagements, engagementData } = await this.verifyEngagement(campaign.hashtag);
        
        if (totalEngagements > 0) {
          // Submit proof to the blockchain
          await this.submitProof(
            campaignAddress.toString(),
            totalEngagements,
            engagementData[0]?.tweetId || 'unknown'
          );
          
          console.log(`✅ Campaign ${campaignAddress}: ${totalEngagements} engagements verified`);
        } else {
          console.log(`⏳ Campaign ${campaignAddress}: No new engagements found`);
        }
      } catch (error) {
        console.error(`❌ Error processing campaign ${campaignAddress}:`, error);
      }
    }
  }

  async start() {
    console.log('🚀 X402 Oracle started');
    console.log(`📡 Monitoring Solana RPC: ${config.SOLANA_RPC_URL}`);
    console.log(`🔑 Oracle address: ${this.oracleKeypair.publicKey.toString()}`);
    
    // Process campaigns immediately
    await this.processCampaigns();
    
    // Set up interval for continuous monitoring
    setInterval(async () => {
      await this.processCampaigns();
    }, config.VERIFICATION_INTERVAL);
  }
}

// Start the oracle if this file is run directly
if (require.main === module) {
  const oracle = new X402Oracle();
  oracle.start().catch(console.error);
}

module.exports = X402Oracle;
