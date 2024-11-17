import React from "react";
import "./postmiddlepage.css";
import BookShowOffPage from "@/components/book-showoff/BookShowOff";
import Link from "next/link";

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
            <Link href="/book/9781644452752 ">
              <BookShowOffPage
                author="by Diane Seuss (Graywolf)"
                title="Modern Poetry"
                bgColor="#ffe4c9"
                imageUrl="https://m.media-amazon.com/images/I/81ZcSPCgHFL._SY522_.jpg"
              />
            </Link>
            <div className="mt-4">
              <Link href="/book/9781911717201">
                <BookShowOffPage
                  author="by Edwin Frank (Farrar, Straus & Giroux)"
                  title="Stranger Than Fiction"
                  bgColor="#c4a588"
                  imageUrl="https://m.media-amazon.com/images/I/710ggkCftAL._SY522_.jpg"
                />
              </Link>
            </div>
            <Link href="/book/9781324066255">
              <BookShowOffPage
                author="by Brian VanDeMark (Norton)"
                title="Kent State"
                bgColor="#ffe4c9"
                imageUrl="https://m.media-amazon.com/images/I/81nFDRsd7jL._SY522_.jpg"
              />
            </Link>
          </div>
        </div>
      </center>
    </>
  );
};

export default PostMiddlePart;
