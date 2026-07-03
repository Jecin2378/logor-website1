export interface LeadFormData {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  whatsapp: string;
  gender: "Male" | "Female" | "Other";
  category: string;
  address: string;
  gbpAvailable: "Yes" | "No" | "Unsure";
  websiteAvailable: "Yes" | "No";
  instagram: string;
  facebook: string;
  servicesInterested: string[];
  message: string;
}

export interface LeadInsertResponse {
  success: boolean;
  message: string;
  id?: string;
}

export interface LeadDbRow {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  business_name: string;
  email: string | null;
  gender: "male" | "female" | "other";
  phone: string;
  whatsapp: string | null;
  category: string | null;
  address: string | null;
  gbp_available: "yes" | "no" | "unsure";
  website_available: "yes" | "no";
  instagram: string | null;
  facebook: string | null;
  services_interested: string[];
  message: string | null;
  status: "new" | "contacted" | "converted" | "lost";
  source_ip?: string | null;
}

export interface CustomerDbRow {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string | null;
  full_name: string;
  business_name: string;
  email: string | null;
  phone: string;
  whatsapp: string | null;
  category: string | null;
  address: string | null;
  status: "active" | "inactive" | "churned";
  contract_value: number;
  notes: string | null;
}

export interface CrmNote {
  id: string;
  created_at: string;
  lead_id: string | null;
  customer_id: string | null;
  content: string;
  created_by: string | null;
}

export interface CrmTask {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string | null;
  customer_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
}

export interface CrmActivity {
  id: string;
  created_at: string;
  lead_id: string | null;
  customer_id: string | null;
  activity_type: string;
  description: string;
  created_by: string | null;
}

export interface CrmFile {
  id: string;
  created_at: string;
  lead_id: string | null;
  customer_id: string | null;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string | null;
  uploaded_by: string | null;
}


