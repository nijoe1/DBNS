import React, { useState, useEffect } from "react";
import { Box, Text, Input, Button, Flex } from "@chakra-ui/react";
import { MdAttachFile } from "react-icons/md";
import Loading from "@/components/Animation/Loading";

const ForumComponent = ({ pushSign, address, chatID }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [file, setFile] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchForumPosts = async () => {
    try {
      const forumPosts = await pushSign.chat.history(chatID, {
        limit: "30",
      });
      setPosts(forumPosts);
      setFetched(true);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    }
  };

  useEffect(() => {
    if (chatID) {
      fetchForumPosts();
    }
  }, [chatID]);
  const createPost = async () => {
    try {
      const groupPermissions = await pushSign.chat.group.permissions(chatID);
      if (!groupPermissions.entry && !groupPermissions.chat) {
        await pushSign.chat.group.join(chatID);
      }

      if (file) {
        const base64File = await convertFileToBase64(file);
        const messageType = file.type.includes("image") ? "Image" : "File";
        const sentMessage = await pushSign.chat.send(chatID, {
          type: messageType,
          content: base64File,
        });
        setPosts([...posts, sentMessage]);
        setFile(null);
      }

      if (newPost.trim() !== "") {
        const sentMessage = await pushSign.chat.send(chatID, {
          type: "Text",
          content: newPost,
        });
        setPosts([...posts, sentMessage]);
        setNewPost("");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      createPost();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
          p="4"
          borderRadius="md"
          boxShadow="md"
          // bg="#333333"
          overflow="auto"
        >
          <Flex mt={4} mb={4}>
            <Input
              value={newPost}
              className="text-white"
              onChange={(e) => setNewPost(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share something..."
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
            <Button onClick={createPost} bg="#edf2f7">
              Post
            </Button>
          </Flex>
          {posts.map((post, index) => (
            <Box
              key={index}
              p={2}
              mb={2}
              borderWidth="1px"
              borderRadius="md"
              bg="#edf2f7"
            >
              {post.messageType === "Image" && (
                <img
                  src={post.messageObj.content}
                  alt="Image"
                  style={{ maxWidth: "10%", borderRadius: "4px" }}
                />
              )}
              {post.messageType === "File" && (
                <Button
                  as="a"
                  href={post.messageObj.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<MdAttachFile />}
                  variant="link"
                  fontWeight="bold"
                  color="#333333"
                  download
                >
                  Download File
                </Button>
              )}
              {post.messageType === "Text" && (
                <Text color="#333333">{post.messageObj.content}</Text>
              )}
              <Text fontSize="sm" color="#333333" mt={1}>
                {new Date(post.timestamp).toLocaleString()}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
};

export default ForumComponent;
