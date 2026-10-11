import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";
import {
  handleTelegramIncomingMessage,
  handleTelegramCallbackQuery,
  botStorage,
  BotResponse,
} from './src/services/botEngine';
import { TelegramUser, TelegramUpdate, BotLog } from './src/types/telegram';
import {
  fetchRealCardInfo,
  fetchRealCurrencyRates,
  fetchRealCoronaStats,
  generateRealTempMail,
  checkRealTempMailInbox,
  getRealMTProtoProxies,
  getRealVakSmsCatalog,
  fetchWebProxyUrl,
  VIRTUAL_NUMBER_COUNTRIES,
  VIRTUAL_NUMBER_SERVICES,
  activeVirtualOrders,
  orderVirtualPhoneNumber,
  fetchYouTubeVideoDetails,
  searchMusicDatabase,
  fetchDetailedArzyRates,
  createAploUpload,
  aploStoredFilesList,
  fetchTikTokVideoDetails,
  fetchUniversalDownload,
  UNIVERSAL_DOWNLOAD_PRESETS,
} from './src/services/realApis';
import {
  MafiaEngine,
  MAFIA_ROLES_CATALOG,
  activeMafiaGames,
} from './src/services/mafiaEngine';
import { platformStore } from './src/services/platformStore';
import { ALL_MAFIA_ROLES } from './src/types/mafiaPlatform';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Global Real Bot Poller State
interface RealBotRunner {
  token: string;
  botInfo: TelegramUser | null;
  isPolling: boolean;
  abortController: AbortController | null;
  logs: BotLog[];
}

const realBotRunner: RealBotRunner = {
  token: '',
  botInfo: null,
  isPolling: false,
  abortController: null,
  logs: [],
};

function addLog(type: BotLog['type'], content: string, raw?: any) {
  const log: BotLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toLocaleTimeString('fa-IR'),
    type,
    content,
    raw,
  };
  realBotRunner.logs.unshift(log);
  if (realBotRunner.logs.length > 80) {
    realBotRunner.logs.pop();
  }
}

// Telegram API Helper to send message back to real Telegram
async function sendTelegramMessage(token: string, response: BotResponse) {
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload: any = {
      chat_id: response.chatId,
      text: response.text,
      parse_mode: 'Markdown',
    };
    if (response.reply_markup) {
      payload.reply_markup = response.reply_markup;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.ok) {
      addLog('outgoing', `پاسخ به چت ${response.chatId} ارسال شد: ${response.text.slice(0, 40)}...`, payload);
    } else {
      addLog('error', `خطا در ارسال به تلگرام: ${data.description || 'نامشخص'}`, data);
    }
  } catch (err: any) {
    addLog('error', `خطای شبکه تلگرام: ${err?.message || err}`);
  }
}

// Telegram API Helper to answer callback query
async function answerTelegramCallback(token: string, callbackQueryId: string, text?: string) {
  try {
    const url = `https://api.telegram.org/bot${token}/answerCallbackQuery`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || 'درخواست انجام شد',
      }),
    });
  } catch (err) {
    // Ignore callback answer errors
  }
}

// Long Polling Runner
async function startLongPolling(token: string) {
  if (realBotRunner.isPolling) return;
  realBotRunner.isPolling = true;
  realBotRunner.abortController = new AbortController();

  addLog('system', `حلقه دریافت آپدیت‌ها (Long Polling) برای ربات ${realBotRunner.botInfo?.username || ''} آغاز شد.`);

  let offset = 0;

  // Run in background
  (async () => {
    while (realBotRunner.isPolling) {
      try {
        const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=20`;
        const res = await fetch(url, { signal: realBotRunner.abortController?.signal });
        const data = await res.json();

        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result as TelegramUpdate[]) {
            offset = update.update_id + 1;

            if (update.message) {
              const msg = update.message;
              const sender = msg.from || { id: msg.chat.id, first_name: 'کاربر' };
              addLog('incoming', `پیام از @${sender.username || sender.first_name}: ${msg.text || '[بدون متن]'}`, update);

              const responses = await handleTelegramIncomingMessage(sender, msg.chat.id, msg.text || '');
              for (const resp of responses) {
                await sendTelegramMessage(token, resp);
              }
            } else if (update.callback_query) {
              const cb = update.callback_query;
              addLog('callback', `کلیک دکمه از @${cb.from.username || cb.from.first_name}: ${cb.data}`, update);
              await answerTelegramCallback(token, cb.id);

              const responses = await handleTelegramCallbackQuery(cb);
              for (const resp of responses) {
                await sendTelegramMessage(token, resp);
              }
            }
          }
        } else if (!data.ok) {
          addLog('error', `پاسخ ناموفق از سرور تلگرام: ${data.description}`);
          await new Promise((r) => setTimeout(r, 4000));
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          break;
        }
        addLog('error', `خطا در دریافت آپدیت: ${err?.message || err}`);
        await new Promise((r) => setTimeout(r, 4000));
      }
    }
  })();
}

function stopLongPolling() {
  realBotRunner.isPolling = false;
  if (realBotRunner.abortController) {
    realBotRunner.abortController.abort();
    realBotRunner.abortController = null;
  }
  addLog('system', 'حلقه دریافت آپدیت‌های تلگرام متوقف شد.');
}

// Real APIs Endpoints (from project files)
app.get('/api/real/currency', async (_req, res) => {
  try {
    const data = await fetchRealCurrencyRates();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.post('/api/real/card', async (req, res) => {
  try {
    const { cardNumber } = req.body;
    const data = await fetchRealCardInfo(cardNumber || '');
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.get('/api/real/corona', async (_req, res) => {
  try {
    const data = await fetchRealCoronaStats();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.get('/api/real/tempmail', async (_req, res) => {
  try {
    const data = await generateRealTempMail();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.get('/api/real/tempmail/inbox', async (req, res) => {
  try {
    const login = String(req.query.login || '');
    const domain = String(req.query.domain || '');
    const data = await checkRealTempMailInbox(login, domain);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
});

app.get('/api/real/proxies', (_req, res) => {
  res.json(getRealMTProtoProxies());
});

app.get('/api/real/vaksms', (_req, res) => {
  res.json(getRealVakSmsCatalog());
});

// Gemini Live Web Data via Google Search Grounding
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.post('/api/tools/live-web-data', async (req, res) => {
  try {
    const { query } = req.body;
    const prompt = query || "آخرین نرخ لحظه‌ای ارز، طلا، سکه و رمزارزها در بازار تهران و وضعیت سرویس‌های آنلاین مهم امروز را به همراه تحلیل کوتاه و منابع جستجوی گوگل گزارش دهید.";

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      tools: [{ googleSearch: {} }],
    } as any);

    res.json({
      success: true,
      result: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata || null,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'خطا در دریافت اطلاعات زنده وب' });
  }
});

// 1. Web Proxy Endpoint (سورس فیلتر شکن سایت.zip)
app.get('/api/proxy/fetch', async (req, res) => {
  try {
    const targetUrl = String(req.query.url || '');
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const result = await fetchWebProxyUrl(targetUrl);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Proxy request failed' });
  }
});

// 2. Virtual Numbers Endpoints (سورس فروشگاه شماره مجازی.zip)
app.get('/api/vaksms/catalog', (_req, res) => {
  res.json({
    countries: VIRTUAL_NUMBER_COUNTRIES,
    services: VIRTUAL_NUMBER_SERVICES,
  });
});

app.post('/api/vaksms/order', (req, res) => {
  const { country, service, userId } = req.body;
  const order = orderVirtualPhoneNumber(country || 'ru', service || 'tg', Number(userId) || 12345678);
  res.json(order);
});

app.get('/api/vaksms/orders', (req, res) => {
  const userId = Number(req.query.userId) || 12345678;
  res.json(activeVirtualOrders.filter((o) => o.userId === userId));
});

app.post('/api/vaksms/cancel', (req, res) => {
  const { orderId } = req.body;
  const order = activeVirtualOrders.find((o) => o.id === orderId);
  if (order && order.status === 'waiting_sms') {
    order.status = 'cancelled';
    return res.json({ success: true, order });
  }
  res.status(400).json({ error: 'Order cannot be cancelled' });
});

// 3. YouTube Downloader Endpoint (سورس ربات دانلودر Youtube.zip)
app.post('/api/youtube/info', (req, res) => {
  const { url } = req.body;
  const details = fetchYouTubeVideoDetails(url || '');
  res.json(details);
});

// 4. Music Search Endpoint (سورس ربات جست و جوی اهنگ.zip / ملوبات)
app.get('/api/music/search', (req, res) => {
  const q = String(req.query.q || '');
  const tracks = searchMusicDatabase(q);
  res.json(tracks);
});

// 5. Arzy Real-time Rates (arzy.php)
app.get('/api/arzy/detailed', (_req, res) => {
  res.json(fetchDetailedArzyRates());
});

// 6. Aplo File Upload Endpoints (aplo.zip)
app.post('/api/aplo/upload', (req, res) => {
  const { name, size, type, expiryDays, password } = req.body;
  const file = createAploUpload(
    { name: name || 'file.dat', size: Number(size) || 1024, type: type || 'application/octet-stream' },
    Number(expiryDays) || 7,
    password
  );
  res.json(file);
});

app.get('/api/aplo/files', (_req, res) => {
  res.json(aploStoredFilesList);
});

// 7. TikTok Downloader Endpoint (سورس ربات جستجوگر تیک.zip)
app.post('/api/tiktok/info', (req, res) => {
  const { url } = req.body;
  const details = fetchTikTokVideoDetails(url || 'https://www.tiktok.com/@example/video/123456');
  res.json(details);
});

// 8. Universal Mega Downloader Endpoint (اینستاگرام، یوتیوب، تیک‌تاک، پینترست، توییتر X، اسپاتیفای، آپارات، فایل مستقیم)
app.post('/api/downloader/analyze', (req, res) => {
  const { url } = req.body;
  const result = fetchUniversalDownload(url || '');
  res.json(result);
});

app.get('/api/downloader/presets', (_req, res) => {
  res.json(UNIVERSAL_DOWNLOAD_PRESETS);
});


// Mafia Engine Endpoints (Faithful to `beta ( mafia )`)
app.get('/api/mafia/state', (req, res) => {
  const chatId = Number(req.query.chatId) || 12345678;
  const game = activeMafiaGames.get(chatId) || null;
  res.json({ game, catalog: MAFIA_ROLES_CATALOG });
});

app.post('/api/mafia/start', (req, res) => {
  const { chatId, mode } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const targetMode = mode === 12 ? 12 : 9;
  MafiaEngine.createLobby(targetChatId, targetMode, { id: 12345678, first_name: 'شما (کاربر)' });
  const game = MafiaEngine.fillWithSimulatedPlayers(targetChatId);
  res.json({ game, catalog: MAFIA_ROLES_CATALOG });
});

app.post('/api/mafia/action', (req, res) => {
  const { chatId, actorId, action, targetSeatNumber } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const result = MafiaEngine.performNightAction(targetChatId, Number(actorId), action, Number(targetSeatNumber));
  res.json({ result, game: activeMafiaGames.get(targetChatId) });
});

app.post('/api/mafia/advance-day', (req, res) => {
  const { chatId } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const result = MafiaEngine.endNightAndStartDay(targetChatId);
  res.json(result);
});

app.post('/api/mafia/vote', (req, res) => {
  const { chatId, voterId, targetSeatNumber } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const game = MafiaEngine.voteForPlayer(targetChatId, Number(voterId), Number(targetSeatNumber));
  res.json({ game });
});

app.post('/api/mafia/trial', (req, res) => {
  const { chatId, candidateSeatNumber } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const game = MafiaEngine.startTrial(targetChatId, Number(candidateSeatNumber));
  res.json({ game });
});

app.post('/api/mafia/trial-verdict', (req, res) => {
  const { chatId, shouldExecute } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const result = MafiaEngine.executeTrialVerdict(targetChatId, !!shouldExecute);
  res.json(result);
});

// Mafia Chat & Voice Call Endpoints
app.post('/api/mafia/chat/send', (req, res) => {
  const { chatId, senderSeat, text, isVoiceNote, voiceDurationSec } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const message = MafiaEngine.sendChatMessage(
    targetChatId,
    Number(senderSeat) || 1,
    String(text || ''),
    !!isVoiceNote,
    voiceDurationSec ? Number(voiceDurationSec) : undefined
  );
  res.json({ message, game: activeMafiaGames.get(targetChatId) });
});

app.post('/api/mafia/chat/bot-speech', (req, res) => {
  const { chatId } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const speeches = MafiaEngine.simulateBotSpeeches(targetChatId);
  res.json({ speeches, game: activeMafiaGames.get(targetChatId) });
});

app.post('/api/mafia/voice/toggle', (req, res) => {
  const { chatId, start } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const voiceCall = MafiaEngine.toggleVoiceCall(targetChatId, !!start);
  res.json({ voiceCall, game: activeMafiaGames.get(targetChatId) });
});

app.post('/api/mafia/voice/speaker', (req, res) => {
  const { chatId, seatNumber } = req.body;
  const targetChatId = Number(chatId) || 12345678;
  const voiceCall = MafiaEngine.setVoiceSpeaker(targetChatId, Number(seatNumber));
  res.json({ voiceCall, game: activeMafiaGames.get(targetChatId) });
});

// ==========================================
// MAFIA ONLINE PLATFORM MULTIPLAYER & ECONOMY ENDPOINTS
// ==========================================

// Get user profile
app.get('/api/platform/user', (req, res) => {
  const userId = String(req.query.userId || 'usr_me');
  const user = platformStore.getUser(userId) || platformStore.getUser('usr_me');
  res.json({ user });
});

// Update profile / avatar
app.post('/api/platform/user/update', (req, res) => {
  const { userId, displayName, avatarEmoji } = req.body;
  const updated = platformStore.updateProfile(userId || 'usr_me', { displayName, avatarEmoji });
  res.json({ user: updated });
});

// Get all roles in market
app.get('/api/platform/roles', (_req, res) => {
  res.json({ roles: ALL_MAFIA_ROLES });
});

// Purchase role with Coins / Diamonds / Points
app.post('/api/platform/roles/purchase', (req, res) => {
  const { userId, roleId, currencyType } = req.body;
  const result = platformStore.purchaseRole(userId || 'usr_me', roleId, currencyType || 'coins');
  res.json(result);
});

// List rooms
app.get('/api/platform/rooms', (_req, res) => {
  const roomList = Array.from(platformStore.rooms.values());
  res.json({ rooms: roomList });
});

// Create room
app.post('/api/platform/rooms/create', (req, res) => {
  const { hostUserId, name, scenario, isPrivate, passcode } = req.body;
  const room = platformStore.createRoom(
    hostUserId || 'usr_me',
    name,
    scenario === 12 ? 12 : 9,
    !!isPrivate,
    passcode
  );
  res.json({ room });
});

// Join room
app.post('/api/platform/rooms/join', (req, res) => {
  const { roomId, userId, passcode } = req.body;
  const result = platformStore.joinRoom(roomId, userId || 'usr_me', passcode);
  res.json(result);
});

// Add smart AI bot to room
app.post('/api/platform/rooms/add-bot', (req, res) => {
  const { roomId, personality } = req.body;
  const result = platformStore.addAIBot(roomId, personality || 'analyst');
  res.json(result);
});

// Instant fill with bots & start match
app.post('/api/platform/rooms/fill-bots-and-start', (req, res) => {
  const { roomId } = req.body;
  const room = platformStore.fillRoomWithBots(roomId);
  res.json({ room });
});

// WebRTC Signalling Exchange
interface WebRtcSignal {
  senderId: string;
  senderSeat: number;
  type: 'offer' | 'answer' | 'candidate';
  payload: any;
}
const roomSignallingMap: Map<string, WebRtcSignal[]> = new Map();

app.post('/api/platform/webrtc/signal', (req, res) => {
  const { roomId, senderId, senderSeat, type, payload } = req.body;
  if (!roomSignallingMap.has(roomId)) {
    roomSignallingMap.set(roomId, []);
  }
  const signals = roomSignallingMap.get(roomId)!;
  signals.push({ senderId, senderSeat, type, payload });
  if (signals.length > 50) signals.shift();
  res.json({ success: true, totalSignals: signals.length });
});

app.get('/api/platform/webrtc/signals', (req, res) => {
  const roomId = String(req.query.roomId || '');
  const signals = roomSignallingMap.get(roomId) || [];
  res.json({ signals });
});

// Transaction History
app.get('/api/platform/transactions', (req, res) => {
  const userId = String(req.query.userId || 'usr_me');
  const userTxs = platformStore.transactions.filter((t) => t.userId === userId);
  res.json({ transactions: userTxs });
});

// Bot Dispatch Route
app.post('/api/bot/dispatch', async (req, res) => {
  const { type, user, chatId, text, callbackData, message } = req.body;
  const defaultUser: TelegramUser = user || {
    id: 12345678,
    first_name: 'کاربر تستی',
    username: 'test_user',
  };
  const targetChatId = chatId || defaultUser.id;

  if (type === 'callback') {
    const cbQuery = {
      id: 'cb_' + Date.now(),
      from: defaultUser,
      data: callbackData,
      message,
    };
    addLog('callback', `شبیه‌ساز وب: کلیک روی ${callbackData}`);
    const responses = await handleTelegramCallbackQuery(cbQuery);
    return res.json({ responses, wallet: botStorage.getWallet(defaultUser.id) });
  } else {
    addLog('incoming', `شبیه‌ساز وب: ${text || ''}`);
    const responses = await handleTelegramIncomingMessage(defaultUser, targetChatId, text || '');
    return res.json({ responses, wallet: botStorage.getWallet(defaultUser.id) });
  }
});

app.get('/api/bot/state', (req, res) => {
  const userId = Number(req.query.userId) || 12345678;
  const wallet = botStorage.getWallet(userId);
  const clash = botStorage.getClashVillage(userId, 'فرمانده');
  const session = botStorage.getFinderSession(userId);
  const mafia = botStorage.mafiaGames.get(userId);

  res.json({
    wallet,
    clash,
    finder: session,
    mafia: mafia || null,
    ordersCount: botStorage.seenOrders.length,
    recentOrders: botStorage.seenOrders.slice(-5),
  });
});

app.post('/api/bot/token/connect', async (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ ok: false, error: 'توکن نامعتبر است.' });
  }

  const cleanToken = token.trim();

  try {
    addLog('system', 'در حال اعتبارسنجی توکن با سرور رسمی تلگرام...');
    const getMeRes = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`);
    const data = await getMeRes.json();

    if (!data.ok || !data.result) {
      addLog('error', `توکن نامعتبر است: ${data.description || 'پاسخ ناموفق'}`);
      return res.status(400).json({ ok: false, error: data.description || 'توکن نامعتبر است.' });
    }

    // Stop previous if active
    if (realBotRunner.isPolling) {
      stopLongPolling();
    }

    realBotRunner.token = cleanToken;
    realBotRunner.botInfo = data.result;
    addLog('system', `اتصال با ربات @${data.result.username} (${data.result.first_name}) با موفقیت برقرار شد! 🎉`);

    // Start polling
    startLongPolling(cleanToken);

    return res.json({
      ok: true,
      botInfo: data.result,
      message: 'ربات با موفقیت به تلگرام متصل شد و آماده پاسخگویی است.',
    });
  } catch (err: any) {
    addLog('error', `خطای شبکه در اتصال به تلگرام: ${err?.message || err}`);
    return res.status(500).json({ ok: false, error: err?.message || 'خطای سرور در اتصال به تلگرام' });
  }
});

app.post('/api/bot/token/disconnect', (req, res) => {
  stopLongPolling();
  realBotRunner.token = '';
  realBotRunner.botInfo = null;
  return res.json({ ok: true, message: 'ربات با موفقیت قطع شد.' });
});

app.get('/api/bot/token/status', (req, res) => {
  return res.json({
    connected: !!realBotRunner.botInfo && realBotRunner.isPolling,
    isPolling: realBotRunner.isPolling,
    botInfo: realBotRunner.botInfo,
    logs: realBotRunner.logs,
  });
});

// Vite / Static Files Middleware setup
async function setupServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SlowMegaBot Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
