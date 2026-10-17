import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Shield,
  ShoppingBag,
  Trophy,
  Radio,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Coins,
  Gem,
  Award,
  Zap,
  Play,
  PlusCircle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bot,
  Brain,
  RotateCcw,
  Volume2,
  VolumeX,
  Send,
  Skull,
  Gavel,
  Vote,
  Target,
  ChevronRight,
  UserCheck,
  Eye,
  AlertTriangle,
  DoorOpen,
  Search,
  Check,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  UserAccount,
  GameRoom,
  RoomParticipant,
  MafiaRoleDefinition,
  ALL_MAFIA_ROLES,
} from '../types/mafiaPlatform';
import {
  WebRtcAudioService,
  WebRtcDiagnosticLog,
  WebRtcPeerState,
} from '../services/webrtcAudioService';
import { Terminal, Activity, Wifi } from 'lucide-react';

// Neon Neoclassical Pantheon Temple SVG (Image 3)
const PantheonTempleNeonSVG: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg
    viewBox="0 0 240 200"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="pantheonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
      <filter id="pantheonFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Pediment Triangular Roof */}
    <path
      d="M120 22 L35 68 L205 68 Z"
      fill="#111827"
      stroke="url(#pantheonGlow)"
      strokeWidth="3.5"
      filter="url(#pantheonFilter)"
    />
    <rect x="30" y="68" width="180" height="12" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
    <circle cx="120" cy="50" r="9" fill="none" stroke="#c084fc" strokeWidth="2" />
    {/* Arch in center */}
    <path
      d="M102 155 L102 110 Q120 95 138 110 L138 155 Z"
      fill="#0c1220"
      stroke="url(#pantheonGlow)"
      strokeWidth="2.5"
    />
    {/* Classical Pillars */}
    <rect x="46" y="80" width="16" height="75" rx="3" fill="#111c2e" stroke="#38bdf8" strokeWidth="2" />
    <rect x="74" y="80" width="16" height="75" rx="3" fill="#111c2e" stroke="#818cf8" strokeWidth="2" />
    <rect x="150" y="80" width="16" height="75" rx="3" fill="#111c2e" stroke="#818cf8" strokeWidth="2" />
    <rect x="178" y="80" width="16" height="75" rx="3" fill="#111c2e" stroke="#38bdf8" strokeWidth="2" />
    {/* Pillar fluting lines */}
    <line x1="54" y1="86" x2="54" y2="150" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" />
    <line x1="82" y1="86" x2="82" y2="150" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.7" />
    <line x1="158" y1="86" x2="158" y2="150" stroke="#818cf8" strokeWidth="1.5" strokeOpacity="0.7" />
    <line x1="186" y1="86" x2="186" y2="150" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" />
    {/* Stepped Base Podium */}
    <rect x="25" y="155" width="190" height="10" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
    <rect x="15" y="165" width="210" height="14" rx="3" fill="#111827" stroke="url(#pantheonGlow)" strokeWidth="2.5" filter="url(#pantheonFilter)" />
  </svg>
);

// Godfather Cinematic Portrait SVG (Image 2)
const GodfatherPortraitSVG: React.FC = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgFire" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#450a0a" />
        <stop offset="60%" stopColor="#180505" />
        <stop offset="100%" stopColor="#050505" />
      </radialGradient>
      <linearGradient id="emberSparks" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#bgFire)" />
    {/* Fire spark particles */}
    <circle cx="30" cy="140" r="1.5" fill="#f59e0b" opacity="0.8" />
    <circle cx="45" cy="110" r="2" fill="#ef4444" opacity="0.7" />
    <circle cx="160" cy="130" r="1.5" fill="#f59e0b" opacity="0.9" />
    <circle cx="175" cy="95" r="2.5" fill="#ea580c" opacity="0.7" />
    <circle cx="140" cy="60" r="1.5" fill="#fbbf24" opacity="0.6" />
    <circle cx="70" cy="40" r="2" fill="#ef4444" opacity="0.8" />
    {/* Shoulders & Suit */}
    <path d="M40 200 C45 160 70 145 100 145 C130 145 155 160 160 200 Z" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
    {/* White shirt & red tie */}
    <polygon points="100,150 90,165 110,165" fill="#f8fafc" />
    <polygon points="98,165 102,165 104,195 96,195" fill="#dc2626" />
    {/* Head & Jawline */}
    <path d="M78 115 C78 140 88 152 100 152 C112 152 122 140 122 115 Z" fill="#94a3b8" />
    <path d="M82 110 Q100 120 118 110 L118 135 Q100 150 82 135 Z" fill="#64748b" />
    {/* Serious facial shadows */}
    <ellipse cx="92" cy="118" rx="4" ry="2" fill="#1e293b" />
    <ellipse cx="108" cy="118" rx="4" ry="2" fill="#1e293b" />
    <line x1="95" y1="135" x2="105" y2="135" stroke="#1e293b" strokeWidth="2.5" />
    {/* Fedora Hat */}
    <ellipse cx="100" cy="100" rx="42" ry="12" fill="#090d16" stroke="#ef4444" strokeWidth="1.5" />
    <path d="M72 98 C72 65 80 55 100 55 C120 55 128 65 128 98 Z" fill="#0f172a" />
    <rect x="74" y="88" width="52" height="7" fill="#dc2626" rx="1" />
  </svg>
);

// Goon / Notche Portrait SVG (Image 2)
const GoonPortraitSVG: React.FC = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgDarkBlue" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>
    </defs>
    <rect width="200" height="200" fill="url(#bgDarkBlue)" />
    {/* Leather jacket & collar */}
    <path d="M45 200 C50 160 75 150 100 150 C125 150 150 160 155 200 Z" fill="#111827" stroke="#38bdf8" strokeWidth="1" />
    {/* Jaw and face */}
    <path d="M80 115 C80 145 90 155 100 155 C110 155 120 145 120 115 Z" fill="#94a3b8" />
    {/* Slicked back hair */}
    <path d="M75 110 C75 75 85 65 100 65 C115 65 125 75 125 110 Z" fill="#090d16" />
    {/* Dark Sunglasses */}
    <rect x="80" y="105" width="18" height="12" rx="3" fill="#000000" stroke="#38bdf8" strokeWidth="1.5" />
    <rect x="102" y="105" width="18" height="12" rx="3" fill="#000000" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="98" y1="110" x2="102" y2="110" stroke="#38bdf8" strokeWidth="2" />
    {/* Smirk */}
    <line x1="94" y1="138" x2="106" y2="136" stroke="#1e293b" strokeWidth="2.5" />
  </svg>
);

export const MafiaMultiplayerPlatform: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'rooms' | 'game' | 'market' | 'ranking'>('rooms');
  const [user, setUser] = useState<UserAccount | null>(null);
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [roles, setRoles] = useState<MafiaRoleDefinition[]>(ALL_MAFIA_ROLES);

  // Room Creation Modal / State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomScenario, setNewRoomScenario] = useState<9 | 12>(9);
  const [newRoomPrivate, setNewRoomPrivate] = useState(false);
  const [newRoomPasscode, setNewRoomPasscode] = useState('');

  // WebRTC Local Voice & Diagnostics State
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [activeSpeakerSeat, setActiveSpeakerSeat] = useState<number | null>(null);
  const [webrtcConnected, setWebrtcConnected] = useState(false);
  const [webrtcIsFallback, setWebrtcIsFallback] = useState(false);
  const [userSpeakingLevel, setUserSpeakingLevel] = useState(0);
  const [webrtcLogs, setWebrtcLogs] = useState<WebRtcDiagnosticLog[]>([]);
  const [webrtcPeers, setWebrtcPeers] = useState<WebRtcPeerState[]>([]);
  const [showWebRtcLogsModal, setShowWebRtcLogsModal] = useState(false);
  const [webrtcError, setWebrtcError] = useState<string | null>(null);
  const webrtcServiceRef = useRef<WebRtcAudioService | null>(null);

  // In-Game Message & Action state
  const [chatInput, setChatInput] = useState('');
  const [selectedTargetSeat, setSelectedTargetSeat] = useState<number | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'mafia' | 'citizens' | 'independent'>('all');
  const [purchaseStatusMsg, setPurchaseStatusMsg] = useState<{ text: string; isSuccess: boolean } | null>(null);

  // Sync Data on Mount & Periodic Polling
  const syncPlatformData = async () => {
    try {
      const userRes = await fetch('/api/platform/user?userId=usr_me');
      if (userRes.ok) {
        const uData = await userRes.json();
        if (uData.user) setUser(uData.user);
      }
      const roomsRes = await fetch('/api/platform/rooms');
      if (roomsRes.ok) {
        const rData = await roomsRes.json();
        if (rData.rooms) {
          setRooms(rData.rooms);
          if (currentRoom) {
            const updated = rData.rooms.find((r: GameRoom) => r.id === currentRoom.id);
            if (updated) setCurrentRoom(updated);
          }
        }
      }
      const rolesRes = await fetch('/api/platform/roles');
      if (rolesRes.ok) {
        const rlData = await rolesRes.json();
        if (rlData.roles) setRoles(rlData.roles);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    syncPlatformData();
    const interval = setInterval(syncPlatformData, 3000);
    return () => clearInterval(interval);
  }, [currentRoom?.id]);

  // Join Room
  const handleJoinRoom = async (roomId: string) => {
    try {
      const res = await fetch('/api/platform/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, userId: user?.id || 'usr_me' }),
      });
      const data = await res.json();
      if (data.room) {
        setCurrentRoom(data.room);
        setActiveSubTab('game');
        confetti({ particleCount: 40, spread: 60 });
      }
    } catch {
      //
    }
  };

  // Create Room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      const res = await fetch('/api/platform/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostUserId: user?.id || 'usr_me',
          name: newRoomName.trim(),
          scenario: newRoomScenario,
          isPrivate: newRoomPrivate,
          passcode: newRoomPasscode,
        }),
      });
      const data = await res.json();
      if (data.room) {
        setRooms([data.room, ...rooms]);
        setCurrentRoom(data.room);
        setShowCreateModal(false);
        setNewRoomName('');
        setActiveSubTab('game');
        confetti({ particleCount: 50, spread: 70 });
      }
    } catch {
      //
    }
  };

  const filteredRoles = roles.filter((r) => {
    if (selectedRoleFilter === 'all') return true;
    return r.team === selectedRoleFilter;
  });

  return (
    <div className="bg-[#0b121e] rounded-3xl border border-[#1e2c3e] p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto space-y-5 select-none font-['Vazirmatn',sans-serif] text-slate-100">
      
      {/* 1. USER PROFILE CARD (Exact Match to Image 4) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1435] via-[#151c2e] to-[#121c29] p-4 border border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.15)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#17212b] rounded-2xl flex items-center justify-center text-3xl">
                {user?.avatarEmoji || '🎩'}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-base sm:text-lg">
                {user?.displayName || 'فرمانده مافیا (شما)'}
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-slate-950 font-black shadow-md">
                سطح {user?.level || 5} • لیگ {user?.league?.toUpperCase() || 'GOLD'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>برد: <strong className="text-emerald-400">{user?.gamesWon || 22}</strong></span>
              <span>|</span>
              <span>باخت: <strong className="text-rose-400">{user?.gamesLost || 10}</strong></span>
              <span>|</span>
              <span>نرخ پیروزی: <strong className="text-cyan-400">{user?.winRate || 68.7}%</strong></span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. CURRENCY CAPSULES (Exact Match to Images 3 & 4) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-[#121b28] border border-amber-500/30 shadow-inner">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-amber-400 text-xs sm:text-sm">{(user?.coins || 25000).toLocaleString('fa-IR')}</span>
          <span className="text-[10px] text-amber-200/70 font-medium">سکه</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-[#121b28] border border-cyan-500/30 shadow-inner">
          <Gem className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-cyan-400 text-xs sm:text-sm">{(user?.diamonds || 180).toLocaleString('fa-IR')}</span>
          <span className="text-[10px] text-cyan-200/70 font-medium">الماس</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-[#121b28] border border-purple-500/30 shadow-inner">
          <Award className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-purple-300 text-xs sm:text-sm">{(user?.points || 1250).toLocaleString('fa-IR')}</span>
          <span className="text-[10px] text-purple-200/70 font-medium">پوینت</span>
        </div>
      </div>

      {/* 3. FOUR SUB-NAVIGATION TABS (Images 1, 3, 4) */}
      <div className="grid grid-cols-4 gap-2 border-b border-[#1f2d3f] pb-3">
        <button
          onClick={() => setActiveSubTab('rooms')}
          className={`py-2 px-1 rounded-2xl text-[11px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'rooms'
              ? 'bg-[#0088cc] text-white shadow-[0_0_15px_rgba(0,136,204,0.5)] ring-1 ring-cyan-300'
              : 'bg-[#121b28] text-slate-400 hover:text-white border border-[#1e2c3e]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>اتاق‌های آنلاین ({rooms.length || 2})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('game')}
          className={`py-2 px-1 rounded-2xl text-[11px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'game'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.6)] border-2 border-purple-400'
              : 'bg-[#121b28] text-slate-400 hover:text-white border border-[#1e2c3e]'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span>میز بازی و مسابقه</span>
        </button>

        <button
          onClick={() => setActiveSubTab('market')}
          className={`py-2 px-1 rounded-2xl text-[11px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'market'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'bg-[#121b28] text-slate-400 hover:text-white border border-[#1e2c3e]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          <span>فروشگاه نقش‌ها ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ranking')}
          className={`py-2 px-1 rounded-2xl text-[11px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'ranking'
              ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400'
              : 'bg-[#121b28] text-slate-400 hover:text-white border border-[#1e2c3e]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-pink-400" />
          <span>لیگ و رتبه‌بندی</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ONLINE ROOMS LOBBY (Image 4)                      */}
      {/* ======================================================== */}
      {activeSubTab === 'rooms' && (
        <div className="space-y-4">
          {/* Big Green Neon Create Room Button (Exact Match Image 4) */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-emerald-950/70 border-2 border-emerald-400 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:bg-emerald-900/80 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>ساخت اتاق جدید</span>
            </button>
          </div>

          {/* Rooms Grid with Cyan Neon Glow (Image 4) */}
          <div className="space-y-3">
            {rooms.map((room) => {
              return (
                <div
                  key={room.id}
                  className="rounded-2xl p-4 bg-[#0a121d] border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 text-lg">🏛️</span>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        {room.name.replace('🏛️', '').trim()}
                      </h4>
                    </div>
                    <span className="px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono font-bold text-xs">
                      2 / 9
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    سناریوی {room.selectedScenario} نفره | فاز فعلی: <span className="text-indigo-400 font-bold">{room.currentPhase}</span>
                  </p>

                  {/* 9 Player Avatar Seat Rings (Image 4) */}
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-rose-500 flex items-center justify-center text-sm shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0">
                      🤠
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-slate-700 flex items-center justify-center text-xs text-slate-500 shrink-0">
                      +
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-pink-500 flex items-center justify-center text-sm shadow-[0_0_8px_rgba(236,72,153,0.5)] shrink-0">
                      🕵️
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-emerald-500 flex items-center justify-center text-sm shadow-[0_0_8px_rgba(52,211,153,0.5)] shrink-0">
                      🧔
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-slate-700 flex items-center justify-center text-xs text-slate-500 shrink-0">
                      +
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-slate-700 flex items-center justify-center text-xs text-slate-500 shrink-0">
                      +
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-amber-400 flex items-center justify-center text-sm shadow-[0_0_8px_rgba(245,158,11,0.5)] shrink-0">
                      👨‍⚖️
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-purple-500 flex items-center justify-center text-sm shrink-0">
                      🎩
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#121b28] border-2 border-slate-700 flex items-center justify-center text-xs text-slate-500 shrink-0">
                      +
                    </div>
                  </div>

                  {/* Room Bottom Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1a2838]">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>((•)) ویس‌کال زنده فعال</span>
                    </div>
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-[0_0_15px_rgba(14,165,233,0.5)] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <span>ورود به بازی</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: GAME TABLE EMPTY STATE (Image 3)                   */}
      {/* ======================================================== */}
      {activeSubTab === 'game' && !currentRoom && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#101429] via-[#0c1020] to-[#080b16] border border-purple-500/30 p-8 sm:p-12 text-center space-y-6 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
          {/* Neon Classical Pantheon Temple Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
              <PantheonTempleNeonSVG className="w-52 h-52 relative z-10" />
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              هیچ اتاقی انتخاب نشده است
            </h3>
            <p className="text-xs sm:text-sm text-cyan-300/80 max-w-md mx-auto">
              لطفاً از تب اتاق‌ها وارد یک عمارت شوید یا اتاقی بسازید.
            </p>
          </div>

          {/* Cyan Glowing Button (Image 3) */}
          <div className="flex justify-center relative z-10 pt-2">
            <button
              onClick={() => setActiveSubTab('rooms')}
              className="px-8 py-3 rounded-2xl bg-cyan-950/70 border-2 border-cyan-400 text-cyan-200 font-extrabold text-sm shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:bg-cyan-900/80 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <DoorOpen className="w-4 h-4 text-cyan-400" />
              <span>مشاهده اتاق‌ها</span>
            </button>
          </div>
        </div>
      )}

      {/* In-Game Active Match View (When room joined) */}
      {activeSubTab === 'game' && currentRoom && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0e1621] border border-purple-500/40 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">{currentRoom.name}</h3>
              <p className="text-xs text-slate-400">فاز فعال: {currentRoom.currentPhase} | روز {currentRoom.dayNumber}</p>
            </div>
            <button
              onClick={() => setCurrentRoom(null)}
              className="px-3 py-1.5 rounded-xl bg-[#1e293b] text-xs text-rose-400 font-bold border border-rose-500/30"
            >
              خروج از عمارت
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ROLES MARKET / CYBERPUNK SCI-FI CARDS (Image 2)   */}
      {/* ======================================================== */}
      {activeSubTab === 'market' && (
        <div className="space-y-4">
          {/* Filter Pills Bar (Exact Match Image 2) */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedRoleFilter('all')}
              className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedRoleFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                  : 'bg-[#121b28] text-slate-400 border border-[#1e2c3e]'
              }`}
            >
              تمامی نقش‌ها
            </button>
            <button
              onClick={() => setSelectedRoleFilter('mafia')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                selectedRoleFilter === 'mafia'
                  ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.6)]'
                  : 'bg-[#121b28] text-rose-400 border border-rose-500/50'
              }`}
            >
              <span>تیم مافیا</span>
              <span>🎩</span>
            </button>
            <button
              onClick={() => setSelectedRoleFilter('citizens')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                selectedRoleFilter === 'citizens'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)]'
                  : 'bg-[#121b28] text-blue-400 border border-blue-500/50'
              }`}
            >
              <span>تیم شهروندان</span>
              <span>👥</span>
            </button>
            <button
              onClick={() => setSelectedRoleFilter('independent')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                selectedRoleFilter === 'independent'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.6)]'
                  : 'bg-[#121b28] text-slate-400 border border-[#1e2c3e]'
              }`}
            >
              <span>نقش‌های مستقل</span>
              <span>🔪</span>
            </button>
          </div>

          {/* Cyberpunk Sci-Fi HUD Framed Role Cards (Image 2) */}
          <div className="space-y-4">
            {/* 1. GODFATHER CARD (Image 2) */}
            <div className="relative rounded-2xl bg-[#0a101d] border-2 border-rose-500/60 p-4 sm:p-5 shadow-[0_0_25px_rgba(239,68,68,0.25)] space-y-3.5 overflow-hidden">
              {/* Cyberpunk corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-rose-500"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-rose-500"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

              {/* Header with Title and 3D Emoji */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 font-black text-[11px] tracking-wider">
                  LEGENDARY
                </span>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-2xl">🎩</span>
                    <h3 className="text-lg font-black text-white">پدرخوانده</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Godfather</p>
                </div>
              </div>

              {/* Cinematic Character Portrait */}
              <div className="h-44 sm:h-52 w-full rounded-xl overflow-hidden border border-rose-500/40 relative">
                <GodfatherPortraitSVG />
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed text-right">
                رهبر مطلق مافیا. شلیک نهایی شب را تعیین می‌کند و استعلام کارآگاه برای او همواره منفی (شهروند) است.
              </p>

              {/* Glowing Ability Box */}
              <div className="p-3 rounded-xl bg-[#140b15] border border-amber-500/40 text-xs text-amber-200 flex items-center justify-end gap-1.5 shadow-inner">
                <span className="text-right font-medium">⚡ توانایی: شلیک مستقیم مرگبار و مصونیت در برابر استعلام کارآگاه</span>
              </div>

              {/* Status Button (Green Neon Glow - Image 2) */}
              <div className="flex justify-end">
                <div className="px-5 py-2 rounded-full bg-emerald-950/70 border-2 border-emerald-400 text-emerald-300 font-black text-xs shadow-[0_0_15px_rgba(52,211,153,0.5)] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مالکیت فعال</span>
                </div>
              </div>
            </div>

            {/* 2. GOON / NOTCHE CARD (Image 2) */}
            <div className="relative rounded-2xl bg-[#0a101d] border-2 border-slate-700 p-4 sm:p-5 shadow-lg space-y-3.5 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-600 font-black text-[11px] tracking-wider">
                  COMMON
                </span>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-2xl">🕶️</span>
                    <h3 className="text-lg font-black text-white">نوچه</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Goon / Notche</p>
                </div>
              </div>

              <div className="h-40 sm:h-48 w-full rounded-xl overflow-hidden border border-slate-700 relative">
                <GoonPortraitSVG />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed text-right">
                مافیای ساده و وفادار، در اتاق شب همفکری می‌کند و در صورت حذف پدرخوانده سلاح به او می‌رسد.
              </p>

              <div className="p-3 rounded-xl bg-[#0f172a] border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-end gap-1.5 shadow-inner">
                <span className="text-right font-medium">⚡ توانایی: همفکری در چت/کال شب و شلیک جانشین</span>
              </div>

              <div className="flex justify-end">
                <div className="px-5 py-2 rounded-full bg-emerald-950/70 border-2 border-emerald-400 text-emerald-300 font-black text-xs shadow-[0_0_15px_rgba(52,211,153,0.5)] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مالکیت فعال</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: LEADERBOARD & RANKING (Image 1)                    */}
      {/* ======================================================== */}
      {activeSubTab === 'ranking' && (
        <div className="rounded-3xl bg-[#090f1a] border border-[#1f2d40] p-5 sm:p-6 space-y-4 shadow-2xl">
          {/* Header Banner (Image 1) */}
          <div className="flex items-center justify-between border-b border-[#1c2a3c] pb-4">
            <div className="text-right space-y-1">
              <div className="flex items-center gap-2 justify-end">
                <h3 className="text-base sm:text-lg font-black text-white">
                  جدول برترین‌های فصل مافیا
                </h3>
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-xs text-slate-400">
                رتبه‌بندی بر اساس پوینت مسابقات رقابتی
              </p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 font-bold text-xs shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              فصل زمستان ۱۴۰۵
            </span>
          </div>

          {/* Leaderboard Cards */}
          <div className="space-y-3">
            {/* Rank 1: Sara Sniper */}
            <div className="p-4 rounded-2xl bg-[#0d1624] border border-amber-500/30 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="font-black text-xl text-amber-400">#1</span>
                <div className="text-left font-mono">
                  <span className="font-extrabold text-purple-400 block">PTS 1650</span>
                  <span className="text-emerald-400 text-xs">برد: ۶۹.۶%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="font-extrabold text-white text-sm">سارا تک‌تیرانداز</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300">
                    لیگ پلاتینیوم
                  </span>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#182334] border-2 border-amber-400 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                  🎯
                </div>
              </div>
            </div>

            {/* Rank 2: Commander Mafia (You) - Electric Cyan Neon Frame (Image 1) */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="font-black text-xl text-cyan-400">#2</span>
                <div className="text-left font-mono">
                  <span className="font-extrabold text-purple-300 block">PTS 1250</span>
                  <span className="text-emerald-400 text-xs">برد: ۶۸.۷%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="font-extrabold text-white text-sm">فرمانده مافیا (شما)</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-400/60 text-amber-300">
                    لیگ طلایی
                  </span>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#182334] border-2 border-rose-500 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  🎩
                </div>
              </div>
            </div>

            {/* Rank 3: Alireza Detective */}
            <div className="p-4 rounded-2xl bg-[#0d1624] border border-slate-700 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="font-black text-xl text-amber-600">#3</span>
                <div className="text-left font-mono">
                  <span className="font-extrabold text-purple-400 block">PTS 980</span>
                  <span className="text-emerald-400 text-xs">برد: ۵۸.۳%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="font-extrabold text-white text-sm">علیرضا کارآگاه</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-600 text-slate-300">
                    لیگ نقره‌ای
                  </span>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#182334] border-2 border-slate-400 flex items-center justify-center text-xl">
                  🕵️
                </div>
              </div>
            </div>

            {/* Rank 4: Bahram Professional */}
            <div className="p-4 rounded-2xl bg-[#0d1624] border border-slate-800 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <span className="font-black text-xl text-orange-600">#4</span>
                <div className="text-left font-mono">
                  <span className="font-extrabold text-purple-400 block">PTS 890</span>
                  <span className="text-emerald-400 text-xs">برد: ۵۲.۱%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h4 className="font-extrabold text-white text-sm">بهرام حرفه‌ای</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-700/40 text-amber-400">
                    لیگ برنز
                  </span>
                </div>
                <div className="w-11 h-11 rounded-full bg-[#182334] border-2 border-orange-700 flex items-center justify-center text-xl">
                  🤵
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1621] border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-white">ساخت عمارت بازی مافیا</h3>
            <form onSubmit={handleCreateRoom} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">نام عمارت</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="مثال: عمارت کاستلو (۹ نفره)"
                  className="w-full bg-[#17212b] border border-[#242f3d] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewRoomScenario(9)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    newRoomScenario === 9 ? 'bg-emerald-600 text-white' : 'bg-[#17212b] text-slate-400'
                  }`}
                >
                  سناریوی ۹ نفره
                </button>
                <button
                  type="button"
                  onClick={() => setNewRoomScenario(12)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    newRoomScenario === 12 ? 'bg-emerald-600 text-white' : 'bg-[#17212b] text-slate-400'
                  }`}
                >
                  سناریوی ۱۲ نفره
                </button>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#17212b] text-slate-400 rounded-xl text-xs"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  ایجاد عمارت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
