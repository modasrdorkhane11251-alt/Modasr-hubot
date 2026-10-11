import React, { useState, useEffect } from 'react';
import {
  Bot,
  MessageSquare,
  LayoutGrid,
  Zap,
  BookOpen,
  Wallet,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { TelegramSimulator } from './components/TelegramSimulator';
import { ModuleControlCenter } from './components/ModuleControlCenter';
import { RealBotConnectModal } from './components/RealBotConnectModal';
import { MafiaGameManager } from './components/MafiaGameManager';
import { MafiaMultiplayerPlatform } from './components/MafiaMultiplayerPlatform';
import { UserProfileModal } from './components/UserProfileModal';
import {
  TelegramMessage,
  TelegramUser,
  BotLog,
  RealBotStatus,
} from './types/telegram';
import {
  handleTelegramIncomingMessage,
  handleTelegramCallbackQuery,
  MAIN_INLINE_KEYBOARD,
  MAIN_REPLY_KEYBOARD,
  botStorage,
} from './services/botEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'mafia' | 'modules' | 'connect' | 'docs'>('simulator');
  const [isTyping, setIsTyping] = useState(false);
  const [walletBalance, setWalletBalance] = useState(50000);
  const [walletCoins, setWalletCoins] = useState(1000);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Real Bot Connection State
  const [connectedBot, setConnectedBot] = useState<TelegramUser | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [botLogs, setBotLogs] = useState<BotLog[]>([]);

  // Current Simulator User
  const currentUser: TelegramUser = {
    id: 12345678,
    first_name: 'شما (کاربر تست)',
    username: 'test_user',
  };

  // Initial Welcome Messages
  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      message_id: 1,
      from: { id: 999, first_name: 'SlowMegaBot', is_bot: true, username: 'slow_megabot' },
      chat: { id: 12345678, type: 'private' },
      date: Date.now() - 1000,
      text: `سلام کاربر گرامی عزیز! 🌹\nبه **SlowMegaBot** خوش آمدید؛ سامانه جامع و یکپارچه شامل تمام ۱۶ ماژول تخصصی:\n\n` +
        `🌐 **فیلترشکن و وب‌پروکسی:** عبور مستقیم از فیلترینگ و رفع خطاهای تحریم\n` +
        `📱 **شماره مجازی:** خرید اختصاصی شماره‌های ۷ کشور با دریافت تضمینی کد پیامک\n` +
        `🎥 **دانلودر یوتیوب:** دانلود انواع ویدیو 1080p/720p و فایل صوتی MP3 320k\n` +
        `🎵 **جستجوی موزیک:** آرشیو میلیونی ترانه‌ها، پخش آنلاین و متن شعر (Lyrics)\n` +
        `💰 **نرخ لحظه‌ای (arzy):** جدول زنده ارز، طلا، سکه و رمزارز با مبدل تومانی\n` +
        `📤 **آپلودر پیشرفته (aplo):** ماندگاری دائمی، لینک نیم‌بها، رمز عبور و QR Code\n` +
        `✨ **تیک‌تاک:** دانلود سریع و باکیفیت ویدیو بدون واترمرک و استخراج صوت\n` +
        `🎮 **مافیا:** بازی حرفه‌ای ۹ و ۱۲ نفره با ویس‌کال WebRTC و بات‌های هوشمند\n` +
        `🚀 **بت و انفجار:** بازی موشک انفجار با ضریب زنده، تاس و دارت\n` +
        `⚔️ **کلش آف کلنز:** ساخت دهکده، ارتقای تاون‌هال و غارت منابع\n` +
        `🔍 **چت ناشناس:** همدم‌یاب تصادفی و بر اساس موقعیت مکانی\n` +
        `👁️ **سین‌زن و بازدید:** سفارش آنی بازدید پست با درگاه تستی\n` +
        `🛠️ **جعبه ابزار:** استعلام کارت شتاب، OCR و پروکسی MTProto\n` +
        `🎁 **لاتاری و شانس:** گردونه شانس روزانه و اهدای اکانت\n` +
        `👍 **لایک و چالش:** افزایش لایک و واکنش مسابقات تلگرام\n\n` +
        `یک گزینه را از منوی زیر انتخاب نمایید:`,
      reply_markup: MAIN_INLINE_KEYBOARD,
    },
    {
      message_id: 2,
      from: { id: 999, first_name: 'SlowMegaBot', is_bot: true, username: 'slow_megabot' },
      chat: { id: 12345678, type: 'private' },
      date: Date.now() - 500,
      text: `📱 کیبورد دسترسی سریع منوی اصلی فعال شد. برای تست هر ماژول کلیک کنید:`,
      reply_markup: MAIN_REPLY_KEYBOARD,
    },
  ]);

  // Sync state and check connection status periodically
  const fetchBotStatus = async () => {
    try {
      const res = await fetch('/api/bot/token/status');
      if (res.ok) {
        const data = await res.json();
        setConnectedBot(data.botInfo || null);
        setIsPolling(data.isPolling || false);
        setBotLogs(data.logs || []);
      }
    } catch {
      // Offline or local dev fallback
    }
  };

  useEffect(() => {
    fetchBotStatus();
    const interval = setInterval(fetchBotStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update wallet state
  const syncWallet = () => {
    const w = botStorage.getWallet(currentUser.id);
    setWalletBalance(w.balance);
    setWalletCoins(w.coins);
  };

  // Dispatch message from Simulator
  const handleSendMessage = async (text: string) => {
    const userMsg: TelegramMessage = {
      message_id: messages.length + 1,
      from: currentUser,
      chat: { id: currentUser.id, type: 'private' },
      date: Date.now(),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Try dispatching through backend API
      const res = await fetch('/api/bot/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message',
          user: currentUser,
          chatId: currentUser.id,
          text,
        }),
      });

      let botResponses: any[] = [];
      if (res.ok) {
        const data = await res.json();
        botResponses = data.responses;
      } else {
        // Fallback to client-side engine
        botResponses = await handleTelegramIncomingMessage(currentUser, currentUser.id, text);
      }

      setTimeout(() => {
        setIsTyping(false);
        const newBotMsgs: TelegramMessage[] = botResponses.map((r, idx) => ({
          message_id: messages.length + 2 + idx,
          from: { id: 999, first_name: 'SlowMegaBot', is_bot: true, username: 'slow_megabot' },
          chat: { id: currentUser.id, type: 'private' },
          date: Date.now() + idx * 100,
          text: r.text,
          reply_markup: r.reply_markup,
          photoUrl: r.photoUrl,
          videoUrl: r.videoUrl,
          audioUrl: r.audioUrl,
          mediaAttachment: r.mediaAttachment,
        }));
        setMessages((prev) => [...prev, ...newBotMsgs]);
        syncWallet();
      }, 450);
    } catch {
      // Fallback
      setTimeout(async () => {
        setIsTyping(false);
        const botResponses = await handleTelegramIncomingMessage(currentUser, currentUser.id, text);
        const newBotMsgs: TelegramMessage[] = botResponses.map((r, idx) => ({
          message_id: messages.length + 2 + idx,
          from: { id: 999, first_name: 'SlowMegaBot', is_bot: true, username: 'slow_megabot' },
          chat: { id: currentUser.id, type: 'private' },
          date: Date.now() + idx * 100,
          text: r.text,
          reply_markup: r.reply_markup,
          photoUrl: r.photoUrl,
          videoUrl: r.videoUrl,
          audioUrl: r.audioUrl,
          mediaAttachment: r.mediaAttachment,
        }));
        setMessages((prev) => [...prev, ...newBotMsgs]);
        syncWallet();
      }, 300);
    }
  };

  // Dispatch Callback Query from Simulator
  const handleCallbackQuery = async (callbackData: string, message: TelegramMessage) => {
    setIsTyping(true);

    try {
      const res = await fetch('/api/bot/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'callback',
          user: currentUser,
          chatId: currentUser.id,
          callbackData,
          message,
        }),
      });

      let botResponses: any[] = [];
      if (res.ok) {
        const data = await res.json();
        botResponses = data.responses;
      } else {
        botResponses = await handleTelegramCallbackQuery({
          id: 'cb_' + Date.now(),
          from: currentUser,
          data: callbackData,
          message,
        });
      }

      setTimeout(() => {
        setIsTyping(false);
        const newBotMsgs: TelegramMessage[] = botResponses.map((r, idx) => ({
          message_id: messages.length + 1 + idx,
          from: { id: 999, first_name: 'SlowMegaBot', is_bot: true, username: 'slow_megabot' },
          chat: { id: currentUser.id, type: 'private' },
          date: Date.now() + idx * 100,
          text: r.text,
          reply_markup: r.reply_markup,
          photoUrl: r.photoUrl,
          videoUrl: r.videoUrl,
          audioUrl: r.audioUrl,
          mediaAttachment: r.mediaAttachment,
        }));
        setMessages((prev) => [...prev, ...newBotMsgs]);
        syncWallet();
      }, 350);
    } catch {
      setTimeout(async () => {
        setIsTyping(false);
        const botResponses = await handleTelegramCallbackQuery({
          id: 'cb_' + Date.now(),
          from: currentUser,
          data: callbackData,
          message,
        });
        const newBotMsgs: TelegramMessage[] = botResponses.map((r, idx) => ({
          message_id: messages.length + 1 + idx,
          from: { id: 999, first_name: 'SlowMegaBot', is_bot: true, username: 'slow_megabot' },
          chat: { id: currentUser.id, type: 'private' },
          date: Date.now() + idx * 100,
          text: r.text,
          reply_markup: r.reply_markup,
          photoUrl: r.photoUrl,
          videoUrl: r.videoUrl,
          audioUrl: r.audioUrl,
          mediaAttachment: r.mediaAttachment,
        }));
        setMessages((prev) => [...prev, ...newBotMsgs]);
        syncWallet();
      }, 300);
    }
  };

  // Connect Real Bot
  const handleConnectRealBot = async (token: string) => {
    try {
      const res = await fetch('/api/bot/token/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.ok) {
        setConnectedBot(data.botInfo);
        setIsPolling(true);
        fetchBotStatus();
        return { ok: true };
      }
      return { ok: false, error: data.error };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'خطا در برقراری ارتباط با سرور' };
    }
  };

  // Disconnect Real Bot
  const handleDisconnectRealBot = async () => {
    try {
      await fetch('/api/bot/token/disconnect', { method: 'POST' });
      setConnectedBot(null);
      setIsPolling(false);
      fetchBotStatus();
    } catch {
      // Ignored
    }
  };

  const handleQuickCommand = (cmd: string) => {
    handleSendMessage(cmd);
    setActiveTab('simulator');
  };

  const handleQuickAction = (cmdOrCb: string) => {
    if (cmdOrCb.startsWith('cb_')) {
      handleCallbackQuery(cmdOrCb, messages[messages.length - 1]);
    } else {
      handleSendMessage(cmdOrCb);
    }
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-[#0e1621] text-white flex flex-col font-['Vazirmatn',sans-serif]">
      {/* Top Main Navigation Bar */}
      <header className="bg-[#17212b] border-b border-[#242f3d] sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0088cc] to-[#40b3e0] flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-wide text-white">
                  SlowMegaBot
                </h1>
                <span className="text-[10px] bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 px-2 py-0.5 rounded-full font-bold">
                  All-In-One Hub
                </span>
                {connectedBot && (
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    متصل به تلگرام
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                سامانه تجمیعی تست مافیا، بت، کلش، سین‌زن، همدم‌یاب، ابزارها و آپلودر
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-[#0e1621] p-1 rounded-xl border border-[#242f3d] text-xs">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#0088cc] text-white shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>شبیه‌ساز تلگرام</span>
            </button>

            <button
              onClick={() => setActiveTab('mafia')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'mafia'
                  ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>پلتفرم مافیا آنلاین 🎭</span>
            </button>

            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-[#0088cc] text-white shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>ایستگاه تست ماژول‌ها</span>
            </button>

            <button
              onClick={() => setActiveTab('connect')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'connect'
                  ? 'bg-[#0088cc] text-white shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>اتصال ربات واقعی</span>
              {connectedBot && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer hidden md:flex ${
                activeTab === 'docs'
                  ? 'bg-[#0088cc] text-white shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>داکیومنت و فایل‌ها</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            {/* Quick module launcher ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-4xl mx-auto text-xs">
              <span className="text-slate-400 text-xs shrink-0 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> تست سریع:
              </span>
              {[
                { label: '🎮 مافیا', cmd: '/mafia' },
                { label: '🚀 موشک انفجار', cmd: '/bet' },
                { label: '⚔️ کلش دهکده', cmd: '/clash' },
                { label: '🔍 چت ناشناس', cmd: '/finder' },
                { label: '👁️ سفارش سین', cmd: '/seen' },
                { label: '🛠️ استعلام کارت', cmd: '/tools' },
                { label: '🎁 گردونه شانس', cmd: '/lottery' },
                { label: '📤 آپلودر فایل', cmd: '/uploader' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickCommand(item.cmd)}
                  className="px-2.5 py-1 rounded-lg bg-[#17212b] hover:bg-[#202d3b] border border-[#242f3d] text-slate-200 shrink-0 transition-all font-medium cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <TelegramSimulator
              onSendMessage={handleSendMessage}
              onCallbackQuery={handleCallbackQuery}
              messages={messages}
              isTyping={isTyping}
              currentUser={currentUser}
              connectedBotUsername={connectedBot?.username}
              onQuickCommand={handleQuickCommand}
              walletBalance={walletBalance}
              onOpenProfile={() => setShowProfileModal(true)}
            />
          </div>
        )}

      {showProfileModal && (
        <UserProfileModal
          currentUser={currentUser}
          wallet={botStorage.getWallet(currentUser.id)}
          orders={botStorage.orders}
          onClose={() => setShowProfileModal(false)}
          onUpgradeClick={() => {
            setShowProfileModal(false);
            handleQuickCommand('/sub');
          }}
        />
      )}

        {activeTab === 'mafia' && (
          <MafiaMultiplayerPlatform />
        )}

        {activeTab === 'modules' && (
          <ModuleControlCenter
            onQuickAction={handleQuickAction}
            walletBalance={walletBalance}
          />
        )}

        {activeTab === 'connect' && (
          <RealBotConnectModal
            connectedBot={connectedBot}
            isPolling={isPolling}
            onConnect={handleConnectRealBot}
            onDisconnect={handleDisconnectRealBot}
            logs={botLogs}
            onRefreshLogs={fetchBotStatus}
          />
        )}

        {activeTab === 'docs' && (
          <div className="bg-[#17212b] rounded-2xl border border-[#242f3d] p-6 max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0088cc]" />
                داکیومنت و گزارش تجمیع سورس‌کدهای پروژه
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                تمام فایل‌ها و پوشه‌هایی که در درخواست ارسال فرمودید در این سامانه یکپارچه‌سازی و تست شده‌اند:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#0e1621] p-4 rounded-xl border border-[#242f3d] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ۱. SlowSeen (سین‌زن و درگاه پرداخت)
                </h4>
                <p className="text-slate-300">
                  شامل تمام فایل‌های <code>pay/index.php</code>، <code>back.php</code> و استایل‌های مربوطه، محاسبه قیمت بازدید پست، شبیه‌سازی درگاه و تحویل بازدیدها.
                </p>
              </div>

              <div className="bg-[#0e1621] p-4 rounded-xl border border-[#242f3d] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ۲. beta ( mafia ) (بازی مافیا)
                </h4>
                <p className="text-slate-300">
                  شامل سناریوهای <code>9-player-game.php</code> و <code>12-player-game.php</code>، نقش‌های گادپدر، دکتر، کارآگاه، اسنایپر و سیستم رای‌گیری با دکمه شیشه‌ای.
                </p>
              </div>

              <div className="bg-[#0e1621] p-4 rounded-xl border border-[#242f3d] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ۳. SlowBet (موشک انفجار، دارت و تاس)
                </h4>
                <p className="text-slate-300">
                  شامل <code>moshak.php</code> (موشک کرش با ضریب متغیر) و <code>dart.php</code> (دارت امتیازی تلگرام) و تاس با کسر و افزایش موجودی کاربر.
                </p>
              </div>

              <div className="bg-[#0e1621] p-4 rounded-xl border border-[#242f3d] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ۴. SlowCreate (کلش آف کلنز و ربات‌ساز)
                </h4>
                <p className="text-slate-300">
                  شامل <code>ClAshOfClaN/QkdkfK.php</code> با انبارهای طلا، اکسیر، چوب، غارت دهکده حریف، ارتقای تاون‌هال و پادگان سربازان.
                </p>
              </div>

              <div className="bg-[#0e1621] p-4 rounded-xl border border-[#242f3d] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ۵. SlowFinder (همدم‌یاب و چت ناشناس)
                </h4>
                <p className="text-slate-300">
                  شامل <code>bot.php</code>، <code>Location.php</code>، اتصال ناشناس دو طرفه، فیلتر جنسیت و قطع ارتباط فوری.
                </p>
              </div>

              <div className="bg-[#0e1621] p-4 rounded-xl border border-[#242f3d] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ۶. جعبه ابزار و API
                </h4>
                <p className="text-slate-300">
                  شامل <code>card.php</code> (استعلام کارت شتاب)، <code>ocr.php</code>، <code>Currencyprices</code> (نرخ لحظه‌ای ارز و طلا)، اینستاگرام و ایمیل فیک موقت.
                </p>
              </div>

              <div className="bg-[#0e1621] p-4 rounded-xl border border-[#242f3d] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ۷. SlowUploader & LotteryAcc
                </h4>
                <p className="text-slate-300">
                  آپلود مستقیم فایل و صدور لینک اختصاصی تلگرام + گردونه شانس و اهدای اکانت‌های پرمیوم و مجازی.
                </p>
              </div>

              <div className="bg-[#0e1621] p-4 rounded-xl border border-[#242f3d] space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ۸. قابلیت اتصال توکن واقعی
                </h4>
                <p className="text-slate-300">
                  کافیست توکن ربات از BotFather را در تب «اتصال ربات واقعی» وارد کنید تا ربات مستقیماً در تلگرام واقعی روی گوشی شما پاسخ دهد!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
