import React, { useEffect, useState } from 'react';
import { MafiaMultiplayerPlatform } from '../components/MafiaMultiplayerPlatform';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const MafiaWebApp: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const platform = (window as any).__DETECTED_PLATFORM__ || 'telegram';
    const webApp = (window as any).Telegram?.WebApp;

    try {
      webApp?.ready?.();
      webApp?.expand?.();
    } catch {
      // Ignore
    }

    const initData = webApp?.initData || '';

    fetch('/api/webapp/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, initData }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setUserInfo(d.user);
          setAuthed(true);
        } else {
          setError(d.error || 'خطا در احراز هویت WebApp');
        }
      })
      .catch(() => {
        // Fallback for offline or client-side sandbox
        setAuthed(true);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 max-w-sm space-y-2">
          <h3 className="font-bold text-lg">خطا در احراز هویت مافیا WebApp</h3>
          <p className="text-xs text-slate-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0088cc] animate-spin" />
        <p className="text-sm font-semibold text-slate-300">در حال اتصال به پلتفرم مافیا آنلاین...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Top Mini App Banner */}
      <div className="bg-[#1e293b] border-b border-[#334155] px-4 py-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#0088cc]/20 text-[#0088cc] font-bold">Mini App</span>
          <span className="font-bold text-white">مافیا آنلاین چندنفره</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{userInfo?.firstName || 'بازیکن فعال'}</span>
        </div>
      </div>

      <MafiaMultiplayerPlatform />
    </div>
  );
};
