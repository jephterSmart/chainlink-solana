import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ChainlinkSolanaDapp } from "../target/types/chainlink_solana_dapp";
import { assert, expect } from "chai";

describe("chainlink_solana_dapp", () => {
  const chainlinkFeed = "EdWr4ww1Dq82vPe8GFjjcVPo2Qno3Nhn6baCgM3dCy28";
  const chainlinkProgramId = "CaH12fwNTKJAG8PxEvo9R96Zc2j8qNHZaFj8ZW49yZNT";
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .ChainlinkSolanaDapp as Program<ChainlinkSolanaDapp>;

  it("Queries SOL/USD Price Feed", async () => {
    // Add your test here.
    const resultAccount = anchor.web3.Keypair.generate();
    const tx = await program.methods
      .execute()
      .accounts({
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        resultAccount: resultAccount.publicKey,
        chainlinkFeed,
        chainlinkProgram: chainlinkProgramId,
      })
      .signers([resultAccount])
      .rpc();
    console.log("Your transaction signature", tx);
    const latestPrice = await program.account.resultAccount.fetch(
      resultAccount.publicKey
    );
    console.log(latestPrice.value.toNumber(), "value");
    assert.ok(latestPrice.value);
  });
});
