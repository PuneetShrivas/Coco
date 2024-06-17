"use client"; // This directive makes it a client component

import { useState, useEffect } from "react";

export default function MobileFrameOverlay() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
        setIsLargeScreen(window.innerWidth >= 768); // Set your breakpoint (768px for example)
      };
  
      checkScreenSize(); // Initial check
      console.log("large screen:", isLargeScreen)
      console.log("screen size:", window.innerWidth)
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <img
      src="/your_mobile_frame.svg"
      alt="Mobile Frame"
      style={{
        width: "100%", // Make the image cover the entire viewport
        height: "100%",
        position: "absolute", // Position the image on top
        top: 0,
        left: 0,
        pointerEvents: "none", // Allow interaction with the content underneath
        zIndex: 1, // Ensure the image is above the content
      }}
    />
  );
}