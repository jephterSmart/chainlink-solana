use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use chainlink_solana as chainlink;

declare_id!("9nhaTydEuiKfSuuN263HgZzbPqZu4M8umpWY4S9LBMr2");

#[program]
pub mod chainlink_solana_dapp {

    use super::*;
    pub fn execute(ctx: Context<Execute>) -> ProgramResult {
        let round = chainlink::latest_round_data(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info(),
        )?;
        let result_account = &mut ctx.accounts.result_account;
        result_account.value = round.answer;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(init, payer=user, space=8+24)]
    result_account: Account<'info, ResultAccount>,
    #[account(mut)]
    user: Signer<'info>,
    system_program: Program<'info, System>,
    /// CHECK: just the address is provided
    chainlink_feed: UncheckedAccount<'info>,
    /// CHECK: just the address is provided
    chainlink_program: UncheckedAccount<'info>,
}

#[account]
pub struct ResultAccount {
    value: i128,
}
