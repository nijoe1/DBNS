import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";
import * as Name from "w3name";
import {
  getJWT,
  generate,
  saveShards,
  recoverShards,
  recoverKey,
} from "@lighthouse-web3/kavach";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

const LighthouseChains = {
  80001: {
    name: "Mumbai",
  },
  314159: {
    name: "Calibration",
  },
};

const dealParams = {
  num_copies: 3,
};

export const createName = async () => {
  // https://www.npmjs.com/package/w3name
  const name = await Name.create();
  console.log("created new name: ", name.toString());
  // value is an IPFS path to the content we want to publish
  const value = "/ipfs/QmaV4XFv7YqzC5USC51tVeHqEDQyJ4fsHFghGg9758Xhy4";
  // since we don't have a previous revision, we use Name.v0 to create the initial revision
  const revision = await Name.v0(name, value);
  await Name.publish(revision, name.key);
  console.log(name.key.bytes);
  const byteString = uint8ArrayToString(name.key.bytes, "base64");

  console.log(byteString);

  const name3 = uint8ArrayFromString(byteString, "base64");
  console.log(name3);
  const name2 = await Name.from(name3);
  const nextValue = "ipfs/QmaV4XFv7YqzC5USC51tVeHqEDQyJ4fsHFghGg9758Xhy4";

  let nextRevision = await Name.increment(revision, nextValue);

  await Name.publish(nextRevision, name2.key);

  const name4 = Name.parse(name.toString());
  const revision2 = await Name.resolve(name4);

  nextRevision = await Name.increment(revision2, nextValue);

  await Name.publish(nextRevision, name2.key);

  console.log("Resolved value:", name.toString());
};

export const createIPNSName = async (cid, apiKey, address, jwt) => {
  // https://www.npmjs.com/package/w3name
  const name = await Name.create();
  console.log("created new name: ", name.toString());

  const revision = await Name.v0(name, cid);
  await Name.publish(revision, name.key);
  console.log(name.key.bytes);

  const cid = await encryptIPNSKey(name.key.bytes, apiKey, address, jwt);
  return {
    name: name.toString(),
    cid: cid.Hash,
  };
};

export const renewIPNSName = async (
  IPNS,
  EncryptedKeyCID,
  cid,
  address,
  jwt
) => {
  const name = Name.parse(IPNS);

  const jsonBlob = await decrypt(EncryptedKeyCID, address, jwt);

  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob], `type.json`, {
    type: "application/json",
  });

  const key = JSON.parse(await jsonFile.text()).key;

  const revision = await Name.resolve(name);
  console.log("Resolved value:", revision.value);

  let nextRevision = await Name.increment(revision, cid);
  const nameKey = await Name.from(key);

  await Name.publish(nextRevision, nameKey.key);
};

export const getIpfsGatewayUri = (cid) => {
  const LIGHTHOUSE_IPFS_GATEWAY =
    "https://gateway.lighthouse.storage/ipfs/{cid}";
  return LIGHTHOUSE_IPFS_GATEWAY.replace("{cid}", cid);
};

export const getIpfsCID = (ipfsCIDLink) => {
  const LIGHTHOUSE_IPFS_GATEWAY = "https://gateway.lighthouse.storage/ipfs/";
  return ipfsCIDLink.replace(LIGHTHOUSE_IPFS_GATEWAY, "");
};

export const getUserDataInfo = async (address, apiKey) => {
  const balance = await lighthouse.getBalance(address);
  let uploads;
  try {
    uploads = await lighthouse.getUploads(apiKey);
  } catch {
    return { balance: balance.data, uploads: [] };
  }

  return { balance: balance.data, uploads: uploads.data.fileList };
};

export const uploadFile = async (file, apiKey, setUploadProgress) => {
  const progressCallback = (progressData) => {
    const percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    setUploadProgress(percentageDone); // Update the progress state
  };
  const output = await lighthouse.upload(
    file,
    apiKey,
    false,
    null,
    progressCallback,
    dealParams
  );
  let RAAS_Response = await registerCIDtoRAAS(output.data.Hash);

  return output.data;
};

/* Deploy file along with encryption */
export const encryptIPNSKey = async (IPNSPK, apiKey, address, jwt) => {
  // Create JSON object
  const json = {
    key: IPNSPK,
  };

  const jsonBlob = new Blob([JSON.stringify(json)], {
    type: "application/json",
  });

  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob], `type.json`, {
    type: "application/json",
  });
  const output = await lighthouse.uploadEncrypted(
    [jsonFile],
    apiKey,
    address,
    jwt,
    null,
    null,
    dealParams
  );

  const { masterKey, keyShards } = await generate();

  const { isSuccess } = await saveShards(
    address,
    output.data[0].cid,
    jwt,
    keyShards
  );

  await registerCIDtoRAAS(output.data[0].cid);

  return output.data;
};

export const uploadFolder = async (files, type, apiKey, setUploadProgress) => {
  const progressCallback = (progressData) => {
    const percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    setUploadProgress(percentageDone); // Update the progress state
  };
  let CIDs = [];

  const output = await lighthouse.upload(
    files,
    apiKey,
    true,
    null,
    progressCallback,
    dealParams
  );
  for (const file of output.data) {
    if (file.Name != "") {
      CIDs.push(file.Hash);
      let RAAS_Response = await registerCIDtoRAAS(file.Hash);
    }
  }
  // Create JSON object
  const json = {
    type: type,
    CIDs: CIDs,
  };

  const jsonBlob = new Blob([JSON.stringify(json)], {
    type: "application/json",
  });

  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob], `type.json`, {
    type: "application/json",
  });

  const jsonCID = await lighthouse.upload(
    [jsonFile],
    apiKey,
    false,
    null,
    progressCallback,
    dealParams
  );
  return [jsonCID.data.Hash];
};

export const jsonCIDsUpload = async (apiKey, type, CIDs) => {
  // Create JSON object
  const json = {
    type: type,
    CIDs: CIDs,
  };

  const jsonBlob = new Blob([JSON.stringify(json)], {
    type: "application/json",
  });

  // Create a File object from the Blob
  const jsonFile = new File([jsonBlob], `type.json`, {
    type: "application/json",
  });

  const jsonCID = await lighthouse.upload(
    [jsonFile],
    apiKey,
    false,
    null,
    null,
    dealParams
  );
  return [jsonCID.data.Hash];
};

/* Deploy file along with encryption */
export const uploadFileEncrypted = async (
  file,
  apiKey,
  address,
  jwt,
  setUploadProgress
) => {
  const progressCallback = (progressData) => {
    const percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    setUploadProgress(percentageDone); // Update the progress state
  };
  const output = await lighthouse.uploadEncrypted(
    file,
    apiKey,
    address,
    jwt,
    null,
    progressCallback,
    dealParams
  );

  const { masterKey, keyShards } = await generate();

  const { isSuccess } = await saveShards(
    address,
    output.data[0].cid,
    jwt,
    keyShards
  );

  await registerCIDtoRAAS(output.data[0].cid);

  return output.data;
};

const registerCIDtoRAAS = async (cid) => {
  const formData = new FormData();

  const defaultEndDate = new Date();
  defaultEndDate.setMonth(defaultEndDate.getMonth() + 12);
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
    return response.data;
  } catch (error) {
    console.error("Error registering job:", error);
  }
};

export const getDealStatusByCID = async (cid) => {
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

export const generateLighthouseJWT = async (address, signEncryption) => {
  const response = await getJWT(address, signEncryption);
  if (response.JWT) {
    localStorage.setItem(`lighthouse-jwt-${address}`, response.JWT);
    return response.JWT;
  }

  if (response.error) {
    return null;
  }
};

export const decrypt = async (cid, address, jwt) => {
  const conditions = await lighthouse.getAccessConditions(cid);
  let decrypted;
  const { error, shards } = await recoverShards(address, cid, jwt, 3);
  try {
    const { masterKey } = await recoverKey(shards);
    const fileType = "application/json";
    decrypted = await lighthouse.decryptFile(cid, masterKey, fileType);
  } catch {}
  /*
    Response: blob
  */
  return decrypted;
};

export const applyAccessConditions = async (
  cid,
  chainID,
  uid,
  address,
  jwt,
  resolver
) => {
  const conditions = [
    {
      id: 1,
      chain: LighthouseChains[chainID].name,
      method: "hasAccess",
      standardContractType: "Custom",
      contractAddress: resolver,
      returnValueTest: {
        comparator: "==",
        value: "true",
      },
      parameters: [":userAddress", uid],
      inputArrayType: ["address", "bytes32"],
      outputType: "bool",
    },
  ];
  const aggregator = "([1])";

  const response = await lighthouse.applyAccessCondition(
    address,
    cid,
    jwt,
    conditions,
    aggregator
  );

  let RAAS_Response = await registerCIDtoRAAS(cid);

  const { masterKey, keyShards } = await generate();

  const { isSuccess } = await saveShards(
    address,
    response.data.cid,
    jwt,
    keyShards
  );
  return response;
};
