import React from "react";

type Props = {
  bookName: string;
  authorName: string;
  imageUrl: string;
};

const BookCard = (props: Props) => {
  return (
    <div className="card bg-[#ddc2a8] cursor-pointer transition-all hover:scale-105 hover:bg-[#bba085] p-3 m-2 rounded-md shadow-md">
      <img
        src={props.imageUrl}
        alt="Book Cover"
        className="w-full h-60 object-cover rounded-md mb-4"
      />
      <h3
        className="text-lg font-semibold text-black"
        style={{ fontFamily: "Raleway, sans-serif" }}
      >
        {props.bookName}
      </h3>
      <p className="text-gray-900" style={{ fontFamily: "Poppins" }}>
        {props.authorName}
      </p>
    </div>
  );
};

export default BookCard;
