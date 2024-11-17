"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useRouter, useParams } from "next/navigation";

const BookInfoPage = () => {
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loadingGoogleBook, setLoadingGoogleBook] = useState<boolean>(true);
  const [loadingCustomAPI, setLoadingCustomAPI] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const { id } = useParams(); // 'id' is the ISBN

  const API_KEY = "AIzaSyC2NLvmuX8JVubjHRBD30JF0pcjtEe7T34";

  useEffect(() => {
    if (!id) return;

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
            imageUrl: book.imageLinks?.thumbnail || "",
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
          setBookDetails(null);
        }
      } catch (error) {
        console.error("Error fetching book details from Google API:", error);
        setBookDetails(null);
      } finally {
        setLoadingGoogleBook(false);
      }
    };

    const fetchBookFromAPI = async (isbn: string, bookName: string) => {
      setLoadingCustomAPI(true);
      try {
        let response = await fetch(
          `http://127.0.0.1:8080/book_details?isbn=${isbn}`
        );
        let data = await response.json();

        if (data.status === "success") {
          handleBookDownload(data.data.book_id, bookName);
          return;
        }

        // If not found by ISBN, try by book name
        response = await fetch(
          `http://127.0.0.1:8080/book_details?book_name=${encodeURIComponent(
            bookName
          )}`
        );
        data = await response.json();

        if (data.status === "success") {
          handleBookDownload(data.data.book_id, bookName);
        } else {
          setMessage(
            "I'm sorry, can't fetch it right now. I'll notify Armaan."
          );
        }
      } catch (error) {
        console.error("Error searching for the book in custom API:", error);
        setMessage("I'm sorry, can't fetch it right now. I'll notify Armaan.");
      } finally {
        setLoadingCustomAPI(false);
      }
    };

    const handleBookDownload = async (bookId: string, bookName: string) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/download?book_id=${bookId}&book_name=${encodeURIComponent(
            bookName
          )}`
        );

        if (response.ok) {
          setMessage("The PDF has been downloaded successfully!");
        } else {
          throw new Error("Failed to download the PDF.");
        }
      } catch (error) {
        console.error("Error downloading the book PDF:", error);
        setMessage("Failed to download the book PDF.");
      }
    };

    fetchGoogleBookDetails(id as string).then(() => {
      if (bookDetails?.title) {
        fetchBookFromAPI(id as string, bookDetails.title);
      }
    });
  }, [id]);

  if (loadingGoogleBook) {
    return <div>Loading book details...</div>;
  }

  if (!bookDetails) {
    window.location.reload();
    return <div>Book not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow px-4 py-8 sm:px-16">
        <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between gap-8">
          <div className="w-full sm:w-1/3 flex justify-center">
            <img
              src={bookDetails.imageUrl}
              alt="Book Cover"
              className="w-full h-[35rem] rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full sm:w-2/3 h-[35rem] bg-[#ffe4c9] p-6 rounded-lg shadow-lg border border-gray-200 space-y-4">
            <h2 className="text-4xl font-semibold text-gray-900">
              {bookDetails.title}
            </h2>
            <h3 className="text-xl text-gray-600">
              Author:{" "}
              <span className="font-semibold">{bookDetails.author}</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 text-gray-600">
              <h4 className="text-lg">
                ISBN: <span className="font-semibold">{bookDetails.isbn}</span>
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
            <div className="mt-4 flex justify-center">
              {loadingCustomAPI ? (
                <div className="loader">Loading buttons...</div>
              ) : (
                <p>{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookInfoPage;
