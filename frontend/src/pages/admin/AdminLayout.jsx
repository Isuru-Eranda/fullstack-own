import { Outlet } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from '../../hooks/useNavigate';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';
import Logo from '../../components/Logo';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    toast.success('You have been successfully logged out.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Logo size={56} />
          <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
          {user && (
            <div className="ml-4 text-sm text-text-muted">Signed in as <span className="font-medium">{user.firstName || user.email}</span></div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-8">
          <aside className="col-span-1 bg-surface-600 rounded-xl p-4 border border-surface-400/30 flex flex-col justify-between">
            <nav className="space-y-2">
              <a href="/admin-dashboard" className="block px-3 py-2 rounded hover:bg-surface-500">Overview</a>
              <a href="/admin-dashboard/halls" className="block px-3 py-2 rounded hover:bg-surface-500">Halls</a>
              <a href="/admin-dashboard/showtime-management" className="block px-3 py-2 rounded hover:bg-surface-500">Showtimes</a>
              <a href="/admin-dashboard/user-management" className="block px-3 py-2 rounded hover:bg-surface-500">Users</a>
              <a href="/admin-dashboard/concession-management" className="block px-3 py-2 rounded hover:bg-surface-500">Concessions</a>
              <a href="/admin-dashboard/addsnack" className="block px-3 py-2 rounded hover:bg-surface-500">Add Snacks</a>
            </nav>

            <div className="mt-6">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full px-3 py-2 bg-semantic-error hover:bg-red-600 text-white rounded-lg font-medium"
              >
                Logout
              </button>
            </div>
          </aside>

          <main className="col-span-3 bg-surface-600 rounded-xl p-6 border border-surface-400/30">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        confirmText="Yes, Logout"
        theme="default"
      />
    </div>
  );
}
