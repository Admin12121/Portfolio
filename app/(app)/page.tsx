import React from "react";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("./_components"));

const page = () => {
  return <Home />;
};

export default page;
