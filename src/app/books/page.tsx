"use client";
import React, { useState } from "react";
import "./bookspage.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import BookCard from "./card/BookCard";

type Props = {};

const BooksPage = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="booksPage">
          <h2
            className="ml-4 mt-6 text-white text-5xl"
            style={{ fontFamily: "Patrick Hand, cursive" }}
          >
            Time to learn new things... :&#41;
          </h2>
          <div className="flex items-center justify-center mt-8">
            <input
              type="text"
              className="px-4 py-2 text-md placeholder-gray-900 bg-[#e4c8ab] text-black w-[70%] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
              placeholder="Search for a book..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <button
              className="px-4 py-2 bg-[#333333] border-[1.2px] border-black text-white rounded-r-md hover:bg-[#555555] transition-all"
              onClick={() => console.log("Search initiated")}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Search
            </button>
          </div>
          <div className="mt-6 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-4">
            <BookCard
              authorName="John Doe"
              bookName="John Doe"
              imageUrl="https://m.media-amazon.com/images/I/81nFDRsd7jL._SY522_.jpg"
            />
          </div>{" "}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BooksPage;
