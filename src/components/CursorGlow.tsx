"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for raw cursor position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 1. Inner Core: Extremely snappy and responsive, closely following the cursor
  const coreSpringConfig = { damping: 45, stiffness: 850, mass: 0.08 };
  const coreX = useSpring(mouseX, coreSpringConfig);
  const coreY = useSpring(mouseY, coreSpringConfig);

  // 2. Middle Glow: Fluid, medium-speed trailing that gives thickness to the movement
  const midSpringConfig = { damping: 30, stiffness: 350, mass: 0.18 };
  const midX = useSpring(mouseX, midSpringConfig);
  const midY = useSpring(mouseY, midSpringConfig);

  // 3. Outer Ambient Halo: Floating, slower trailing that creates a wide, magical aura
  const ambientSpringConfig = { damping: 24, stiffness: 140, mass: 0.35 };
  const ambientX = useSpring(mouseX, ambientSpringConfig);
  const ambientY = useSpring(mouseY, ambientSpringConfig);

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
      {/* 3. Outer soft ambient glow halo (slowest trail, widest spread) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: ambientX,
          y: ambientY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255, 106, 0, 0.08) 0%, rgba(255, 130, 0, 0.03) 50%, rgba(255, 106, 0, 0) 100%)",
        }}
        animate={{
          width: isHovered ? 600 : 400,
          height: isHovered ? 600 : 400,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 24,
        }}
      />

      {/* 2. Middle warm fluid glow (medium trail, soft spread) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: midX,
          y: midY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255, 106, 0, 0.16) 0%, rgba(255, 130, 0, 0.06) 40%, rgba(255, 106, 0, 0) 80%)",
        }}
        animate={{
          width: isHovered ? 300 : 200,
          height: isHovered ? 300 : 200,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 24,
        }}
      />

      {/* 1. Inner focused bright core (snappiest trail, highest opacity with luminous white center) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: coreX,
          y: coreY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, rgba(255, 106, 0, 0.45) 30%, rgba(255, 106, 0, 0.1) 65%, transparent 100%)",
        }}
        animate={{
          width: isHovered ? 100 : 50,
          height: isHovered ? 100 : 50,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 24,
        }}
      />
    </div>
  );
}
