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
import { db, auth } from "@/firebase/firebaseConfig";
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
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      window.location.href = "/dashboard";
    }

    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Error setting persistence", err);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser as any);
        window.location.href = "/dashboard";
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      setError("All fields are required!");
      return;
    }

    try {
      const userDocRef = doc(db, "users", email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setError("User already exists. Redirecting to dashboard...");
        router.push("/dashboard");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(userDocRef, {
        firstName,
        armaanCounter,
        lastName,
        password,
        email,
        createdAt: new Date().toISOString(),
        uid: userCredential.user.uid,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start mt-12 space-y-8 lg:space-y-0 lg:space-x-8 px-4">
          {/* Image Section */}
          <div className="relative flex p-4 bg-[#242424] w-full lg:w-[40%] xl:w-[35%] h-80 md:h-[70vh] rounded-[1rem] flex-col justify-start items-start">
            <button
              className="absolute top-4 left-4 bg-white bg-opacity-25 hover:bg-opacity-40 transition-all text-xs sm:text-sm px-4 border-[1.5px] border-black py-2 rounded-3xl text-white"
              onClick={() => router.back()}
            >
              &lt;- Go back
            </button>
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D"
              className="w-full h-full rounded-md object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="flex p-4 bg-[#ffe4c9] w-full lg:w-[50%] xl:w-[45%] h-auto md:h-[70vh] rounded-[1rem] flex-col justify-start items-start">
            <h4
              className="text-xl sm:text-2xl md:text-3xl text-black mt-4 font-semibold"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Create an account
            </h4>
            <h5 className="text-sm sm:text-base mt-2">
              Already have an account?{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Log in!
              </span>
            </h5>

            {/* Name Fields */}
            <div className="flex flex-col sm:flex-row justify-between w-full mt-8">
              <input
                type="text"
                className="px-4 py-2 text-sm md:text-base bg-[#e4c8ab] text-black w-full sm:w-[48%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="First name"
                style={{ fontFamily: "Poppins, sans-serif" }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                className="px-4 py-2 mt-4 sm:mt-0 sm:ml-4 text-sm md:text-base bg-[#e4c8ab] text-black w-full sm:w-[48%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Last name"
                style={{ fontFamily: "Poppins, sans-serif" }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Email Field */}
            <input
              type="email"
              className="px-4 py-2 mt-4 text-sm md:text-base bg-[#e4c8ab] text-black w-full placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Email"
              style={{ fontFamily: "Poppins, sans-serif" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Input */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Submit Button */}
            <button
              onClick={handleSignUp}
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="w-full rounded-md mt-4 h-12 text-white transition-all hover:bg-[#434343] bg-[#333333]"
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
