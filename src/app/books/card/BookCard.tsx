import React from "react";

type Props = {
  bookName: string;
  authorName: string;
  imageUrl: string;
};

const BookCard = (props: Props) => {
  return (
    <div className="card bg-gradient-to-r from-[#f3e2d1] to-[#e4c8ab] cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl p-4 m-4 rounded-lg shadow-lg hover:shadow-2xl">
      <img
        src={props.imageUrl}
        alt="Book Cover"
        className="w-full h-72 object-cover rounded-lg mb-4 transition-transform duration-300 transform hover:scale-105"
      />
      <h3
        className="text-xl font-semibold text-black tracking-wide mb-2"
        style={{ fontFamily: "Raleway, sans-serif" }}
      >
        {props.bookName}
      </h3>
      <p
        className="text-gray-700 text-md"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        by {props.authorName}
      </p>
    </div>
  );
};

export default BookCard;
