const { task } = require("hardhat/config");
const fs = require("fs");
const path = require("path");
const lighthouse = require("@lighthouse-web3/sdk");
const axios = require("axios");
const {
  uploadToken,
  generateLighthouseJWToken,
  getAuthMessage,
} = require("./Lighthouse/FileUtils");

const {
  assetJson,
  characterJson,
  assetPath,
  EncryptedAssetPath,
  characterPath,
  characterName,
  AssetName,
  parentNode,
} = require("./config");

// const TokemonFactory = require("../deployments/goerli/TokemonFactory.json");

// Defining the task
task("uploadToken", "Reads metadata of a specified image file").setAction(
  async (taskArgs, hre) => {
    const private_key = network.config.accounts[0];
    const wallet = new ethers.Wallet(private_key, ethers.provider);

    // const _TokemonFactory = await ethers.getContractFactory("TokemonFactory");

    // const TokemonFactoryInstance = _TokemonFactory.attach(
    //   TokemonFactory.address
    // );

    // let numberOfContracts = await TokemonFactoryInstance.getAmountOfContracts();

    // let tokemonAddress = await TokemonFactoryInstance.contracts(
    //   numberOfContracts - 1
    // );

    const keys = await getKeys();

    // Owners of the tokenNode will be able to Decrypt the Encrypted File.
    const _tokenNode = getCharacterNode(characterName, parentNode);

    const ENSMetadata = `https://metadata.ens.domains/goerli/0x114D4603199df73e7D157787f8778E21fCd13066/${BigInt(
      _tokenNode
    )}`;

    characterJson.attributes.push({
      trait_type: "ENSMetadata",
      value: ENSMetadata,
    });

    const characterCID = await uploadToken(
      // True because this is a character
      true,
      keys.apiKey,
      // Tokemon contract address to apply the token to and apply access control conditions
      _tokenNode,
      tokemonAddress,
      wallet.address,
      keys.jwt,
      characterPath,
      characterPath,
      characterJson
    );
    console.log(
      "Metadata CID stored on CharacterCID.json and is: ",
      characterCID
    );

    const _AssetNode = getCharacterNode(AssetName, _tokenNode);

    const ENSMetadataAsset = `https://metadata.ens.domains/goerli/0x114D4603199df73e7D157787f8778E21fCd13066/${BigInt(
      _AssetNode
    )}`;

    assetJson.attributes.push({
      trait_type: "ENSMetadata",
      value: ENSMetadataAsset,
    });

    const assetCID = await uploadToken(
      // False because this is an asset
      false,
      keys.apiKey,
      // Tokemon contract address to apply the token to and apply access control conditions
      _tokenNode,
      tokemonAddress,
      wallet.address,
      keys.jwt,
      EncryptedAssetPath,
      assetPath,
      assetJson
    );
    console.log("Metadata CID stored on AssetCID.json and is: ", assetCID);
  }
);

const signAuthMessage = async (privateKey, verificationMessage) => {
  const signer = new ethers.Wallet(privateKey);
  const signedMessage = await signer.signMessage(verificationMessage);
  return signedMessage;
};

const getKeys = async () => {
  const private_key = network.config.accounts[0];
  const wall = new ethers.Wallet(private_key, ethers.provider);
  const wallet = {
    publicKey: wall.address, // Ex: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
    privateKey: private_key,
  };
  const verificationMessage = (
    await axios.get(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${wallet.publicKey}`
    )
  ).data;

  const signedMessage = await signAuthMessage(
    wallet.privateKey,
    verificationMessage
  );
  const response = await lighthouse.getApiKey(wallet.publicKey, signedMessage);

  const authMessage = await getAuthMessage(wallet.publicKey);

  const signedMessageForJWT = await wall.signMessage(authMessage);

  console.log(signedMessageForJWT);
  const jwt = await generateLighthouseJWToken(
    signedMessageForJWT,
    wallet.publicKey
  );

  return { apiKey: response.data.apiKey, jwt: jwt };
};

function getCharacterNode(characterName, parentNode) {
  const abi = ethers.utils.defaultAbiCoder;

  const _parentNode = ethers.utils.namehash(parentNode);

  let subNodeBytes = stringToBytes(characterName);

  const LabelHash = ethers.utils.keccak256(subNodeBytes);

  let newSubNodeBytes = abi.encode(
    ["bytes32", "bytes32"],
    [_parentNode, LabelHash]
  );

  const newSubNode = ethers.utils.keccak256(newSubNodeBytes);

  console.log("Character Node:", newSubNode);

  return newSubNode;
}

function stringToBytes(str) {
  let bytes = Buffer.from(str);
  return (
    "0x" +
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
  );
}
