import React, { useState } from "react";
import {
  Flex,
  Box,
  Badge,
  Text,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Container } from "@/components//ui/container";
import CodeViewer from "./CodeViewer"; // Import CodeViewer component

// Sample data for database instances
const instancesData = [
  {
    id: 1,
    name: "Instance 1",
    about: "About Instance 1",
  },
  {
    id: 2,
    name: "Instance 2",
    about: "About Instance 2",
  },
  {
    id: 3,
    name: "Instance 3",
    about: "About Instance 3",
  },
  {
    id: 4,
    name: "Instance 4",
    about: "About Instance 4",
  },
  // Add more instances as needed
];

const InstanceCodes = () => {
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [viewAllCodes, setViewAllCodes] = useState(true);

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
          <Button onClick={handleBack} variant="outline" mb="4">
            Go back to All Codes
          </Button>
          <CodeViewer code={selectedInstance} onClose={handleBack} />
        </>
      ) : (
        <Flex justify="center" align="center" mt="4">
          <Grid
            templateColumns={[
              "1fr",
              "1fr 1fr",
              "1fr 1fr 1fr",
              "1fr 1fr 1fr 1fr",
            ]}
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
                    onClick={() => handleClick(instance)}
                  >
                    View Code
                  </Button>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Flex>
      )}
    </Container>
  );
};

export default InstanceCodes;
