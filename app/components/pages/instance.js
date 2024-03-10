import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Grid,
  GridItem,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";

import CsvViewer from "./CsvViewer"; // Import CsvViewer component
import CodeViewer from "./CodeViewer"; // Import CodeViewer component
import { useAccount, usePublicClient } from "wagmi";
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
  async function createGroup() {
    const createdGroup = await pushSign.chat.group.create("name", {
      description: "groupDescription",
      image: "groupImage",
      members: [],
      admins: [],
      private: false,
      rules: {
        entry: { conditions: [] },
        chat: { conditions: [] },
      },
    });
    await pushSign.chat.send(
      "e10af1ce34d46c8e644d0440e7ac57aa207fd6c5773f0229760a00d1fc8610da",
      {
        content: "Hello Bob!",
        type: "Text",
      }
    );
    const aliceChatHistoryWithBob = await pushSign.chat.history(
      "e10af1ce34d46c8e644d0440e7ac57aa207fd6c5773f0229760a00d1fc8610da"
    );
    console.log(aliceChatHistoryWithBob);
    const groupInfo = await pushSign.chat.group.info(createdGroup.chatId);

    console.log(groupInfo);
  }
  return (
    <Box p="4" className="mx-[20%]">
      <Box bg="gray.200" p="4" borderRadius="md" boxShadow="md" mb="4">
        <Image
          src="/path/to/image.jpg"
          alt="Profile Image"
          borderRadius="full"
          boxSize="150px"
          mb="4"
        />
        <Text fontSize="xl" fontWeight="bold">
          John Doe
        </Text>
        <Text fontSize="md" color="gray.500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <Badge colorScheme="green" borderRadius="full" px="2" py="1" mt="2">
          Open
        </Badge>
      </Box>

      <Tabs isFitted variant="soft-rounded" minWidth="200px">
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
              bg="gray.200"
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
