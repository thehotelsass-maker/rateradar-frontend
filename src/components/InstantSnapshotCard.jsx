import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Zap, RefreshCw, TrendingUp, TrendingDown, ArrowRight, AlertTriangle, ChevronDown } from 'lucide-react';
import { hotelApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { useFormatPrice, cn } from '@/lib/utils';

const TXT = {
  uz: {
    title: 'Bepul narx tahlili',
    sub: 'TripAdvisor orqali 8+ OTA kanalidan — pulsiz',
    loading: 'Narxlaringiz yig\'ilmoqda (bepul)...',
    loadingHint: 'Birinchi marta biroz vaqt olishi mumkin — raqiblar topilmoqda',
    myPrice: 'Mening eng arzon narxim',
    marketAvg: 'Bozor o\'rtachasi',
    position: 'Bozordagi o\'rnim',
    of: 'dan',
    expensive: (p) => `Raqiblar sizdan o'rtacha ${p}% arzon`,
    cheaper: (p) => `Siz bozordan ${p}% arzonsiz — narxni oshirish imkoni bor`,
    onpar: 'Narxingiz bozor bilan deyarli mos',
    loss: (v) => `Taxminan ${v}/oy yo'qotyapsiz`,
    noOwn: 'Mehmonxonangiz TripAdvisor\'da topilmadi. Sozlamalarda TripAdvisor havolasini qo\'shing.',
    noComp: 'Raqiblar narxi topilmadi. Raqiblar sahifasida qo\'shing.',
    retry: 'Yangilash',
    details: 'Batafsil narxlar',
    free: 'BEPUL',
  },
  ru: {
    title: 'Бесплатный анализ цен',
    sub: 'Через TripAdvisor из 8+ OTA каналов — без оплаты',
    loading: 'Собираем ваши цены (бесплатно)...',
    loadingHint: 'Первый раз может занять время — ищем конкурентов',
    myPrice: 'Моя минимальная цена',
    marketAvg: 'Средняя по рынку',
    position: 'Моё место на рынке',
    of: 'из',
    expensive: (p) => `Конкуренты в среднем на ${p}% дешевле`,
    cheaper: (p) => `Вы на ${p}% дешевле рынка — можно поднять цену`,
    onpar: 'Ваша цена примерно на уровне рынка',
    loss: (v) => `Теряете примерно ${v}/мес`,
    noOwn: 'Отель не найден на TripAdvisor. Добавьте ссылку TripAdvisor в настройках.',
    noComp: 'Цены конкурентов не найдены. Добавьте их на странице конкурентов.',
    retry: 'Обновить',
    details: 'Подробные цены',
    free: 'БЕСПЛАТНО',
  },
  en: {
    title: 'Free price check',
    sub: 'From 8+ OTA channels via TripAdvisor — no cost',
    loading: 'Collecting your prices (free)...',
    loadingHint: 'First run may take a moment — finding competitors',
    myPrice: 'My lowest price',
    marketAvg: 'Market average',
    position: 'My market position',
    of: 'of',
    expensive: (p) => `Competitors are ${p}% cheaper on average`,
    cheaper: (p) => `You are ${p}% below market — room to raise price`,
    onpar: 'Your price is about on par with the market',
    loss: (v) => `Losing roughly ${v}/mo`,
    noOwn: 'Your hotel was not found on TripAdvisor. Add a TripAdvisor link in Settings.',
    noComp: 'No competitor prices found. Add them on the Competitors page.',
    retry: 'Refresh',
    details: 'Detailed prices',
    free: 'FREE',
  },
};

const STALE_MS = 6 * 60 * 60 * 1000; // 6 soat — shu vaqtdan keyin avto-yangilash

export default function InstantSnapshotCard() {
  const lang = useLang((s) => s.lang);
  const t = TXT[lang] || TXT.uz;
  const formatPrice = useFormatPrice();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  // Yig'iladigan (collapsible) — holat eslab qolinadi. Yopilsa, pastdagi
  // grafik/raqib kartalari tezroq ko'rinadi (kam scroll).
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('rr_snapshot_collapsed') === 'true'
  );
  function toggleCollapsed() {
    setCollapsed((v) => {
      const next = !v;
      try { localStorage.setItem('rr_snapshot_collapsed', String(next)); } catch {}
      return next;
    });
  }

  const run = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await hotelApi.instantSnapshot();
      setData(res);
      try { localStorage.setItem('rr_instant_at', String(Date.now())); } catch {}
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sahifaga kirilganda: oxirgi yangilanish 6 soatdan eski bo'lsa avto-ishga tushadi
  useEffect(() => {
    let last = 0;
    try { last = Number(localStorage.getItem('rr_instant_at') || 0); } catch {}
    if (Date.now() - last > STALE_MS) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = data?.summary;
  const myBest = data?.own?.bestPrice || 0;
  const hasOwn = myBest > 0;
  const hasComp = (s?.competitorsCount || 0) > 0;
  const gap = s?.gapPct || 0;

  // USD formatlash (Xotelo USD qaytaradi)
  const usd = (v) => `$${Math.round(v).toLocaleString('en-US')}`;

  return (
    <div >
      {/* Sarlavha — bosilsa yig'iladi/ochiladi */}
      

    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide truncate">{label}</p>
      <p className={cn('text-lg font-bold mt-1', accent ? 'text-primary' : 'text-foreground')}>{value}</p>
    </div>
  );
}
