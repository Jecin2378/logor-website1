-- ================================================================
-- Logor CRM Email Webhook Trigger
-- Sets up database triggers to automatically invoke our Resend Edge Function
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- 1. Ensure pg_net Extension is Enabled
-- ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ────────────────────────────────────────────────────────────────
-- 2. Create Webhook Trigger Function
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.tr_send_consultation_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Perform an asynchronous HTTP POST to our Supabase Edge Function
  -- pg_net runs this in the background, ensuring no latency on the form submission
  PERFORM
    net.http_post(
      url := 'https://ytrfiteoqbxpwctkvfuj.supabase.co/functions/v1/send-consultation-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        -- IMPORTANT: Replace with your Supabase anon key from project settings
        -- For production: Get this from your Supabase dashboard > Settings > API
        -- This key is safe to expose client-side (RLS protects the database)
        'apikey', 'sb_publishable_2Q40n8GiQ0jw_sa5GO9UaA_OO2iMwQM'
      ),
      body := jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW)::jsonb
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ────────────────────────────────────────────────────────────────
-- 3. Bind Trigger to public.leads Table
-- ────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_lead_inserted_send_email ON public.leads;
CREATE TRIGGER on_lead_inserted_send_email
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.tr_send_consultation_email();
