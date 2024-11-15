import React, { useState, useRef } from "react";
import "./flipbook.css";

type Props = {
  pages: string[]; // Array of image URLs or page content
};

const FlipBook: React.FC<Props> = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const flipbookRef = useRef<HTMLDivElement | null>(null);

  const totalPages = pages.length;

  // Flip to the next page
  const nextPage = () => {
    if (flipping || currentPage >= totalPages - 1) return;
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      setFlipping(false);
    }, 500); // Duration of the flip animation
  };

  // Flip to the previous page
  const prevPage = () => {
    if (flipping || currentPage <= 0) return;
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => Math.max(prev - 1, 0));
      setFlipping(false);
    }, 500);
  };

  // Jump to a specific page
  const goToPage = (pageNum: number) => {
    if (pageNum >= 0 && pageNum < totalPages && !flipping) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
      <div className="flipbook" ref={flipbookRef}>
        {/* Single Page Display */}
        <div
          className={`flipbook-page ${flipping ? "flipping" : ""}`}
          style={{ backgroundImage: `url(${pages[currentPage]})` }}
        ></div>

        {/* Navigation buttons */}
        <button
          onClick={prevPage}
          disabled={flipping || currentPage === 0}
          className="prev-btn"
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={flipping || currentPage === totalPages - 1}
          className="next-btn"
        >
          Next
        </button>

        {/* Page number display and input */}
      </div>
      <div className="page-navigation">
        <span>Page </span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage + 1}
          onChange={(e) => goToPage(Number(e.target.value) - 1)}
          className="page-input"
        />
        <span> of {totalPages}</span>
      </div>
    </>
  );
};

export default FlipBook;
