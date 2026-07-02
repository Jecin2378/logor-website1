import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { LeadFormData, LeadInsertResponse } from "@/types/lead";

export async function POST(request: NextRequest): Promise<NextResponse<LeadInsertResponse>> {
  try {
    const body: LeadFormData = await request.json();

    // --- Server-side validation ---
    const errors: string[] = [];

    if (!body.fullName?.trim()) {
      errors.push("Full Name is required.");
    }
    if (!body.businessName?.trim()) {
      errors.push("Business Name is required.");
    }
    if (!body.phone?.trim()) {
      errors.push("Phone Number is required.");
    }

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push("Invalid email format.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors.join(" ") },
        { status: 400 }
      );
    }

    // --- Insert into Supabase ---
    const supabase = await createClient();

    // Capture client IP for fraud detection
    const sourceIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    const leadId = crypto.randomUUID();

    const { error } = await supabase
      .from("leads")
      .insert({
        id: leadId,
        full_name: body.fullName.trim(),
        business_name: body.businessName.trim(),
        email: body.email?.trim() || null,
        phone: body.phone.trim(),
        whatsapp: body.whatsapp?.trim() || null,
        gender: (body.gender || "Male").toLowerCase(),
        category: body.category?.trim() || null,
        address: body.address?.trim() || null,
        gbp_available: (body.gbpAvailable || "No").toLowerCase(),
        website_available: (body.websiteAvailable || "No").toLowerCase(),
        instagram: body.instagram?.trim() || null,
        facebook: body.facebook?.trim() || null,
        services_interested: body.servicesInterested || [],
        message: body.message?.trim() || null,
        source_ip: sourceIp,
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to save your inquiry. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your consultation has been booked successfully!",
        id: leadId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
