/**
 * User-Agent satridan qurilma/brauzer/OS ni ajratib oluvchi yengil parser
 * (tashqi kutubxonasiz). Xavfsizlik dashboardida "qaysi qurilmadan" ko'rsatish uchun.
 *
 * parseUA(ua) → { browser, os, device, bot, label }
 *   label — qisqa ko'rsatish uchun, masalan "Chrome · Windows" yoki "curl (bot)".
 */
export function parseUA(ua) {
  if (!ua || typeof ua !== 'string') {
    return { browser: '—', os: '—', device: 'unknown', bot: false, label: '—' };
  }
  const s = ua.toLowerCase();

  // 1) Bot / avtomatik vositalar (eng muhim signal — odatda hujumchilar)
  const BOT = [
    ['curl', 'curl'], ['wget', 'wget'], ['python-requests', 'python'], ['python', 'python'],
    ['go-http', 'Go-http'], ['java/', 'Java'], ['axios', 'axios'], ['node-fetch', 'node'],
    ['httpclient', 'HttpClient'], ['libwww', 'libwww'], ['masscan', 'masscan'],
    ['nmap', 'nmap'], ['nikto', 'Nikto'], ['sqlmap', 'sqlmap'], ['zgrab', 'zgrab'],
    ['censys', 'Censys'], ['bot', 'Bot'], ['spider', 'Spider'], ['crawl', 'Crawler'],
    ['scan', 'Scanner'], ['scrapy', 'Scrapy'], ['headless', 'Headless'],
  ];
  for (const [needle, name] of BOT) {
    if (s.includes(needle)) {
      return { browser: name, os: '—', device: 'bot', bot: true, label: `${name} (bot)` };
    }
  }

  // 2) OS
  let os = '—';
  if (/windows nt 10/.test(s)) os = 'Windows 10/11';
  else if (/windows/.test(s)) os = 'Windows';
  else if (/iphone|ipad|ios/.test(s)) os = 'iOS';
  else if (/android/.test(s)) os = 'Android';
  else if (/mac os x|macintosh/.test(s)) os = 'macOS';
  else if (/linux/.test(s)) os = 'Linux';

  // 3) Brauzer (tartib muhim — Edge/Chrome/Safari farqlanishi uchun)
  let browser = '—';
  if (/edg\//.test(s)) browser = 'Edge';
  else if (/opr\/|opera/.test(s)) browser = 'Opera';
  else if (/samsungbrowser/.test(s)) browser = 'Samsung';
  else if (/chrome\//.test(s)) browser = 'Chrome';
  else if (/firefox\//.test(s)) browser = 'Firefox';
  else if (/safari\//.test(s) && /version\//.test(s)) browser = 'Safari';

  // 4) Qurilma turi
  const mobile = /mobi|android|iphone|ipad|ipod/.test(s);
  const device = /ipad|tablet/.test(s) ? 'tablet' : mobile ? 'mobile' : 'desktop';

  // 5) Android model (ko'p UA'da bor: "; SM-G991B)")
  let model = '';
  const m = ua.match(/;\s*([A-Z][\w-]+(?:\s[\w-]+)?)\s+Build\//i) || ua.match(/\(.*?;\s*([A-Za-z]+\s?[A-Za-z0-9-]+)\)/);
  if (device !== 'desktop' && m && m[1] && !/x11|windows|macintosh/i.test(m[1])) {
    model = m[1].trim();
  }

  const parts = [browser, os].filter((x) => x && x !== '—');
  let label = parts.join(' · ') || 'Noma\'lum';
  if (model) label += ` (${model})`;

  return { browser, os, device, model, bot: false, label };
}

// Qurilma turiga mos belgi
export function deviceIcon(device) {
  return device === 'mobile' ? '📱' : device === 'tablet' ? '📲' : device === 'bot' ? '🤖' : '🖥️';
}
