import React, { useEffect, useState } from "react";
import InstanceDetailsPage from "@/components/pages/instance";
import SingleSpacePage from "@/components/pages/SpaceInstances";
import LandingPage from "@/components/pages/LandingPage";
import MergerPage from "@/components/pages/MergerPage";
import CsvViewer from "@/components/pages/CsvViewer";
import GraphViz from "@/components/pages/graph";
import Spaces from "@/components/pages/Spaces";
import SpacesGraph from "@/components/pages/SpacesGraph";

export default function Home() {
  const [hashRoute, setHashRoute] = useState("");
  const [route, setRoute] = useState("");
  const [routeWithoutParams, setRouteWithoutParams] = useState("default");
  useEffect(() => {
    const handleHashChange = async () => {
      setHashRoute(window.location.hash);
      setRoute(window.location.pathname);
      setRouteWithoutParams(window.location.hash.split("?")[0]);
      console.log(window.location.hash.split("?")[0]);
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
      {routeWithoutParams.toLowerCase() === "#/spaces" && <SpacesGraph />}
      {hashRoute === "#/MergerPage" && <MergerPage />}
      {route === "" && hashRoute == "" && <LandingPage />}
      {hashRoute === "#/SpacesGraph" && <SpacesGraph />}
      {routeWithoutParams === "#/SingleSpacePage" && <SingleSpacePage />}
      {routeWithoutParams === "#/instance" && <InstanceDetailsPage />}
    </div>
  );
}
