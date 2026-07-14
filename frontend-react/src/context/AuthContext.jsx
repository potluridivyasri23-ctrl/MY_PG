import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, fetchMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      fetchMe().then(body => {
        if (body.success && body.data) {
          localStorage.setItem('user', JSON.stringify(body.data));
          setUser(body.data);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }).catch(() => {
        // keep existing local user if available, otherwise clear invalid session
      });
    }
  }, [user]);

  const login = async (email, password, portal, role) => {
    setError('');

    try {
      const body = await loginUser(email, password, portal, role);
      if (body.success && body.data?.user) {
        const token = body.data.token || '';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(body.data.user));
        setUser(body.data.user);
        return { success: true, user: body.data.user, token };
      }

      const message = body.message || 'Invalid credentials';
      setError(message);
      return { success: false, error: message };
    } catch {
      const fallback = getDemoUser(email);
      localStorage.setItem('user', JSON.stringify(fallback));
      setUser(fallback);
      setError('Backend unavailable. Falling back to demo mode.');
      return { success: true, user: fallback };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError('');
  };

  const value = useMemo(() => ({ user, error, login, logout }), [user, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

function getDemoUser(email) {
  const value = String(email || '').trim().toLowerCase();
  const roleFromEmail = () => {
    if (value.includes('tenant')) return 'tenant';
    if (value.includes('super')) return 'super admin';
    if (value.includes('manager')) return 'branch manager';
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

  const demoUser = {
    owner: { fullName: 'Owner Demo', role: 'owner', email: 'owner@example.com' },
    'super admin': { fullName: 'Super Admin Demo', role: 'super admin', email: 'super@example.com' },
    'branch manager': { fullName: 'Branch Manager Demo', role: 'branch manager', email: 'manager@example.com' },
    receptionist: { fullName: 'Receptionist Demo', role: 'receptionist', email: 'reception@example.com' },
    accountant: { fullName: 'Accountant Demo', role: 'accountant', email: 'accountant@example.com' },
    warden: { fullName: 'Warden Demo', role: 'warden', email: 'warden@example.com' },
    'maintenance staff': { fullName: 'Maintenance Demo', role: 'maintenance staff', email: 'maintenance@example.com' },
    'housekeeping staff': { fullName: 'Housekeeping Demo', role: 'housekeeping staff', email: 'housekeeping@example.com' },
    'security guard': { fullName: 'Security Demo', role: 'security guard', email: 'security@example.com' },
    'cook / kitchen staff / inventory manager': { fullName: 'Kitchen Demo', role: 'cook / kitchen staff / inventory manager', email: 'kitchen@example.com' },
    tenant: { fullName: 'Tenant Demo', role: 'tenant', email: 'tenant@example.com' }
  };

  return demoUser[roleFromEmail()] || demoUser.tenant;
}
