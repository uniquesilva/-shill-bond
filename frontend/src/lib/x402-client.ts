// Local X402 Client implementation for Railway deployment
// This is a simplified version for demo purposes

export interface CampaignData {
  publicKey: string;
  creator: string;
  budget: number;
  rewardPerEngagement: number;
  goalEngagements: number;
  engagementsVerified: number;
  isComplete: boolean;
}

export interface CreateCampaignParams {
  budget: number;
  rewardPerEngagement: number;
  goalEngagements: number;
}

export class X402Client {
  constructor() {
    // Simplified constructor for demo
  }

  async createCampaign(params: CreateCampaignParams): Promise<string> {
    // Mock implementation - in production this would interact with Solana
    console.log('Creating campaign with params:', params);
    return 'mock-campaign-id-' + Date.now();
  }

  async getCampaigns(): Promise<CampaignData[]> {
    // Mock implementation - in production this would fetch from Solana
    return [
      {
        publicKey: 'mock-campaign-1',
        creator: 'mock-creator-1',
        budget: 1.0,
        rewardPerEngagement: 0.01,
        goalEngagements: 100,
        engagementsVerified: 45,
        isComplete: false,
      },
      {
        publicKey: 'mock-campaign-2',
        creator: 'mock-creator-2',
        budget: 2.0,
        rewardPerEngagement: 0.02,
        goalEngagements: 200,
        engagementsVerified: 200,
        isComplete: true,
      },
    ];
  }
}
