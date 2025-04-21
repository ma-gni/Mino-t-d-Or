import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si aucun rôle n'est spécifié, permet l'accès à tous les utilisateurs authentifiés
  if (roles.length === 0) {
    return children;
  }

  // Vérifie si l'utilisateur a le rôle requis
  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
