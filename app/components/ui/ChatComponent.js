import React, { useState, useEffect } from "react";
import { Box, Image, Text, Input, Button, Flex } from "@chakra-ui/react";
import { BsFileText } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { RiImageAddFill, RiSendPlane2Fill } from "react-icons/ri";
import makeBlockie from "ethereum-blockies-base64";
import { MdAttachFile } from "react-icons/md";
import Loading from "@/components/Animation/Loading";

const ChatComponent = ({ pushSign, address, chatID }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fetched, setFetched] = useState(false);
  const fetchChatHistory = async () => {
    try {
      const chatHistory = await pushSign.chat.history(chatID, {
        limit: "30",
      });
      setFetched(true);
      setMessages(chatHistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    if (chatID) {
      fetchChatHistory();
    }
  }, [chatID]);

  useEffect(() => {
    if (chatID) {
      fetchChatHistory();
    }
  }, [messages]);
  const sendMessage = async () => {
    try {
      const groupPermissions = await pushSign.chat.group.permissions(chatID);
      if (groupPermissions.entry && groupPermissions.chat) {
        const joinGroup = await pushSign.chat.group.join(chatID);
      }

      if (file) {
        if (!fileType.includes("image")) {
          // Send a text message containing the information about the attached file
          const fileInfoMessage = await pushSign.chat.send(chatID, {
            type: "Text",
            content: `Attaching ${file.name}`,
          });
        }

        // Send the actual file
        const base64File = await convertFileToBase64(file);
        const messageType = fileType.includes("image") ? "Image" : "File";
        const sentMessage = await pushSign.chat.send(chatID, {
          type: messageType,
          content: base64File,
        });
        const sendNotifRes = await pushSign.channel.send(["*"], {
          notification: { title: "test", body: "test" },
          advanced: {
            chatid:
              "e10af1ce34d46c8e644d0440e7ac57aa207fd6c5773f0229760a00d1fc8610da",
          },
        });
        setFile(null);
        setFileType("");
      } else if (newMessage.trim() !== "") {
        const sentMessage = await pushSign.chat.send(chatID, {
          type: "Text",
          content: newMessage,
        });
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
    <div>
      {!fetched ? (
        <div className="flex flex-col items-center mx-auto mt-[10%]">
          <Loading />
        </div>
      ) : (
        <Box
          my={"auto"}
          overflowY="auto"
          p="4"
          borderRadius="md"
          boxShadow="lg"
          bg="#333333"
          height="800px" // Set a fixed height for the chat container
        >
          <Flex mt={4} mb={4} className="flex items-center mx-auto">
            <Input
              value={newMessage}
              className="text-white"
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              mr={2}
              _focus={{
                borderColor: "white",
              }}
            />
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <MdAttachFile className="mr-2 mt-1" color="white" size={28} />
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
            <Button
              onClick={sendMessage}
              bg="#edf2f7"
              leftIcon={<RiSendPlane2Fill className="mx-[1%]" />}
            >
              Send
            </Button>
          </Flex>
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
                bg="#333333"
              >
                <Image src={makeBlockie(address)} alt="Sender Avatar" />
              </Box>
              <Box borderWidth="1px" borderColor="black" p={2} rounded="md">
                {message.messageType === "Image" ? (
                  <Box>
                    <Image
                      src={message.messageObj.content}
                      alt="Message"
                      boxSize="100px"
                      borderRadius="md"
                    />
                    <Text fontSize="sm" color="white" mt={1}>
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
                      color="white"
                      download
                    >
                      <FaDownload />
                      Download {fileType}
                    </Button>
                    <Text fontSize="sm" color="white" ml={2}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Flex>
                ) : (
                  <Box>
                    <Text fontSize="sm" color="white">
                      {message.messageObj.content}
                    </Text>
                    <Text fontSize="sm" color="white" mt={1}>
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
        </Box>
      )}
    </div>
  );
};

export default ChatComponent;
