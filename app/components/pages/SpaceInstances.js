import React from "react";
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
} from "@chakra-ui/react";
import { Container } from "@/components/ui/container";
import { useRouter } from "next/router";
import CreateNewInstance from "../contracts/createNewInstance";
import { createName } from "@/utils/IPFS";

// Sample data for database instances
const instancesData = [
  {
    id: 1,
    name: "Instance 1",
    about: "About Instance 1",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Instance 2",
    about: "About Instance 2",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Instance 3",
    about: "About Instance 3",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Instance 4",
    about: "About Instance 4",
    imageUrl: "https://via.placeholder.com/150",
  },
  // Add more instances as needed
];

const SingleSpacePage = () => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
    console.log("Create new instance");
    console.log(isOpen);
    await createName();
  };
  return (
    <Container>
      <Button onClick={handleNewClick}>Create New Instance</Button>
      <CreateNewInstance
        onClose={onClose}
        isOpen={isOpen}
        spaceID={
          "0x726d4f081a188bae99c1fc67b9c281d628040d90dddab3d6f7dbdd06b3a89868"
        }
      />
      <Flex justify="center" align="center" mt="4">
        <Grid
          templateColumns={["1fr", "1fr 1fr", "1fr 1fr 1fr", "1fr 1fr 1fr 1fr"]}
          gap={6}
          width="100%"
          className="flex md:justify-between lg:grid lg:px-3 relative"
        >
          {instancesData.map((instance) => (
            <GridItem key={instance.id}>
              <Box
                p="4"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                bg="#333333"
                className="flex flex-col items-center"
              >
                <Image src={instance.imageUrl} alt={instance.name} />
                <Badge colorScheme="green" mt="2">
                  Open
                </Badge>
                <Text fontWeight="semibold" mt="2" color="white">
                  {instance.name}
                </Text>
                <Text mt="2" color="white">
                  {instance.about}
                </Text>
                <Button
                  className="bg-white text-black border border-black"
                  mt="2"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToHashRoute("/instance");
                  }}
                >
                  Go to Instance
                </Button>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Flex>
      <createNewInstance onClose={onClose} isOpen={isOpen} spaceID={"1"} />
    </Container>
  );
};

export default SingleSpacePage;
