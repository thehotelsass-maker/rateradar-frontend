import { useState, useEffect } from 'react';
import { TrendingUp, Users, User, BedDouble, Loader2, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { pricesApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { getCache, setCache } from '@/lib/clientCache';

/**
 * Narx signallari — raqib narxi NEGA o'zgardi.
 *   • BOZOR/SEZON  — bir nechta raqib birga ko'tardi (talab) → reaksiya kerak.
 *   • SHAXSIY      — bitta raqib ko'tardi (o'z holati) → informatsion.
 *   • OCCUPANCY    — arzon xonalar tugayapti (to'lish belgisi).
 */
export default function PriceSignalCard() {
  const lang = useLang((s) => s.lang);
  const L = (uz, ru, en) => (lang === 'uz' ? uz : lang === 'ru' ? ru : en);
  const [data, setData] = useState(() => getCache('priceSignals', 30 * 60_000));
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    let alive = true;
    pricesApi.signals()
      .then((res) => { if (alive) { setData(res); setCache('priceSignals', res); } })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  if (!data) return null;

  const m = data.movements?.market || {};
  const individual = data.movements?.individual || [];
  const occ = data.occupancy || [];
  const marketRising = m.rising;

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center shrink-0">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold">
            {L('Narx signallari', 'Ценовые сигналы', 'Price signals')}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {L('Raqiblar narxi nega o‘zgardi', 'Почему меняются цены конкурентов', 'Why competitor prices change')}
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Xulosa */}
        <div className={`rounded-xl p-3.5 text-sm ${
          marketRising ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40'
            : individual.length ? 'bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40'
            : 'bg-muted/40 border border-border/60'
        }`}>
          <div className="flex items-start gap-2.5">
            {marketRising ? <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              : individual.length ? <User className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              : <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />}
            <div>
              <div className="font-medium">{data.headline}</div>
              <div className="text-xs text-muted-foreground mt-1">{data.recommendation}</div>
            </div>
          </div>
        </div>

        {/* Bozor ko'rsatkichi */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 py-2">
            <div className="text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{m.risers || 0}</div>
            <div className="text-[10px] text-muted-foreground">{L('ko‘tardi', 'подняли', 'raised')}</div>
          </div>
          <div className="rounded-lg bg-muted/40 py-2">
            <div className="text-lg font-semibold tabular-nums text-rose-500">{m.fallers || 0}</div>
            <div className="text-[10px] text-muted-foreground">{L('tushirdi', 'снизили', 'lowered')}</div>
          </div>
          <div className="rounded-lg bg-muted/40 py-2">
            <div className="text-lg font-semibold tabular-nums">{m.total || 0}</div>
            <div className="text-[10px] text-muted-foreground">{L('jami raqib', 'конкурентов', 'competitors')}</div>
          </div>
        </div>

        {/* Occupancy signallari */}
        {occ.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5" /> {L('To‘lish belgilari', 'Признаки загрузки', 'Occupancy signals')}
            </div>
            {occ.slice(0, 4).map((o, i) => (
              <div key={i} className="text-xs flex items-center gap-2 rounded-lg bg-orange-50 dark:bg-orange-950/20 px-3 py-2">
                <span className="font-medium">{o.name}</span>
                <span className="text-muted-foreground">— {o.note}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
