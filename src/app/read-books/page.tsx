"use client";
import React, { useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import LeftSideBar from "@/components/left-side-bar/LeftSideBar";

type Props = {};

const ReadBooks = (props: Props) => {
  const [counter, setCounter] = useState(0);

  // Dummy data for the books you've read
  const readBooks = [
    {
      id: 1,
      coverImage: "https://via.placeholder.com/100x150", // Replace with actual URL if available
      name: "Book Title 1",
      author: "Author Name 1",
    },
    {
      id: 2,
      coverImage: "https://via.placeholder.com/100x150",
      name: "Book Title 2",
      author: "Author Name 2",
    },
    {
      id: 3,
      coverImage: "https://via.placeholder.com/100x150",
      name: "Book Title 3",
      author: "Author Name 3",
    },
  ];

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
              {/* Section for read books */}
              <div className="ml-4 mt-8">
                <h4
                  className="text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Books You've Read
                </h4>
                <div className="flex flex-wrap gap-4 mt-4">
                  {readBooks.map((book) => (
                    <div
                      key={book.id}
                      className="w-48 h-72 bg-[#343434] hover:bg-[#1e1e1e] transition-all cursor-pointer hover:scale-105 shadow-md rounded-md flex flex-col items-start p-4"
                    >
                      <img
                        src={book.coverImage}
                        alt={book.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <h5
                        className="text-lg font-medium text-white text-center"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {book.name}
                      </h5>
                      <p
                        className="text-sm text-gray-200 text-center"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {book.author}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ReadBooks;
