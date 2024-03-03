require("dotenv").config();

const TokemonFactory = require("../deployments/goerli/TokemonFactory.json");
const tokemon = require("../deployments/goerli/Tokemon.json");

const { erc6551AccountAbiV3 } = require("@tokenbound/sdk");

const { ethers } = require("hardhat");

const CharacterCID = require("../tasks/Lighthouse/CharacterCID.json");
const AssetCID = require("../tasks/Lighthouse/AssetCID.json");

const { characterName, AssetName, parentNode } = require("../tasks/config");

const private_key = process.env.PRIVATE_KEY;

const wallet = new ethers.Wallet(private_key, ethers.provider);

const signer = ethers.provider.getSigner();

async function main() {
  console.log("Wallet+ Ethereum Address:", wallet.address);

  const _TokemonFactory = await ethers.getContractFactory("TokemonFactory");

  const TokemonFactoryInstance = _TokemonFactory.attach(TokemonFactory.address);

  let numberOfContracts = await TokemonFactoryInstance.getAmountOfContracts();

  let tokemonAddress = await TokemonFactoryInstance.contracts(
    numberOfContracts - 1
  );

  const _Tokemon = await ethers.getContractFactory("Tokemon");

  const TokemonInstance = _Tokemon.attach(tokemonAddress);

  const tokenCharacterNode = getTokenNode(parentNode, characterName);

  const CharacterNodeName = characterName + "." + parentNode; // characterName.companyENS.eth

  const tokenAssetNode = getTokenNode(CharacterNodeName, AssetName); // node of assetName.characterName.companyENS.eth

  const tokenAssetNode2 = AssetName + "." + tokenCharacterNode; // node of assetName.characterName.companyENS.eth

  const assetNodeHashName = ethers.utils.namehash(tokenAssetNode2); // node of assetName.characterName.companyENS.eth

  const AssetNodeName = AssetName + "." + CharacterNodeName; // assetName.characterName.companyENS.eth

  const characterNode1 = getTokenNode(CharacterNodeName, "1"); // node of 1.characterName.companyENS.eth
  const characterNode2 = getTokenNode(CharacterNodeName, "2");
  const characterNode3 = getTokenNode(CharacterNodeName, "3");

  const assetNode1 = getTokenNode(AssetNodeName, "1"); // node of 1.assetName.characterName.companyENS.eth
  const assetNode2 = getTokenNode(AssetNodeName, "2");
  const assetNode3 = getTokenNode(AssetNodeName, "3");

  // -------------------------------- STEP 1 --------------------------------

  let tx = await TokemonInstance.decrypt(
    // decrypt morty character id of morty.reymudo.eth
    characterNode1,
    { gasLimit: 10000000, value: 0 }
  );
  await tx.wait();

  console.log("Character decrypted");
}

main();

function getTokenNode(_parentNode, characterName) {
  const abi = ethers.utils.defaultAbiCoder;

  const parentNode = ethers.utils.namehash(_parentNode);

  let subNodeBytes = stringToBytes(characterName);

  const LabelHash = ethers.utils.keccak256(subNodeBytes);

  let newSubNodeBytes = abi.encode(
    ["bytes32", "bytes32"],
    [parentNode, LabelHash]
  );

  const newSubNode = ethers.utils.keccak256(newSubNodeBytes);

  console.log(characterName, _parentNode, " Node:", newSubNode);

  return newSubNode;
}

function stringToBytes(str) {
  let bytes = Buffer.from(str);
  return (
    "0x" +
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
  );
}
