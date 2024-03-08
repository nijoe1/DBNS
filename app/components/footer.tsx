import React from "react";
import { Flex, Text, Link, HStack } from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";

const Footer = () => {

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
      mb={[11, 0]}
    >


      {/* Footer Links */}
      <Flex justify="center" align="center" fontSize="sm">
        <Text mr={2}>
          <Link href="https://github.com/scaffold-eth/se-2" isExternal>
            Fork me
          </Link>
        </Text>
        <Text mr={2}>·</Text>
        <HStack spacing={1}>
          <Text>Built with</Text>
          <CiHeart className="h-4 w-4" />
          <Link href="https://buidlguidl.com/" isExternal>
            BuidlGuidl
          </Link>
        </HStack>
        <Text mr={2}>·</Text>
        <Text>
          <Link href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA" isExternal>
            Support
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default Footer;
