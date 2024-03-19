import React, { useState, useEffect } from "react";
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
const createNewInstance = ({
  isOpen = { isOpen },
  onClose = { onClose },
}) => {
  const toast = useToast();
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [newNodeName, setNewNodeName] = useState("");

  function handleCreate() {
    console.log("Creating new node with name: ", newNodeName);
    onClose();
  }

  const createNewSpaceInstance = async () => {
    try {
      const data = await publicClient?.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "createSpaceInstance",
        args: [],
      });
      console.log(data);
      if (!walletClient) {
        console.log("Wallet client not found");
        return;
      }
      // @ts-ignore
      const hash = await walletClient.writeContract(data.request);
      console.log("Transaction Sent");
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      await toast({
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
            placeholder="Enter subnode name"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
          />
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

export default createNewInstance;
