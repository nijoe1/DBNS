import React, { useState } from "react";
import { Box, Input, Text, Button, Center, Image } from "@chakra-ui/react";

const UpdateProfile = ({ profileInfo, onUpdateProfile }) => {
  const [name, setName] = useState(profileInfo?.name || "");
  const [description, setDescription] = useState(
    profileInfo?.description || "",
  );
  const [profileImage, setProfileImage] = useState(
    profileInfo?.profileImage || null,
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onUpdateProfile(name, description, profileImage);
  };

  return (
    <Center>
      <Box
        p="4"
        borderRadius="xl"
        className="border border-white"
        boxShadow="md"
        bgGradient="linear(to-br, #333333, #222222)"
      >
        <Text color="white" mb="2">
          Profile Name:
        </Text>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          mb="4"
          variant="outline"
          borderColor="white"
          color="white"
        />
        <Text color="white" mb="2">
          Profile Description:
        </Text>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your description"
          mb="4"
          variant="outline"
          borderColor="white"
          color="white"
        />
        <Text color="white" mb="2">
          Profile Image:
        </Text>
        <div className=" flex flex-col items-center">
          {profileImage && (
            <Image
              src={profileImage}
              alt="Profile"
              boxSize="100px"
              objectFit="cover"
              borderRadius="full"
            />
          )}

          <Input
            type="file"
            onChange={handleImageChange}
            mb="4"
            accept="image/*"
            color="white"
          />
          <Button
            onClick={handleSubmit}
            bg="white"
            color="black"
            borderRadius="full"
          >
            Update Profile
          </Button>
        </div>
      </Box>
    </Center>
  );
};

export default UpdateProfile;
