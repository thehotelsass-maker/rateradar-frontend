import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useT } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AuthBrandPanel } from '@/components/AuthBrandPanel';

export default function Login() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuth((s) => s.login);
  const loading = useAuth((s) => s.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (!user.onboardingCompleted) navigate('/onboarding', { replace: true });
      else navigate(from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* CHAP — brending paneli (faqat lg) */}
      <AuthBrandPanel />

      {/* O'NG — forma */}
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="absolute top-5 right-5">
          <LanguageSwitcher />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* Mobil logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[hsl(221_83%_42%)] grid place-items-center font-bold text-white shadow-lg">R</div>
            <span className="font-bold text-[15px]">TheHotelSaaS</span>
          </Link>

          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight">{t('signIn')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('welcomeBack')}</p>
          </div>

          {/* Tab — Kirish / Ro'yxat */}
          <div className="flex bg-secondary rounded-xl p-1 mb-6">
            <button className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-card shadow-sm">
              {t('login')}
            </button>
            <Link
              to="/register"
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-muted-foreground text-center hover:text-foreground transition-colors"
            >
              {t('register')}
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email" type="email" placeholder="hello@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoFocus className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password" type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={6} className="pl-10 h-11"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-full h-11" size="lg">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('loggingIn')}
                </>
              ) : (
                <>
                  {t('signIn')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center text-sm mt-6 text-muted-foreground">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              {t('signUp')}
            </Link>
          </div>
        </motion.div>

        <div className="mt-8 text-xs text-muted-foreground">© 2026 TheHotelSaaS</div>
      </div>
    </div>
  );
}
