import React, { useState, useEffect, use } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import makeBlockie from "ethereum-blockies-base64";
import { useRouter } from "next/router";

const CardItem = ({ profileInfo, pushSign }) => {
  const router = useRouter();
  const { address } = useAccount();
  const [showModal, setShowModal] = useState(false);
  const [conributors, setContributors] = useState([]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchProfileInfo = async () => {
    try {
      let temp = [];
      profileInfo?.members?.map(async (contributor, index) => {
        console.log("Fetching profile info for:", contributor);
        console.log("Fetching profile info for:", contributor);
        const response = await pushSign.profile.info({
          overrideAccount: contributor,
        });
        console.log("Response:", response);
        temp[index] = {
          name: response.name,
          address: contributor,
          image: response.picture,
        };
      });
      console.log("Contributors:", temp);
      setContributors(temp);
    } catch (error) {
      console.error("Error fetching profile info:", error);
    }
  };

  useEffect(() => {
    if (profileInfo) {
      fetchProfileInfo();
    }
  }, [profileInfo]);

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
          <Button onClick={handleShowModal} mt="4">
            Contributors
          </Button>
        </Box>
      </Box>

      {/* Contributors Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contributors</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple" colorScheme="black">
              <Thead>
                <Tr>
                  <Th>Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {conributors.length > 0 &&
                  conributors?.map((contributor, index) => (
                    <Tr key={index}>
                      <Td>
                        <div className="flex flex-wrap items-center">
                          <Image
                            mt={2}
                            rounded={"md"}
                            width={9}
                            src={
                              contributor?.image ||
                              makeBlockie(contributor?.address)
                            }
                            alt="Sender Avatar"
                          />
                          <Text
                            fontSize="md"
                            mt={2}
                            mx={2}
                            color="black"
                            ml={2}
                          >
                            {" "}
                            {contributor?.name}{" "}
                          </Text>
                          <Badge
                            className="text-black bg-black"
                            borderRadius="full"
                            px="2"
                            py="1"
                            mt="2"
                            fontSize="sm"
                            cursor={"pointer"}
                            onClick={() => {
                              router.push({
                                pathname: "",
                                hash: "/profile?address=" + contributor?.address,
                              });
                            }}
                          >
                            {contributor?.address?.slice(0, 6)}...
                            {contributor?.address?.slice(-6)}
                          </Badge>
                        </div>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button className="bg-black text-white rounded-lg" mr={3} onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CardItem;
