import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { staggerContainer, fadeInUp } from '@/lib/animations';

/**
 * Ommaviy sahifalar uchun umumiy sxema: navbar + yashil gradient hero + kontent + footer.
 * Sahifa ochilganda tepaga scroll qiladi.
 */
export function PublicPageLayout({ title, subtitle, eyebrow, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO — yashil gradient + jonli "blob"lar */}
        <section className="relative overflow-hidden border-b border-emerald-500/10">
          {/* orqa fon nurlanishi */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-emerald-500/[0.03] to-transparent" />
            <motion.div
              className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -top-10 right-0 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl"
              animate={{ x: [0, -24, 0], y: [0, 26, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              {eyebrow || title}
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-emerald-600/80 dark:to-emerald-400/90 bg-clip-text text-transparent"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                variants={fadeInUp}
                className="mt-4 text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-2xl"
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        </section>

        {/* KONTENT */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          {children}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

/** about / terms / privacy uchun bo'limlarni yashil raqamli kartochkalar bilan chiqaradi. */
export function ContentSections({ sections }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="space-y-5"
    >
      {sections.map((s, i) => (
        <motion.section
          key={i}
          variants={fadeInUp}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          className="group relative rounded-2xl border border-border bg-card/60 p-5 sm:p-6 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/[0.03]"
        >
          {/* chap yashil aksent chizig'i */}
          <span className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start gap-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-[0_4px_14px_-2px_rgba(16,185,129,0.5)] ring-1 ring-white/20">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-semibold">{s.h}</h2>
              {s.p && (
                <p className="mt-2 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                  {s.p}
                </p>
              )}
              {s.list && (
                <ul className="mt-3 space-y-2.5">
                  {s.list.map((item, j) => (
                    <li
                      key={j}
                      className="flex gap-2.5 text-sm sm:text-[15px] text-muted-foreground leading-relaxed"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.29 6.8-6.8a1 1 0 011.4 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
}
