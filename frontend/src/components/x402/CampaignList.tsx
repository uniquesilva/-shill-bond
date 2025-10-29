'use client';

import React, { useState, useEffect } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react'; // Temporarily disabled
import { X402Client, CampaignData } from '../../lib/x402-client';
// import { PublicKey } from '@solana/web3.js'; // Temporarily disabled

interface CampaignItemProps {
  campaign: CampaignData;
  address: string; // Changed from PublicKey to string
  x402Client: X402Client;
}

function CampaignItem({ campaign, address, x402Client }: CampaignItemProps) {
  const progress = x402Client.calculateProgress(campaign);
  const isComplete = campaign.isComplete;
  const budgetSOL = x402Client.formatSOL(campaign.budget.toNumber());
  const rewardSOL = x402Client.formatSOL(campaign.rewardPerEngagement.toNumber());

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">#{campaign.hashtag}</h3>
          <p className="text-sm text-gray-400">Campaign ID: {address.toString().slice(0, 8)}...</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-400">{budgetSOL} SOL</div>
          <div className="text-sm text-gray-400">Budget</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Progress</span>
          <span className="text-white">
            {campaign.engagementsVerified.toString()} / {campaign.goalEngagements.toString()}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isComplete ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Reward per engagement:</span>
            <div className="text-white font-semibold">{rewardSOL} SOL</div>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <div className={`font-semibold ${isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
              {isComplete ? 'Completed' : 'Active'}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            Created: {new Date(campaign.createdAt.toNumber() * 1000).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampaignList() {
  // const { connected } = useWallet(); // Temporarily disabled
  const connected = false; // Placeholder
  const [campaigns, setCampaigns] = useState<Array<{ publicKey: string; account: CampaignData }>>([]);
  const [loading, setLoading] = useState(true);
  const [x402Client, setX402Client] = useState<X402Client | null>(null);

  useEffect(() => {
    if (connected) {
      const client = new X402Client({
        rpcUrl: 'https://api.devnet.solana.com',
        programId: 'X402Protocol1111111111111111111111111111111111',
        wallet: undefined // We'll handle this properly in a real implementation
      });
      setX402Client(client);
    }
  }, [connected]);

  useEffect(() => {
    if (x402Client) {
      loadCampaigns();
    }
  }, [x402Client]);

  const loadCampaigns = async () => {
    if (!x402Client) return;
    
    setLoading(true);
    try {
      const activeCampaigns = await x402Client.getActiveCampaigns();
      setCampaigns(activeCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Active Campaigns</h3>
        <p className="text-gray-300">Please connect your wallet to view campaigns</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Active Campaigns</h3>
        <div className="text-gray-300">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Active Campaigns</h3>
        <button
          onClick={loadCampaigns}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
        >
          Refresh
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-gray-300">No active campaigns found</div>
          <div className="text-sm text-gray-400 mt-2">
            Create a campaign to get started with X402 Protocol
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <CampaignItem
              key={campaign.publicKey.toString()}
              campaign={campaign.account}
              address={campaign.publicKey}
              x402Client={x402Client!}
            />
          ))}
        </div>
      )}
    </div>
  );
}
