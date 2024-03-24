import React, { useState, useEffect } from "react";
import { Box, Image, Text, Badge, Button } from "@chakra-ui/react";
import { useAccount } from "wagmi";

const CardItem = ({ profileInfo }) => {
  const { address } = useAccount();
  return (
    <div className="mt-[5%] max-w-[1200px] mx-auto">
      <Box
        p={["2", "4"]}
        className="mx-[5%]"
        bg="#333333"
        borderRadius="xl"
        boxShadow="md"
      >
        <Box p="4" mb="4" className="flex flex-col items-center">
          <Image
            src={profileInfo?.picture || "/path/to/image.jpg"}
            alt="Profile Image"
            borderRadius="full"
            width="70%"
            aspectRatio={2 / 1}
            objectFit="cover"
            mb="4"
          />
          <Text fontSize={["lg", "xl"]} fontWeight="bold" color="white">
            {profileInfo?.name || "User Name"}
          </Text>
          <Badge
            className="text-black bg-black"
            borderRadius="full"
            px="2"
            py="1"
            mt="2"
            fontSize="sm"
          >
            {address?.slice(0, 6)}...{address?.slice(-6)}
          </Badge>
          <Text fontSize={["sm", "md"]} color="white" mt="2">
            {profileInfo?.desc || "User Description"}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default CardItem;
