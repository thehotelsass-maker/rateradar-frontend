import { useState, useEffect } from 'react';
import { ListChecks, Loader2, TrendingUp, AlertTriangle, Eye, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { metricsApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { getCache, setCache } from '@/lib/clientCache';
import { cn } from '@/lib/utils';
import ExelyStateCard, { classifyExelyError } from '@/components/ExelyStateCard';

/**
 * DIQQAT TALAB QILADIGAN KUNLAR.
 *
 * Mahsulotdagi boshqa hamma tavsiya KANAL bo'yicha ("Booking.com narxini
 * $86 qiling"). Lekin mehmonxona narxni kanalga emas, KUNGA qo'yadi.
 * Bu karta bitta savolga javob beradi: bugun qaysi kunlarga qarashim kerak.
 *
 * Signallar o'lchangan talabdan chiqadi (Exely bronlari), narx
 * taqqoslashidan emas — sababi actionList.service.js izohida.
 */

const ACTION_STYLE = {
  raise: {
    icon: TrendingUp,
    chip: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    stripe: 'bg-emerald-500',
  },
  act: {
    icon: AlertTriangle,
    chip: 'bg-rose-500/12 text-rose-700 dark:text-rose-400 border-rose-500/25',
    stripe: 'bg-rose-500',
  },
  watch: {
    icon: Eye,
    chip: 'bg-amber-500/12 text-amber-700 dark:text-amber-500 border-amber-500/25',
    stripe: 'bg-amber-500',
  },
};

const MONTHS = {
  uz: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
  ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** "2026-09-09" + "2026-09-10" → "9–10 sen" */
function rangeLabel(from, to, lang) {
  const m = MONTHS[lang] || MONTHS.en;
  const a = new Date(`${from}T00:00:00Z`);
  const b = new Date(`${to}T00:00:00Z`);
  const da = a.getUTCDate();
  const db = b.getUTCDate();
  const ma = m[a.getUTCMonth()];
  const mb = m[b.getUTCMonth()];
  if (from === to) return `${da} ${ma}`;
  if (ma === mb) return `${da}–${db} ${ma}`;
  return `${da} ${ma} – ${db} ${mb}`;
}

export default function ActionListCard() {
  const lang = useLang((s) => s.lang);
  const L = (uz, ru, en) => (lang === 'uz' ? uz : lang === 'ru' ? ru : en);

  const [data, setData] = useState(() => getCache(`actions:${lang}`, 30 * 60_000));
  const [loading, setLoading] = useState(!data);
  const [failState, setFailState] = useState(null);

  useEffect(() => {
    let alive = true;
    metricsApi.actions(21, lang)
      .then((d) => { if (alive) { setData(d); setCache(`actions:${lang}`, d); } })
      .catch((err) => { if (alive) setFailState(classifyExelyError(err)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [lang]);

  // Exely ulanmagan — PerformanceCard buni allaqachon tushuntiradi.
  // Ulanmagan bo'lsa JIM turamiz — PerformanceCard buni allaqachon
  // tushuntiradi va bitta xabarni ikki marta ko'rsatish keraksiz.
  // Boshqa xatolarda esa jimlik = bo'sh ekran, shuning uchun aytamiz.
  if (failState === 'not_connected') return null;
  if (failState) return <ExelyStateCard state={failState} compact />;

  if (loading) {
    return (
      <Card><CardContent className="py-8 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </CardContent></Card>
    );
  }
  if (!data) return null; // ma'lumot yetarli emas — karta ko'rsatilmaydi

  const groups = data.groups || [];
  const urgent = groups.filter((g) => g.severity === 'high').length;

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
          <ListChecks className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">
            {L('Diqqat talab qiladigan kunlar', 'Дни, требующие внимания', 'Dates that need attention')}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {L('Kelasi 21 kun · o‘lchangan talab bo‘yicha', 'Ближайшие 21 день · по измеренному спросу', 'Next 21 days · by measured demand')}
          </div>
        </div>
        {urgent > 0 && (
          <span className="shrink-0 rounded-full bg-rose-500/12 text-rose-700 dark:text-rose-400 border border-rose-500/25 px-2.5 py-0.5 text-[11px] font-medium tabular-nums">
            {urgent} {L('shoshilinch', 'срочных', 'urgent')}
          </span>
        )}
      </div>

      <CardContent className="p-5">
        {groups.length === 0 ? (
          <div className="text-sm text-muted-foreground py-2">
            {L('Kelasi 21 kunda e‘tibor talab qiladigan kun yo‘q — sur‘at o‘tgan yilgidek va to‘lib ketayotgan kun ham yo‘q.',
               'В ближайший 21 день нет дат, требующих внимания — темп как год назад, переполненных дат нет.',
               'No dates need attention in the next 21 days — pace matches last year and nothing is filling up.')}
          </div>
        ) : (
          <div className="space-y-2">
            {groups.map((g, i) => {
              const st = ACTION_STYLE[g.action] || ACTION_STYLE.watch;
              const Icon = st.icon;
              return (
                <div key={i} className="flex gap-0 rounded-xl border border-border/60 overflow-hidden bg-muted/25">
                  {/* Jiddiylik chizig'i — holat rangdan tashqari SHAKLDA ham ko'rinadi */}
                  <div className={cn('w-1 shrink-0', st.stripe, g.severity === 'medium' && 'opacity-45')} />
                  <div className="flex-1 min-w-0 px-3.5 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm tabular-nums">
                        {rangeLabel(g.from, g.to, lang)}
                      </span>
                      <span className={cn('inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium', st.chip)}>
                        <Icon className="h-3 w-3" />
                        {g.action === 'raise' ? L('ko‘tarish', 'поднять', 'raise')
                          : g.action === 'act' ? L('chora ko‘rish', 'действовать', 'act')
                          : L('kuzatish', 'наблюдать', 'watch')}
                      </span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {g.daysOut === 0 ? L('bugun', 'сегодня', 'today') : `${g.daysOut} ${L('kun qoldi', 'дн.', 'days out')}`}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.reason}</p>
                    {g.prices?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {g.prices.map((p) => (
                          <span key={p.channel} className="rounded-md bg-card border border-border/60 px-2 py-0.5 text-[10px] tabular-nums">
                            {p.channel} <b className="font-semibold">${p.price}</b>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Halollik: narx faqat shuncha kunga ma'lum. Yashirmaymiz. */}
        <div className="flex items-start gap-1.5 mt-3.5 pt-3 border-t border-border/50 text-[10.5px] text-muted-foreground leading-relaxed">
          <Info className="h-3.5 w-3.5 shrink-0 mt-px" />
          <span>
            {L(`Signallar o‘z bronlaringizdan o‘lchanadi va o‘tgan yilning AYNAN shu bosqichi bilan solishtiriladi. Narx faqat ${data.priceCoverageDays} kunga ma‘lum — undan naridagi kunlarga narx ko‘rsatilmaydi.`,
               `Сигналы измеряются по вашим броням и сравниваются с тем же этапом прошлого года. Цена известна лишь на ${data.priceCoverageDays} дн. вперёд.`,
               `Signals are measured from your own bookings against the same point last year. Price is known for only ${data.priceCoverageDays} days ahead.`)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
