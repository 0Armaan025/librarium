"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

type Comment = {
  id: number;
  author: string;
  content: string;
  timestamp: string;
};

type Thread = {
  id: number;
  title: string;
  author: string;
  content: string;
  timestamp: string;
  comments: Comment[];
};

type Props = {};

const DiscussionPage = (props: Props) => {
  const [comment, setComment] = useState("");
  const [thread, setThread] = useState<Thread | null>(null);

  const { id } = useParams(); // This will get the dynamic thread ID from the URL

  // Dummy data for a specific thread
  const fetchThreadData = async (threadId: number) => {
    // In a real scenario, you would fetch data from an API or database here
    const dummyThread: Thread = {
      id: threadId,
      title: "What is your favorite programming language?",
      author: "Alice",
      content:
        "Programming languages have different paradigms and use cases. What is your favorite one and why?",
      timestamp: "2 hours ago",
      comments: [
        {
          id: 1,
          author: "Bob",
          content: "I love JavaScript because it's so versatile!",
          timestamp: "1 hour ago",
        },
        {
          id: 2,
          author: "Charlie",
          content: "Python is my favorite for its simplicity and readability.",
          timestamp: "30 minutes ago",
        },
      ],
    };
    setThread(dummyThread);
  };

  // Fetch the thread when the page loads and the thread ID is available
  useEffect(() => {
    if (id) {
      fetchThreadData(Number(id));
    }
  }, [id]);

  const handlePostComment = () => {
    if (comment.trim()) {
      // Add the new comment to the thread (In a real app, this should be sent to the server)
      const newComment: Comment = {
        id: Date.now(),
        author: "CurrentUser",
        content: comment,
        timestamp: "Just now",
      };
      setThread((prevThread) => {
        if (prevThread) {
          return {
            ...prevThread,
            comments: [newComment, ...prevThread.comments],
          };
        }
        return prevThread;
      });
      setComment(""); // Clear the comment input after posting
    }
  };

  if (!thread) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold">Loading thread...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen  flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            {/* Thread Details */}
            <div className="bg-[#3b3b3b] shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-3xl font-semibold text-gray-200">
                {thread.title}
              </h2>
              <p className="text-sm text-gray-300 mt-2">
                By {thread.author} | {thread.timestamp}
              </p>
              <p className="text-lg text-gray-100 mt-4">{thread.content}</p>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              {thread.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#5a5959] shadow-md rounded-lg p-4 transition-all cursor-pointer hover:scale-105"
                >
                  <p className="font-semibold text-gray-200">
                    {comment.author}
                  </p>
                  <p className="text-sm text-gray-300">{comment.timestamp}</p>
                  <p className="mt-2 text-gray-100">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Section */}
            <div className="bg-[#606060] shadow-md rounded-lg p-6 mt-8">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Add Your Comment
              </h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your comment..."
              />
              <button
                className="mt-4 w-full py-2  bg-[#404040] text-white rounded-md hover:bg-[#232323] transition-all"
                onClick={handlePostComment}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default DiscussionPage;
