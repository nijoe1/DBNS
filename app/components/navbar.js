import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React from "react";
import { Image } from "@chakra-ui/react";

const Navbar = () => {
  const router = useRouter();

  const navigateToHashRoute = (hashRoute) => {
    window.location.hash = hashRoute;
  };

  return (
    <div className="w-screen bg-gradient-to-r rounded-lg mb-3">
      <div className="flex justify-between mx-6 ml-10">
        <div
          onClick={() => navigateToHashRoute("/")}
          className="mt-4 cursor-pointer"
        >
          <div className="flex">
            <Image
              className="cursor-pointer my-auto mx-2"
              src={
                "https://gateway.lighthouse.storage/ipfs/Qmdt2R4erxuFFwiKPV5WKdfRZnLZVyEUEyd6s3GmMu6xP1"
              }
              alt="DBNS"
              width={50}
              height={30}
            ></Image>
            <p className="text-2xl font-bold font-mono text-indigo-500">DBNS</p>
          </div>
        </div>
        <div className="flex items-center ml-[7%]">
          <div className="bg-neutral-200 opacity-60 px-1 py-1 rounded-3xl flex mt-4">
            <div
              onClick={() => navigateToHashRoute("/LandingPage")}
              className="bg-white rounded-3xl px-2 py-1 mx-1 cursor-pointer"
            >
              <p className="text-center text-md font-semibold my-auto text-black">
                LandingPage
              </p>
            </div>
            <div
              onClick={() => navigateToHashRoute("/MergerPage")}
              className="bg-white rounded-3xl px-2 py-1 mx-1 cursor-pointer"
            >
              <p className="text-center text-md font-semibold my-auto text-black">
                MergerPage
              </p>
            </div>
            {/* Add more navigation items as needed */}
          </div>
        </div>
        <div className="mt-4">
          <ConnectButton
            accountStatus="address"
            showBalance={false}
            chainStatus="icon"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
