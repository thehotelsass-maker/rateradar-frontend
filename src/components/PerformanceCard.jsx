import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
} from 'recharts';
import { BedDouble, Loader2, TrendingUp, Info, Link2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { metricsApi, hotelApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { getCache, setCache } from '@/lib/clientCache';
import { cn, formatUzsCompact } from '@/lib/utils';
import ExelyStateCard, { classifyExelyError } from '@/components/ExelyStateCard';

/**
 * MENING KO'RSATKICHLARIM — occupancy / ADR / RevPAR.
 *
 * Manba: Exely'dan kelgan O'Z bronlarim. Raqiblar narxidan farqi — bu
 * yerda taxmin yo'q: sotilgan tun ham, tushum ham aniq.
 *
 * Grafik ATAYIN BITTA o'lchovni ko'rsatadi (to'lish darajasi). ADR va
 * RevPAR alohida kataklarda: ularni bitta grafikka ikkinchi o'q bilan
 * qo'shish ikki xil shkalani bir joyda ko'rsatish bo'lardi va bu
 * eng keng tarqalgan grafik xatosi.
 */

const PERIODS = [30, 90];

/**
 * SIG'IMNI JOYIDA TUZATISH.
 *
 * Xona soni maydoni Sozlamalarda ham bor, lekin u yerda boshqa o'nlab
 * maydon orasida turadi va NEGA muhimligi ko'rinmaydi. Foydalanuvchi
 * muammoni AYNAN shu yerda — noto'g'ri foizni ko'rgan joyida — ko'radi,
 * demak tuzatish ham shu yerda bo'lishi kerak.
 *
 * Maydon bo'sh emas: tarixdan aniqlangan taxmin oldindan yozilgan.
 * Mehmonxonaga "29 ta bo'lsa kerak, to'g'rimi?" deb tasdiqlash
 * nol maydonni to'ldirishdan ancha oson.
 */
function CapacityFix({ suggested, onSaved, L }) {
  const [rooms, setRooms] = useState(String(suggested || ''));
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function save(e) {
    e.preventDefault();
    const n = Number(rooms);
    if (!Number.isFinite(n) || n <= 0) return;
    setSaving(true);
    try {
      await hotelApi.update({ rooms: n });
      setDone(true);
      onSaved?.();
    } catch { /* xato bo'lsa maydon o'z holicha qoladi — qayta urinadi */ }
    finally { setSaving(false); }
  }

  if (done) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
        <Check className="h-3.5 w-3.5" />
        {L('Saqlandi — ko‘rsatkichlar qayta hisoblandi',
           'Сохранено — показатели пересчитаны',
           'Saved — metrics recalculated')}
      </div>
    );
  }

  return (
    <form onSubmit={save} className="flex flex-wrap items-center gap-2">
      <label htmlFor="cap-rooms" className="text-[11px] text-muted-foreground">
        {L('Nechta xonangiz bor?', 'Сколько у вас номеров?', 'How many rooms do you have?')}
      </label>
      <input
        id="cap-rooms"
        type="number"
        min="1"
        value={rooms}
        onChange={(e) => setRooms(e.target.value)}
        className="w-20 h-7 rounded-md border border-border bg-card px-2 text-xs tabular-nums
                   focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <button
        type="submit"
        disabled={saving || !Number(rooms)}
        className="h-7 rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground
                   disabled:opacity-50 hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
      >
        {saving && <Loader2 className="h-3 w-3 animate-spin" />}
        {L('Saqlash', 'Сохранить', 'Save')}
      </button>
    </form>
  );
}

function ymd(d) { return d.toISOString().slice(0, 10); }

export default function PerformanceCard() {
  const lang = useLang((s) => s.lang);
  const L = (uz, ru, en) => (lang === 'uz' ? uz : lang === 'ru' ? ru : en);

  const [days, setDays] = useState(30);
  const cacheKey = `ownMetrics:${days}`;
  const [data, setData] = useState(() => getCache(cacheKey, 30 * 60_000));
  const [daily, setDaily] = useState(() => getCache(`ownDaily:${days}`, 30 * 60_000));
  const [loading, setLoading] = useState(!data);
  const [failState, setFailState] = useState(null);
  // Xona soni saqlangach metrikani qayta so'raymiz (sig'im maxraji o'zgaradi).
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    // reloadKey o'zgargan bo'lsa kesh eskirgan — to'g'ridan-to'g'ri serverdan.
    const cached = reloadKey ? null : getCache(cacheKey, 30 * 60_000);
    setData(cached);
    setDaily(getCache(`ownDaily:${days}`, 30 * 60_000));
    setLoading(!cached);

    const to = new Date(); to.setUTCHours(0, 0, 0, 0);
    const from = new Date(to.getTime() - (days - 1) * 86400_000);

    Promise.all([
      metricsApi.summary(ymd(from), ymd(to)),
      metricsApi.daily(ymd(from), ymd(to)),
    ])
      .then(([s, d]) => {
        if (!alive) return;
        setData(s); setCache(cacheKey, s);
        setDaily(d); setCache(`ownDaily:${days}`, d);
        setFailState(null);
      })
      .catch((err) => { if (alive) setFailState(classifyExelyError(err)); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [days, reloadKey]);

  // Har qanday sabab bilan ma'lumot yo'q — foydalanuvchiga aytiladi.
  if (failState) return <ExelyStateCard state={failState} />;

  if (loading) {
    return (
      <Card><CardContent className="py-10 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </CardContent></Card>
    );
  }
  if (!data) return <ExelyStateCard state="error" />;

  const chart = (daily?.days || []).map((d) => ({
    date: d.date.slice(5),      // MM-DD — o'q yorlig'i qisqa bo'lsin
    occupancy: d.occupancy ?? 0,
    adr: d.adr,
    roomNights: d.roomNights,
  }));

  const tiles = [
    { key: 'occ',  label: L('To‘lish', 'Загрузка', 'Occupancy'), value: data.occupancy != null ? `${data.occupancy}%` : '—', accent: true },
    { key: 'adr',  label: 'ADR',    value: formatUzsCompact(data.adr, lang),    sub: L('o‘rtacha tun narxi', 'средняя цена ночи', 'avg nightly rate') },
    { key: 'rp',   label: 'RevPAR', value: formatUzsCompact(data.revPar, lang), sub: L('mavjud xonaga tushum', 'доход на номер', 'revenue per available room') },
    { key: 'rn',   label: L('Sotilgan tun', 'Продано ночей', 'Room-nights'), value: String(data.roomNights),
      sub: `/ ${data.availableRoomNights}` },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border/60 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">
            {L('Mening ko‘rsatkichlarim', 'Мои показатели', 'My performance')}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {L('O‘z bronlaringizdan hisoblangan', 'Рассчитано по вашим броням', 'Computed from your own bookings')}
          </div>
        </div>
        <div className="flex rounded-lg bg-muted/60 p-0.5 shrink-0">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setDays(p)}
              className={cn('px-2.5 py-1 text-[11px] rounded-md transition-colors',
                days === p ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground')}
            >
              {p} {L('kun', 'дн', 'd')}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Asosiy raqamlar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {tiles.map((t) => (
            <div key={t.key} className={cn('rounded-xl px-3 py-2.5',
              t.accent ? 'bg-primary/[0.07] border border-primary/20' : 'bg-muted/40')}>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.label}</div>
              <div className={cn('font-semibold tabular-nums leading-tight mt-0.5',
                t.accent ? 'text-xl text-primary' : 'text-lg')}>{t.value}</div>
              {t.sub && <div className="text-[10px] text-muted-foreground mt-0.5">{t.sub}</div>}
            </div>
          ))}
        </div>

        {/* To'lish darajasi vaqt bo'yicha — BITTA o'lchov, bitta o'q */}
        <div>
          <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" />
            {L('To‘lish darajasi, kunlik', 'Загрузка по дням', 'Daily occupancy')}
          </div>
          <ResponsiveContainer width="100%" height={180} minWidth={0}>
            {/* left: 0 — manfiy chekka '100%' yorlig'ining birinchi raqamini kesib tashlaydi */}
            <AreaChart data={chart} margin={{ top: 6, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.4)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false} axisLine={false} width={44} domain={[0, 100]}
                tickFormatter={(v) => `${v}%`} />
              <ReTooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))',
                  borderRadius: '8px', fontSize: '11px' }}
                separator=" "
                formatter={(v, _n, p) => [
                  `${v}%  ·  ${p.payload.roomNights} ${L('tun', 'ноч.', 'nights')}${p.payload.adr ? `  ·  ADR ${formatUzsCompact(p.payload.adr, lang)}` : ''}`,
                  L('To‘lish', 'Загрузка', 'Occupancy'),
                ]}
              />
              <Area type="monotone" dataKey="occupancy" stroke="hsl(var(--primary))" strokeWidth={2}
                fill="url(#occGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--card))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Halollik: sig'im taxminiy bo'lsa yoki kurs yetishmasa — aytamiz */}
        {(data.capacity?.estimated || data.coverage?.ok === false) && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 px-3 py-2 text-[11px] flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {data.capacity?.estimated && (
                <div className="space-y-1.5">
                  <div>
                    {L(`Xona soni kiritilmagan — tarixdagi eng band tun bo‘yicha ${data.capacity.rooms} ta deb taxmin qilindi. To‘lish darajasi shunga bog‘liq.`,
                       `Количество номеров не указано — по самой загруженной ночи принято ${data.capacity.rooms}. От этого зависит загрузка.`,
                       `Room count not set — assumed ${data.capacity.rooms} from your busiest night. Occupancy depends on it.`)}
                  </div>
                  <CapacityFix
                    suggested={data.capacity.rooms}
                    L={L}
                    onSaved={() => setReloadKey((k) => k + 1)}
                  />
                </div>
              )}
              {data.coverage?.ok === false && (
                <div>
                  {L(`${data.coverage.skippedNights} tun valyuta kursi topilmagani uchun tushum hisobiga kirmadi.`,
                     `${data.coverage.skippedNights} ночей не вошли в доход — не найден курс валюты.`,
                     `${data.coverage.skippedNights} nights excluded from revenue — missing FX rate.`)}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
