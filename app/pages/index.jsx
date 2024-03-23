import React, { useEffect, useState } from "react";
import InstanceDetailsPage from "@/components/pages/instance";
import SingleSpacePage from "@/components/pages/SpaceInstances";
import LandingPage from "@/components/pages/LandingPage";
import ProfilePage from "@/components/pages/ProfilePage";
import SpacesGraph from "@/components/pages/SpacesGraph";
import DocsPage from "@/components/pages/docs";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  return (
    <div>
      {router.asPath === "/#/spaces" && <SpacesGraph />}
      {router.asPath === "/#/profile" && <ProfilePage />}
      {(router.asPath === "/#/" ||
        (router.pathname === "/" && router.asPath === "/")) && <LandingPage />}
      {router.asPath.includes("/#/SingleSpacePage") && <SingleSpacePage />}
      {router.asPath.includes("/#/instance") && <InstanceDetailsPage />}
      {router.asPath == "/#/docs" && <DocsPage />}
    </div>
  );
};

export default Home;
