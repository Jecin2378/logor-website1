"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  size: number;
  color: string;
  top: number;
  left: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  isStar: boolean;
}

const StarSparkle = ({ size, color }: { size: number; color: string }) => (
  <svg
    width={size * 3}
    height={size * 3}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(0 0 4px " + color + ")" }}
  >
    <path
      d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z"
      fill={color}
    />
  </svg>
);

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      "#FF6A00", // Brand Orange
      "#D5C625", // Luminous Gold
      "#FFB200", // Warm Amber
      "#FFE99F", // Pale Gold Sparkle
      "#FFFFFF", // Pure Luminous Star
    ];

    const generated: Particle[] = Array.from({ length: 45 }).map((_, i) => {
      const isStar = Math.random() > 0.7; // 30% are 4-pointed stars
      const size = isStar ? Math.random() * 3 + 2.5 : Math.random() * 2.5 + 1; // 1px to 5.5px
      return {
        id: i,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 5 + 4, // Faster 4s to 9s drift for live motion
        delay: Math.random() * -15, // Negative delay to pre-seed on screen
        driftX: (Math.random() - 0.5) * 80, // Horizontal swing
        driftY: -(Math.random() * 120 + 80), // Increased upwards drift matching faster speed
        isStar,
      };
    });

    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep luxury base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040404] via-[#090909] to-[#0E0B08]" />

      {/* Large floating orbs with smooth, active animations */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,106,0,0.06) 0%, rgba(255,106,0,0.01) 60%, transparent 80%)",
          top: "5%",
          left: "-10%",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 15, // Increased speed
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(213,198,37,0.04) 0%, rgba(255,106,0,0.01) 50%, transparent 70%)",
          top: "45%",
          right: "-10%",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -60, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 18, // Increased speed
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,106,0,0.04) 0%, transparent 60%)",
          bottom: "5%",
          left: "25%",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 16, // Increased speed
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle gold accent orb */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(213,198,37,0.03) 0%, transparent 60%)",
          top: "25%",
          left: "60%",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -40, 0],
          opacity: [0.6, 1, 0.5, 0.6],
        }}
        transition={{
          duration: 12, // Increased speed
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Live Luxury Glitter / Sparkling Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute flex items-center justify-center"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
          }}
          animate={{
            y: [0, p.driftY],
            x: [0, p.driftX],
            opacity: [0, 0.7, 1, 0.8, 0.3, 0],
            scale: p.isStar ? [0, 1.2, 0.8, 1.3, 0] : [0, 1.1, 1.1, 0],
            rotate: p.isStar ? [0, 90, 180, 270, 360] : 0,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        >
          {p.isStar ? (
            <StarSparkle size={p.size} color={p.color} />
          ) : (
            <div
              className="rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Animated fine mesh grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,106,0,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,106,0,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top-to-bottom luxury gradient veil */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/50" />
    </div>
  );
}
