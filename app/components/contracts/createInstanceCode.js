import React, { useState } from "react";
import {
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/constants/contracts";

const CreateNewInstanceModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [formData, setFormData] = useState({
    nodeName: "",
    price: "",
    members: [],
    metadataName: "", // Added metadataName field
    metadataCID: "",
    chatID: "",
    IPNS: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async () => {
    try {
      // Create space instance
      const data = await publicClient?.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "createSpaceInstance",
        args: [
          formData.nodeName,
          formData.price,
          formData.members,
          `${formData.metadataName} ${formData.metadataCID}`, // Concatenating metadataName and metadataCID
          formData.chatID,
          formData.IPNS,
        ],
      });

      if (!walletClient) {
        console.log("Wallet client not found");
        return;
      }

      const hash = await walletClient.writeContract(data.request);

      // Wait for transaction receipt
      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });

      // Display success toast
      toast({
        title: "Subspace Created",
        description: "Subspace created successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      console.log(transaction);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#333333" color="white" borderRadius="md">
        <ModalHeader>Create New Subnode</ModalHeader>
        <ModalBody bg={"#333333"}>
          <Input
            name="nodeName"
            placeholder="Enter subnode name"
            value={formData.nodeName}
            onChange={handleChange}
          />
          <Input
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
          />
          <Input
            name="metadataName"
            placeholder="Enter metadata name"
            value={formData.metadataName}
            onChange={handleChange}
          />
          {/* Other input fields for members, chatID, IPNS */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreate}>
            Create
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNewInstanceModal;
