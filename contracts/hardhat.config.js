require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("dotenv").config();
require("./tasks");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  // defaultNetwork: "sepolia",
  defaultNetwork: "goerli",

  networks: {
    sepolia: {
      chainId: 11155111,
      url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public	",
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      chainId: 5,
      url: `https://rpc.ankr.com/eth_goerli`,
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      chainId: 80001,
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    // apiKey: "JYMKRTHHFUSX4X11I1NQRNW6X7K2FJFJUU",
    apiKey: "KNVT7KRT9B15Z5UTXZT8TG8HNMIJXWXRMY",

    customChains: [],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    tasks: "./tasks",
  },
};
