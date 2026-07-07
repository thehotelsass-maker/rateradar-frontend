import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

// Obuna faolmi? free — to'lanmagan; muddati o'tgan pulli reja ham nofaol.
export function isPlanActive(u) {
  return Boolean(
    u?.plan && u.plan !== 'free' &&
    (!u.planExpiresAt || new Date(u.planExpiresAt) > new Date()),
  );
}

// To'lovsiz ham ochiq qoladigan app sahifalari (to'lash imkoni shu yerda).
const PLAN_EXEMPT_PATHS = ['/billing', '/settings'];

export function ProtectedRoute({ children, requireOnboarding = true, requireAdmin = false }) {
  const user = useAuth((s) => s.user);
  const token = useAuth((s) => s.token);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin tizim administratori — onboarding talab qilinmaydi.
  if (requireOnboarding && user.role !== 'admin' && !user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // To'lov sharti: ro'yxatdan o'tish (onboarding) tugagan, lekin obuna faol
  // bo'lmagan foydalanuvchi to'lov sahifasiga yo'naltiriladi. Admin istisno.
  if (
    requireOnboarding &&
    user.role !== 'admin' &&
    user.onboardingCompleted &&
    !isPlanActive(user) &&
    !PLAN_EXEMPT_PATHS.includes(location.pathname)
  ) {
    return <Navigate to="/billing?paywall=1" replace />;
  }

  return children;
}
