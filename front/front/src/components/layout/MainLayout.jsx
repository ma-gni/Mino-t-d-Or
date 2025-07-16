/**
 * MainLayout.jsx
 * --------------------------------------------------
 * Layout principal pour l'application Minot'Or
 * 
 * Ce composant définit la structure commune à toutes les pages de l'application
 * une fois l'utilisateur connecté.
 * 
 * Il inclut :
 * - Une barre de navigation adaptée au rôle de l'utilisateur
 * - Un menu latéral avec les fonctionnalités disponibles selon le rôle
 * - Un footer avec les informations légales et de contact
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Composants à importer ou à créer
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

/**
 * Layout principal de l'application
 * 
 * @param {Object} props Les propriétés du composant
 * @param {React.ReactNode} props.children Le contenu à afficher dans le layout
 * @returns {JSX.Element} Le layout principal
 */
const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Barre de navigation */}
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Contenu principal */}
      <div className="flex flex-1">
        {/* Menu latéral */}
        <Sidebar userRole={user?.role} />
        
        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Pied de page */}
      <Footer />
    </div>
  );
};

export default MainLayout;
