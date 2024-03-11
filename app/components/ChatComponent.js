import React, { useState, useEffect } from "react";
import { Box, Image, Text, Input, Button, Flex } from "@chakra-ui/react";
import { BsFileText } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { RiImageAddFill, RiSendPlane2Fill } from "react-icons/ri";
import makeBlockie from "ethereum-blockies-base64";

const ChatComponent = ({ pushSign, address }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");

  const recipient =
    "e10af1ce34d46c8e644d0440e7ac57aa207fd6c5773f0229760a00d1fc8610da";

  const fetchChatHistory = async () => {
    try {
      const chatHistory = await pushSign.chat.history(recipient, {
        limit: "30",
      });
      setMessages(chatHistory.reverse());
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []); // Fetch chat history on component mount

  const sendMessage = async () => {
    try {
      const groupPermissions = await pushSign.chat.group.permissions(recipient);
      if (groupPermissions.entry && groupPermissions.chat) {
        const joinGroup = await pushSign.chat.group.join(recipient);
      }

      if (file) {
        if (!fileType.includes("image")) {
          // Send a text message containing the information about the attached file
          const fileInfoMessage = await pushSign.chat.send(recipient, {
            type: "Text",
            content: `Attaching ${file.name}`,
          });
          setMessages([...messages, fileInfoMessage]);
        }

        // Send the actual file
        const base64File = await convertFileToBase64(file);
        const messageType = fileType.includes("image") ? "Image" : "File";
        const sentMessage = await pushSign.chat.send(recipient, {
          type: messageType,
          content: base64File,
        });
        setMessages([...messages, sentMessage]);
        setFile(null);
        setFileType("");
      } else if (newMessage.trim() !== "") {
        const sentMessage = await pushSign.chat.send(recipient, {
          type: "Text",
          content: newMessage,
        });
        setMessages([...messages, sentMessage]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileType(selectedFile.type);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Box
      maxHeight="500px"
      overflowY="auto"
      p="4"
      borderRadius="md"
      boxShadow="md"
    >
      {messages.map((message, index) => (
        <Flex
          key={index}
          alignItems="center"
          justifyContent={
            message.fromDID.includes(address) ? "flex-end" : "flex-start"
          }
          p={2}
          mb={2}
        >
          <Box
            borderRadius="full"
            boxSize="30px"
            overflow="hidden"
            mr={2}
            bg="gray.200"
          >
            <Image src={makeBlockie(address)} alt="Sender Avatar" />
          </Box>
          <Box borderWidth="1px" borderColor="gray.700" p={2} rounded="md">
            {message.messageType === "Image" ? (
              <Box>
                <Image
                  src={message.messageObj.content}
                  alt="Message"
                  boxSize="100px"
                  borderRadius="md"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Box>
            ) : message.messageType === "File" ? (
              <Flex align="center">
                <Button
                  as="a"
                  href={message.messageObj.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<BsFileText />}
                  variant="link"
                  fontWeight="bold"
                  color="blue.500"
                  download
                >
                  <FaDownload />
                  Download {fileType}
                </Button>
                <Text fontSize="sm" color="gray.500" ml={2}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Flex>
            ) : (
              <Box>
                <Text>{message.messageObj.content}</Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Box>
            )}
          </Box>
        </Flex>
      ))}
      <Flex mt={4}>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          mr={2}
        />
        <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
          <RiImageAddFill size={28} />
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
        <Button
          onClick={sendMessage}
          colorScheme="blue"
          leftIcon={<RiSendPlane2Fill />}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
};

export default ChatComponent;
