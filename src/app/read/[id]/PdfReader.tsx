import React, { useEffect, useState } from "react";
import "./pdfreader.css";
import { readPdfPages, PdfPage } from "pdf-text-reader"; // Import pdf-text-reader to read pages

interface PdfReaderProps {
  pdfUrl: string; // PDF URL passed from parent component
}

const PdfReader: React.FC<PdfReaderProps> = ({ pdfUrl }) => {
  const [pages, setPages] = useState<PdfPage[]>([]); // Store PDF pages, type PdfPage from pdf-text-reader
  const [currentPage, setCurrentPage] = useState<number>(0); // Track current page
  const [totalPages, setTotalPages] = useState<number>(0); // Track total pages

  // Function to load PDF pages
  const loadPdf = async () => {
    try {
      const loadedPages = await readPdfPages({ url: pdfUrl });
      setPages(loadedPages); // Set the pages state
      setTotalPages(loadedPages.length); // Set total pages
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  // Load PDF pages on component mount
  useEffect(() => {
    loadPdf();
  }, [pdfUrl]);

  // Function to go to the previous page
  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0)); // Ensure page doesn't go below 0
  };

  // Function to go to the next page
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1)); // Ensure page doesn't exceed total pages
  };

  return (
    <div className="pdf-reader">
      {pages.length > 0 ? (
        <>
          <div className="pdf-content">
            <div className="page">
              {/* Display the text of the current page */}
              <pre>{pages[currentPage]?.lines?.join("\n")}</pre>
            </div>

            {/* Pagination and Custom Arrows */}
            <div className="pagination-controls">
              <button
                className="prev-arrow"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                &#8592; Prev
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                className="next-arrow"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              >
                Next &#8594;
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default PdfReader;
