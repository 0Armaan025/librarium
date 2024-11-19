"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { db } from "@/firebase/firebaseConfig";

type ForumThread = {
  id: string; // Firestore document ID
  title: string;
  author: string;
  timestamp: string;
  replies: number;
};

const ForumPage = () => {
  const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newThread, setNewThread] = useState({
    title: "",
    author: "",
  });
  const router = useRouter();

  // Fetch threads from Firestore
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "forumThreads"));
        const threads: ForumThread[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ForumThread[];
        setForumThreads(threads);
      } catch (error) {
        console.error("Error fetching threads: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  // Handle new forum thread submission
  const handleNewThreadSubmit = async () => {
    if (!newThread.title.trim() || !newThread.author.trim()) {
      alert("Please fill out all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "forumThreads"), {
        ...newThread,
        replies: 0,
        timestamp: Timestamp.now().toDate().toLocaleString(),
      });
      setIsModalOpen(false);
      setNewThread({ title: "", author: "" });
      // Refresh threads after adding new one
      const querySnapshot = await getDocs(collection(db, "forumThreads"));
      const threads: ForumThread[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumThread[];
      setForumThreads(threads);
    } catch (error) {
      console.error("Error adding new thread: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1
            className="text-4xl font-semibold text-gray-100 mb-8"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Forum Discussions
          </h1>
          <div className="flex  justify-between items-center mb-6">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
              onClick={() => setIsModalOpen(true)}
            >
              Start a Forum
            </button>
          </div>
          <div className="space-y-6">
            {forumThreads.map((thread) => (
              <div
                key={thread.id}
                className="bg-[#e4c8ab] shadow-md rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/discussion/${thread.id}`)}
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  {thread.title}
                </h2>
                <p className="text-sm text-gray-600">
                  By {thread.author} | {thread.timestamp} | {thread.replies}{" "}
                  replies
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal for Starting a New Forum */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#252525] text-white  p-6 rounded-lg shadow-lg w-96">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Start a New Forum
            </h2>
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
              placeholder="Title"
              value={newThread.title}
              onChange={(e) =>
                setNewThread({ ...newThread, title: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
              placeholder="Your Name"
              value={newThread.author}
              onChange={(e) =>
                setNewThread({ ...newThread, author: e.target.value })
              }
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#e4c8ab] text-white py-2 px-4 rounded-md hover:bg-[#ffb86c] transition-colors"
                onClick={handleNewThreadSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPage;
