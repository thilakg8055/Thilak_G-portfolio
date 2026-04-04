import { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import "./index.css";

function CustomCursor() {
  const cursor = useRef();
  const follower = useRef();

  useEffect(() => {
    const move = (e) => {
      if (cursor.current) {
        cursor.current.style.left = e.clientX - 6 + "px";
        cursor.current.style.top = e.clientY - 6 + "px";
      }
      setTimeout(() => {
        if (follower.current) {
          follower.current.style.left = e.clientX - 18 + "px";
          follower.current.style.top = e.clientY - 18 + "px";
        }
      }, 80);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div ref={cursor} className="cursor" />
      <div ref={follower} className="cursor-follower" />
    </>
  );
}

export default function App() {
  return (
    <div className="grain">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Work />
      <Experience />
      <Skills />
      <Contact />
    </div>
  );
}
