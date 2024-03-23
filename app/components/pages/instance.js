import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Image,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";

import DatasetViewer from "@/components/ui/DatasetViewer"; // Import CsvViewer component
import InstanceCodes from "@/components/ui/InstanceCodes"; // Import CodeViewer component
import { useAccount } from "wagmi";
import ChatComponent from "@/components/ui/ChatComponent";
import { useSelector } from "react-redux";
import usePush from "@/hooks/usePush";
import { useRouter } from "next/router";
import { Container } from "@/components//ui/container";
import Profile from "@/components/ui/Profile";
import { getInstance } from "@/utils/tableland";
import { createName, getIpfsGatewayUri, resolveIPNS } from "@/utils/IPFS";
import axios from "axios";
const InstanceDetailsPage = () => {
  const { initializePush } = usePush();
  const router = useRouter();
  const pushSign = useSelector((state) => state.push.pushSign);
  const instanceID = router.asPath.replace("/#/instance?id=", "");
  const [instance, setInstance] = useState();
  const [fetched, setFetched] = useState(false);
  const { address } = useAccount();

  async function getInstanceMetadata(item) {
    const metadataCIDLink = getIpfsGatewayUri(item.metadataCID);
    const res = await axios(metadataCIDLink);
    item.metadata = res.data; // obj that contains => name about imageUrl
    item.cid = await resolveIPNS(item.IPNS);

    return item;
  }
  async function initialize() {
    await initializePush();
  }
  async function get() {
    let data = await getInstance(instanceID);
    data = await getInstanceMetadata(data[0]);
    console.log(data);
    setInstance(data);
  }

  useEffect(() => {
    if (Object.keys(pushSign).length === 0) {
      initialize();
    }
    if (!fetched) {
      setFetched(true);
      get();
    }
  }, [router]);

  return (
    <Container>
      <Box p={["2", "4"]}>
        <Box
          bg="#333333"
          className="flex flex-col items-center "
          p="4"
          borderRadius="md"
          boxShadow="md"
          mb="4"
        >
          <Profile onProfile={false} />
        </Box>

        <Tabs
          isFitted
          variant="soft-rounded"
          colorScheme="gray" // Change the color scheme to blue
          minWidth={["150px", "200px"]}
        >
          <TabList mb="4">
            <Tab>Dataset</Tab>
            <Tab>Discussion</Tab>
            <Tab>Code (2)</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* Dataset Tab */}
              <Box mt="4"></Box>
              <DatasetViewer cid={instance?.cid} />
            </TabPanel>
            <TabPanel>
              {/* Chat Tab */}

              <ChatComponent pushSign={pushSign} address={address} />
            </TabPanel>
            <TabPanel>
              <InstanceCodes />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default InstanceDetailsPage;
