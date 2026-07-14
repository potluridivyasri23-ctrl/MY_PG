import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { fetchComplaints, fetchPayments } from '../services/api';
import { getModuleContent, normalizeRole, roleConfig } from '../utils/roleConfig';

export default function TenantPortal() {
  const { user, logout } = useAuth();
  const role = 'tenant';
  const config = roleConfig[role];
  const [activeModule, setActiveModule] = useState(config.modules[0].key);

  useEffect(() => {
    setActiveModule(config.modules[0].key);
  }, [config.modules]);

  const moduleContent = useMemo(() => getModuleContent(role, activeModule), [role, activeModule]);
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({ queryKey: ['tenant-payments'], queryFn: fetchPayments, enabled: Boolean(user) });
  const { data: complaintsData, isLoading: complaintsLoading } = useQuery({ queryKey: ['tenant-complaints'], queryFn: fetchComplaints, enabled: Boolean(user) });

  if (!user) return <Navigate to="/login" replace />;
  if (normalizeRole(user.role) !== 'tenant') return <Navigate to="/access-denied" replace />;

  return (
    <DashboardLayout title={config.title} summary={config.summary} user={user} onLogout={logout}>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {config.stats.map(item => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold">{item.value}</p>
            <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="px-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Tenant tools</h3>
          <nav className="mt-4 space-y-2">
            {config.modules.map(module => {
              const Icon = module.icon;
              const activeButton = module.key === activeModule;
              return (
                <button
                  key={module.key}
                  type="button"
                  onClick={() => setActiveModule(module.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${activeButton ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{module.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{config.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{config.summary}</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">Tenant view</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-800">{moduleContent.title}</h4>
                <p className="mt-1 text-sm text-slate-500">{moduleContent.description}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{moduleContent.badge}</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {moduleContent.cards.map(card => (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">{card.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{card.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Next actions</p>
              <ul className="mt-3 space-y-2">
                {moduleContent.actions.map(action => (
                  <li key={action} className="rounded-xl bg-white p-3 border border-slate-200">{action}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Recent payments</h3>
              {paymentsLoading ? (
                <p className="mt-3 text-sm text-slate-500">Loading payments...</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {(paymentsData?.data || []).slice(0, 3).map(payment => (
                    <li key={payment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-medium text-slate-800">₹{payment.amount}</p>
                      <p className="mt-1 text-sm text-slate-500">Due {payment.dueDate}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{payment.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Open complaints</h3>
              {complaintsLoading ? (
                <p className="mt-3 text-sm text-slate-500">Loading complaints...</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {(complaintsData?.data || []).slice(0, 3).map(item => (
                    <li key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-medium text-slate-800">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
