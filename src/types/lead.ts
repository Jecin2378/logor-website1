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
