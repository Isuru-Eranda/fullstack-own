import { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { AdminOnlyRoute } from './components/ProtectedRoute';

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
      <Route path="/movies/new" element={<AdminOnlyRoute><MovieForm /></AdminOnlyRoute>} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/movies/:id/edit" element={<AdminOnlyRoute><MovieForm /></AdminOnlyRoute>} />
      <Route path="/movies/:id/showtimes" element={<MovieShowtimes />} />
      <Route path="/showtimes/:id/book" element={<BookShowtime />} />
      <Route path="/admin-dashboard" element={<AdminOnlyRoute><AdminDashboard /></AdminOnlyRoute>} />
      <Route path="/halls" element={<AdminOnlyRoute><HallsList /></AdminOnlyRoute>} />
      <Route path="/halls/:id" element={<AdminOnlyRoute><HallForm /></AdminOnlyRoute>} />
      <Route path="/showtime-management" element={<AdminOnlyRoute><ShowtimeManagement /></AdminOnlyRoute>} />
      <Route path="/user-management" element={<AdminOnlyRoute><UserManagement /></AdminOnlyRoute>} />
      <Route path="/concession-management" element={<AdminOnlyRoute><ConcessionManagement /></AdminOnlyRoute>} />
      <Route path="/admin/addsnack" element={<AdminOnlyRoute><AddSnacks /></AdminOnlyRoute>} />
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
