import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useT } from '@/lib/i18n';

/**
 * Login / Register sahifalarining chap brending paneli — premium ko'k panel,
 * limon accent, sarlavha + afzalliklar ro'yxati + animatsiya. Faqat lg ekranda.
 */
export function AuthBrandPanel() {
  const t = useT();
  const benefits = [t('feature1Title'), t('feature2Title'), t('feature4Title'), t('feature5Title')];

  return (
    <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-primary to-[hsl(221_83%_36%)] text-white">
      {/* fon bezaklari */}
      <div className="absolute inset-0 -z-0 opacity-[0.12]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }} />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-lime-300/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

      {/* logo */}
      <Link to="/" className="relative inline-flex items-center gap-2.5 w-fit">
        <div className="w-9 h-9 rounded-xl bg-white/15 grid place-items-center font-bold ring-1 ring-white/25">R</div>
        <span className="font-bold text-[15px]">TheHotelSaaS</span>
      </Link>

      {/* markaz — sarlavha + afzalliklar */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        className="relative max-w-md"
      >
        <motion.h2
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="text-4xl font-extrabold tracking-tight leading-[1.05]"
        >
          {t('heroT1')}{' '}
          <span className="inline-block bg-lime-300 text-neutral-900 px-2.5 pb-0.5 rounded-lg -rotate-1">
            {t('heroHi')}
          </span>
        </motion.h2>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="mt-5 text-white/80 leading-relaxed"
        >
          {t('landingSub')}
        </motion.p>

        <ul className="mt-8 space-y-3">
          {benefits.map((b) => (
            <motion.li
              key={b}
              variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
              className="flex items-center gap-3 text-sm text-white/90"
            >
              <span className="w-5 h-5 rounded-full bg-lime-300 text-neutral-900 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {b}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* pastki — ishonch */}
      <div className="relative text-xs text-white/60">{t('trustBadge')}</div>
    </div>
  );
}
