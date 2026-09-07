import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { create } from 'zustand';
import { useLang } from './i18n';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Hotel narxlari qaysi valyutada saqlangani — global state.
// Hozir foydalanilmaydi (narxlar har doim USD'da ko'rsatiladi), lekin
// boshqa joylar import qilgan bo'lsa, kompatibellik uchun saqlanadi.
export const useSourceCurrency = create((set) => ({
  currency: 'USD',
  setCurrency: (c) => set({ currency: c || 'USD' }),
}));

// Narxlar har doim USD'da ko'rsatiladi (foydalanuvchi so'roviga ko'ra).
// Til o'zgarganda valyuta o'zgartirilmaydi — UZ/RU/EN — hammasi $XX.
export function formatPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

// Hook ham har doim USD qaytaradi — komponentlar oldingi `useFormatPrice()`
// chaqiruvini saqlab qolishi mumkin, kod o'zgarishsiz ishlaydi.
export function useFormatPrice() {
  // useLang chaqiramiz — komponent til o'zgartirsa qayta render bo'lsin
  // (boshqa matnlar tarjima qilinadi, narx esa USD'da qoladi).
  useLang((s) => s.lang);
  return (value) => formatPrice(value);
}

export function useCurrencyCode() {
  return 'USD';
}

export function formatDate(date, locale = 'uz') {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(
    locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );
}

/**
 * So'mni ixcham ko'rinishda: 534 000 → "534 ming", 606 000 000 → "606 mln".
 *
 * Ilovaning umumiy `formatPrice` har doim DOLLAR qaytaradi (raqiblar narxi
 * dollarda ko'rsatiladi). Exely ko'rsatkichlari esa so'mda — ular uchun
 * alohida formatlagich kerak, aks holda "$534000" chiqib qolardi.
 */
export function formatUzsCompact(value, lang = 'uz') {
  const n = Number(value || 0);
  const u = lang === 'ru' ? { m: 'млн', k: 'тыс' }
    : lang === 'en' ? { m: 'M', k: 'K' }
      : { m: 'mln', k: 'ming' };
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)} ${u.m}`;
  if (n >= 1_000) return `${Math.round(n / 1_000)} ${u.k}`;
  return String(Math.round(n));
}
