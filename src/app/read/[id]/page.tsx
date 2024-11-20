"use client";
import React, { useState, useEffect, useRef } from "react";
import { getCookie } from "cookies-next";
import Footer from "@/components/footer/Footer";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import Navbar from "@/components/navbar/Navbar";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ReactReader,
  ReactReaderStyle,
  type IReactReaderStyle,
} from "react-reader";
import type { NavItem } from "epubjs";
import type { Rendition } from "epubjs";

const FlipbookPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [location, setLocation] = useState<string | number>(0);
  const rendition = useRef<Rendition | undefined>(undefined);
  const toc = useRef<NavItem[]>([]);
  const [page, setPage] = useState("");

  const workerSrc =
    "https://unpkg.com/pdfjs-dist@4.4.168/legacy/build/pdf.worker.min.mjs";

  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const updateTheme = (rendition: Rendition, theme: "light" | "dark") => {
    const themes = rendition.themes;
    switch (theme) {
      case "dark": {
        themes.override("color", "#fff");
        themes.override("background", "#000");
        break;
      }
      case "light": {
        themes.override("color", "#000");
        themes.override("background", "#fff");
        break;
      }
    }
  };

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
          <div className="relative w-full h-full max-w-screen-lg mx-auto">
            <ReactReader
              url={epubUrl}
              readerStyles={
                theme === "dark" ? darkReaderTheme : lightReaderTheme
              }
              getRendition={(_rendition: Rendition) => {
                rendition.current = _rendition;
                updateTheme(rendition.current, theme);
              }}
              location={location}
              tocChanged={(_toc) => (toc.current = _toc)}
              locationChanged={(loc: string) => {
                setLocation(loc);
                if (rendition.current && toc.current) {
                  const { displayed, href } = rendition.current.location.start;
                  const chapter = toc.current.find(
                    (item) => item.href === href
                  );
                  setPage(
                    `Page ${displayed.page} of ${displayed.total} in chapter ${
                      chapter ? chapter.label : "n/a"
                    }`
                  );
                }
              }}
            />
            <center>
              <h3 className="text-white text-lg mt-4 mb-8">{page}</h3>
            </center>
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

const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "black",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "black",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "black",
  },
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "black",
  },
};

const darkReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "white",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#ccc",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#000",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#ccc",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#111",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#222",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#fff",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "white",
  },
};
