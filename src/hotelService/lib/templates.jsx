/**
 * Mehmon sahifasi uchun TAYYOR SHABLONLAR (30 ta) — PREMIUM.
 * Har shablon: rang (primary) + fon (bg) + rangli HEADER bezagi (head shakli)
 * + content fon naqshi (pattern) + ixtiyoriy burchak bezagi (accent).
 * Hammasi CSS/SVG — rasm fayl shart emas, istalgan rangga moslashadi.
 */
export const TEMPLATES = [
  { key: 'classic',  name: 'Klassik',     primary: '#2563eb', bg: 'light', head: 'curve',   pattern: 'none',  accent: 'none' },
  { key: 'emerald',  name: 'Zumrad',      primary: '#059669', bg: 'light', head: 'wave',    pattern: 'none',  accent: 'none' },
  { key: 'sunset',   name: 'Quyosh',      primary: '#ea580c', bg: 'soft',  head: 'round',   pattern: 'none',  accent: 'none' },
  { key: 'rose',     name: 'Atirgul',     primary: '#e11d48', bg: 'light', head: 'scallop', pattern: 'dots',  accent: 'floral' },
  { key: 'royal',    name: 'Shohona',     primary: '#7c3aed', bg: 'soft',  head: 'curve',   pattern: 'none',  accent: 'none' },
  { key: 'ocean',    name: 'Dengiz',      primary: '#0891b2', bg: 'light', head: 'wave',    pattern: 'dots',  accent: 'none' },
  { key: 'luxe',     name: 'Premium',     primary: '#eab308', bg: 'dark',  head: 'slant',   pattern: 'none',  accent: 'luxury' },
  { key: 'blossom',  name: 'Nafis',       primary: '#db2777', bg: 'soft',  head: 'scallop', pattern: 'polka', accent: 'floral' },
  { key: 'graphite', name: 'Grafit',      primary: '#475569', bg: 'light', head: 'slant',   pattern: 'grid',  accent: 'none' },
  { key: 'mint',     name: 'Yashil tong', primary: '#0d9488', bg: 'soft',  head: 'curve',   pattern: 'none',  accent: 'leaves' },
  { key: 'coral',    name: 'Marjon',      primary: '#f43f5e', bg: 'light', head: 'arch',    pattern: 'none',  accent: 'none' },
  { key: 'sky',      name: 'Osmon',       primary: '#0ea5e9', bg: 'light', head: 'round',   pattern: 'dots',  accent: 'none' },
  { key: 'forest',   name: "O'rmon",      primary: '#16a34a', bg: 'light', head: 'wave',    pattern: 'none',  accent: 'leaves' },
  { key: 'sand',     name: 'Qumtepa',     primary: '#ca8a04', bg: 'soft',  head: 'slant',   pattern: 'diag',  accent: 'none' },
  { key: 'berry',    name: 'Rezavor',     primary: '#9333ea', bg: 'soft',  head: 'peak',    pattern: 'polka', accent: 'none' },
  { key: 'midnight', name: 'Yarim tun',   primary: '#60a5fa', bg: 'dark',  head: 'curve',   pattern: 'none',  accent: 'none' },
  { key: 'lavender', name: 'Lavanda',     primary: '#8b5cf6', bg: 'soft',  head: 'scallop', pattern: 'polka', accent: 'floral' },
  { key: 'ruby',     name: 'Yoqut',       primary: '#dc2626', bg: 'light', head: 'tilt',    pattern: 'none',  accent: 'luxury' },
  { key: 'turq',     name: 'Feruza',      primary: '#06b6d4', bg: 'light', head: 'peak',    pattern: 'none',  accent: 'none' },
  { key: 'amberlux', name: 'Kahrabo',     primary: '#f59e0b', bg: 'soft',  head: 'round',   pattern: 'none',  accent: 'luxury' },
  { key: 'steel',    name: "Po'lat",      primary: '#0f766e', bg: 'light', head: 'slant',   pattern: 'grid',  accent: 'none' },
  { key: 'plum',     name: "Olxo'ri",     primary: '#a21caf', bg: 'soft',  head: 'arch',    pattern: 'diag',  accent: 'none' },
  { key: 'lime',     name: 'Limon',       primary: '#65a30d', bg: 'light', head: 'peak',    pattern: 'none',  accent: 'leaves' },
  { key: 'cobalt',   name: 'Kobalt',      primary: '#1d4ed8', bg: 'soft',  head: 'curve',   pattern: 'none',  accent: 'none' },
  { key: 'blush',    name: 'Nozik',       primary: '#ec4899', bg: 'soft',  head: 'round',   pattern: 'polka', accent: 'floral' },
  { key: 'pine',     name: "Qarag'ay",    primary: '#34d399', bg: 'dark',  head: 'wave',    pattern: 'none',  accent: 'leaves' },
  { key: 'terra',    name: 'Terrakota',   primary: '#c2410c', bg: 'soft',  head: 'slant',   pattern: 'diag',  accent: 'none' },
  { key: 'aqua',     name: 'Akva',        primary: '#0284c7', bg: 'light', head: 'wave',    pattern: 'dots',  accent: 'none' },
  { key: 'orchid',   name: 'Orkide',      primary: '#c026d3', bg: 'light', head: 'round',   pattern: 'none',  accent: 'floral' },
  { key: 'charcoal', name: "Ko'mir",      primary: '#fbbf24', bg: 'dark',  head: 'peak',    pattern: 'grid',  accent: 'luxury' },
];

export function getTemplate(key) {
  return TEMPLATES.find((t) => t.key === key) || null;
}

// ─── HEADER pastki shakli (pageBg rangi bilan "kesib o'tadi") ─────────
function HeadShape({ shape, fill }) {
  if (!shape || shape === 'flat') return null;
  const cls = 'absolute -bottom-px inset-x-0 w-full block';
  const P = (d, h = 26) => (
    <svg className={cls} height={h} viewBox={`0 0 400 ${h}`} preserveAspectRatio="none"><path d={d} fill={fill} /></svg>
  );
  switch (shape) {
    case 'wave':    return P('M0 26 V14 Q100 0 200 13 T400 13 V26 Z');
    case 'curve':   return P('M0 26 V20 Q200 -6 400 20 V26 Z');
    case 'round':   return P('M0 26 Q200 -16 400 26 Z', 28);
    case 'slant':   return P('M0 26 L400 8 V26 Z', 26);
    case 'tilt':    return P('M0 8 L400 26 V26 H0 Z', 26);
    case 'peak':    return P('M0 26 L200 6 L400 26 Z');
    case 'scallop': return P('M0 26 V12 Q380 30 360 12 T320 12 T280 12 T240 12 T200 12 T160 12 T120 12 T80 12 T40 12 T0 12 Z');
    case 'arch':    return P('M0 26 V22 Q200 -14 400 22 V26 Z', 28);
    default:        return null;
  }
}

/**
 * Rangli premium HEADER banner. Ichida hotel nomi / til tugmasi (children).
 * pageBg — sahifa foni (pastki shakl shu rangda kesadi).
 */
export function DecorHeader({ templateKey, primary = '#2563eb', pageBg = '#ffffff', children }) {
  const head = getTemplate(templateKey)?.head || 'curve';
  // z-30 — header (va ichidagi til dropdown) sahifa kontentidan (z-10) ustun bo'lsin.
  return (
    <div className="relative z-30" style={{ background: primary, backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(0,0,0,0.22))' }}>
      <div className="relative z-10 text-white">{children}</div>
      <HeadShape shape={head} fill={pageBg} />
    </div>
  );
}

// ─── Burchak bezagi (accent) — SVG ───────────────────────────────────
function FloralCorner({ color }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M6 34 C6 18 18 6 34 6" stroke={color} strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
      <path d="M14 30 C16 22 22 16 30 14" stroke={color} strokeWidth="1" opacity="0.32" strokeLinecap="round" />
      <circle cx="34" cy="6" r="2.4" fill={color} opacity="0.55" />
      <circle cx="6" cy="34" r="2.4" fill={color} opacity="0.55" />
      <path d="M20 20 q5 -3 9 -1 q-3 4 -9 1Z" fill={color} opacity="0.28" />
    </svg>
  );
}
function LeafCorner({ color }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path d="M8 40 C8 22 22 8 44 8" stroke={color} strokeWidth="1.4" opacity="0.38" />
      <path d="M20 16 q8 2 10 12 q-10 -1 -10 -12Z" fill={color} opacity="0.3" />
      <path d="M14 28 q6 1 8 9 q-8 -1 -8 -9Z" fill={color} opacity="0.22" />
      <path d="M30 10 q7 2 9 10 q-9 -1 -9 -10Z" fill={color} opacity="0.26" />
    </svg>
  );
}
function LuxuryCorner({ color }) {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      <path d="M4 18 V4 H18" stroke={color} strokeWidth="2" opacity="0.8" strokeLinecap="round" />
      <path d="M9 23 V9 H23" stroke={color} strokeWidth="1" opacity="0.38" strokeLinecap="round" />
      <circle cx="4" cy="4" r="1.8" fill={color} opacity="0.75" />
    </svg>
  );
}

/**
 * Content fon naqshi (pattern) + pastki burchak bezagi (accent).
 * `relative` ota element ichiga, kontent ostida (z-0, pointer-events-none).
 */
export function DecorBg({ templateKey, primary = '#2563eb' }) {
  const tpl = getTemplate(templateKey);
  if (!tpl) return null;
  const c = primary;
  const wrap = 'pointer-events-none absolute inset-0 overflow-hidden z-0';

  const patternStyle = {
    none: null,
    dots: { backgroundImage: `radial-gradient(${c}1f 1.3px, transparent 1.3px)`, backgroundSize: '18px 18px' },
    polka: { backgroundImage: `radial-gradient(${c}1c 4px, transparent 4px)`, backgroundSize: '34px 34px' },
    grid: { backgroundImage: `linear-gradient(${c}12 1px, transparent 1px), linear-gradient(90deg, ${c}12 1px, transparent 1px)`, backgroundSize: '26px 26px' },
    diag: { backgroundImage: `repeating-linear-gradient(45deg, ${c}10 0 10px, transparent 10px 24px)` },
  }[tpl.pattern || 'none'];

  const Accent = { floral: FloralCorner, leaves: LeafCorner, luxury: LuxuryCorner }[tpl.accent];

  if (!patternStyle && !Accent) return null;

  return (
    <div className={wrap}>
      {patternStyle && <div className="absolute inset-0" style={patternStyle} />}
      {Accent && (
        <>
          <div className="absolute bottom-0 left-0 scale-y-[-1]"><Accent color={c} /></div>
          <div className="absolute bottom-0 right-0 scale-x-[-1] scale-y-[-1]"><Accent color={c} /></div>
        </>
      )}
    </div>
  );
}
