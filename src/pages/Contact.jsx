import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { getLegalContent, CONTACT } from '@/lib/legalContent';
import { useLang, useT } from '@/lib/i18n';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export default function Contact() {
  const lang = useLang((s) => s.lang);
  const t = useT();
  const c = getLegalContent(lang, 'contact');

  const cards = [
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      external: false,
    },
    {
      icon: Send,
      label: 'Telegram',
      value: CONTACT.telegram,
      href: CONTACT.telegramUrl,
      external: true,
    },
  ];

  return (
    <PublicPageLayout title={c.title} subtitle={c.intro} eyebrow={t('footerCompany')}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid sm:grid-cols-2 gap-4"
      >
        {cards.map((card) => (
          <motion.a
            key={card.label}
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            href={card.href}
            target={card.external ? '_blank' : undefined}
            rel="noreferrer"
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/[0.03]"
          >
            {/* hover yashil nurlanish */}
            <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_4px_14px_-2px_rgba(16,185,129,0.5)] ring-1 ring-white/20 transition-transform group-hover:scale-105">
              <card.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.label}
              </span>
              <span className="block truncate text-sm font-semibold transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {card.value}
              </span>
            </span>
          </motion.a>
        ))}
      </motion.div>
    </PublicPageLayout>
  );
}
