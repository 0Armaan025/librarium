"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import BookCard from "./card/BookCard";

const BooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("fiction");
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; // Use environment variable for API Key

  const fetchBooks = async (
    query: string,
    selectedGenre: string,
    index: number
  ) => {
    setIsLoading(true); // Indicate loading
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query + " " + selectedGenre
        )}&maxResults=40&startIndex=${index}&key=${API_KEY}`
      );
      const data = await response.json();

      if (!data.items) {
        setIsLoading(false);
        return;
      }

      const formattedBooks = data.items
        ?.map((item: any) => {
          const isbn = item.volumeInfo.industryIdentifiers?.find(
            (id: any) => id.type === "ISBN_13"
          )?.identifier;

          if (!isbn) return null;

          return {
            imageUrl:
              item.volumeInfo.imageLinks?.thumbnail.replace(
                "http://",
                "https://"
              ) ||
              "https://imgs.search.brave.com/OC6avjR_4xFvRmk_78v6CvsGCq7Z1dTCyPMjSKTGefo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnNz/dGF0aWMubmV0L3k5/RHBULmpwZw",
            title: item.volumeInfo.title || "N/A",
            author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
            isbn,
            genre: item.volumeInfo.categories?.join(", ") || "Unknown Genre",
            published: item.volumeInfo.publishedDate || "N/A",
            publisher: item.volumeInfo.publisher || "Unknown Publisher",
            language: item.volumeInfo.language || "N/A",
            description:
              item.volumeInfo.description || "No description available",
          };
        })
        .filter((book: any) => book !== null);

      setBooks((prevBooks) => [...prevBooks, ...(formattedBooks || [])] as any);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setBooks([]); // Clear books for new search
    setStartIndex(0); // Reset pagination
    fetchBooks(searchTerm || "books", genre, 0);
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value);
    setBooks([]); // Reset books on genre change
    setStartIndex(0); // Reset pagination
    fetchBooks(searchTerm || "books", event.target.value, 0);
  };

  useEffect(() => {
    // Fetch initial books
    fetchBooks("books", genre, 0);
  }, []);

  useEffect(() => {
    // Infinite scroll functionality
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setStartIndex((prevIndex) => {
            const newIndex = prevIndex + 40;
            fetchBooks(searchTerm || "books", genre, newIndex);
            return newIndex;
          });
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [searchTerm, genre, isLoading]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <div className="booksPage px-4 sm:px-8 lg:px-16">
          <h2
            className="ml-4 mt-6 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "Patrick Hand, cursive" }}
          >
            Time to learn new things... :)
          </h2>
          <div className="flex items-center justify-center mt-8 flex-wrap">
            <input
              type="text"
              className="px-4 py-2 text-md placeholder-gray-900 bg-[#e4c8ab] text-black w-full sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
              placeholder="Search for a book..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          {isLoading && (
            <p className="text-white text-center">Loading more books...</p>
          )}
          <div ref={observerRef} className="h-10"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BooksPage;
