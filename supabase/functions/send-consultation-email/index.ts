// Deno/TypeScript Supabase Edge Function to send email replies via Resend API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: {
    id: string;
    full_name: string;
    business_name: string;
    email: string | null;
    phone: string;
    services_interested: string[];
    created_at: string;
  };
  old_record: any;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable.");
    }

    const payload: WebhookPayload = await req.json();
    console.log("Received database webhook payload:", JSON.stringify(payload, null, 2));

    const { type, record } = payload;

    // We only send emails on INSERT triggers
    if (type !== "INSERT" || !record || !record.email) {
      console.log("No email to send (not an INSERT or missing email). Skipping.");
      return new Response(JSON.stringify({ success: true, message: "Skipped" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const { full_name, business_name, email, services_interested } = record;
    const servicesText = services_interested.length > 0 ? services_interested.join(", ") : "General Strategy Inquiry";

    // Resend Email API Request Body
    // NOTE: Free Resend accounts can only send from onboarding@resend.dev to verified emails.
    // Once domain is verified on Resend, change the "from" to your own sender address (e.g. consulting@logor.in).
    const emailBody = {
      from: "Logor Team <onboarding@resend.dev>",
      to: [email],
      subject: "Consultation Booked - Logor Digital Transformation",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Strategy Consultation Booked</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #0A0A0A;
              color: #E5E7EB;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: rgba(255, 255, 255, 0.02);
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }
            .header {
              padding: 40px 20px;
              text-align: center;
              background: linear-gradient(135deg, #111 0%, #000 100%);
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #FF6A00;
              letter-spacing: 2px;
            }
            .content {
              padding: 40px;
            }
            h1 {
              font-size: 22px;
              font-weight: 700;
              color: #FFFFFF;
              margin-top: 0;
              margin-bottom: 16px;
            }
            p {
              font-size: 14px;
              line-height: 1.6;
              color: #9CA3AF;
              margin-bottom: 24px;
            }
            .details-box {
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 30px;
            }
            .details-row {
              display: flex;
              margin-bottom: 12px;
              font-size: 13px;
            }
            .details-row:last-child {
              margin-bottom: 0;
            }
            .details-label {
              width: 120px;
              color: #6B7280;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 1px;
              margin-top: 2px;
            }
            .details-value {
              color: #E5E7EB;
              font-weight: 500;
              flex: 1;
            }
            .button {
              display: block;
              text-align: center;
              padding: 14px 24px;
              background-color: #FF6A00;
              color: #000000 !important;
              font-weight: 700;
              font-size: 14px;
              text-decoration: none;
              border-radius: 12px;
              transition: all 0.3s;
              margin-bottom: 30px;
            }
            .footer {
              padding: 24px;
              text-align: center;
              font-size: 11px;
              color: #4B5563;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              background-color: rgba(0, 0, 0, 0.2);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">LOGOR</div>
            </div>
            <div class="content">
              <h1>Consultation Registered!</h1>
              <p>Hi ${full_name},</p>
              <p>Thank you for booking your free digital strategy consultation with Logor. We are excited to partner with you to transform your business footprint.</p>
              
              <div class="details-box">
                <div class="details-row">
                  <div class="details-label">Business:</div>
                  <div class="details-value">${business_name}</div>
                </div>
                <div class="details-row">
                  <div class="details-label">Services:</div>
                  <div class="details-value">${servicesText}</div>
                </div>
              </div>

              <p>Our team is currently reviewing your application. In the meantime, you can access your customized client portal to track onboarding status, complete checklists, and download documentation.</p>

              <a href="https://logorbusiness.pages.dev/portal/" class="button">Access My Client Portal</a>

              <p>We will contact you via WhatsApp shortly to coordinate the strategy call.</p>
              <p>Best regards,<br>The Logor Team</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Logor. All rights reserved. Moolakulam, Puducherry.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailBody),
    });

    const resendJson = await resendRes.json();
    console.log("Resend API response:", JSON.stringify(resendJson));

    if (!resendRes.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(resendJson)}`);
    }

    return new Response(JSON.stringify({ success: true, data: resendJson }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
