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

      {/* CSS Keyframes for lightning flow and drifting electric sparks */}
      <style>{`
        @keyframes lightning-flow {
          0% {
            stroke-dasharray: 0 800;
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
          40% {
            stroke-dasharray: 180 620;
            stroke-dashoffset: -150;
            opacity: 0.9;
          }
          80% {
            stroke-dasharray: 0 800;
            stroke-dashoffset: -500;
            opacity: 0.3;
          }
          100% {
            stroke-dasharray: 0 800;
            stroke-dashoffset: -800;
            opacity: 0.1;
          }
        }
        @keyframes float-electric-spark {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.1;
          }
          33% {
            transform: translate(45px, -65px) scale(1.2);
            opacity: 0.45;
          }
          66% {
            transform: translate(-55px, 45px) scale(0.85);
            opacity: 0.25;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.1;
          }
        }
        .animate-lightning-flow {
          animation: lightning-flow 5s linear infinite;
        }
        .animate-electric-spark-1 {
          animation: float-electric-spark 8s ease-in-out infinite;
        }
        .animate-electric-spark-2 {
          animation: float-electric-spark 11s ease-in-out infinite;
          animation-delay: -3s;
        }
        .animate-electric-spark-3 {
          animation: float-electric-spark 14s ease-in-out infinite;
          animation-delay: -7s;
        }
        @keyframes circle-flow-clockwise {
          0% {
            stroke-dasharray: 150 1600;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 150 1600;
            stroke-dashoffset: -1750;
          }
        }
        @keyframes circle-flow-counter-clockwise {
          0% {
            stroke-dasharray: 100 900;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 100 900;
            stroke-dashoffset: 1000;
          }
        }
        .animate-circle-flow-cw {
          animation: circle-flow-clockwise 14s linear infinite;
        }
        .animate-circle-flow-ccw {
          animation: circle-flow-counter-clockwise 11s linear infinite;
        }
      `}</style>

      {/* Big glowing thunder/lightning symbol in the background with massive concentric comet rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-visible">
        <svg
          viewBox="0 0 2000 2000"
          className="w-[1000px] sm:w-[1800px] h-[1000px] sm:h-[1800px] pointer-events-none"
        >
          {/* Outer Concentric Circle (Base + Comet Light) */}
          <circle cx="1000" cy="1000" r="850" fill="none" stroke="rgba(255,106,0,0.015)" strokeWidth="1" />
          <circle cx="1000" cy="1000" r="850" fill="none" stroke="url(#lightning-flow-gradient)" strokeWidth="1.5" opacity="0.12" className="animate-circle-flow-cw" strokeLinecap="round" />
          
          {/* Inner Concentric Circle / Inline Circle (Base + Comet Light) */}
          <circle cx="1000" cy="1000" r="500" fill="none" stroke="rgba(255,106,0,0.02)" strokeWidth="1" />
          <circle cx="1000" cy="1000" r="500" fill="none" stroke="url(#lightning-flow-gradient)" strokeWidth="1.5" opacity="0.15" className="animate-circle-flow-ccw" strokeLinecap="round" />
          
          {/* Center Lightning Bolt scaled and positioned at 1000, 1000 */}
          <g transform="translate(900, 800) scale(2)" style={{ filter: "drop-shadow(0 0 35px rgba(255,106,0,0.4))" }}>
            {/* Base outer glow */}
            <path
              d="M 58 6 L 18 102 H 46 L 28 194 L 82 92 H 54 L 68 6 Z"
              fill="none"
              stroke="rgba(255,106,0,0.05)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main lightning silhouette */}
            <path
              d="M 58 6 L 18 102 H 46 L 28 194 L 82 92 H 54 L 68 6 Z"
              fill="rgba(255,106,0,0.01)"
              stroke="rgba(255,106,0,0.1)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animated moving electric flow stripe */}
            <path
              d="M 58 6 L 18 102 H 46 L 28 194 L 82 92 H 54 L 68 6 Z"
              fill="none"
              stroke="url(#lightning-flow-gradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-lightning-flow"
              opacity="0.3"
            />
          </g>

          <defs>
            <linearGradient id="lightning-flow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFAA00" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FF6A00" stopOpacity="1" />
              <stop offset="100%" stopColor="#FF1100" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Moving electric spark lights that drift erratically behind lightning */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[600px] pointer-events-none z-0">
        <div 
          className="absolute w-24 h-24 rounded-full animate-electric-spark-1"
          style={{
            background: "radial-gradient(circle, rgba(255,106,0,0.18) 0%, transparent 70%)",
            top: "20%",
            left: "30%",
          }}
        />
        <div 
          className="absolute w-32 h-32 rounded-full animate-electric-spark-2"
          style={{
            background: "radial-gradient(circle, rgba(255,170,0,0.15) 0%, transparent 70%)",
            top: "60%",
            left: "50%",
          }}
        />
        <div 
          className="absolute w-20 h-20 rounded-full animate-electric-spark-3"
          style={{
            background: "radial-gradient(circle, rgba(255,80,0,0.16) 0%, transparent 70%)",
            top: "40%",
            left: "20%",
          }}
        />
      </div>

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
