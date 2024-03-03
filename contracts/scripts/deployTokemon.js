require("dotenv").config();

const TokemonFactory = require("../deployments/goerli/TokemonFactory.json");

const { ethers } = require("hardhat");
const { Console } = require("console");
const { get } = require("http");

const private_key = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(private_key, ethers.provider);

const { parentNode } = require("../tasks/config");

async function main() {
  console.log("Wallet+ Ethereum Address:", wallet.address);

  const NAME_WRAPPER = "0x114D4603199df73e7D157787f8778E21fCd13066";

  const PUBLIC_RESOLVER = "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750";

  const ResolverABI = ["function setAddr(bytes32 node,address a) external"];
  const NameWrapperABI = [
    "function safeTransferFrom(address from,address to,uint256 id,uint256 amount,bytes calldata data) external",
  ];

  const _TokemonFactory = await ethers.getContractFactory("TokemonFactory");

  const TokemonFactoryInstance = _TokemonFactory.attach(TokemonFactory.address);

  const name = "tokemon";
  const symbol = "TKMN";

  // -------------------------------- DEPLOY --------------------------------

  //   let tx = await TokemonFactoryInstance.createContract(name, symbol, {
  //     gasLimit: 10000000,
  //     value: 0,
  //   });
  //   let reciept = await tx.wait();

  //   console.log("Contract created");

  let numberOfContracts = await TokemonFactoryInstance.getAmountOfContracts();

  let tokemonAddress = await TokemonFactoryInstance.contracts(
    numberOfContracts - 1
  );

  console.log("Tokemon Address: ", tokemonAddress);

  // ---------- Transfering the company domain to the deployed contract----------

  const resolver = new ethers.Contract(PUBLIC_RESOLVER, ResolverABI, wallet);

  const nameWrapper = new ethers.Contract(NAME_WRAPPER, NameWrapperABI, wallet);

  const ENSNODE = ethers.utils.namehash(parentNode);

  tx = await resolver.setAddr(ENSNODE, tokemonAddress);
  await tx.wait();

  console.log("Resolver updated");

  tx = await nameWrapper.safeTransferFrom(
    wallet.address,
    tokemonAddress,
    BigInt(ENSNODE),
    1,
    "0x"
  );
  await tx.wait();

  console.log("NameWrapper updated");

  console.log("Domain Transfered to contract");
}

main();
