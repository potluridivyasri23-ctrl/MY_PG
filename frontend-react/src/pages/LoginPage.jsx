import { useState } from 'react';
import { Building2, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath, getPortalOptions, getRoleForPortal } from '../utils/roleConfig';
import loginHeroImage from '../pg photos/Standard Single.jpg';

export default function LoginPage() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async event => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;
    const portal = event.target.portal ? event.target.portal.value : null;
    const role = getRoleForPortal(portal);
    setLoading(true);
    const result = await login(email, password, portal, role);
    setLoading(false);

    // send login event to backend after JWT login succeeds
    if (result.success && result.token) {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${API_BASE.replace(/\/+$/,'')}/api/logins`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${result.token}`
          },
          body: JSON.stringify({ email, role: result.user?.role || role, timestamp: new Date().toISOString(), metadata: { source: 'web-login' } })
        });
      } catch (err) {
        // non-fatal
      }
    }

    if (result.success) {
      const redirectTo = location.state?.from || getDashboardPath(result.user?.portal || result.user?.role);
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:flex-row">
        <div className="relative flex-1 overflow-hidden p-8 text-white">
          <img src={loginHeroImage} alt="PG room interior" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/60 to-indigo-900/70" />
          <div className="relative">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">
              <Building2 className="h-5 w-5" /> MY-PG Platform
            </div>
            <h1 className="mt-6 text-4xl font-semibold">Welcome to My PG</h1>
            <p className="mt-4 max-w-md text-indigo-100">We are here to help you manage your stay, your room, and every need with care and comfort.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Secure access', body: 'Private sign-in for owners, admins, and tenants.', icon: ShieldCheck },
                { title: 'Daily operations', body: 'Track occupancy, complaints, and requests from one place.', icon: Users }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur">
                    <div className="flex items-center gap-2 text-indigo-100">
                      <Icon className="h-4 w-4" />
                      <p className="font-medium">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm text-indigo-100/90">{item.body}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Owner', 'Super Admin', 'Tenant'].map(item => (
                <span key={item} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm">{item}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.25em]">Welcome back</p>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-slate-800">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-500">We are here to help you access your PG dashboard quickly and easily.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email address</label>
              <input name="email" type="text" placeholder="owner@example.com" required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-0 focus:border-indigo-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input name="password" type="password" placeholder="Enter your password" required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none ring-0 focus:border-indigo-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Portal</label>
              <select name="portal" defaultValue="tenant" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none ring-0 focus:border-indigo-500">
                {getPortalOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:opacity-70">{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

