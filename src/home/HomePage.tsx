import Navbar from "@/components/navbar/Navbar";
import React from "react";
import MiddlePart from "./middle/MiddlePart";
import PostMiddlePart from "./post-middle/PostMiddlePart";
import Footer from "@/components/footer/Footer";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <>
      <Navbar />
      <MiddlePart />
      <PostMiddlePart />
      <Footer />
    </>
  );
};

export default HomePage;
