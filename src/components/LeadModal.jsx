import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { leadApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';

const TXT = {
  uz: {
    title: 'Yillik reja uchun bog\'lanish',
    sub: 'Ma\'lumotlaringizni qoldiring — biz siz bilan bog\'lanamiz.',
    name: 'Ismingiz', hotel: 'Mehmonxona nomi', phone: 'Telefon',
    email: 'Email (ixtiyoriy)', city: 'Shahar (ixtiyoriy)', message: 'Xabar (ixtiyoriy)',
    send: 'Yuborish', sending: 'Yuborilmoqda...',
    okTitle: 'Rahmat! So\'rovingiz yuborildi.', okSub: 'Tez orada siz bilan bog\'lanamiz.',
    close: 'Yopish', err: 'Yuborishda xatolik. Qayta urinib ko\'ring.',
  },
  ru: {
    title: 'Связаться по годовому тарифу',
    sub: 'Оставьте свои данные — мы свяжемся с вами.',
    name: 'Ваше имя', hotel: 'Название отеля', phone: 'Телефон',
    email: 'Email (необязательно)', city: 'Город (необязательно)', message: 'Сообщение (необязательно)',
    send: 'Отправить', sending: 'Отправка...',
    okTitle: 'Спасибо! Заявка отправлена.', okSub: 'Мы скоро с вами свяжемся.',
    close: 'Закрыть', err: 'Ошибка отправки. Попробуйте снова.',
  },
  en: {
    title: 'Contact us for the yearly plan',
    sub: 'Leave your details — we\'ll get in touch.',
    name: 'Your name', hotel: 'Hotel name', phone: 'Phone',
    email: 'Email (optional)', city: 'City (optional)', message: 'Message (optional)',
    send: 'Send', sending: 'Sending...',
    okTitle: 'Thank you! Your request was sent.', okSub: 'We\'ll contact you shortly.',
    close: 'Close', err: 'Failed to send. Please try again.',
  },
};

export function LeadModal({ onClose, plan = 'Yillik reja' }) {
  const lang = useLang((s) => s.lang);
  const t = TXT[lang] || TXT.uz;

  const [form, setForm] = useState({ name: '', hotel: '', phone: '', email: '', city: '', message: '', website: '' });
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

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await leadApi.submit({ ...form, plan });
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
            <span className="font-semibold text-sm">{t.title}</span>
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
            <p className="text-xs text-muted-foreground -mt-1 mb-1">{t.sub}</p>

            <Input placeholder={t.name} value={form.name} onChange={set('name')} required minLength={2} />
            <Input placeholder={t.hotel} value={form.hotel} onChange={set('hotel')} />
            <Input placeholder={t.phone} inputMode="tel" value={form.phone} onChange={set('phone')} required />
            <Input placeholder={t.email} type="email" value={form.email} onChange={set('email')} />
            <Input placeholder={t.city} value={form.city} onChange={set('city')} />
            <textarea
              placeholder={t.message} value={form.message} onChange={set('message')}
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
            {/* Honeypot — ko'rinmas, faqat botlar to'ldiradi */}
            <input
              type="text" tabIndex={-1} autoComplete="off"
              value={form.website} onChange={set('website')}
              className="hidden" aria-hidden="true"
            />

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
