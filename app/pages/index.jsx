import React, { useEffect, useState } from "react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/router";

import LandingPage from "./LandingPage";
import MergerPage from "./MergerPage";
import CsvViewer from "./CsvViewer";

export default function Home() {
  const [hashRoute, setHashRoute] = useState("");
  const [route, setRoute] = useState("");
  const router = useRouter();
  useEffect(() => {
    const handleHashChange = async () => {
      setHashRoute(window.location.hash);
      setRoute(window.location.pathname);
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial setup
    if (window.location.hash !== "") {
      setHashRoute(window.location.hash);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div>
      <div className="fixed z-50 top-0 left-0 w-full">
        <Navbar />
      </div>
      <div className="w-screen h-screen  bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500">
        {hashRoute === "#/MergerPage" && <MergerPage />}
        {route === "" && hashRoute == "" && <LandingPage />}
        {hashRoute === "#/CsvViewer" && <CsvViewer />}
      </div>
      <div className="fixed z-50 bottom-0 left-0 w-full ">
        <Footer />
      </div>
    </div>
  );
}
