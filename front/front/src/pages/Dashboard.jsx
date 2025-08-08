/**
 * Dashboard.jsx
 * --------------------------------------------------
 * Tableau de bord principal de l'application Minot'Or
 * 
 * Cette page présente :
 * - Un accueil personnalisé selon le rôle de l'utilisateur
 * - Des statistiques clés adaptées au rôle
 * - Des raccourcis vers les fonctionnalités principales
 * - Des notifications importantes
 * - Un aperçu des activités récentes
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { useNotification } from '../components/Notification';
import DashboardStats from '../components/DashboardStats';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Composant Dashboard
 * 
 * Ce composant affiche un tableau de bord personnalisé selon le rôle de l'utilisateur.
 * Il utilise le contexte d'authentification pour adapter l'interface.
 */
export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showInfo } = useNotification();

  // Affichage du spinner de chargement si l'authentification est en cours
  if (authLoading) {
    return <LoadingSpinner fullScreen text="Chargement du tableau de bord..." />;
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-6">
            Veuillez vous connecter pour accéder au tableau de bord.
          </p>
          <Link
            to="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  /**
   * Obtient les modules disponibles selon le rôle
   */
  const getModules = () => {
    const baseModules = [
      {
        name: 'Mon Profil',
        description: 'Gérer vos informations personnelles',
        icon: '👤',
        path: '/profile',
        color: 'bg-gray-500'
      }
    ];

    switch (user?.role) {
      case ROLES.BOULANGER:
        return [
          ...baseModules,
          {
            name: 'Mes Commandes',
            description: 'Suivre vos commandes et devis',
            icon: '📦',
            path: '/boulanger/commandes',
            color: 'bg-blue-500'
          },
          {
            name: 'Catalogue',
            description: 'Consulter les produits disponibles',
            icon: '🌾',
            path: '/boulanger/catalogue',
            color: 'bg-green-500'
          },
          {
            name: 'Mes Devis',
            description: 'Gérer vos demandes de devis',
            icon: '📝',
            path: '/boulanger/devis',
            color: 'bg-yellow-500'
          },
          {
            name: 'Invendus',
            description: 'Signaler les produits invendus',
            icon: '♻️',
            path: '/boulanger/invendus',
            color: 'bg-red-500'
          }
        ];

      case ROLES.COMMERCIAL:
        return [
          ...baseModules,
          {
            name: 'Gestion Devis',
            description: 'Traiter les demandes de devis',
            icon: '📋',
            path: '/commercial/devis',
            color: 'bg-blue-500'
          },
          {
            name: 'Gestion Produits',
            description: 'Gérer le catalogue de produits',
            icon: '🌾',
            path: '/commercial/produits',
            color: 'bg-green-500'
          },
          {
            name: 'Gestion Minotiers',
            description: 'Gérer les fournisseurs',
            icon: '🏭',
            path: '/commercial/minotiers',
            color: 'bg-purple-500'
          },
          {
            name: 'Analytics',
            description: 'Consulter les statistiques',
            icon: '📊',
            path: '/commercial/analytics',
            color: 'bg-indigo-500'
          }
        ];

      case ROLES.APPROVISIONNEMENT:
        return [
          ...baseModules,
          {
            name: 'Stocks',
            description: 'Gérer les niveaux de stock',
            icon: '📦',
            path: '/approvisionnement/stocks',
            color: 'bg-blue-500'
          },
          {
            name: 'Livraisons',
            description: 'Planifier les livraisons',
            icon: '🚚',
            path: '/approvisionnement/livraisons',
            color: 'bg-green-500'
          },
          {
            name: 'Réception',
            description: 'Gérer les réceptions',
            icon: '📥',
            path: '/approvisionnement/reception',
            color: 'bg-yellow-500'
          },
          {
            name: 'Bons de Transport',
            description: 'Générer les bons de transport',
            icon: '📄',
            path: '/approvisionnement/bons-transport',
            color: 'bg-purple-500'
          }
        ];

      case ROLES.PREPARATION:
        return [
          ...baseModules,
          {
            name: 'Commandes à Préparer',
            description: 'Voir les commandes en attente',
            icon: '📦',
            path: '/preparation/commandes',
            color: 'bg-blue-500'
          },
          {
            name: 'Bons de Livraison',
            description: 'Générer les bons de livraison',
            icon: '📄',
            path: '/preparation/bons-livraison',
            color: 'bg-green-500'
          },
          {
            name: 'QR Codes',
            description: 'Imprimer les QR codes',
            icon: '📱',
            path: '/preparation/qr-codes',
            color: 'bg-yellow-500'
          },
          {
            name: 'Détail Commande',
            description: 'Voir les détails des commandes',
            icon: '🔍',
            path: '/preparation/detail-commande',
            color: 'bg-purple-500'
          }
        ];

      case ROLES.MAINTENANCE:
        return [
          ...baseModules,
          {
            name: 'Gestion Camions',
            description: 'Maintenir la flotte de camions',
            icon: '🚛',
            path: '/maintenance/camions',
            color: 'bg-blue-500'
          },
          {
            name: 'Gestion Cuves',
            description: 'Entretenir les cuves de stockage',
            icon: '🛢️',
            path: '/maintenance/cuves',
            color: 'bg-green-500'
          },
          {
            name: 'Nettoyage Cuve',
            description: 'Planifier les nettoyages',
            icon: '🧹',
            path: '/maintenance/nettoyage',
            color: 'bg-yellow-500'
          },
          {
            name: 'Interventions',
            description: 'Gérer les interventions',
            icon: '🔧',
            path: '/maintenance/interventions',
            color: 'bg-red-500'
          }
        ];

      default:
        return baseModules;
    }
  };

  /**
   * Obtient le message de bienvenue selon le rôle
   */
  const getWelcomeMessage = () => {
    const timeOfDay = new Date().getHours();
    let greeting = 'Bonjour';
    
    if (timeOfDay < 12) {
      greeting = 'Bonjour';
    } else if (timeOfDay < 18) {
      greeting = 'Bon après-midi';
    } else {
      greeting = 'Bonsoir';
    }

    const roleNames = {
      [ROLES.BOULANGER]: 'Boulanger',
      [ROLES.COMMERCIAL]: 'Commercial',
      [ROLES.APPROVISIONNEMENT]: 'Responsable Approvisionnement',
      [ROLES.PREPARATION]: 'Responsable Préparation',
      [ROLES.MAINTENANCE]: 'Responsable Maintenance'
    };

    return `${greeting} ${user?.firstName || 'Utilisateur'} ! Bienvenue dans votre espace ${roleNames[user?.role] || 'utilisateur'}.`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <p className="mt-2 text-gray-600">
              {getWelcomeMessage()}
            </p>
          </div>

          {/* Statistiques */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Statistiques
            </h2>
            <DashboardStats userRole={user?.role} />
          </div>

          {/* Grille des modules */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Accès rapide
            </h2>
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
          </div>

          {/* Notifications importantes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notifications importantes
            </h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Système opérationnel
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Tous les services sont fonctionnels. Aucune maintenance prévue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
