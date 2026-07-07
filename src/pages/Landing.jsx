import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Sparkles,
  MessageSquare,
  MapPin,
  Bell,
  Layers,
  ArrowRight,
  Check,
  Building2,
  BarChart3,
  Zap,
  QrCode,
  Send,
  ConciergeBell,
  Languages,
  Utensils,
  Car,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { SupportChat } from '@/components/SupportChat';
import { PaymentModal } from '@/components/PaymentModal';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion';
import { HeroCarousel } from '@/components/HeroCarousel';
import { FeatureCard } from '@/components/FeatureCard';
import { HotelServiceMockup } from '@/components/HotelServiceMockup';
import CountUp from '@/components/ui/CountUp';
import { useT } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

// Bo'lim ustidagi kichik yorliq (premium SaaS uslubi — limon nuqta bilan)
function Eyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[11px] font-semibold uppercase tracking-wider text-primary mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
      {children}
    </div>
  );
}

export default function Landing() {
  const t = useT();
  const navigate = useNavigate();
  const isAuthenticated = useAuth((s) => s.isAuthenticated());
  const [payPlan, setPayPlan] = useState(null); // { id, name, priceUzs }

  const features = [
    { icon: TrendingUp, title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: Sparkles, title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: MessageSquare, title: t('feature3Title'), desc: t('feature3Desc') },
    { icon: MapPin, title: t('feature4Title'), desc: t('feature4Desc') },
    { icon: Bell, title: t('feature5Title'), desc: t('feature5Desc') },
    { icon: Layers, title: t('feature6Title'), desc: t('feature6Desc') },
  ];

  const steps = [
    { num: '01', title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', title: t('step3Title'), desc: t('step3Desc') },
  ];

  // Bitta reja — $49 (590 000 so'm/oy). Backend config/plans.js bilan mos.
  const proPlan = {
    id: 'pro',
    title: t('planProTitle'),
    desc: t('planOneDesc'),
    priceUzs: 590000,
    priceUsd: 49,
    features: [
      t('planProFeat1'),
      t('planProFeat2'),
      t('planProFeat3'),
      t('planProFeat4'),
    ],
  };

  // Mehmonxona xizmati bosqichlari (QR → xizmat → Telegram → hisobot)
  const hsSteps = [
    { icon: QrCode, title: t('hsStep1Title'), desc: t('hsStep1Desc') },
    { icon: Languages, title: t('hsStep2Title'), desc: t('hsStep2Desc') },
    { icon: Send, title: t('hsStep3Title'), desc: t('hsStep3Desc') },
    { icon: BarChart3, title: t('hsStep4Title'), desc: t('hsStep4Desc') },
  ];

  const hsServices = [
    { icon: Sparkles, label: t('hsSvcClean') },
    { icon: Utensils, label: t('hsSvcFood') },
    { icon: Car, label: t('hsSvcTaxi') },
    { icon: Layers, label: t('hsSvcTowel') },
  ];

  // Har bir imkoniyat ikonkasi uchun jonli gradient rang (premium ko'rinish)
  const featureColors = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-sky-600',
  ];

  // Hero ostidagi statistika bandi (iRoom uslubida — yirik raqamlar, count-up animatsiya)
  const stats = [
    { num: 6, suffix: '+', label: t('statOta') },
    { num: 300, suffix: 'm', label: t('statRadius') },
    { text: '24/7', label: t('statMonitor') },
    { num: 3, suffix: '', label: t('statLangs') },
  ];

  // To'lov tugmasi: kirmagan bo'lsa — "Ro'yxatdan o'ting" (register sahifasiga;
  // onboarding oxirida to'lov so'raladi). Kirgan bo'lsa — to'lov oynasi.
  function handlePlanCta() {
    if (!isAuthenticated) return navigate('/register');
    setPayPlan({
      id: proPlan.id, name: proPlan.title,
      priceUzs: proPlan.priceUzs, priceUsd: proPlan.priceUsd,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-background to-background" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            {/* CHAP — matn */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-xs font-medium text-muted-foreground mb-6 animate-fade-in">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                {t('landingTagline')}
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[4.2rem] font-extrabold tracking-tight leading-[0.98]">
                {t('heroT1')}{' '}
                <span className="inline-block bg-lime-300 text-neutral-900 px-3 pb-1 rounded-xl box-decoration-clone -rotate-1">
                  {t('heroHi')}
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t('landingSub')}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button asChild size="xl" className="rounded-full">
                  <Link to="/register" className="flex items-center gap-2">
                    {t('ctaPrimary')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline" className="rounded-full">
                  <a href="#features">{t('ctaSecondary')}</a>
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">{t('trustBadge')}</p>
            </div>

            {/* O'NG — avtomatik o'zgaruvchi karusel (slider) */}
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* STATS BAND — iRoom uslubida yirik raqamlar */}
      <section className="border-y bg-muted/30">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
                  {s.text ? s.text : <CountUp value={s.num} suffix={s.suffix} />}
                </div>
                <div className="mt-1.5 text-sm text-muted-foreground">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 sm:py-28 border-t relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/[0.05] rounded-full blur-3xl -z-10" />
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <Eyebrow>{t('navFeatures')}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t('featuresTitle')}
            </h2>
            <p className="mt-4 text-muted-foreground">{t('featuresSub')}</p>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <StaggerItem key={i} style={{ perspective: "1000px" }}>
                <FeatureCard feature={f} index={i} featureColors={featureColors} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 sm:py-28 border-t bg-muted/20">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <Eyebrow>{t('navHowItWorks')}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t('howItWorksTitle')}
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-[1400px] 2xl:max-w-[1600px] mx-auto relative z-10">
            {/* Animated background line behind all steps */}
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-px bg-border -z-10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-x-full animate-shimmer" />
            </div>

            {steps.map((s, i) => (
              <StaggerItem key={i} className="relative group cursor-default">
                <div className="relative h-full bg-card rounded-3xl p-8 lg:p-10 border hover:border-primary/30 transition-colors duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10">
                  {/* Huge background number */}
                  <div className="absolute -right-6 -bottom-6 text-[140px] font-black text-primary/[0.03] group-hover:text-primary/[0.06] group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700 pointer-events-none select-none">
                    {s.num}
                  </div>
                  
                  {/* Gradient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Icon / Number Container */}
                  <div className="relative mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary group-hover:from-primary group-hover:to-violet-500 group-hover:text-white flex items-center justify-center shadow-inner transition-colors duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <span className="text-2xl font-bold tabular-nums">
                        {s.num}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-xl mb-3 relative z-10 group-hover:text-primary transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                    {s.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* HOTEL SERVICE — QR + Telegram */}
      <section id="hotel-service" className="py-20 sm:py-28 border-t">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Chap: matn + bosqichlar */}
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-xs font-medium text-primary mb-5">
                <ConciergeBell className="h-3.5 w-3.5" />
                {t('hsBadge')}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {t('hsTitle')}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t('hsSub')}
              </p>

              <div className="mt-8 space-y-6">
                {hsSteps.map((s, i) => (
                  <div key={i} className="flex gap-4 group cursor-default">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary group-hover:from-primary group-hover:to-violet-500 group-hover:text-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-500 group-hover:scale-110">
                        <s.icon className="h-5 w-5" />
                      </div>
                      {i < hsSteps.length - 1 && (
                        <div className="absolute left-1/2 top-14 w-px h-6 bg-border -translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-500" />
                      )}
                    </div>
                    <div className="pt-1 transition-transform duration-500 group-hover:translate-x-2">
                      <div className="font-bold text-base group-hover:text-primary transition-colors">{s.title}</div>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* O'ng: jonlantirilgan telefon mockup */}
            <Reveal as="div" delay={0.12} className="relative mt-10 lg:mt-0">
              <HotelServiceMockup />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 sm:py-28 border-t bg-muted/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.05] rounded-full blur-3xl -z-0" />
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <Eyebrow>{t('navPricing')}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t('pricingTitle')}
            </h2>
            <p className="mt-4 text-muted-foreground">{t('pricingSub')}</p>
          </Reveal>

          <Stagger className="max-w-md mx-auto">
            <StaggerItem
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="relative rounded-2xl border border-primary ring-2 ring-primary/40 shadow-2xl shadow-primary/15 p-8 flex flex-col bg-card"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-300" />
                {t('planProTitle')}
              </div>

              <div className="text-center">
                <div className="mt-2 flex items-baseline justify-center gap-1.5">
                  <span className="text-5xl font-bold tracking-tight">
                    ${proPlan.priceUsd}
                  </span>
                  <span className="text-sm text-muted-foreground">/ {t('perMonth')}</span>
                </div>
                <div className="mt-1.5 text-sm text-muted-foreground">
                  {proPlan.priceUzs.toLocaleString('uz-UZ')} {t('currencyUzs')} / {t('perMonth')}
                </div>
                <div className="mt-1 text-xs text-green-600 font-medium">
                  {t('perYear')}: $490 — {t('yearlySaveBadge')}
                </div>
                <div className="mt-1 text-xs text-muted-foreground/70">{proPlan.desc}</div>
              </div>

              <ul className="mt-7 space-y-2.5 flex-1">
                {proPlan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-7 w-full rounded-full"
                size="lg"
                onClick={handlePlanCta}
              >
                {isAuthenticated ? t('subscribe') : t('signUp')}
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* To'lov usullari: Humo faol · Visa tez orada */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium">
                  <span className="w-1 h-1 rounded-full bg-green-500" /> Humo
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted font-medium">
                  Visa — {t('comingSoon').toLowerCase()}
                </span>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* To'lov oynasi */}
      {payPlan && (
        <PaymentModal plan={payPlan} onClose={() => setPayPlan(null)} />
      )}

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 border-t relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10" />
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {t('ctaFinalTitle')}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {t('ctaFinalSub')}
          </p>
          <Button asChild size="xl" className="mt-8 rounded-full">
            <Link to="/register" className='flex items-center gap-3'>
              {t('ctaPrimary')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* FOOTER */}
      <PublicFooter />
      <SupportChat />
    </div>
  );
}
