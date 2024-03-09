import React, { useEffect, useState } from "react";
import SingleSpacePage from "./SpaceInstances";
import LandingPage from "./LandingPage";
import MergerPage from "./MergerPage";
import CsvViewer from "./CsvViewer";
import GraphViz from "./graph";
import Spaces from "./Spaces";

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
      {routeWithoutParams.toLowerCase() === "#/spaces" && <Spaces />}
      {hashRoute === "#/Graph" && <GraphViz />}
      {hashRoute === "#/MergerPage" && <MergerPage />}
      {route === "" && hashRoute == "" && <LandingPage />}
      {hashRoute === "#/CsvViewer" && <CsvViewer />}
      {routeWithoutParams === "#/SingleSpacePage" && <SingleSpacePage />}
    </div>
  );
}
