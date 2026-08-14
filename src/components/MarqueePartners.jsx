import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

// ⚠️ Ilgari bu ro'yxat "Dendi Plaza" ni 12 marta (6 × 2 dublikat) ko'rsatardi —
// ya'ni BITTA mijoz 12 ta logo bo'lib aylanib yurardi. Bu ishonch qozonmaydi,
// aksincha: sinchkov ziyoratchi darhol payqaydi va butun sahifaga shubha bilan
// qaray boshlaydi.
//
// Endi ro'yxat haqiqiy: har mijoz BIR marta. Yangi mijoz qo'shsangiz shu yerga
// nomini yozing — vizual mantiq o'zi moslashadi (3 tadan kam bo'lsa oddiy
// qator, ko'p bo'lsa aylanuvchi lenta).
const PARTNERS = ['Dendi Plaza'];

// Lentani cheksiz aylantirish uchun minimal mijoz soni. Bundan kam bo'lsa
// harakatlanuvchi lenta ko'plikni SIMULYATSIYA qiladi — shuning uchun statik.
const MARQUEE_MIN = 3;

const TXT = {
  uz: 'Bizga ishonch bildirgan mehmonxonalar',
  ru: 'Отели, которые нам доверяют',
  en: 'Hotels that trust us',
};

export function MarqueePartners() {
  const lang = useLang((s) => s.lang);
  if (!PARTNERS.length) return null;

  const heading = TXT[lang] || TXT.en;
  const marquee = PARTNERS.length >= MARQUEE_MIN;

  return (
    <div className="w-full overflow-hidden bg-muted/10 border-y py-8 mt-12 mb-8 flex flex-col items-center">
      <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-widest text-center">
        {heading}
      </p>

      {marquee ? (
        <div className="relative w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto overflow-hidden flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            className="flex gap-16 md:gap-24 whitespace-nowrap items-center w-max pl-16 md:pl-24"
          >
            {/* Uzluksiz aylanish uchun ro'yxat ikki marta chiziladi — bu vizual
                hiyla, mijozlar soni EMAS. */}
            {[...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div
                key={i}
                className="text-2xl md:text-3xl font-black text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-300"
                style={{ fontFamily: 'serif' }}
              >
                {partner}
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 px-6">
          {PARTNERS.map((partner) => (
            <div
              key={partner}
              className="text-2xl md:text-3xl font-black text-muted-foreground/40"
              style={{ fontFamily: 'serif' }}
            >
              {partner}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
