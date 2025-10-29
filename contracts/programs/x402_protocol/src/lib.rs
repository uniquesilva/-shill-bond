use anchor_lang::prelude::*;

declare_id!("X402Protocol1111111111111111111111111111111111");

#[program]
pub mod x402_protocol {
    use super::*;

    /// Create a new campaign with budget and engagement goals
    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        budget: u64,
        reward_per_engagement: u64,
        goal_engagements: u64,
        hashtag: String,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.creator = ctx.accounts.creator.key();
        campaign.budget = budget;
        campaign.reward_per_engagement = reward_per_engagement;
        campaign.goal_engagements = goal_engagements;
        campaign.engagements_verified = 0;
        campaign.is_complete = false;
        campaign.hashtag = hashtag;
        campaign.created_at = Clock::get()?.unix_timestamp;
        campaign.bump = *ctx.bumps.get("campaign").unwrap();

        // Transfer SOL to campaign account as escrow
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.creator.key(),
            &campaign.key(),
            budget,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.creator.to_account_info(),
                campaign.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        msg!("Campaign created with budget: {} SOL", budget as f64 / 1_000_000_000.0);
        Ok(())
    }

    /// Submit proof of engagement (called by oracle)
    pub fn submit_proof(
        ctx: Context<SubmitProof>,
        engagement_count: u64,
        tweet_id: String,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        
        // Verify this is called by the oracle
        require!(
            ctx.accounts.oracle.key() == campaign.oracle,
            ErrorCode::UnauthorizedOracle
        );

        campaign.engagements_verified = campaign.engagements_verified
            .checked_add(engagement_count)
            .ok_or(ErrorCode::Overflow)?;

        // Check if campaign goal is reached
        if campaign.engagements_verified >= campaign.goal_engagements {
            campaign.is_complete = true;
            msg!("Campaign completed! Goal reached: {}", campaign.goal_engagements);
        }

        msg!("Engagement proof submitted: {} new engagements", engagement_count);
        Ok(())
    }

    /// Release payment to shiller when campaign is complete
    pub fn release_payment(
        ctx: Context<ReleasePayment>,
        shiller_address: Pubkey,
        engagement_count: u64,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let shiller = &mut ctx.accounts.shiller;

        require!(campaign.is_complete, ErrorCode::CampaignNotComplete);
        require!(shiller_address == shiller.key(), ErrorCode::InvalidShiller);

        let reward_amount = engagement_count
            .checked_mul(campaign.reward_per_engagement)
            .ok_or(ErrorCode::Overflow)?;

        require!(
            reward_amount <= campaign.budget,
            ErrorCode::InsufficientBudget
        );

        // Transfer SOL to shiller
        **campaign.to_account_info().try_borrow_mut_lamports()? -= reward_amount;
        **shiller.to_account_info().try_borrow_mut_lamports()? += reward_amount;

        campaign.budget = campaign.budget.checked_sub(reward_amount).unwrap();

        msg!("Payment released: {} SOL to shiller", reward_amount as f64 / 1_000_000_000.0);
        Ok(())
    }

    /// Set oracle for campaign (only creator can do this)
    pub fn set_oracle(ctx: Context<SetOracle>, oracle: Pubkey) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        require!(ctx.accounts.creator.key() == campaign.creator, ErrorCode::Unauthorized);
        campaign.oracle = oracle;
        msg!("Oracle set to: {}", oracle);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(budget: u64, reward_per_engagement: u64, goal_engagements: u64, hashtag: String)]
pub struct CreateCampaign<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 8 + 8 + 8 + 8 + 8 + 1 + 64 + 8 + 1 + 32, // 8 + discriminator + all fields
        seeds = [b"campaign", creator.key().as_ref(), hashtag.as_bytes()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    /// CHECK: This is the oracle that will verify engagements
    pub oracle: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitProof<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    /// CHECK: This is the oracle account
    pub oracle: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReleasePayment<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub shiller: SystemAccount<'info>,
}

#[derive(Accounts)]
pub struct SetOracle<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    pub creator: Signer<'info>,
}

#[account]
pub struct Campaign {
    pub creator: Pubkey,           // 32 bytes
    pub budget: u64,               // 8 bytes
    pub reward_per_engagement: u64, // 8 bytes
    pub goal_engagements: u64,     // 8 bytes
    pub engagements_verified: u64, // 8 bytes
    pub is_complete: bool,         // 1 byte
    pub hashtag: String,           // 4 + 64 bytes (max 60 chars)
    pub created_at: i64,           // 8 bytes
    pub oracle: Pubkey,            // 32 bytes
    pub bump: u8,                  // 1 byte
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized oracle")]
    UnauthorizedOracle,
    #[msg("Campaign not complete")]
    CampaignNotComplete,
    #[msg("Invalid shiller")]
    InvalidShiller,
    #[msg("Insufficient budget")]
    InsufficientBudget,
    #[msg("Overflow")]
    Overflow,
    #[msg("Unauthorized")]
    Unauthorized,
}
