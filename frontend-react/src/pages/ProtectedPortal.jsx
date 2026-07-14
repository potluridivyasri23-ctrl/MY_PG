import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, BarChart3, BedDouble, BellRing, Building2, ClipboardList, Download, FileText, Home, LayoutDashboard, LogOut, Receipt, Settings, ShieldCheck, Users, UserRound, Wallet, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { fetchBranches, fetchComplaints, fetchDashboard, fetchMaintenanceRequests, fetchPayments, fetchRooms, fetchStaff, fetchTenants, fetchVisitors } from '../services/api';
import { getModuleContent, normalizeRole, roleConfig } from '../utils/roleConfig';

const ownerMenu = [
  { label: 'Dashboard', icon: LayoutDashboard, children: ['Review KPIs', 'Business overview'] },
  { label: 'Branches', icon: Building2, children: ['All branches', 'Performance', 'Add branch'] },
  { label: 'Staff', icon: Users, children: ['Overview', 'Attendance', 'Payroll'] },
  { label: 'Tenants', icon: Home, children: ['Occupancy', 'Residents', 'Check-ins'] },
  { label: 'Finance', icon: Wallet, children: ['Revenue', 'Expenses', 'Profit'] },
  { label: 'Rooms', icon: BedDouble, children: ['Status', 'Occupancy', 'Comparison'] },
  { label: 'Reports', icon: FileText, children: ['Revenue', 'Occupancy', 'Tenant'] },
  { label: 'Notifications', icon: BellRing, children: ['Alerts', 'Insights'] },
  { label: 'Settings', icon: Settings, children: ['Preferences', 'Security'] },
  { label: 'Profile', icon: UserRound, children: ['Edit profile', 'Security'] },
  { label: 'Logout', icon: LogOut, children: ['End session'] }
];

const ownerKpis = [
  { label: 'Total Branches', value: '2', detail: 'Active regional sites' },
  { label: 'Total Staff', value: '15', detail: 'Managers and support teams' },
  { label: 'Total Tenants', value: '96', detail: 'Residents across branches' },
  { label: 'Total Rooms', value: '50', detail: 'Configured room inventory' },
  { label: 'Occupied Beds', value: '82', detail: 'Across all branches' },
  { label: 'Vacant Beds', value: '18', detail: 'Ready for admissions' },
  { label: 'Monthly Revenue', value: '₹3.2L', detail: 'This month' },
  { label: 'Monthly Expenses', value: '₹1.8L', detail: 'Operational spend' },
  { label: 'Net Profit', value: '₹1.4L', detail: 'Healthy margin' },
  { label: 'Pending Complaints', value: '7', detail: 'Needs follow-up' },
  { label: 'Pending Maintenance', value: '4', detail: 'Repair queue' },
  { label: 'Occupancy Percentage', value: '82%', detail: 'Current occupancy' }
];

const revenueSeries = [
  { label: 'Mon', value: 68 },
  { label: 'Tue', value: 72 },
  { label: 'Wed', value: 84 },
  { label: 'Thu', value: 91 },
  { label: 'Fri', value: 78 },
  { label: 'Sat', value: 88 },
  { label: 'Sun', value: 95 }
];

const occupancySeries = [
  { label: 'Total Beds', value: 100, color: 'bg-slate-700' },
  { label: 'Occupied', value: 82, color: 'bg-emerald-500' },
  { label: 'Vacant', value: 18, color: 'bg-amber-500' }
];

const expenseSeries = [
  { label: 'Salaries', value: 42 },
  { label: 'Food', value: 20 },
  { label: 'Electricity', value: 13 },
  { label: 'Water', value: 7 },
  { label: 'Internet', value: 8 },
  { label: 'Maintenance', value: 10 }
];

const branchRows = [
  { name: 'Main Branch', occupancy: '84%', revenue: '₹1.2L', expenses: '₹68k', profit: '₹54k' },
  { name: 'North Wing', occupancy: '79%', revenue: '₹88k', expenses: '₹51k', profit: '₹37k' }
];

const complaintStats = [
  { label: 'Open Complaints', value: '7' },
  { label: 'Resolved', value: '24' },
  { label: 'Pending', value: '3' },
  { label: 'High Priority', value: '2' }
];

const maintenanceStats = [
  { label: 'Pending Repairs', value: '4' },
  { label: 'Completed Repairs', value: '18' },
  { label: 'Cost of Repairs', value: '₹34k' }
];

const notifications = [
  'Branch revenue exceeded target.',
  'Monthly report is ready.',
  'High-priority complaint pending.',
  'Electricity bill is due.',
  'Occupancy reached 95%.'
];

export default function ProtectedPortal() {
  const { user, logout } = useAuth();
  const { rolePath } = useParams();
  const role = user ? normalizeRole(user.role) : 'owner';
  const config = roleConfig[role] || roleConfig.owner;
  const [activeModule, setActiveModule] = useState(config.modules[0].key);
  const isAuthorized = rolePath === config.path;

  useEffect(() => {
    setActiveModule(config.modules[0].key);
  }, [config.path]);

  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard });
  const { data: branchesData, isLoading: branchesLoading } = useQuery({ queryKey: ['branches'], queryFn: fetchBranches, enabled: role === 'owner' });
  const { data: staffData, isLoading: staffLoading } = useQuery({ queryKey: ['staff'], queryFn: fetchStaff, enabled: role === 'owner' });
  const { data: visitorsData, isLoading: visitorsLoading } = useQuery({ queryKey: ['visitors'], queryFn: fetchVisitors, enabled: role === 'owner' });
  const { data: maintenanceData, isLoading: maintenanceLoading } = useQuery({ queryKey: ['maintenance-requests'], queryFn: fetchMaintenanceRequests, enabled: role === 'owner' });
  const { data: tenantsData, isLoading: tenantsLoading } = useQuery({ queryKey: ['tenants'], queryFn: fetchTenants, enabled: role === 'branch manager' });
  const { data: complaintsData, isLoading: complaintsLoading } = useQuery({ queryKey: ['complaints'], queryFn: fetchComplaints, enabled: ['branch manager', 'warden', 'tenant', 'owner'].includes(role) });
  const { data: roomsData, isLoading: roomsLoading } = useQuery({ queryKey: ['rooms'], queryFn: fetchRooms, enabled: ['branch manager', 'receptionist', 'maintenance staff'].includes(role) });
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({ queryKey: ['payments'], queryFn: fetchPayments, enabled: ['branch manager', 'accountant', 'tenant'].includes(role) });

  const ownerStats = useMemo(() => {
    if (role !== 'owner') return config.stats;
    return [
      {
        label: 'Branches',
        value: branchesData?.data?.length ?? data?.data?.stats?.totalBranches ?? config.stats[0]?.value,
        detail: 'Active locations'
      },
      {
        label: 'Staff',
        value: staffData?.data?.length ?? config.stats[1]?.value,
        detail: 'Employees across branches'
      },
      {
        label: 'Open complaints',
        value: complaintsData?.data?.length ?? data?.data?.stats?.openComplaints ?? '—',
        detail: 'Needs follow-up'
      },
      {
        label: 'Pending maintenance',
        value: maintenanceData?.data?.length ?? data?.data?.stats?.pendingMaintenance ?? '—',
        detail: 'Work orders waiting'
      },
      {
        label: 'Today visitors',
        value: visitorsData?.data?.length ?? data?.data?.stats?.todaysVisitors ?? '—',
        detail: 'Checked in today'
      },
      {
        label: 'Total rooms',
        value: data?.data?.stats?.totalRooms ?? config.stats[3]?.value,
        detail: 'Configured rooms'
      }
    ];
  }, [role, branchesData, staffData, complaintsData, maintenanceData, visitorsData, data, config.stats]);

  const branchRowsData = useMemo(() => {
    if (branchesData?.data?.length) {
      return branchesData.data.map(branch => ({
        id: branch.id,
        name: branch.name,
        location: `${branch.city || 'N/A'}, ${branch.state || 'N/A'}`,
        status: branch.status,
        manager: branch.managerId || 'Unassigned'
      }));
    }
    return branchRows;
  }, [branchesData]);

  const workflowTasks = useMemo(() => {
    if (role !== 'owner') return [];
    return [
      {
        title: 'Open complaints',
        count: complaintsData?.data?.length ?? data?.data?.stats?.openComplaints ?? 0,
        detail: 'Items requiring owner review'
      },
      {
        title: 'Pending maintenance',
        count: maintenanceData?.data?.length ?? data?.data?.stats?.pendingMaintenance ?? 0,
        detail: 'Service tickets waiting'
      },
      {
        title: 'New visitors today',
        count: visitorsData?.data?.length ?? data?.data?.stats?.todaysVisitors ?? 0,
        detail: 'Current guest arrivals'
      },
      {
        title: 'Active branches',
        count: branchesData?.data?.length ?? data?.data?.stats?.totalBranches ?? 0,
        detail: 'Locations online'
      }
    ];
  }, [role, complaintsData, maintenanceData, visitorsData, branchesData, data]);

  const stats = role === 'owner' ? ownerStats : useMemo(() => config.stats.map(item => ({ ...item, value: item.value })), [config.stats]);
  const active = config.modules.find(module => module.key === activeModule) || config.modules[0];
  const moduleContent = useMemo(() => getModuleContent(role, active.key), [role, active.key]);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAuthorized) return <Navigate to="/access-denied" replace />;

  if (role === 'owner') {
    return (
      <DashboardLayout title={config.title} summary={config.summary} user={user} onLogout={logout}>
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Owner menu</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Operations</h3>
            </div>
            <nav className="mt-4 space-y-2">
              {ownerMenu.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Icon className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.children ? <div className="mt-2 pl-6 text-xs text-slate-500">{item.children.join(' • ')}</div> : null}
                  </div>
                );
              })}
            </nav>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 p-6 text-white shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-100">Owner dashboard</p>
                  <h2 className="mt-2 text-3xl font-semibold">Business KPIs at a glance</h2>
                  <p className="mt-2 max-w-2xl text-indigo-100">Review branches, revenue, occupancy, complaints, and maintenance from one control center.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-indigo-700">Add Branch</button>
                  <button className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white">View Reports</button>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ownerKpis.map(item => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Revenue chart</h3>
                    <p className="mt-1 text-sm text-slate-500">Daily, weekly, monthly, and yearly performance</p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">Daily Revenue</span>
                </div>
                <div className="mt-6 flex h-40 items-end gap-3">
                  {revenueSeries.map(bar => (
                    <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-2xl bg-indigo-600" style={{ height: `${bar.value}%` }} />
                      <span className="text-xs text-slate-500">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Occupancy chart</h3>
                <p className="mt-1 text-sm text-slate-500">Shows total beds, occupied beds, and vacant beds.</p>
                <div className="mt-6 space-y-3">
                  {occupancySeries.map(item => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Expense chart</h3>
                <p className="mt-1 text-sm text-slate-500">Expenses grouped by category.</p>
                <div className="mt-6 space-y-3">
                  {expenseSeries.map(item => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Quick actions</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Add Branch', 'View Reports', 'View Revenue', 'View Occupancy', 'Export Report'].map(action => (
                    <button key={action} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600">{action}</button>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  Owner can view all branches, reports, finances, and analytics while leaving room-level operations to operational teams.
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Branch performance</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 pr-4 font-medium">Branch</th>
                      <th className="pb-3 pr-4 font-medium">Occupancy</th>
                      <th className="pb-3 pr-4 font-medium">Revenue</th>
                      <th className="pb-3 pr-4 font-medium">Expenses</th>
                      <th className="pb-3 font-medium">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchRows.map(row => (
                      <tr key={row.name} className="border-b border-slate-100 text-slate-700">
                        <td className="py-3 pr-4 font-medium">{row.name}</td>
                        <td className="py-3 pr-4">{row.occupancy}</td>
                        <td className="py-3 pr-4">{row.revenue}</td>
                        <td className="py-3 pr-4">{row.expenses}</td>
                        <td className="py-3">{row.profit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Complaint summary</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {complaintStats.map(item => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Maintenance summary</h3>
                <div className="mt-4 space-y-3">
                  {maintenanceStats.map(item => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {notifications.map(item => (
                    <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Reports & permissions</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Revenue Report', 'Expense Report', 'Profit & Loss', 'Occupancy Report'].map(report => (
                    <span key={report} className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">{report}</span>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck className="h-4 w-4" /> Owner can view all branches, reports, finances, and analytics.</div>
                  <div className="mt-3 flex items-center gap-2 text-slate-600"><AlertTriangle className="h-4 w-4 text-amber-500" /> Operational tasks like assignment, check-in, and maintenance handling remain with the staff.</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={config.title} summary={config.summary} user={user} onLogout={logout}>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(item => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold">{item.value}</p>
            <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="px-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Modules</h3>
          <nav className="mt-4 space-y-2">
            {config.modules.map(module => {
              const Icon = module.icon;
              const activeButton = module.key === activeModule;
              return (
                <button key={module.key} type="button" onClick={() => setActiveModule(module.key)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${activeButton ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{module.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600">
              <div className="rounded-2xl bg-indigo-50 p-2"><active.icon className="h-5 w-5" /></div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">{active.label}</h3>
                <p className="text-sm text-slate-500">{active.description}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-800">{moduleContent.title}</h4>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">{moduleContent.badge}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{moduleContent.description}</p>
                <div className="mt-4 space-y-3">
                  {moduleContent.cards.map(card => (
                    <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-700">{card.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h4 className="font-semibold text-slate-800">Suggested actions</h4>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {moduleContent.actions.map(action => (
                    <li key={action} className="rounded-xl bg-slate-50 p-3">{action}</li>
                  ))}
                </ul>
              </div>
            </div>
            {role === 'branch manager' && active.key === 'tenant-management' ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-800">Tenant roster</h4>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Live API</span>
                </div>
                {tenantsLoading ? <p className="mt-3 text-sm text-slate-500">Loading tenant records...</p> : (
                  <div className="mt-4 space-y-3">
                    {(tenantsData?.data || []).slice(0, 4).map(tenant => (
                      <div key={tenant.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-700">{tenant.fullName}</p>
                          <p className="text-sm text-slate-500">{tenant.room} • {tenant.email}</p>
                        </div>
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{tenant.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
            {['branch manager', 'warden', 'tenant'].includes(role) && active.key === 'complaints' ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-800">Complaint queue</h4>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">Live API</span>
                </div>
                {complaintsLoading ? <p className="mt-3 text-sm text-slate-500">Loading complaints...</p> : (
                  <div className="mt-4 space-y-3">
                    {(complaintsData?.data || []).slice(0, 4).map(complaint => (
                      <div key={complaint.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-slate-700">{complaint.title}</p>
                          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">{complaint.priority}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{complaint.description}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{complaint.reportedBy} • {complaint.status}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
            {['branch manager', 'receptionist', 'maintenance staff'].includes(role) && active.key === 'room-allocation' ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-800">Room availability</h4>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Live API</span>
                </div>
                {roomsLoading ? <p className="mt-3 text-sm text-slate-500">Loading rooms...</p> : (
                  <div className="mt-4 space-y-3">
                    {(roomsData?.data || []).slice(0, 4).map(room => (
                      <div key={room.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-700">{room.name}</p>
                          <p className="text-sm text-slate-500">{room.type} • ₹{room.rent}</p>
                        </div>
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{room.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
            {['branch manager', 'accountant', 'tenant'].includes(role) && active.key === 'rent-payments' ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-800">Payment schedule</h4>
                  <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">Live API</span>
                </div>
                {paymentsLoading ? <p className="mt-3 text-sm text-slate-500">Loading payments...</p> : (
                  <div className="mt-4 space-y-3">
                    {(paymentsData?.data || []).slice(0, 4).map(payment => (
                      <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-700">{payment.tenant}</p>
                          <p className="text-sm text-slate-500">Due {payment.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-700">₹{payment.amount}</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{payment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600">
                <BarChart3 className="h-5 w-5" />
                <h3 className="font-semibold">Operations overview</h3>
              </div>
              <p className="mt-3 text-sm text-slate-500">The portal shell is now structured around dedicated pages, layouts, and services for easier growth.</p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                {isLoading ? 'Loading dashboard data...' : data?.message || 'Dashboard data ready.'}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800">Shared pages</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="rounded-xl bg-slate-50 p-3">Login, Forgot Password, Reset Password</li>
                <li className="rounded-xl bg-slate-50 p-3">Profile, Change Password, Notifications</li>
                <li className="rounded-xl bg-slate-50 p-3">Settings, Help Center, Access Denied</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
