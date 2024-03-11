import React, { useState } from "react";
import {
  Box,
  Flex,
  Input,
  Select,
  Grid,
  GridItem,
  Text,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";

// Sample dataset categories
const datasetCategories = [
  { id: 1, name: "Category 1", imageUrl: "https://via.placeholder.com/150" },
  { id: 2, name: "Category 2", imageUrl: "https://via.placeholder.com/150" },
  { id: 3, name: "Category 3", imageUrl: "https://via.placeholder.com/150" },
  { id: 4, name: "Category 4", imageUrl: "https://via.placeholder.com/150" },
  { id: 5, name: "Category 5", imageUrl: "https://via.placeholder.com/150" },
];

const Spaces = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");


  // Filter dataset categories based on search query and selected category
  const filteredCategories = datasetCategories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "" || category.name === selectedCategory)
    );
  });

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh">
      {/* Search bar and category dropdown */}
      <Flex mb={4}>
        <Input
          placeholder="Search category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mr={4}
        />
        <Select
          placeholder="Select category..."
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {datasetCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Grid of dataset categories */}
      <Grid
        templateColumns={`repeat(4, minmax(200px, 1fr))`}
        gap={4}
        justifyItems="center"
      >
        {filteredCategories.map((category) => (
          <GridItem key={category.id} textAlign="center">
            <Box
              maxW="300px"
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
            >
              <img src={category.imageUrl} alt={category.name} />
              <Text mt={2} fontSize="lg" fontWeight="bold">
                {category.name}
              </Text>
              <Button
                mt={2}
                colorScheme="blue"
                size="sm"
                onClick={() => handleCategoryClick(category.id)}
              >
                View Category
              </Button>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Flex>
  );
};

export default Spaces;
