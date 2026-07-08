# Logor Telegram Bot Integration Setup Guide

This guide walks you through the step-by-step process to configure, deploy, and activate the interactive Telegram Bot CRM integration for the Logor website.

---

## Step 1: Create Your Telegram Bot
1. Open Telegram and search for the official **@BotFather** bot.
2. Send the command `/newbot` to start the creation process.
3. Choose a name for your bot (e.g., `Logor CRM Bot`).
4. Choose a username for your bot ending in `bot` (e.g., `logor_crm_bot`).
5. BotFather will reply with your **HTTP API Token** (formatted like `12345678:ABCdefGhIJKlmNoPQRsTUVwxyZ`). Copy this token; it will be your `TELEGRAM_BOT_TOKEN`.
6. Open your bot's chat via the link provided by BotFather (e.g., `https://t.me/logor_crm_bot`) and click **Start** or send a message.

---

## Step 2: Get Your Admin Chat ID
The bot only accepts commands and sends notifications to the authorized administrator. You must configure your Telegram account ID as the admin.
1. In Telegram, search for **@userinfobot** (or any user ID info bot).
2. Start the bot. It will immediately reply with your unique profile details, including your **Id** (a sequence of numbers like `91975`).
3. Copy this number; it will be your `TELEGRAM_ADMIN_CHAT_ID`.

---

## Step 3: Configure Environment Variables

### 1. Next.js Website (.env.local)
Update your local `.env.local` or your production hosting provider dashboard (e.g., Vercel) with these variables:
```env
# Telegram Bot configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here
TELEGRAM_WEBHOOK_SECRET=logor_webhook_secret_2026
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username_without_at_symbol

# Supabase Service Role Key (Required to mutate database bypass RLS)
# Retrieve this from: Supabase Dashboard > Project Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
```

### 2. Supabase Edge Functions Secrets
You need to set the secrets inside your Supabase project so that the Edge Function trigger can communicate with Telegram.
Run this command using the Supabase npm tool:
```bash
npx supabase secrets set TELEGRAM_BOT_TOKEN=your_bot_token_here TELEGRAM_ADMIN_CHAT_ID=your_chat_id_here --project-ref ytrfiteoqbxpwctkvfuj
```
*(Alternatively, you can set them in the Supabase Dashboard under **Project Settings** > **Edge Runtime** > **Secrets**).*

---

## Step 4: Deploy the Webhook and Edge Function

### 1. Deploy the Website & Setup Webhook URL
Deploy the Next.js website (e.g., to Vercel). Once deployed, register the URL as Telegram's Webhook endpoint by sending a POST request to Telegram.

You can set the webhook by loading this URL in any web browser:
```text
https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<YOUR_DEPLOYED_WEBSITE_DOMAIN>/api/telegram/webhook?secret=logor_webhook_secret_2026
```
*Replace `<YOUR_TELEGRAM_BOT_TOKEN>` and `<YOUR_DEPLOYED_WEBSITE_DOMAIN>` with your values.*

### 2. Deploy the Supabase Edge Function
Run these commands to log in and deploy the Edge Function to your Supabase project:
```bash
# 1. Login to your Supabase account (follow browser prompt)
npx supabase login

# 2. Deploy the edge function directly using the project reference
npx supabase functions deploy send-consultation-email --project-ref ytrfiteoqbxpwctkvfuj
```

---

## Step 5: Verify the Integration
1. Go to your Logor website and submit a new lead through the **Book Free Consultation** contact form.
2. Verify that:
   * An email is triggered to the lead.
   * You receive a Telegram notification from your bot with the lead details.
3. In your Telegram chat, try:
   * Clicking **📞 Call Lead** or **💬 WhatsApp** inline buttons.
   * Clicking **✅ Convert to Customer** (verify the status changes on the card message, and a customer record is added to the Supabase database).
   * Replying to the notification message with a text note (verify the note is logged under **crm_notes** in your database).
