"use client";
import LogoAnimation, { AnimatedNumber } from "./logo";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export const opacity = {
  initial: { opacity: 0 },
  enter: { opacity: 0.75, transition: { duration: 1, delay: 0.2 } },
};

export const slideUp = {
  initial: { top: 0 },
  exit: { top: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } },
};

export default function Index({ progress, fadeOut }: { progress: number; fadeOut: boolean }) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(false); // Tracks if the user has interacted

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (progress === 100 && canPlay) {
      audioRef.current?.play().catch((err) => console.error("Audio play failed:", err));
    }
  }, [progress, canPlay]);

  const handleUserInteraction = () => {
    setCanPlay(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => { }); // Try to play on first interaction
    }
  };

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: { d: initialPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
    exit: { d: targetPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 } },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="introduction backdrop-blur-2xl"
      onClick={handleUserInteraction} // Ensures user interaction
    >
      <audio ref={audioRef} src="/sub-bass-wobble-betacut.mp3" preload="auto" />

      {dimension.width > 0 && (
        <>
          <div className={cn("h-dvh inset-0 flex justify-center items-center transition-opacity duration-500 fixed z-50", fadeOut ? "opacity-0 blur-lg" : "opacity-100")}>
            <LogoAnimation className="h-[85px] font-normal flex">
              {`>_`} Vicky Tajpuriya
              <AnimatedNumber className="w-36 flex justify-end" springOptions={{ bounce: 0, duration: 1000 }} value={progress} />
              %
            </LogoAnimation>
          </div>
          <svg>
            <motion.path variants={curve} initial="initial" exit="exit"></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}