import React from "react";
import "./middlepart.css";

type Props = {};

const MiddlePart = (props: Props) => {
  const thoughts = [
    "When the bulls fight, the crop suffers",
    "Do not say anything if you don't know the context of the matter",
    "Don't interfere in matters you know nothing about",
    "The more you talk, the more you lose",
    "Don't trust anyone, not even yourself at times",

    "At the end, everyone will only see the outcome",
    "Even if it's not your fault, they will make it see like it is yours",
    "Books are our true friends",
    "Just stay silent in situations you can't control",
    "Other people want to see your failure, they want to break you",
    "Never listen to others",
  ];

  const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];

  return (
    <>
      <div className="middlePart ">
        <div className="left-box  ">
          <h3>What Book are you looking for?</h3>
          <h4>
            Not sure about what to read? Explore the vast library of books
            &#58;&#41;
          </h4>
          <h5 className="randomThought">
            A random piece of advice: "
            <span
              style={{
                color: "rgba(255, 222, 150, 0.667)",
                textDecoration: "underline",
              }}
            >
              {randomThought}
            </span>
            ."
          </h5>
          <br />
          <div className="buttonsDiv">
            <button className="exploreBtn">Explore now</button>
            <button className="arrowBtn">-&gt;</button>
          </div>
        </div>
        <div className="right-box ">
          <img
            className="girlImage"
            src="https://i.ibb.co/72MhZSJ/image-2-Bwgbt6-Tx-transformed.png"
          />
        </div>
      </div>
    </>
  );
};

export default MiddlePart;
