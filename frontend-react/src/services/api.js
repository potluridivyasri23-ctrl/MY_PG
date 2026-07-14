const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || '';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function buildUrl(path) {
  if (API_BASE) {
    return `${API_BASE.replace(/\/+$/, '')}${path}`;
  }
  return path;
}

export async function loginUser(email, password, portal, role) {
  const response = await fetch(buildUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, portal, role })
  });

  return response.json();
}

export async function fetchMe() {
  const response = await fetch(buildUrl('/api/me'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load user');
  return response.json();
}

export async function fetchDashboard() {
  const response = await fetch(buildUrl('/api/dashboard'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load dashboard');
  return response.json();
}

export async function fetchTenants() {
  const response = await fetch(buildUrl('/api/tenants'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load tenants');
  return response.json();
}

export async function fetchComplaints() {
  const response = await fetch(buildUrl('/api/complaints'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load complaints');
  return response.json();
}

export async function fetchRooms() {
  const response = await fetch(buildUrl('/api/rooms'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load rooms');
  return response.json();
}

export async function fetchPayments() {
  const response = await fetch(buildUrl('/api/payments'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load payments');
  return response.json();
}

export async function fetchBranches() {
  const response = await fetch(buildUrl('/api/branches'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load branches');
  return response.json();
}

export async function fetchStaff() {
  const response = await fetch(buildUrl('/api/staff'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load staff');
  return response.json();
}

export async function fetchRoomAllocations() {
  const response = await fetch(buildUrl('/api/room-allocations'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load room allocations');
  return response.json();
}

export async function fetchVisitors() {
  const response = await fetch(buildUrl('/api/visitors'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load visitors');
  return response.json();
}

export async function fetchExpenses() {
  const response = await fetch(buildUrl('/api/expenses'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load expenses');
  return response.json();
}

export async function fetchMaintenanceRequests() {
  const response = await fetch(buildUrl('/api/maintenance-requests'), {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to load maintenance requests');
  return response.json();
}
