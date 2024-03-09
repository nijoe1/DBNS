import React from "react";
import { Box, Text } from "@chakra-ui/react";

const CodeViewer = () => {
  // Dummy data for code snippets
  const codeSnippets = [
    {
      name: "Snippet 1",
      about: "Description of Snippet 1",
      link: "https://example.com/snippet1",
      code: `// Code snippet 1
      function greet() {
        console.log("Hello, world!");
      }
      greet();`,
    },
    {
      name: "Snippet 2",
      about: "Description of Snippet 2",
      link: "https://example.com/snippet2",
      code: `// Code snippet 2
      function add(a, b) {
        return a + b;
      }
      console.log(add(2, 3));`,
    },
  ];

  return (
    <Box>
      {codeSnippets.map((snippet, index) => (
        <Box
          key={index}
          p="4"
          bg="gray.200"
          borderRadius="md"
          boxShadow="md"
          mb="4"
        >
          <Text fontSize="lg" fontWeight="bold" mb="2">
            {snippet.name}
          </Text>
          <Text fontSize="md" color="gray.500" mb="2">
            {snippet.about}
          </Text>
          <Text fontSize="sm" color="blue.500" mb="2">
            <a href={snippet.link} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Text>
          <Box as="pre" whiteSpace="pre-wrap" overflowX="auto">
            <code>{snippet.code}</code>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default CodeViewer;
