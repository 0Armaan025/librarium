import React from "react";

type Props = {
  bookName: string;
  authorName: string;
  imageUrl: string;
  onClick?: () => void;
};

const BookCard = ({ bookName, authorName, imageUrl, onClick }: Props) => {
  return (
    <div
      className="card bg-gradient-to-r from-[#f3e2d1] to-[#e4c8ab] cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl p-4 m-4 rounded-lg shadow-lg"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={`${bookName} cover`}
        className="w-full h-72 object-cover rounded-lg mb-4 transition-transform duration-300 transform hover:scale-105"
      />
      <h3
        className="text-xl font-semibold text-black tracking-wide mb-2"
        style={{ fontFamily: "Raleway, sans-serif" }}
      >
        {bookName || "Untitled Book"}
      </h3>
      <p
        className="text-gray-700 text-md"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {authorName ? `by ${authorName}` : "Unknown Author"}
      </p>
    </div>
  );
};

export default BookCard;
