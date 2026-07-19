"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Motion values for raw cursor position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    // Detect if touch/coarse pointer device
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (coarsePointer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTouch(true);
      return;
    }

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

  // Don't render on server-side, touch devices, or until the mouse moves
  if (isTouch || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden mix-blend-screen">
      {/* Single, soft, ambient glow (locked to cursor with zero lag, optimized gradient replaces filter blur) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255, 106, 0, 0.15) 0%, rgba(213, 198, 37, 0.04) 35%, rgba(213, 198, 37, 0.005) 60%, transparent 80%)",
          willChange: "transform",
        }}
        animate={{
          width: isHovered ? 550 : 350,
          height: isHovered ? 550 : 350,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      />
    </div>
  );
}
