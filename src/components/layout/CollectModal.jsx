import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Search, DollarSign, MessageSquare, Sparkles } from 'lucide-react';
import { hotelApi } from '@/lib/api';
import { onCollectProgress, onDataReady } from '@/lib/socket';
import { cn } from '@/lib/utils';

// Onboarding ma'lumot yig'ish modali — hotel qo'shilgach to'la ekranni bloklaydi
// va "collecting" tugaguncha (collectStatus === 'ready') panelga kirishni to'sadi.
// Jonli progressni socket'dan, birinchi holatni esa collect-status API'dan oladi.

const STEPS = [
  { key: 'start',       icon: Sparkles,       label: 'Boshlanmoqda' },
  { key: 'competitors', icon: Search,         label: 'Raqobatchilar aniqlanmoqda' },
  { key: 'prices',      icon: DollarSign,     label: 'Narxlar yig\'ilmoqda' },
  { key: 'reviews',     icon: MessageSquare,  label: 'Sharhlar yig\'ilmoqda' },
  { key: 'done',        icon: CheckCircle2,   label: 'Tayyor' },
];

const STEP_INDEX = Object.fromEntries(STEPS.map((s, i) => [s.key, i]));

export function CollectModal({ hotel, onReady }) {
  const hotelId = hotel?._id;
  const blocking =
    hotel && (hotel.collectStatus === 'collecting' || hotel.collectStatus === 'pending');

  const [pct, setPct] = useState(hotel?.collectProgress?.pct || 5);
  const [label, setLabel] = useState(hotel?.collectProgress?.label || 'Ma\'lumotlar yig\'ilmoqda');
  const [stepKey, setStepKey] = useState(hotel?.collectProgress?.step || 'start');

  // Socket: jonli progress + tugash
  useEffect(() => {
    if (!blocking || !hotelId) return;

    const offProgress = onCollectProgress((p) => {
      if (String(p.hotelId) !== String(hotelId)) return;
      if (typeof p.pct === 'number') setPct(p.pct);
      if (p.label) setLabel(p.label);
      if (p.step) setStepKey(p.step);
    });

    const offReady = onDataReady((p) => {
      if (String(p.hotelId) !== String(hotelId)) return;
      setPct(100);
      setStepKey('done');
      setTimeout(() => onReady?.(), 600); // qisqa "Tayyor" ko'rsatib yopamiz
    });

    return () => { offProgress(); offReady(); };
  }, [blocking, hotelId, onReady]);

  // Fallback: socket o'tkazib yuborsa, har 4s'da holatni so'raymiz.
  useEffect(() => {
    if (!blocking || !hotelId) return;
    const t = setInterval(async () => {
      try {
        const s = await hotelApi.collectStatus();
        if (typeof s?.progress?.pct === 'number') setPct(s.progress.pct);
        if (s?.progress?.label) setLabel(s.progress.label);
        if (s?.progress?.step) setStepKey(s.progress.step);
        if (s?.status === 'ready') onReady?.();
      } catch { /* noop */ }
    }, 4000);
    return () => clearInterval(t);
  }, [blocking, hotelId, onReady]);

  if (!blocking) return null;

  const activeIdx = STEP_INDEX[stepKey] ?? 0;
  const isError = stepKey === 'error';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md mx-4 rounded-2xl border bg-card shadow-2xl p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            {isError
              ? <Search className="h-7 w-7" />
              : <Loader2 className="h-7 w-7 animate-spin" />}
          </div>

          <h2 className="text-lg font-semibold tracking-tight">
            {isError ? 'Xatolik yuz berdi' : 'Ma\'lumotlaringizni yig\'yapmiz'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isError
              ? 'Qaytadan urinib ko\'ring yoki sahifani yangilang.'
              : 'Bu 2-3 daqiqa davom etishi mumkin. Yopmang — tayyor bo\'lgach o\'zi ochiladi.'}
          </p>

          {/* Progress bar */}
          <div className="w-full mt-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2 tabular-nums">{label}</div>
          </div>

          {/* Bosqichlar */}
          <div className="w-full mt-6 space-y-2.5 text-left">
            {STEPS.filter((s) => s.key !== 'start').map((s) => {
              const idx = STEP_INDEX[s.key];
              const done = activeIdx > idx || stepKey === 'done';
              const active = activeIdx === idx && stepKey !== 'done';
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex items-center gap-3 text-sm">
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                    done ? 'bg-success-bg text-success'
                      : active ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground',
                  )}>
                    {done
                      ? <CheckCircle2 className="h-3.5 w-3.5" />
                      : active
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <span className={cn(
                    done ? 'text-foreground' : active ? 'text-foreground font-medium' : 'text-muted-foreground',
                  )}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
