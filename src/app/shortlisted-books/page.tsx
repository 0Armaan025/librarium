"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import LeftSideBar from "@/components/left-side-bar/LeftSideBar";
import { db, auth } from "@/firebase/firebaseConfig"; // Ensure you've imported Firebase config
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

type Props = {};

const ShortListedBooksPage = (props: Props) => {
  const [readBooks, setReadBooks] = useState<any[]>([]); // State to hold the books
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<any>(null); // State to hold the authenticated user

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user state if user is logged in
        console.log(currentUser);
      } else {
        setUser(null); // Clear user state if logged out
      }
    });

    // Cleanup on unmount
    return () => unsubscribeAuth();
  }, []);

  const fetchUserBooks = async () => {
    if (!user) {
      setMessage("User not authenticated.");
      setLoading(false);
      return;
    }

    const userEmail = user.email!;
    const userRef = doc(db, "users", userEmail);

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(
      userRef,
      async (userDoc) => {
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const readBooksArray = userData?.read_later || [];
          const booksWithDetails = await fetchBookDetailsFromGoogle(
            readBooksArray
          );
          setReadBooks(booksWithDetails);
        } else {
          setMessage("No user data found.");
        }
        setLoading(false); // Stop loading when data is fetched
      },
      (error) => {
        console.error("Error fetching user data:", error);
        setMessage("Failed to fetch user data.");
        setLoading(false);
      }
    );

    // Unsubscribe from Firestore when the component unmounts
    return () => unsubscribe();
  };

  const fetchBookDetailsFromGoogle = async (isbnList: string[]) => {
    const booksDetails = [];
    for (const isbn of isbnList) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${API_KEY}`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const book = data.items[0].volumeInfo;
          booksDetails.push({
            id: isbn,
            coverImage: book.imageLinks?.thumbnail || "fallback_image_url",
            name: book.title || "Unknown Title",
            author: book.authors?.join(", ") || "Unknown Author",
          });
        }
      } catch (error) {
        console.error("Error fetching book details from Google API:", error);
      }
    }
    return booksDetails;
  };

  useEffect(() => {
    if (user) {
      fetchUserBooks(); // Fetch books only when user is authenticated
    }
  }, [user]); // Re-fetch books when user changes

  if (loading) {
    return <div className="text-white text-xl">Loading your books...</div>;
  }

  return (
    <>
      <div className="dashboardPage flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <div className="flex flex-row justify-start items-start">
            <div className="flex flex-col justify-start items-start w-auto">
              <LeftSideBar />
            </div>
            <div className="flex rounded-tl-md rounded-bl-md h-[83vh] bg-[#ffe4c9] w-full flex-col justify-start items-start">
              <div className="ml-4 mt-8">
                <h4
                  className="text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Books You've Read
                </h4>
                {message && <div className="text-red-500">{message}</div>}
                <div className="flex flex-wrap gap-4 mt-4">
                  {readBooks.length > 0 ? (
                    readBooks.map((book) => (
                      <Link href={`/book/${book.id}`} key={book.id}>
                        <div className="w-48 h-80 bg-[#343434] hover:bg-[#1e1e1e] transition-all cursor-pointer hover:scale-105 shadow-md rounded-md flex flex-col items-start p-4">
                          <img
                            src={book.coverImage}
                            alt={book.name}
                            className="w-full h-48 object-cover rounded-md mb-4"
                          />
                          <h5
                            className="text-lg font-medium text-white text-start"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {book.name}
                          </h5>
                          <p
                            className="text-sm text-gray-200 text-center"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {book.author}
                          </p>
                        </div>
                      </Link>
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

export default ShortListedBooksPage;
