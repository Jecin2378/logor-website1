"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  FileText,
  Plus,
  Trash2,
  Calendar,
  Paperclip,
  Activity,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Edit2,
  Save
} from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { LeadDbRow, CustomerDbRow, CrmNote, CrmTask, CrmActivity, CrmFile } from "@/types/lead";

interface CrmDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "lead" | "customer";
  entityId: string | null;
  onUpdate: () => void; // Trigger list reload on parent if needed
}

export default function CrmDetailView({
  isOpen,
  onClose,
  entityType,
  entityId,
  onUpdate: _onUpdate
}: CrmDetailViewProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"details" | "notes" | "tasks" | "files" | "timeline">("details");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Entity data states
  const [leadData, setLeadData] = useState<LeadDbRow | null>(null);
  const [customerData, setCustomerData] = useState<CustomerDbRow | null>(null);

  // CRM collections
  const [notes, setNotes] = useState<CrmNote[]>([]);
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [files, setFiles] = useState<CrmFile[]>([]);
  const [activities, setActivities] = useState<CrmActivity[]>([]);

  // Form input states
  const [newNote, setNewNote] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");

  // Task editing state
  const [editingTask, setEditingTask] = useState<CrmTask | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDue, setEditTaskDue] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState<"low" | "medium" | "high">("medium");

  // File upload state
  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch entity details - defined before useEffect to avoid hoisting issues
  const fetchEntityDetails = React.useCallback(async () => {
    if (!entityId) return;
    setLoading(true);

    try {
      // 1. Fetch lead or customer info
      if (entityType === "lead") {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("id", entityId)
          .single();
        if (error) throw error;
        setLeadData(data);
      } else {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", entityId)
          .single();
        if (error) throw error;
        setCustomerData(data);
      }

      // 2. Fetch Notes, Tasks, Files, Activities
      const notesQuery = supabase
        .from("crm_notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (entityType === "lead") {
        notesQuery.eq("lead_id", entityId);
      } else {
        notesQuery.eq("customer_id", entityId);
      }
      
      const tasksQuery = supabase
        .from("crm_tasks")
        .select("*")
        .order("status", { ascending: true })
        .order("due_date", { ascending: true });

      if (entityType === "lead") {
        tasksQuery.eq("lead_id", entityId);
      } else {
        tasksQuery.eq("customer_id", entityId);
      }

      const filesQuery = supabase
        .from("crm_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (entityType === "lead") {
        filesQuery.eq("lead_id", entityId);
      } else {
        filesQuery.eq("customer_id", entityId);
      }

      const activitiesQuery = supabase
        .from("crm_activities")
        .select("*")
        .order("created_at", { ascending: false });

      if (entityType === "lead") {
        activitiesQuery.eq("lead_id", entityId);
      } else {
        activitiesQuery.eq("customer_id", entityId);
      }

      const [resNotes, resTasks, resFiles, resActs] = await Promise.all([
        notesQuery,
        tasksQuery,
        filesQuery,
        activitiesQuery
      ]);

      if (resNotes.error) throw resNotes.error;
      if (resTasks.error) throw resTasks.error;
      if (resFiles.error) throw resFiles.error;
      if (resActs.error) throw resActs.error;

      setNotes(resNotes.data || []);
      setTasks(resTasks.data || []);
      setFiles(resFiles.data || []);
      setActivities(resActs.data || []);

    } catch (err: unknown) {
      console.error("Error loading CRM details:", err);
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, supabase]);

  // Load all detail data on open/entity change
  useEffect(() => {
    if (!isOpen || !entityId) return;

    // Reset fields
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab("details");
    setLeadData(null);
    setCustomerData(null);
    setNotes([]);
    setTasks([]);
    setFiles([]);
    setActivities([]);
    setNewNote("");
    setTaskTitle("");
    setTaskDue("");
    setTaskPriority("medium");

    fetchEntityDetails();
  }, [isOpen, entityId, entityType, fetchEntityDetails]);

  // Helper log activity
  const logCrmActivity = async (type: string, desc: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const actObj = {
        lead_id: entityType === "lead" ? entityId : null,
        customer_id: entityType === "customer" ? entityId : null,
        activity_type: type,
        description: desc,
        created_by: user?.id || null
      };

      const { data, error } = await supabase
        .from("crm_activities")
        .insert(actObj)
        .select()
        .single();

      if (error) throw error;
      setActivities(prev => [data as CrmActivity, ...prev]);
    } catch (err) {
      console.error("Log activity error:", err);
    }
  };

  // Note handler
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !entityId) return;
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const noteObj = {
        lead_id: entityType === "lead" ? entityId : null,
        customer_id: entityType === "customer" ? entityId : null,
        content: newNote.trim(),
        created_by: user?.id || null
      };

      const { data, error } = await supabase
        .from("crm_notes")
        .insert(noteObj)
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [data as CrmNote, ...prev]);
      setNewNote("");
      await logCrmActivity("note_added", `Note added: "${noteObj.content.substring(0, 40)}..."`);
    } catch (err: unknown) {
      alert("Failed to save note: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  // Task handler
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !entityId) return;
    setSaving(true);

    try {
      const taskObj = {
        lead_id: entityType === "lead" ? entityId : null,
        customer_id: entityType === "customer" ? entityId : null,
        title: taskTitle.trim(),
        due_date: taskDue ? new Date(taskDue).toISOString() : null,
        priority: taskPriority,
        status: "pending" as const
      };

      const { data, error } = await supabase
        .from("crm_tasks")
        .insert(taskObj)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [data as CrmTask, ...prev]);
      setTaskTitle("");
      setTaskDue("");
      setTaskPriority("medium");

      await logCrmActivity("task_created", `Task scheduled: "${taskObj.title}" due ${taskDue || "no due date"}`);
    } catch (err: unknown) {
      alert("Failed to save task: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  // Toggle task complete status
  const handleToggleTaskStatus = async (task: CrmTask) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const { error } = await supabase
        .from("crm_tasks")
        .update({ status: nextStatus })
        .eq("id", task.id);

      if (error) throw error;

      setTasks(prev =>
        prev.map(t => (t.id === task.id ? { ...t, status: nextStatus } : t))
      );

      const logMsg = nextStatus === "completed" 
        ? `Task completed: "${task.title}"`
        : `Task set back to pending: "${task.title}"`;
      await logCrmActivity("task_completed", logMsg);
    } catch (err: unknown) {
      alert("Failed to update task: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Start editing a task
  const startEditTask = (task: CrmTask) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDue(task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : "");
    setEditTaskPriority(task.priority);
  };

  // Save task edits
  const handleEditTaskSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTaskTitle.trim()) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("crm_tasks")
        .update({
          title: editTaskTitle.trim(),
          due_date: editTaskDue ? new Date(editTaskDue).toISOString() : null,
          priority: editTaskPriority
        })
        .eq("id", editingTask.id);

      if (error) throw error;

      setTasks(prev =>
        prev.map(t =>
          t.id === editingTask.id
            ? { ...t, title: editTaskTitle.trim(), due_date: editTaskDue ? new Date(editTaskDue).toISOString() : null, priority: editTaskPriority }
            : t
        )
      );

      await logCrmActivity("task_updated", `Task updated: "${editingTask.title}" → "${editTaskTitle.trim()}"`);
      setEditingTask(null);
    } catch (err: unknown) {
      alert("Failed to update task: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  // Cancel task editing
  const cancelEditTask = () => {
    setEditingTask(null);
  };

  // Delete task
  const handleDeleteTask = async (taskId: string, title: string) => {
    try {
      const { error } = await supabase
        .from("crm_tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== taskId));
      await logCrmActivity("task_deleted", `Task deleted: "${title}"`);
    } catch (err: unknown) {
      alert("Failed to delete task: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Document upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !entityId) return;

    setUploadingFile(true);

    try {
      const timestamp = new Date().getTime();
      const path = `${entityType}/${entityId}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      // 1. Upload file binary
      const { error: uploadErr } = await supabase.storage
        .from("crm-files")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadErr) throw uploadErr;

      // 2. Insert metadata
      const { data: { user } } = await supabase.auth.getUser();
      const fileObj = {
        lead_id: entityType === "lead" ? entityId : null,
        customer_id: entityType === "customer" ? entityId : null,
        file_name: file.name,
        file_path: path,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
        uploaded_by: user?.id || null
      };

      const { data: fileData, error: dbErr } = await supabase
        .from("crm_files")
        .insert(fileObj)
        .select()
        .single();

      if (dbErr) throw dbErr;

      setFiles(prev => [fileData as CrmFile, ...prev]);
      await logCrmActivity("file_uploaded", `Uploaded document: "${file.name}"`);
    } catch (err: unknown) {
      console.error("Storage upload error:", err);
      alert("Storage upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Secure download handler (Signed URLs)
  const handleDownloadFile = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("crm-files")
        .createSignedUrl(filePath, 60); // 60 seconds expiry

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err: unknown) {
      alert("Failed to retrieve file download link: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  // Delete file
  const handleDeleteFile = async (file: CrmFile) => {
    try {
      // 1. Delete binary from storage
      const { error: storageErr } = await supabase.storage
        .from("crm-files")
        .remove([file.file_path]);

      if (storageErr) throw storageErr;

      // 2. Delete db record
      const { error: dbErr } = await supabase
        .from("crm_files")
        .delete()
        .eq("id", file.id);

      if (dbErr) throw dbErr;

      setFiles(prev => prev.filter(f => f.id !== file.id));
      await logCrmActivity("file_deleted", `Deleted document: "${file.file_name}"`);
    } catch (err: unknown) {
      alert("Failed to delete file: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  };

  if (!isOpen) return null;

  // Contact info short cuts
  const contactName = entityType === "lead" ? leadData?.full_name : customerData?.full_name;
  const businessName = entityType === "lead" ? leadData?.business_name : customerData?.business_name;
  const phone = entityType === "lead" ? leadData?.phone : customerData?.phone;
  const email = entityType === "lead" ? leadData?.email : customerData?.email;
  const whatsapp = entityType === "lead" ? leadData?.whatsapp : customerData?.whatsapp;
  const address = entityType === "lead" ? leadData?.address : customerData?.address;
  const category = entityType === "lead" ? leadData?.category : customerData?.category;
  const detailsObj = entityType === "lead" ? leadData : customerData;

  const tabClasses = (tab: typeof activeTab) =>
    `px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 backdrop-blur-sm ${
      activeTab === tab
        ? "bg-[#FF6A00]/10 text-white border-[#FF6A00] shadow-[0_0_10px_rgba(255,106,0,0.1)]"
        : "bg-white/[0.01] text-gray-400 border-white/5 hover:border-white/10 hover:text-white"
    }`;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" />

      <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-screen max-w-xl bg-charcoal border-l border-white/5 flex flex-col shadow-2xl relative z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full orange-brand-gradient flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_12px_rgba(255,106,0,0.2)]">
                {contactName ? getInitials(contactName) : "..."}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white truncate max-w-[240px]">
                  {contactName || "Loading..."}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">{businessName || "No business details"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                entityType === "customer" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              }`}>
                {entityType}
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 py-4 border-b border-white/5 bg-[#0F0F0F] flex gap-2 overflow-x-auto select-none shrink-0">
            <button onClick={() => setActiveTab("details")} className={tabClasses("details")}>Details</button>
            <button onClick={() => setActiveTab("notes")} className={tabClasses("notes")}>Notes</button>
            <button onClick={() => setActiveTab("tasks")} className={tabClasses("tasks")}>Tasks</button>
            <button onClick={() => setActiveTab("files")} className={tabClasses("files")}>Files</button>
            <button onClick={() => setActiveTab("timeline")} className={tabClasses("timeline")}>Timeline</button>
          </div>

          {/* Body Content (Scrollable) */}
          <div className="flex-grow overflow-y-auto p-6">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#FF6A00] animate-spin" />
                <span className="text-gray-500 text-xs font-medium">Retrieving timeline info...</span>
              </div>
            ) : (
              <>
                {/* ──────────────────────────────────────────────────────── */}
                {/* DETAILS TAB */}
                {/* ──────────────────────────────────────────────────────── */}
                {activeTab === "details" && detailsObj && (
                  <div className="space-y-6">
                    <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-1 gap-3.5 text-sm">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-gray-500 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Representative</p>
                            <p className="text-white mt-0.5">{contactName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-gray-500 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Business Name</p>
                            <p className="text-white mt-0.5">{businessName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Phone Number</p>
                            <a href={`tel:${phone}`} className="text-[#FF6A00] hover:underline mt-0.5 block">{phone}</a>
                          </div>
                          {whatsapp && (
                            <span className="ml-auto text-[10px] px-2 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-400 font-mono">
                              WhatsApp: {whatsapp}
                            </span>
                          )}
                        </div>

                        {email && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                              <a href={`mailto:${email}`} className="text-gray-300 hover:text-white mt-0.5 block font-mono">{email}</a>
                            </div>
                          </div>
                        )}

                        {category && (
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-gray-500 shrink-0" />
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Business Category</p>
                              <p className="text-gray-300 mt-0.5">{category}</p>
                            </div>
                          </div>
                        )}

                        {address && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Office Address</p>
                              <p className="text-gray-300 mt-0.5 leading-relaxed">{address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata summary */}
                    <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                        CRM Metadata Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500">
                        <div>
                          <p>Record Created</p>
                          <p className="text-white mt-1 font-mono">
                            {new Date(detailsObj.created_at).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <p>Last Activity Update</p>
                          <p className="text-white mt-1 font-mono">
                            {new Date(detailsObj.updated_at).toLocaleString("en-IN")}
                          </p>
                        </div>
                        {entityType === "customer" && (
                          <div>
                            <p>Current Status</p>
                            <p className="text-emerald-400 mt-1 uppercase font-extrabold tracking-wider">
                              {(detailsObj as CustomerDbRow).status}
                            </p>
                          </div>
                        )}
                        {entityType === "customer" && (
                          <div>
                            <p>Contract Value</p>
                            <p className="text-emerald-400 mt-1 text-sm font-extrabold font-mono">
                              ₹{(detailsObj as CustomerDbRow).contract_value.toLocaleString("en-IN")}
                            </p>
                          </div>
                        )}
                        {entityType === "lead" && (
                          <div>
                            <p>Funnel Status</p>
                            <p className="text-blue-400 mt-1 uppercase font-extrabold tracking-wider">
                              {(detailsObj as LeadDbRow).status}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interested Services List */}
                    {entityType === "lead" && leadData?.services_interested && (
                      <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                          Interested Services
                        </h4>
                        {leadData.services_interested.length === 0 ? (
                          <p className="text-xs text-gray-600 italic">No services checked.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {leadData.services_interested.map(s => (
                              <span key={s} className="px-2.5 py-1 text-xs rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] font-semibold">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Raw customer message or notes */}
                    {entityType === "lead" && leadData?.message && (
                      <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                          Form Questionnaire Comments
                        </h4>
                        <p className="text-gray-300 text-xs leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/5 font-mono italic">
                          &ldquo;{leadData.message}&rdquo;
                        </p>
                      </div>
                    )}

                    {entityType === "customer" && customerData?.notes && (
                      <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">
                          Customer Scope / Setup Notes
                        </h4>
                        <p className="text-gray-300 text-xs leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/5 font-mono italic">
                          &ldquo;{customerData.notes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* NOTES TAB */}
                {/* ──────────────────────────────────────────────────────── */}
                {activeTab === "notes" && (
                  <div className="space-y-6">
                    {/* Add note form */}
                    <form onSubmit={handleSaveNote} className="space-y-3">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a status note or log conversation comments..."
                        required
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/6 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]/50 transition-colors resize-none"
                      />
                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-2.5 rounded-xl bg-[#FF6A00] text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors hover:bg-[#FF8833] disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        <span>Save Note Entry</span>
                      </button>
                    </form>

                    {/* Notes list */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2 pl-1">
                        Timeline Note Entries ({notes.length})
                      </h4>
                      {notes.length === 0 ? (
                        <p className="text-xs text-gray-600 text-center py-6 italic">No notes logged yet.</p>
                      ) : (
                        notes.map(note => (
                          <div key={note.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group flex flex-col justify-between shadow">
                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {note.content}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold font-mono mt-3">
                              <span>
                                {new Date(note.created_at).toLocaleString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                              <span className="text-gray-600">Logged by Admin</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* TASKS TAB */}
                {/* ──────────────────────────────────────────────────────── */}
                {activeTab === "tasks" && (
                  <div className="space-y-6">
                    {/* Add Task Form */}
                    <form onSubmit={handleAddTask} className="glass-panel border border-white/5 rounded-2xl p-4 space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-1">
                        Schedule Follow-Up Task
                      </h4>
                      <input
                        type="text"
                        placeholder="Task title (e.g. Call back customer, Deliver card)"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]/50"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase">Due Date</label>
                          <input
                            type="datetime-local"
                            value={taskDue}
                            onChange={(e) => setTaskDue(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F0F0F] border border-white/5 text-xs text-gray-300 focus:outline-none focus:border-[#FF6A00]/50 cursor-pointer"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase">Priority</label>
                          <select
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value as "low" | "medium" | "high")}
                            className="w-full px-3 py-2 rounded-lg bg-[#0F0F0F] border border-white/5 text-xs text-gray-300 focus:outline-none focus:border-[#FF6A00]/50 cursor-pointer"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-2 rounded-xl bg-[#FF6A00] text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors hover:bg-[#FF8833] disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        <span>Schedule Task</span>
                      </button>
                    </form>

                    {/* Edit Task Inline Form */}
                    {editingTask && (
                      <form onSubmit={handleEditTaskSave} className="glass-panel border border-[#FF6A00]/20 rounded-2xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#FF6A00] uppercase tracking-wider">Edit Task</h4>
                          <button
                            type="button"
                            onClick={cancelEditTask}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6A00]/50"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase">Due Date</label>
                            <input
                              type="datetime-local"
                              value={editTaskDue}
                              onChange={(e) => setEditTaskDue(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[#0F0F0F] border border-white/5 text-xs text-gray-300 focus:outline-none focus:border-[#FF6A00]/50"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase">Priority</label>
                            <select
                              value={editTaskPriority}
                              onChange={(e) => setEditTaskPriority(e.target.value as "low" | "medium" | "high")}
                              className="w-full px-3 py-2 rounded-lg bg-[#0F0F0F] border border-white/5 text-xs text-gray-300 focus:outline-none focus:border-[#FF6A00]/50"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-2 rounded-xl bg-[#FF6A00] text-black text-xs font-bold hover:bg-[#FF8833] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{saving ? "Saving..." : "Save Changes"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditTask}
                            className="py-2 px-4 rounded-xl border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white text-xs font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Tasks list */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2 pl-1">
                        Active CRM Tasks ({tasks.length})
                      </h4>
                      {tasks.length === 0 ? (
                        <p className="text-xs text-gray-600 text-center py-6 italic">No tasks active.</p>
                      ) : (
                        tasks.map(task => {
                          const isCompleted = task.status === "completed";
                          const priorityColor =
                            task.priority === "high"
                              ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                              : task.priority === "medium"
                              ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                              : "text-blue-400 bg-blue-500/10 border-blue-500/20";

                          return (
                            <div
                              key={task.id}
                              className={`p-4 rounded-2xl bg-white/[0.02] border transition-colors ${
                                isCompleted ? "border-white/5 opacity-50" : "border-white/5"
                              } flex items-start justify-between gap-4`}
                            >
                              <div className="flex gap-3 items-start flex-grow">
                                <button
                                  onClick={() => handleToggleTaskStatus(task)}
                                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold ${
                                    isCompleted 
                                      ? "bg-[#FF6A00] border-[#FF6A00] text-black"
                                      : "border-gray-500 bg-transparent hover:border-[#FF6A00]"
                                  }`}
                                >
                                  {isCompleted && "✓"}
                                </button>
                                <div className="space-y-1">
                                  <p className={`text-sm font-bold text-white ${isCompleted ? "line-through text-gray-500" : ""}`}>
                                    {task.title}
                                  </p>
                                  <div className="flex flex-wrap gap-2 items-center text-[10px] font-semibold">
                                    <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-bold ${priorityColor}`}>
                                      {task.priority}
                                    </span>
                                    {task.due_date && (
                                      <span className="flex items-center gap-1 text-gray-500 font-mono">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>
                                          {new Date(task.due_date).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                          })}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {!isCompleted && (
                                  <button
                                    onClick={() => startEditTask(task)}
                                    className="p-2 rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteTask(task.id, task.title)}
                                  className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* FILES TAB */}
                {/* ──────────────────────────────────────────────────────── */}
                {activeTab === "files" && (
                  <div className="space-y-6">
                    {/* File Upload Field */}
                    <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-[#FF6A00]/50 transition-all duration-300 relative group bg-white/[0.01]">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="space-y-2 flex flex-col items-center">
                        {uploadingFile ? (
                          <>
                            <Loader2 className="w-8 h-8 text-[#FF6A00] animate-spin" />
                            <span className="text-xs text-gray-400 font-semibold mt-1">Uploading document...</span>
                          </>
                        ) : (
                          <>
                            <Paperclip className="w-8 h-8 text-gray-500 group-hover:text-[#FF6A00] transition-colors" />
                            <div>
                              <p className="text-xs font-bold text-white">Click or drag a file to upload</p>
                              <p className="text-[10px] text-gray-500 mt-1">PDF, DOCX, PNG, JPG (Max 50MB)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Files list */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2 pl-1">
                        Uploaded Lead Files ({files.length})
                      </h4>
                      {files.length === 0 ? (
                        <p className="text-xs text-gray-600 text-center py-6 italic">No files uploaded yet.</p>
                      ) : (
                        files.map(file => (
                          <div
                            key={file.id}
                            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4"
                          >
                            <div
                              onClick={() => handleDownloadFile(file.file_path)}
                              className="flex gap-3 items-center flex-grow cursor-pointer group"
                            >
                              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 group-hover:text-[#FF6A00] group-hover:border-[#FF6A00]/30 transition-all">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5 max-w-[280px]">
                                <p className="text-sm font-bold text-white group-hover:underline truncate">
                                  {file.file_name}
                                </p>
                                <p className="text-[10px] text-gray-500 font-mono">
                                  {(file.file_size / 1024).toFixed(1)} KB •{" "}
                                  {new Date(file.created_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short"
                                  })}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ──────────────────────────────────────────────────────── */}
                {/* TIMELINE TAB */}
                {/* ──────────────────────────────────────────────────────── */}
                {activeTab === "timeline" && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2 pl-1">
                      Contact History Log
                    </h4>

                    {activities.length === 0 ? (
                      <p className="text-xs text-gray-600 text-center py-6 italic">No activities logged yet.</p>
                    ) : (
                      <div className="relative pl-6 border-l border-white/5 space-y-6 ml-2 pt-2">
                        {activities.map(act => {
                          const iconColor =
                            act.activity_type === "converted"
                              ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                              : act.activity_type === "task_completed"
                              ? "bg-blue-500 text-black shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                              : "bg-white/5 text-[#FF6A00] border border-white/10";

                          return (
                            <div key={act.id} className="relative">
                              {/* Connector ring */}
                              <div className={`absolute -left-[35px] top-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold ${iconColor}`}>
                                <Activity className="w-2.5 h-2.5" />
                              </div>

                              <div className="space-y-1">
                                <p className="text-xs text-gray-300 font-semibold">{act.description}</p>
                                <p className="text-[10px] text-gray-500 font-mono">
                                  {new Date(act.created_at).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}{" "}
                                  • logged by system
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
