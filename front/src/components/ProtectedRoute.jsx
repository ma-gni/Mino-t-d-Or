import { Navigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';

/**
 * Composant de protection des routes basé sur l'authentification et les rôles
 * 
 * Ce composant vérifie si l'utilisateur est authentifié et possède le rôle requis
 * pour accéder à une route. Si ce n'est pas le cas, l'utilisateur est redirigé.
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu à afficher si l'accès est autorisé
 * @param {Array<string>} [props.roles] - Liste des rôles autorisés à accéder à cette route
 * @returns {JSX.Element} Le contenu protégé ou une redirection
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, hasRole } = useAuth();

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  // Si aucun rôle n'est spécifié, permet l'accès à tous les utilisateurs authentifiés
  if (roles.length === 0) {
    return children;
  }

  // Vérifie si l'utilisateur a un des rôles autorisés
  const hasRequiredRole = roles.some(role => hasRole(role));
  
  if (!hasRequiredRole) {
    // Rediriger vers une page appropriée selon le rôle de l'utilisateur
    switch(user.role) {
      case ROLES.BOULANGER:
        return <Navigate to="/boulanger/dashboard" replace />;
      case ROLES.COMMERCIAL:
        return <Navigate to="/commercial/dashboard" replace />;
      case ROLES.APPROVISIONNEMENT:
        return <Navigate to="/approvisionnement/dashboard" replace />;
      case ROLES.PREPARATION:
        return <Navigate to="/preparation/dashboard" replace />;
      case ROLES.MAINTENANCE:
        return <Navigate to="/maintenance/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Constantes pour faciliter l'utilisation du composant
export const ROUTE_BOULANGER = [ROLES.BOULANGER];
export const ROUTE_COMMERCIAL = [ROLES.COMMERCIAL];
export const ROUTE_APPROVISIONNEMENT = [ROLES.APPROVISIONNEMENT];
export const ROUTE_PREPARATION = [ROLES.PREPARATION];
export const ROUTE_MAINTENANCE = [ROLES.MAINTENANCE];

export default ProtectedRoute;
