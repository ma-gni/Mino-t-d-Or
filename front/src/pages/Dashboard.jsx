/**
 * Dashboard.jsx
 * --------------------------------------------------
 * Page de tableau de bord de l'application Minot'Or
 * 
 * Cette page présente :
 * - Le tableau de bord personnalisé de l'utilisateur connecté
 * - Des modules adaptés au rôle de l'utilisateur (boulanger ou minotier)
 * - Des liens vers les différentes fonctionnalités de l'application
 * 
 * Le contenu est dynamiquement adapté en fonction du rôle de l'utilisateur.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';

/**
 * Composant Dashboard
 * 
 * Ce composant représente le tableau de bord principal de l'application.
 * Il utilise le contexte d'authentification pour accéder aux informations de l'utilisateur
 * et adapter l'interface en fonction de son rôle.
 */
const Dashboard = () => {
  const { user } = useAuth();

  /**
   * Définition des modules en fonction du rôle
   * 
   * Cette fonction retourne un tableau de modules (cartes de navigation)
   * adaptés au rôle de l'utilisateur connecté.
   * 
   * @returns {Array} Tableau d'objets représentant les modules disponibles
   */
  const getModules = () => {
    const modules = [];

    // Modules communs à tous les utilisateurs
    modules.push({
      name: 'Tableau de bord',
      description: 'Vue d\'ensemble de votre activité',
      icon: '📊',
      path: '/dashboard',
      color: 'bg-blue-500'
    });

    // Modules spécifiques aux boulangers
    if (user.role === ROLES.BOULANGER) {
      modules.push(
        {
          name: 'Catalogue',
          description: 'Consultez les produits disponibles',
          icon: '🍞',
          path: '/boulanger/produits',
          color: 'bg-yellow-500'
        },
        {
          name: 'Devis',
          description: 'Gérez vos demandes de devis',
          icon: '📝',
          path: '/boulanger/devis',
          color: 'bg-green-500'
        },
        {
          name: 'Commandes',
          description: 'Suivez vos commandes en cours',
          icon: '🛒',
          path: '/boulanger/commandes',
          color: 'bg-indigo-500'
        }
      );
    }

    // Modules spécifiques aux commerciaux
    if (user.role === ROLES.COMMERCIAL) {
      modules.push(
        {
          name: 'Produits',
          description: 'Gérez le catalogue produits',
          icon: '📦',
          path: '/commercial/produits',
          color: 'bg-purple-500'
        },
        {
          name: 'Devis',
          description: 'Traitez les demandes de devis',
          icon: '📋',
          path: '/commercial/devis',
          color: 'bg-indigo-500'
        },
        {
          name: 'Clients',
          description: 'Gérez vos clients boulangers',
          icon: '👥',
          path: '/commercial/clients',
          color: 'bg-green-500'
        }
      );
    }

    // Modules spécifiques aux approvisionneurs
    if (user.role === ROLES.APPROVISIONNEMENT) {
      modules.push(
        {
          name: 'Stocks',
          description: 'Gérez les stocks et approvisionnements',
          icon: '🏭',
          path: '/approvisionnement/stocks',
          color: 'bg-orange-500'
        },
        {
          name: 'Transport',
          description: 'Planifiez les livraisons',
          icon: '🚚',
          path: '/approvisionnement/livraisons',
          color: 'bg-yellow-500'
        },
        {
          name: 'Réception',
          description: 'Réceptionnez les commandes',
          icon: '📦',
          path: '/approvisionnement/reception-commande',
          color: 'bg-green-500'
        }
      );
    }

    // Modules spécifiques à la préparation
    if (user.role === ROLES.PREPARATION) {
      modules.push(
        {
          name: 'Commandes',
          description: 'Commandes à préparer',
          icon: '📋',
          path: '/preparation/commandes',
          color: 'bg-indigo-500'
        },
        {
          name: 'Bons de livraison',
          description: 'Générez les bons de livraison',
          icon: '📄',
          path: '/preparation/bons-livraison',
          color: 'bg-green-500'
        },
        {
          name: 'QR Codes',
          description: 'Générez des QR codes pour les palettes',
          icon: '📱',
          path: '/preparation/qr-code',
          color: 'bg-purple-500'
        }
      );
    }

    // Modules spécifiques à la maintenance
    if (user.role === ROLES.MAINTENANCE) {
      modules.push(
        {
          name: 'Cuves',
          description: 'Suivi du nettoyage des cuves',
          icon: '🧹',
          path: '/maintenance/cuves',
          color: 'bg-yellow-500'
        },
        {
          name: 'Véhicules',
          description: 'Maintenance des camions',
          icon: '🚛',
          path: '/maintenance/camions',
          color: 'bg-red-500'
        },
        {
          name: 'Indicateurs',
          description: 'Indicateurs de maintenance',
          icon: '📈',
          path: '/maintenance/indicateurs',
          color: 'bg-blue-500'
        }
      );
    }

    return modules;
  };

  /**
   * Affichage du tableau de bord
   * 
   * Cette fonction retourne l'interface utilisateur du tableau de bord,
   * incluant les modules adaptés au rôle de l'utilisateur.
   * 
   * @returns {JSX.Element} Interface utilisateur du tableau de bord
   */
  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête du tableau de bord */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.firstName} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Bienvenue sur votre tableau de bord {
            user?.role === ROLES.BOULANGER ? 'boulanger' :
            user?.role === ROLES.COMMERCIAL ? 'commercial' :
            user?.role === ROLES.APPROVISIONNEMENT ? 'approvisionneur' :
            user?.role === ROLES.PREPARATION ? 'préparation' :
            user?.role === ROLES.MAINTENANCE ? 'maintenance' :
            ''
          }
        </p>
      </div>

      {/* Grille des modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getModules().map((module, index) => (
          <Link
            key={index}
            to={module.path}
            className="block group"
          >
            <div className={`${module.color} rounded-lg p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
              <div className="text-4xl mb-4">{module.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
              <p className="text-white text-opacity-90">{module.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Statistiques rapides */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">
            {user?.role === ROLES.BOULANGER ? 'Commandes en cours' :
             user?.role === ROLES.COMMERCIAL ? 'Devis à traiter' :
             user?.role === ROLES.APPROVISIONNEMENT ? 'Livraisons du jour' :
             user?.role === ROLES.PREPARATION ? 'Commandes à préparer' :
             user?.role === ROLES.MAINTENANCE ? 'Interventions à planifier' :
             ''}
          </div>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">
            {user?.role === ROLES.BOULANGER ? 'Devis en attente' :
             user?.role === ROLES.COMMERCIAL ? 'Nouveaux clients' :
             user?.role === ROLES.APPROVISIONNEMENT ? 'Stocks à surveiller' :
             user?.role === ROLES.PREPARATION ? 'Bons de livraison à générer' :
             user?.role === ROLES.MAINTENANCE ? 'Équipements à entretenir' :
             ''}
          </div>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">
            {user?.role === ROLES.BOULANGER ? 'Total commandes' :
             user?.role === ROLES.COMMERCIAL ? 'Chiffre d\'affaires' :
             user?.role === ROLES.APPROVISIONNEMENT ? 'Taux de livraison' :
             user?.role === ROLES.PREPARATION ? 'Commandes préparées' :
             user?.role === ROLES.MAINTENANCE ? 'Interventions effectuées' :
             ''}
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {user?.role === ROLES.COMMERCIAL ? '0 €' : '0'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
