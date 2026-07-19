import { describe, it, expect } from "vitest";
import { getContactLabel } from "@/utils/crm";
import type { LeadDbRow, CustomerDbRow } from "@/types/lead";

const leads: LeadDbRow[] = [
  {
    id: "lead-1",
    created_at: "",
    updated_at: "",
    full_name: "Alice",
    business_name: "Alice Co",
    email: null,
    gender: "female",
    phone: "",
    whatsapp: null,
    category: null,
    address: null,
    gbp_available: "no",
    website_available: "no",
    instagram: null,
    facebook: null,
    services_interested: [],
    message: null,
    status: "new",
  },
];

const customers: CustomerDbRow[] = [
  {
    id: "cust-1",
    created_at: "",
    updated_at: "",
    lead_id: null,
    full_name: "Bob",
    business_name: "Bob Inc",
    email: null,
    phone: "",
    whatsapp: null,
    category: null,
    address: null,
    status: "active",
    contract_value: 0,
    notes: null,
  },
];

describe("getContactLabel", () => {
  it("returns a generic label when no taskId is provided", () => {
    expect(getContactLabel(null, "lead", leads, customers)).toBe("General CRM Task");
  });

  it("resolves a matched lead with its business name", () => {
    expect(getContactLabel("lead-1", "lead", leads, customers)).toBe("Alice (Alice Co)");
  });

  it("resolves a matched customer with the Client label", () => {
    expect(getContactLabel("cust-1", "customer", leads, customers)).toBe("Bob (Bob Inc)");
  });

  it("falls back to Unknown Lead when the id is not found among leads", () => {
    expect(getContactLabel("missing", "lead", leads, customers)).toBe("Unknown Lead");
  });

  it("falls back to Unknown Client when the id is not found among customers", () => {
    expect(getContactLabel("missing", "customer", leads, customers)).toBe("Unknown Client");
  });

  it("uses 'Lead' fallback when a lead has no business name", () => {
    const leadNoBiz = { ...leads[0], business_name: "" };
    expect(getContactLabel("lead-1", "lead", [leadNoBiz], customers)).toBe("Alice (Lead)");
  });
});
