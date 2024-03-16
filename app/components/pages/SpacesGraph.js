import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { Container } from "@/components//ui/container";
import Tree from "react-d3-tree";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const parentName = "dbns.eth";

const SpacesGraph = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newNodeName, setNewNodeName] = useState("");

  const router = useRouter();
  const [treeData, setTreeData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);

  const navigateToHashRoute = (hashRoute) => {
    if (hashRoute == "/") {
      router.push({
        pathname: hashRoute,
      });
    } else {
      router.push({
        pathname: "",
        hash: hashRoute,
      });
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
    let node = getTokenNode("fsdfsdfsdfdf", "eth");
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
                  name: "DeepLearning.AI.Technology.DBNS.eth",
                  id: getTokenNode("DL", "DL.AI.Technology.DBNS.eth"),
                  attributes: { nodeType: "leaf" },
                },
              ],
            },
            {
              name: "P2P.Technology.DBNS.eth",
              id: getTokenNode("P2P", "Technology.DBNS.eth"),
              attributes: { nodeType: "leaf" },
              children: [
                {
                  name: "ML.AI.Technology.DBNS.eth",
                  id: getTokenNode("ML", "ML.AI.Technology.DBNS.eth"),
                  attributes: { nodeType: "leaf" },
                },
                {
                  name: "DeepLearning.AI.Technology.DBNS.eth",
                  id: getTokenNode("DL", "DL.AI.Technology.DBNS.eth"),
                  attributes: { nodeType: "leaf" },
                },
              ],
            },
          ],
        },
      ],
    };

    // Extract immediate children of the root node as categories
    const categories = exampleData.children.map(
      (child) => child.name.split(".")[0],
    );

    // Set categories as options
    setCategoryOptions(
      categories.map((category) => ({ value: category, label: category })),
    );

    // If a category is selected, find its subtree and return it
    if (selectedCategory) {
      return findCategoryNode(exampleData, selectedCategory);
    }
    // If no category is selected, return the entire tree data
    return exampleData;
  };

  // Function to generate token node
  const getTokenNode = (_parentNode, characterName) => {
    const abi = new ethers.utils.AbiCoder();
    const parentNode = ethers.utils.namehash(_parentNode);
    let subNodeBytes = stringToBytes(characterName);
    const LabelHash = ethers.utils.keccak256(subNodeBytes);
    console.log(
      " Node:",
      ethers.utils.keccak256(
        abi.encode(
          ["bytes32", "bytes32"],
          [
            ethers.utils.namehash("eth"),
            ethers.utils.keccak256(stringToBytes("dscdsc")),
          ],
        ),
      ),
    );

    let newSubNodeBytes = abi.encode(
      ["bytes32", "bytes32"],
      [parentNode, LabelHash],
    );
    const newSubNode = ethers.utils.keccak256(newSubNodeBytes);
    return newSubNode;
  };

  // Function to convert string to bytes
  const stringToBytes = (str) => {
    let bytes = Buffer.from(str);
    return (
      "0x" +
      bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
    );
  };

  // Function to find the node for the selected category
  const findCategoryNode = (data, category) => {
    const categoryNode = { ...data };
    categoryNode.children = categoryNode.children.filter(
      (child) => child.name.split(".")[0] === category,
    );
    return categoryNode;
  };

  // Define custom styles for different node types
  const nodeStyles = {
    root: { fill: "#424242", stroke: "#000", strokeWidth: "2px" },
    branch: { fill: "#727272", stroke: "#000", strokeWidth: "2px" },
    leaf: { fill: "#ecf1f6", stroke: "#000", strokeWidth: "2px" },
  };

  // Handle click event on the label to navigate to the spaces page
  const handleLabelClick = (name) => {
    // Implement navigation logic here, for example:
    navigateToHashRoute(`/SingleSpacePage?id=${name.id}`);
  };

  // Handle click event on the circle to toggle nodes
  const handleCircleClick = (nodeDatum, toggleNode) => {
    toggleNode();
  };

  const handleNewClick = (nodeDatum, toggleNode) => {
    onOpen();
  };

  const handleCreate = () => {
    // Validate newNodeName
    // Add your validation logic here to ensure it's not equal to any existing children node names

    // Close the modal after creating the new subnode
    onClose();
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
        y="-2"
        onClick={() => handleLabelClick(nodeDatum)}
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.name}
      </text>
      <rect
        x="30"
        y="4"
        width="40"
        height="20"
        rx="5"
        fill="gray"
        stroke="black"
        strokeWidth="1"
        onClick={() => handleLabelClick(nodeDatum)}
        style={{ cursor: "pointer" }}
      />
      <text
        fill="black"
        strokeWidth="1"
        x="50"
        y="15"
        textAnchor="middle"
        alignmentBaseline="middle"
        onClick={() => handleNewClick(nodeDatum)}
        style={{ cursor: "pointer" }}
      >
        {"new"}
      </text>
    </g>
  );

  return (
    <Container>
      <Box
        p="4"
        borderWidth="3px"
        borderColor={"black"}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        height="calc(100vh - 150px)" // Adjust height dynamically
        display="flex"
        alignItems="center"
        className="mx-[3%] "
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          height="100%"
          width="100%"
        >
          {/* Category dropdown */}
          <Select
            placeholder="All categories..."
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            mb={4}
            mt="6%"
            width={["90%", "70%", "50%"]} // Adjust width for different screen sizes
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
              width="100%"
              height="calc(100vh - 250px)" // Adjust height dynamically
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
                translate={{
                  x: windowDimensions.width / 3.0,
                  y: windowDimensions.height / 7,
                }}
                zoom={1}
                separation={{ siblings: 2, nonSiblings: 2 }}
                initialDepth={1}
              />
            </Box>
          )}
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent bg="black" color="white" borderRadius="md">
            <ModalHeader>Create New Subnode</ModalHeader>
            <ModalBody>
              <Input
                placeholder="Enter subnode name"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCreate}>
                Create
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
};

export default SpacesGraph;
