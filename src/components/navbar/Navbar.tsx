import React from "react";
import "./navbar.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-gradient-to-br from-[#333333] shadow-lg px-4 py-2 sm:px-6 md:px-8 lg:px-10">
        <div className="text-lg font-bold">
          <Link href="/">
            <img
              src="https://i.ibb.co/qFngHqh/Screenshot-2024-11-15-104300-removebg-preview-1.png"
              className="w-32 sm:w-40 md:w-48 cursor-pointer h-10 sm:h-14"
            />
          </Link>
        </div>
        <div className="flex space-x-4 mr-4 sm:mr-6 lg:mr-10">
          <Link href="/books">
            <div className="text-md titleMiddleText text-white">Books</div>
          </Link>
          <Link href="/forum">
            <div className="text-md titleMiddleText text-white">Forum</div>
          </Link>
        </div>
        <Link href="/dashboard">
          <button className="dashboardBtn text-sm cursor-pointer hover:bg-white text-white transition-all bg-transparent border-[1.5px] border-[#898989] hover:text-black p-2 w-24 sm:w-28 lg:w-32 rounded">
            Dashboard
          </button>
        </Link>
      </div>
    </>
  );
};

export default Navbar;
