-- ================================================================
-- Logor CRM Tables — Schema Expansion
-- Adds Customers, Notes, Tasks, Activity History, and Files
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- 1. Customers Table
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.customers (
  id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,
  updated_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,
  
  lead_id         UUID            REFERENCES public.leads(id) ON DELETE SET NULL,
  
  -- Copied/expanded details from lead
  full_name       VARCHAR(150)    NOT NULL,
  business_name   VARCHAR(200)    NOT NULL,
  email           extensions.citext,
  phone           VARCHAR(20)     NOT NULL,
  whatsapp        VARCHAR(20),
  category        VARCHAR(100),
  address         TEXT,
  
  -- Customer specific states
  status          VARCHAR(50)     DEFAULT 'active' NOT NULL, -- 'active', 'inactive', 'churned'
  contract_value  NUMERIC(12,2)   DEFAULT 0.00 NOT NULL,
  notes           TEXT
);

-- Row Level Security (RLS) on Customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Admins (authenticated) have full access to customers
CREATE POLICY "crm_auth_customers_all" ON public.customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for updated_at on customers
DROP TRIGGER IF EXISTS on_customers_updated ON public.customers;
CREATE TRIGGER on_customers_updated
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────────
-- 2. CRM Notes Table
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_notes (
  id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,
  
  lead_id         UUID            REFERENCES public.leads(id) ON DELETE CASCADE,
  customer_id     UUID            REFERENCES public.customers(id) ON DELETE CASCADE,
  
  content         TEXT            NOT NULL,
  created_by      UUID            REFERENCES auth.users(id) ON DELETE SET NULL,
  
  CONSTRAINT check_note_target CHECK (
    (lead_id IS NOT NULL AND customer_id IS NULL) OR
    (lead_id IS NULL AND customer_id IS NOT NULL)
  )
);

ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_auth_notes_all" ON public.crm_notes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ────────────────────────────────────────────────────────────────
-- 3. CRM Tasks Table (Follow-ups & Todos)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,
  updated_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,
  
  lead_id         UUID            REFERENCES public.leads(id) ON DELETE CASCADE,
  customer_id     UUID            REFERENCES public.customers(id) ON DELETE CASCADE,
  
  title           VARCHAR(255)    NOT NULL,
  description     TEXT,
  due_date        TIMESTAMPTZ,
  status          VARCHAR(50)     DEFAULT 'pending' NOT NULL, -- 'pending', 'completed'
  priority        VARCHAR(20)     DEFAULT 'medium' NOT NULL,  -- 'low', 'medium', 'high'
  
  CONSTRAINT check_task_target CHECK (
    (lead_id IS NOT NULL AND customer_id IS NULL) OR
    (lead_id IS NULL AND customer_id IS NOT NULL)
  )
);

ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_auth_tasks_all" ON public.crm_tasks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS on_crm_tasks_updated ON public.crm_tasks;
CREATE TRIGGER on_crm_tasks_updated
  BEFORE UPDATE ON public.crm_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────────
-- 4. CRM Activities Table (Audit History Log)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_activities (
  id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,
  
  lead_id         UUID            REFERENCES public.leads(id) ON DELETE CASCADE,
  customer_id     UUID            REFERENCES public.customers(id) ON DELETE CASCADE,
  
  activity_type   VARCHAR(100)    NOT NULL, -- 'status_change', 'note_added', 'task_created', 'task_completed', 'file_uploaded', 'converted'
  description     TEXT            NOT NULL,
  created_by      UUID            REFERENCES auth.users(id) ON DELETE SET NULL,
  
  CONSTRAINT check_activity_target CHECK (
    (lead_id IS NOT NULL AND customer_id IS NULL) OR
    (lead_id IS NULL AND customer_id IS NOT NULL)
  )
);

ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_auth_activities_all" ON public.crm_activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ────────────────────────────────────────────────────────────────
-- 5. CRM Files Table (Tracks Uploaded Documents Metadata)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_files (
  id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ     DEFAULT now()            NOT NULL,
  
  lead_id         UUID            REFERENCES public.leads(id) ON DELETE CASCADE,
  customer_id     UUID            REFERENCES public.customers(id) ON DELETE CASCADE,
  
  file_name       VARCHAR(255)    NOT NULL,
  file_path       TEXT            NOT NULL, -- The relative path in the storage bucket
  file_size       INTEGER         NOT NULL, -- In bytes
  mime_type       VARCHAR(100),
  uploaded_by     UUID            REFERENCES auth.users(id) ON DELETE SET NULL,
  
  CONSTRAINT check_file_target CHECK (
    (lead_id IS NOT NULL AND customer_id IS NULL) OR
    (lead_id IS NULL AND customer_id IS NOT NULL)
  )
);

ALTER TABLE public.crm_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_auth_files_all" ON public.crm_files
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ────────────────────────────────────────────────────────────────
-- 6. Storage Bucket Configuration
-- ────────────────────────────────────────────────────────────────

-- Insert private storage bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'crm-files', 
  'crm-files', 
  false, 
  52428800, -- 50 MB limit
  NULL      -- Allow any file type
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies on storage.objects for 'crm-files' bucket
-- Authenticated admins get full CRUD access to storage items in this bucket
CREATE POLICY "crm_storage_admin_access"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'crm-files')
  WITH CHECK (bucket_id = 'crm-files');

-- ────────────────────────────────────────────────────────────────
-- 7. Database Indexes for Performance Optimization
-- ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_customers_lead_id ON public.customers (lead_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers (status);
CREATE INDEX IF NOT EXISTS idx_crm_notes_lead_id ON public.crm_notes (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_customer_id ON public.crm_notes (customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_lead_id ON public.crm_tasks (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_customer_id ON public.crm_tasks (customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_status ON public.crm_tasks (status);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON public.crm_tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON public.crm_activities (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_customer_id ON public.crm_activities (customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_files_lead_id ON public.crm_files (lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_files_customer_id ON public.crm_files (customer_id);
