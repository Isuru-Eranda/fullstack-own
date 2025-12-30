import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div>Please login to view your profile.</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center border-2 border-purple-400 text-2xl font-bold">
            {((user.name || user.firstName || user.email || 'U').charAt(0)).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.name || user.email}</h1>
            <p className="text-gray-300">{user.email}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-purple-500">
          <h2 className="text-lg font-semibold mb-4">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">First name</div>
              <div className="text-white">{user.firstName || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Last name</div>
              <div className="text-white">{user.lastName || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Email</div>
              <div className="text-white">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Phone</div>
              <div className="text-white">{user.phone || '-'}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-purple-600 rounded">Home</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
