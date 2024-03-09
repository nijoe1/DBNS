import React from "react";
import { Box, Badge, Tab, TabList, TabPanel, TabPanels, Tabs, Image, Text, Grid, GridItem } from "@chakra-ui/react";
import CsvViewer from "./CsvViewer"; // Import CsvViewer component
import CodeViewer from "./CodeViewer"; // Import CodeViewer component

const InstanceDetailsPage = () => {
  return (
    <Box p="4" className="mx-[20%]">
      <Box bg="gray.200" p="4" borderRadius="md" boxShadow="md" mb="4">
        <Image src="/path/to/image.jpg" alt="Profile Image" borderRadius="full" boxSize="150px" mb="4" />
        <Text fontSize="xl" fontWeight="bold">John Doe</Text>
        <Text fontSize="md" color="gray.500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        <Badge colorScheme="green" borderRadius="full" px="2" py="1" mt="2">Open</Badge>
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
            <Box minHeight="200px" overflow="auto" p="4" bg="gray.200" borderRadius="md" boxShadow="md">
              Chat component goes here...
            </Box>
          </TabPanel>
          <TabPanel>
            {/* Codes Tab */}
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              {/* Code Cards */}
              <GridItem colSpan={2}>
                <CodeViewer />
              </GridItem>
              {/* Code Markdown */}
              {/* <GridItem colSpan={1}> */}
                {/* Markdown component goes here... */}
                {/* <Box minHeight="200px" overflow="auto" p="4" bg="gray.200" borderRadius="md" boxShadow="md">
                  Markdown component goes here...
                </Box>
              </GridItem> */}
              {/* IPYNB Cell */}
              {/* <GridItem colSpan={3}>
                <Box minHeight="200px" overflow="auto" p="4" bg="gray.200" borderRadius="md" boxShadow="md">
                  IPYNB Cell component goes here...
                </Box>
              </GridItem> */}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default InstanceDetailsPage;
