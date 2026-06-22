/**
 * Yengil mijoz-tomon keshi (localStorage, TTL bilan).
 *
 * Maqsad: sahifaga qayta kirilganda ma'lumotni darrov keshdan ko'rsatish
 * (stale-while-revalidate) — kutish vaqti yo'qoladi, server yuki kamayadi.
 *
 * Nega cookie EMAS: cookie ~4KB bilan cheklangan va HAR so'rovda serverga
 * yuboriladi (sekinlashtiradi). localStorage kattaroq, faqat brauzerda qoladi.
 */
const PREFIX = 'rr_cache:';

export function getCache(key, maxAgeMs = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (maxAgeMs && Date.now() - t > maxAgeMs) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return v;
  } catch {
    return null;
  }
}

export function setCache(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    // kvota to'lgan bo'lsa — eski kesh yozuvlarini tozalab qayta urinamiz
    try {
      clearAllCache();
      localStorage.setItem(PREFIX + key, JSON.stringify({ t: Date.now(), v: value }));
    } catch {
      /* e'tibordan */
    }
  }
}

export function clearCache(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* e'tibordan */
  }
}

// Berilgan prefiks bilan boshlanadigan barcha keshni tozalaydi (mas. 'competitors:')
export function clearCachePrefix(prefix) {
  try {
    const full = PREFIX + prefix;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(full)) localStorage.removeItem(k);
    }
  } catch {
    /* e'tibordan */
  }
}

export function clearAllCache() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) localStorage.removeItem(k);
    }
  } catch {
    /* e'tibordan */
  }
}
