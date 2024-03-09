import React, { useState, useEffect } from "react";
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
  InputRightElement,
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigateToHashRoute(`/`);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSmallScreen) {
    return (
      // Render for small screens
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="1rem"
        bg="gray.800" // Change background color
        color="white" // Change text color
      >
        <div
          onClick={() => navigateToHashRoute("/")}
          className="cursor-pointer"
        >
          <div className="flex items-center mr-5">
            <Image
              className="cursor-pointer my-auto mx-2"
              src={
                "https://gateway.lighthouse.storage/ipfs/QmSuF5c9oDbUTouNsTeoy7q79CqVhFFfdjhXVA7Hpu8awK"
              }
              alt="DBNS"
              width={50}
              height={30}
            ></Image>
            <p className="text-2xl font-bold font-mono text-indigo-500">DBNS</p>
          </div>
        </div>
        <div className="flex flex-wrap items center">
          <ConnectButton />
          <HamburgerIcon
            boxSize={6}
            onClick={onOpen}
            cursor="pointer"
            className="mt-2 ml-3"
            // display={{ base: "block", md: "none" }}
          />
        </div>

        <Drawer isOpen={isOpen} placement="left" size="md" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="gray.700" color="white">
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing={4} className="flex flex-col items-center">
                <Input
                  type="text"
                  placeholder="Search..."
                  _placeholder={{ color: "gray.400" }}
                  borderWidth="0"
                  width={"50"}
                  borderRadius="full"
                  className="mt-6"
                  focusBorderColor="none"
                  _focus={{ outline: "none" }}
                  onKeyPress={handleKeyPress} // Attach event handler for Enter key press
                />
                <Button
                  variant="white"
                  onClick={() => {
                    navigateToHashRoute("/");
                    onClose();
                  }}
                >
                  Home
                </Button>
                <Button
                  variant="white"
                  onClick={() => {
                    navigateToHashRoute("/CsvViewer");
                    onClose();
                  }}
                >
                  CsvViewer
                </Button>
                <Button
                  variant="white"
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
  } else {
    return (
      // Render for large screens
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="1rem"
        bg="gray.800" // Change background color
        color="white" // Change text color
      >
        <div className="cursor-pointer">
          <div className="flex items-center mr-5">
            <Image
              onClick={() => navigateToHashRoute("/")}
              className="cursor-pointer my-auto mx-2"
              src={
                "https://gateway.lighthouse.storage/ipfs/QmSuF5c9oDbUTouNsTeoy7q79CqVhFFfdjhXVA7Hpu8awK"
              }
              alt="DBNS"
              width={50}
              height={30}
            ></Image>
            <p
              onClick={() => navigateToHashRoute("/")}
              className="text-2xl font-bold font-mono text-indigo-500"
            >
              DBNS
            </p>
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
              onClick={() => {
                navigateToHashRoute("/Spaces");
              }}
            >
              Spaces
            </Button>
            <Button
              variant="white"
              mr={4}
              onClick={() => {
                navigateToHashRoute("/Graph");
              }}
            >
              graph
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search space..."
            _placeholder={{ color: "gray.400" }}
            borderWidth="0"
            width={"50"}
            className="ml-7"
            borderRadius="full"
            focusBorderColor="none"
            _focus={{ outline: "none" }}
            onKeyPress={handleKeyPress} // Attach event handler for Enter key press
          />
          <ConnectButton
            accountStatus="full"
            showBalance={true}
            chainStatus="icon"
            variant="ghost"
            color="white"
            // display={{ base: "none", md: "block" }}
          />
        </div>
      </Flex>
    );
  }
};

export default Navbar;
