// Import Push SDK & Ethers
const { PushAPI, CONSTANTS } = require("@pushprotocol/restapi");
const { ethers } = require("ethers");

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const signer = ethers.Wallet.createRandom();

async function main() {
  // Initialize wallet user
  // 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps
  const userAlice = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });

  console.log(userAlice);
}

main();
