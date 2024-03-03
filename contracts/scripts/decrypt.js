require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");
const lighthouse = require("@lighthouse-web3/sdk");

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, ethers.provider);

const signAuthMessage = async (publicKey, privateKey) => {
  const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
    .message;
  const signedMessage = await wallet.signMessage(messageRequested);
  return signedMessage;
};

const decrypt = async () => {
  const cid = "QmdouWyoTXTTHTcja37v9fzXuPVrE6jcDcnqLkQ5DjGYLs"; //Example: 'QmbGN1YcBM25s6Ry9V2iMMsBpDEAPzWRiYQQwCTx7PPXRZ'
  const publicKey = wallet.address; //Example: '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588'
  const privateKey = process.env.PRIVATE_KEY;

  // Get file encryption key
  const signedMessage = await signAuthMessage(publicKey, privateKey);
  const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signedMessage
  );

  console.log((await lighthouse.getAccessConditions(cid)).data.conditions);

  // Decrypt File
  const decrypted = await lighthouse.decryptFile(
    cid,
    fileEncryptionKey.data.key
  );

  const filePath = path.join(__dirname, "decryptedImage.png");

  // Save File
  fs.createWriteStream(filePath).write(Buffer.from(decrypted));
};

decrypt();
