import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Stack,
  Flex,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoSearchCircle } from "react-icons/io5";
import { useRouter } from "next/router";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();

  const navigateToHashRoute = (hashRoute) => {
    if (hashRoute == "/") {
      window.location = "/";
    } else {
      window.location.hash = hashRoute;
    }
  };
  // Check if the screen size is small
  React.useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Adjust this breakpoint according to your design
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Flex
      as="nav"
      // align="center"
      justify="space-between"
      padding="1rem"
      bg="gray.800" // Change background color
      color="white" // Change text color
    >
      {/* Logo */}
      {/* <Flex align="center"> */}
      {/* <Image
          src="@/public/DBNS.jpeg"
          alt="Logo"
          width={30}
          height={30}
          className="cursor-pointer"
        /> */}
      {/* <Link href="/" passHref>
          <Text ml={2} fontWeight="bold">
            DBNS
          </Text>
        </Link> */}
      {/* </Flex> */}

      {/* Navigation for large screens */}
      <Flex align="left" display={{ base: "none", md: "flex" }}>
        {/* <Image
          src="@/public/DBNS.jpeg"
          alt="Logo"
          width={30}
          height={30}
          className="cursor-pointer"
        /> */}
        <Button variant="white" ml={8} onClick={() => navigateToHashRoute("/")}>
          <Text ml={2} mt={2} fontWeight="bold">
            DBNS
          </Text>
        </Button>
        <Button
          variant="white"
          ml={8}
          onClick={() => navigateToHashRoute("/CsvViewer")}
        >
          CsvViewer
        </Button>
        <Button
          variant="white"
          mr={4}
          onClick={() => navigateToHashRoute("/MergerPage")}
        >
          MergerPage
        </Button>
        {/* Add more navigation items as needed */}
      </Flex>

      {/* Search Bar (Minimal) */}
      <InputGroup
        display={{ base: "none", md: "flex" }}
        maxW="xs"
        bg="white"
        borderRadius="full"
        ml={4}
        mr={2}
      >
        <InputLeftElement pointerEvents="none" pl={3}>
          <IoSearchCircle color="white" />
        </InputLeftElement>
        <Input type="text" placeholder="Search..." />
      </InputGroup>

      {/* Connect Button */}
      <ConnectButton
        accountStatus="address"
        showBalance={false}
        chainStatus="icon"
        variant="ghost"
        color="white"
        display={{ base: "none", md: "block" }}
      />

      {/* Hamburger Icon */}
      {isSmallScreen && (
        <HamburgerIcon
          boxSize={6}
          onClick={onOpen}
          cursor="pointer"
          display={{ base: "block", md: "none" }}
        />
      )}

      {/* Drawer for small screens */}
      <Drawer isOpen={isOpen} placement="left" size="md" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.700" color="white">
          <DrawerCloseButton />
          <DrawerBody>
            <Stack spacing={4}>
            <Button
                variant="white"
                ml={8}
                onClick={() => {
                  navigateToHashRoute("/");
                  onClose();
                }}
              >
                Home
              </Button>
              <Button
                variant="white"
                ml={8}
                onClick={() => {
                  navigateToHashRoute("/CsvViewer");
                  onClose();
                }}
              >
                CsvViewer
              </Button>
              <Button
                variant="white"
                ml={8}
                onClick={() => {
                  navigateToHashRoute("/MergerPage");
                  onClose();
                }}
              >
                MergerPage
              </Button>
              {/* Add more navigation items as needed */}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Navbar;
