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

  const NAME_WRAPPER = "0x0635513f179D50A207757E05759CbD106d7dFcE8";
  const PUBLIC_RESOLVER = "0x8fade66b79cc9f707ab26799354482eb93a5b7dd";
  const HATS = "0x3bc1A0Ad72417f2d411118085256fC53CBdDd137";
  const UNLOCK = "0x36b34e10295cCE69B652eEB5a8046041074515Da";

  // const DBNS2 = await deploy("DBNS", {
  //   from: wallet.address,
  //   args: [NAME_WRAPPER, PUBLIC_RESOLVER, UNLOCK, HATS],
  //   log: true,
  //   gasLimit: 4000000,
  // });

  const DBNS_INSTANCE = await ethers.getContractFactory("DBNS");
  const DBNS = await DBNS_INSTANCE.attach(
    "0x0432C22A3f26B2EEe1F848f9201EB3B8f40B53cC"
  );
  // let tx = await DBNS.hasActiveSubscription(
  //   "0x823a00bbae1550949eba18e73944a288175aed7406109cc9503a95d3f5cb5fe2",
  //   wallet.address
  // );

  // console.log(tx);

  let tx = await DBNS.transferDomain(
    
    wallet.address
  );
  await tx.wait();

  console.log(tx);
  
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
