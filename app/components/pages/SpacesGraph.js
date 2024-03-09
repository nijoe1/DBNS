import React, { useState, useEffect } from "react";
import { Box, Flex, Input, Select } from "@chakra-ui/react";
import Tree from "react-d3-tree";
import { ethers } from "ethers";

const parentName = "dbns.eth";

const SpacesGraph = () => {
  const [treeData, setTreeData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);

  const navigateToHashRoute = (hashRoute) => {
    if (hashRoute === "/") {
      window.location = "/";
    } else {
      window.location.hash = hashRoute;
    }
  };

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


  useEffect(() => {
    // Generate tree data for the selected category or entire tree if no category is selected
    const initialTreeData = generateTreeData();
    setTreeData(initialTreeData);
  }, []);

  useEffect(() => {
    // Generate tree data for the selected category or entire tree if no category is selected
    const treeData = generateTreeData(selectedCategory);
    setTreeData(treeData);
  }, [selectedCategory]);

  // Generate tree data for the selected category or entire tree if no category is selected
  const generateTreeData = (selectedCategory) => {
    // Replace this with your actual data for the "dbns.eth" category
    const exampleData = {
      name: parentName,
      id: parentName,
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
          id: getTokenNode("Finance", parentName),
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
          id: getTokenNode("Technology", parentName),
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

    // Extract immediate children of the root node as categories
    const categories = exampleData.children.map((child) => child.name.split(".")[0]);

    // Set categories as options
    setCategoryOptions(categories.map((category) => ({ value: category, label: category })));

    // If a category is selected, find its subtree and return it
    if (selectedCategory) {
      return findCategoryNode(exampleData, selectedCategory);
    }
    // If no category is selected, return the entire tree data
    return exampleData;
  };

  // Function to generate token node
  const getTokenNode = (_parentNode, characterName) => {
    const abi = new ethers.AbiCoder();
    const parentNode = ethers.namehash(_parentNode);
    let subNodeBytes = stringToBytes(characterName);
    const LabelHash = ethers.keccak256(subNodeBytes);
    let newSubNodeBytes = abi.encode(["bytes32", "bytes32"], [parentNode, LabelHash]);
    const newSubNode = ethers.keccak256(newSubNodeBytes);
    console.log(characterName, _parentNode, " Node:", newSubNode);
    return newSubNode;
  };

  // Function to convert string to bytes
  const stringToBytes = (str) => {
    let bytes = Buffer.from(str);
    return "0x" + bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  };

  // Function to find the node for the selected category
  const findCategoryNode = (data, category) => {
    const categoryNode = { ...data };
    categoryNode.children = categoryNode.children.filter((child) => child.name.split(".")[0] === category);
    return categoryNode;
  };

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
        y="4"
        onClick={() => handleLabelClick(nodeDatum)}
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );

  return (
    <Flex direction="column" align="center" justify="center">
      {/* Search bar */}
      <Input
        placeholder="Search category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb={4}
        w="300px"
      />
      {/* Category dropdown */}
      <Select
        placeholder="All categories..."
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb={4}
        w="300px"
      >
        {categoryOptions.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </Select>
      {/* Display tree */}
      {treeData && (
        <Box
          id="treeWrapper"
          style={{ width: "70vw", height: "calc(100vh - 150px)" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Tree
            data={treeData}
            orientation="vertical"
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"
            renderCustomNodeElement={renderCustomNodeElement}
            translate={{ x: windowDimensions.width / 3.0, y: windowDimensions.height / 7 }}
            zoom={1}
            separation={{ siblings: 2, nonSiblings: 2 }}
            initialDepth={1}
          />
        </Box>
      )}
    </Flex>
  );
};

export default SpacesGraph;
