import React from "react";
import "./navbar.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-gradient-to-br from-[#333333] shadow-lg  px-2">
        <div className="text-lg font-bold">
          <Link href="/">
            <img
              src="https://i.ibb.co/qFngHqh/Screenshot-2024-11-15-104300-removebg-preview-1.png"
              className="w-40 cursor-pointer h-14"
              // className="bg-blend-difference blend"
            />
          </Link>
        </div>
        <div className="flex space-x-4 mr-[2rem]">
          <Link href="/books">
            <div className="text-md titleMiddleText text-white">Books</div>
          </Link>
          <div className="text-md  titleMiddleText text-white">Forum</div>
        </div>
        <Link href="/dashboard">
          <button className="dashboardBtn text-sm cursor-pointer hover:bg-white text-white transition-all bg-transparent border-[1.5px] border-[#898989] hover:text-black p-2 w-28 rounded">
            Dashboard
          </button>
        </Link>
      </div>
    </>
  );
};

export default Navbar;
