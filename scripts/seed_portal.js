const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to avoid installing dotenv
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const envLocal = fs.readFileSync('.env.local', 'utf8');
    envLocal.split('\n').forEach(line => {
      // Remove comments and whitespace
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) return;
      
      const parts = trimmedLine.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
      }
    });
  } catch (err) {
    console.warn("Could not read .env.local:", err.message);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase URL or Service Role Key in environmental variables / .env.local.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  const email = "jecincode@gmail.com";
  console.log(`🔍 Checking database for existing records associated with: ${email}`);

  // Fetch existing leads
  const { data: existingLeads } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email);

  if (existingLeads && existingLeads.length > 0) {
    console.log("🧹 Found old mock lead records. Cleaning up old CRM entries...");
    for (const lead of existingLeads) {
      await supabase.from('crm_tasks').delete().eq('lead_id', lead.id);
      await supabase.from('crm_files').delete().eq('lead_id', lead.id);
      await supabase.from('crm_notes').delete().eq('lead_id', lead.id);
      await supabase.from('customers').delete().eq('lead_id', lead.id);
      await supabase.from('leads').delete().eq('id', lead.id);
    }
    console.log("✨ Cleanup complete.");
  }

  // 1. Create Lead Record
  console.log("🚀 Creating Lead Profile...");
  const { data: lead, error: leadErr } = await supabase
    .from('leads')
    .insert({
      full_name: "Jecin Wise",
      business_name: "OPS Solutions",
      email: email,
      phone: "+91 9944035730",
      whatsapp: "+91 7305313682",
      gender: "male",
      category: "Creative Agency",
      address: "Chennai, Tamil Nadu, India",
      gbp_available: "yes",
      website_available: "yes",
      services_interested: ["NFC Business Card", "Review Booster"],
      message: "Lead created via operations seed script for portal access.",
      status: "converted"
    })
    .select()
    .single();

  if (leadErr) {
    console.error("❌ Failed to create Lead Record:", leadErr.message);
    return;
  }
  console.log(`✅ Lead Record created successfully. ID: ${lead.id}`);

  // 2. Create Customer details (Active Partnership Status)
  console.log("🚀 Creating Customer Partnership Record...");
  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .insert({
      lead_id: lead.id,
      full_name: "Jecin Wise",
      business_name: "OPS Solutions",
      email: email,
      phone: "+91 9944035730",
      whatsapp: "+91 7305313682",
      category: "Creative Agency",
      address: "Chennai, Tamil Nadu, India",
      status: "active",
      contract_value: 4999,
      notes: "CRM seeded customer profile."
    })
    .select()
    .single();

  if (custErr) {
    console.error("❌ Failed to create Customer Record:", custErr.message);
  } else {
    console.log(`✅ Customer Record created successfully. ID: ${customer.id}`);
  }

  // 3. Create Tasks Checklist
  console.log("🚀 Seeding Onboarding Checklist Tasks...");
  const tasks = [
    {
      lead_id: lead.id,
      customer_id: null,
      title: "Submit Logo and Branding Details",
      description: "Send high-res PNG logo and business information to support.",
      status: "completed",
      priority: "high"
    },
    {
      lead_id: lead.id,
      customer_id: null,
      title: "OPS Card Finish Approval",
      description: "Review and approve the custom OPS design finish (Blue, Orange, White).",
      status: "pending",
      priority: "medium",
      due_date: new Date(Date.now() + 86400000 * 2).toISOString() // 2 days from now
    },
    {
      lead_id: lead.id,
      customer_id: null,
      title: "Activate Google Review Redirect Link",
      description: "Link your Google Business Profile URL for Review Booster setup.",
      status: "pending",
      priority: "medium",
      due_date: new Date(Date.now() + 86400000 * 5).toISOString()
    }
  ];

  const { error: tasksErr } = await supabase.from('crm_tasks').insert(tasks);
  if (tasksErr) {
    console.error("❌ Failed to create Checklist Tasks:", tasksErr.message);
  } else {
    console.log("✅ Onboarding Checklist Tasks seeded successfully.");
  }

  // 4. Create Latest Update Note
  console.log("🚀 Creating Latest Progress Update Note...");
  const { error: noteErr } = await supabase
    .from('crm_notes')
    .insert({
      lead_id: lead.id,
      customer_id: null,
      content: "Team initiated setup for NFC card customization. Design finish selected is OPS Card. Consultation scheduled for reviewing redirect target settings."
    });

  if (noteErr) {
    console.error("❌ Failed to seed Progress Note:", noteErr.message);
  } else {
    console.log("✅ Progress Note seeded successfully.");
  }

  console.log("\n🎉 Seeding complete! You can now log into the portal dashboard using: jecincode@gmail.com");
}

seed();
