/**
 * Sidebar.jsx
 * --------------------------------------------------
 * Barre latérale de navigation pour l'application Minot'Or
 * 
 * Ce composant affiche différentes options de navigation 
 * en fonction du rôle de l'utilisateur connecté
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROLES } from '../context/AuthContext';

/**
 * Composant de barre latérale adaptative selon le rôle
 * 
 * @param {Object} props Les propriétés du composant
 * @param {string} props.userRole Le rôle de l'utilisateur connecté
 * @returns {JSX.Element} La barre latérale adaptée au rôle
 */
const Sidebar = ({ userRole }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Style de base pour tous les liens
  const linkBaseStyle = "flex items-center p-3 text-gray-700 rounded-lg hover:bg-indigo-50 group transition-all";
  
  // Style pour les liens actifs
  const activeLinkStyle = "bg-indigo-100 text-indigo-800 font-medium";

  // Fonction pour générer les liens en fonction du rôle
  const getLinks = () => {
    switch (userRole) {
      case ROLES.BOULANGER:
        return [
          { to: '/boulanger/dashboard', icon: '📊', text: 'Tableau de bord' },
          { to: '/boulanger/catalogue', icon: '📋', text: 'Catalogue produits' },
          { to: '/boulanger/devis', icon: '📝', text: 'Mes devis' },
          { to: '/boulanger/commandes', icon: '🛒', text: 'Mes commandes' },
          { to: '/boulanger/invendus', icon: '♻️', text: 'Déclarer des invendus' },
          { to: '/boulanger/profil', icon: '👤', text: 'Mon profil' },
        ];
        
      case ROLES.COMMERCIAL:
        return [
          { to: '/commercial/dashboard', icon: '📊', text: 'Tableau de bord' },
          { to: '/commercial/meuniers', icon: '🌾', text: 'Gestion des meuniers' },
          { to: '/commercial/produits', icon: '📋', text: 'Catalogue produits' },
          { to: '/commercial/devis', icon: '📝', text: 'Traitement des devis' },
          { to: '/commercial/commandes', icon: '🛒', text: 'Suivi des commandes' },
          { to: '/commercial/factures', icon: '💰', text: 'Facturation' },
        ];
        
      case ROLES.APPROVISIONNEMENT:
        return [
          { to: '/approvisionnement/dashboard', icon: '📊', text: 'Tableau de bord' },
          { to: '/approvisionnement/stocks', icon: '📦', text: 'Gestion des stocks' },
          { to: '/approvisionnement/livraisons', icon: '🚚', text: 'Livraisons' },
          { to: '/approvisionnement/bons-transport', icon: '📜', text: 'Bons de transport' },
          { to: '/approvisionnement/reception-commande', icon: '✅', text: 'Réception commandes' },
        ];
        
      case ROLES.PREPARATION:
        return [
          { to: '/preparation/dashboard', icon: '📊', text: 'Tableau de bord' },
          { to: '/preparation/commandes', icon: '📦', text: 'Commandes à préparer' },
          { to: '/preparation/bons-livraison', icon: '📄', text: 'Bons de livraison' },
          { to: '/preparation/qr-code', icon: '📱', text: 'Génération QR codes' },
        ];
        
      case ROLES.MAINTENANCE:
        return [
          { to: '/maintenance/dashboard', icon: '📊', text: 'Tableau de bord' },
          { to: '/maintenance/cuves', icon: '🛢️', text: 'Suivi des cuves' },
          { to: '/maintenance/camions', icon: '🚛', text: 'Maintenance camions' },
          { to: '/maintenance/indicateurs', icon: '📈', text: 'Indicateurs' },
        ];
        
      default:
        return [
          { to: '/dashboard', icon: '📊', text: 'Tableau de bord' },
          { to: '/profil', icon: '👤', text: 'Mon profil' },
        ];
    }
  };

  // Obtenir les liens en fonction du rôle
  const links = getLinks();

  return (
    <div 
      className={`h-full transition-all duration-300 bg-white border-r border-gray-200 
      ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}
    >
      {/* Entête de la sidebar */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className={`font-semibold text-lg ${isCollapsed ? 'hidden' : 'block'}`}>
          Menu
        </h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
          aria-label={isCollapsed ? "Déplier le menu" : "Replier le menu"}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      {/* Liste des liens de navigation */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                to={link.to}
                className={`${linkBaseStyle} ${isActive(link.to) ? activeLinkStyle : ''}`}
              >
                <span className="text-xl mr-3">{link.icon}</span>
                <span className={isCollapsed ? 'hidden' : 'block'}>
                  {link.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Pied de la sidebar */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
            {userRole ? userRole.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className={isCollapsed ? 'hidden' : 'block'}>
            <p className="text-sm font-semibold">{userRole}</p>
            <p className="text-xs text-gray-500">Connecté</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
