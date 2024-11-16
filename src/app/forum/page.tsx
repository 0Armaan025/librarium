"use client";
import React, { useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

type ForumThread = {
  id: number;
  title: string;
  author: string;
  timestamp: string;
  replies: number;
};

type Props = {};

const ForumPage = (props: Props) => {
  const [comment, setComment] = useState("");

  // Dummy data for threads
  const forumThreads: ForumThread[] = [
    {
      id: 1,
      title: "What is your favorite programming language?",
      author: "Alice",
      timestamp: "2 hours ago",
      replies: 15,
    },
    {
      id: 2,
      title: "React vs Vue: Which one do you prefer?",
      author: "Bob",
      timestamp: "4 hours ago",
      replies: 8,
    },
    {
      id: 3,
      title: "How to get started with Web Development",
      author: "Charlie",
      timestamp: "1 day ago",
      replies: 25,
    },
  ];

  return (
    <>
      <div className="min-h-screen  flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            {/* Page Title */}
            <h1
              className="text-4xl font-semibold text-gray-100 mb-8"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Forum Discussions
            </h1>

            {/* Forum Threads List */}
            <div className="space-y-6">
              {forumThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-[#e4c8ab]  shadow-md rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {thread.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    By {thread.author} | {thread.timestamp} | {thread.replies}{" "}
                    replies
                  </p>
                  <button
                    className="mt-4 text-red-500 hover:text-red-600 transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Join Discussion
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div className="container w-[90%] ml-12 px-4 py-8 mt-8 bg-[#b8b8b8]  shadow-md rounded-lg">
            <h2
              className="text-2xl font-semibold text-gray-800 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Comment
            </h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your comment..."
            />
            <button
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="mt-4 w-full py-2 bg-[#404040] text-white rounded-md hover:bg-[#232323] transition-colors"
              onClick={() => {
                if (comment.trim()) {
                  alert("Your comment has been posted!");
                  setComment(""); // Clear the comment after posting
                }
              }}
            >
              Post Comment
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ForumPage;
