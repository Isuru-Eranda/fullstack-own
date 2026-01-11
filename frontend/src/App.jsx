import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { AuthProvider } from './context/AuthProvider';
<<<<<<< Updated upstream
=======
import { SocketProvider } from './context/SocketContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingLogo from './components/LoadingLogo';
>>>>>>> Stashed changes
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import MovieShowtimes from './pages/MovieShowtimes';

function AppContent() {
  const { loading } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    // Simple routing based on URL
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/login') setCurrentPage('login');
      else if (path === '/register') setCurrentPage('register');
      else if (path === '/profile') setCurrentPage('profile');
      else if (path === '/movies') setCurrentPage('movies');
      else if (path.startsWith('/movies/') && path.includes('/showtimes')) {
        // Handle /movies/:id/showtimes routes
        setCurrentPage('movie-showtimes');
      }
      else if (path.startsWith('/movies/') && path.split('/').length >= 3) {
        // Handle /movies/:id routes
        setCurrentPage('movie-details');
      }
      else if (path === '/cinemas') setCurrentPage('cinemas');
      else if (path === '/concessions') setCurrentPage('concessions');
      else setCurrentPage('home');
    };

    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  // Override history for navigation
  useEffect(() => {
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      const newPath = args[2];
      if (newPath === '/login') setCurrentPage('login');
      else if (newPath === '/register') setCurrentPage('register');
      else if (newPath === '/profile') setCurrentPage('profile');
      else if (newPath === '/movies') setCurrentPage('movies');
      else if (newPath.startsWith('/movies/') && newPath.includes('/showtimes')) {
        setCurrentPage('movie-showtimes');
      }
      else if (newPath.startsWith('/movies/') && newPath.split('/').length >= 3) {
        setCurrentPage('movie-details');
      }
      else if (newPath === '/cinemas') setCurrentPage('cinemas');
      else if (newPath === '/concessions') setCurrentPage('concessions');
      else setCurrentPage('home');
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-900">
        <div className="text-2xl text-text-primary">Loading...</div>
      </div>
    );
  }

  // Show all pages - home is public, login/register for auth
  return (
    <>
      {currentPage === 'login' && <Login />}
      {currentPage === 'register' && <Register />}
      {currentPage === 'movies' && <Movies />}
      {currentPage === 'movie-details' && <MovieDetails />}
      {currentPage === 'movie-showtimes' && <MovieShowtimes />}
      {currentPage === 'profile' && <Profile />}
      {currentPage === 'cinemas' && <div className="min-h-screen bg-background-900"><div className="text-center py-20 text-text-primary">Cinemas page coming soon...</div></div>}
      {currentPage === 'concessions' && <div className="min-h-screen bg-background-900"><div className="text-center py-20 text-text-primary">Concessions page coming soon...</div></div>}
      {currentPage === 'home' && <Home />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
<<<<<<< Updated upstream
      <AppContent />
=======
      <SocketProvider>
        <BrowserRouter>
          <AppContent />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </BrowserRouter>
      </SocketProvider>
>>>>>>> Stashed changes
    </AuthProvider>
  );
}

export default App;
