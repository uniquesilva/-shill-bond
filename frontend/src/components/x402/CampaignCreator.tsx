'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { X402Client, CreateCampaignParams } from '@x402/sdk';
import { PublicKey } from '@solana/web3.js';

interface CampaignCreatorProps {
  onCampaignCreated?: (txHash: string) => void;
}

export function CampaignCreator({ onCampaignCreated }: CampaignCreatorProps) {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    budget: '',
    rewardPerEngagement: '',
    goalEngagements: '',
    hashtag: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const x402Client = new X402Client({
        rpcUrl: 'https://api.devnet.solana.com',
        programId: 'X402Protocol1111111111111111111111111111111111',
        wallet: { publicKey, signTransaction: async () => {}, signAllTransactions: async () => {} } as any
      });

      const params: CreateCampaignParams = {
        budget: parseFloat(formData.budget) * 1_000_000_000, // Convert SOL to lamports
        rewardPerEngagement: parseFloat(formData.rewardPerEngagement) * 1_000_000_000,
        goalEngagements: parseInt(formData.goalEngagements),
        hashtag: formData.hashtag,
        oracle: new PublicKey('11111111111111111111111111111111'), // Placeholder oracle
      };

      const txHash = await x402Client.createCampaign(params);
      onCampaignCreated?.(txHash);
      
      // Reset form
      setFormData({
        budget: '',
        rewardPerEngagement: '',
        goalEngagements: '',
        hashtag: '',
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!connected) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Create Campaign</h3>
        <p className="text-gray-300">Please connect your wallet to create a campaign</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-6">Create X402 Campaign</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Campaign Budget (SOL)
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            step="0.001"
            min="0"
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reward per Engagement (SOL)
          </label>
          <input
            type="number"
            name="rewardPerEngagement"
            value={formData.rewardPerEngagement}
            onChange={handleInputChange}
            step="0.0001"
            min="0"
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Goal Engagements
          </label>
          <input
            type="number"
            name="goalEngagements"
            value={formData.goalEngagements}
            onChange={handleInputChange}
            min="1"
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hashtag (without #)
          </label>
          <input
            type="text"
            name="hashtag"
            value={formData.hashtag}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="shillbond"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          {loading ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
      </form>

      <div className="mt-4 p-4 bg-blue-900/20 rounded-md">
        <h4 className="text-sm font-semibold text-blue-300 mb-2">How it works:</h4>
        <ul className="text-xs text-blue-200 space-y-1">
          <li>• Set your budget and reward per engagement</li>
          <li>• Shillers post with #{formData.hashtag || 'yourhashtag'}</li>
          <li>• X402 Oracle verifies engagement automatically</li>
          <li>• Rewards are distributed when goal is reached</li>
        </ul>
      </div>
    </div>
  );
}
