import { Link } from 'react-router-dom';
import { Plug, ServerCrash, WifiOff, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLang } from '@/lib/i18n';

/**
 * EXELY MA'LUMOTI YO'Q BO'LGANDAGI HOLATLAR.
 *
 * Nega alohida komponent: ilgari har bir karta faqat 409 (ulanmagan)
 * holatini bilardi, qolgan har qanday xatoda esa `return null` qilardi.
 * Natijada 404, 500 yoki tarmoq uzilishida foydalanuvchi BUTUNLAY BO'SH
 * sahifa ko'rardi va nima bo'lganini bilmasdi — real hodisa: production
 * backend yangilanmagan bo'lgani uchun /exely sahifasi oq qolgan.
 *
 * Endi har bir holat aytiladi va nima qilish kerakligi ko'rsatiladi.
 */

/** Xatoni foydalanuvchiga tushunarli holatga aylantiradi. */
export function classifyExelyError(err) {
  const s = err?.response?.status;
  if (s === 409) return 'not_connected';   // ulanish yo'q — normal holat
  if (s === 404) return 'not_available';   // endpoint yo'q — server eski
  if (s === 401 || s === 403) return 'auth';
  if (!err?.response) return 'network';    // javob umuman kelmadi
  return 'error';
}

const ICON = {
  not_connected: Plug,
  not_available: ServerCrash,
  network: WifiOff,
  auth: AlertCircle,
  error: AlertCircle,
};

function text(state, L) {
  switch (state) {
    case 'not_connected':
      return {
        title: L('Exely hali ulanmagan', 'Exely ещё не подключён', 'Exely is not connected yet'),
        body: L('Ulangach bu yerda o‘z bronlaringiz tahlili paydo bo‘ladi: qaysi kanal pul keltiradi, qaysi xona turi bo‘sh qoladi, mehmonlar qachon bron qiladi.',
                'После подключения здесь появится анализ ваших броней: какой канал приносит доход, какой номер простаивает, когда бронируют гости.',
                'Once connected, this shows the analysis of your own bookings: which channel earns, which room type sits empty, when guests book.'),
        link: true,
      };
    case 'not_available':
      return {
        title: L('Bu bo‘lim serverda hali mavjud emas', 'Раздел ещё не доступен на сервере', 'This section is not available on the server yet'),
        body: L('Server eski versiyada ishlayapti — Exely bo‘limi hali yoqilmagan. Odatda bu yangilanish chiqqanda o‘tib ketadi. Bir necha daqiqadan keyin sahifani yangilang.',
                'Сервер работает на старой версии — раздел Exely ещё не включён. Обычно это проходит после обновления. Обновите страницу через несколько минут.',
                'The server is running an older version — the Exely section is not enabled yet. This usually clears after the next update. Refresh in a few minutes.'),
      };
    case 'network':
      return {
        title: L('Server bilan aloqa yo‘q', 'Нет связи с сервером', 'No connection to the server'),
        body: L('Internet aloqangizni tekshiring va sahifani yangilang. Muammo takrorlansa server vaqtincha ishlamayotgan bo‘lishi mumkin.',
                'Проверьте интернет и обновите страницу. Если повторяется — сервер может быть временно недоступен.',
                'Check your connection and refresh. If it persists, the server may be temporarily down.'),
      };
    case 'auth':
      return {
        title: L('Sessiya tugagan', 'Сессия истекла', 'Session expired'),
        body: L('Qaytadan tizimga kiring.', 'Войдите в систему заново.', 'Please sign in again.'),
      };
    default:
      return {
        title: L('Ma‘lumotni yuklab bo‘lmadi', 'Не удалось загрузить данные', 'Could not load the data'),
        body: L('Sahifani yangilab ko‘ring. Muammo takrorlansa bizga xabar bering.',
                'Попробуйте обновить страницу. Если повторится — сообщите нам.',
                'Try refreshing. If it keeps happening, let us know.'),
      };
  }
}

/**
 * @param {{state:string, compact?:boolean}} props
 *   compact — dashboard kartalari uchun ixcham qator (sahifa uchun to'liq karta).
 */
export default function ExelyStateCard({ state, compact = false }) {
  const lang = useLang((s) => s.lang);
  const L = (uz, ru, en) => (lang === 'uz' ? uz : lang === 'ru' ? ru : en);
  const t = text(state, L);
  const Icon = ICON[state] || AlertCircle;

  if (compact) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 flex items-start gap-2.5">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-xs font-medium">{t.title}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{t.body}</p>
            {t.link && (
              <Link to="/settings" className="inline-block mt-1.5 text-[11px] font-medium text-primary hover:underline">
                {L('Sozlamalar → Integratsiyalar', 'Настройки → Интеграции', 'Settings → Integrations')} →
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-6 flex items-start gap-3">
        <div className="rounded-lg bg-muted/60 p-2 mt-0.5"><Icon className="h-4 w-4 text-muted-foreground" /></div>
        <div className="min-w-0">
          <div className="font-semibold text-sm">{t.title}</div>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-xl">{t.body}</p>
          {t.link && (
            <Link to="/settings" className="inline-block mt-3 text-xs font-medium text-primary hover:underline">
              {L('Sozlamalar → Integratsiyalar', 'Настройки → Интеграции', 'Settings → Integrations')} →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
