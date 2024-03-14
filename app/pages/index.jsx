import React, { useEffect, useState } from "react";
import InstanceDetailsPage from "@/components/pages/instance";
import SingleSpacePage from "@/components/pages/SpaceInstances";
import LandingPage from "@/components/pages/LandingPage";
import ProfilePage from "@/components/pages/ProfilePage";
import SpacesGraph from "@/components/pages/SpacesGraph";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const [hashRoute, setHashRoute] = useState("");
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a route stored in local storage
    let storedRoute = window.location.pathname
    console.log(storedRoute)
    try{
      storedRoute = localStorage.getItem("route");
    }catch(e){}
    let storedHashRoute =window.location.hash
    try{
        storedHashRoute = localStorage.getItem("hashRoute");

    }catch(e){}


    if (storedRoute) {
      setRoute(storedRoute);
    }

    if (storedHashRoute) {
      setHashRoute(storedHashRoute);
    }

    // Handle hash change
    const handleHashChange = () => {
      const newHashRoute = window.location.hash;
      setHashRoute(newHashRoute);
      localStorage.setItem("hashRoute", newHashRoute);
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial setup
    if (window.location.hash !== "") {
      setHashRoute(window.location.hash);
    }

    if (window.location.pathname !== "") {
      setRoute(window.location.pathname);
    }

    // Set loading to false after initial setup
    setLoading(false);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (loading) {
    return null; // Render nothing while loading
  }

  return (
    <div>
      {hashRoute.toLowerCase() === "#/spaces" && <SpacesGraph />}
      {hashRoute === "#/profile" && <ProfilePage />}
      {(route === "/" && hashRoute === "#/") && <LandingPage />}
      {hashRoute.includes("#/SingleSpacePage") && <SingleSpacePage />}
      {hashRoute === "#/instance" && <InstanceDetailsPage />}
    </div>
  );
};

export default Home;
