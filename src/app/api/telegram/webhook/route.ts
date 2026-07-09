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

const visitorMenuText = `👋 *Welcome to the Logor Digital Assistant!*

We help local businesses in India establish a powerful digital presence within 24 hours.

Select an option below to get started:`;

const visitorMenuKeyboard = {
  inline_keyboard: [
    [
      { text: "📖 Read FAQs", callback_data: "visitor_faqs" },
      { text: "📞 Book Consultation", callback_data: "visitor_book" }
    ],
    [
      { text: "💬 Message Support", callback_data: "visitor_support" }
    ]
  ]
};

const faqs = [
  {
    q: "1. What is an NFC Business Card?",
    a: "NFC (Near Field Communication) business cards let you share your digital profile, contact details, maps, and review buttons instantly by tapping the card on any modern smartphone. No app required!"
  },
  {
    q: "2. Do my customers need an app?",
    a: "No! Your customers do not need to install any app. Tapping the NFC card or scanning the custom QR code opens your digital profile instantly in their default mobile browser."
  },
  {
    q: "3. How long does setup take?",
    a: "We configure your digital presence (Google profile optimization, custom landing page, digital profile, and QR codes) within 24 hours of receiving your business details. Physical NFC cards are shipped to your address in India."
  },
  {
    q: "4. Will QR codes work forever?",
    a: "Yes! The custom QR codes and NFC chips direct to your digital business profile, which stays active 24/7 online. There are no recurring subscription fees for basic listings."
  },
  {
    q: "5. How does the Review Booster work?",
    a: "When customers tap your card or scan your counter QR, a prominent 'Review Us on Google' button appears on their screen. Clicking it redirects them straight to your Google Review input page with the rating window already popped open, helping them leave a review in 5 seconds."
  },
  {
    q: "6. What is WhatsApp Integration?",
    a: "It places a one-tap chat button on your digital profile that launches WhatsApp directly, allowing customers to start messaging your business instantly without manually typing or saving your phone number."
  }
];

const faqMenuText = `📖 *Logor Frequently Asked Questions*

Select a question to view the answer:`;

const faqMenuKeyboard = {
  inline_keyboard: [
    [
      { text: "1. What is an NFC Card?", callback_data: "visitor_faq_0" },
      { text: "2. Do customers need an app?", callback_data: "visitor_faq_1" }
    ],
    [
      { text: "3. How long does setup take?", callback_data: "visitor_faq_2" },
      { text: "4. Will links work forever?", callback_data: "visitor_faq_3" }
    ],
    [
      { text: "5. How does Review Booster work?", callback_data: "visitor_faq_4" },
      { text: "6. What is WhatsApp Integration?", callback_data: "visitor_faq_5" }
    ],
    [
      { text: "🔙 Back to Main Menu", callback_data: "visitor_menu" }
    ]
  ]
};

const bookMenuText = `📞 *Book a Free Consultation*

Get started with your digital transformation today. Choose an option:`;

const bookMenuKeyboard = {
  inline_keyboard: [
    [
      { text: "🌐 Book via Website", url: "https://logorbusiness.pages.dev/#contact" }
    ],
    [
      { text: "✏️ Submit Details Here", callback_data: "visitor_leave_details" }
    ],
    [
      { text: "🔙 Back to Main Menu", callback_data: "visitor_menu" }
    ]
  ]
};

async function getBotSession(supabase: any, chatId: string) {
  const { data, error } = await supabase
    .from('bot_sessions')
    .select('*')
    .eq('chat_id', chatId)
    .single();

  if (error || !data) {
    const { data: newData, error: newError } = await supabase
      .from('bot_sessions')
      .insert({ chat_id: chatId, state: 'idle' })
      .select()
      .single();
    return newData || { chat_id: chatId, state: 'idle' };
  }
  return data;
}

async function updateBotSession(supabase: any, chatId: string, state: string) {
  await supabase
    .from('bot_sessions')
    .upsert({ chat_id: chatId, state: state, last_active: new Date().toISOString() });
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

      const isAdmin = TELEGRAM_ADMIN_CHAT_ID && userId === TELEGRAM_ADMIN_CHAT_ID;
      const text = message?.text || '';
      const messageId = message?.message_id;
      const chatId = message?.chat?.id;

      if (!isAdmin) {
        // Handle visitor callback queries
        await callTelegram('answerCallbackQuery', { callback_query_id: callbackQueryId });

        if (data === 'visitor_menu') {
          await updateBotSession(supabase, userId, 'idle');
          await callTelegram('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: visitorMenuText,
            parse_mode: 'Markdown',
            reply_markup: visitorMenuKeyboard
          });
        } else if (data === 'visitor_faqs') {
          await updateBotSession(supabase, userId, 'idle');
          await callTelegram('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: faqMenuText,
            parse_mode: 'Markdown',
            reply_markup: faqMenuKeyboard
          });
        } else if (data.startsWith('visitor_faq_')) {
          const index = parseInt(data.replace('visitor_faq_', ''), 10);
          const faq = faqs[index];
          if (faq) {
            await callTelegram('editMessageText', {
              chat_id: chatId,
              message_id: messageId,
              text: `❓ *${faq.q}*\n\n💡 ${faq.a}`,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [{ text: "🔙 Back to FAQs", callback_data: "visitor_faqs" }]
                ]
              }
            });
          }
        } else if (data === 'visitor_book') {
          await updateBotSession(supabase, userId, 'idle');
          await callTelegram('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: bookMenuText,
            parse_mode: 'Markdown',
            reply_markup: bookMenuKeyboard
          });
        } else if (data === 'visitor_leave_details') {
          await updateBotSession(supabase, userId, 'awaiting_contact_details');
          await callTelegram('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: `✏️ *Please submit your details:*\n\nType your details in the following format:\n\`Name, Business Name, Phone Number\`\n\nExample:\n\`Jecin Wise, Logor Solutions, +919944035730\``,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: "🔙 Cancel", callback_data: "visitor_menu" }]
              ]
            }
          });
        } else if (data === 'visitor_support') {
          await updateBotSession(supabase, userId, 'awaiting_support_message');
          await callTelegram('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: `💬 *Send a Message to Support:*\n\nType your message/question below and send it. It will be forwarded directly to our team, and we will reply to you right here in this chat!`,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: "🔙 Cancel", callback_data: "visitor_menu" }]
              ]
            }
          });
        }

        return NextResponse.json({ success: true });
      }

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

    // 3. Handle Messages
    if (payload.message) {
      const { text, from, reply_to_message } = payload.message;
      const userId = from.id.toString();
      const isAdmin = TELEGRAM_ADMIN_CHAT_ID && userId === TELEGRAM_ADMIN_CHAT_ID;

      if (isAdmin) {
        // Admin commands & message replies
        if (reply_to_message && reply_to_message.text && text) {
          const parentText = reply_to_message.text;

          // 3a. Admin replies to a Visitor support message
          const chatMatch = parentText.match(/(?:Chat ID):\s*(\d+)/i);
          if (chatMatch) {
            const visitorChatId = chatMatch[1];
            await callTelegram('sendMessage', {
              chat_id: visitorChatId,
              text: `💬 *Response from Logor Team:*\n\n${text}`,
              parse_mode: 'Markdown'
            });

            await callTelegram('sendMessage', {
              chat_id: from.id,
              text: '✅ *Reply delivered to visitor successfully!*',
              reply_to_message_id: payload.message.message_id,
              parse_mode: 'Markdown'
            });
            return NextResponse.json({ success: true });
          }

          // 3b. Admin replies to CRM lead (CRM Notes logging)
          const match = parentText.match(/(?:ID|Lead ID):\s*([a-f0-9-]{36})/i);
          if (match) {
            const leadId = match[1];

            const { data: customer } = await supabase
              .from('customers')
              .select('id')
              .eq('lead_id', leadId)
              .single();

            const noteData: any = { content: text };
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
      } else {
        // 3c. Visitor message handling (Non-admin)
        if (text) {
          const session = await getBotSession(supabase, userId);
          const isCommand = text.startsWith('/');

          if (isCommand) {
            await updateBotSession(supabase, userId, 'idle');
            await callTelegram('sendMessage', {
              chat_id: userId,
              text: visitorMenuText,
              parse_mode: 'Markdown',
              reply_markup: visitorMenuKeyboard
            });
          } else if (session.state === 'awaiting_contact_details') {
            const parts = text.split(',').map((p: string) => p.trim());
            if (parts.length >= 3) {
              const [fullName, businessName, phone] = parts;
              const { error: insertError } = await supabase
                .from('leads')
                .insert({
                  full_name: fullName,
                  business_name: businessName,
                  phone: phone,
                  message: 'Submitted via Telegram Assistant Bot',
                  services_interested: ['General Strategy Inquiry']
                });

              if (insertError) {
                console.error('Failed to save lead from Telegram:', insertError);
                await callTelegram('sendMessage', {
                  chat_id: userId,
                  text: '❌ *Failed to submit inquiry.* Please try again later or book directly on our website.',
                  parse_mode: 'Markdown'
                });
              } else {
                await updateBotSession(supabase, userId, 'idle');
                await callTelegram('sendMessage', {
                  chat_id: userId,
                  text: '🎉 *Consultation Booked successfully!*\n\nWe have registered your details and will contact you via WhatsApp shortly.',
                  parse_mode: 'Markdown'
                });
              }
            } else {
              await callTelegram('sendMessage', {
                chat_id: userId,
                text: '⚠️ *Invalid Format.*\n\nPlease type your details as: `Name, Business Name, Phone Number`\n\nExample:\n`Jecin Wise, Logor, +919944035730`',
                parse_mode: 'Markdown'
              });
            }
          } else if (session.state === 'awaiting_support_message') {
            if (TELEGRAM_ADMIN_CHAT_ID) {
              const usernameText = from.username ? `@${from.username}` : 'No username';
              const nameText = [from.first_name, from.last_name].filter(Boolean).join(' ');

              await callTelegram('sendMessage', {
                chat_id: TELEGRAM_ADMIN_CHAT_ID,
                text: `📥 **New Support Message from Visitor**\n\n` +
                      `👤 **Visitor**: ${nameText} (${usernameText})\n` +
                      `🆔 **Chat ID**: ${userId}\n\n` +
                      `💬 **Message**:\n${text}\n\n` +
                      `💡 _Reply directly to this message to answer the visitor._`,
                parse_mode: 'Markdown'
              });

              await updateBotSession(supabase, userId, 'idle');
              await callTelegram('sendMessage', {
                chat_id: userId,
                text: '✅ *Message delivered to the team!*\n\nWe will get back to you right here as soon as possible.',
                parse_mode: 'Markdown'
              });
            }
          } else {
            // Default menu greeting for any other text
            await updateBotSession(supabase, userId, 'idle');
            await callTelegram('sendMessage', {
              chat_id: userId,
              text: visitorMenuText,
              parse_mode: 'Markdown',
              reply_markup: visitorMenuKeyboard
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Telegram Webhook error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
