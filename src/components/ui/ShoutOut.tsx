"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ShoutOut() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 1 second of loading the app
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Hide after 6 seconds of being visible (total 7s)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="https://www.tiktok.com/@sijalijali99"
          target="_blank"
          rel="noreferrer"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-3 bg-[#121212]/90 backdrop-blur-md border border-[#262626] p-2 pr-4 rounded-full hover:bg-[#1a1a1a] hover:border-[#404040] transition-colors shadow-2xl z-50 group"
        >
          <img
            src="https://p16-common-sign.tiktokcdn.com/tos-maliva-avt-0068/b3187ccf6d301ebb0020bc3eecbfb727~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=14579&refresh_token=aae267a1&x-expires=1786388400&x-signature=iiTtKqVIZNvRgveAzFR9XmYiqzE%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=my"
            alt="sijalijali99 profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs text-neutral-500 font-medium leading-tight">
              Shout out to
            </span>
            <span className="text-xs md:text-sm font-semibold text-white leading-tight tracking-wide">
              @sijalijali99
            </span>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
