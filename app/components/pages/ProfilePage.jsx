import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Center,
} from "@chakra-ui/react";
import Profile from "@/components/profile/Profile";

const ProfilePage = () => {
  return (
    <div className="mt-[5%] max-w-[1200px] mx-auto">
      <Box
        p={["2", "4"]}
        className="mx-[5%]"
        bg="#333333"
        borderRadius="xl"
        boxShadow="md"
      >
        <Profile onProfile={true} />

        <Tabs isFitted variant="soft-rounded" colorScheme="gray" mb="4">
          <TabList mb="4">
            <Tab>Created Datasets</Tab>
            <Tab>Notifications</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box minHeight="200px" overflow="auto">
                {/* Render user created and subscribed datasets */}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box minHeight="200px" overflow="auto">
                {/* Render user notifications */}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};

export default ProfilePage;
