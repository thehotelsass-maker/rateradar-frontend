import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion';
import { useLang } from '@/lib/i18n';

// ════════════════════════════════════════════════════════════════════
// ⚠️ SOXTA SHARHLAR OLIB TASHLANDI (2026-08-12)
//
// Ilgari bu yerda 3 ta "mijoz" bor edi:
//   • ismlar o'ylab topilgan (Azizbek Rahimov, Malika Umarova, Rustam Qosimov)
//   • avatarlar `i.pravatar.cc` dan — tasodifiy stok rasmlar. Sahifadagi
//     yagona 3 ta rasm aynan o'shalar edi, ya'ni ochiq-oydin soxta.
//   • "daromadimiz roppa-rosa 20% ga oshdi" — dalilsiz konkret raqam
//     (huquqiy va reputatsion xavf)
//   • mehmonxona nomlari (Grand Hotel, Silk Road Resort, City Inn) mavjud
//     mijozlar ro'yxatiga mos kelmasdi
//
// Bitta HAQIQIY sharh 12 ta soxtadan kuchliroq. Bo'lim mijoz qo'shilgunicha
// umuman ko'rinmaydi — bo'sh joy yolg'ondan yaxshiroq.
//
// QAYTA YOQISH: mijozdan YOZMA rozilik oling, rasmni o'z serveringizga qo'ying
// (`public/testimonials/...` — tashqi havola vaqt o'tib buziladi), va raqamli
// da'voni faqat tasdiqlay oladigan bo'lsangiz yozing.
//
// const TESTIMONIALS = [
//   {
//     name: 'Ism Familiya',
//     role: { uz: 'Direktor, Dendi Plaza', ru: '...', en: '...' },
//     image: '/testimonials/ism.jpg',
//     rating: 5,
//     text: { uz: '...', ru: '...', en: '...' },
//   },
// ];
// ════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [];

const TXT = {
  uz: { badge: 'Mijozlar Fikri', title: 'Nega hotellar bizni tanlaydi?' },
  ru: { badge: 'Отзывы клиентов', title: 'Почему отели выбирают нас?' },
  en: { badge: 'Testimonials', title: 'Why do hotels choose us?' },
};

export function TestimonialSection() {
  const lang = useLang((s) => s.lang);
  const tx = TXT[lang] || TXT.en;

  // Haqiqiy sharh yo'q ekan — bo'limni umuman ko'rsatmaymiz.
  if (!TESTIMONIALS.length) return null;

  const pick = (v) => (typeof v === 'string' ? v : v?.[lang] || v?.en || '');

  return (
    <section className="py-24 border-t bg-muted/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/[0.03] rounded-full blur-3xl -z-10" />

      <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[11px] font-semibold uppercase tracking-wider text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
            {tx.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {tx.title}
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative bg-card p-8 rounded-3xl border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col group"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors">
                  <Quote size={48} />
                </div>

                <div className="flex items-center gap-1 mb-6">
                  {[...Array(t.rating || 5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed flex-grow relative z-10">
                  "{pick(t.text)}"
                </p>

                <div className="mt-8 flex items-center gap-4 relative z-10">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-background shadow-md" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{t.name}</h4>
                    <span className="text-xs text-muted-foreground">{pick(t.role)}</span>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
