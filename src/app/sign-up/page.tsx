"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Import from the updated firebaseConfig
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PasswordInput from "@/components/password-input/PasswordInput";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [armaanCounter, setArmaanCounter] = useState("0");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [user, setUser] = useState(null); // State to hold the logged-in user
  const router = useRouter();
  const auth = getAuth();

  // Ensure persistence across sessions and page reloads
  useEffect(() => {
    // Set the persistence for Firebase Authentication
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Error setting persistence", err);
    });

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser as any); // Set user state if user is logged in

        console.log(currentUser);
      } else {
        setUser(null); // Clear user state if logged out
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [auth]);

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      setError("All fields are required!");
      return;
    }

    try {
      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Redirect to dashboard if user exists
        setError("User already exists. Redirecting to dashboard...");
        router.push("/dashboard");
        return;
      }

      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Add user data to Firestore
      await setDoc(userDocRef, {
        firstName,
        armaanCounter,
        lastName,
        email,
        createdAt: new Date().toISOString(),
        uid: userCredential.user.uid,
      });

      // Redirect to dashboard after successful signup
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message); // Show error message if something goes wrong
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="flex flex-row justify-start items-start mt-12">
          <div className="flex p-4 bg-[#242424] w-[60%] h-[70vh] ml-[1rem] rounded-[1rem] flex-col justify-start items-start">
            <button
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="absolute top-[8rem] left-[2.5rem] bg-white bg-opacity-25 hover:bg-opacity-40 transition-all text-[0.6rem] px-4 border-[1.5px] border-black py-2 rounded-3xl text-white"
              onClick={() => router.back()}
            >
              &lt;- Go back
            </button>
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D"
              className="w-full h-full rounded-md"
            />
          </div>
          <div className="flex p-4 bg-[#ffe4c9] h-[70vh] w-[50%] rounded-[1rem] mr-[1rem] ml-[2rem] flex-col justify-start items-start">
            <h4
              className="text-3xl text-black mt-4 font-semibold ml-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Create an account
            </h4>
            <h5 className="ml-5 text-sm mt-2">
              Already have an account?{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Log in!
              </span>
            </h5>

            <div className="flex flex-row justify-center items-center ml-4 mt-12 mx-12">
              <input
                type="text"
                className="px-4 p-2 text-md bg-[#e4c8ab] text-black w-[100%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
                placeholder="First name"
                style={{ fontFamily: "Poppins, sans-serif" }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                className="px-4 p-2 ml-4 text-md bg-[#e4c8ab] text-black  w-[100%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
                placeholder="Last name"
                style={{ fontFamily: "Poppins, sans-serif" }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <input
              type="email"
              className="px-4 ml-4 mr-4 mt-2 p-2 text-md bg-[#e4c8ab] text-black w-[88%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
              placeholder="Email"
              style={{ fontFamily: "Poppins, sans-serif" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm ml-4 mt-2">{error}</p>}
            <button
              onClick={handleSignUp}
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="w-[88%] rounded-md mt-2 h-12 align-center justify-center ml-4 text-white transition-all hover:bg-[#434343] bg-[#333333]"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
