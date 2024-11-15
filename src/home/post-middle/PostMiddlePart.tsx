import React from "react";
import "./postmiddlepage.css";
import BookShowOffPage from "@/components/book-showoff/BookShowOff";

type Props = {};

const PostMiddlePart = (props: Props) => {
  return (
    <>
      <center>
        <div className="postMiddlePart">
          <h3 className="postMiddleHeadline">2024 Trending Books</h3>

          <h4 className="postMiddleSubHeadline">
            Top 3 most popular reads of the year
          </h4>
          <br />

          <div className="bookShowOff ">
            <BookShowOffPage
              author="by Diane Seuss (Graywolf)"
              title="Modern Poetry"
              bgColor="#ffe4c9"
              imageUrl="https://m.media-amazon.com/images/I/81ZcSPCgHFL._SY522_.jpg"
            />
            <div className="mt-4">
              <BookShowOffPage
                author="by Edwin Frank (Farrar, Straus & Giroux)"
                title="Stranger Than Fiction"
                bgColor="#c4a588"
                imageUrl="https://m.media-amazon.com/images/I/710ggkCftAL._SY522_.jpg"
              />
            </div>
            <BookShowOffPage
              author="by Brian VanDeMark (Norton)"
              title="Kent State"
              bgColor="#ffe4c9"
              imageUrl="https://m.media-amazon.com/images/I/81nFDRsd7jL._SY522_.jpg"
            />
          </div>
        </div>
      </center>
    </>
  );
};

export default PostMiddlePart;
