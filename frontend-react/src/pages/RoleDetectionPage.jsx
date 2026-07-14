import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../utils/roleConfig';

export default function RoleDetectionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const timer = window.setTimeout(() => {
      navigate(getDashboardPath(user.role), { replace: true });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [navigate, user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-teal-50 px-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600">Role detection</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Routing you to the right portal...</h1>
        <p className="mt-2 text-slate-600">We are identifying your access level and opening your dashboard.</p>
      </div>
    </div>
  );
}
