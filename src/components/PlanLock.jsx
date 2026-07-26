import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/i18n';

const TXT = {
  uz: { def: 'Bu funksiya Pro va Business tariflarida', btn: 'Tarifni ko\'tarish' },
  ru: { def: 'Доступно в тарифах Pro и Business', btn: 'Повысить тариф' },
  en: { def: 'Available on Pro and Business plans', btn: 'Upgrade plan' },
};

/**
 * Bolalarni BLUR qilib, ustiga qulf + upgrade tugmasi qo'yadi.
 * <PlanLock locked={!limits.ai} message="AI funksiyalari...">{children}</PlanLock>
 */
export function PlanLock({ locked, message, children, className = '' }) {
  const lang = useLang((s) => s.lang);
  const navigate = useNavigate();
  const t = TXT[lang] || TXT.uz;

  if (!locked) return children;

  return (
    <div className={`relative ${className}`}>
      {/* Blur qilingan kontent — bosib bo'lmaydi */}
      <div className="pointer-events-none select-none blur-[5px] opacity-60" aria-hidden="true">
        {children}
      </div>
      {/* Qulf overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 rounded-xl bg-background/40">
        <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-sm">
          <Lock className="h-5 w-5" />
        </div>
        <div className="text-sm font-semibold max-w-xs">{message || t.def}</div>
        <button
          onClick={() => navigate('/billing')}
          className="mt-4 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors"
        >
          {t.btn} →
        </button>
      </div>
    </div>
  );
}
