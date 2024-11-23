"use client";
import React, { useState, useEffect, useRef } from "react";
import { getCookie } from "cookies-next";
import Footer from "@/components/footer/Footer";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import ePub, { Rendition } from "epubjs";
import Navbar from "@/components/navbar/Navbar";
import { fsync } from "fs";
import { Document, Page, pdfjs } from "react-pdf";

const FlipbookPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [location, setLocation] = useState<string>(""); // For EPUB location
  const [toc, setToc] = useState<any[]>([]); // Table of Contents

  const renditionRef = useRef<Rendition | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState("");

  const workerSrc =
    "https://unpkg.com/pdfjs-dist@4.4.168/legacy/build/pdf.worker.min.mjs";

  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  useEffect(() => {
    const fetchFileFromCookie = async () => {
      const fileExtension = getCookie("file_extension")?.toString();
      const encodedDownloadUrl = getCookie("download_url")?.toString();

      const downloadUrl = encodedDownloadUrl
        ? decodeURIComponent(encodedDownloadUrl)
        : "";

      if (fileExtension && downloadUrl) {
        setLoading(true);

        try {
          if (fileExtension === ".pdf") {
            setPdfUrl(downloadUrl);
          } else if (fileExtension === ".epub") {
            setEpubUrl(downloadUrl);
          }
        } catch (error) {
          console.error("Error fetching or processing file:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchFileFromCookie();
  }, []);

  useEffect(() => {
    if (epubUrl && viewerRef.current) {
      const book = ePub(epubUrl);
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
      });

      renditionRef.current = rendition;

      // Load initial location or first chapter
      rendition.display(location || undefined);

      // Fetch and store the Table of Contents (TOC)
      book.loaded.navigation.then((nav) => setToc(nav.toc));

      // Handle location changes
      rendition.on("relocated", (location: any) => {
        setLocation(location.start.cfi);
        window.location.reload();
      });
    }

    return () => {
      // Cleanup on unmount
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
    };
  }, [epubUrl]);

  const goToNextPage = () => {
    renditionRef.current?.next();
  };

  const goToPrevPage = () => {
    renditionRef.current?.prev();
  };

  const jumpToChapter = (href: string) => {
    renditionRef.current?.display(href);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onPageChange({ pageNumber }: { pageNumber: number }) {
    setPageNumber(pageNumber);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-grow bg-white p-4">
        {loading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="text-center text-white p-8 bg-gray-800 rounded-xl">
              <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-transparent border-solid rounded-full mb-4"></div>
              <p>
                Loading, please wait... (max. 5 mins based on the file size)
              </p>
            </div>
          </div>
        )}

        {epubUrl ? (
          <div className="relative w-full max-w-4xl mx-auto flex flex-col">
            <div
              ref={viewerRef}
              className="border rounded-lg overflow-hidden shadow-md bg-gray-50 h-[70vh] mb-6"
            ></div>
            <div className="flex justify-between mb-6">
              <button
                onClick={goToPrevPage}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Next
              </button>
            </div>
            {toc.length > 0 && (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Table of Contents
                </h3>
                <ul className="space-y-2">
                  {toc.map((chapter, index) => (
                    <li key={index}>
                      <button
                        onClick={() => jumpToChapter(chapter.href)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        {chapter.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : pdfUrl ? (
          <div className="relative w-full h-full overflow-hidden max-w-screen-lg mx-auto flex flex-col justify-center items-center">
            <Document
              file={pdfUrl}
              className={"border-2 border-black rounded-md"}
              onLoadSuccess={onLoadSuccess}
              onLoadError={console.error}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <div className="flex justify-center items-center space-x-4 mt-4">
              <button
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                disabled={pageNumber === 1}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, numPages))
                }
                disabled={pageNumber === numPages}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600">
            Loading flipbook...
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FlipbookPage;
