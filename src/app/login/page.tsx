"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PasswordInput from "@/components/password-input/PasswordInput";

type Props = {};

const LoginPage = (props: Props) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid credentials, please try again.");
    }
  };

  useEffect(() => {
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

  const handleGuestLogin = () => {
    router.push("/books");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row justify-center items-start mt-8 gap-4">
          {/* Left Section */}
          <div className="flex p-4 bg-[#ffe4c9] h-auto md:h-[70vh] w-[90%] md:w-[50%] mx-auto md:ml-[1rem] rounded-[1rem] flex-col justify-start items-start">
            <h4
              className="text-2xl md:text-3xl text-black mt-4 font-semibold ml-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Log in to your account
            </h4>
            <h5 className="ml-5 text-sm mt-2">
              Don't have an account?{" "}
              <span className="underline cursor-pointer">Sign up!</span>
            </h5>
            <input
              type="email"
              className="px-4 ml-4 mr-4 mt-8 p-2 text-md bg-[#e4c8ab] text-black w-[88%] placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <PasswordInput value={password} onChange={handlePasswordChange} />
            {error && <p className="text-red-500 text-sm ml-4 mt-2">{error}</p>}
            <button
              onClick={handleLogin}
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="w-[88%] rounded-md mt-2 h-12 align-center justify-center ml-4 text-white transition-all hover:bg-[#434343] bg-[#333333]"
            >
              Log in
            </button>
            <center>
              <h4
                className="text-center mt-2"
                style={{ fontFamily: "Poppins" }}
              >
                or continue with:
              </h4>
            </center>
            <button
              onClick={handleGuestLogin}
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="w-[88%] rounded-md mt-2 h-12 align-center justify-center ml-4 text-black hover:text-black transition-all border-[1.2px] border-black hover:bg-white hover:bg-opacity-60 bg-transparent"
            >
              Continue as a guest
            </button>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex p-4 bg-[#242424] w-full md:w-[60%] h-[70vh] md:ml-[2rem] rounded-[1rem] flex-col justify-start items-start relative">
            <button
              style={{ fontFamily: "poppins, sans-serif" }}
              className="absolute top-4 right-4 md:top-[8rem] md:right-[2.5rem] bg-white bg-opacity-25 hover:bg-opacity-40 transition-all text-[0.6rem] px-4 border-[1.5px] border-black py-2 rounded-3xl text-white"
            >
              &lt;- Go back
            </button>
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D"
              className="w-full h-full rounded-md object-cover"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
