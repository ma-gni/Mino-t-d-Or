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

import React, { createContext, useState, useContext } from 'react';

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
  MAINTENANCE: 'maintenance'
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
  const [user, setUser] = useState(null); // null = pas connecté
  
  /**
   * État d'authentification
   * 
   * Cet état indique si l'utilisateur est authentifié ou non.
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Fonction de connexion
   * 
   * Cette fonction met à jour l'état de l'utilisateur et l'état d'authentification
   * lorsqu'un utilisateur se connecte avec succès.
   * 
   * @param {Object} userData Les données de l'utilisateur connecté
   */
  const login = (userData) => {
    setUser({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || ROLES.BOULANGER, // Par défaut, on met le rôle boulanger
    });
    setIsAuthenticated(true);
  };

  /**
   * Fonction de déconnexion
   * 
   * Cette fonction réinitialise l'état de l'utilisateur et l'état d'authentification
   * lorsqu'un utilisateur se déconnecte.
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
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
   * Valeur du contexte
   * 
   * Cette valeur contient l'état de l'utilisateur, l'état d'authentification
   * et les fonctions de gestion de l'authentification.
   */
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout,
      hasRole,
      isBoulanger,
      isCommercial,
      isApprovisionnement,
      isPreparation,
      isMaintenance
    }}>
      {children}
    </AuthContext.Provider>
  );
};
