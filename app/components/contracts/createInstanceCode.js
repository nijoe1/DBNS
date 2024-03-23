import React, { useState, useEffect, useCallback } from "react";
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
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESSES } from "@/constants/contracts";
import { useSelector } from "react-redux";
import usePush from "@/hooks/usePush";
import { useRouter } from "next/router";
import { getRules } from "@/constants/push";
import { createIPNSName, uploadFile } from "@/utils/IPFS";
import { FaFileUpload, FaImage } from "react-icons/fa";

const CreateNewInstanceCode = ({
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

    members: [],
    chatID: "",
    IPNS: "",
    IPNSEncryptedKey: "",
    file: null,
    instanceID: "",
  });
  const { initializePush } = usePush();
  const router = useRouter();
  const pushSign = useSelector((state) => state.push.pushSign);
  const { address } = useAccount();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function initialize() {
      await initializePush();
    }
    if (Object.keys(pushSign).length === 0) {
      initialize();
    }
  }, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleChange({
      target: {
        name: "file",
        value: file,
      },
    });
  };

  const createCode = async () => {
    const deterministicAddress = await publicClient?.readContract({
      address: CONTRACT_ADDRESSES,
      abi: CONTRACT_ABI,
      functionName: "getDeterministicAddress",
      args: [spaceID],
    });
    const rules = getRules(chainID, deterministicAddress);
    const createdGroup = await pushSign.chat.group.create(formData.name, {
      description: "Token gated web3 native chat example", // provide short description of group
      image: "data:image/png;base64,iVBORw0K...", // provide base64 encoded image
      members: tags, // not needed, rules define this, can omit
      admins: [], // not needed as per problem statement, can omit
      private: true,
      // rules: rules,
    });
    return createdGroup.chatId;
  };

  const createIPNS = async () => {
    let key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);
    let jwt = localStorage.getItem(`lighthouse-jwt-${address}`);

    // cid, apiKey, address, jwt, spaceID
    const response = await createIPNSName(
      formData.file,
      key,
      address,
      jwt,
      spaceID,
    );
    return response;
  };

  const uploadMetadata = async () => {
    let key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);

    const metadata = {
      name: formData.name,
      about: formData.about,
      imageUrl: formData.image,
    };
    const jsonBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });

    // Create a File object from the Blob
    const jsonFile = new File([jsonBlob], `type.json`, {
      type: "application/json",
    });
    const metadataCID = await uploadFile(jsonFile, key);
    // setFormData({ ...formData, metadataCID: metadataCID.Hash });
    return metadataCID.Hash;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async () => {
    let res = await createIPNS();
    let chatID = await createCode();
    try {
      // Create space instance
      const data = await publicClient?.simulateContract({
        account,
        address: CONTRACT_ADDRESSES,
        abi: CONTRACT_ABI,
        functionName: "createInstanceCode",
        args: [
          spaceID,
          formData.name,
          formData.about,
          chatID,
          res.name,
          res.cid,
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

      onClose();

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
        <ModalHeader>Create New Code</ModalHeader>
        <ModalBody>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                placeholder="Enter instance name"
                value={formData.name}
                onChange={handleChange}
                bg="#424242"
                color="white"
                borderRadius="md"
              />
            </FormControl>
            <FormControl>
              <FormLabel>About</FormLabel>
              <Input
                name="about"
                placeholder="Enter instance about"
                value={formData.about}
                onChange={handleChange}
                bg="#424242"
                color="white"
                borderRadius="md"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Code</FormLabel>
              <InputGroup>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  display="none"
                  id="file-upload"
                />
                <InputRightElement>
                  <label htmlFor="file-upload">
                    <Icon as={FaFileUpload} cursor="pointer" />
                  </label>
                </InputRightElement>
              </InputGroup>
              <Text
                cursor="pointer"
                color="white"
                ml="2"
                onClick={() => document.getElementById("file-upload").click()}
              >
                Upload Model Code
              </Text>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="white" mr={3} onClick={handleCreate}>
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
export default CreateNewInstanceCode;
