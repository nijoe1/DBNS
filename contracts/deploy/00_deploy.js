require("hardhat-deploy");
require("hardhat-deploy-ethers");

const { ethers } = require("hardhat");
const { Console } = require("console");
const { get } = require("http");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  const NAME_WRAPPER = "0x114D4603199df73e7D157787f8778E21fCd13066";
  const PUBLIC_RESOLVER = "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750";

  const DBNS2 = await deploy("DBNS", {
    from: wallet.address,
    args: [NAME_WRAPPER, PUBLIC_RESOLVER],
    log: true,
  });

  console.log(DBNS2.address);
  // Verify the contract
  await hre.run("verify:verify", {
    address: DBNS2.address,
    constructorArguments: [NAME_WRAPPER, PUBLIC_RESOLVER],
  });
};
