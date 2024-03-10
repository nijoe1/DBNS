import React, { useEffect, useState } from "react";
import InstanceDetailsPage from "@/components/pages/instance";
import SingleSpacePage from "@/components/pages/SpaceInstances";
import LandingPage from "@/components/pages/LandingPage";
import MergerPage from "@/components/pages/MergerPage";
import SpacesGraph from "@/components/pages/SpacesGraph";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const [hashRoute, setHashRoute] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a route stored in local storage
    const storedRoute = localStorage.getItem("route");
    if (storedRoute) {
      window.location.hash = storedRoute;
    }
    
    // Handle hash change
    const handleHashChange = () => {
      setHashRoute(window.location.hash);
      localStorage.setItem("route", window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial setup
    if (window.location.hash !== "") {
      setHashRoute(window.location.hash);
    }

    // Set loading to false after initial setup
    setLoading(false);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [router]);

  if (loading) {
    return null; // Render nothing while loading
  }

  return (
    <div>
      {hashRoute.toLowerCase() === "#/spaces" && <SpacesGraph />}
      {hashRoute === "#/MergerPage" && <MergerPage />}
      {(hashRoute === "" || hashRoute === "#/") && <LandingPage />}
      {hashRoute === "#/SpacesGraph" && <SpacesGraph />}
      {hashRoute === "#/SingleSpacePage" && <SingleSpacePage />}
      {hashRoute === "#/instance" && <InstanceDetailsPage />}
    </div>
  );
};

export default Home;
