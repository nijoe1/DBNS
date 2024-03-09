import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { Box } from "@chakra-ui/react";
import { ethers } from "ethers";
const parentName = "dbns.eth";

const subName = "subnode";

const subSubName = "subsubnode";

const subNodeName = subName + "." + parentName;

const subNode = getTokenNode(parentName, subName);

const subsubNode = getTokenNode(subSubName, subNodeName);

// Styled Nodes Tree component with custom node and label rendering
const StyledNodesTree = ({ data }) => {
  const navigateToHashRoute = (hashRoute) => {
    if (hashRoute == "/") {
      window.location = "/";
    } else {
      window.location.hash = hashRoute;
    }
  };

  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener to update window dimensions on resize
    window.addEventListener("resize", handleResize);

    // Initial call to set window dimensions
    handleResize();

    // Remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Define custom styles for different node types
  const nodeStyles = {
    root: { fill: "red", stroke: "#000", strokeWidth: "2px" },
    branch: { fill: "blue", stroke: "#000", strokeWidth: "2px" },
    leaf: { fill: "yellow", stroke: "#000", strokeWidth: "2px" },
  };

  // Handle click event on the label to navigate to the spaces page
  const handleLabelClick = (name) => {
    console.log(name);
    console.log(`Navigating to space: ${name.name}`);
    // Implement navigation logic here, for example:
    navigateToHashRoute(`/SingleSpacePage?id=${name.id}`);
  };

  // Handle click event on the circle to toggle nodes
  const handleCircleClick = (nodeDatum, toggleNode) => {
    toggleNode();
  };

  // Custom node and label rendering function
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle
        r="15"
        style={nodeStyles[nodeDatum.attributes?.nodeType]}
        onClick={() => handleCircleClick(nodeDatum, toggleNode)}
      />
      <text
        fill="black"
        strokeWidth="1"
        x="20"
        onClick={() => handleLabelClick(nodeDatum)}
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );

  return (
    <Box
      id="treeWrapper"
      style={{ width: "100%", height: "100%" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Tree
        data={data}
        orientation="vertical"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        renderCustomNodeElement={renderCustomNodeElement}
        translate={{ x: windowDimensions.width / 2.2, y: windowDimensions.height / 3.3 }}
        zoom={1}
        separation={{ siblings: 2, nonSiblings: 2 }}
        initialDepth={1}
      />
    </Box>
  );
};

// Example usage
// Example usage
const exampleData = {
  name: "DBNS.eth",
  id: "getAll",
  attributes: { nodeType: "root" },
  children: [
    {
      name: "Medical.DBNS.eth",
      attributes: { nodeType: "branch" },
      children: [
        { name: "Subcategory 1", attributes: { nodeType: "leaf" } },
        { name: "Subcategory 2", attributes: { nodeType: "leaf" } },
      ],
    },
    {
      name: "Finance.DBNS.eth",
      id: getTokenNode("Finance", "DBNS.eth"),
      attributes: { nodeType: "branch" },

      children: [
        {
          name: "trading",
          id: getTokenNode("trading", "Finance.DBNS.eth"),
          attributes: { nodeType: "leaf" },
        },
        {
          name: "Margin",
          id: getTokenNode("Margin", "Finance.DBNS.eth"),
          attributes: { nodeType: "leaf" },
        },
      ],
    },
    {
      name: "Technology.DBNS.eth",
      attributes: { nodeType: "branch" },
      id: getTokenNode("Technology", "DBNS.eth"),
      children: [
        {
          name: "AI.Technology.DBNS.eth",
          id: getTokenNode("AI", "Technology.DBNS.eth"),

          attributes: { nodeType: "branch" },

          children: [
            {
              name: "ML.AI.Technology.DBNS.eth",
              id: getTokenNode("ML", "ML.AI.Technology.DBNS.eth"),
              attributes: { nodeType: "leaf" },
            },
            {
              name: "DL.AI.Technology.DBNS.eth",
              id: getTokenNode("DL", "DL.AI.Technology.DBNS.eth"),
              attributes: { nodeType: "leaf" },
            },
          ],
        },
        {
          name: "P2P.Technology.DBNS.eth",
          id: getTokenNode("P2P", "Technology.DBNS.eth"),
          attributes: { nodeType: "leaf" },
        },
      ],
    },
  ],
};

const GraphViz = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", padding: "20px" }}>
      <StyledNodesTree data={exampleData} />
    </div>
  );
};

export default GraphViz;

function getTokenNode(_parentNode, characterName) {
  const abi = new ethers.AbiCoder();

  const parentNode = ethers.namehash(_parentNode);

  let subNodeBytes = stringToBytes(characterName);

  const LabelHash = ethers.keccak256(subNodeBytes);

  let newSubNodeBytes = abi.encode(
    ["bytes32", "bytes32"],
    [parentNode, LabelHash],
  );

  const newSubNode = ethers.keccak256(newSubNodeBytes);

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
