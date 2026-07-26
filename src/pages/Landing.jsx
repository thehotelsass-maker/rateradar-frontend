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
  X,
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
import { LeadModal } from '@/components/LeadModal';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion';
import { HeroCarousel } from '@/components/HeroCarousel';
import { HotelServiceMockup } from '@/components/HotelServiceMockup';
import { MarqueePartners } from '@/components/MarqueePartners';
import { IntegrationsAnimated } from '@/components/IntegrationsAnimated';
import { TestimonialSection } from '@/components/TestimonialSection';
import { FAQAccordion } from '@/components/FAQAccordion';
import { FomoNotifications } from '@/components/FomoNotifications';
import { BentoFeatures } from '@/components/BentoFeatures';
import { DashboardPreview } from '@/components/DashboardPreview';
import CountUp from '@/components/ui/CountUp';
import { useT, useLang } from '@/lib/i18n';
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
  const lang = useLang((s) => s.lang);
  const navigate = useNavigate();
  const isAuthenticated = useAuth((s) => s.isAuthenticated());
  const [payPlan, setPayPlan] = useState(null); // { id, name, priceUzs }
  const [isYearly, setIsYearly] = useState(false);
  const [leadVariant, setLeadVariant] = useState(null); // null | 'demo' | 'yearly' — bog'lanish formasi

  const steps = [
    { num: '01', title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', title: t('step3Title'), desc: t('step3Desc') },
  ];

  // Uch tarif — backend config/plans.js bilan mos ($29 / $49 / $119).
  const TIER_TXT = {
    uz: {
      f: {
        h1: '1 mehmonxona', h5: '5 mehmonxonagacha',
        c3: '3 raqib kuzatuvi', c10: '10 raqib kuzatuvi', cU: 'Cheksiz raqib',
        booking: 'Faqat Booking.com', allota: 'Barcha OTA kanallari', allotaDeep: 'Barcha OTA + chuqur tahlil',
        aiNo: 'AI tavsiya yo‘q', ai: 'AI narx tavsiyasi', aiDeep: 'AI + chuqur tavsiya',
        revView: 'Sharhlarni ko‘rish', revReply: 'Sharh + javob', revAi: 'AI sharh javobi',
        tv1: '1 TV kiosk', tv5: '5 TV kiosk', tvU: 'Cheksiz TV kiosk',
        hsNo: 'Hotel Service yo‘q', hs: 'Hotel Service (Telegram bot)', hsMulti: 'Hotel Service (ko‘p filial)',
        supEmail: 'Email qo‘llab-quvvatlash', supPri: 'Ustuvor qo‘llab-quvvatlash', supMgr: 'Shaxsiy menejer',
      },
      popular: 'Eng mashhur', month: 'oyiga', pickBtn: 'Tanlash', currentBtn: 'Joriy reja',
    },
    ru: {
      f: {
        h1: '1 отель', h5: 'До 5 отелей',
        c3: '3 конкурента', c10: '10 конкурентов', cU: 'Без ограничений',
        booking: 'Только Booking.com', allota: 'Все OTA-каналы', allotaDeep: 'Все OTA + глубокий анализ',
        aiNo: 'Без AI-советов', ai: 'AI-советы по ценам', aiDeep: 'AI + глубокий анализ',
        revView: 'Просмотр отзывов', revReply: 'Отзывы + ответы', revAi: 'AI-ответы на отзывы',
        tv1: '1 TV-киоск', tv5: '5 TV-киосков', tvU: 'Без ограничений TV',
        hsNo: 'Без Hotel Service', hs: 'Hotel Service (Telegram-бот)', hsMulti: 'Hotel Service (мультифилиал)',
        supEmail: 'Email-поддержка', supPri: 'Приоритетная поддержка', supMgr: 'Персональный менеджер',
      },
      popular: 'Популярный', month: 'в месяц', pickBtn: 'Выбрать', currentBtn: 'Текущий план',
    },
    en: {
      f: {
        h1: '1 hotel', h5: 'Up to 5 hotels',
        c3: '3 competitors', c10: '10 competitors', cU: 'Unlimited competitors',
        booking: 'Booking.com only', allota: 'All OTA channels', allotaDeep: 'All OTA + deep analysis',
        aiNo: 'No AI advice', ai: 'AI price advice', aiDeep: 'AI + deep advice',
        revView: 'View reviews', revReply: 'Reviews + replies', revAi: 'AI review replies',
        tv1: '1 TV kiosk', tv5: '5 TV kiosks', tvU: 'Unlimited TV kiosks',
        hsNo: 'No Hotel Service', hs: 'Hotel Service (Telegram bot)', hsMulti: 'Hotel Service (multi-branch)',
        supEmail: 'Email support', supPri: 'Priority support', supMgr: 'Dedicated manager',
      },
      popular: 'Most popular', month: 'per month', pickBtn: 'Choose', currentBtn: 'Current plan',
    },
  };
  const TT = TIER_TXT[lang] || TIER_TXT.uz;
  const F = TT.f;
  const ok = (label) => ({ label, ok: true });
  const no = (label) => ({ label, ok: false });
  const tiers = [
    {
      id: 'starter', name: 'Starter', priceUzs: 350000, priceUsd: 29, popular: false,
      features: [ok(F.h1), ok(F.c3), ok(F.booking), ok(F.revView), ok(F.tv1), no(F.hsNo), no(F.aiNo), ok(F.supEmail)],
    },
    {
      id: 'pro', name: 'Pro', priceUzs: 590000, priceUsd: 49, popular: true,
      features: [ok(F.h1), ok(F.c10), ok(F.allota), ok(F.ai), ok(F.revReply), ok(F.hs), ok(F.tv5), ok(F.supPri)],
    },
    {
      id: 'business', name: 'Business', priceUzs: 1400000, priceUsd: 119, popular: false,
      features: [ok(F.h5), ok(F.cU), ok(F.allotaDeep), ok(F.aiDeep), ok(F.revAi), ok(F.hsMulti), ok(F.tvU), ok(F.supMgr)],
    },
  ];

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

  // Hero ostidagi statistika bandi (iRoom uslubida — yirik raqamlar, count-up animatsiya)
  const stats = [
    { num: 6, suffix: '+', label: t('statOta') },
    { num: 300, suffix: 'm', label: t('statRadius') },
    { text: '24/7', label: t('statMonitor') },
    { num: 3, suffix: '', label: t('statLangs') },
  ];

  // To'lov tugmasi: kirmagan bo'lsa — "Ro'yxatdan o'ting" (register sahifasiga;
  // onboarding oxirida to'lov so'raladi). Kirgan bo'lsa — to'lov oynasi.
  function handlePlanCta(tier) {
    if (!isAuthenticated) return navigate('/register');
    setPayPlan({
      id: tier.id, name: tier.name,
      priceUzs: tier.priceUzs, priceUsd: tier.priceUsd,
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
                <Button size="xl" variant="outline" className="rounded-full"
                  onClick={() => setLeadVariant('demo')}>
                  {t('ctaSecondary')}
                </Button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">{t('trustBadge')}</p>
            </div>

            {/* O'NG — avtomatik o'zgaruvchi karusel (slider) */}
            <HeroCarousel />
          </div>
        </div>

        {/* Marquee Partners */}
        <MarqueePartners />
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

      {/* DASHBOARD PREVIEW */}
      <DashboardPreview />

      {/* BENTO FEATURES */}
      <BentoFeatures />

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

      {/* INTEGRATIONS & TESTIMONIALS */}
      <IntegrationsAnimated />
      <TestimonialSection />

      {/* PRICING */}
      <section id="pricing" className="py-20 sm:py-28 border-t bg-muted/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.05] rounded-full blur-3xl -z-0" />
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="max-w-2xl mx-auto text-center mb-10">
            <Eyebrow>{t('navPricing')}</Eyebrow>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {t('pricingTitle')}
            </h2>
            <p className="mt-4 text-muted-foreground">{t('pricingSub')}</p>
          </Reveal>

          {/* TOGGLE */}
          <Reveal className="flex justify-center mb-14" delay={0.1}>
            <div className="relative flex items-center p-1 bg-muted/50 rounded-full border border-border/50">
              <button
                onClick={() => setIsYearly(false)}
                className={`relative w-32 py-2.5 text-sm font-semibold rounded-full z-10 transition-colors ${!isYearly ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Oylik
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`relative w-32 py-2.5 text-sm font-semibold rounded-full z-10 transition-colors ${isYearly ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Yillik
                {/* Yaltirab turuvchi nishoncha */}
                <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full animate-bounce shadow-lg shadow-green-500/20">
                  2 oy bepul
                </span>
              </button>
              <div
                className="absolute w-32 h-[calc(100%-8px)] bg-primary rounded-full transition-transform duration-300 ease-in-out shadow-md"
                style={{ transform: `translateX(${isYearly ? '100%' : '0'})` }}
              />
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
            {tiers.map((tier) => {
              const usd = isYearly ? tier.priceUsd * 10 : tier.priceUsd;
              const uzs = isYearly ? tier.priceUzs * 10 : tier.priceUzs;
              return (
                <StaggerItem
                  key={tier.id}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={`relative rounded-2xl p-7 flex flex-col bg-card ${
                    tier.popular
                      ? 'border border-primary ring-2 ring-primary/40 shadow-2xl shadow-primary/15 md:scale-[1.03]'
                      : 'border border-border/70 shadow-soft'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shadow-lg whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-300" />
                      {TT.popular}
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-sm font-semibold text-muted-foreground">{tier.name}</div>
                    <div className="mt-3 flex items-baseline justify-center gap-1.5">
                      <span className="text-4xl font-bold tracking-tight">${usd}</span>
                      <span className="text-xs text-muted-foreground">/ {isYearly ? t('perYear') : TT.month}</span>
                    </div>
                    <div className="mt-1.5 text-xs text-muted-foreground">
                      {uzs.toLocaleString('uz-UZ')} {t('currencyUzs')}
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className={`flex items-start gap-2 text-[13px] ${f.ok ? '' : 'text-muted-foreground/60'}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          f.ok ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground/60'
                        }`}>
                          {f.ok ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <X className="h-2.5 w-2.5" strokeWidth={3} />}
                        </div>
                        <span>{f.label}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-6 w-full rounded-full flex items-center justify-center gap-2"
                    size="lg"
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => {
                      if (isYearly) setLeadVariant('yearly'); // yillik — bog'lanish formasi
                      else handlePlanCta(tier);
                    }}
                  >
                    {isYearly ? (lang === 'ru' ? 'Связаться' : lang === 'en' ? 'Contact us' : 'Bog\'lanish')
                      : (isAuthenticated ? TT.pickBtn : t('signUp'))}
                    {isYearly ? <MessageSquare className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </Button>
                </StaggerItem>
              );
            })}
          </Stagger>

          {/* To'lov usullari */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium">
              <span className="w-1 h-1 rounded-full bg-green-500" /> Humo · Visa · Mastercard
            </span>
          </div>
        </div>
      </section>

      {/* To'lov oynasi */}
      {payPlan && (
        <PaymentModal plan={payPlan} onClose={() => setPayPlan(null)} />
      )}

      {/* Bog'lanish formasi (info@thehotelsaas.com'ga yuboradi) — demo yoki yillik */}
      {leadVariant && (
        <LeadModal
          variant={leadVariant}
          plan={leadVariant === 'demo' ? 'Demo so\'rovi' : 'Yillik reja (pro_yearly)'}
          onClose={() => setLeadVariant(null)}
        />
      )}

      {/* FAQ */}
      <FAQAccordion />

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
      
      {/* FOMO NOTIFICATIONS */}
      <FomoNotifications />
    </div>
  );
}
