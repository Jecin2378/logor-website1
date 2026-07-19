"use client";

import React, { useState } from "react";
import { Send, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LeadFormData } from "@/types/lead";
import { createClient } from "@/utils/supabase/client";

const servicesList = [
  "NFC Business Cards",
  "Digital Landing Pages",
  "Google Business Profile Setup",
  "QR Code Solutions",
  "Google Review Solutions",
  "WhatsApp Business Integration",
  "Online Reputation Management",
  "Search Engine Optimization",
];

// Progressive disclosure steps (Hick's Law: reduce choices per step)
type FormStep = "contact" | "business" | "services";

const stepLabels: Record<FormStep, { num: number; label: string; desc: string }> = {
  contact: { num: 1, label: "Your Details", desc: "Who are you?" },
  business: { num: 2, label: "Business Info", desc: "Tell us about your business" },
  services: { num: 3, label: "Needs & Goals", desc: "What do you need?" },
};

export default function ContactForm() {
  const [formStep, setFormStep] = useState<FormStep>("contact");
  
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    whatsapp: "",
    gender: "Male",
    category: "",
    address: "",
    gbpAvailable: "No",
    websiteAvailable: "No",
    instagram: "",
    facebook: "",
    servicesInterested: [],
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<LeadFormData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const whatsappUrl = submittedData
    ? `https://wa.me/917305313682?text=${encodeURIComponent(
        `Hi Logor team! I just booked a free consultation.\n\nName: ${submittedData.fullName}\nBusiness: ${submittedData.businessName}\nServices: ${submittedData.servicesInterested.join(", ") || "General Inquiry"}`
      )}`
    : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => {
      const services = prev.servicesInterested.includes(service)
        ? prev.servicesInterested.filter((s) => s !== service)
        : [...prev.servicesInterested, service];
      return { ...prev, servicesInterested: services };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Client-side validation
    if (!formData.fullName || !formData.businessName || !formData.phone) {
      setErrorMessage("Please fill in all required fields: Name, Business Name, and Phone Number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("leads")
        .insert({
          full_name: formData.fullName.trim(),
          business_name: formData.businessName.trim(),
          email: formData.email?.trim() || null,
          phone: formData.phone.trim(),
          whatsapp: formData.whatsapp?.trim() || null,
          gender: (formData.gender || "Male").toLowerCase() as "male" | "female" | "other",
          category: formData.category?.trim() || null,
          address: formData.address?.trim() || null,
          gbp_available: (formData.gbpAvailable || "No").toLowerCase() as "yes" | "no" | "unsure",
          website_available: (formData.websiteAvailable || "No").toLowerCase() as "yes" | "no",
          instagram: formData.instagram?.trim() || null,
          facebook: formData.facebook?.trim() || null,
          services_interested: formData.servicesInterested || [],
          message: formData.message?.trim() || null,
        });

      if (error) {
        console.error("Supabase insert error:", error);
        setErrorMessage(error.message || "Failed to save your inquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Success — show confirmation overlay
      setSubmittedData(formData);
      setFormData({
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        whatsapp: "",
        gender: "Male",
        category: "",
        address: "",
        gbpAvailable: "No",
        websiteAvailable: "No",
        instagram: "",
        facebook: "",
        servicesInterested: [],
        message: "",
      });
    } catch (err) {
      console.error("ContactForm submission error:", err);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/6 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6A00]/50 focus:shadow-[0_0_15px_rgba(255,106,0,0.08)] transition-all duration-300";

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FF6A00]/5 rounded-full blur-[130px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-[#FF6A00] uppercase tracking-widest text-xs font-semibold">
            Get In Touch
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Book A Free Consultation.
          </p>
          <p className="text-gray-400 text-sm">
            Fill out our comprehensive questionnaire below. Our expert team will review your business presence and contact you on WhatsApp or phone within 24 hours.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="glass-panel border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          
          {/* Shimmer */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-center gap-3 backdrop-blur-sm relative z-10">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Progress Tracker (Zeigarnik Effect: incomplete steps create tension) */}
          <div className="mb-10 relative z-10">
            <div className="flex items-center justify-between mb-3">
              {Object.values(stepLabels).map((s) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-500 ${
                      formStep === Object.keys(stepLabels)[s.num - 1]
                        ? "bg-[#FF6A00] border-[#FF6A00] text-black scale-110 shadow-[0_0_15px_rgba(255,106,0,0.3)]"
                        : Object.keys(stepLabels).indexOf(formStep) > s.num - 1
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}
                  >
                    {Object.keys(stepLabels).indexOf(formStep) > s.num - 1 ? "✓" : s.num}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${
                      formStep === Object.keys(stepLabels)[s.num - 1] ? "text-white" : "text-gray-500"
                    }`}>
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
              {/* Progress indicator */}
              <span className="text-[10px] text-gray-500 font-mono">
                {stepLabels[formStep].num}/3
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6A00] to-emerald-400 transition-all duration-700"
                style={{ width: `${(stepLabels[formStep].num / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            {/* ─── STEP 1: Contact Info ─── */}
            {formStep === "contact" && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Your Details</h3>
                  <p className="text-xs text-gray-400">We just need basic info to get started.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@business.com"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="Leave blank if same as phone"
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setFormStep("business")}
                    className="px-8 py-3 rounded-xl bg-[#FF6A00] text-black font-bold text-sm hover:bg-[#FF8833] transition-all duration-300 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: Business Info ─── */}
            {formStep === "business" && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Business Information</h3>
                  <p className="text-xs text-gray-400">Tell us about your business.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Business Name *</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Logor Retail Store"
                      required
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Business Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Restaurant, Salon"
                      className={inputClasses}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Business Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address, City, State"
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setFormStep("contact")}
                    className="px-6 py-3 rounded-xl border border-white/5 text-gray-400 hover:text-white text-sm font-semibold transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStep("services")}
                    className="px-8 py-3 rounded-xl bg-[#FF6A00] text-black font-bold text-sm hover:bg-[#FF8833] transition-all duration-300 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: Services & Submit ─── */}
            {formStep === "services" && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Your Digital Needs</h3>
                  <p className="text-xs text-gray-400">Select services you are interested in (optional).</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicesList.map((service) => {
                    const isChecked = formData.servicesInterested.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleCheckboxChange(service)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs font-semibold transition-all duration-200 backdrop-blur-sm ${
                          isChecked
                            ? "bg-[#FF6A00]/10 text-white border-[#FF6A00] shadow-[0_0_12px_rgba(255,106,0,0.1)]"
                            : "bg-white/[0.02] text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[8px] font-bold ${
                          isChecked ? "bg-[#FF6A00] border-[#FF6A00] text-black" : "border-gray-600 bg-transparent"
                        }`}>
                          {isChecked && "✓"}
                        </span>
                        <span>{service}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Your Message / Special Instructions</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us about your business goals..."
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                {/* Digital Presence Quick Audit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                      Google Business Profile?
                    </label>
                    <select
                      name="gbpAvailable"
                      value={formData.gbpAvailable}
                      onChange={handleChange}
                      className={`${inputClasses} text-xs`}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Unsure">Unsure / Not verified</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                      Own Website?
                    </label>
                    <select
                      name="websiteAvailable"
                      value={formData.websiteAvailable}
                      onChange={handleChange}
                      className={`${inputClasses} text-xs`}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setFormStep("business")}
                    className="px-6 py-3 rounded-xl border border-white/5 text-gray-400 hover:text-white text-sm font-semibold transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-3 rounded-xl bg-[#FF6A00] text-black font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#FF8833] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_4px_30px_rgba(255,106,0,0.4)]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit & Book Free Consultation</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </form>

          {/* Success Overlay Modal */}
          <AnimatePresence>
            {submittedData && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSubmittedData(null)}
                  className="absolute inset-0 bg-black/85 backdrop-blur-md"
                />

                {/* Modal Card */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="relative max-w-md w-full glass-panel border border-white/10 rounded-3xl p-8 sm:p-10 text-center shadow-2xl z-10 space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 mx-auto backdrop-blur-sm">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-white">Consultation Booked!</h4>
                    <p className="text-sm text-gray-400">
                      Thank you, <span className="text-white font-semibold">{submittedData.fullName}</span>. We have successfully registered <span className="text-white font-semibold">{submittedData.businessName}</span> for digital transformation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 space-y-1 text-left max-w-sm mx-auto font-mono backdrop-blur-sm">
                    <p><strong className="text-gray-300">Name:</strong> {submittedData.fullName}</p>
                    <p><strong className="text-gray-300">Phone:</strong> {submittedData.phone}</p>
                    {submittedData.whatsapp && <p><strong className="text-gray-300">WhatsApp:</strong> {submittedData.whatsapp}</p>}
                    <p><strong className="text-gray-300">Services:</strong> {submittedData.servicesInterested.join(", ") || "General Inquiry"}</p>
                  </div>

                  <p className="text-xs text-orange-400 font-medium">
                    Our team will contact you on WhatsApp (+91 7305313682) shortly.
                  </p>

                  <div className="flex flex-col gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.25)]"
                    >
                      Confirm on WhatsApp
                    </a>

                    <button
                      onClick={() => setSubmittedData(null)}
                      className="w-full py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-400 hover:text-white font-semibold text-sm transition-all cursor-pointer"
                    >
                      Okay! got it
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
