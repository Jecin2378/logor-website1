-- ================================================================
-- Logor Leads Table — Professional Schema
-- Stores all contact form submissions from logor.in
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- 1. Extensions
-- ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA extensions;

-- ────────────────────────────────────────────────────────────────
-- 2. Custom ENUM types
-- ────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
    CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gbp_status') THEN
    CREATE TYPE public.gbp_status AS ENUM ('yes', 'no', 'unsure');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'website_status') THEN
    CREATE TYPE public.website_status AS ENUM ('yes', 'no');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
    CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'converted', 'lost');
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────────
-- 3. Leads table
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  -- Primary key & timestamps
  id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,
  updated_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,

  -- Section 1: Basic Business Details
  full_name       VARCHAR(150)    NOT NULL,
  business_name   VARCHAR(200)    NOT NULL,
  email           extensions.citext,
  gender          public.gender_type NOT NULL DEFAULT 'male',

  -- Section 2: Contact & Classification
  phone           VARCHAR(20)     NOT NULL,
  whatsapp        VARCHAR(20),
  category        VARCHAR(100),
  address         TEXT,

  -- Section 3: Current Digital Presence
  gbp_available       public.gbp_status     NOT NULL DEFAULT 'no',
  website_available   public.website_status  NOT NULL DEFAULT 'no',
  instagram           VARCHAR(300),
  facebook            VARCHAR(300),

  -- Section 4: Services Interested
  services_interested TEXT[]       NOT NULL DEFAULT '{}',

  -- Section 5: Message
  message         TEXT,

  -- Internal (not from form)
  status          public.lead_status NOT NULL DEFAULT 'new',
  source_ip       INET,

  -- Constraints
  CONSTRAINT chk_email_format
    CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

-- ────────────────────────────────────────────────────────────────
-- 4. Auto-update trigger for updated_at
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_leads_updated ON public.leads;
CREATE TRIGGER on_leads_updated
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────────
-- 5. Indexes
-- ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_created_at
  ON public.leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_status
  ON public.leads (status);

CREATE INDEX IF NOT EXISTS idx_leads_phone
  ON public.leads (phone);

CREATE INDEX IF NOT EXISTS idx_leads_email
  ON public.leads (email);

CREATE INDEX IF NOT EXISTS idx_leads_services
  ON public.leads USING GIN (services_interested);

-- ────────────────────────────────────────────────────────────────
-- 6. Row Level Security
-- ────────────────────────────────────────────────────────────────
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public form: anonymous users can INSERT only
DROP POLICY IF EXISTS "leads_anon_insert" ON public.leads;
CREATE POLICY "leads_anon_insert"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users (admin): full read access
DROP POLICY IF EXISTS "leads_auth_select" ON public.leads;
CREATE POLICY "leads_auth_select"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users (admin): can update lead status
DROP POLICY IF EXISTS "leads_auth_update" ON public.leads;
CREATE POLICY "leads_auth_update"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users (admin): can delete spam
DROP POLICY IF EXISTS "leads_auth_delete" ON public.leads;
CREATE POLICY "leads_auth_delete"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (true);
