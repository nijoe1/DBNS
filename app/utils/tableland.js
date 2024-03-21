import axios from "axios";
import { tables } from "@/constants/TablelandTables";
import { getTokenNode } from "@/utils/fns";
const TablelandGateway =
  "https://testnets.tableland.network/api/v1/query?statement=";

export const getSpaces = async (chainId) => {
  const getAllSchemasQuery =
    TablelandGateway +
    `SELECT
         *
      FROM
          ${tables[chainId].spaces}`;

  try {
    const result = await axios.get(getAllSchemasQuery);
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
        name: childHierarchy + ".dbbns.eth",
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
  const sampleSpacesData = await getSpaces(11155111);
  console.log(sampleSpacesData);
  const rootObject = {
    name: "dbbns.eth",
    id: "0x0000000000000000000000000000000000000000000000000000000000000000",
    attributes: { nodeType: "root" },
    children: await buildChildren(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "",
      sampleSpacesData,
    ), // Start with null as the parentID and empty string as the parentHierarchy
  };
  console.log(rootObject);
  return rootObject;
};
