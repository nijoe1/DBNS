import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Badge,
  Image,
  Text,
  Button,
  Grid,
  GridItem,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Container } from "@/components//ui/container";
import CodeViewer from "./CodeViewer"; // Import CodeViewer component
import { useRouter } from "next/router";
import CreateNewInstanceCode from "@/components/contracts/createInstanceCode";
import { FaEllipsisV } from "react-icons/fa";
import { getSpaceInstances } from "@/utils/tableland";

const type = "openInstances"; // Sample type for instance type

// Sample data for database instances
const instancesData = [
  {
    InstanceID: 1,
    name: "Instance 1",
    about: "About Instance 1",
  },
  {
    InstanceID: 2,
    name: "Instance 2",
    about: "About Instance 2",
  },
  {
    InstanceID: 3,
    name: "Instance 3",
    about: "About Instance 3",
  },
  {
    InstanceID: 4,
    name: "Instance 4",
    about: "About Instance 4",
  },
  // Add more instances as needed
];

const InstanceCodes = () => {
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [viewAllCodes, setViewAllCodes] = useState(true);

  const router = useRouter();
  const spaceID = router.asPath.replace("/#/SingleSpacePage?id=", "");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [instances, setInstances] = useState({
    openInstances: [],
    openPrivateInstances: [],
    paidInstances: [],
    paidPrivateInstances: [],
  });

  async function getMetadataCID(data) {
    const temp = [];
    for (const item of data) {
      const metadataCIDLink = getIpfsGatewayUri(item.metadataCID);
      const res = await axios(metadataCIDLink);
      item.metadata = res.data; // obj that contains => name about imageUrl
      temp.push(item); // Push fetched JSON metadata directly
    }
    return temp;
  }

  async function fetchInstances() {
    const data = (await getSpaceInstances(spaceID))[0].instances;
    const dataObj = {}; // Initialize data object
    for (const key in data) {
      if (
        key === "openInstances" ||
        key === "openPrivateInstances" ||
        key === "paidInstances" ||
        key === "paidPrivateInstances"
      ) {
        const instancesArray = data[key].map(JSON.parse); // Parse each stringified JSON object
        dataObj[key] = await getMetadataCID(instancesArray);
      }
    }
    return dataObj;
  }

  useEffect(() => {
    fetchInstances().then((resp) => {
      setInstances(resp);
    });
  }, [spaceID]);

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

  const handleNewClick = async () => {
    onOpen();
  };

  const handleClick = (instance) => {
    setSelectedInstance(instance);
    setViewAllCodes(false);
  };

  const handleBack = () => {
    setSelectedInstance(null);
    setViewAllCodes(true);
  };

  return (
    <Container>
      {selectedInstance ? (
        <>
          <Button
            colorScheme="black"
            ml="3"
            className="bg-black/80 text-white"
            onClick={handleBack}
            variant="outline"
            mb="4"
          >
            Go back to All Codes
          </Button>
          <CodeViewer code={selectedInstance} onClose={handleBack} />
        </>
      ) : (
        <div>
          <Button
            onClick={handleNewClick}
            colorScheme="black"
            ml="3"
            className="bg-black/80 text-white"
            my="4"
          >
            Create Code
          </Button>
          <CreateNewInstanceCode
            onClose={onClose}
            isOpen={isOpen}
            spaceID={spaceID}
          />
          <Flex justify="center">
            <Grid
              templateColumns={[
                "1fr",
                "repeat(2, 1fr)",
                "repeat(3, 1fr)",
                "repeat(4, 1fr)",
              ]}
              gap={6}
              width="100%"
              className="flex md:justify-between lg:grid lg:px-3 relative"
            >
              {instancesData.map((instance) => (
                <GridItem key={instance.InstanceID}>
                  <Box
                    pb="4"
                    px="2"
                    pt="2"
                    bg="#333333"
                    borderRadius="md"
                    boxShadow="md"
                    position="relative"
                  >
                    <Box height="80px">
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        position="absolute"
                        top="0"
                        right="0"
                        zIndex="1"
                      >
                        <Menu zIndex="2">
                          <MenuButton
                            as={IconButton}
                            icon={<FaEllipsisV />}
                            aria-label="Options"
                            variant="black"
                            color="white"
                            size="sm"
                            mb="3"
                          />
                          <MenuList zIndex="15" scale={0.2}>
                            <MenuItem
                              onClick={() => console.log("Download dataset")}
                            >
                              Download Dataset
                            </MenuItem>
                            <MenuItem
                              onClick={() => console.log("Fork instance")}
                            >
                              Fork Instance
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                      <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        noOfLines={1}
                        color="white"
                        mb="1"
                        cursor="pointer"
                        onClick={() => handleClick(instance)}
                      >
                        {instance.name.slice(0, 30)}
                      </Text>
                      <Text
                        cursor="pointer"
                        fontSize="xs"
                        noOfLines={2}
                        color="white"
                        mb="1"
                        onClick={() => handleClick(instance)}
                      >
                        {instance.about.slice(0, 50)}
                      </Text>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </div>
      )}
    </Container>
  );
};

export default InstanceCodes;
