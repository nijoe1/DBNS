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

// const sampleSpacesData = [
//   {
//     DBSpaceID: "1",
//     DBSubSpaceOfID: null,
//     DBSpaceName: "Medical",
//     DBSubSpaceOfName: null,
//   },
//   {
//     DBSpaceID: "2",
//     DBSubSpaceOfID: "1",
//     DBSpaceName: "Subcategory1",
//     DBSubSpaceOfName: "Medical",
//   },
//   {
//     DBSpaceID: "3",
//     DBSubSpaceOfID: "1",
//     DBSpaceName: "Subcategory2",
//     DBSubSpaceOfName: "Medical",
//   },
//   {
//     DBSpaceID: "5",
//     DBSubSpaceOfID: "4",
//     DBSpaceName: "Trading",
//     DBSubSpaceOfName: "Finance",
//   },
//   {
//     DBSpaceID: "6",
//     DBSubSpaceOfID: "4",
//     DBSpaceName: "Margin",
//     DBSubSpaceOfName: "Finance",
//   },
//   {
//     DBSpaceID: "7",
//     DBSubSpaceOfID: null,
//     DBSpaceName: "Technology",
//     DBSubSpaceOfName: null,
//   },
//   {
//     DBSpaceID: "8",
//     DBSubSpaceOfID: "7",
//     DBSpaceName: "AI",
//     DBSubSpaceOfName: "Technology",
//   },
//   {
//     DBSpaceID: "9",
//     DBSubSpaceOfID: "8",
//     DBSpaceName: "ML",
//     DBSubSpaceOfName: "AI",
//   },
//   {
//     DBSpaceID: "10",
//     DBSubSpaceOfID: "8",
//     DBSpaceName: "DeepLearning",
//     DBSubSpaceOfName: "AI",
//   },
//   {
//     DBSpaceID: "11",
//     DBSubSpaceOfID: "7",
//     DBSpaceName: "P2P",
//     DBSubSpaceOfName: "Technology",
//   },
//   {
//     DBSpaceID: "12",
//     DBSubSpaceOfID: "11",
//     DBSpaceName: "ML",
//     DBSubSpaceOfName: "P2P",
//   },
// ];

// export const constructObject = () => {
//   // Fetch spaces data from SQLite
//   const spacesData = sampleSpacesData;

//   function buildChildren(parentName, parentNodeName) {
//     const children = [];
//     // Filter records with current parentName
//     const filteredData = spacesData.filter(
//       (record) => record.DBSubSpaceOfName === parentName
//     );
//     filteredData.forEach((childData) => {
//       const name = `${childData.DBSpaceName}.${parentNodeName}`;
//       const id = getTokenNode(childData.DBSpaceName, parentNodeName);
//       const subChildren = buildChildren(childData.DBSpaceName, name); // Use childData.DBSpaceName as the new parentName

//       const nodeType = subChildren.length > 0 ? "branch" : "leaf"; // Check if the node has children

//       const childObject = {
//         name: name,
//         id: id,
//         attributes: { nodeType: nodeType },
//         children: subChildren,
//       };

//       children.push(childObject);
//     });

//     return children;
//   }

//   // Create the root object with populated children
//   const rootObject = {
//     name: "DBNS.eth",
//     id: "rootID",
//     attributes: { nodeType: "root" },
//     children: buildChildren(null, "DBNS.eth"), // Start with null as the parentName and "DBNS.eth" as the parentNodeName
//   };
//   console.log(rootObject);
//   return rootObject;
// };
// Sample data
const sampleSpacesData = [
  { DBSpaceID: "1", DBSubSpaceOfID: null, DBSpaceName: "Medical" },
  { DBSpaceID: "2", DBSubSpaceOfID: "1", DBSpaceName: "Subcategory1" },
  { DBSpaceID: "3", DBSubSpaceOfID: "1", DBSpaceName: "Subcategory2" },
  { DBSpaceID: "4", DBSubSpaceOfID: null, DBSpaceName: "Finance" },
  { DBSpaceID: "5", DBSubSpaceOfID: "4", DBSpaceName: "Trading" },
  { DBSpaceID: "6", DBSubSpaceOfID: "4", DBSpaceName: "Margin" },
  { DBSpaceID: "7", DBSubSpaceOfID: null, DBSpaceName: "Technology" },
  { DBSpaceID: "8", DBSubSpaceOfID: "7", DBSpaceName: "AI" },
  { DBSpaceID: "9", DBSubSpaceOfID: "8", DBSpaceName: "ML" },
  { DBSpaceID: "10", DBSubSpaceOfID: "8", DBSpaceName: "DeepLearning" },
  { DBSpaceID: "11", DBSubSpaceOfID: "7", DBSpaceName: "P2P" },
  { DBSpaceID: "12", DBSubSpaceOfID: "11", DBSpaceName: "ML" },
  { DBSpaceID: "13", DBSubSpaceOfID: "11", DBSpaceName: "DeepLearning" },
];

// Function to recursively build children
function buildChildren(parentID, parentHierarchy) {
  const children = [];
  sampleSpacesData.forEach((node) => {
    if (node.DBSubSpaceOfID === parentID) {
      const childHierarchy = parentHierarchy
        ? `${node.DBSpaceName}.${parentHierarchy}`
        : node.DBSpaceName;
      const childChildren = buildChildren(node.DBSpaceID, childHierarchy);
      const nodeType = childChildren.length ? "branch" : "leaf"; // Determine node type
      const childObject = {
        name: childHierarchy+".dbns.eth",
        id: getTokenNode(node.DBSpaceName,parentHierarchy),
        attributes: { nodeType: nodeType },
        children: childChildren,
      };
      children.push(childObject);
    }
  });
  return children;
}

export const constructObject = () => {
  const rootObject = {
    name: "DBNS.eth",
    id: "rootID",
    attributes: { nodeType: "root" },
    children: buildChildren(null, ""), // Start with null as the parentID and empty string as the parentHierarchy
  };
  console.log(rootObject);
  return rootObject;
};
