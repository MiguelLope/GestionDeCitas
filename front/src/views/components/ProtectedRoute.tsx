import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth(); // Usar el hooks de contexto

  // Verifica si el usuario está autenticado y tiene el rol permitido
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  } else if (!allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
