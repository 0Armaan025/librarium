"use client";
import React, { useState } from "react";
import "./loginpage.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import PasswordInput from "@/components/password-input/PasswordInput";

type Props = {};

const LoginPage = (props: Props) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="flex flex-row justify-start items-start mt-12">
          <div className="flex p-4 bg-[#ffe4c9] h-[70vh] w-[50%] ml-[1rem] rounded-[1rem] flex-col justify-start items-start">
            <h4
              className="text-3xl text-black mt-4 font-semibold ml-4"
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
            <button
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="w-[88%] rounded-md mt-2 h-12 align-center justify-center ml-4 text-white transition-all hover:bg-[#434343] bg-[#333333]"
            >
              Log in
            </button>
            <center>
              <h4 className="ml-[11rem] mt-2" style={{ fontFamily: "Poppins" }}>
                or continue with:
              </h4>
            </center>
            <button
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="w-[88%] rounded-md mt-2 h-12 align-center justify-center ml-4 text-black hover:text-black transition-all border-[1.2px] border-black hover:bg-white hover:bg-opacity-60 bg-transparent"
            >
              Continue as a guest
            </button>
          </div>
          <div className="flex p-4 bg-[#242424] w-[60%] h-[70vh] ml-[2rem] rounded-[1rem] flex-col justify-start items-start">
            <button
              style={{ fontFamily: "poppins, sans-serif" }}
              className="absolute top-[8rem] right-[2.5rem] bg-white bg-opacity-25 hover:bg-opacity-40 transition-all text-[0.6rem] px-4 border-[1.5px] border-black py-2 rounded-3xl text-white"
            >
              &lt;- Go back
            </button>
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGlicmFyeXxlbnwwfHwwfHx8MA%3D%3D"
              className="w-full h-full rounded-md"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
