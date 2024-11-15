import React from "react";
import "./middlepart.css";

type Props = {};

const MiddlePart = (props: Props) => {
  return (
    <>
      <div className="middlePart ">
        <div className="left-box  ">
          <h3>What Book are you looking for?</h3>
          <h4>
            Not sure about what to read? Explore the vast library of books
            &#58;&#41;
          </h4>
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
