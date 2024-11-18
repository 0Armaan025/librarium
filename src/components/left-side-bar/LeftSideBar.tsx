import React from "react";

type Props = {};

const LeftSideBar = (props: Props) => {
  return (
    <div className="leftSideBar flex flex-col justify-start items-start w-full sm:w-[30%] md:w-[25%] lg:w-[20%]">
      <div className="leftSideBarContainer bg-[#242424] py-4 px-5 sm:px-6 md:px-7 h-[70vh] sm:h-[80vh] md:h-[83vh] rounded-tr-md rounded-br-md shadow-lg">
        <div
          className="leftSideBarTitle w-full text-white font-bold text-lg sm:text-xl"
          style={{ fontFamily: "Poppins" }}
        >
          <h1>Dashboard</h1>
        </div>
        <div className="leftSideBarContent w-full mt-4">
          <ul className="p-2 w-full space-y-2">
            <li
              className="p-2 text-gray-200 bg-transparent rounded-md cursor-pointer transition-all hover:bg-[#4a4a4a] w-full text-sm sm:text-base md:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              Your Profile
            </li>
            <li
              className="p-2 text-gray-200 bg-transparent rounded-md cursor-pointer transition-all hover:bg-[#4a4a4a] w-full text-sm sm:text-base md:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              Read books
            </li>
            <li
              className="p-2 text-gray-200 bg-transparent rounded-md cursor-pointer transition-all hover:bg-[#4a4a4a] w-full text-sm sm:text-base md:text-lg"
              style={{ fontFamily: "Poppins" }}
            >
              Shortlisted books
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
