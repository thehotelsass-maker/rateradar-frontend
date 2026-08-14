import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, BedDouble, AlertTriangle } from 'lucide-react';
import { hotelApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { cn, useFormatPrice } from '@/lib/utils';

/**
 * Raqibning AYNAN BIR TUN uchun xona turlari.
 *
 * Rate Shopper jadvalida narx katakchasi bosilganda ochiladi. Savol har doim
 * aniq bo'ladi — "Mercure 13-avgustda nega $185?" — javob esa shu panelda:
 * qaysi xona turlari bor, qaysi biri qancha, va qaysisida "faqat X qoldi".
 *
 * `roomsLeft` bu yerda ikki marta qimmatli: raqibning to'lish darajasini
 * ko'rsatadi va o'sha ma'lumot occupancy signaliga ham boradi.
 *
 * Ma'lumot 20 soat keshlanadi (server tomonda RoomSnapshot) — bir katakchani
 * qayta-qayta ochish qo'shimcha skreyp krediti sarflamaydi.
 */
const TXT = {
  uz: {
    loading: 'Xona narxlari yig\'ilmoqda...', slow: 'Booking sahifasi o\'qilmoqda, 10-20 soniya',
    empty: 'Bu tun uchun xona ma\'lumoti topilmadi',
    emptyHint: 'Raqib bu sanaga yopiq bo\'lishi yoki Booking sahifasi o\'qilmagan bo\'lishi mumkin.',
    past_date: 'Bu sana o\'tib ketgan — o\'tgan tun uchun narx bo\'lmaydi. Sahifani yangilang.',
    no_booking_url: 'Bu raqibning Booking.com havolasi hali topilmagan. Narxlarni yangilaganingizda avtomatik topiladi.',
    guests: 'kishi', left: 'xona qoldi', refresh: 'Yangilash',
    rooms: 'xona turi', mine: 'Sizning eng arzon xonangiz', diff: 'farq',
    cached: 'keshdan', justNow: 'hozirgina',
  },
  ru: {
    loading: 'Собираем цены номеров...', slow: 'Читаем страницу Booking, 10-20 секунд',
    empty: 'Нет данных о номерах на эту ночь',
    emptyHint: 'Возможно, отель закрыт на эту дату или страница Booking не прочиталась.',
    past_date: 'Эта дата уже прошла — цен за прошедшую ночь не бывает. Обновите страницу.',
    no_booking_url: 'Ссылка на Booking.com для этого конкурента ещё не найдена. Она появится при обновлении цен.',
    guests: 'гостей', left: 'номера осталось', refresh: 'Обновить',
    rooms: 'типа номеров', mine: 'Ваш самый дешёвый номер', diff: 'разница',
    cached: 'из кэша', justNow: 'только что',
  },
  en: {
    loading: 'Fetching room prices...', slow: 'Reading the Booking page, 10-20 seconds',
    empty: 'No room data for this night',
    emptyHint: 'The hotel may be closed for this date, or the Booking page could not be read.',
    past_date: 'This date has passed — there are no rates for a past night. Refresh the page.',
    no_booking_url: 'No Booking.com link found for this competitor yet. It gets discovered when you refresh prices.',
    guests: 'guests', left: 'rooms left', refresh: 'Refresh',
    rooms: 'room types', mine: 'Your cheapest room', diff: 'difference',
    cached: 'cached', justNow: 'just now',
  },
};

export default function CompetitorRoomsPanel({ competitorId, competitorName, date, myPrice = 0 }) {
  const lang = useLang((s) => s.lang);
  const tx = TXT[lang] || TXT.en;
  const formatPrice = useFormatPrice();

  const [state, setState] = useState({ loading: true, rooms: null, error: false, cached: false, reason: null });
  const [slow, setSlow] = useState(false);

  async function load(force = false) {
    setState((s) => ({ ...s, loading: true, error: false }));
    setSlow(false);
    const slowTimer = setTimeout(() => setSlow(true), 3000);
    try {
      const d = await hotelApi.competitorRoomsByDate(competitorId, date, force);
      setState({ loading: false, rooms: d.rooms || [], error: false, cached: d.cached, reason: d.reason || null });
    } catch {
      setState({ loading: false, rooms: [], error: true, cached: false });
    } finally {
      clearTimeout(slowTimer);
    }
  }

  useEffect(() => {
    let alive = true;
    setState({ loading: true, rooms: null, error: false, cached: false, reason: null });
    hotelApi.competitorRoomsByDate(competitorId, date)
      .then((d) => {
        if (alive) setState({ loading: false, rooms: d.rooms || [], error: false, cached: d.cached, reason: d.reason || null });
      })
      .catch(() => { if (alive) setState({ loading: false, rooms: [], error: true, cached: false, reason: null }); });
    return () => { alive = false; };
  }, [competitorId, date]);

  const rooms = state.rooms || [];
  const cheapest = rooms.length ? Math.min(...rooms.map((r) => r.price)) : 0;

  return (
    <div className="px-4 py-3.5 bg-muted/25 border-l-2 border-primary/40">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <BedDouble className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold">{competitorName}</span>
          <span className="text-muted-foreground">· {date}</span>
          {rooms.length > 0 && (
            <span className="text-muted-foreground">· {rooms.length} {tx.rooms}</span>
          )}
          {state.cached && !state.loading && (
            <span className="text-[10px] text-muted-foreground/60">({tx.cached})</span>
          )}
        </div>
        <button
          onClick={() => load(true)}
          disabled={state.loading}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn('h-3 w-3', state.loading && 'animate-spin')} />
          {tx.refresh}
        </button>
      </div>

      {state.loading && (
        <div className="py-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>{slow ? tx.slow : tx.loading}</span>
        </div>
      )}

      {!state.loading && !rooms.length && (
        <div className="py-4 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            {tx.empty}
          </p>
          {/* Sabab ma'lum bo'lsa aniq aytamiz — "topilmadi" deb qoldirmaymiz. */}
          <p className="text-[11px] text-muted-foreground/70 mt-1 max-w-md mx-auto">
            {tx[state.reason] || tx.emptyHint}
          </p>
        </div>
      )}

      {!state.loading && rooms.length > 0 && (
        <div className="space-y-1">
          {rooms.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className={cn(
                'flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs',
                r.price === cheapest ? 'bg-background border border-primary/25' : 'bg-background/60',
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium truncate">{r.name}</span>
                {r.guests > 0 && (
                  <span className="text-muted-foreground shrink-0">{r.guests} {tx.guests}</span>
                )}
                {/* "Faqat X qoldi" — raqibning to'lish belgisi. */}
                {Number.isFinite(r.roomsLeft) && r.roomsLeft > 0 && r.roomsLeft <= 5 && (
                  <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {r.roomsLeft} {tx.left}
                  </span>
                )}
              </div>
              <span className="font-bold tabular-nums shrink-0">{formatPrice(r.price)}</span>
            </div>
          ))}

          {myPrice > 0 && cheapest > 0 && (
            <div className="flex items-center justify-between gap-3 px-3 pt-2.5 mt-1 border-t text-[11px]">
              <span className="text-muted-foreground">{tx.mine}: <b className="text-foreground">{formatPrice(myPrice)}</b></span>
              <span className={cn('font-semibold tabular-nums', cheapest > myPrice ? 'text-emerald-600' : 'text-rose-600')}>
                {tx.diff} {cheapest > myPrice ? '+' : ''}{formatPrice(cheapest - myPrice)}
                {' '}({Math.round(((cheapest - myPrice) / myPrice) * 100)}%)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
