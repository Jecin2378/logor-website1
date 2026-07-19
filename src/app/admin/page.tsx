"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, ArrowRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if session already exists
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/admin/dashboard/");
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, [router, supabase.auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Invalid login credentials.");
        setIsSubmitting(false);
        return;
      }

      if (data?.session) {
        router.push("/admin/dashboard/");
      } else {
        setErrorMsg("Failed to establish session.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] relative text-white">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF6A00]"></div>
          <p className="text-gray-400 text-sm font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  const inputClasses =
    "w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/6 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6A00]/50 focus:shadow-[0_0_15px_rgba(255,106,0,0.08)] transition-all duration-300";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] relative px-6 text-white">
      {/* Background visual components */}
      <AnimatedBackground />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-3 hover:scale-105 transition-transform duration-300">
            <Image
              src="/logor-logo.png"
              alt="Logor Logo"
              width={140}
              height={45}
              className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,106,0,0.3)]"
              priority
            />
          </div>
          <span className="text-xs font-bold tracking-widest text-[#FF6A00] uppercase">
            Control Center
          </span>
          <h1 className="text-xl font-extrabold text-white mt-1">Admin Portal</h1>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel border border-white/5 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl"
        >
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />

          {/* Form Content */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-center gap-3 backdrop-blur-sm">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@logor.in"
                  required
                  autoComplete="email"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={inputClasses}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#FF6A00] text-black font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#FF8833] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_4px_25px_rgba(255,106,0,0.35)]"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to main site
          </button>
        </div>
      </div>
    </div>
  );
}
