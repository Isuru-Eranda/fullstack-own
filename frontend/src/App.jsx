import { useContext } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { AuthProvider } from './context/AuthProvider';
// Toast container moved to main.jsx to ensure it mounts once at app root
import LoadingLogo from './components/LoadingLogo';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import MovieShowtimes from './pages/MovieShowtimes';
import BookShowtime from './pages/BookShowtime';
import MovieForm from './pages/MovieForm';
import HallsList from './pages/admin/HallsList';
import HallForm from './pages/admin/HallForm';
import AdminDashboard from './pages/admin/AdminDashboard';
import ShowtimeManagement from './pages/admin/ShowtimeManagement';
import UserManagement from './pages/admin/UserManagement';
import ConcessionManagement from './pages/admin/concessionmanagement';
import AddSnacks from './pages/admin/addsnacks';
import UpdateSnacks from './pages/admin/updatesnacks';
import AdminLayout from './pages/admin/AdminLayout';
import Cinemas from './pages/Cinemas';
import CinemasManagement from './pages/admin/CinemasManagement';
import SnackOverviewPage from './pages/snackoverviewpage';
import { AdminOnlyRoute } from './components/ProtectedRoute';
import Concession from './pages/concession';

function AppContent() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-900">
        <LoadingLogo size={80} text="Loading..." />
      </div>
    );
  }

  // Use React Router to decide which page to show
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/cinemas" element={<Cinemas />} />
      <Route path="/movies/new" element={<AdminOnlyRoute><MovieForm /></AdminOnlyRoute>} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/movies/:id/edit" element={<AdminOnlyRoute><MovieForm /></AdminOnlyRoute>} />
      <Route path="/movies/:id/showtimes" element={<MovieShowtimes />} />
      <Route path="/showtimes/:id/book" element={<BookShowtime />} />
      <Route path="/concessions" element={<Concession />} />
      <Route path= "snacksoverview/:snackid" element= {<SnackOverviewPage />} />

      {/* Nested admin routes under /admin-dashboard to ensure admin lands in dashboard layout */}
      <Route path="/admin-dashboard" element={<AdminOnlyRoute><AdminLayout /></AdminOnlyRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="halls" element={<HallsList />} />
        <Route path="halls/:id" element={<HallForm />} />
        <Route path="cinemas" element={<CinemasManagement />} />
        <Route path="showtime-management" element={<ShowtimeManagement />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="concession-management" element={<ConcessionManagement />} />
        <Route path="addsnack" element={<AddSnacks />} />
        <Route path="updatesnack/:id" element={<UpdateSnacks />} />
      </Route>

      {/* Keep old top-level admin paths redirecting to new nested paths for backward compatibility */}
      <Route path="/halls" element={<Navigate to="/admin-dashboard/halls" replace />} />
      <Route path="/halls/:id" element={<Navigate to="/admin-dashboard/halls/:id" replace />} />
      <Route path="/showtime-management" element={<Navigate to="/admin-dashboard/showtime-management" replace />} />
      <Route path="/user-management" element={<Navigate to="/admin-dashboard/user-management" replace />} />
      <Route path="/concession-management" element={<Navigate to="/admin-dashboard/concession-management" replace />} />
      <Route path="/admin/addsnack" element={<Navigate to="/admin-dashboard/addsnack" replace />} />

    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
