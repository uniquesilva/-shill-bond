import { Worker, Queue, Job } from 'bullmq';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorClient } from '@creator-missions/utils';
import { connectDB } from './mongodb';
import axios from 'axios';
import crypto from 'crypto';

// Redis connection
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Solana connection
const solanaConnection = new Connection(process.env.SOLANA_CLUSTER || 'https://api.devnet.solana.com');

// Oracle configuration
const ORACLE_PUBKEY = new PublicKey(process.env.ORACLE_PUBLIC_KEY!);
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Job queues
const metricsQueue = new Queue('metrics:fetch', { connection });
const validationQueue = new Queue('claims:validate', { connection });
const finalizationQueue = new Queue('claims:finalize', { connection });

// Metrics worker
const metricsWorker = new Worker('metrics:fetch', async (job: Job) => {
  const { claimId, tweetIds } = job.data;
  
  try {
    const db = await connectDB();
    const claim = await db.collection('claims').findOne({ _id: claimId });
    
    if (!claim) {
      throw new Error('Claim not found');
    }

    // Fetch metrics for each tweet
    for (const tweetId of tweetIds) {
      try {
        const response = await axios.get(
          `https://api.twitter.com/2/tweets/${tweetId}`,
          {
            headers: {
              'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
            },
            params: {
              'tweet.fields': 'public_metrics',
            },
          }
        );

        const metrics = response.data.data?.public_metrics;
        if (metrics) {
          await db.collection('metrics_snapshots').insertOne({
            claimId,
            tweetId,
            publicMetrics: {
              impressions: metrics.impression_count || 0,
              like_count: metrics.like_count || 0,
              reply_count: metrics.reply_count || 0,
              quote_count: metrics.quote_count || 0,
              retweet_count: metrics.retweet_count || 0,
            },
            fetchedAt: new Date(),
          });
        }
      } catch (error) {
        console.error(`Error fetching metrics for tweet ${tweetId}:`, error);
      }
    }

    // Calculate aggregated metrics
    const snapshots = await db.collection('metrics_snapshots')
      .find({ claimId })
      .toArray();

    const aggregatedMetrics = snapshots.reduce((acc, snapshot) => {
      const metrics = snapshot.publicMetrics;
      acc.impressions += metrics.impressions || 0;
      acc.like_count += metrics.like_count || 0;
      acc.reply_count += metrics.reply_count || 0;
      acc.quote_count += metrics.quote_count || 0;
      acc.retweet_count += metrics.retweet_count || 0;
      return acc;
    }, {
      impressions: 0,
      like_count: 0,
      reply_count: 0,
      quote_count: 0,
      retweet_count: 0,
    });

    // Create metrics digest
    const metricsDigest = crypto
      .createHash('sha256')
      .update(JSON.stringify(aggregatedMetrics))
      .digest();

    // Update claim with metrics
    await db.collection('claims').updateOne(
      { _id: claimId },
      { 
        $set: { 
          metricsDigest: Array.from(metricsDigest),
          updatedAt: new Date(),
        }
      }
    );

    // Queue for validation
    await validationQueue.add('validate-claim', { claimId });
    
  } catch (error) {
    console.error('Error processing metrics:', error);
    throw error;
  }
}, { connection });

// Validation worker
const validationWorker = new Worker('claims:validate', async (job: Job) => {
  const { claimId } = job.data;
  
  try {
    const db = await connectDB();
    const claim = await db.collection('claims').findOne({ _id: claimId });
    
    if (!claim) {
      throw new Error('Claim not found');
    }

    // Validate disclosure text
    const hasDisclosure = claim.proof.disclosureFound;
    
    // Validate minimum requirements (if any)
    const campaign = await db.collection('campaigns').findOne({ _id: claim.campaignId });
    
    let isValid = hasDisclosure;
    
    // Additional validation logic can be added here
    
    // Update claim status
    await db.collection('claims').updateOne(
      { _id: claimId },
      { 
        $set: { 
          status: isValid ? 'approved' : 'rejected',
          updatedAt: new Date(),
        }
      }
    );

    if (isValid) {
      // Queue for finalization
      await finalizationQueue.add('finalize-claim', { claimId });
    }
    
  } catch (error) {
    console.error('Error validating claim:', error);
    throw error;
  }
}, { connection });

// Finalization worker
const finalizationWorker = new Worker('claims:finalize', async (job: Job) => {
  const { claimId } = job.data;
  
  try {
    const db = await connectDB();
    const claim = await db.collection('claims').findOne({ _id: claimId });
    
    if (!claim) {
      throw new Error('Claim not found');
    }

    // Submit oracle report on-chain
    const anchorClient = new AnchorClient(
      new PublicKey(process.env.PROGRAM_ID!),
      solanaConnection,
      // Oracle keypair would be loaded here
    );

    const claimPDA = anchorClient.getClaimPDA(
      new PublicKey(claim.onchainClaimPDA),
      new PublicKey(claim.shillerId)
    );

    const verdict = 1; // Approved
    const metricsDigest = new Uint8Array(claim.metricsDigest);

    await anchorClient.submitOracleReport(
      claimPDA,
      ORACLE_PUBKEY,
      verdict,
      metricsDigest
    );

    // Trigger payout
    await anchorClient.payout(
      claimPDA,
      new PublicKey(claim.onchainClaimPDA),
      new PublicKey(claim.campaignId), // This would be the campaign token account
      new PublicKey(claim.shillerId)   // This would be the shiller token account
    );

    // Update claim status
    await db.collection('claims').updateOne(
      { _id: claimId },
      { 
        $set: { 
          status: 'paid',
          updatedAt: new Date(),
        }
      }
    );
    
  } catch (error) {
    console.error('Error finalizing claim:', error);
    throw error;
  }
}, { connection });

// Start the oracle service
console.log('Oracle service started');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down oracle service...');
  await metricsWorker.close();
  await validationWorker.close();
  await finalizationWorker.close();
  process.exit(0);
});
