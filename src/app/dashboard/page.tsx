"use client";
import React, { useState } from "react";
import "./dashboardpage.css";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import LeftSideBar from "@/components/left-side-bar/LeftSideBar";

type Props = {};

const DashboardPage = (props: Props) => {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <div className="dashboardPage flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="flex flex-row justify-start items-start">
            <div className="flex flex-col justify-center items-center">
              <LeftSideBar />
            </div>
            <div className="flex rounded-tl-md rounded-bl-md h-[83vh] bg-[#ffe4c9] w-full flex-col justify-start items-start">
              <h4
                className="ml-4 mt-4 text-black font-semibold text-4xl"
                style={{ fontFamily: "Poppins,sans-serif" }}
              >
                Your Profile
              </h4>
              <input
                type="email"
                className="px-4 ml-4 mr-4 mt-8 p-2 text-md bg-[#e4c8ab] text-black w-[40%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
                placeholder="First Name"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
              <input
                type="email"
                className="px-4 ml-4 mr-4 mt-2 p-2 text-md bg-[#e4c8ab] text-black w-[40%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
                placeholder="Last Name"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
              <label className="ml-5 mt-2 " style={{ fontFamily: "Poppins" }}>
                Armaan is the best: {counter}
              </label>
              <button
                style={{ fontFamily: "Poppins, sans-serif" }}
                className="w-[40%] rounded-md mt-4 h-12 align-center justify-center ml-4 text-white transition-all hover:bg-[#434343] bg-[#333333]"
              >
                Save
              </button>

              <button
                style={{ fontFamily: "Poppins, sans-serif" }}
                onClick={() => {
                  setCounter(counter + 1);
                }}
                className="w-[80%] rounded-md mt-8  h-12 align-center justify-center ml-24 text-white transition-all shadow-xl shadow-black hover:bg-[#372f2f] bg-[#121111]"
              >
                Press me (Armaan is the best button!!!!! :D)
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;
