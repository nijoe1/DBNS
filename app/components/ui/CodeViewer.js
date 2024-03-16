import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import NotebookPreviewer from "./NotebookPreviewer";
import ForumComponent from "./ForumComponent";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";

import usePush from "@/hooks/usePush";
const CodeViewer = ({ code, onClose }) => {
  const { initializePush } = usePush();
  const pushSign = useSelector((state) => state.push.pushSign);
  const { address } = useAccount();

  useEffect(() => {
    async function initialize() {
      await initializePush();
    }
    if (Object.keys(pushSign).length === 0) {
      initialize();
    }
  }, []);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  return (
    <Box
      width="100%"
      maxWidth="1000px"
      mx="auto"
      borderRadius="md"
      p={4}
      overflow="auto"
      boxShadow="lg"
    >
      {/* Code creator profile */}
      <Box mb={4}>
        <Text fontWeight="bold">Code Creator Profile:</Text>
        <Box mt={2}>
          <Text>{code.creatorName}</Text>
          <Text>{code.creatorAddress}</Text>
          <Text>{code.creatorAbout}</Text>
          {/* Add avatar here if available */}
        </Box>
      </Box>

      {/* Tabs for notebook, discussions, input dataset, and output */}
      <Tabs index={tabIndex} onChange={handleTabChange} variant="enclosed">
        <TabList>
          <Tab>Notebook</Tab>
          <Tab>Discussions</Tab>
          <Tab>Output</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box maxHeight="500px" overflowY="auto">
              <NotebookPreviewer code={code} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box maxHeight="500px" overflowY="auto">
              <ForumComponent pushSign={pushSign} address={address} />
            </Box>
          </TabPanel>
          <TabPanel>{/* Input dataset content goes here */}</TabPanel>
          <TabPanel>{/* Output content goes here */}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CodeViewer;
