import React from "react";
import "./bookshowoff.css";

type Props = {
  title: string;
  author: string;
  bgColor: string;
  imageUrl: string;
};

const BookShowOffPage = (props: Props) => {
  return (
    <>
      <div
        className={`bookShowOff ml-8 hover:border-2 hover:border-yellow-400 hover:scale-105 hover:translate-x-3 hover:translate-y-7 cursor-pointer transition-all hover:shadow-md hover:shadow-neutral-900 p-4 flex-col justify-start items-start  rounded-md `}
        style={{ backgroundColor: props.bgColor }}
      >
        <h3
          className="font-md text-black text-3xl w-60 text-start"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {props.title}
        </h3>
        <h4
          className="font-light text-black text-sm "
          style={{ fontFamily: "cursive" }}
        >
          {props.author}
        </h4>

        <img src={props.imageUrl} className="mt-4 w-60 h-60  rounded-md" />
      </div>
    </>
  );
};

export default BookShowOffPage;
