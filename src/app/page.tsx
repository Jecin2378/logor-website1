import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Solutions from "@/components/Solutions";
import Industries from "@/components/Industries";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Global animated luxury background */}
      <AnimatedBackground />

      {/* Navigation header */}
      <Navbar />

      {/* Main sections */}
      <main className="flex-grow relative z-10">
        <Hero />
        <HowItWorks />
        <Services />
        <Solutions />
        <Industries />
        <Pricing />
        <FAQ />
        <ContactForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global widgets */}
      <WhatsAppWidget />
    </div>
  );
}
