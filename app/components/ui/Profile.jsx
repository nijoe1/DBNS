import React, { useState, useEffect } from "react";
import { Box, Image, Text, Badge, Button } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import usePush from "@/hooks/usePush";
import UpdateProfile from "@/components/profile/UpdateProfile";

const Profile = ({ onProfile }) => {
  const { initializePush } = usePush();
  const pushSign = useSelector((state) => state.push.pushSign);
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const [profileInfo, setProfileInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    async function initialize() {
      await initializePush();
    }

    async function getProfile() {
      await fetchProfileInfo();
      await fetchNotifications();
      await fetchSubscriptions();
    }
    if (Object.keys(pushSign).length === 0) {
      initialize();
    }
    getProfile();
  }, [profileInfo]);

  const fetchProfileInfo = async () => {
    try {
      const response = await pushSign.profile.info();
      setProfileInfo(response);
    } catch (error) {
      console.error("Error fetching profile info:", error);
    }
  };

  const updateProfileInfo = async (name, description, picture) => {
    try {
      const response = await pushSign.profile.update({
        name: name,
        desc: description,
        picture: picture,
      });

      const info = await pushSign.profile.info();
      setProfileInfo(info);
    } catch (error) {
      console.error("Error updating profile info:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await pushSign.notification.list("INBOX");
      console.log(response);
      setNotifications(response);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await pushSign.notification.subscriptions();
      setSubscriptions(response);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };
  useEffect(() => {
    async function initialize() {
      await initializePush();
    }

    async function getProfile() {
      await fetchProfileInfo();
    }
    if (Object.keys(pushSign).length === 0) {
      initialize();
    }
    getProfile();
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
            boxSize={["120px", "150px"]}
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
            {address.slice(0, 6)}...{address.slice(-6)}
          </Badge>
          <Text fontSize={["sm", "md"]} color="white" mt="2">
            {profileInfo?.desc || "User Description"}
          </Text>
          {onProfile && (
            <div>
              <Button
                colorScheme="black"
                ml="3"
                className="bg-black/80 text-white"
                onClick={handleOpenModal}
              >
                Open Profile Modal
              </Button>
              <UpdateProfile
                isOpen={isOpen}
                onClose={handleCloseModal}
                onUpdateProfile={updateProfileInfo}
              />
            </div>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
