"use client";
import React, { useState, useEffect } from "react";
import { getCookie } from "cookies-next"; // Import cookies-next to manage cookies
import FlipBook from "./fbook";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

const FlipbookPage: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [pdfFile, setPdfFile] = useState<File | null>(null); // Store the PDF file

  useEffect(() => {
    const fetchFileFromCookie = async () => {
      const fileExtension = getCookie("file_extension")?.toString(); // Get the file extension from cookie
      const encodedDownloadUrl = getCookie("download_url")?.toString(); // Get the download URL from cookie

      // Decode the URL
      const downloadUrl = encodedDownloadUrl
        ? decodeURIComponent(encodedDownloadUrl)
        : "";

      if (fileExtension && downloadUrl) {
        setLoading(true); // Show loader

        try {
          if (fileExtension === ".pdf") {
            // If the file is a PDF, directly fetch it
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const file = new File([blob], "file.pdf", {
              type: "application/pdf",
            });
            setPdfFile(file);
            processFile(file);
          } else if (fileExtension === ".epub") {
            // If the file is an EPUB, download it, convert it, and then process
            const response = await fetch(downloadUrl);
            const epubBlob = await response.blob();
            // Assuming you have a server endpoint to convert the EPUB to PDF
            const formData = new FormData();
            formData.append("file", epubBlob);

            // Send the EPUB to be converted to PDF
            const convertResponse = await fetch(
              "http://127.0.0.1:5000/convert_epub/",
              {
                method: "POST",
                body: formData,
              }
            );

            if (convertResponse.ok) {
              const data = await convertResponse.json();
              const fullImageUrls = data.images.map(
                (img: string) => `http://127.0.0.1:5000${img}`
              );
              setImageUrls(fullImageUrls); // Update image URLs for the flipbook
            } else {
              console.error("Failed to convert EPUB to PDF.");
            }
          }
        } catch (error) {
          console.error("Error fetching or processing file:", error);
        } finally {
          setLoading(false); // Hide loader after processing is complete
        }
      }
    };

    fetchFileFromCookie(); // Call the function when component mounts
  }, []);

  // Function to process the PDF file and convert it into images
  const processFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true); // Show loader when upload starts

    try {
      const response = await fetch("http://127.0.0.1:5000/convert_pdf/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const fullImageUrls = data.images.map(
          (img: string) => `http://127.0.0.1:5000${img}`
        );
        setImageUrls(fullImageUrls); // Update image URLs for the flipbook
      } else {
        console.error("Failed to convert PDF");
      }
    } catch (error) {
      console.error("Error uploading the PDF:", error);
    } finally {
      setLoading(false); // Hide loader when upload is complete
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flipbook-page-container flex-grow">
          <h1>Custom FlipBook</h1>

          {/* Loader Modal */}
          {loading && (
            <div className="loader-modal">
              <div className="loader-content">
                <div className="spinner"></div>
                <p>
                  Loading, please wait... (max. 5 mins based on the file size)
                </p>
              </div>
            </div>
          )}

          {/* Conditionally render the FlipBook once image URLs are available */}
          {imageUrls.length > 0 ? (
            <FlipBook pages={imageUrls} />
          ) : (
            <p>Loading flipbook...</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FlipbookPage;
