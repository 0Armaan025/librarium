"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { db, auth } from "@/firebase/firebaseConfig";
import "firebase/firestore";
import "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const BookInfoPage = () => {
  const [bookDetails, setBookDetails] = useState<any>(null);
  const [loadingGoogleBook, setLoadingGoogleBook] = useState<boolean>(true);
  const [loadingCustomAPI, setLoadingCustomAPI] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bookOptions, setBookOptions] = useState<any[]>([]);

  const { id } = useParams();
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const [loadingModal, setLoadingModal] = useState<boolean>(false);

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
          imageUrl: book.imageLinks?.thumbnail || "fallback_image_url",
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
      console.log(data);

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

  const updateReadBooks = async (isbn: string, action: "read" | "later") => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated");
      return;
    }

    const userEmail = user.email!;
    const userRef = doc(db, "users", userEmail);

    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.log("User document not found");
        return;
      }

      const userData = userDoc.data();
      const readBooks = userData?.read_books || [];
      const readLaterBooks = userData?.read_later || [];

      // Avoid adding the same book twice
      if (action === "read") {
        if (!readBooks.includes(isbn) && !readLaterBooks.includes(isbn)) {
          await updateDoc(userRef, {
            read_books: [...readBooks, isbn], // Adds the ISBN to the read_books array
          });
          console.log(`Book added to read_books as ${action}`);
        }
      } else if (action === "later") {
        if (!readLaterBooks.includes(isbn) && !readBooks.includes(isbn)) {
          await updateDoc(userRef, {
            read_later: [...readLaterBooks, isbn], // Adds the ISBN to the read_later array
          });
          console.log(`Book added to read_later as ${action}`);
        }
      }
    } catch (error) {
      console.error("Error updating books:", error);
    }
  };

  const handleReadBookClick = () => {
    if (bookDetails?.title) {
      updateReadBooks(bookDetails.isbn, "read");
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
        body: JSON.stringify({ mirror_url: mirror_links[0] }),
      });

      const data = await response.json();
      console.log(data);

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

  const handleReadLaterClick = () => {
    if (bookDetails?.isbn) {
      updateReadBooks(bookDetails.isbn, "later");
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
              <h2 className="text-4xl font-semibold text-gray-900">
                {bookDetails.title}
              </h2>
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
              <p
                className="text-md text-lg text-gray-800 mt-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {bookDetails.description.split(" ").slice(0, 50).join(" ")}
                {bookDetails.description.split(" ").length > 50 && "..."}
              </p>
              <div className="flex gap-4 mt-8">
                <button
                  className="bg-orange-400 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-500"
                  onClick={handleReadBookClick}
                >
                  Read Book
                </button>
                <button
                  className="bg-gray-200 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300"
                  onClick={handleReadLaterClick}
                >
                  Read Later
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xl font-medium text-gray-700">{message}</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookInfoPage;
