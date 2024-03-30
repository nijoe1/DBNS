import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Image,
  Badge,
} from "@chakra-ui/react";
import NotebookPreviewer from "./NotebookPreviewer";
import ForumComponent from "./ForumComponent";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";

import usePush from "@/hooks/usePush";
import { Button } from "./Button";
const CodeViewer = ({ code, onClose }) => {
  const toast = useToast();
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

  const handleToDo = () => {
    toast({
      title: "Comming soon sir 🚀",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
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
      <Box mb={4} className="text-white">
        <div className="flex flex-wrap items-center gap-2 p-3">
          <Text fontWeight="bold">Code Creator :</Text>

          <Text>{code.profile.name}</Text>
          <Image width={25} src={code.profile.picture} borderRadius="lg" />
          <Badge
            className="text-black bg-black"
            borderRadius="full"
            fontSize="sm"
            cursor={"pointer"}
            onClick={() => {
              router.push({
                pathname: "",
                hash: "/profile?address=" + code.creator,
              });
            }}
          >
            {`${code.creator?.slice(0, 6)}...${code.creator?.slice(-6)}`}
          </Badge>
          <Text>{code.desc}</Text>
          {/* Add avatar here if available */}
        </div>
      </Box>

      {/* Tabs for notebook, discussions, input dataset, and output */}
      <Tabs
        isFitted
        variant="enclosed"
        className="text-white"
        index={tabIndex}
        onChange={handleTabChange}
        colorScheme="white"
        mb="4"
      >
        <TabList>
          <Tab>Notebook</Tab>
          <Tab>Discussions</Tab>
          <Tab>Compute Output</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box maxHeight="500px" overflowY="auto">
              <NotebookPreviewer code={code.codeCID} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box maxHeight="500px" overflowY="auto">
              <ForumComponent
                pushSign={pushSign}
                address={address}
                chatID={code.chatID}
              />
            </Box>
          </TabPanel>
          <TabPanel>
            <div className="flex flex-col items-center text-center p-5">
              {/* Compute output */}
              <Text>Compute output with Bacalhau</Text>
              <Image src="/images/bacalhau.png" maxHeight="100" />{" "}
              <Button onClick={handleToDo}>Compute Output</Button>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CodeViewer;
