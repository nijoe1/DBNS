const axios = require("axios");
const lighthouse = require("@lighthouse-web3/sdk");
const {
  getJWT,
  generate,
  saveShards,
  recoverShards,
  recoverKey,
} = require("@lighthouse-web3/kavach");
const fs = require("fs");
const path = require("path");

// Assuming Tokemon.json exports an object and 'tokemon' is one of its properties
const tokemon = require("../Tokemon.json");

const dealParams = {
  num_copies: 3,
};

const getIpfsGatewayUri = (cidOrIpfsUri) => {
  const LIGHTHOUSE_IPFS_GATEWAY =
    "https://gateway.lighthouse.storage/ipfs/{cid}";
  // const cid = cidOrIpfsUri.replace("ipfs://", "");
  return LIGHTHOUSE_IPFS_GATEWAY.replace("{cid}", cidOrIpfsUri);
};

const getIpfsCID = (ipfsCIDLink) => {
  const LIGHTHOUSE_IPFS_GATEWAY = "https://gateway.lighthouse.storage/ipfs/";
  // const cid = cidOrIpfsUri.replace("ipfs://", "");
  return ipfsCIDLink.replace(LIGHTHOUSE_IPFS_GATEWAY, "");
};

const uploadFile = async (file, apiKey) => {
  const output = await lighthouse.upload(file, apiKey, false, null, dealParams);

  //   Replicating the file PErmanently on Filecoin
  await registerCIDtoRAAS(output.data.Hash);

  return output.data.Hash;
};

const uploadToken = async (
  isCharacter,
  apiKey,
  _tokenNode,
  TokemonAddress,
  userAddress,
  jwt,
  fileToEncrypt,
  image,
  metadata
) => {
  const ImageCID = await uploadFile(image, apiKey);
  console.log("Upload image success", ImageCID);

  const EncryptedFileCID = await handleEncryptedFileUpload(
    fileToEncrypt,
    apiKey,
    jwt,
    _tokenNode,
    TokemonAddress,
    userAddress
  );
  console.log("Upload encrypted file success", EncryptedFileCID);

  metadata.image = getIpfsGatewayUri(ImageCID);
  metadata.Encryptedfile = getIpfsGatewayUri(EncryptedFileCID);

  // Convert JSON object to JSON string
  const jsonString = JSON.stringify(metadata);

  // Path where you want to save the file
  let filePath;
  let fileCIDPath;
  if (isCharacter) {
    filePath = path.join(__dirname, "Character.json");
    fileCIDPath = path.join(__dirname, "CharacterCID.json");
  } else {
    filePath = path.join(__dirname, "Asset.json");
    fileCIDPath = path.join(__dirname, "AssetCID.json");
  }

  // Write JSON string to a file
  fs.writeFileSync(filePath, jsonString, "utf8", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been created");
  });

  const jsonCID = (
    await lighthouse.upload(filePath, apiKey, false, null, null, dealParams)
  ).data.Hash;

  await registerCIDtoRAAS(jsonCID);

  let gatewayURI = getIpfsGatewayUri(jsonCID);

  let CIDjson = {};

  CIDjson.MetadataCID_Gateway = gatewayURI;
  CIDjson.MetadataCID = jsonCID;
  CIDjson.Encryptedfile_Gateway = getIpfsGatewayUri(EncryptedFileCID);
  CIDjson.Encryptedfile = EncryptedFileCID;

  fs.writeFileSync(fileCIDPath, JSON.stringify(CIDjson), "utf8", (err) => {
    if (err) {
      console.log("err");
      return;
    }
    console.log("File has been created");
  });

  return gatewayURI;
};

/* Deploy file along with encryption */
const uploadFileEncrypted = async (file, apiKey, address, jwt) => {
  const output = await lighthouse.uploadEncrypted(
    file,
    apiKey,
    address,
    jwt,
    null,
    dealParams
  );

  let threshold = 3;
  let keysCount = 5;

  const { masterKey, keyShards } = await generate(threshold, keysCount);

  const { isSuccess } = await saveShards(
    address,
    output.data[0].cid,
    jwt,
    keyShards
  );

  await registerCIDtoRAAS(output.data[0].cid);

  return output.data;
};

const handleEncryptedFileUpload = async (
  file,
  key,
  jwt,
  _tokenNode,
  TokemonAddress,
  userAddress
) => {
  // Upload file and get encrypted CID
  const CID = await uploadFileEncrypted(file, key, userAddress, jwt);
  console.log("CID 1", CID[0].Hash);
  let res = await applyAccessConditions(
    CID[0].Hash,
    _tokenNode,
    TokemonAddress,
    userAddress,
    jwt
  );
  console.log("CID 2", res.data.cid);

  let cid = res.data.cid;
  return cid;
};

const applyAccessConditions = async (
  cid,
  _tokenNode,
  TokemonAddress,
  userAddress,
  jwt
) => {
  console.log("Applying access conditions: ", TokemonAddress);
  const conditions = [
    {
      id: 1,
      chain: "Goerli",
      method: "hasAccess",
      standardContractType: "Custom",
      contractAddress: TokemonAddress.toLowerCase(),
      returnValueTest: {
        comparator: "==",
        value: "true",
      },
      parameters: [_tokenNode, ":userAddress"],
      inputArrayType: ["bytes32", "address"],
      outputType: "bool",
    },
  ];

  const response = await lighthouse.applyAccessCondition(
    userAddress,
    cid,
    jwt,
    conditions
  );

  // let RAAS_Response = await registerCIDtoRAAS(cid);

  const threshold = 3;
  const keysCount = 5;
  const { masterKey, keyShards } = await generate(threshold, keysCount);

  const { isSuccess } = await saveShards(
    userAddress,
    response.data.cid,
    jwt,
    keyShards
  );
  return response;
};

const generateAPIKey = async (signedMessage, address) => {
  console.log("Generating API Key");
  const API_KEY = await lighthouse.getApiKey(address, signedMessage);
  return API_KEY.data.apiKey;
};

const getAuthMessage = async (address) => {
  const response = await lighthouse.getAuthMessage(address);
  return response.data.message;
};

const generateLighthouseJWToken = async (signedMessage, address) => {
  let jwt = (await getJWT(address, signedMessage)).JWT;
  return jwt;
};

const getDealStatusByCID = async (cid) => {
  const endpoint = `https://calibration.lighthouse.storage/api/deal_status?cid=${cid}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch deal status. Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching deal status:", error.message);
    return null;
  }
};

const registerCIDtoRAAS = async (cid) => {
  const formData = new FormData();

  const defaultEndDate = new Date();
  defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);
  const defaultReplicationTarget = 3;
  const defaultEpochs = 4;

  formData.append("cid", cid);
  formData.append("endDate", defaultEndDate);
  formData.append("replicationTarget", defaultReplicationTarget);
  formData.append("epochs", defaultEpochs);

  try {
    const response = await axios.post(
      "https://calibration.lighthouse.storage/api/register_job",
      formData
    );
    console.log("registered job:");

    return response.data;
  } catch (error) {
    console.log("Error registering job:");
  }
};

module.exports = {
  getIpfsGatewayUri,
  getIpfsCID,
  uploadFile,
  uploadToken,
  uploadFileEncrypted,
  registerCIDtoRAAS,
  getDealStatusByCID,
  generateAPIKey,
  getAuthMessage,
  generateLighthouseJWToken,
  handleEncryptedFileUpload,
  applyAccessConditions,
};
