import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Loader2, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { hotelApi } from '@/lib/api';
import { useT, useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { getCache, setCache } from '@/lib/clientCache';

const CAT_LABELS = {
  // Booking.com subscore'lari (skreyper fallback)
  Location: { uz: 'Joylashuv', ru: 'Расположение', en: 'Location' },
  Cleanliness: { uz: 'Tozalik', ru: 'Чистота', en: 'Cleanliness' },
  Staff: { uz: 'Xizmat (xodimlar)', ru: 'Персонал', en: 'Staff' },
  Comfort: { uz: 'Qulaylik', ru: 'Комфорт', en: 'Comfort' },
  Facilities: { uz: 'Qulayliklar', ru: 'Удобства', en: 'Facilities' },
  'Value for money': { uz: 'Narx-sifat', ru: 'Цена/качество', en: 'Value for money' },
  'Free Wifi': { uz: 'Wi-Fi', ru: 'Wi-Fi', en: 'Free WiFi' },
  // Google Hotels reviews_breakdown kategoriyalari (SerpAPI — asosiy manba)
  Service: { uz: 'Xizmat', ru: 'Сервис', en: 'Service' },
  Property: { uz: 'Bino va hudud', ru: 'Здание и территория', en: 'Property' },
  Room: { uz: 'Xona', ru: 'Номер', en: 'Room' },
  Rooms: { uz: 'Xonalar', ru: 'Номера', en: 'Rooms' },
  Breakfast: { uz: 'Nonushta', ru: 'Завтрак', en: 'Breakfast' },
  Dining: { uz: 'Ovqatlanish', ru: 'Питание', en: 'Dining' },
  Bar: { uz: 'Bar', ru: 'Бар', en: 'Bar' },
  Pool: { uz: 'Basseyn', ru: 'Бассейн', en: 'Pool' },
  Fitness: { uz: 'Fitnes', ru: 'Фитнес', en: 'Fitness' },
  Wellness: { uz: 'Sog\'lomlashtirish', ru: 'Велнес', en: 'Wellness' },
  Sleep: { uz: 'Uyqu', ru: 'Сон', en: 'Sleep' },
  Atmosphere: { uz: 'Muhit', ru: 'Атмосфера', en: 'Atmosphere' },
  Parking: { uz: 'Avtoturargoh', ru: 'Парковка', en: 'Parking' },
  Bathroom: { uz: 'Hammom', ru: 'Ванная', en: 'Bathroom' },
  Safety: { uz: 'Xavfsizlik', ru: 'Безопасность', en: 'Safety' },
  'Nearby activities': { uz: 'Atrofdagi mashg\'ulotlar', ru: 'Развлечения рядом', en: 'Nearby activities' },
  Accessibility: { uz: 'Qulaylik (nogironlar)', ru: 'Доступность', en: 'Accessibility' },
};
const catLabel = (label, lang) => CAT_LABELS[label]?.[lang] || label;
const scoreBarColor = (v) => (v >= 9 ? 'bg-emerald-500' : v >= 8 ? 'bg-blue-500' : v >= 7 ? 'bg-amber-500' : 'bg-rose-500');

/**
 * Kategoriya reytinglari kartasi — o'zi yuklaydi (SerpAPI Google Hotels,
 * fallback skreyper). Dashboard'da ham, Reyting xaritasi'da ham ishlatish mumkin.
 */
export default function CategoryRatingsCard({ hotelId }) {
  const t = useT();
  const lang = useLang((s) => s.lang);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback((refresh = false) => {
    const key = hotelId ? `catRatings:${hotelId}` : null;
    const cached = key ? getCache(key, 24 * 3600_000) : null; // 24 soat
    if (cached && !refresh) setData(cached);
    setLoading(true);
    hotelApi
      .categoryRatings(refresh)
      .then((res) => { setData(res); if (key) setCache(key, res); })
      .catch(() => { if (!cached) setData({ configured: false, categories: [] }); })
      .finally(() => setLoading(false));
  }, [hotelId]);

  useEffect(() => { load(false); /* eslint-disable-next-line */ }, [hotelId]);

  const cats = data?.categories || [];

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="px-5 py-3 border-b flex items-center justify-between">
        <div className="text-sm font-semibold">{t('categoryRatings') || 'Kategoriya reytinglari'}</div>
        <button
          onClick={() => load(true)}
          disabled={loading}
          title={lang === 'uz' ? 'Yangilash' : lang === 'ru' ? 'Обновить' : 'Refresh'}
          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
        </button>
      </div>
      <CardContent className="p-5">
        {loading && !cats.length ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : cats.length === 0 ? (
          <div className="py-8 text-center">
            <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">
              {lang === 'uz' ? "Reyting ma'lumoti yo'q — yangilang." : lang === 'ru' ? 'Нет данных — обновите.' : 'No rating data — refresh.'}
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => load(true)} disabled={loading}>
              <RefreshCw className={cn('h-3.5 w-3.5 mr-1.5', loading && 'animate-spin')} />
              {t('refresh') || 'Yangilash'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {data?.overall > 0 && (
              <div className="flex items-center justify-between pb-2 mb-1 border-b border-border/40">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {lang === 'uz' ? 'Umumiy' : lang === 'ru' ? 'Общий' : 'Overall'}
                </span>
                <span className="text-lg font-bold tabular-nums">{data.overall.toFixed(1)}</span>
              </div>
            )}
            {cats.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{catLabel(c.label, lang)}</span>
                  <span className="text-sm font-semibold tabular-nums">{c.value.toFixed(1)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', scoreBarColor(c.value))}
                    style={{ width: `${Math.min(100, c.value * 10)}%` }}
                  />
                </div>
              </div>
            ))}
            {data?.asOf && (
              <div className="text-[10px] text-muted-foreground pt-1">
                {data.source || 'Booking.com'} · {new Date(data.asOf).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uz' ? 'uz-UZ' : 'en-US', { day: 'numeric', month: 'short' })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
