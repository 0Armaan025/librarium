"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { db, auth } from "@/firebase/firebaseConfig";

type Comment = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
};

type Thread = {
  id: string;
  title: string;
  author: string;
  content: string;
  timestamp: string;
  comments: Comment[];
};

const DiscussionPage = () => {
  const [comment, setComment] = useState("");
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Anonymous");
  const { id } = useParams() as any;

  // Fetch the current user and their name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        if (email) {
          try {
            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              setUserName(userData.firstName || "Anonymous");
            } else {
              setUserName("Anonymous");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUserName("Anonymous");
          }
        }
      } else {
        setUserName("Anonymous");
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  // Fetch thread data
  useEffect(() => {
    const fetchThreadData = async () => {
      try {
        if (!id) throw new Error("Invalid thread ID");

        const threadDoc = await getDoc(doc(db, "forumThreads", id));
        if (threadDoc.exists()) {
          const threadData = threadDoc.data();
          setThread({
            id: threadDoc.id,
            ...threadData,
            comments: threadData.comments || [], // Initialize empty comments if missing
          } as Thread);
        } else {
          console.error("Thread not found");
        }
      } catch (error) {
        console.error("Error fetching thread:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreadData();
  }, [id]);

  const handlePostComment = async () => {
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: userName, // Use fetched username or Anonymous
      content: comment.trim(),
      timestamp: new Date().toLocaleString(),
    };

    try {
      if (thread) {
        const threadRef = doc(db, "forumThreads", thread.id);
        await updateDoc(threadRef, {
          comments: arrayUnion(newComment),
        });

        setThread((prev) =>
          prev ? { ...prev, comments: [newComment, ...prev.comments] } : prev
        );
        setComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold">Loading thread...</p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold">Thread not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
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
            {thread.comments.length > 0 ? (
              thread.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#5a5959] shadow-md rounded-lg p-4 transition-all"
                >
                  <p className="font-semibold text-gray-200">
                    {comment.author}
                  </p>
                  <p className="text-sm text-gray-300">{comment.timestamp}</p>
                  <p className="mt-2 text-gray-100">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No comments yet.</p>
            )}
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
              className={`mt-4 w-full py-2 bg-[#404040] text-white rounded-md hover:bg-[#232323] transition-all ${
                !comment.trim() && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handlePostComment}
              disabled={!comment.trim()}
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DiscussionPage;
