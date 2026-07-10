"use client";

import React, { useEffect, useState } from "react";

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

    // Reduced count from 45 to 20 for scrolling performance boost
    const generated: Particle[] = Array.from({ length: 20 }).map((_, i) => {
      const isStar = Math.random() > 0.7; // 30% are 4-pointed stars
      const size = isStar ? Math.random() * 3 + 2.5 : Math.random() * 2.5 + 1; // 1px to 5.5px
      return {
        id: i,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 5 + 6, // Slower 6s to 11s drift for elegant, lighter CPU workload
        delay: Math.random() * -15, // Negative delay to pre-seed on screen
        driftX: (Math.random() - 0.5) * 80, // Horizontal swing
        driftY: -(Math.random() * 120 + 80), // Upward drift
        isStar,
      };
    });

    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep luxury base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040404] via-[#090909] to-[#0E0B08]" />

      {/* Large floating orbs with smooth, active animations (bypasses framer-motion, zero filter blurs) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-float-orb-1"
        style={{
          background:
            "radial-gradient(circle, rgba(255,106,0,0.08) 0%, rgba(255,106,0,0.02) 40%, rgba(255,106,0,0.005) 70%, transparent 85%)",
          top: "5%",
          left: "-10%",
        }}
      />

      <div
        className="absolute w-[500px] h-[500px] rounded-full animate-float-orb-2"
        style={{
          background:
            "radial-gradient(circle, rgba(213,198,37,0.06) 0%, rgba(255,106,0,0.015) 45%, transparent 80%)",
          top: "45%",
          right: "-10%",
        }}
      />

      <div
        className="absolute w-[450px] h-[450px] rounded-full animate-float-orb-3"
        style={{
          background:
            "radial-gradient(circle, rgba(255,106,0,0.06) 0%, rgba(255,106,0,0.01) 50%, transparent 80%)",
          bottom: "5%",
          left: "25%",
        }}
      />

      {/* Subtle gold accent orb */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full animate-float-orb-4"
        style={{
          background:
            "radial-gradient(circle, rgba(213,198,37,0.05) 0%, transparent 75%)",
          top: "25%",
          left: "60%",
        }}
      />

      {/* Live Luxury Glitter / Sparkling Particles (GPU CSS animations replace JS loop frames) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute flex items-center justify-center animate-particle-drift"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--drift-x": `${p.driftX}px`,
            "--drift-y": `${p.driftY}px`,
            "--drift-rotation": p.isStar ? "360deg" : "0deg",
          } as React.CSSProperties}
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
                boxShadow: `0 0 4px ${p.color}`,
              }}
            />
          )}
        </div>
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
