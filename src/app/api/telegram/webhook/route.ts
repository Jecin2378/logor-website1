import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// Helper to send messages or answer callbacks to Telegram API
async function callTelegram(method: string, body: any) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`Telegram API error on ${method}:`, await res.text());
    }
  } catch (error) {
    console.error(`Fetch error on Telegram ${method}:`, error);
  }
}

export async function POST(req: Request) {
  try {
    // 1. Verify webhook secret
    const url = new URL(req.url);
    const incomingSecret = url.searchParams.get('secret');

    if (!WEBHOOK_SECRET || incomingSecret !== WEBHOOK_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized secret token' }, { status: 401 });
    }

    const payload = await req.json();
    console.log('Telegram Webhook payload:', JSON.stringify(payload, null, 2));

    const supabase = createAdminClient();

    // 2. Handle Callback Queries (Inline Button Actions)
    if (payload.callback_query) {
      const { id: callbackQueryId, from, message, data } = payload.callback_query;
      const userId = from.id.toString();

      // Check if user is the authorized admin
      if (TELEGRAM_ADMIN_CHAT_ID && userId !== TELEGRAM_ADMIN_CHAT_ID) {
        await callTelegram('answerCallbackQuery', {
          callback_query_id: callbackQueryId,
          text: '❌ Unauthorized Chat ID',
          show_alert: true,
        });
        return NextResponse.json({ success: false, error: 'Unauthorized user ID' }, { status: 403 });
      }

      const text = message?.text || '';
      const messageId = message?.message_id;
      const chatId = message?.chat?.id;

      // Parse actions
      if (data.startsWith('convert_')) {
        const leadId = data.replace('convert_', '');

        // Fetch lead details
        const { data: lead, error: fetchError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', leadId)
          .single();

        if (fetchError || !lead) {
          await callTelegram('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text: '❌ Lead not found',
            show_alert: true,
          });
          return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
        }

        if (lead.status === 'converted') {
          await callTelegram('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text: 'ℹ️ Lead already converted',
          });
          return NextResponse.json({ success: true, message: 'Already converted' });
        }

        // Insert new customer entry
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            lead_id: lead.id,
            full_name: lead.full_name,
            business_name: lead.business_name,
            email: lead.email,
            phone: lead.phone,
            whatsapp: lead.whatsapp,
            category: lead.category,
            address: lead.address,
            status: 'active',
          });

        if (customerError) {
          console.error('Customer insert error:', customerError);
          await callTelegram('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text: '❌ Failed to create customer record',
            show_alert: true,
          });
          return NextResponse.json({ success: false, error: 'Customer creation failed' }, { status: 500 });
        }

        // Update lead status
        const { error: updateError } = await supabase
          .from('leads')
          .update({ status: 'converted' })
          .eq('id', leadId);

        if (updateError) {
          console.error('Lead update error:', updateError);
        }

        // Edit original message to reflect status change
        const updatedText = `${text}\n\n✅ **Lead Status**: Converted to Customer (Actioned via Telegram)`;
        await callTelegram('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: updatedText,
          parse_mode: 'Markdown',
        });

        await callTelegram('answerCallbackQuery', {
          callback_query_id: callbackQueryId,
          text: '🎉 Lead converted to customer successfully!',
        });
      } else if (data.startsWith('lost_')) {
        const leadId = data.replace('lost_', '');

        // Update lead status
        const { error: updateError } = await supabase
          .from('leads')
          .update({ status: 'lost' })
          .eq('id', leadId);

        if (updateError) {
          await callTelegram('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text: '❌ Failed to update lead status',
            show_alert: true,
          });
          return NextResponse.json({ success: false, error: 'Lead update failed' }, { status: 500 });
        }

        // Edit original message to reflect status change
        const updatedText = `${text}\n\n❌ **Lead Status**: Marked as Lost (Actioned via Telegram)`;
        await callTelegram('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: updatedText,
          parse_mode: 'Markdown',
        });

        await callTelegram('answerCallbackQuery', {
          callback_query_id: callbackQueryId,
          text: 'Marked as lost.',
        });
      }

      return NextResponse.json({ success: true });
    }

    // 3. Handle Message Replies (Notes logging)
    if (payload.message) {
      const { text, from, reply_to_message } = payload.message;
      const userId = from.id.toString();

      // Verify the user is the admin and it is a reply
      if (TELEGRAM_ADMIN_CHAT_ID && userId !== TELEGRAM_ADMIN_CHAT_ID) {
        return NextResponse.json({ success: false, error: 'Unauthorized user ID' }, { status: 403 });
      }

      if (reply_to_message && reply_to_message.text && text) {
        const parentText = reply_to_message.text;

        // Extract Lead ID using regex from the parent message
        const match = parentText.match(/(?:ID|Lead ID):\s*([a-f0-9-]{36})/i);
        if (match) {
          const leadId = match[1];

          // Check if customer exists for this lead to log note under either lead or customer
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('lead_id', leadId)
            .single();

          const noteData: any = {
            content: text,
          };

          if (customer) {
            noteData.customer_id = customer.id;
          } else {
            noteData.lead_id = leadId;
          }

          const { error: noteError } = await supabase
            .from('crm_notes')
            .insert(noteData);

          if (noteError) {
            console.error('Failed to log CRM note:', noteError);
            await callTelegram('sendMessage', {
              chat_id: from.id,
              text: `❌ Failed to log note: ${noteError.message}`,
              reply_to_message_id: payload.message.message_id,
            });
            return NextResponse.json({ success: false, error: noteError.message }, { status: 500 });
          }

          await callTelegram('sendMessage', {
            chat_id: from.id,
            text: '📝 Note successfully logged in CRM database.',
            reply_to_message_id: payload.message.message_id,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Telegram Webhook error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
