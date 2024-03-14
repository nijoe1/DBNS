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
} from "@chakra-ui/react";
import { Container } from "@/components//ui/container";

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
  const navigateToHashRoute = (hashRoute) => {
    window.location.hash = hashRoute;
  };

  return (
    <Container>
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
    </Container>
  );
};

export default SingleSpacePage;
