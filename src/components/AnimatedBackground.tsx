"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#0D0808]" />

      {/* Large floating orbs with slow animations */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,106,0,0.08) 0%, rgba(255,106,0,0.02) 50%, transparent 70%)",
          top: "10%",
          left: "-5%",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,140,50,0.06) 0%, rgba(255,80,0,0.015) 50%, transparent 70%)",
          top: "50%",
          right: "-10%",
        }}
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 50, -80, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,106,0,0.05) 0%, transparent 60%)",
          bottom: "5%",
          left: "30%",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle amber accent orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,170,50,0.04) 0%, transparent 60%)",
          top: "30%",
          left: "60%",
        }}
        animate={{
          x: [0, -70, 40, 0],
          y: [0, 30, -50, 0],
          opacity: [0.6, 1, 0.5, 0.6],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#FF6A00]"
          style={{
            top: `${15 + (i * 7) % 80}%`,
            left: `${10 + (i * 11) % 85}%`,
            opacity: 0.15 + (i % 3) * 0.08,
          }}
          animate={{
            y: [0, -30 - i * 5, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Animated mesh grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,106,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,106,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top-to-bottom luxury gradient veil */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/40" />
    </div>
  );
}
