import React from "react";
import "./leftsidebar.css";
type Props = {};

const LeftSideBar = (props: Props) => {
  return (
    <>
      <div className="leftSideBar flex flex-col justify-start items-start w-full">
        <div className="leftSideBarContainer  bg-[#242424] py-4 px-7 h-[83vh] rounded-tr-md rounded-br-md">
          <div
            className="leftSideBarTitle w-full text-white font-bold text-xl"
            style={{ fontFamily: "Poppins" }}
          >
            <h1>Dashboard</h1>
          </div>
          <div className="leftSideBarContent w-full">
            <ul className="p-2 w-full mt-2">
              <li
                className="p-2 text-gray-200 bg-transparent rounded-md cursor-pointer transition-all  hover:bg-[#4a4a4a] w-full"
                style={{ fontFamily: "Poppins" }}
              >
                Your Profile
              </li>
              <li
                className="p-2 text-gray-200  bg-transparent rounded-md cursor-pointer transition-all  hover:bg-[#4a4a4a] w-full"
                style={{ fontFamily: "Poppins" }}
              >
                Read books
              </li>
              <li
                className="p-2 text-gray-200 bg-transparent rounded-md cursor-pointer transition-all  hover:bg-[#4a4a4a] w-full"
                style={{ fontFamily: "Poppins" }}
              >
                Shortlisted books
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;
