import React, { useState, useEffect } from "react";
import { Flex, Text, Link, HStack } from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";

const Footer = () => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const scrollPosition =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;

      // If the user has scrolled to the bottom of the page or near the bottom, show the footer
      if (windowHeight + scrollPosition >= documentHeight - 4) {
        setIsFooterVisible(true);
      } else {
        setIsFooterVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Flex
      as="footer"
      align="center"
      justify="center"
      direction="column"
      bg="gray.800" // Change background color
      color="white" // Change text color
      py={5}
      px={1}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="1000"
      visibility={isFooterVisible ? "visible" : "hidden"}
    >
      {/* Footer Links */}
      <Flex justify="center" align="center" fontSize="sm">
        <Text mr={2}>
          <Link href="https://github.com/nijoe1/DBNS" isExternal>
            Fork me
          </Link>
        </Text>
        <Text mr={2}>·</Text>
        <HStack spacing={1}>
          <Text>Built with</Text>
          <CiHeart className="h-4 w-4" />
          <Text>For Data Economy Hackathon from</Text>

          <Link href="https://github.com/nijoe1" isExternal>
            Nick🇬🇷
          </Link>
        </HStack>
        <Text mr={2}>·</Text>
      </Flex>
    </Flex>
  );
};

export default Footer;
