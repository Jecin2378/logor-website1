"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  Building,
  Mail,
  Phone,
  FileText,
  CheckSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  MessageSquare,
  FileDown,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import AnimatedBackground from "@/components/AnimatedBackground";
import type { LeadDbRow, CustomerDbRow, CrmTask, CrmFile, CrmNote } from "@/types/lead";

export default function ClientPortalDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Client business data
  const [leadRecord, setLeadRecord] = useState<LeadDbRow | null>(null);
  const [customerRecord, setCustomerRecord] = useState<CustomerDbRow | null>(null);
  
  // CRM associations
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [files, setFiles] = useState<CrmFile[]>([]);
  const [notes, setNotes] = useState<CrmNote[]>([]);
  
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  // Authenticate & Fetch Profile
  useEffect(() => {
    async function loadPortalData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/portal/");
          return;
        }
        
        const currentUser = session.user;
        setUser(currentUser);
        const emailAddress = currentUser.email;

        if (!emailAddress) {
          setLoading(false);
          return;
        }

        // 1. Fetch Lead Record
        const { data: leadData, error: leadErr } = await supabase
          .from("leads")
          .select("*")
          .eq("email", emailAddress)
          .maybeSingle();

        if (leadErr) console.error("Error fetching lead profile:", leadErr);
        
        if (leadData) {
          setLeadRecord(leadData);

          // 2. Fetch Customer Details (if converted)
          if (leadData.status === "converted") {
            const { data: customerData, error: custErr } = await supabase
              .from("customers")
              .select("*")
              .eq("email", emailAddress)
              .maybeSingle();
            
            if (custErr) console.error("Error fetching customer record:", custErr);
            if (customerData) {
              setCustomerRecord(customerData);
            }
          }

          // 3. Fetch Tasks
          const { data: taskData } = await supabase
            .from("crm_tasks")
            .select("*")
            .eq("lead_id", leadData.id)
            .order("due_date", { ascending: true });
          
          if (taskData) setTasks(taskData);

          // 4. Fetch Shared Files
          const { data: fileData } = await supabase
            .from("crm_files")
            .select("*")
            .eq("lead_id", leadData.id)
            .order("created_at", { ascending: false });
          
          if (fileData) setFiles(fileData);

          // 5. Fetch Notes
          const { data: noteData } = await supabase
            .from("crm_notes")
            .select("*")
            .eq("lead_id", leadData.id)
            .order("created_at", { ascending: false });
          
          if (noteData) setNotes(noteData);
        }
      } catch (err) {
        console.error("Portal loading error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPortalData();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/portal/");
  };

  const handleDownloadFile = async (file: CrmFile) => {
    setDownloadingFileId(file.id);
    try {
      const { data, error } = await supabase.storage
        .from("crm-files")
        .createSignedUrl(file.file_path, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err) {
      console.error("Error generating file download URL:", err);
      alert("Failed to download file. Please contact support.");
    } finally {
      setDownloadingFileId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] relative text-white">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF6A00]"></div>
          <p className="text-gray-400 text-sm font-medium">Loading your portal dashboard...</p>
        </div>
      </div>
    );
  }

  // Account Pending State
  if (!leadRecord) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] relative px-6 text-white">
        <AnimatedBackground />

        <div className="w-full max-w-md relative z-10 text-center">
          <div className="mb-6">
            <Image
              src="/logor-logo.png"
              alt="Logor Logo"
              width={140}
              height={45}
              className="h-10 w-auto object-contain mx-auto drop-shadow-[0_0_8px_rgba(255,106,0,0.3)]"
              priority
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mx-auto">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Account Under Review</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                We couldn't find a pending lead or customer profile associated with your email:
              </p>
              <p className="text-sm font-bold text-[#FF6A00] font-mono break-all">{user?.email}</p>
            </div>

            <p className="text-xs text-gray-500">
              If you recently booked a consultation, our operations team will create your record shortly. Please check back later or contact support.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <a
                href="https://wa.me/917305313682"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                Contact Support via WhatsApp
              </a>
              <button
                onClick={handleSignOut}
                className="w-full py-3 rounded-xl border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white font-semibold text-sm transition-all"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Determine Milestone stage
  const getStageStatus = (stage: "submitted" | "consultation" | "partner") => {
    const status = leadRecord.status;
    if (stage === "submitted") {
      return "completed";
    }
    if (stage === "consultation") {
      if (status === "contacted" || status === "converted") return "completed";
      return "active";
    }
    if (stage === "partner") {
      if (status === "converted") return "completed";
      return "pending";
    }
    return "pending";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative text-white pb-16">
      <AnimatedBackground />

      {/* Header */}
      <header className="sticky top-0 z-30 py-4 glass-navbar border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="hover:opacity-90 transition-opacity">
            <Image
              src="/logor-logo.png"
              alt="Logor Logo"
              width={110}
              height={32}
              className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,106,0,0.2)]"
              priority
            />
          </a>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400">Welcome,</p>
              <p className="text-sm font-bold text-white">{leadRecord.full_name}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all duration-300"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-6 mt-8 relative z-10 space-y-8">
        
        {/* Onboarding Timeline Tracker */}
        <section className="glass-panel border border-white/5 rounded-3xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-6">Your Transformation Milestones</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Horizontal progress bar for desktop */}
            <div className="hidden md:block absolute top-[18px] left-[15%] right-[15%] h-[2px] bg-white/5 z-0">
              <div 
                className="h-full bg-[#FF6A00] transition-all duration-1000" 
                style={{ 
                  width: leadRecord.status === "converted" ? "100%" : leadRecord.status === "contacted" ? "50%" : "0%" 
                }} 
              />
            </div>

            {/* Stage 1: Submitted */}
            <div className="flex items-start md:flex-col md:items-center text-left md:text-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-500/10 border border-green-500/30 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Inquiry Registered</p>
                <p className="text-xs text-gray-500">
                  Form received on {new Date(leadRecord.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Stage 2: Consultation */}
            <div className="flex items-start md:flex-col md:items-center text-left md:text-center gap-4 relative z-10">
              {getStageStatus("consultation") === "completed" ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-500/10 border border-green-500/30 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FF6A00] animate-pulse">
                  <Clock className="w-5 h-5" />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Consultation & Strategy</p>
                <p className="text-xs text-gray-500">
                  {leadRecord.status === "new" ? "Our team is reviewing your details." : "Consultation session has started."}
                </p>
              </div>
            </div>

            {/* Stage 3: Conversion */}
            <div className="flex items-start md:flex-col md:items-center text-left md:text-center gap-4 relative z-10">
              {getStageStatus("partner") === "completed" ? (
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-500/10 border border-green-500/30 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/5 border border-white/10 text-gray-600">
                  <Building className="w-5 h-5" />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Active Partnership</p>
                <p className="text-xs text-gray-500">
                  {leadRecord.status === "converted" ? "Portal active. Let's grow!" : "Onboarding setup pending."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Account Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <section className="glass-panel border border-white/5 rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center text-[#FF6A00]">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">
                    {leadRecord.business_name}
                  </h3>
                  <span className="text-xs text-[#FF6A00] font-semibold uppercase tracking-wider">
                    {leadRecord.category || "Local Business"}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-5 space-y-4 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 text-gray-500" />
                  <span className="truncate">{leadRecord.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-gray-500" />
                  <span>{leadRecord.phone}</span>
                </div>
                {customerRecord && (
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-xs">Partner Status:</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 uppercase">
                      {customerRecord.status}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Support Box */}
            <section className="glass-panel border border-white/5 rounded-3xl p-6 bg-gradient-to-br from-[#FF6A00]/5 to-transparent text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-400 mx-auto">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Need Help or Consultation?</h4>
                <p className="text-xs text-gray-400">
                  Talk directly with our growth representative.
                </p>
              </div>
              <a
                href="https://wa.me/917305313682"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs justify-center items-center gap-2 rounded-xl transition-all"
              >
                Send WhatsApp Message
              </a>
            </section>
          </div>

          {/* Core Portal Panels */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Checklist Tasks */}
            <section className="glass-panel border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-5 h-5 text-[#FF6A00]" />
                  <h3 className="font-bold text-white text-base">Onboarding Checklist</h3>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">
                  {tasks.filter(t => t.status === "completed").length}/{tasks.length} Completed
                </span>
              </div>

              {tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No tasks assigned yet. Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start justify-between p-4 rounded-2xl border transition-all ${
                        task.status === "completed"
                          ? "bg-white/[0.01] border-white/5 opacity-60"
                          : "bg-white/[0.02] border-white/10 hover:border-white/15"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {task.status === "completed" ? (
                            <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-600" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className={`text-sm font-semibold text-white ${task.status === "completed" ? "line-through text-gray-500" : ""}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {task.due_date && (
                        <span className="text-[10px] shrink-0 font-medium text-gray-400 border border-white/5 px-2 py-1 rounded bg-white/[0.01] flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Shared Files Section */}
            <section className="glass-panel border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                <FileText className="w-5 h-5 text-[#FF6A00]" />
                <h3 className="font-bold text-white text-base">Shared Documents</h3>
              </div>

              {files.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No documents shared yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-white truncate" title={file.file_name}>
                            {file.file_name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {new Date(file.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadFile(file)}
                        disabled={downloadingFileId === file.id}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-[#FF6A00]/30 hover:bg-[#FF6A00]/10 hover:text-white transition-all text-gray-400"
                        title="Download Document"
                      >
                        {downloadingFileId === file.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border border-t-2 border-white" />
                        ) : (
                          <FileDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Updates & Notes log */}
            {notes.length > 0 && (
              <section className="glass-panel border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                  <AlertCircle className="w-5 h-5 text-[#FF6A00]" />
                  <h3 className="font-bold text-white text-base">Latest Updates</h3>
                </div>

                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2">
                      <p className="text-xs text-gray-500 font-mono">
                        Update from {new Date(note.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
