require("hardhat-deploy");
require("hardhat-deploy-ethers");

const { ethers, unlock } = require("hardhat");
const { Console } = require("console");
const { get } = require("http");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  // deploy the Unlock contract
  // const ul = await unlock.deployProtocol(12,12,0);
  // console.log("Unlock Address:", ul);

  // Calibration Testnet
  // const FNS = "0x331e3228ca613F52B8E6a0F1EFD7000Cb6DFA581";
  // const PUBLIC_RESOLVER = "	0x55608172cD23E7e1c2BD939f1C3210027EbD031a";
  // const IMPLEMENTATION = "";
  // const UNLOCK = "0xa4E2E8c8A18bd0641cb3288Bf7a55fb3A2F1880F";
  // PUBLICLOCK > deployed to : 0xa6E4BAB853c696BC9eE1eB6f1Ea09365E50B4038

  // sepolia Testnet
  const ENS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  const PUBLIC_RESOLVER = "	0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";
  const IMPLEMENTATION = "";
  const UNLOCK = "0x36b34e10295cCE69B652eEB5a8046041074515Da";

  // const DBNS2 = await deploy("DBNS", {
  //   from: wallet.address,
  //   args: [NAME_WRAPPER, PUBLIC_RESOLVER, UNLOCK, HATS],
  //   log: true,
  //   gasLimit: 4000000,
  // });

  // const DBNS_INSTANCE = await ethers.getContractFactory("DBNS");
  // const DBNS = await DBNS_INSTANCE.attach(
  //   "0x0432C22A3f26B2EEe1F848f9201EB3B8f40B53cC"
  // );
  // let tx = await DBNS.hasActiveSubscription(
  //   "0x823a00bbae1550949eba18e73944a288175aed7406109cc9503a95d3f5cb5fe2",
  //   wallet.address
  // );

  // console.log(tx);

  // let tx = await DBNS.transferDomain(wallet.address);
  // await tx.wait();

  // console.log(tx);

  //   function createSpaceInstance(
  //     bytes32 _node,
  //     uint256 _hatID,
  //     uint256 _price,
  //     string memory _name,
  //     string memory _about,
  //     string memory _img,
  //     string memory _chatID,
  //     string memory _IPNS
  // )

  // tx = await DBNS.createSpaceInstance(
  //   "0x41f57e10026b603d03d1919fe15f92e68e56d68bdbae46da5cc1a71d061e42bc",
  //   0,
  //   10,
  //   "tock",
  //   "tick",
  //   "img",
  //   "chatID",
  //   "IPNS"
  // );
  // await tx.wait();

  // function createInstanceCode(
  //   bytes32 _instance,
  //   string memory _name,
  //   string memory _about,
  //   string memory _chatID,
  //   string memory _codeIPNS
  // )

  // tx = await DBNS.createInstanceCode(
  //   "0x823a00bbae1550949eba18e73944a288175aed7406109cc9503a95d3f5cb5fe2",
  //   "name",
  //   "about",
  //   "chatID",
  //   "codeIPNS"
  // );
  // await tx.wait();

  //     function purchaseSubscription(bytes32 _instanceID) external payable {

  // tx = await DBNS.purchaseSubscription(
  //   "0x823a00bbae1550949eba18e73944a288175aed7406109cc9503a95d3f5cb5fe2",
  //   { value: 10 }
  // );
  // await tx.wait();

  // Verify the contract
  // await hre.run("verify:verify", {
  //   address: DBNS2.address,
  //   constructorArguments: [NAME_WRAPPER, PUBLIC_RESOLVER],
  // });
};
