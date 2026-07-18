# Logor - Technical Knowledge Base

> **Project**: Logor Website & CRM  
> **Domain**: logorbusiness.pages.dev (Cloudflare Pages)  
> **Stack**: Next.js 16, React 19, Tailwind CSS v4, Supabase, Framer Motion  
> **Target Audience**: Indian local businesses seeking digital transformation  

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Cloudflare Pages (Static Export)       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Landing  │  │ Admin    │  │ Client   │  │ API    │ │
│  │ Page     │  │ Portal   │  │ Portal   │  │ Routes │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Components: Navbar, Hero, Services, Industries, │    │
│  │ Pricing, FAQ, ContactForm, Footer, Solutions,   │    │
│  │ WhatsAppWidget, AnimatedBackground, CursorGlow  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase Backend                       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Database │  │ Auth     │  │ Storage  │  │ Edge   │ │
│  │ (PG 17)  │  │ (Supabase│  │ (CRM     │  │ Funcs  │ │
│  │          │  │  Auth)   │  │  Files)  │  │        │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Tables: leads, customers, crm_notes, crm_tasks, │    │
│  │ crm_activities, crm_files, bot_sessions         │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│             External Integrations                         │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ Telegram Bot│  │ Resend Email │  │ WhatsApp       │ │
│  │ (CRM Alerts)│  │(Consultation │  │ Business Chat  │ │
│  │             │  │  Confirm)    │  │ (Manual)       │ │
│  └─────────────┘  └──────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Build Output**: `next build` produces a static `out/` directory.  
**Deployment Platform**: Cloudflare Pages (`npx wrangler pages deploy out/`).  
**Routing**: Client-side via Next.js static export + `trailingSlash: true`.

---

## 2. Database Schema (Supabase Postgres 17)

### 2.1 `leads` — Contact Form Submissions

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` |
| `updated_at` | TIMESTAMPTZ | NOT NULL, auto-update trigger |
| `full_name` | VARCHAR(150) | NOT NULL |
| `business_name` | VARCHAR(200) | NOT NULL |
| `email` | CITEXT | Optional, regex validated |
| `gender` | ENUM('male','female','other') | DEFAULT 'male' |
| `phone` | VARCHAR(20) | NOT NULL |
| `whatsapp` | VARCHAR(20) | Optional |
| `category` | VARCHAR(100) | Optional |
| `address` | TEXT | Optional |
| `gbp_available` | ENUM('yes','no','unsure') | DEFAULT 'no' |
| `website_available` | ENUM('yes','no') | DEFAULT 'no' |
| `instagram` | VARCHAR(300) | Optional |
| `facebook` | VARCHAR(300) | Optional |
| `services_interested` | TEXT[] | DEFAULT '{}' |
| `message` | TEXT | Optional |
| `status` | ENUM('new','contacted','converted','lost') | DEFAULT 'new' |
| `source_ip` | INET | Optional |

**Indexes**: `created_at DESC`, `status`, `phone`, `email`, GIN on `services_interested`.  
**RLS**: anon can INSERT; authenticated can SELECT/UPDATE/DELETE all.

### 2.2 `customers` — Converted Leads

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `lead_id` | UUID | FK → leads(id) ON DELETE SET NULL |
| `full_name` | VARCHAR(150) | NOT NULL |
| `business_name` | VARCHAR(200) | NOT NULL |
| `email` | CITEXT | Optional |
| `phone` | VARCHAR(20) | NOT NULL |
| `whatsapp` | VARCHAR(20) | Optional |
| `category` | VARCHAR(100) | Optional |
| `address` | TEXT | Optional |
| `status` | VARCHAR(50) | 'active','inactive','churned' |
| `contract_value` | NUMERIC(12,2) | DEFAULT 0.00 |
| `notes` | TEXT | Optional |

### 2.3 `crm_notes` — Internal Notes

Lead or customer scoped. `lead_id` XOR `customer_id` constraint.

### 2.4 `crm_tasks` — Follow-up Tasks

Lead or customer scoped. Includes `title`, `description`, `due_date`, `status` (pending/completed), `priority` (low/medium/high).

### 2.5 `crm_activities` — Audit History

Activity types: `status_change`, `note_added`, `task_created`, `task_completed`, `file_uploaded`, `converted`, `task_deleted`, `file_deleted`.

### 2.6 `crm_files` — Document Metadata

Linked to storage bucket `crm-files` (private, 50MB limit). Files stored at `/crm-files/{type}/{entityId}/{timestamp}_{sanitized_name}`.

### 2.7 `bot_sessions` — Telegram Bot State Machine

Tracks visitor state: `idle`, `awaiting_support_message`, `awaiting_contact_details`.

---

## 3. Environment Variables

### Next.js (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Auth & Admin
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
TELEGRAM_WEBHOOK_SECRET=logor_webhook_secret_2026
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
```

### Supabase Edge Function Secrets

```bash
# Set via: npx supabase secrets set KEY=VALUE --project-ref <ref>
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="Logor Team <consulting@logor.in>"
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
```

---

## 4. Authentication Architecture

- **Supabase Auth** (email/password) used for both Admin and Client Portal.
- **Admin Portal** path: `/admin/` → login → `/admin/dashboard/`.
- **Client Portal** path: `/portal/` → login/signup → `/portal/dashboard/`.
- **Middleware** (`middleware.ts`) refreshes Supabase session on every request.
- **SQL SECURITY DEFINER** for automated email trigger function (pg_net).

### Auth Flows

| Portal | Method | Redirect |
|--------|--------|----------|
| Admin | Email + Password sign-in | `/admin/dashboard/` |
| Client | Email + Password sign-up/sign-in | `/portal/dashboard/` |

---

## 5. Pages & Routes

| Path | Type | Description |
|------|------|-------------|
| `/` | Static + Client | Landing page (Hero, Services, Pricing, FAQ, Contact, etc.) |
| `/admin/` | Client | Admin login page |
| `/admin/dashboard/` | Client (Auth) | Full CRM dashboard (Overview, Leads, Customers, Tasks, Alerts) |
| `/portal/` | Client | Client portal login/signup |
| `/portal/dashboard/` | Client (Auth) | Client onboarding tracker, tasks, files |
| `/api/telegram/webhook/` | API Route | Telegram bot webhook handler |

---

## 6. Component Catalog

| Component | Type | Key Features |
|-----------|------|-------------|
| **AnimatedBackground** | Client | Background orbs, particle system, lightning SVG, mesh grid overlay |
| **CursorGlow** | Client | Mouse-following radial gradient, expands over interactive elements |
| **Navbar** | Client | Fixed header, scroll-aware glass style, mobile drawer |
| **Hero** | Client | 3D rotating NFC card customizer with 6 themes, business name/category inputs |
| **HowItWorks** | Client | 3-step process with animated cards |
| **Services** | Client | 12 service cards with modal detail view |
| **Solutions** | Client | Problems vs Outcomes comparison columns |
| **Industries** | Client | 12 industry tabs with use-case cards |
| **Pricing** | Client | Starter (₹999) / Business (₹1,999) plan comparison |
| **FAQ** | Client | Accordion with 6 questions, animated indicator bar |
| **ContactForm** | Client | Multi-section form, Supabase insert, success modal with WhatsApp confirm |
| **Footer** | Client | Links, contact info, Instagram follow, scroll-to-top |
| **WhatsAppWidget** | Client (Chatbot) | AI knowledge-base chat, inline booking flow, service selection |
| **CrmDetailView** | Client (Sliding Panel) | Details, Notes, Tasks, Files, Timeline tabs with CRUD |

---

## 7. CRM Workflows

### Lead Lifecycle

```
Form Submit (ContactForm) → leads (status: new)
    ↓
Admin reviews → updates status to "contacted"
    ↓
Admin converts to customer → creates customers record + logs activity
    ↓
Customer managed in CRM → tasks, files, notes, billing
```

### Conversion Process

1. Admin clicks "Convert" on a lead row
2. System creates customer record (copies data from lead)
3. Lead status updated to `converted`
4. Activity logged: `"Lead converted to active Customer"`
5. Optional: contract value set during conversion

### Telegram Bot Workflow

1. New lead inserted → Supabase Edge Function triggers
2. Edge Function sends Telegram notification to admin with inline buttons:
   - "Convert to Customer" → creates customer, updates lead
   - "Mark Lost" → updates lead status
   - "WhatsApp" link to contact lead
3. Admin can reply to notification to log CRM notes
4. Visitors can interact with bot for FAQs, booking, and support

---

## 8. Design System

### Colors
- **Primary (Orange)**: `#FF6A00`
- **Gold/Amber**: `#D5C625`, `#FFB200`
- **Background**: `#0A0A0A` (charcoal), `#050505` (deep), `#161616` (light)
- **Text**: `#F5F5F5` foreground, `#9CA3AF` muted

### CSS Architecture
- **Tailwind CSS v4** with custom `@theme` tokens
- **Glassmorphism system**: `.glass-panel`, `.glass-card`, `.glass-card-orange`, `.glass-navbar`, `.glass-input`
- **Glow effects**: `.orange-glow`, `.orange-glow-intense`
- **Text gradients**: `.orange-text-gradient`, `.luxury-text-gradient`
- **Animations**: `shimmer`, `float`, `pulseGlow`, `floatOrb1-4`, `particleDrift`, `lightning-flow`

### Component Patterns
- All UI components use `"use client"` directive (framer-motion, interactivity)
- Consistent glassmorphism card styles
- Orange (#FF6A00) accent throughout
- Backdrop filters for depth
- Framer Motion for animations, springs for interactive elements

---

## 9. Key Technical Decisions

### Static Export (Next.js `output: "export"`)
- No SSR/API routes at runtime — all API is via Supabase direct
- Images unoptimized (Cloudflare Pages limitation)
- Trailing slashes enabled
- Benefits: CDN-served, edge-cached, zero cold starts

### Supabase Direct Client Access
- Bypasses Next.js API layer for performance
- Browser client uses anon key with RLS for security
- Admin client uses service_role key (admin.ts)
- Edge Function sends async notifications via pg_net

### Framer Motion for Interactivity
- Used across all components for:
  - Scroll-triggered animations (`whileInView`)
  - Modal transitions (`AnimatePresence`)
  - 3D card rotation with spring physics
  - Micro-interactions (hover, tap)

---

## 10. Migrations (Chronological)

| File | Purpose |
|------|---------|
| `001_create_leads_table.sql` | Core leads table, ENUMs, indexes, RLS |
| `002_create_crm_tables.sql` | Customers, notes, tasks, activities, files, storage bucket |
| `003_create_email_trigger.sql` | pg_net webhook trigger + Edge Function binding |
| `004_create_bot_sessions.sql` | Telegram bot state tracking |
| `20260705100540_secure_rls_policies.sql` | (Empty — placeholder for future RLS hardening) |

---

## 11. Deployment Instructions

```bash
# 1. Build
npm run build

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy out/ --project-name=logor-website

# 3. Deploy Edge Function to Supabase
npx supabase functions deploy send-consultation-email --project-ref ytrfiteoqbxpwctkvfuj

# 4. Set Telegram webhook
# Visit in browser:
# https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://logorbusiness.pages.dev/api/telegram/webhook?secret=logor_webhook_secret_2026
```

---

## 12. Development Commands

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Static export build
npm run start      # Serve built static export
npm run lint       # ESLint with next/core-web-vitals + typescript
```

---

## 13. Known Issues & TODOs

| Severity | Issue | Location |
|----------|-------|----------|
| 🔴 High | Hardcoded Supabase anon key in migration `003_create_email_trigger.sql` | `supabase/migrations/003_create_email_trigger.sql` |
| 🔴 High | `admin/dashboard/page.tsx` is ~2000+ lines — needs refactoring | `src/app/admin/dashboard/page.tsx` |
| 🟡 Medium | No structured data (JSON-LD) for SEO | All pages |
| 🟡 Medium | No `sitemap.xml` or `robots.txt` for static export | Root |
| 🟡 Medium | No environment variable validation at startup | `next.config.ts` |
| 🟡 Medium | `CrmDetailView.tsx` still missing the last 30% of Tasks tab | `src/components/CrmDetailView.tsx` |
| 🟢 Low | No test infrastructure | Project root |
| 🟢 Low | No error boundaries on any page | All pages |
| 🟢 Low | No loading skeletons for data fetching | Dashboards |

---

## 14. Project Structure Reference

```
src/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin portal (login + dashboard)
│   ├── api/telegram/webhook/     # Telegram bot webhook
│   ├── portal/                   # Client portal (login + dashboard)
│   ├── globals.css               # Global styles + design system
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   └── page.tsx                  # Landing page composition
├── components/                   # All React components
├── types/                        # TypeScript type definitions
│   └── lead.ts                   # Lead, Customer, CrmNote, CrmTask, etc.
└── utils/
    └── supabase/                 # Supabase client utilities
        ├── admin.ts              # Service-role client
        ├── client.ts             # Browser client (anon key)
        └── server.ts             # Server client (cookie-based)

supabase/
├── config.toml                   # Supabase local dev config
├── functions/                    # Edge Functions
│   └── send-consultation-email/  # Resend email + Telegram alert
├── migrations/                   # Database migrations (7 files)
```

---

## 15. External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.2.9 | Framework (static export) |
| react / react-dom | 19.2.4 | UI library |
| @supabase/supabase-js | ^2.110.0 | Supabase database client |
| @supabase/ssr | ^0.12.0 | Supabase SSR helpers |
| framer-motion | ^12.42.2 | Animations |
| lucide-react | ^1.22.0 | Icon library |
| tailwindcss | ^4 | CSS framework |
| @tailwindcss/postcss | ^4 | PostCSS plugin for TW4 |
| typescript | ^5 | Type checking |
| eslint | ^9 | Linting |
