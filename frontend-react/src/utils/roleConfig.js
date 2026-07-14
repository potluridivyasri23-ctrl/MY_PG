import {
  AlertTriangle,
  BarChart3,
  BellRing,
  BedDouble,
  Building2,
  CalendarClock,
  ClipboardList,
  DoorOpen,
  FileText,
  Home,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Megaphone,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  Soup,
  Users,
  UserRound,
  Wallet,
  Wrench
} from 'lucide-react';

export const roleConfig = {
  owner: {
    path: 'owner',
    title: 'Owner Portal',
    summary: 'Business overview, branch health, finances, staffing, and settings.',
    stats: [
      { label: 'Revenue', value: '₹3.2L', detail: 'Monthly revenue' },
      { label: 'Occupancy', value: '88%', detail: 'Across all branches' },
      { label: 'Staff', value: '42', detail: 'Active employees' },
      { label: 'Expenses', value: '₹48k', detail: 'This month' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Business overview and branch KPIs.', points: ['Branch performance', 'Revenue trends', 'Occupancy rate'] },
      { key: 'branch-management', label: 'Branch Management', icon: Building2, description: 'Manage branch records and expansion.', points: ['New branch onboarding', 'Performance review', 'Service standards'] },
      { key: 'staff-management', label: 'Staff Management', icon: Users, description: 'Oversee hiring, attendance, and roles.', points: ['Recruitment', 'Payroll', 'Approval workflows'] },
      { key: 'financial-reports', label: 'Financial Reports', icon: Wallet, description: 'Track revenue, expenses, and deposits.', points: ['Invoices', 'Expense reports', 'Forecasting'] },
      { key: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Data-driven planning and decision support.', points: ['Trend analysis', 'Capacity planning', 'Benchmarking'] },
      { key: 'settings', label: 'Settings', icon: Settings, description: 'Configure portals, roles, and system preferences.', points: ['Role-based access', 'Notifications', 'Backup settings'] }
    ]
  },
  'super admin': {
    path: 'admin',
    title: 'Super Admin Portal',
    summary: 'Govern roles, permissions, branches, system settings, and audit trails.',
    stats: [
      { label: 'Branches', value: '12', detail: 'Managed locations' },
      { label: 'Roles', value: '16', detail: 'Configured access sets' },
      { label: 'Alerts', value: '5', detail: 'Pending system checks' },
      { label: 'Audit Logs', value: '320', detail: 'Events today' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Site-wide system health overview.', points: ['System overview', 'Critical alerts', 'Approval queues'] },
      { key: 'roles', label: 'Role Management', icon: ShieldCheck, description: 'Create and manage access roles.', points: ['Role templates', 'Permission mapping', 'Role audits'] },
      { key: 'permissions', label: 'Permission Management', icon: KeyRound, description: 'Control feature access and compliance.', points: ['Module access', 'Tenant access', 'Security guardrails'] },
      { key: 'branches', label: 'Branches', icon: Building2, description: 'Manage all branches and their status.', points: ['Branch status', 'Geo coverage', 'Compliance'] },
      { key: 'staff', label: 'Staff', icon: Users, description: 'Support staff administration at scale.', points: ['Directory', 'Staff onboarding', 'Transfers'] },
      { key: 'system-settings', label: 'System Settings', icon: Settings, description: 'Tune platform-wide preferences.', points: ['Platform settings', 'Email', 'Notifications'] }
    ]
  },
  'branch manager': {
    path: 'manager',
    title: 'Branch Manager Portal',
    summary: 'Run day-to-day branch operations, tenant activity, staff coordination, and complaints.',
    stats: [
      { label: 'Tenants', value: '96', detail: 'Active residents' },
      { label: 'Rooms', value: '120', detail: 'Capacity' },
      { label: 'Complaints', value: '7', detail: 'Open issues' },
      { label: 'Visitors', value: '14', detail: 'Today' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Branch operations snapshot.', points: ['Occupancy', 'Daily arrivals', 'Requests'] },
      { key: 'tenant-management', label: 'Tenant Management', icon: Home, description: 'Manage resident records and lifecycle.', points: ['Admissions', 'Leases', 'Checkouts'] },
      { key: 'room-allocation', label: 'Room Allocation', icon: BedDouble, description: 'Assign beds and rooms to tenants.', points: ['Vacant beds', 'Move requests', 'Room status'] },
      { key: 'staff', label: 'Staff', icon: Users, description: 'Coordinate attendants and support teams.', points: ['Shift roster', 'Attendance', 'Task ownership'] },
      { key: 'complaints', label: 'Complaints', icon: AlertTriangle, description: 'Track issues from reporting to resolution.', points: ['Priority queue', 'Owner follow-up', 'History'] },
      { key: 'maintenance', label: 'Maintenance', icon: Wrench, description: 'Plan repair work and service tickets.', points: ['Open jobs', 'Maintenance logs', 'Inventory needs'] }
    ]
  },
  receptionist: {
    path: 'reception',
    title: 'Receptionist Portal',
    summary: 'Manage admissions, check-ins, check-outs, tenant documents, and visitor entry.',
    stats: [
      { label: 'Admissions', value: '8', detail: 'Today' },
      { label: 'Check-ins', value: '4', detail: 'Active now' },
      { label: 'Visitors', value: '12', detail: 'Pending entry' },
      { label: 'Documents', value: '6', detail: 'Pending review' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Front desk operations overview.', points: ['Incoming guests', 'Pending docs', 'Bed availability'] },
      { key: 'new-admission', label: 'New Admission', icon: DoorOpen, description: 'Create new resident admission records.', points: ['Prospect intake', 'Documents', 'Stay setup'] },
      { key: 'check-in', label: 'Check-In', icon: CalendarClock, description: 'Manage arrivals and occupancy updates.', points: ['Arrival logs', 'Deposit receipt', 'Room handover'] },
      { key: 'check-out', label: 'Check-Out', icon: FileText, description: 'Close out tenant stays and billing.', points: ['Exit summary', 'Balance check', 'Room reset'] },
      { key: 'tenant-documents', label: 'Tenant Documents', icon: ClipboardList, description: 'Store and review required documents.', points: ['ID proof', 'Payments', 'Agreements'] },
      { key: 'visitor-entry', label: 'Visitor Entry', icon: Users, description: 'Register and verify visitors.', points: ['Visitor log', 'Gate pass', 'Host verification'] }
    ]
  },
  accountant: {
    path: 'accountant',
    title: 'Accountant Portal',
    summary: 'Handle rent collection, invoices, deposits, expenses, and revenue reporting.',
    stats: [
      { label: 'Collected', value: '₹1.8L', detail: 'This week' },
      { label: 'Invoices', value: '24', detail: 'Pending' },
      { label: 'Deposits', value: '₹12k', detail: 'Cash deposit' },
      { label: 'Expenses', value: '₹18k', detail: 'Approved' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Finance snapshot and billing health.', points: ['Collections', 'Receivables', 'Expenses'] },
      { key: 'rent-collection', label: 'Rent Collection', icon: Receipt, description: 'Track monthly dues and payment status.', points: ['Pending dues', 'Overdue notes', 'Receipts'] },
      { key: 'invoices', label: 'Invoices', icon: FileText, description: 'Generate and track invoices.', points: ['Invoice drafts', 'Approved invoices', 'Tax summaries'] },
      { key: 'deposits', label: 'Deposits', icon: Wallet, description: 'Monitor deposits and reconciliations.', points: ['Cash handling', 'Deposit slips', 'Reconciliation'] },
      { key: 'expenses', label: 'Expenses', icon: Receipt, description: 'Review and approve expenses.', points: ['Bills', 'Approvals', 'Vendor payments'] },
      { key: 'reports', label: 'Reports', icon: BarChart3, description: 'Create finance and revenue summaries.', points: ['Monthly revenue', 'Expense reports', 'Audit-ready exports'] }
    ]
  },
  warden: {
    path: 'warden',
    title: 'Warden Portal',
    summary: 'Monitor tenant conduct, complaints, inspections, notices, and emergency contacts.',
    stats: [
      { label: 'Inspections', value: '9', detail: 'Scheduled' },
      { label: 'Complaints', value: '5', detail: 'Open' },
      { label: 'Notices', value: '3', detail: 'New' },
      { label: 'Emergency', value: '2', detail: 'Contacts active' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Resident oversight and compliance status.', points: ['Daily summary', 'Compliance flags', 'Emergency watch'] },
      { key: 'tenant-monitoring', label: 'Tenant Monitoring', icon: Home, description: 'Watch resident activity and follow-ups.', points: ['Visit logs', 'Disciplinary notes', 'Resident checkups'] },
      { key: 'complaints', label: 'Complaints', icon: AlertTriangle, description: 'Track and resolve resident issues.', points: ['Priority queue', 'Escalations', 'Resolution log'] },
      { key: 'room-inspection', label: 'Room Inspection', icon: ClipboardList, description: 'Plan room checks and inspections.', points: ['Inspection schedule', 'Condition reports', 'Follow-ups'] },
      { key: 'notices', label: 'Notices', icon: Megaphone, description: 'Send essential community updates.', points: ['Announcements', 'Policies', 'Health reminders'] },
      { key: 'emergency-contacts', label: 'Emergency Contacts', icon: ShieldCheck, description: 'Maintain emergency support and contacts.', points: ['Emergency numbers', 'Support staff', 'Escalation matrix'] }
    ]
  },
  'maintenance staff': {
    path: 'maintenance',
    title: 'Maintenance Portal',
    summary: 'Manage assigned jobs, status updates, repair history, and inventory requests.',
    stats: [
      { label: 'Open Jobs', value: '6', detail: 'High priority' },
      { label: 'Today', value: '3', detail: 'Scheduled tasks' },
      { label: 'History', value: '24', detail: 'Completed this month' },
      { label: 'Inventory', value: '8', detail: 'Pending requests' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Daily maintenance overview.', points: ['Open requests', 'Assigned jobs', 'Urgent problems'] },
      { key: 'assigned-jobs', label: 'Assigned Jobs', icon: Wrench, description: 'See work orders and priorities.', points: ['Work orders', 'Priority tags', 'Crew allocation'] },
      { key: 'update-status', label: 'Update Status', icon: CalendarClock, description: 'Mark progress and completion.', points: ['Progress update', 'Time tracking', 'Resolution notes'] },
      { key: 'maintenance-history', label: 'Maintenance History', icon: ClipboardList, description: 'Review prior repairs and trends.', points: ['Service history', 'Recurring issues', 'Spare replacements'] },
      { key: 'inventory-requests', label: 'Inventory Requests', icon: Package, description: 'Request spare parts and materials.', points: ['Material request', 'Purchase notes', 'Restock follow-up'] }
    ]
  },
  'housekeeping staff': {
    path: 'housekeeping',
    title: 'Housekeeping Portal',
    summary: 'Run cleaning schedules, room assignments, daily tasks, and completion tracking.',
    stats: [
      { label: 'Rooms', value: '18', detail: 'Assigned today' },
      { label: 'Tasks', value: '24', detail: 'Pending' },
      { label: 'Completed', value: '11', detail: 'Today' },
      { label: 'Schedule', value: 'On track', detail: 'Next shift' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Daily housekeeping snapshot.', points: ['Occupancy-based cleaning', 'Pending tasks', 'Shift briefs'] },
      { key: 'cleaning-schedule', label: 'Cleaning Schedule', icon: CalendarClock, description: 'Manage room cleaning timelines.', points: ['Daily rota', 'Room rotation', 'Priority jobs'] },
      { key: 'assigned-rooms', label: 'Assigned Rooms', icon: Home, description: 'Track room-wise activities.', points: ['Room checklist', 'Status updates', 'Completion notes'] },
      { key: 'daily-tasks', label: 'Daily Tasks', icon: ClipboardList, description: 'Plan and execute daily cleaning work.', points: ['Task list', 'Room inspections', 'Team notes'] },
      { key: 'completed-tasks', label: 'Completed Tasks', icon: ShieldCheck, description: 'Review completed work and quality checks.', points: ['Completion review', 'Feedback', 'Service score'] }
    ]
  },
  'security guard': {
    path: 'security',
    title: 'Security Portal',
    summary: 'Handle visitor entry and exit, resident verification, and emergency alerts.',
    stats: [
      { label: 'Visitors', value: '16', detail: 'Today' },
      { label: 'Entry logs', value: '12', detail: 'Approved' },
      { label: 'Alerts', value: '2', detail: 'New' },
      { label: 'Verification', value: '96%', detail: 'Resident match rate' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Security activity summary.', points: ['Approvals', 'Gate logs', 'Alerts'] },
      { key: 'visitor-entry', label: 'Visitor Entry', icon: Users, description: 'Register incoming guests.', points: ['Visitor log', 'Host validation', 'Pass issuance'] },
      { key: 'visitor-exit', label: 'Visitor Exit', icon: DoorOpen, description: 'Track visitors leaving the property.', points: ['Exit log', 'Check-out', 'Security notes'] },
      { key: 'resident-verification', label: 'Resident Verification', icon: ShieldCheck, description: 'Validate residents and guests.', points: ['ID check', 'Resident proof', 'Watch list'] },
      { key: 'emergency-alerts', label: 'Emergency Alerts', icon: AlertTriangle, description: 'Flag incidents and urgent actions.', points: ['Incident reports', 'Escalations', 'Response status'] }
    ]
  },
  'cook / kitchen staff / inventory manager': {
    path: 'kitchen',
    title: 'Kitchen Portal',
    summary: 'Plan meals, daily menus, inventory requests, and meal attendance.',
    stats: [
      { label: 'Meals', value: '96', detail: 'Planned' },
      { label: 'Inventory', value: '12', detail: 'Pending requests' },
      { label: 'Attendance', value: '84%', detail: 'Meal participation' },
      { label: 'Menu', value: '3', detail: 'Daily options' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Kitchen operations overview.', points: ['Meal demand', 'Inventory needs', 'Attendance'] },
      { key: 'meal-plan', label: 'Meal Plan', icon: Soup, description: 'Prepare planned meals for the week.', points: ['Weekly plan', 'Resident preferences', 'Diet notes'] },
      { key: 'daily-menu', label: 'Daily Menu', icon: FileText, description: 'Publish today’s menu options.', points: ['Menu listing', 'Availability', 'Special requests'] },
      { key: 'inventory-request', label: 'Inventory Request', icon: Package, description: 'Order ingredients and supplies.', points: ['Stock alerts', 'Vendor request', 'Restock notes'] },
      { key: 'meal-attendance', label: 'Meal Attendance', icon: Users, description: 'Track meal participation.', points: ['Attendance register', 'Absence notes', 'Feedback'] }
    ]
  },
  tenant: {
    path: 'tenant',
    title: 'Tenant Portal',
    summary: 'Manage your room, bed, payments, complaints, visitors, meals, notices, and documents.',
    stats: [
      { label: 'Room', value: 'A-12', detail: 'Assigned room' },
      { label: 'Rent', value: 'Due soon', detail: 'Next payment' },
      { label: 'Complaints', value: '1', detail: 'Open' },
      { label: 'Meals', value: '2', detail: 'Today' }
    ],
    modules: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Your stay overview.', points: ['Room status', 'Upcoming payments', 'Support tickets'] },
      { key: 'my-room', label: 'My Room', icon: Home, description: 'View room details and services.', points: ['Room info', 'Bed details', 'Service requests'] },
      { key: 'rent-payments', label: 'Rent & Payments', icon: Receipt, description: 'Track dues and payment history.', points: ['Pending dues', 'Payment receipts', 'Balance'] },
      { key: 'complaints', label: 'Complaints', icon: AlertTriangle, description: 'Raise and monitor issues.', points: ['New complaint', 'Status', 'Resolution notes'] },
      { key: 'visitor-requests', label: 'Visitor Requests', icon: Users, description: 'Request guest visits.', points: ['Visitor details', 'Availability', 'Approval status'] },
      { key: 'notices', label: 'Notices', icon: BellRing, description: 'View property notices and updates.', points: ['Announcements', 'Policies', 'Resident updates'] }
    ]
  }
};

export const normalizeRole = role => {
  const value = String(role || '').trim().toLowerCase();
  if (value.includes('tenant')) return 'tenant';
  if (value.includes('super')) return 'super admin';
  if (value.includes('branch')) return 'branch manager';
  if (value.includes('reception')) return 'receptionist';
  if (value.includes('account')) return 'accountant';
  if (value.includes('warden')) return 'warden';
  if (value.includes('maintenance')) return 'maintenance staff';
  if (value.includes('housekeeping')) return 'housekeeping staff';
  if (value.includes('security')) return 'security guard';
  if (value.includes('cook') || value.includes('kitchen') || value.includes('inventory')) return 'cook / kitchen staff / inventory manager';
  if (value.includes('owner')) return 'owner';
  return 'tenant';
};

export const getDashboardPath = role => `/${roleConfig[normalizeRole(role)]?.path || 'tenant'}/dashboard`;

export const getPortalOptions = () =>
  Object.values(roleConfig).map(role => ({
    value: role.path,
    label: role.title
  }));

const ROLE_FOR_PORTAL = Object.fromEntries(
  Object.entries(roleConfig).map(([role, value]) => [value.path, role])
);

export const getRoleForPortal = portal => {
  const normalizedPortal = String(portal || '').trim().toLowerCase();
  return ROLE_FOR_PORTAL[normalizedPortal] || 'tenant';
};

export const getModuleContent = (role, moduleKey) => {
  const roleLabel = roleConfig[role]?.title || 'Portal';
  const base = {
    title: `${roleLabel} workspace`,
    badge: 'Ready for action',
    description: 'This section is structured as a practical management workspace instead of a static placeholder.',
    cards: [
      { title: 'Operational focus', body: 'Review the most relevant activity for this module and keep daily follow-ups visible.' },
      { title: 'Action trail', body: 'Track the next steps, approvals, or service updates without leaving the portal.' }
    ],
    actions: ['Review current records', 'Confirm pending follow-ups', 'Escalate blockers quickly']
  };

  switch (moduleKey) {
    case 'dashboard':
      return {
        ...base,
        title: 'Daily operations snapshot',
        badge: 'Live view',
        description: 'See the status of occupancy, service requests, payments, and team activity in one place.',
        cards: [
          { title: 'Priority queue', body: 'Open requests, urgent complaints, and approvals are grouped for faster triage.' },
          { title: 'Team coverage', body: 'Shift status and task ownership are surfaced so operations stay coordinated.' }
        ],
        actions: ['Open critical alerts', 'Check today’s workload', 'Share a daily summary']
      };
    case 'branch-management':
    case 'branches':
      return {
        ...base,
        title: 'Branch oversight',
        badge: 'Expansion ready',
        description: 'Keep branch records, service levels, and performance trends aligned across locations.',
        cards: [
          { title: 'Branch health', body: 'Review occupancy, revenue, and service performance for each branch.' },
          { title: 'Growth actions', body: 'Plan onboarding, staffing, and resource adjustments from one place.' }
        ],
        actions: ['Review branch KPIs', 'Add a branch update', 'Schedule expansion planning']
      };
    case 'staff-management':
    case 'staff':
      return {
        ...base,
        title: 'People management',
        badge: 'HR workflow',
        description: 'Manage staff records, attendance, approvals, and role handoffs without switching tools.',
        cards: [
          { title: 'Attendance tracker', body: 'Keep schedules, leaves, and attendance summaries current.' },
          { title: 'Approval flow', body: 'Route new hires, transfers, and role changes through a clear workflow.' }
        ],
        actions: ['Review staff status', 'Approve pending changes', 'Prepare shift plans']
      };
    case 'financial-reports':
    case 'rent-collection':
    case 'invoices':
    case 'deposits':
    case 'expenses':
    case 'reports':
      return {
        ...base,
        title: 'Finance management',
        badge: 'Money flow',
        description: 'Track revenue, dues, invoices, deposits, and monthly reporting from a single control point.',
        cards: [
          { title: 'Collections status', body: 'See which payments are pending, overdue, or already reconciled.' },
          { title: 'Budget review', body: 'Monitor expenses and compare spending against expected targets.' }
        ],
        actions: ['View overdue dues', 'Generate invoice summary', 'Approve expense entries']
      };
    case 'analytics':
      return {
        ...base,
        title: 'Business analytics',
        badge: 'Forecasting',
        description: 'Turn operational data into planning insights for occupancy, growth, and service quality.',
        cards: [
          { title: 'Trend report', body: 'Compare occupancy, payments, and complaints across recent periods.' },
          { title: 'Planning view', body: 'Use the dashboard insights to prepare staffing and capacity adjustments.' }
        ],
        actions: ['Review trend charts', 'Prepare monthly forecast', 'Share performance report']
      };
    case 'settings':
    case 'system-settings':
      return {
        ...base,
        title: 'System configuration',
        badge: 'Control center',
        description: 'Handle access rules, notifications, and platform defaults in a structured workspace.',
        cards: [
          { title: 'Role setup', body: 'Keep portal permissions aligned with real team responsibilities.' },
          { title: 'Preference management', body: 'Configure alerts, defaults, and workflow options for each portal.' }
        ],
        actions: ['Update permissions', 'Adjust notifications', 'Review backup settings']
      };
    case 'roles':
    case 'permissions':
      return {
        ...base,
        title: 'Access governance',
        badge: 'Security',
        description: 'Coordinate role templates, permissions, and compliance controls across the platform.',
        cards: [
          { title: 'Permission map', body: 'Review which modules and actions each role can access.' },
          { title: 'Audit trail', body: 'Track role changes and sensitive permission updates over time.' }
        ],
        actions: ['Review role templates', 'Update access rules', 'Inspect security changes']
      };
    case 'tenant-management':
    case 'tenant-monitoring':
    case 'my-room':
      return {
        ...base,
        title: 'Resident lifecycle',
        badge: 'Resident care',
        description: 'Manage resident records, room details, notices, and service follow-ups with clarity.',
        cards: [
          { title: 'Resident overview', body: 'Keep admission details, stay status, and contact information current.' },
          { title: 'Service follow-up', body: 'Track requests and support actions to ensure quick resolution.' }
        ],
        actions: ['Review resident records', 'Open service request', 'Update room details']
      };
    case 'room-allocation':
    case 'room-inspection':
    case 'assigned-rooms':
      return {
        ...base,
        title: 'Room operations',
        badge: 'Allocation',
        description: 'Track occupancy, vacancy, room assignment changes, and inspection status.',
        cards: [
          { title: 'Bed availability', body: 'Monitor vacant rooms and upcoming assignments.' },
          { title: 'Inspection status', body: 'Capture room condition, repair needs, and maintenance follow-up.' }
        ],
        actions: ['Review vacant rooms', 'Assign a resident', 'Log inspection notes']
      };
    case 'complaints':
      return {
        ...base,
        title: 'Issue tracking',
        badge: 'Service response',
        description: 'Ensure complaints move from intake to resolution with clear ownership and timing.',
        cards: [
          { title: 'Priority tickets', body: 'Surface urgent issues that need immediate attention.' },
          { title: 'Resolution history', body: 'Track updates, owner notes, and closure status.' }
        ],
        actions: ['Open complaint queue', 'Escalate urgent issues', 'Close resolved cases']
      };
    case 'maintenance':
    case 'assigned-jobs':
    case 'update-status':
    case 'maintenance-history':
    case 'inventory-requests':
      return {
        ...base,
        title: 'Maintenance workflow',
        badge: 'Field operations',
        description: 'Coordinate repair activity, status updates, and spare parts requests in one place.',
        cards: [
          { title: 'Open jobs', body: 'Keep active work orders visible and prioritized.' },
          { title: 'Parts planning', body: 'Request materials and monitor inventory follow-up in real time.' }
        ],
        actions: ['Review assigned jobs', 'Update task status', 'Submit inventory request']
      };
    case 'new-admission':
    case 'check-in':
    case 'check-out':
      return {
        ...base,
        title: 'Front-desk operations',
        badge: 'Arrival control',
        description: 'Handle arrivals, document checks, room handovers, and departures with a guided workflow.',
        cards: [
          { title: 'Admission checklist', body: 'Confirm documents, deposit status, and stay details before completion.' },
          { title: 'Desk handoff', body: 'Pass room readiness and occupancy updates to the next team smoothly.' }
        ],
        actions: ['Process new request', 'Verify documents', 'Confirm room readiness']
      };
    case 'tenant-documents':
    case 'visitor-entry':
    case 'visitor-exit':
    case 'resident-verification':
      return {
        ...base,
        title: 'Entry and verification',
        badge: 'Security flow',
        description: 'Keep visitor movement, resident verification, and gate access records organized and accurate.',
        cards: [
          { title: 'Entry log', body: 'Review approved visitors and pending host verification.' },
          { title: 'Verification status', body: 'Confirm resident identity and secure access before entry.' }
        ],
        actions: ['Verify incoming guest', 'Track visitor exit', 'Review approvals']
      };
    case 'cleaning-schedule':
    case 'daily-tasks':
    case 'completed-tasks':
      return {
        ...base,
        title: 'Housekeeping workflow',
        badge: 'Cleanliness',
        description: 'Plan room cleaning, assign tasks, and review completion with simple operational checkpoints.',
        cards: [
          { title: 'Task roster', body: 'Organize daily cleaning assignments by room and priority.' },
          { title: 'Quality review', body: 'Confirm completed work and capture follow-up notes.' }
        ],
        actions: ['Review cleaning roster', 'Update task progress', 'Log completed rooms']
      };
    case 'meal-plan':
    case 'daily-menu':
    case 'inventory-request':
    case 'meal-attendance':
      return {
        ...base,
        title: 'Kitchen operations',
        badge: 'Food service',
        description: 'Coordinate meal planning, inventory requests, and attendance with a practical kitchen workflow.',
        cards: [
          { title: 'Meal planning', body: 'Prepare menus based on resident demand and dietary needs.' },
          { title: 'Supply readiness', body: 'Track ingredient requests and restock follow-up clearly.' }
        ],
        actions: ['Review meal plan', 'Update menu options', 'Submit inventory request']
      };
    case 'notices':
    case 'emergency-contacts':
    case 'emergency-alerts':
      return {
        ...base,
        title: 'Communication center',
        badge: 'Alerts',
        description: 'Keep announcements, notices, and emergency follow-up steps easy to review and act on.',
        cards: [
          { title: 'Message queue', body: 'Prepare community notices and direct updates to the right audience.' },
          { title: 'Emergency coordination', body: 'Store contact steps and escalation details where teams can find them quickly.' }
        ],
        actions: ['Send notice', 'Review alert list', 'Confirm contact details']
      };
    case 'visitor-requests':
      return {
        ...base,
        title: 'Guest requests',
        badge: 'Resident experience',
        description: 'Manage visitor approvals and guest planning from request through arrival confirmation.',
        cards: [
          { title: 'Visit requests', body: 'Keep upcoming guest visits and approval status organized.' },
          { title: 'Host coordination', body: 'Confirm approval timing and any resident-specific notice requirements.' }
        ],
        actions: ['Review visitor requests', 'Approve guest visit', 'Update host notes']
      };
    default:
      return base;
  }
};
