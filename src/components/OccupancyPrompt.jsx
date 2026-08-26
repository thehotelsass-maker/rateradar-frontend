import { useState, useEffect } from 'react';
import { BedDouble, Check, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { hotelApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * HAFTALIK TO'LISH DARAJASI so'rovi.
 *
 * Nega bu bitta savol muhim: usiz narx tavsiyasi shunchaki raqiblar medianasi.
 * Mehmonxona yarim bo'sh bo'lsa, raqiblar qimmatligi narxni ko'tarish uchun
 * asos emas — aksincha. Bu javob tavsiyani revenue qaroriga aylantiradi.
 *
 * PMS integratsiyasi talab qilinmaydi: haftada bitta bosish yetarli.
 *
 * ⬆ 2026-08 dan: Exely ulangan mijozda bu SO'RALMAYDI. To'lish darajasi
 * bronlardan o'lchanadi va bu yerda faqat NATIJA ko'rsatiladi. Qo'lda
 * so'rov Exely'siz mijozlar uchun qoladi.
 */
const TXT = {
  uz: {
    q: 'Kelasi 7 kun to\'lish darajangiz qanday?',
    why: 'Bu javob narx tavsiyalarini aniqroq qiladi — bo\'sh xonalaringiz hisobga olinadi.',
    low: '40% dan past', mid: '40–70%', high: '70% dan yuqori',
    lowSub: 'bo\'sh xona ko\'p', midSub: 'normal', highSub: 'to\'lib boryapti',
    saved: 'Saqlandi — tavsiyalar yangilanmoqda',
    current: 'Bu hafta:', change: 'O\'zgartirish',
    measured: 'Kelasi 7 kun', ofPace: 'o\'tgan yilgi shu bosqichga nisbatan',
    src: 'Exely bronlaridan o\'lchandi',
  },
  ru: {
    q: 'Какая у вас заполняемость на ближайшие 7 дней?',
    why: 'Ответ уточняет ценовые рекомендации — учитываются ваши свободные номера.',
    low: 'ниже 40%', mid: '40–70%', high: 'выше 70%',
    lowSub: 'много свободных', midSub: 'нормально', highSub: 'заполняется',
    saved: 'Сохранено — рекомендации обновляются',
    current: 'На этой неделе:', change: 'Изменить',
    measured: 'Ближайшие 7 дней', ofPace: 'к тому же этапу год назад',
    src: 'Измерено по броням Exely',
  },
  en: {
    q: 'What is your occupancy for the next 7 days?',
    why: 'This makes price recommendations sharper — your empty rooms get taken into account.',
    low: 'below 40%', mid: '40–70%', high: 'above 70%',
    lowSub: 'many rooms free', midSub: 'normal', highSub: 'filling up',
    saved: 'Saved — recommendations updating',
    current: 'This week:', change: 'Change',
    measured: 'Next 7 days', ofPace: 'vs the same point last year',
    src: 'Measured from Exely bookings',
  },
};

const BANDS = ['low', 'mid', 'high'];

export default function OccupancyPrompt({ onChange }) {
  const lang = useLang((s) => s.lang);
  const tx = TXT[lang] || TXT.en;
  const [state, setState] = useState(null);   // { current, shouldAsk }
  const [saving, setSaving] = useState(null); // saqlanayotgan band
  const [justSaved, setJustSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let alive = true;
    hotelApi.getOccupancy()
      .then((d) => { if (alive) setState(d); })
      .catch(() => { if (alive) setState({ current: null, shouldAsk: false }); });
    return () => { alive = false; };
  }, []);

  async function pick(band) {
    setSaving(band);
    try {
      const res = await hotelApi.setOccupancy(band);
      setState((s) => ({ ...s, current: res.current, shouldAsk: false }));
      setExpanded(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
      onChange?.(band);
    } catch {
      /* xato bo'lsa holat o'zgarmaydi — foydalanuvchi qayta urinadi */
    } finally {
      setSaving(null);
    }
  }

  if (!state) return null;

  // ── O'LCHANGAN HOLAT (Exely) ───────────────────────────────────────
  // Bu yerda tugma yo'q: foydalanuvchining taxmini aniq o'lchovning
  // ustiga yozilishi mumkin emas.
  const cur = state.current;
  if (cur?.source === 'exely') {
    const pace = cur.pace;
    const ratioPct = pace?.ratio != null ? Math.round((pace.ratio - 1) * 100) : null;
    const tone = cur.band === 'high' ? 'text-emerald-600 dark:text-emerald-400'
      : cur.band === 'low' ? 'text-rose-600 dark:text-rose-400'
      : 'text-foreground';
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BedDouble className="h-3.5 w-3.5" />
          {tx.measured}: <b className={cn('text-sm tabular-nums', tone)}>{cur.occupancyPct}%</b>
          <span className="text-muted-foreground">({cur.roomNights}/{cur.capacity * cur.forwardDays})</span>
        </span>
        {ratioPct != null && (
          <span className={cn('tabular-nums', tone)}>
            {ratioPct > 0 ? '+' : ''}{ratioPct}% <span className="text-muted-foreground">{tx.ofPace}</span>
          </span>
        )}
        <span className="text-[10px] opacity-70">· {tx.src}</span>
      </div>
    );
  }

  const asking = state.shouldAsk || expanded;

  // Javob berilgan va o'zgartirilmayapti — ixcham holat.
  if (!asking) {
    if (!state.current) return null;
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <BedDouble className="h-3.5 w-3.5" />
        <span>{tx.current} <b className="text-foreground">{tx[state.current.band]}</b></span>
        <button onClick={() => setExpanded(true)} className="underline hover:text-foreground transition-colors">
          {tx.change}
        </button>
        {justSaved && (
          <span className="flex items-center gap-1 text-emerald-600">
            <Check className="h-3.5 w-3.5" />{tx.saved}
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
            <BedDouble className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{tx.q}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{tx.why}</p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {BANDS.map((band) => (
                <button
                  key={band}
                  onClick={() => pick(band)}
                  disabled={Boolean(saving)}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-left transition-all',
                    'hover:border-primary hover:bg-primary/5 disabled:opacity-60',
                    state.current?.band === band && 'border-primary bg-primary/10',
                  )}
                >
                  <span className="flex items-center gap-1.5 font-bold text-sm">
                    {saving === band && <Loader2 className="h-3 w-3 animate-spin" />}
                    {tx[band]}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">{tx[`${band}Sub`]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
