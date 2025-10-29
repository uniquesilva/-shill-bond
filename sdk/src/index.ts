import { Connection, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider';

export interface X402Config {
  rpcUrl: string;
  programId: string;
  wallet?: Wallet;
}

export interface CampaignData {
  creator: PublicKey;
  budget: BN;
  rewardPerEngagement: BN;
  goalEngagements: BN;
  engagementsVerified: BN;
  isComplete: boolean;
  hashtag: string;
  createdAt: BN;
  oracle: PublicKey;
}

export interface CreateCampaignParams {
  budget: number; // in lamports
  rewardPerEngagement: number; // in lamports
  goalEngagements: number;
  hashtag: string;
  oracle: PublicKey;
}

export class X402Client {
  private connection: Connection;
  private program: Program;
  private programId: PublicKey;
  private wallet?: Wallet;

  constructor(config: X402Config) {
    this.connection = new Connection(config.rpcUrl, 'confirmed');
    this.programId = new PublicKey(config.programId);
    this.wallet = config.wallet;
    
    this.initializeProgram();
  }

  private initializeProgram() {
    if (!this.wallet) {
      throw new Error('Wallet is required for X402Client');
    }

    const provider = new AnchorProvider(
      this.connection,
      this.wallet,
      { commitment: 'confirmed' }
    );

    // In a real implementation, you would load the IDL from a file or URL
    // For now, we'll create a minimal program interface
    this.program = new Program({} as any, this.programId, provider);
  }

  /**
   * Create a new engagement campaign
   */
  async createCampaign(params: CreateCampaignParams): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet is required to create campaigns');
    }

    const [campaignPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('campaign'),
        this.wallet.publicKey.toBuffer(),
        Buffer.from(params.hashtag)
      ],
      this.programId
    );

    try {
      const tx = await this.program.methods
        .createCampaign(
          new BN(params.budget),
          new BN(params.rewardPerEngagement),
          new BN(params.goalEngagements),
          params.hashtag
        )
        .accounts({
          campaign: campaignPDA,
          creator: this.wallet.publicKey,
          oracle: params.oracle,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log(`Campaign created successfully: ${tx}`);
      return tx;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  /**
   * Get campaign data by address
   */
  async getCampaign(campaignAddress: PublicKey): Promise<CampaignData | null> {
    try {
      const campaign = await this.program.account.campaign.fetch(campaignAddress);
      return campaign as CampaignData;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return null;
    }
  }

  /**
   * Get all campaigns
   */
  async getAllCampaigns(): Promise<Array<{ publicKey: PublicKey; account: CampaignData }>> {
    try {
      const campaigns = await this.program.account.campaign.all();
      return campaigns.map(c => ({
        publicKey: c.publicKey,
        account: c.account as CampaignData
      }));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  /**
   * Get active campaigns (not completed)
   */
  async getActiveCampaigns(): Promise<Array<{ publicKey: PublicKey; account: CampaignData }>> {
    const allCampaigns = await this.getAllCampaigns();
    return allCampaigns.filter(c => !c.account.isComplete);
  }

  /**
   * Calculate campaign progress percentage
   */
  calculateProgress(campaign: CampaignData): number {
    if (campaign.goalEngagements.isZero()) return 0;
    return Math.min(
      (campaign.engagementsVerified.toNumber() / campaign.goalEngagements.toNumber()) * 100,
      100
    );
  }

  /**
   * Calculate potential reward for a shiller
   */
  calculateShillerReward(campaign: CampaignData, engagementCount: number): number {
    return campaign.rewardPerEngagement.toNumber() * engagementCount;
  }

  /**
   * Format SOL amount from lamports
   */
  formatSOL(lamports: number): string {
    return (lamports / 1_000_000_000).toFixed(4);
  }

  /**
   * Convert SOL to lamports
   */
  solToLamports(sol: number): number {
    return Math.floor(sol * 1_000_000_000);
  }
}

// Export utility functions
export const X402Utils = {
  /**
   * Generate campaign PDA
   */
  getCampaignPDA(creator: PublicKey, hashtag: string, programId: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('campaign'),
        creator.toBuffer(),
        Buffer.from(hashtag)
      ],
      programId
    );
    return pda;
  },

  /**
   * Validate hashtag format
   */
  validateHashtag(hashtag: string): boolean {
    return /^[a-zA-Z0-9_]{1,60}$/.test(hashtag);
  },

  /**
   * Calculate minimum campaign budget
   */
  calculateMinBudget(goalEngagements: number, rewardPerEngagement: number): number {
    return goalEngagements * rewardPerEngagement;
  }
};

// Default export
export default X402Client;
