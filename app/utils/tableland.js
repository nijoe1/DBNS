import axios from "axios";
import { tables } from "@/constants/TablelandTables";
import { getTokenNode } from "@/utils/fns";
const TablelandGateway =
  "https://testnets.tableland.network/api/v1/query?statement=";

export const getSpaces = async () => {
  const getAllSchemasQuery =
    TablelandGateway +
    `SELECT
         *
      FROM
          ${tables.spaces}`;

  try {
    const result = await axios.get(getAllSchemasQuery);
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const getSpaceInstances = async (spaceID) => {
  const query =
    `SELECT 
      json_object(
          'paidPrivateInstances', COALESCE((
            SELECT json_group_array(row_data) 
            FROM (
              SELECT DISTINCT row_data 
              FROM (
                SELECT 
                  json_object('InstanceID', InstanceID, 'instanceOfSpace', instanceOfSpace, 'IPNS', IPNS, 'IPNSEncryptedKey', IPNSEncryptedKey, 'chatID', chatID, 'creator', creator, 'gatedContract', gatedContract, 'metadataCID', metadataCID, 'price', price) AS row_data 
                  FROM ${tables.spaceInstances} WHERE instanceType = '1' AND instanceOfSpace = '${spaceID.toLowerCase()}') AS subquery 
              WHERE row_data IS NOT NULL)), '[]'),
          'openPrivateInstances', COALESCE((
            SELECT json_group_array(row_data) 
            FROM (SELECT DISTINCT row_data FROM (
              SELECT json_object('InstanceID', InstanceID, 'instanceOfSpace', instanceOfSpace, 'IPNS', IPNS, 'IPNSEncryptedKey', IPNSEncryptedKey, 'chatID', chatID, 'creator', creator, 'gatedContract', gatedContract, 'metadataCID', metadataCID, 'price', price) AS row_data 
              FROM ${tables.spaceInstances} 
              WHERE instanceType = '2' AND instanceOfSpace = '${spaceID.toLowerCase()}') AS subquery 
            WHERE row_data IS NOT NULL)), '[]'),
          'paidInstances', COALESCE((
            SELECT json_group_array(row_data) 
            FROM (SELECT DISTINCT row_data 
              FROM (
                SELECT json_object('InstanceID', InstanceID, 'instanceOfSpace', instanceOfSpace, 'IPNS', IPNS, 'IPNSEncryptedKey', IPNSEncryptedKey, 'chatID', chatID, 'creator', creator, 'gatedContract', gatedContract, 'metadataCID', metadataCID, 'price', price) AS row_data 
                FROM ${tables.spaceInstances} 
              WHERE instanceType = '3' AND instanceOfSpace = '${spaceID.toLowerCase()}') AS subquery 
            WHERE row_data IS NOT NULL)), '[]'),
          'openInstances', COALESCE((
            SELECT json_group_array(row_data) 
            FROM (SELECT DISTINCT row_data 
              FROM (
                SELECT json_object('InstanceID', InstanceID, 'instanceOfSpace', instanceOfSpace, 'IPNS', IPNS, 'IPNSEncryptedKey', IPNSEncryptedKey, 'chatID', chatID, 'creator', creator, 'gatedContract', gatedContract, 'metadataCID', metadataCID, 'price', price) AS row_data 
                FROM ${tables.spaceInstances} WHERE instanceType = '4' AND instanceOfSpace = '${spaceID.toLowerCase()}') AS subquery 
              WHERE row_data IS NOT NULL)), '[]')
      ) AS instances
    FROM (SELECT DISTINCT instanceOfSpace FROM ${tables.spaceInstances}) AS unique_instances;
`;

  try {
    const fullUrl = `${TablelandGateway}${encodeURIComponent(query)}`;

    const result = await axios.get(fullUrl);
    return result.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Function to recursively build children
async function buildChildren(parentID, parentHierarchy, sampleSpacesData) {
  const children = [];
  for (const node of sampleSpacesData) {
    if (node.DBSubSpaceOfID.toLowerCase() === parentID.toLowerCase()) {
      const childHierarchy = parentHierarchy
        ? `${node.DBSubSpaceName}.${parentHierarchy}`
        : node.DBSubSpaceName;
      const childChildren = await buildChildren(
        node.DBSpaceID,
        childHierarchy,
        sampleSpacesData,
      );
      const nodeType = childChildren.length ? "branch" : "leaf"; // Determine node type
      const childObject = {
        name: childHierarchy + ".dbns.fil",
        id: node.DBSpaceID,
        attributes: { nodeType: nodeType },
        children: childChildren,
      };
      children.push(childObject);
    }
  }
  return children;
}

export const constructObject = async () => {
  const sampleSpacesData = await getSpaces();

  const rootObject = {
    name: "dbns.fil",
    id: "0x0000000000000000000000000000000000000000000000000000000000000000",
    attributes: { nodeType: "root" },
    children: await buildChildren(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "",
      sampleSpacesData,
    ), // Start with null as the parentID and empty string as the parentHierarchy
  };
  return rootObject;
};
