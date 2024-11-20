import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import React from "react";

type Props = {};

const AboutPage = (props: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow px-4 sm:px-6 md:px-8 lg:px-12">
        <center>
          <h3
            className="text-3xl sm:text-4xl md:text-5xl mt-12 mb-12 text-white"
            style={{ fontFamily: "Pattaya, sans-serif" }}
          >
            About Page, yaey!
          </h3>
        </center>
        <h4
          style={{ fontFamily: "Sour Gummy, sans-serif" }}
          className="text-white text-3xl sm:text-4xl md:text-5xl ml-4"
        >
          Hi! , this is Armaan
        </h4>
        <ul
          style={{ fontFamily: "Sour Gummy, sans-serif" }}
          className="text-white text-base sm:text-lg md:text-xl list-disc ml-8 mt-2"
        >
          <li>I created this website as a wrapper of libgen.is books.</li>
          <li>
            Please don't complain if you don't find the book 🥹, as I don't have
            a big database.
          </li>

          <li>
            I'm just getting data from libgen.is, but soon I'll try to find a
            way to get data from anna-archive too, for a bigger database.
          </li>
          <li>
            I am aware that there are a lot of bugs/errors, and I'm working on
            fixing them, you can def. report in the feedback section! 😄
          </li>
          <li>
            After a few days, make sure to check
            "the-words-of-the-unknown.vercel.app" too, a website where
            "anonymous" can write a status/message they want to convey, perhaps
            "anon-speaks.vercel.app" is a better name? 🤔 do let me know in the
            feedback thingy.
          </li>
          <li>I def. didn't take any help from ChatGPT (that's a lie).</li>
          <li>
            If you think this is hard to make, you're wrong, this is a child's
            game, this is super easy to create and anyone can do it including
            you.
          </li>
          <li>
            <a
              className="underline text-blue-500 "
              target="new"
              href="https://github.com/0Armaan025/librarium"
            >
              Some cool code here (website)
            </a>
          </li>
          <li>
            <a
              className="underline text-blue-500 "
              target="new"
              href="https://github.com/0Armaan025/python-pdf-to-image"
            >
              Some cool code here (api, eh)
            </a>
          </li>

          <li>Till then, enjoy this! :D</li>
          <li>
            Do let me know if you have any feedback{" "}
            <Link href="/feedback" className="text-purple-500 underline">
              here
            </Link>
            .
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
