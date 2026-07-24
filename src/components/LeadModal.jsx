import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { leadApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';

// Telefon uchun davlatlar (nom + xalqaro kod + bayroq). Foydalanuvchi tanlaydi —
// shunda "telefon qaysi davlatdan" aniq bo'ladi.
const COUNTRIES = [
  { c: 'Uzbekistan', uz: 'O\'zbekiston', ru: 'Узбекистан', dial: '+998', flag: '🇺🇿' },
  { c: 'Russia', uz: 'Rossiya', ru: 'Россия', dial: '+7', flag: '🇷🇺' },
  { c: 'Kazakhstan', uz: 'Qozog\'iston', ru: 'Казахстан', dial: '+7', flag: '🇰🇿' },
  { c: 'Kyrgyzstan', uz: 'Qirg\'iziston', ru: 'Киргизия', dial: '+996', flag: '🇰🇬' },
  { c: 'Tajikistan', uz: 'Tojikiston', ru: 'Таджикистан', dial: '+992', flag: '🇹🇯' },
  { c: 'Turkmenistan', uz: 'Turkmaniston', ru: 'Туркмения', dial: '+993', flag: '🇹🇲' },
  { c: 'Turkey', uz: 'Turkiya', ru: 'Турция', dial: '+90', flag: '🇹🇷' },
  { c: 'UAE', uz: 'BAA', ru: 'ОАЭ', dial: '+971', flag: '🇦🇪' },
  { c: 'Azerbaijan', uz: 'Ozarbayjon', ru: 'Азербайджан', dial: '+994', flag: '🇦🇿' },
  { c: 'Georgia', uz: 'Gruziya', ru: 'Грузия', dial: '+995', flag: '🇬🇪' },
  { c: 'USA', uz: 'AQSH', ru: 'США', dial: '+1', flag: '🇺🇸' },
  { c: 'UK', uz: 'Buyuk Britaniya', ru: 'Великобритания', dial: '+44', flag: '🇬🇧' },
  { c: 'Germany', uz: 'Germaniya', ru: 'Германия', dial: '+49', flag: '🇩🇪' },
  { c: 'Other', uz: 'Boshqa', ru: 'Другое', dial: '+', flag: '🌐' },
];

const TXT = {
  uz: {
    demoTitle: 'Demo so\'rovi', demoSub: 'Ma\'lumotlaringizni qoldiring — demo ko\'rsatamiz.',
    yearlyTitle: 'Yillik reja uchun bog\'lanish', yearlySub: 'Ma\'lumotlaringizni qoldiring — biz siz bilan bog\'lanamiz.',
    name: 'Ismingiz', hotel: 'Mehmonxona nomi', country: 'Davlat', phone: 'Telefon raqami',
    email: 'Email (Gmail)', city: 'Shahar (ixtiyoriy)', message: 'Xabar (ixtiyoriy)',
    send: 'Yuborish', sending: 'Yuborilmoqda...',
    okTitle: 'Rahmat! So\'rovingiz yuborildi.', okSub: 'Tez orada siz bilan bog\'lanamiz.',
    close: 'Yopish', err: 'Yuborishda xatolik. Qayta urinib ko\'ring.',
  },
  ru: {
    demoTitle: 'Запрос демо', demoSub: 'Оставьте данные — покажем демо.',
    yearlyTitle: 'Связаться по годовому тарифу', yearlySub: 'Оставьте данные — мы свяжемся с вами.',
    name: 'Ваше имя', hotel: 'Название отеля', country: 'Страна', phone: 'Номер телефона',
    email: 'Email (Gmail)', city: 'Город (необязательно)', message: 'Сообщение (необязательно)',
    send: 'Отправить', sending: 'Отправка...',
    okTitle: 'Спасибо! Заявка отправлена.', okSub: 'Мы скоро с вами свяжемся.',
    close: 'Закрыть', err: 'Ошибка отправки. Попробуйте снова.',
  },
  en: {
    demoTitle: 'Request a demo', demoSub: 'Leave your details — we\'ll show you a demo.',
    yearlyTitle: 'Contact us for the yearly plan', yearlySub: 'Leave your details — we\'ll get in touch.',
    name: 'Your name', hotel: 'Hotel name', country: 'Country', phone: 'Phone number',
    email: 'Email (Gmail)', city: 'City (optional)', message: 'Message (optional)',
    send: 'Send', sending: 'Sending...',
    okTitle: 'Thank you! Your request was sent.', okSub: 'We\'ll contact you shortly.',
    close: 'Close', err: 'Failed to send. Please try again.',
  },
};

export function LeadModal({ onClose, variant = 'yearly', plan }) {
  const lang = useLang((s) => s.lang);
  const t = TXT[lang] || TXT.uz;
  const isDemo = variant === 'demo';

  const [form, setForm] = useState({
    name: '', hotel: '', phone: '', email: '', city: '', message: '', website: '',
  });
  const [country, setCountry] = useState(COUNTRIES[0]); // O'zbekiston default
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const label = (co) => (lang === 'uz' ? co.uz : lang === 'ru' ? co.ru : co.c);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const phoneFull = country.dial && country.dial !== '+'
        ? `${country.dial} ${form.phone}`.trim()
        : form.phone;
      await leadApi.submit({
        ...form,
        phone: phoneFull,
        country: `${country.flag} ${label(country)} (${country.dial})`,
        plan: plan || (isDemo ? 'Demo so\'rovi' : 'Yillik reja'),
      });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || t.err);
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl border bg-card shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">{isDemo ? t.demoTitle : t.yearlyTitle}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <div className="font-semibold">{t.okTitle}</div>
            <div className="text-sm text-muted-foreground mt-1">{t.okSub}</div>
            <Button className="mt-6 w-full" onClick={onClose}>{t.close}</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-5 space-y-3">
            <p className="text-xs text-muted-foreground -mt-1 mb-1">{isDemo ? t.demoSub : t.yearlySub}</p>

            <Input placeholder={t.name} value={form.name} onChange={set('name')} />
            <Input placeholder={t.hotel} value={form.hotel} onChange={set('hotel')} required />

            {/* Davlat + telefon */}
            <div className="flex gap-2">
              <select
                value={country.c + country.dial}
                onChange={(e) => setCountry(COUNTRIES.find((x) => x.c + x.dial === e.target.value) || COUNTRIES[0])}
                className="w-32 shrink-0 rounded-xl border border-input bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {COUNTRIES.map((co) => (
                  <option key={co.c + co.dial} value={co.c + co.dial}>{co.flag} {co.dial}</option>
                ))}
              </select>
              <Input
                className="flex-1" placeholder={t.phone} inputMode="tel"
                value={form.phone} onChange={set('phone')} required
              />
            </div>
            <div className="text-[11px] text-muted-foreground -mt-1.5">{t.country}: {country.flag} {label(country)}</div>

            <Input placeholder={t.email} type="email" value={form.email} onChange={set('email')} />
            {!isDemo && <Input placeholder={t.city} value={form.city} onChange={set('city')} />}
            {!isDemo && (
              <textarea
                placeholder={t.message} value={form.message} onChange={set('message')} rows={3}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            )}
            {/* Honeypot — ko'rinmas, faqat botlar to'ldiradi */}
            <input type="text" tabIndex={-1} autoComplete="off" value={form.website}
              onChange={set('website')} className="hidden" aria-hidden="true" />

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? t.sending : t.send}
            </Button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
