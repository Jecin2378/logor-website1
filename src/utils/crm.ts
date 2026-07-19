import type { LeadDbRow, CustomerDbRow } from "@/types/lead";

/**
 * Get a human-readable contact label for a task or activity
 */
export function getContactLabel(
  taskId: string | null,
  type: "lead" | "customer",
  leads: LeadDbRow[],
  customers: CustomerDbRow[]
): string {
  if (!taskId) return "General CRM Task";
  if (type === "lead") {
    const match = leads.find((l) => l.id === taskId);
    return match ? `${match.full_name} (${match.business_name || "Lead"})` : "Unknown Lead";
  }
  const match = customers.find((c) => c.id === taskId);
  return match ? `${match.full_name} (${match.business_name || "Client"})` : "Unknown Client";
}
