import React, { useEffect, useState } from "react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import Navbar from "@/components/navbar";

import LandingPage from "./LandingPage";
import MergerPage from "./MergerPage";

export default function Home() {
  const [hashRoute, setHashRoute] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setHashRoute(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial setup
    setHashRoute(window.location.hash);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div>
      <div className="fixed z-50 top-0 left-0 w-full">
        <Navbar />
      </div>
      <div className="w-screen h-screen  bg-gradient-to-r from-white via-white to-rose-100">
        {hashRoute === "#/MergerPage" && <MergerPage />}
        {(hashRoute === "#/LandingPage" || hashRoute === "") && <LandingPage />}
      </div>
    </div>
  );
}
