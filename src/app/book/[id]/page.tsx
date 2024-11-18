"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useParams } from "next/navigation";
import { setCookie } from "cookies-next"; // Import the setCookie utility

const BookInfoPage = () => {
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loadingGoogleBook, setLoadingGoogleBook] = useState<boolean>(true);
  const [loadingCustomAPI, setLoadingCustomAPI] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bookOptions, setBookOptions] = useState<any[]>([]);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const { id } = useParams(); // 'id' is the ISBN
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const fetchGoogleBookDetails = async (isbn: string) => {
    setLoadingGoogleBook(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        setBookDetails({
          imageUrl: book.imageLinks?.thumbnail || "fallback_image_url", // Fallback image if missing
          title: book.title || "N/A",
          author: book.authors?.join(", ") || "Unknown Author",
          isbn: isbn,
          genre: book.categories?.join(", ") || "Unknown Genre",
          published: book.publishedDate || "N/A",
          publisher: book.publisher || "Unknown Publisher",
          language: book.language || "N/A",
          description: book.description || "No description available",
        });
      } else {
        setMessage("Book not found in Google Books API.");
      }
    } catch (error) {
      console.error("Error fetching book details from Google API:", error);
      setMessage("Error fetching details from Google Books.");
    } finally {
      setLoadingGoogleBook(false);
    }
  };

  const fetchBookOptions = async (bookName: string) => {
    setLoadingModal(true);
    setLoadingCustomAPI(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/search?book_name=${encodeURIComponent(bookName)}`
      );
      const data = await response.json();
      console.log(data); // Inspect the data to ensure it's correct

      if (data.data && data.data.length > 0) {
        setBookOptions(data.data);
        setModalVisible(true);
      } else {
        setMessage("No books found in the custom API.");
      }
    } catch (error) {
      console.error("Error searching for the book in custom API:", error);
      setMessage("Sorry, can't fetch it right now.");
    } finally {
      setLoadingCustomAPI(false);
      setLoadingModal(false);
    }
  };

  const handleReadBookClick = () => {
    if (bookDetails?.title) {
      fetchBookOptions(bookDetails.title);
    }
  };

  const handleBookOptionClick = async (book: any) => {
    const { mirror_links } = book;
    alert("mirror url is " + mirror_links[0]);

    if (!mirror_links[0]) {
      setMessage("No mirror URL provided.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8080/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mirror_url: mirror_links[0] }), // Fix: Include the mirror link in the request body
      });

      const data = await response.json();
      console.log(data); // Log response data to inspect the returned download_url and file_extension

      if (data.download_url && data.file_extension) {
        setCookie("download_url", data.download_url, { maxAge: 60 * 60 });
        setCookie("file_extension", data.file_extension, { maxAge: 60 * 60 });
        setModalVisible(false);
        setMessage("Book details saved!");
      } else {
        setMessage("Failed to retrieve download information.");
      }
    } catch (error) {
      console.error("Error during book download request:", error);
      setMessage("Error while processing the download.");
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchGoogleBookDetails(id as any);
  }, [id]);

  if (loadingGoogleBook) {
    return <div className="text-white text-xl">Loading book details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow px-4 py-8 sm:px-16">
        {bookDetails ? (
          <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between gap-8">
            <div className="w-full sm:w-1/3 flex justify-center">
              <img
                src={bookDetails.imageUrl}
                alt="Book Cover"
                className="w-full h-[36rem] rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full sm:w-2/3 h-[36rem] bg-[#ffe4c9] p-6 rounded-lg shadow-lg border border-gray-200 space-y-4">
              <h2
                className="text-4xl font-semibold text-gray-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {bookDetails.title}
              </h2>
              <h3 className="text-xl text-gray-600">
                Author:{" "}
                <span className="font-semibold">{bookDetails.author}</span>
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 text-gray-600">
                <h4 className="text-lg">
                  ISBN:{" "}
                  <span className="font-semibold">{bookDetails.isbn}</span>
                </h4>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 text-gray-600">
                <h5 className="text-lg">
                  Genre:{" "}
                  <span className="font-semibold">{bookDetails.genre}</span>
                </h5>
                <h5 className="text-lg">
                  Published:{" "}
                  <span className="font-semibold">{bookDetails.published}</span>
                </h5>
              </div>
              <h5 className="text-lg text-gray-600">
                Publisher:{" "}
                <span className="font-semibold">{bookDetails.publisher}</span>
              </h5>
              <h5 className="text-lg text-gray-600">
                Language:{" "}
                <span className="font-semibold">{bookDetails.language}</span>
              </h5>
              <p className="text-md text-gray-700 mt-4">
                {bookDetails.description.split(" ").slice(0, 65).join(" ")}
                {bookDetails.description.split(" ").length > 65 && "..."}
              </p>
              <div className="flex gap-4 mt-6">
                <button
                  className={`px-4 py-2 text-white rounded ${
                    loadingModal
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                  onClick={handleReadBookClick}
                  disabled={loadingModal}
                >
                  {loadingModal ? "Loading..." : "Read Book"}
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                  Read Later
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white text-xl">
            Book not found, please try again later.
          </div>
        )}
      </div>
      <Footer />
      {modalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-600 w-full max-w-2xl h-3/4 p-6 rounded-lg shadow-lg space-y-4 overflow-y-auto">
            <h2
              className="text-2xl text-white font-bold"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Select a Book to Download
            </h2>
            {loadingCustomAPI ? (
              <div className="text-white text-xl">Loading options...</div>
            ) : (
              <div className="space-y-4">
                {bookOptions.map((book, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 p-4 rounded-lg cursor-pointer hover:bg-gray-300"
                    onClick={() => handleBookOptionClick(book)}
                  >
                    <h3 className="text-lg text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                ))}
              </div>
            )}
            {message && <div className="text-white mt-4">{message}</div>}
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={() => setModalVisible(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookInfoPage;
