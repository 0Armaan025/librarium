"use client";
import React, { useState } from "react";
import FlipBook from "./fbook";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

const FlipbookPage: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Handle PDF upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);

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
          // Prepend the server URL to each image path
          const fullImageUrls = data.images.map(
            (img: string) => `http://127.0.0.1:5000${img}`
          );
          setImageUrls(fullImageUrls); // Update image URLs
        } else {
          console.error("Failed to convert PDF");
        }
      } catch (error) {
        console.error("Error uploading the PDF:", error);
      } finally {
        setLoading(false); // Hide loader when upload is complete
      }
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flipbook-page-container flex-grow">
          <h1>Custom FlipBook</h1>

          {/* File upload input */}
          <div className="upload-section">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="upload-input"
            />
          </div>

          {/* Loader Modal */}
          {loading && (
            <div className="loader-modal">
              <div className="loader-content">
                <div className="spinner"></div>
                <p>Loading, please wait...</p>
              </div>
            </div>
          )}

          {/* Conditionally render the FlipBook once image URLs are available */}
          {imageUrls.length > 0 ? (
            <FlipBook pages={imageUrls} />
          ) : (
            <p>Upload a PDF to convert it to a flipbook.</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FlipbookPage;
