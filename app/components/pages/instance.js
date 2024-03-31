import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import DatasetViewer from "@/components/ui/DatasetViewer";
import InstanceCodes from "@/components/ui/InstanceCodes";
import { useAccount } from "wagmi";
import ChatComponent from "@/components/ui/ChatComponent";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Container } from "@/components//ui/container";
import CardItem from "@/components/profile/CardItem";
import {
  getInstance,
  getHasAccess,
  getInstanceMembers,
} from "@/utils/tableland";
import { getIpfsGatewayUri, resolveIPNS } from "@/utils/IPFS";
import Subscribe from "@/components/contracts/subscribe";
import Loading from "@/components/Animation/Loading";

import axios from "axios";

const InstanceDetailsPage = () => {
  const router = useRouter();
  const pushSign = useSelector((state) => state.push.pushSign);
  const instanceID = router.asPath.replace("/#/instance?id=", "");
  const [instance, setInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [hasAccess, setHasAccess] = useState(false); // State to manage access [true/false
  const [instanceMembers, setInstanceMembers] = useState([]); // State to manage instance members [array]
  const { address } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function getInstanceMetadata(item) {
    const metadataCIDLink = getIpfsGatewayUri(item.metadataCID);
    const res = await axios(metadataCIDLink);
    item.metadata = res.data;
    item.cid = await resolveIPNS(item.IPNS);
    return item;
  }

  async function fetchData() {
    try {
      const data = await getInstance(instanceID);
      let members = await getInstanceMembers(instanceID);
      let temp = [];
      temp.push(data[0].creator);
      members.forEach((member) => {
        temp.push(member.member.toLowerCase());
      });
      setInstanceMembers(temp);
      console.log("Members:", temp);
      const instanceData = await getInstanceMetadata(data[0]);
      console.log("Instance Data:", instanceData);
      const hasAccess = await getHasAccess(instanceID, address);
      setHasAccess(hasAccess);
      setInstance(instanceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Mark loading as complete regardless of success or failure
    }
  }

  useEffect(() => {
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
                p={["2", "4"]}
              >
                <CardItem
                  profileInfo={{
                    name: instance?.metadata?.name || "Instance Name",
                    desc: instance?.metadata?.about || "Instance Description",
                    picture:
                      instance?.metadata?.imageUrl || "/path/to/image.jpg",
                    members: instanceMembers || [],
                  }}
                  pushSign={pushSign}
                />
                {!(
                  hasAccess ||
                  instanceMembers.find(
                    (member) =>
                      member?.toLowerCase() === address?.toLowerCase(),
                  )
                ) && (
                  <div>
                    <Button
                      className="border-white border p-3 rounded-md "
                      colorScheme="black"
                      size="mb"
                      mb={3}
                      onClick={() => {
                        onOpen();
                      }}
                    >
                      Subscribe
                    </Button>
                    <Subscribe
                      instanceID={instanceID}
                      isOpen={isOpen}
                      onClose={onClose}
                      price={instance?.price || 0}
                    />
                  </div>
                )}
              </Box>
              <Box
                bg="#333333"
                borderRadius="md"
                height={1000}
                boxShadow="md"
                mb={4}
                p={["2", "4"]}
              >
                {(hasAccess ||
                  instanceMembers.find(
                    (member) => member.toLowerCase() === address.toLowerCase(),
                  )) && (
                  // <Tabs
                  //   isFitted
                  //   variant="soft-rounded"
                  //   colorScheme="gray"
                  //   minWidth={["150px", "200px"]}
                  // >
                  <Tabs
                    isFitted
                    variant="enclosed"
                    className="text-white"
                    minWidth={["150px", "200px"]}
                    colorScheme="white"
                    mb="4"
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
                          isEncrypted={instance?.price > 0}
                          spaceID={instanceID}
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
                  </Tabs>
                )}
              </Box>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default InstanceDetailsPage;
