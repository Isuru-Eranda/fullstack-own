// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

export function useNavigate() {
  // const { token } = useContext(AuthContext); // Not needed with cookie-based auth

  return (path) => {
    window.location.href = path;
  };
}
