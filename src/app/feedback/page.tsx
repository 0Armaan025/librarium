"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { db, auth } from "@/firebase/firebaseConfig";
import { addDoc, collection, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const FeedbackPage = () => {
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [specialName, setSpecialName] = useState<string>("anonymous");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Check if the user is logged in and fetch user details
  const checkUserAndFetchSpecialName = async () => {
    return new Promise<string>((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDocRef = doc(db, "users", user.email!); // Assuming user email is unique as doc ID
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            resolve(userData?.firstName || "anonymous");
          } else {
            resolve("anonymous");
          }
        } else {
          resolve("anonymous");
        }
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      setError("Please fill out both fields.");
      return;
    }

    setLoading(true);
    try {
      const fetchedSpecialName = await checkUserAndFetchSpecialName();

      await addDoc(collection(db, "feedback"), {
        name,
        message,
        special_name: fetchedSpecialName,
        timestamp: new Date(),
      });

      setSuccess(true);
      setName("");
      setMessage("");
    } catch (error) {
      setError("Error submitting your feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen  text-white">
      <Navbar />
      <div className="flex-grow flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-lg bg-[#242424] p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-4">Feedback</h2>

          {success && (
            <div className="text-green-400 mb-4">
              Thank you for your feedback!
            </div>
          )}

          {error && <div className="text-red-400 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Please enter your name so Armaan knows who is there :)"
                className="w-full p-3 bg-gray-700 text-white rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg mb-2">
                Your Message (hey, armaan here, please leave a feedback here)
              </label>
              <textarea
                id="message"
                value={message}
                style={{ fontFamily: "Sour gummy, sans-serif" }}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your feedback here..."
                className="w-full p-3 h-52 bg-gray-700 text-white rounded-lg"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 transition-all bg-[#434343] rounded-lg text-lg font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#202020]"
              }`}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackPage;
