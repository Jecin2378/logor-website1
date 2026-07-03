"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, ArrowRight, AlertTriangle, User, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function ClientPortalAuth() {
  const router = useRouter();
  const supabase = createClient();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if session already exists
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/portal/dashboard/");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter all required fields.");
      return;
    }

    if (isSignUp) {
      if (!fullName) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          setErrorMsg(error.message || "Failed to create account.");
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          // Check if email confirmation is required
          if (data.session) {
            setSuccessMsg("Account created successfully! Logging you in...");
            setTimeout(() => {
              router.push("/portal/dashboard/");
            }, 1500);
          } else {
            setSuccessMsg("Registration successful! Please check your email for a verification link.");
            setIsSubmitting(false);
            // Clear inputs
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setFullName("");
          }
        }
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message || "Invalid credentials.");
          setIsSubmitting(false);
          return;
        }

        if (data?.session) {
          setSuccessMsg("Authentication successful! Redirecting...");
          setTimeout(() => {
            router.push("/portal/dashboard/");
          }, 1000);
        } else {
          setErrorMsg("Failed to establish session.");
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.error("Auth submission error:", err);
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
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] relative px-6 py-12 text-white">
      <AnimatedBackground />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <a href="/" className="mb-3 hover:scale-105 transition-transform duration-300">
            <Image
              src="/logor-logo.png"
              alt="Logor Logo"
              width={140}
              height={45}
              className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,106,0,0.3)]"
              priority
            />
          </a>
          <span className="text-xs font-bold tracking-widest text-[#FF6A00] uppercase">
            Client Portal
          </span>
          <h1 className="text-xl font-extrabold text-white mt-1">
            {isSignUp ? "Create Your Account" : "Access Your Portal"}
          </h1>
        </div>

        {/* Auth Card */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel border border-white/5 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-center gap-3 backdrop-blur-sm"
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-green-950/40 border border-green-500/30 text-green-200 text-sm flex items-center gap-3 backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className={inputClasses}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
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
                  placeholder="name@business.com"
                  required
                  autoComplete="email"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="space-y-1">
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
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className={inputClasses}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={inputClasses}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 rounded-xl bg-[#FF6A00] text-black font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#FF8833] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_4px_25px_rgba(255,106,0,0.35)]"
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
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Register" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="text-center mt-6 border-t border-white/5 pt-4 text-sm text-gray-500">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[#FF6A00] hover:text-[#FF8833] font-medium transition-colors"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New client?{" "}
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[#FF6A00] hover:text-[#FF8833] font-medium transition-colors"
                >
                  Create Account
                </button>
              </span>
            )}
          </div>
        </motion.div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}
