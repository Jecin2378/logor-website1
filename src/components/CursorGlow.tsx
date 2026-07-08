"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for raw cursor position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for a luxurious trailing glow effect
  const springConfig = { damping: 30, stiffness: 200, mass: 0.6 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect mouse move
    const handleMouseMove = (e: MouseEvent) => {
      // First move makes it visible (safeguards for hydration & touch devices)
      if (!isVisible) setIsVisible(true);
      
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Detect mouse leaving the window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Detect mouse entering the window
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect hovering over interactive elements using event delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if target or any of its parent is interactive
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.closest('[role="button"]') !== null ||
        target.closest(".cursor-pointer") !== null ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";

      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render on server-side or until the mouse moves
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden mix-blend-screen">
      {/* Outer soft ambient glow halo */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255, 106, 0, 0.08) 0%, rgba(255, 140, 50, 0.02) 50%, transparent 70%)",
        }}
        animate={{
          width: isHovered ? 500 : 350,
          height: isHovered ? 500 : 350,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 25,
        }}
      />

      {/* Inner focused bright glow core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255, 106, 0, 0.16) 0%, rgba(255, 106, 0, 0.04) 50%, transparent 70%)",
        }}
        animate={{
          width: isHovered ? 140 : 80,
          height: isHovered ? 140 : 80,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 25,
        }}
      />
    </div>
  );
}
