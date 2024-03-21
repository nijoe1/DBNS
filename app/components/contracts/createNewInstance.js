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
import { useSelector } from "react-redux";
import usePush from "@/hooks/usePush";
import { useRouter } from "next/router";
import { getRules } from "@/constants/push";
import { createIPNSName } from "@/utils/IPFS";
const CreateNewInstance = ({
  isOpen = { isOpen },
  onClose = { onClose },
  spaceID,
}) => {
  const toast = useToast();
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const chainID = publicClient?.getChainId();
  const { data: walletClient } = useWalletClient();
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    price: "",
    members: [],
    metadataName: "", // Added metadataName field
    metadataCID: "",
    chatID: "",
    IPNS: "",
    IPNSEncryptedKey: "",
  });
  const { initializePush } = usePush();
  const router = useRouter();
  const pushSign = useSelector((state) => state.push.pushSign);
  console.log(pushSign);
  const { address } = useAccount();

  useEffect(() => {
    async function initialize() {
      await initializePush();
    }
    if (Object.keys(pushSign).length === 0) {
      initialize();
    }
  }, [router]);

  const createGroup = async () => {
    const deterministicAddress = await publicClient?.readContract({
      address: CONTRACT_ADDRESSES,
      abi: CONTRACT_ABI,
      functionName: "getDeterministicAddress",
      args: [spaceID],
    });
    console.log(deterministicAddress);
    const createdGroup = await pushSign.chat.group.create(formData.name, {
      description: "Token gated web3 native chat example", // provide short description of group
      image: "data:image/png;base64,iVBORw0K...", // provide base64 encoded image
      members: [], // not needed, rules define this, can omit
      admins: [], // not needed as per problem statement, can omit
      private: true,
      rules: getRules(chainID, deterministicAddress),
    });
  };

  const createIPNS = async () => {
    let key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);
    let jwt = localStorage.getItem(`lighthouse-jwt-${address}`);

    // cid, apiKey, address, jwt, spaceID
    const ipnsName = await createIPNSName(
      "bafybeig2ygg4yzyoprroumzmuwm72qxtorgell7hipvpoyqdmfqoxupyay",
      key,
      address,
      jwt,
      spaceID,
    );
    console.log(ipnsName);
  };

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
          spaceID,
          formData.price,
          formData.members,
          formData.metadataCID, // Concatenating metadataName and metadataCID
          formData.chatID,
          formData.IPNS,
          formData.IPNSEncryptedKey,
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
            name="name"
            placeholder="Enter instance name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            name="about"
            placeholder="Enter instance about"
            value={formData.about}
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
          <Button colorScheme="white" mr={3} onClick={createIPNS}>
            Create
          </Button>
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNewInstance;
