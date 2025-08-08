/**
 * AuthContext.jsx
 * --------------------------------------------------
 * Contexte d'authentification pour l'application Minot'Or
 * 
 * Ce fichier définit :
 * - Le contexte d'authentification utilisé dans toute l'application
 * - Le provider qui rend ce contexte disponible à tous les composants
 * - Les fonctions de gestion de l'authentification (login, logout)
 * 
 * Ce contexte est crucial car il permet de gérer l'état de connexion de l'utilisateur
 * et d'adapter l'interface en fonction de son rôle (boulanger, commercial, approvisionnement, preparation, maintenance).
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

/**
 * Création du contexte d'authentification
 * 
 * Ce contexte stockera l'état de connexion et les informations de l'utilisateur.
 */
const AuthContext = createContext();

/**
 * Hook personnalisé pour accéder facilement au contexte d'authentification
 * 
 * Ce hook permet aux composants d'accéder au contexte d'authentification
 * sans avoir à utiliser le Consumer ou useContext(AuthContext) directement.
 * 
 * @returns {Object} Le contexte d'authentification
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Liste des rôles disponibles dans l'application
 */
export const ROLES = {
  BOULANGER: 'boulanger',
  COMMERCIAL: 'commercial',
  APPROVISIONNEMENT: 'approvisionnement',
  PREPARATION: 'preparation',
  MAINTENANCE: 'maintenance',
  ADMIN: 'admin'
};

/**
 * Provider global du contexte d'authentification
 * 
 * Ce composant encapsule l'application et rend le contexte d'authentification
 * disponible à tous les composants enfants.
 * 
 * @param {Object} props Les propriétés du composant
 * @param {React.ReactNode} props.children Les composants enfants
 * @returns {JSX.Element} Le provider du contexte d'authentification
 */
export const AuthProvider = ({ children }) => {
  /**
   * État de l'utilisateur
   * 
   * Cet état stocke les informations de l'utilisateur connecté.
   * Une valeur null indique que l'utilisateur n'est pas connecté.
   */
  const [user, setUser] = useState(null);
  
  /**
   * État d'authentification
   * 
   * Cet état indique si l'utilisateur est authentifié ou non.
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * État de chargement
   */
  const [loading, setLoading] = useState(true);

  /**
   * Vérification de l'authentification au démarrage
   */
  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();
        
        if (currentUser && isAuth) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // Nettoyage si les données sont incohérentes
          authService.logout();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Fonction de connexion
   * 
   * Cette fonction met à jour l'état de l'utilisateur et l'état d'authentification
   * lorsqu'un utilisateur se connecte avec succès.
   * 
   * @param {Object} credentials Les identifiants de connexion
   * @returns {Promise} Promesse avec les données de l'utilisateur
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role || ROLES.BOULANGER,
        username: response.user.username
      });
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction de déconnexion
   * 
   * Cette fonction réinitialise l'état de l'utilisateur et l'état d'authentification
   * lorsqu'un utilisateur se déconnecte.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Fonction de rafraîchissement du token
   */
  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      await logout();
      throw error;
    }
  };

  /**
   * Vérifie si l'utilisateur possède un rôle spécifique
   * 
   * @param {string} role Le rôle à vérifier
   * @returns {boolean} Vrai si l'utilisateur a le rôle spécifié, faux sinon
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Vérifie si l'utilisateur a au moins un des rôles spécifiés
   * 
   * @param {Array} roles Les rôles à vérifier
   * @returns {boolean} Vrai si l'utilisateur a au moins un des rôles, faux sinon
   */
  const hasAnyRole = (roles) => {
    return roles.some(role => user?.role === role);
  };

  /**
   * Vérifie si l'utilisateur est un boulanger
   * 
   * @returns {boolean} Vrai si l'utilisateur est un boulanger, faux sinon
   */
  const isBoulanger = () => hasRole(ROLES.BOULANGER);

  /**
   * Vérifie si l'utilisateur est un commercial
   * 
   * @returns {boolean} Vrai si l'utilisateur est un commercial, faux sinon
   */
  const isCommercial = () => hasRole(ROLES.COMMERCIAL);

  /**
   * Vérifie si l'utilisateur est du service approvisionnement
   * 
   * @returns {boolean} Vrai si l'utilisateur est du service approvisionnement, faux sinon
   */
  const isApprovisionnement = () => hasRole(ROLES.APPROVISIONNEMENT);

  /**
   * Vérifie si l'utilisateur est du service préparation
   * 
   * @returns {boolean} Vrai si l'utilisateur est du service préparation, faux sinon
   */
  const isPreparation = () => hasRole(ROLES.PREPARATION);

  /**
   * Vérifie si l'utilisateur est du service maintenance
   * 
   * @returns {boolean} Vrai si l'utilisateur est du service maintenance, faux sinon
   */
  const isMaintenance = () => hasRole(ROLES.MAINTENANCE);

  /**
   * Vérifie si l'utilisateur est un administrateur
   * 
   * @returns {boolean} Vrai si l'utilisateur est un administrateur, faux sinon
   */
  const isAdmin = () => hasRole(ROLES.ADMIN);

  /**
   * Obtient le nom complet de l'utilisateur
   * 
   * @returns {string} Le nom complet de l'utilisateur
   */
  const getFullName = () => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  };

  /**
   * Valeur du contexte
   * 
   * Cette valeur contient l'état de l'utilisateur, l'état d'authentification
   * et les fonctions de gestion de l'authentification.
   */
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      login, 
      logout,
      refreshToken,
      hasRole,
      hasAnyRole,
      isBoulanger,
      isCommercial,
      isApprovisionnement,
      isPreparation,
      isMaintenance,
      isAdmin,
      getFullName
    }}>
      {children}
    </AuthContext.Provider>
  );
};
