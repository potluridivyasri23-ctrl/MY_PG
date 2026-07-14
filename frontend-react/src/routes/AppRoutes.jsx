import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LoginPage from '../pages/LoginPage';
import SharedPage from '../pages/SharedPage';
import ProtectedPortal from '../pages/ProtectedPortal';
import TenantPortal from '../pages/TenantPortal';
import RoleDetectionPage from '../pages/RoleDetectionPage';
import { AboutPage, ContactPage, FacilitiesPage, GalleryPage, HomePage, PricingPage, RoomsPage } from '../pages/VisitorPages';
import RoomDetailsPage from '../pages/RoomDetailsPage';
import { getDashboardPath } from '../utils/roleConfig';
import { Lock, KeyRound, UserRound, BellRing, Settings, LifeBuoy, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AppRoutes() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/facilities" element={<FacilitiesPage />} />
      <Route path="/rooms/:roomName" element={<RoomDetailsPage />} />
      <Route path="/rooms" element={<RoomsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={user ? <Navigate to={getDashboardPath(user.role)} replace /> : <AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/role-detect" element={<RoleDetectionPage />} />
      <Route path="/forgot-password" element={<AuthLayout><SharedPage title="Forgot Password" description="Recover access with the registered email address." icon={Lock} /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><SharedPage title="Reset Password" description="Create a new password to secure your account." icon={KeyRound} /></AuthLayout>} />
      <Route path="/profile" element={<DashboardLayout title="Profile" summary="Update personal and contact details." user={user} onLogout={logout}><SharedPage title="Profile" description="Update your personal and contact details." icon={UserRound} /></DashboardLayout>} />
      <Route path="/notifications" element={<DashboardLayout title="Notifications" summary="Review alerts, reminders, and system announcements." user={user} onLogout={logout}><SharedPage title="Notifications" description="Review alerts, reminders, and system announcements." icon={BellRing} /></DashboardLayout>} />
      <Route path="/settings" element={<DashboardLayout title="Settings" summary="Manage preferences and platform settings." user={user} onLogout={logout}><SharedPage title="Settings" description="Manage preferences and platform settings." icon={Settings} /></DashboardLayout>} />
      <Route path="/help-center" element={<DashboardLayout title="Help Center" summary="Browse guides, FAQs, and support channels." user={user} onLogout={logout}><SharedPage title="Help Center" description="Browse guides, FAQs, and support channels." icon={LifeBuoy} /></DashboardLayout>} />
      <Route path="/404" element={<DashboardLayout title="404 Page" summary="The requested page could not be found." user={user} onLogout={logout}><SharedPage title="404 Page" description="The requested page could not be found." icon={AlertTriangle} /></DashboardLayout>} />
      <Route path="/access-denied" element={<DashboardLayout title="Access Denied" summary="You do not have permission to view that portal section." user={user} onLogout={logout}><SharedPage title="Access Denied" description="You do not have permission to view that portal section." icon={ShieldCheck} /></DashboardLayout>} />
      <Route path="/tenant/*" element={<TenantPortal />} />
      <Route path="/:rolePath/*" element={<ProtectedPortal />} />
      <Route path="*" element={user ? <Navigate to={getDashboardPath(user.role)} replace /> : <Navigate to="/" replace />} />
    </Routes>
  );
}
