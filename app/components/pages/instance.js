import React, { useState, useEffect } from "react";
import { Box, Tabs, TabList, TabPanels, TabPanel, Tab } from "@chakra-ui/react";
import DatasetViewer from "@/components/ui/DatasetViewer";
import InstanceCodes from "@/components/ui/InstanceCodes";
import { useAccount } from "wagmi";
import ChatComponent from "@/components/ui/ChatComponent";
import { useSelector } from "react-redux";
import usePush from "@/hooks/usePush";
import { useRouter } from "next/router";
import { Container } from "@/components//ui/container";
import CardItem from "@/components/profile/CardItem";
import { getInstance } from "@/utils/tableland";
import { getIpfsGatewayUri, resolveIPNS } from "@/utils/IPFS";
import Loading from "@/components/Animation/Loading";

import axios from "axios";

const InstanceDetailsPage = () => {
  const { initializePush } = usePush();
  const router = useRouter();
  const pushSign = useSelector((state) => state.push.pushSign);
  const instanceID = router.asPath.replace("/#/instance?id=", "");
  const [instance, setInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const { address } = useAccount();

  async function getInstanceMetadata(item) {
    const metadataCIDLink = getIpfsGatewayUri(item.metadataCID);
    const res = await axios(metadataCIDLink);
    item.metadata = res.data;
    item.cid = await resolveIPNS(item.IPNS);
    return item;
  }

  async function initialize() {
    await initializePush();
  }

  async function fetchData() {
    try {
      const data = await getInstance(instanceID);
      const instanceData = await getInstanceMetadata(data[0]);
      setInstance(instanceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Mark loading as complete regardless of success or failure
    }
  }

  useEffect(() => {
    if (Object.keys(pushSign).length === 0) {
      initialize();
    }
    if (isLoading) {
      fetchData();
    }
  }, [router, isLoading]);

  return (
    <Container>
      {isLoading ? ( // Render loading state if data is still loading
        <div className="flex flex-col items-center mx-auto mt-[10%]">
          <Loading />
        </div>
      ) : (
        <div>
          {instance && ( // Render component only if instance data is available
            <div>
              <Box
                bg="#333333"
                className="flex flex-col items-center "
                borderRadius="md"
                boxShadow="md"
                mb={4}
              >
                <CardItem
                  profileInfo={{
                    name: instance?.metadata?.name || "Instance Name",
                    desc: instance?.metadata?.about || "Instance Description",
                    picture:
                      instance?.metadata?.imageUrl || "/path/to/image.jpg",
                  }}
                />
              </Box>
              <Tabs
                isFitted
                variant="soft-rounded"
                colorScheme="gray"
                minWidth={["150px", "200px"]}
              >
                <TabList mb="4">
                  <Tab>Dataset</Tab>
                  <Tab>Discussion</Tab>
                  <Tab>Code (2)</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <DatasetViewer
                      cid={instance?.cid}
                      IPNS={instance?.IPNS}
                      EncryptedKeyCID={instance?.IPNSEncryptedKey}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ChatComponent
                      pushSign={pushSign}
                      address={address}
                      chatID={instance?.chatID}
                    />
                  </TabPanel>
                  <TabPanel>
                    <InstanceCodes pushSign={pushSign} />
                  </TabPanel>
                </TabPanels>
              </Tabs>{" "}
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default InstanceDetailsPage;
