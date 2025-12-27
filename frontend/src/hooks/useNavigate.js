import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useNavigate() {
  const { token } = useContext(AuthContext);

  return (path) => {
    window.location.href = path;
  };
}
