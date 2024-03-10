import React from "react";
import { Box, Text } from "@chakra-ui/react";
import NotebookPreviewer from "./NotebookPreviewer";
const CodeViewer = () => {
  return (
    <Box
      width="100%"
      maxWidth="1000px"
      maxHeight="700px"

      mx="auto"
      borderRadius="md"
      p={4}
      overflow="auto"
      boxShadow="lg"
    >
      <NotebookPreviewer />
    </Box>
  );
};

export default CodeViewer;
