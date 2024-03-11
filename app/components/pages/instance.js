import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";

import CsvViewer from "./CsvViewer"; // Import CsvViewer component
import CodeViewer from "./CodeViewer"; // Import CodeViewer component
import { useAccount } from "wagmi";
import ChatComponent from "@/components/ChatComponent";
import { useSelector } from "react-redux";
import usePush from "@/hooks/usePush";
import { useRouter } from "next/router";

const InstanceDetailsPage = () => {
  const { initializePush } = usePush();
  const router = useRouter();
  const pushSign = useSelector((state) => state.push.pushSign);
  console.log(pushSign);
  const { address } = useAccount();

  useEffect(() => {
    async function initialize() {
      await initializePush();
    }
    if (Object.keys(pushSign).length === 0) {
      initialize();
    }
  }, [router]);

  return (
    <Box p={["2", "4"]} className="mx-auto" maxW={["90%", "80%", "70%"]}>
      <Box bg="#727272" p="4" borderRadius="md" boxShadow="md" mb="4">
        <Image
          src="/path/to/image.jpg"
          alt="Profile Image"
          borderRadius="full"
          boxSize={["120px", "150px"]}
          mb="4"
        />
        <Text fontSize={["lg", "xl"]} fontWeight="bold" color="#f0f0f0">
          John Doe
        </Text>
        <Text fontSize={["sm", "md"]} color="#f0f0f0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <Badge colorScheme="green" borderRadius="full" px="2" py="1" mt="2">
          Open
        </Badge>
      </Box>

      <Tabs
        isFitted
        variant="soft-rounded"
        colorScheme="blue" // Change the color scheme to blue
        minWidth={["150px", "200px"]}
      >
        <TabList mb="4">
          <Tab>Dataset</Tab>
          <Tab>Chat</Tab>
          <Tab>Codes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {/* Dataset Tab */}
            <Box minHeight="200px" overflow="auto">
              <CsvViewer />
              <Box mt="4">
                <button>Download Dataset</button>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            {/* Chat Tab */}
            <Box
              minHeight="200px"
              overflow="auto"
              p="4"
              bg="#424242"
              borderRadius="md"
              boxShadow="md"
            >
              <ChatComponent pushSign={pushSign} address={address} />
            </Box>
          </TabPanel>
          <TabPanel>
            <CodeViewer />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default InstanceDetailsPage;
