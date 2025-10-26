import { z } from 'zod';

// User Schema
export const UserSchema = z.object({
  _id: z.string().optional(),
  role: z.enum(['dev', 'shiller', 'admin']),
  twitterId: z.string(),
  handle: z.string(),
  avatarUrl: z.string().optional(),
  walletPubkey: z.string().optional(),
  createdAt: z.date().optional(),
  trustScore: z.number().default(0),
});

export type User = z.infer<typeof UserSchema>;

// Campaign Schema
export const CampaignSchema = z.object({
  _id: z.string().optional(),
  devId: z.string(),
  onchainCampaignPDA: z.string(),
  title: z.string(),
  requirementsMdUrl: z.string(),
  requirementsSummary: z.string(),
  budgetAtomic: z.number(),
  tokenMint: z.string(),
  startAt: z.date(),
  endAt: z.date(),
  status: z.enum(['draft', 'active', 'ended', 'exhausted', 'cancelled']),
  bonusFormula: z.enum(['log', 'linear', 'custom']),
  minAccountAgeDays: z.number().optional(),
  minFollowers: z.number().optional(),
  languages: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

// Claim Schema
export const ClaimSchema = z.object({
  _id: z.string().optional(),
  campaignId: z.string(),
  shillerId: z.string(),
  onchainClaimPDA: z.string(),
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'paid']),
  proof: z.object({
    links: z.array(z.string()),
    tweetIds: z.array(z.string()),
    disclosureFound: z.boolean(),
    hash: z.string(),
  }),
  artifactsCid: z.string().optional(),
  baseRewardAtomic: z.number(),
  bonusRewardAtomic: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Claim = z.infer<typeof ClaimSchema>;

// Metrics Snapshot Schema
export const MetricsSnapshotSchema = z.object({
  _id: z.string().optional(),
  claimId: z.string(),
  tweetId: z.string(),
  publicMetrics: z.object({
    impressions: z.number().optional(),
    like_count: z.number().optional(),
    reply_count: z.number().optional(),
    quote_count: z.number().optional(),
    retweet_count: z.number().optional(),
  }),
  fetchedAt: z.date().optional(),
});

export type MetricsSnapshot = z.infer<typeof MetricsSnapshotSchema>;

// Payout Schema
export const PayoutSchema = z.object({
  _id: z.string().optional(),
  claimId: z.string(),
  txSig: z.string(),
  amountAtomic: z.number(),
  time: z.date(),
  type: z.enum(['base', 'bonus']),
});

export type Payout = z.infer<typeof PayoutSchema>;

// API Request/Response Schemas
export const CreateCampaignRequestSchema = z.object({
  title: z.string().min(1),
  requirementsMdUrl: z.string().url(),
  requirementsSummary: z.string().min(1),
  budgetAtomic: z.number().positive(),
  tokenMint: z.string(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  bonusFormula: z.enum(['log', 'linear', 'custom']),
  minAccountAgeDays: z.number().optional(),
  minFollowers: z.number().optional(),
  languages: z.array(z.string()).optional(),
});

export type CreateCampaignRequest = z.infer<typeof CreateCampaignRequestSchema>;

export const SubmitProofRequestSchema = z.object({
  links: z.array(z.string().url()),
  tweetIds: z.array(z.string()),
  disclosureText: z.string().optional(),
});

export type SubmitProofRequest = z.infer<typeof SubmitProofRequestSchema>;

export const LinkWalletRequestSchema = z.object({
  publicKey: z.string(),
  signature: z.string(),
  nonce: z.string(),
});

export type LinkWalletRequest = z.infer<typeof LinkWalletRequestSchema>;
