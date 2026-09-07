import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Loader2, CalendarClock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { metricsApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { getCache, setCache } from '@/lib/clientCache';
import ExelyStateCard, { classifyExelyError } from '@/components/ExelyStateCard';

/**
 * PICKUP — kitob qanday to'ladi, o'tgan yil bilan yonma-yon.
 *
 * Nega bu xom to'lish foizidan muhimroq: bu mijozlarda bronning yarmi
 * KELGAN KUNI qilinadi. "Kelasi hafta 16% to'lgan" degani hech narsani
 * anglatmaydi — savol shu: o'tgan yili xuddi shu bosqichda qancha edi?
 *
 * RANGLAR tasodifiy emas — #2563eb/#4f83f1 (joriy) va #d97706 (o'tgan yil)
 * rang ko'rish buzilishi uchun ham ajralishi tekshirilgan (ΔE 32+).
 * O'tgan yil qatori uzuq chiziq — ya'ni identifikatsiya faqat rangga
 * tayanmaydi (chop etishda va monoxrom ekranda ham ajraladi).
 */

// Yorug'/qorong'i rejim uchun alohida qadamlar — avtomatik "aylantirish" emas.
function useChartColors() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setDark(el.classList.contains('dark')));
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return { current: dark ? '#4f83f1' : '#2563eb', lastYear: '#d97706' };
}

export default function PickupCard() {
  const lang = useLang((s) => s.lang);
  const L = (uz, ru, en) => (lang === 'uz' ? uz : lang === 'ru' ? ru : en);
  const colors = useChartColors();

  const [data, setData] = useState(() => getCache('ownPickup', 60 * 60_000));
  const [loading, setLoading] = useState(!data);
  const [failState, setFailState] = useState(null);

  useEffect(() => {
    let alive = true;
    metricsApi.pickup({ stly: true })
      .then((d) => { if (alive) { setData(d); setCache('ownPickup', d); } })
      .catch((err) => { if (alive) setFailState(classifyExelyError(err)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  // Exely ulanmagan — PerformanceCard allaqachon buni aytadi, takrorlamaymiz.
  // Ulanmagan bo'lsa JIM turamiz — PerformanceCard buni allaqachon
  // tushuntiradi va bitta xabarni ikki marta ko'rsatish keraksiz.
  // Boshqa xatolarda esa jimlik = bo'sh ekran, shuning uchun aytamiz.
  if (failState === 'not_connected') return null;
  if (failState) return <ExelyStateCard state={failState} compact />;

  if (loading) {
    return (
      <Card><CardContent className="py-10 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </CardContent></Card>
    );
  }
  if (!data?.current?.length || !data.lastYear?.length) return null; // ma'lumot yetarli emas — karta ko'rsatilmaydi

  const ly = Object.fromEntries(data.lastYear.map((x) => [x.daysBefore, x]));

  // Grafikda vaqt chapdan o'ngga oqadi: 60 kun oldin → kelish kuni.
  const rows = [...data.current]
    .sort((a, b) => b.daysBefore - a.daysBefore)
    .map((c) => {
      const l = ly[c.daysBefore] || { roomNights: 0, datesObservable: 0 };
      // Taqqoslash faqat ikkala yilda BIR XIL sondagi tun kuzatilganda halol.
      const comparable = c.datesObservable > 0 && c.datesObservable === l.datesObservable;
      return {
        label: c.daysBefore === 0 ? L('kelish', 'заезд', 'arrival') : `${c.daysBefore}`,
        daysBefore: c.daysBefore,
        current: c.roomNights,
        lastYear: l.roomNights,
        comparable,
        observed: c.datesObservable,
      };
    });

  // Sarlavha uchun eng ma'noli nuqta — 30 kun (yoki bor bo'lganlaridan
  // eng uzog'i). Yaqin nuqtalarda kuzatilgan tunlar kam qoladi.
  const anchor = rows.find((r) => r.daysBefore === 30 && r.comparable)
    || rows.find((r) => r.comparable && r.lastYear > 0);
  const delta = anchor && anchor.lastYear
    ? Math.round(((anchor.current - anchor.lastYear) / anchor.lastYear) * 100)
    : null;
  const Trend = delta == null ? Minus : delta > 5 ? TrendingUp : delta < -5 ? TrendingDown : Minus;
  const tone = delta == null ? 'muted' : delta > 5 ? 'up' : delta < -5 ? 'down' : 'flat';

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shrink-0">
          <CalendarClock className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">
            {L('Bron sur’ati', 'Темп бронирований', 'Booking pace')}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {data.period?.from} → {data.period?.to} · {L('o‘tgan yil bilan', 'в сравнении с прошлым годом', 'vs last year')}
          </div>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Xulosa — bir jumlada */}
        {anchor && (
          <div className={`rounded-xl p-3.5 text-sm border ${
            tone === 'up' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40'
            : tone === 'down' ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-800/40'
            : 'bg-muted/40 border-border/60'}`}>
            <div className="flex items-start gap-2.5">
              <Trend className={`h-4 w-4 shrink-0 mt-0.5 ${
                tone === 'up' ? 'text-emerald-600 dark:text-emerald-400'
                : tone === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'}`} />
              <div>
                <div className="font-medium">
                  {anchor.daysBefore} {L('kun qolganda', 'дней до заезда', 'days out')}: {anchor.current} {L('tun', 'ночей', 'nights')}
                  {' · '}
                  {L('o‘tgan yili', 'год назад', 'last year')} {anchor.lastYear}
                  {delta != null && ` (${delta > 0 ? '+' : ''}${delta}%)`}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tone === 'up'
                    ? L('Kitob o‘tgan yildan tez to‘lyapti — narxni ko‘tarish imkoni bor.',
                        'Бронирования идут быстрее прошлого года — есть запас для повышения цены.',
                        'Booking ahead of last year — room to raise rates.')
                    : tone === 'down'
                    ? L('Kitob o‘tgan yildan sekin to‘lyapti — narx yoki ko‘rinuvchanlikni ko‘rib chiqing.',
                        'Бронирования отстают от прошлого года — стоит пересмотреть цену или видимость.',
                        'Booking behind last year — review price or visibility.')
                    : L('Sur’at o‘tgan yilgidek — o‘zgartirishga shoshilmang.',
                        'Темп как в прошлом году — резких изменений не требуется.',
                        'Pace matches last year — no change needed.')}
                </div>
              </div>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={200} minWidth={0}>
          {/* left: 0 — manfiy chekka uch xonali qiymatlarni (160) kesadi */}
          <LineChart data={rows} margin={{ top: 6, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.4)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false} axisLine={false} width={44} allowDecimals={false} />
            <ReTooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
                borderRadius: '8px', fontSize: '11px' }}
              separator=" "
              labelFormatter={(v) => (v === L('kelish', 'заезд', 'arrival')
                ? L('Kelish kuni', 'День заезда', 'Arrival day')
                : `${v} ${L('kun qolganda', 'дн. до заезда', 'days out')}`)}
              formatter={(v, name) => [
                `${v} ${L('xona-tun', 'ночей', 'room-nights')}`,
                name === 'current' ? L('Joriy', 'Текущий', 'Current') : L('O‘tgan yil', 'Прошлый год', 'Last year'),
              ]}
            />
            <Legend iconType="line" wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              formatter={(v) => (v === 'current'
                ? L('Joriy', 'Текущий', 'Current')
                : L('O‘tgan yil', 'Прошлый год', 'Last year'))} />
            {/* O'tgan yil — uzuq chiziq: identifikatsiya rangga bog'liq emas */}
            <Line type="monotone" dataKey="lastYear" name="lastYear" stroke={colors.lastYear}
              strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="current" name="current" stroke={colors.current}
              strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>

        <p className="text-[10px] text-muted-foreground leading-relaxed">
          {L('Chap tomon — kelishdan uzoq, o‘ng tomon — kelish kuni. Kelasi kunlar uchun faqat kuzatish MUMKIN bo‘lgan nuqtalar ko‘rsatiladi: kelajakda kitobda nima bo‘lishini bilib bo‘lmaydi.',
             'Слева — далеко до заезда, справа — день заезда. Для будущих дат показаны только наблюдаемые точки: что будет в брони завтра, знать нельзя.',
             'Left is far from arrival, right is arrival day. Only observable points are shown for future dates.')}
        </p>
      </CardContent>
    </Card>
  );
}
