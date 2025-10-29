const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider } = require('@coral-xyz/anchor');
const config = require('./config');
const fs = require('fs');
const path = require('path');

// Load the IDL
const idl = JSON.parse(fs.readFileSync(path.join(__dirname, '../target/idl/x402_protocol.json'), 'utf8'));

class X402Distributor {
  constructor() {
    this.connection = new Connection(config.SOLANA_RPC_URL, 'confirmed');
    this.programId = new PublicKey(config.PROGRAM_ID);
    this.setupProgram();
  }

  setupProgram() {
    const distributorKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(config.ORACLE_PRIVATE_KEY))
    );
    
    const provider = new AnchorProvider(
      this.connection,
      { publicKey: distributorKeypair.publicKey, signTransaction: async (tx) => tx, signAllTransactions: async (txs) => txs },
      { commitment: 'confirmed' }
    );

    this.program = new Program(idl, this.programId, provider);
    this.distributorKeypair = distributorKeypair;
  }

  async getCompletedCampaigns() {
    try {
      const campaigns = await this.program.account.campaign.all();
      return campaigns.filter(campaign => campaign.account.isComplete);
    } catch (error) {
      console.error('Error fetching completed campaigns:', error);
      return [];
    }
  }

  async getShillerEngagements(campaignAddress, shillerAddress) {
    // This would typically query your database or indexer for shiller-specific engagement data
    // For now, we'll simulate this with a placeholder
    return {
      shillerAddress,
      engagementCount: Math.floor(Math.random() * 10) + 1, // Simulated engagement count
      verified: true
    };
  }

  async releasePayment(campaignAddress, shillerAddress, engagementCount) {
    try {
      console.log(`Releasing payment for campaign ${campaignAddress} to shiller ${shillerAddress}`);
      
      const tx = await this.program.methods
        .releasePayment(
          new PublicKey(shillerAddress),
          new anchor.BN(engagementCount)
        )
        .accounts({
          campaign: new PublicKey(campaignAddress),
          shiller: new PublicKey(shillerAddress),
        })
        .rpc();

      console.log(`Payment released successfully. Transaction: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Error releasing payment:', error);
      throw error;
    }
  }

  async processDistributions() {
    console.log('Starting payment distribution process...');
    
    const completedCampaigns = await this.getCompletedCampaigns();
    console.log(`Found ${completedCampaigns.length} completed campaigns`);

    for (const campaignData of completedCampaigns) {
      const campaign = campaignData.account;
      const campaignAddress = campaignData.publicKey;
      
      try {
        console.log(`Processing distribution for campaign: ${campaignAddress}`);
        
        // In a real implementation, you would:
        // 1. Query your database for all shillers who participated in this campaign
        // 2. Calculate their individual engagement counts
        // 3. Release payments proportionally
        
        // For demo purposes, we'll simulate with a single shiller
        const shillerAddress = "11111111111111111111111111111111"; // Placeholder shiller address
        const shillerEngagements = await this.getShillerEngagements(campaignAddress, shillerAddress);
        
        if (shillerEngagements.verified && shillerEngagements.engagementCount > 0) {
          await this.releasePayment(
            campaignAddress.toString(),
            shillerAddress,
            shillerEngagements.engagementCount
          );
          
          console.log(`✅ Payment released to shiller ${shillerAddress}: ${shillerEngagements.engagementCount} engagements`);
        }
      } catch (error) {
        console.error(`❌ Error processing distribution for campaign ${campaignAddress}:`, error);
      }
    }
  }

  async start() {
    console.log('💰 X402 Distributor started');
    console.log(`📡 Monitoring Solana RPC: ${config.SOLANA_RPC_URL}`);
    console.log(`🔑 Distributor address: ${this.distributorKeypair.publicKey.toString()}`);
    
    // Process distributions immediately
    await this.processDistributions();
    
    // Set up interval for continuous monitoring
    setInterval(async () => {
      await this.processDistributions();
    }, config.DISTRIBUTION_INTERVAL);
  }
}

// Start the distributor if this file is run directly
if (require.main === module) {
  const distributor = new X402Distributor();
  distributor.start().catch(console.error);
}

module.exports = X402Distributor;
