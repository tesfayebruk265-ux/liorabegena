import dotenv from 'dotenv';
dotenv.config();

export interface TelegramVerificationRecord {
  registeredPhone: string;
  normalizedPhone: string;
  email?: string;
  code?: string;
  expiresAt?: number;
  matched: boolean;
  chatId?: number;
  telegramUsername?: string;
  createdAt: number;
}

export interface TelegramSharedContact {
  chatId: number;
  userId: number;
  firstName?: string;
  username?: string;
  phoneNumber: string;
  normalizedPhone: string;
  sharedAt: number;
}

// Normalize phone number to standard format without spaces, leading +, or local 0 prefixes
export function normalizePhone(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('251')) return digits;
  if (digits.startsWith('09') || digits.startsWith('07')) return '251' + digits.slice(1);
  if (digits.length === 9 && (digits.startsWith('9') || digits.startsWith('7'))) return '251' + digits;
  return digits;
}

import fs from 'fs';
import path from 'path';

// In-memory verification registry and shared contact store
const pendingVerifications = new Map<string, TelegramVerificationRecord>();
const sharedContacts = new Map<string, TelegramSharedContact>();

const CONTACTS_FILE = path.join(process.cwd(), 'server', 'telegramContacts.json');

function loadPersistedContacts() {
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
      Object.entries(data).forEach(([phone, contact]) => {
        sharedContacts.set(phone, contact as TelegramSharedContact);
      });
      console.log(`[TelegramBot] Loaded ${sharedContacts.size} persisted contact(s).`);
    }
  } catch (err) {
    console.warn('[TelegramBot] Could not read contacts file:', err);
  }
}

function persistContacts() {
  try {
    const obj: Record<string, any> = {};
    sharedContacts.forEach((val, key) => {
      obj[key] = val;
    });
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[TelegramBot] Could not save contacts file:', err);
  }
}

loadPersistedContacts();

let isPolling = false;
let pollAbortController: AbortController | null = null;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8928243199:AAHwcJVMg46ROcfs-Bd0-59uFou7gxMuTBo';
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || 'liorabegenabot';

function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send message via Telegram Bot API
 */
export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  options: {
    parse_mode?: 'HTML' | 'MarkdownV2';
    reply_markup?: any;
  } = { parse_mode: 'HTML' }
): Promise<any> {
  if (!BOT_TOKEN) {
    console.warn('[TelegramBot] No bot token configured.');
    return null;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options.parse_mode,
        reply_markup: options.reply_markup
      })
    });
    return await res.json();
  } catch (err) {
    console.error('[TelegramBot] Error sending message:', err);
    return null;
  }
}

/**
 * Register pending phone verification initiated from registration or login page
 */
export async function registerPendingVerification(phone: string, email?: string): Promise<{
  success: boolean;
  matched: boolean;
  code?: string;
  botUsername: string;
  sentToTelegram?: boolean;
}> {
  const norm = normalizePhone(phone);
  if (!norm) {
    return { success: false, matched: false, botUsername: BOT_USERNAME };
  }

  // Check if user has already shared their contact with the bot
  const existingShared = sharedContacts.get(norm);

  if (existingShared) {
    // Generate code and send it to their Telegram chat immediately
    const code = generate6DigitCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    pendingVerifications.set(norm, {
      registeredPhone: phone,
      normalizedPhone: norm,
      email,
      code,
      expiresAt,
      matched: true,
      chatId: existingShared.chatId,
      telegramUsername: existingShared.username,
      createdAt: Date.now()
    });

    await sendTelegramMessage(
      existingShared.chatId,
      `✅ <b>ማረጋገጫ ተሳክቷል! (Verification Successful!)</b>\n\n` +
      `የቴሌግራም ስልክ ቁጥርዎ በድረ-ገጹ ላይ ከተመዘገበው ጋር በትክክል ተዛምዷል።\n` +
      `<i>(Your Telegram phone number matches your registered phone number.)</i>\n\n` +
      `🔑 <b>የእርስዎ 6-ዲጂት የማረጋገጫ ኮድ:</b>\n` +
      `👉 <code>${code}</code>\n\n` +
      `⏱ ይህ ኮድ ለ 10 ደቂቃ ያገለግላል። ወደ ድህረ ገጹ በመመለስ ይህን ኮድ ያስገቡና አካውንትዎን ያረጋግጡ።\n` +
      `<i>(This code is valid for 10 minutes. Enter it on the website to verify your account.)</i>`
    );

    return {
      success: true,
      matched: true,
      code,
      botUsername: BOT_USERNAME,
      sentToTelegram: true
    };
  }

  // Otherwise, record as pending contact share
  pendingVerifications.set(norm, {
    registeredPhone: phone,
    normalizedPhone: norm,
    email,
    matched: false,
    createdAt: Date.now()
  });

  return {
    success: true,
    matched: false,
    botUsername: BOT_USERNAME
  };
}

/**
 * Match registered phone number against shared Telegram account phone
 */
export async function verifyTelegramMatch(
  registeredPhone: string,
  sharedPhone: string,
  email?: string
): Promise<{
  success: boolean;
  matched: boolean;
  code?: string;
  error?: string;
  sentToTelegram?: boolean;
}> {
  const normRegistered = normalizePhone(registeredPhone);
  const normShared = normalizePhone(sharedPhone);

  if (!normRegistered || !normShared) {
    return {
      success: false,
      matched: false,
      error: 'Please provide both registered and Telegram phone numbers.'
    };
  }

  // Strict matching check
  if (normRegistered !== normShared) {
    // If user has a chat ID registered with the shared phone, notify them in Telegram
    const sharedContact = sharedContacts.get(normShared);
    if (sharedContact) {
      await sendTelegramMessage(
        sharedContact.chatId,
        `❌ <b>ማረጋገጫ አልተሳካም (Verification Failed)</b>\n\n` +
        `ያጋሩት የቴሌግራም ስልክ ቁጥር (+${normShared}) በድረ-ገጻችን ላይ ካለው ምዝገባ (+${normRegistered}) ጋር አይዛመድም።\n\n` +
        `<i>(The shared Telegram phone number does not match your registered phone number.)</i>\n\n` +
        `እባክዎን በድረ-ገጹ ላይ የተመዘገቡበትን ትክክለኛ የቴሌግራም አካውንት ይጠቀሙ ወይም በድረ-ገጹ ላይ ስልክ ቁጥርዎን ያስተካክሉ።`
      );
    }

    return {
      success: false,
      matched: false,
      error: `Phone number mismatch! Shared Telegram number (${sharedPhone}) does not match your registered phone number (${registeredPhone}).`
    };
  }

  // Phone numbers match!
  const code = generate6DigitCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  let sharedContact = sharedContacts.get(normShared);
  if (!sharedContact) {
    loadPersistedContacts();
    sharedContact = sharedContacts.get(normShared);
  }

  let sentToTelegram = false;

  if (sharedContact) {
    sentToTelegram = true;
    await sendTelegramMessage(
      sharedContact.chatId,
      `✅ <b>ማረጋገጫ ተሳክቷል! (Verification Successful!)</b>\n\n` +
      `የቴሌግራም ስልክ ቁጥርዎ በድረ-ገጹ ላይ ከተመዘገበው ጋር በትክክል ተዛምዷል።\n\n` +
      `🔑 <b>የእርስዎ 6-ዲጂት የማረጋገጫ ኮድ:</b>\n` +
      `👉 <code>${code}</code>\n\n` +
      `⏱ ይህ ኮድ ለ 10 ደቂቃ ያገለግላል። ወደ ድህረ ገጹ በመመለስ ይህን ኮድ ያስገቡና ይግቡ።`
    );
  }

  pendingVerifications.set(normRegistered, {
    registeredPhone,
    normalizedPhone: normRegistered,
    email,
    code,
    expiresAt,
    matched: true,
    chatId: sharedContact?.chatId,
    telegramUsername: sharedContact?.username,
    createdAt: Date.now()
  });

  return {
    success: true,
    matched: true,
    code,
    sentToTelegram
  };
}

/**
 * Check current verification status for a phone number
 */
export function getVerificationStatus(phone: string): {
  matched: boolean;
  code?: string;
  expiresAt?: number;
  telegramUsername?: string;
} {
  const norm = normalizePhone(phone);
  const record = pendingVerifications.get(norm);
  if (!record || !record.matched) {
    return { matched: false };
  }
  return {
    matched: true,
    code: record.code,
    expiresAt: record.expiresAt,
    telegramUsername: record.telegramUsername
  };
}

/**
 * Handle incoming updates from Telegram (via polling or webhook)
 */
export async function handleTelegramUpdate(update: any) {
  if (!update || !update.message) return;
  const msg = update.message;
  const chatId = msg.chat?.id;
  const text = (msg.text || '').trim();

  // 1. Handle /start command
  if (text.startsWith('/start')) {
    const welcomeText =
      `👋 <b>ሰላም! እንኳን ወደ ሊዮራ በገና ት/ቤት ማረጋገጫ ቦት በደህና መጡ!</b>\n` +
      `<i>(Welcome to Liora Begena School Verification Bot!)</i>\n\n` +
      `ይህ ቦት አካውንትዎን በቴሌግራም በኩል ለማረጋገጥ እና 6-ዲጂት የማረጋገጫ ኮድ ለመቀበል ያገለግላል።\n\n` +
      `የተመዘገቡበት ስልክ ቁጥር እና የቴሌግራም አካውንትዎ መዛመዳቸውን ለማረጋገጥ እባክዎን ከታች ያለውን <b>'📱 ስልክ ቁጥሬን አጋራ (Share Contact)'</b> የሚለውን ቁልፍ ይጫኑ።\n\n` +
      `<i>Please tap the <b>'Share Contact'</b> button below so we can verify that your Telegram phone number matches your registered phone number.</i>`;

    const replyMarkup = {
      keyboard: [
        [
          {
            text: '📱 ስልክ ቁጥሬን አጋራ (Share Contact)',
            request_contact: true
          }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    };

    await sendTelegramMessage(chatId, welcomeText, {
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });
    return;
  }

  // 2. Handle Contact Sharing
  if (msg.contact && msg.contact.phone_number) {
    const sharedPhone = msg.contact.phone_number;
    const normShared = normalizePhone(sharedPhone);

    const contactData: TelegramSharedContact = {
      chatId,
      userId: msg.from?.id,
      firstName: msg.from?.first_name,
      username: msg.from?.username,
      phoneNumber: sharedPhone,
      normalizedPhone: normShared,
      sharedAt: Date.now()
    };

    sharedContacts.set(normShared, contactData);
    persistContacts();
    console.log(`[TelegramBot] Contact shared: ${sharedPhone} (norm: ${normShared}) by @${msg.from?.username || msg.from?.first_name}`);

    // Check if there is an active pending verification for this phone number
    const pending = pendingVerifications.get(normShared);

    if (pending) {
      // Numbers match!
      const code = generate6DigitCode();
      const expiresAt = Date.now() + 10 * 60 * 1000;

      pending.code = code;
      pending.expiresAt = expiresAt;
      pending.matched = true;
      pending.chatId = chatId;
      pending.telegramUsername = msg.from?.username;

      await sendTelegramMessage(
        chatId,
        `✅ <b>ማረጋገጫ ተሳክቷል! (Verification Successful!)</b>\n\n` +
        `ያጋሩት የቴሌግራም ስልክ ቁጥር (+${normShared}) በድረ-ገጹ ላይ ከተመዘገበው ጋር በትክክል ተዛምዷል።\n\n` +
        `🔑 <b>የእርስዎ 6-ዲጂት የማረጋገጫ ኮድ:</b>\n` +
        `👉 <code>${code}</code>\n\n` +
        `⏱ ይህ ኮድ ለ 10 ደቂቃ ያገለግላል። ወደ ሊዮራ በገና ድረ-ገጽ በመመለስ ይህን ኮድ ያስገቡና ይግቡ።\n` +
        `<i>(Enter this code on the website to complete your verification and sign in.)</i>`
      );
    } else {
      // Received contact, waiting for user on website
      await sendTelegramMessage(
        chatId,
        `📱 <b>ስልክ ቁጥርዎ በትክክል ተመዝግቧል!</b>\n\n` +
        `ስልክ ቁጥር: <b>+${normShared}</b>\n\n` +
        `አሁን በሊዮራ በገና ድረ-ገጽ ላይ 'Verify Account' የሚለውን ገጽ ይክፈቱ። ስልክ ቁጥራችሁ ሲዛመድ የማረጋገጫ ኮዱ እዚህ በቴሌግራም ይላክልዎታል።`
      );
    }
    return;
  }

  // 3. Fallback message for any other text
  if (text) {
    await sendTelegramMessage(
      chatId,
      `👋 ሰላም! አካውንትዎን ለማረጋገጥ እባክዎን ከታች ያለውን <b>'📱 ስልክ ቁጥሬን አጋራ (Share Contact)'</b> የሚለውን ቁልፍ ይጫኑ።\n` +
      `<i>(To verify your account, please tap the 'Share Contact' button below.)</i>`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: [
            [
              {
                text: '📱 ስልክ ቁጥሬን አጋራ (Share Contact)',
                request_contact: true
              }
            ]
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      }
    );
  }
}

/**
 * Start Long-Polling loop for Telegram Bot
 */
export async function startTelegramBot() {
  if (!BOT_TOKEN) {
    console.log('[TelegramBot] No TELEGRAM_BOT_TOKEN provided. Telegram Bot not started.');
    return;
  }

  if (isPolling) {
    console.log('[TelegramBot] Telegram Bot is already polling.');
    return;
  }

  isPolling = true;
  pollAbortController = new AbortController();
  console.log(`[TelegramBot] Starting Telegram Bot polling for @${BOT_USERNAME}...`);

  let offset = 0;

  // Background polling loop
  (async () => {
    while (isPolling) {
      try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=20`;
        const res = await fetch(url, { signal: pollAbortController?.signal });
        
        if (!res.ok) {
          console.warn(`[TelegramBot] getUpdates failed: ${res.statusText}`);
          await new Promise((r) => setTimeout(r, 4000));
          continue;
        }

        const data: any = await res.json();
        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            offset = update.update_id + 1;
            await handleTelegramUpdate(update);
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') break;
        // Network or timeout glitch - wait 3 seconds before reconnecting
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  })();
}

export function stopTelegramBot() {
  isPolling = false;
  if (pollAbortController) {
    pollAbortController.abort();
    pollAbortController = null;
  }
}

// Automatically start polling if executed directly
if (process.argv[1] && (process.argv[1].endsWith('telegramBot.ts') || process.argv[1].endsWith('telegramBot.js'))) {
  console.log('[TelegramBot] Running directly as standalone service...');
  startTelegramBot().catch((err) => console.error('[TelegramBot] Fatal error:', err));
}
