"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import LeftSideBar from "@/components/left-side-bar/LeftSideBar";
import { db, auth } from "@/firebase/firebaseConfig"; // Assuming you're using Firebase
import { doc, onSnapshot } from "firebase/firestore"; // Firebase Firestore methods
import { onAuthStateChanged } from "firebase/auth";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Add your Google Books API Key

type Props = {};

const ReadBooks = (props: Props) => {
  const [readBooks, setReadBooks] = useState<any[]>([]); // State for books
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [user, setUser] = useState<any>(null); // Authenticated user

  // Function to fetch book data from Google Books API based on ISBN
  const fetchBookData = async (isbn: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`
      );
      const data = await response.json();
      return data.items ? data.items[0].volumeInfo : null;
    } catch (error) {
      console.error("Error fetching book data from Google Books API:", error);
      return null;
    }
  };

  // Fetch the read_books data from Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User authenticated:", currentUser); // Log the authenticated user
      } else {
        setUser(null);
        console.log("User not authenticated.");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchReadBooks = async () => {
        const userRef = doc(db, "users", user.email!);

        const unsubscribe = onSnapshot(userRef, async (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const readBooksArray = userData?.read_books || []; // Assuming `read_books` is an array in the Firestore document

            // Fetch data for each book using Google Books API
            const booksWithDetails = await Promise.all(
              readBooksArray.map(async (book: any) => {
                const bookData = await fetchBookData(book.isbn);
                return {
                  ...book,
                  ...bookData, // Merge the data from Google Books API
                };
              })
            );

            console.log("Fetched books:", booksWithDetails); // Log the fetched books
            setReadBooks(booksWithDetails); // Set the read_books data with Google Books details
            setLoading(false); // Set loading to false once data is fetched
          } else {
            console.log("No user data found.");
            setLoading(false);
          }
        });

        return () => unsubscribe();
      };

      fetchReadBooks();
    }
  }, [user]);

  if (loading) {
    return <div className="text-white text-xl">Loading your books...</div>;
  }

  return (
    <>
      <div className="dashboardPage flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="flex flex-row justify-start items-start">
            <div className="flex flex-col justify-start items-start">
              <LeftSideBar />
            </div>
            <div className="flex rounded-tl-md rounded-bl-md h-[83vh] bg-[#ffe4c9] w-full flex-col justify-start items-start">
              {/* Section for read books */}
              <div className="ml-4 mt-8">
                <h4
                  className="text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Books You've Read
                </h4>
                <div className="flex flex-wrap gap-4 mt-4">
                  {readBooks.length > 0 ? (
                    readBooks.map((book: any, index: number) => (
                      <div
                        key={book.id || index} // Use book.id if available, otherwise fallback to index
                        className="w-48 h-72 bg-[#343434] hover:bg-[#1e1e1e] transition-all cursor-pointer hover:scale-105 shadow-md rounded-md flex flex-col items-start p-4"
                      >
                        <img
                          src={
                            book.imageLinks?.thumbnail || "default_image_url"
                          } // Use Google Books cover image or fallback
                          alt={book.title || "Unknown Title"} // Fallback title if missing
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h5
                          className="text-lg font-medium text-white text-center"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {book.title || "Unknown Title"}{" "}
                          {/* Fallback to a default text if title is missing */}
                        </h5>
                        <p
                          className="text-sm text-gray-200 text-center"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {book.authors?.join(", ") || "Unknown Author"}{" "}
                          {/* Fallback to default authors if missing */}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xl text-gray-700">No books found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ReadBooks;
