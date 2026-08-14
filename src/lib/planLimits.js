// Tarif cheklovlari — backend config/plans.js LIMITS bilan MOS bo'lishi shart.
// Faqat UI gating (blur/qulf/yashirish) uchun. Haqiqiy himoya backendda.
// channels: null = barcha OTA; massiv = faqat shu kanallar ko'rsatiladi.
//
// ⚠️ Sonli cheklovlarda cheksizlik = UNLIMITED (null), `0` EMAS. Ilgari ikkalasi
// ham `0` edi va free tarif amalda cheksiz raqib berardi. Yangi cheklov
// qo'shsangiz — bu yerda ham, backend plans.js da ham bir xil yozing.
export const UNLIMITED = null;

const LIMITS = {
  free:     { maxCompetitors: 1,         channels: ['booking'],            ai: false, reviewsReply: false, reviewsAnalytics: false, hotelService: false },
  starter:  { maxCompetitors: 3,         channels: ['booking', 'expedia'], ai: false, reviewsReply: false, reviewsAnalytics: false, hotelService: false },
  pro:      { maxCompetitors: 10,        channels: null,                   ai: true,  reviewsReply: true,  reviewsAnalytics: true,  hotelService: true },
  business: { maxCompetitors: UNLIMITED, channels: null,                   ai: true,  reviewsReply: true,  reviewsAnalytics: true,  hotelService: true },
};

const ADMIN_LIMITS = {
  maxCompetitors: UNLIMITED, channels: null, ai: true, reviewsReply: true, reviewsAnalytics: true, hotelService: true,
};

export function limitsFor(user) {
  if (user?.role === 'admin') return ADMIN_LIMITS;
  return LIMITS[user?.plan] || LIMITS.free;
}

// Sonli cheklov cheksizmi?
export function isUnlimited(limit) {
  return limit === UNLIMITED || limit === undefined;
}

// Funksiya ruxsatimi (ai, reviewsAnalytics, hotelService...)
export function allows(user, feature) {
  return Boolean(limitsFor(user)[feature]);
}

// OTA kanal shu tarifda ko'rsatiladimi (channels null = hammasi).
export function channelVisible(user, channelKey) {
  const ch = limitsFor(user).channels;
  if (!ch) return true;
  return ch.includes(String(channelKey || '').toLowerCase());
}
