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
  Button,
  Input,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import StepperForm from "../StepperForm";
import { useAccount, useChainId } from "wagmi";
const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { address } = useAccount();
  const chainID = useChainId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeChain, setChangeChain] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateToHashRoute = (hashRoute) => {
    if (hashRoute == "/") {
      window.location.hash = "/";
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

  useEffect(() => {
    const check = async () => {
      let prevAddress;
      try {
        prevAddress = localStorage.getItem("prevAddress");
      } catch {}
      if (address && address != prevAddress) {
        localStorage.removeItem("ceramic-session");
        localStorage.setItem("prevAddress", address ? address : "".toString());
        localStorage.setItem("prevChain", chainID.toString());
        setChangeChain(false);
        openModal();
      }
    };
    check();
  }, [address]);

  useEffect(() => {
    let prevChain;
    let prevAddress;
    try {
      prevAddress = localStorage.getItem("prevAddress");
      prevChain = localStorage.getItem("prevChain");
    } catch {}
    if (prevAddress && parseInt(prevChain || "0") != chainID && changeChain) {
      localStorage.setItem("prevChain", chainID.toString());
      window.location.href = "/";
    }
  }, [chainID]);

  if (isSmallScreen) {
    return (
      // Render for small screens
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="0.5rem"
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
                    navigateToHashRoute("/Spaces");
                    onClose();
                  }}
                >
                  Spaces
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
                navigateToHashRoute("/instance");
              }}
            >
              Instance
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
        <StepperForm
          isOpen={isModalOpen}
          onClose={closeModal}
          address={address}
        />
      </Flex>
    );
  }
};

export default Navbar;
