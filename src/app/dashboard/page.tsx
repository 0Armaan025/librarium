"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import LeftSideBar from "@/components/left-side-bar/LeftSideBar";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";

type Props = {};

const DashboardPage = (props: Props) => {
  const [counter, setCounter] = useState("0");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Ensure local persistence for the auth state
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Error setting persistence:", err);
    });

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.email);
      } else {
        setUser(null);
        console.log("User is not logged in. Redirecting to sign-up...");
        window.location.href = "/sign-up";
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (email: string | null) => {
    if (!email) {
      console.error("No email provided for fetching user data.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setCounter(userData.armaanCounter || "0");
        console.log("User data fetched:", userData);
      } else {
        console.log("No such user document found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSave = async () => {
    if (!user || !user.email) {
      console.error("No authenticated user to save data for.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.email);
      await updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        armaanCounter: counter,
      });
      console.log("User data saved successfully.");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const incrementCounter = () => {
    const newCounter = (parseInt(counter) + 1).toString();
    setCounter(newCounter);
    handleSave();
  };

  return (
    <div className="dashboardPage flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex flex-col sm:flex-row">
        {/* Left Sidebar */}
        <div className="hidden sm:block sm:w-[20%]">
          <LeftSideBar />
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-[#ffe4c9] p-6 sm:p-8 md:p-12 rounded-tl-md rounded-bl-md shadow-md w-full">
          <h4
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Your Profile
          </h4>
          <div className="space-y-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="block w-full sm:w-[70%] md:w-[50%] px-4 py-2 text-md bg-[#e4c8ab] text-black placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000]"
              placeholder="First Name"
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="block w-full sm:w-[70%] md:w-[50%] px-4 py-2 text-md bg-[#e4c8ab] text-black placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000]"
              placeholder="Last Name"
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <label
              className="block text-lg text-black"
              style={{ fontFamily: "Poppins" }}
            >
              Armaan is the best: {counter}
            </label>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 mt-6">
            <button
              style={{ fontFamily: "Poppins, sans-serif" }}
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#333333] text-white text-center transition-all hover:bg-[#434343]"
            >
              Save
            </button>
            <button
              style={{ fontFamily: "Poppins, sans-serif" }}
              onClick={incrementCounter}
              className="w-full sm:w-auto px-6 py-3 mt-4 sm:mt-0 rounded-md bg-[#121111] text-white text-center shadow-xl hover:bg-[#372f2f]"
            >
              Press me (Armaan is the best button!!!!! :D)
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
