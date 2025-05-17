import { useState, useEffect } from "react";
import PreLoader from "@/components/global/preloader";
import { AnimatePresence } from "framer-motion";
import Blog from "./blog";
import Project from "./projects";
import Skills from "./skills";
import Hero from "./hero";

const Home = () => {
  const [progress, setProgress] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      const increment = start < 70 ? 5 : 1;
      start += increment;
      if (start >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => setShowAnimation(false), 700);
        }, 500);
      } else {
        setProgress(start);
      }
    }, 30);
  }, []);
  return (
    <main className="flex-grow">
      <AnimatePresence mode="wait">
        {showAnimation && (
          <PreLoader progress={progress} fadeOut={fadeOut} />
        )}
      </AnimatePresence>
      <Hero />
      <Skills />
      <Project />
      <Blog />
    </main>
  );
};

export default Home;
