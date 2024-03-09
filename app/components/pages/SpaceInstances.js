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
    <Flex justify="center" align="center" mt="4">
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {instancesData.map((instance) => (
          <GridItem key={instance.id}>
            <Box
              p="4"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
            >
              <Image src={instance.imageUrl} alt={instance.name} />
              <Badge colorScheme="green" mt="2">
                Open
              </Badge>
              <Text fontWeight="semibold" mt="2">
                {instance.name}
              </Text>
              <Text mt="2">{instance.about}</Text>
              <Button
                colorScheme="blue"
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
  );
};

export default SingleSpacePage;
