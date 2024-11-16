"use client";
import React, { useState, useEffect, useRef } from "react";
import "./bookspage.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import BookCard from "./card/BookCard";

type Props = {};

const BooksPage = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("fiction");
  const [startIndex, setStartIndex] = useState(0); // Track the current index for pagination
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchBooks = async (
    query: string,
    selectedGenre: string,
    index: number
  ) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query + " " + selectedGenre
        )}&maxResults=40&startIndex=${index}`
      );
      const data = await response.json();

      // Format books and filter out invalid ones
      const formattedBooks = data.items
        ?.map((item: any) => {
          const isbn = item.volumeInfo.industryIdentifiers?.find(
            (id: any) => id.type === "ISBN_13"
          )?.identifier;

          // Only include books that have a valid ISBN
          if (!isbn) {
            return null; // If no ISBN, return null and it will be filtered out
          }

          return {
            imageUrl:
              item.volumeInfo.imageLinks?.thumbnail.replace(
                "http://",
                "https://"
              ) ||
              "https://imgs.search.brave.com/OC6avjR_4xFvRmk_78v6CvsGCq7Z1dTCyPMjSKTGefo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnNz/dGF0aWMubmV0L3k5/RHBULmpwZw", // Ensure HTTPS for better quality
            title: item.volumeInfo.title || "N/A",
            author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
            isbn: isbn, // Only store books with ISBN
            genre: item.volumeInfo.categories?.join(", ") || "Unknown Genre",
            published: item.volumeInfo.publishedDate || "N/A",
            publisher: item.volumeInfo.publisher || "Unknown Publisher",
            language: item.volumeInfo.language || "N/A",
            description:
              item.volumeInfo.description || "No description available",
          };
        })
        .filter((book: any) => book !== null); // Remove null entries

      setBooks((prevBooks) => [...prevBooks, ...(formattedBooks || [])] as any);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setBooks([]); // Clear existing books for a fresh search
    setStartIndex(0); // Reset pagination
    fetchBooks(searchTerm || "books", genre, 0);
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value);
    setBooks([]); // Reset books for new genre
    setStartIndex(0); // Reset pagination
    fetchBooks(searchTerm || "books", event.target.value, 0);
  };

  useEffect(() => {
    // Fetch initial books on page load
    fetchBooks("books", genre, startIndex);
  }, []);

  useEffect(() => {
    // Infinite scroll functionality
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartIndex((prevIndex) => prevIndex + 40); // Increment index for next batch
          fetchBooks(searchTerm || "books", genre, startIndex + 40);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [startIndex, genre, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="booksPage">
          <h2
            className="ml-4 mt-6 text-white text-5xl"
            style={{ fontFamily: "Patrick Hand, cursive" }}
          >
            Time to learn new things... :&#41;
          </h2>
          <div className="flex items-center justify-center mt-8">
            <input
              type="text"
              className="px-4 py-2 text-md placeholder-gray-900 bg-[#e4c8ab] text-black w-[70%] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
              placeholder="Search for a book..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <select
              className="px-4 py-2 bg-[#e4c8ab] text-black rounded-md ml-4 focus:outline-none"
              value={genre}
              onChange={handleGenreChange}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="fantasy">Fantasy</option>
              <option value="romance">Romance</option>
              <option value="thriller">Thriller</option>
              <option value="science">Science</option>
            </select>
            <button
              className="px-4 py-2 bg-[#333333] border-[1.2px] border-black text-white rounded-r-md hover:bg-[#555555] transition-all"
              onClick={handleSearch}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Search
            </button>
          </div>
          <div className="mt-6 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-4">
            {books.length > 0 ? (
              books.map((book: any, index) => (
                <BookCard
                  key={index}
                  imageUrl={book.imageUrl}
                  bookName={book.title}
                  authorName={book.author}
                  onClick={() => {
                    window.location.href = "/book/" + book.isbn;
                  }}
                />
              ))
            ) : (
              <p className="text-white text-center">
                No books found. Try searching!
              </p>
            )}
          </div>
          <div ref={observerRef} className="h-10"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BooksPage;
