-- ================================================================
-- Logor Telegram Bot Sessions Table
-- Tracks state of public users interacting with the Telegram Assistant
-- ================================================================

CREATE TABLE IF NOT EXISTS public.bot_sessions (
  chat_id         VARCHAR(50)     PRIMARY KEY,
  state           VARCHAR(50)     DEFAULT 'idle' NOT NULL, -- 'idle', 'awaiting_support_message', 'awaiting_contact_details'
  last_active     TIMESTAMPTZ     DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bot_sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role (Edge functions and admin client) full access
DROP POLICY IF EXISTS "service_role_all_bot_sessions" ON public.bot_sessions;
CREATE POLICY "service_role_all_bot_sessions" ON public.bot_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);
