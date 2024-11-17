"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import LeftSideBar from "@/components/left-side-bar/LeftSideBar";
import { doc, getDoc, updateDoc } from "firebase/firestore";

type Props = {};

const DashboardPage = (props: Props) => {
  const [counter, setCounter] = useState("0");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!auth?.currentUser) {
      window.location.href = "/sign-up"; // Redirect to sign-up if no user found
    } else {
      const currentUserEmail = auth.currentUser?.email;
      setEmail(currentUserEmail || ""); // Set the email from Firebase Auth

      // Fetch user data from Firestore
      const fetchUserData = async () => {
        try {
          // Reference to the document with the user's email (assuming the document ID is the email)
          const userDocRef = doc(db, "users", currentUserEmail || "");
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setCounter(userData.armaanCounter || "0");
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      fetchUserData();
    }
  }, []); // Only run once when the component mounts

  // Save the user data including firstName, lastName, and counter
  const handleSave = async () => {
    try {
      const currentUserEmail = auth.currentUser?.email;
      if (currentUserEmail) {
        const userDocRef = doc(db, "users", currentUserEmail);
        await updateDoc(userDocRef, {
          firstName: firstName,
          lastName: lastName,
          armaanCounter: counter, // Save the current counter value as a string
        });
        console.log("User data saved successfully");
      }
    } catch (error) {
      console.error("Error saving user data: ", error);
    }
  };

  // Increment the counter
  const incrementCounter = () => {
    const newCounter = (parseInt(counter) + 1).toString(); // Increment counter and convert back to string
    setCounter(newCounter);

    // Immediately save the updated counter in Firestore
    handleSave();
  };

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
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-4 ml-4 mr-4 mt-8 p-2 text-md bg-[#e4c8ab] text-black w-[40%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
                placeholder="First Name"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="px-4 ml-4 mr-4 mt-2 p-2 text-md bg-[#e4c8ab] text-black w-[40%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
                placeholder="Last Name"
                style={{ fontFamily: "Poppins, sans-serif" }}
              />
              <label className="ml-5 mt-2 " style={{ fontFamily: "Poppins" }}>
                Armaan is the best: {counter}
              </label>
              <button
                style={{ fontFamily: "Poppins, sans-serif" }}
                onClick={handleSave}
                className="w-[40%] rounded-md mt-4 h-12 align-center justify-center ml-4 text-white transition-all hover:bg-[#434343] bg-[#333333]"
              >
                Save
              </button>

              <button
                style={{ fontFamily: "Poppins, sans-serif" }}
                onClick={incrementCounter}
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
