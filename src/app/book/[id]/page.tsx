"use client";
import React from "react";
import "./bookinfopage.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

type Props = {};

const BookInfoPage = (props: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow px-4 py-8 sm:px-16">
        <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between gap-8">
          <div className="w-full sm:w-1/3 flex justify-center">
            <img
              src="https://media.newyorker.com/photos/672d6250f393a9ac8b8d73c3/master/w_1000,c_limit/r45260.jpg"
              alt="Book Cover"
              className="w-full h-[30rem] rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full sm:w-2/3 h-[30rem] bg-[#ffe4c9] p-6 rounded-lg shadow-lg border border-gray-200 space-y-4">
            <h2
              className="text-4xl font-semibold text-gray-900"
              style={{ fontFamily: "Poppins" }}
            >
              Book Title
            </h2>
            <h3
              className="text-xl text-gray-600"
              style={{ fontFamily: "Poppins" }}
            >
              Author: <span className="font-semibold">John Doe</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 text-gray-600">
              <h4 className="text-lg" style={{ fontFamily: "Poppins" }}>
                ISBN: <span className="font-semibold">341242342</span>
              </h4>
              <h4 className="text-lg" style={{ fontFamily: "Poppins" }}>
                ID: <span className="font-semibold">343243132</span>
              </h4>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 text-gray-600">
              <h5 className="text-lg" style={{ fontFamily: "Poppins" }}>
                Genre: <span className="font-semibold">Fiction</span>
              </h5>
              <h5 className="text-lg" style={{ fontFamily: "Poppins" }}>
                Published: <span className="font-semibold">2021</span>
              </h5>
            </div>
            <h5
              className="text-lg text-gray-600"
              style={{ fontFamily: "Poppins" }}
            >
              Publisher: <span className="font-semibold">Someone</span>
            </h5>
            <h5
              className="text-lg text-gray-600"
              style={{ fontFamily: "Poppins" }}
            >
              Language: <span className="font-semibold">English</span>
            </h5>
            <p
              className="text-md text-gray-700 mt-4"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nib. Curabitur blandit tempus porttitor.
            </p>
            <br />
            <div className="mt-24 flex flex-row justify-center items-center">
              <button
                className="p-4 bg-[#242424] hover:bg-[#0b0b0b] transition-all text-white rounded-lg font-semibold text-sm w-72"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Read this book
              </button>
              <button
                className="p-4 border-[1.5px] border-gray-800 ml-4  text-black hover:bg-white transition-all rounded-lg font-semibold text-sm w-72"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Read it later
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookInfoPage;
