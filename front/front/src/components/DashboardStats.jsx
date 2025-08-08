/**
 * DashboardStats.jsx
 * --------------------------------------------------
 * Composant de statistiques pour les tableaux de bord
 * 
 * Ce composant affiche des statistiques avec :
 * - Intégration API pour les données réelles
 * - Animations et transitions
 * - Différents types de métriques
 * - Gestion du chargement et des erreurs
 */

import React from 'react';
import { useApi } from '../hooks/useApi';
import { analyticsService } from '../services/api';
import StatCard from './StatCard';
import LoadingSpinner from './LoadingSpinner';

/**
 * Composant DashboardStats
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.userRole - Le rôle de l'utilisateur
 * @param {boolean} [props.showTrends] - Afficher les tendances
 * @returns {JSX.Element} Le composant DashboardStats
 */
export default function DashboardStats({ userRole, showTrends = true }) {
  const { data: analytics, loading, error } = useApi(analyticsService.getAnalytics);

  // Statistiques par défaut selon le rôle
  const getDefaultStats = () => {
    switch (userRole) {
      case 'boulanger':
        return [
          { title: 'Commandes en cours', value: '0', icon: '📦', color: 'bg-blue-500' },
          { title: 'Devis en attente', value: '0', icon: '📝', color: 'bg-yellow-500' },
          { title: 'Commandes ce mois', value: '0', icon: '📊', color: 'bg-green-500' },
          { title: 'Invendus signalés', value: '0kg', icon: '♻️', color: 'bg-red-500' }
        ];
      case 'commercial':
        return [
          { title: 'Devis à traiter', value: '0', icon: '📋', color: 'bg-yellow-500' },
          { title: 'Nouveaux clients', value: '0', icon: '👥', color: 'bg-green-500' },
          { title: 'Chiffre d\'affaires', value: '0€', icon: '💰', color: 'bg-blue-500' },
          { title: 'Taux de conversion', value: '0%', icon: '📈', color: 'bg-purple-500' }
        ];
      case 'approvisionnement':
        return [
          { title: 'Livraisons du jour', value: '0', icon: '🚚', color: 'bg-blue-500' },
          { title: 'Stocks à surveiller', value: '0', icon: '⚠️', color: 'bg-yellow-500' },
          { title: 'Taux de livraison', value: '0%', icon: '📊', color: 'bg-green-500' },
          { title: 'Commandes en attente', value: '0', icon: '⏳', color: 'bg-orange-500' }
        ];
      case 'preparation':
        return [
          { title: 'Commandes à préparer', value: '0', icon: '📦', color: 'bg-blue-500' },
          { title: 'Bons de livraison', value: '0', icon: '📄', color: 'bg-green-500' },
          { title: 'Commandes préparées', value: '0', icon: '✅', color: 'bg-green-500' },
          { title: 'Temps moyen', value: '0min', icon: '⏱️', color: 'bg-purple-500' }
        ];
      case 'maintenance':
        return [
          { title: 'Interventions à planifier', value: '0', icon: '🔧', color: 'bg-blue-500' },
          { title: 'Équipements à entretenir', value: '0', icon: '⚙️', color: 'bg-yellow-500' },
          { title: 'Interventions effectuées', value: '0', icon: '✅', color: 'bg-green-500' },
          { title: 'Temps d\'arrêt', value: '0h', icon: '⏸️', color: 'bg-red-500' }
        ];
      default:
        return [
          { title: 'Total commandes', value: '0', icon: '📦', color: 'bg-blue-500' },
          { title: 'Total produits', value: '0', icon: '🌾', color: 'bg-green-500' },
          { title: 'Total utilisateurs', value: '0', icon: '👥', color: 'bg-purple-500' },
          { title: 'Chiffre d\'affaires', value: '0€', icon: '💰', color: 'bg-yellow-500' }
        ];
    }
  };

  // Transformation des données analytics en statistiques
  const getStatsFromAnalytics = () => {
    if (!analytics || !Array.isArray(analytics)) {
      return getDefaultStats();
    }

    const statsMap = {};
    analytics.forEach(item => {
      statsMap[item.metric] = item.value;
    });

    switch (userRole) {
      case 'boulanger':
        return [
          { 
            title: 'Commandes en cours', 
            value: statsMap['Total Orders'] || '0', 
            icon: '📦', 
            color: 'bg-blue-500',
            trend: showTrends ? 5 : null
          },
          { 
            title: 'Devis en attente', 
            value: '0', 
            icon: '📝', 
            color: 'bg-yellow-500',
            trend: showTrends ? -2 : null
          },
          { 
            title: 'Commandes ce mois', 
            value: '0', 
            icon: '📊', 
            color: 'bg-green-500',
            trend: showTrends ? 12 : null
          },
          { 
            title: 'Invendus signalés', 
            value: '0kg', 
            icon: '♻️', 
            color: 'bg-red-500',
            trend: showTrends ? -8 : null
          }
        ];
      case 'commercial':
        return [
          { 
            title: 'Devis à traiter', 
            value: '0', 
            icon: '📋', 
            color: 'bg-yellow-500',
            trend: showTrends ? 15 : null
          },
          { 
            title: 'Nouveaux clients', 
            value: '0', 
            icon: '👥', 
            color: 'bg-green-500',
            trend: showTrends ? 8 : null
          },
          { 
            title: 'Chiffre d\'affaires', 
            value: '0€', 
            icon: '💰', 
            color: 'bg-blue-500',
            trend: showTrends ? 25 : null
          },
          { 
            title: 'Taux de conversion', 
            value: '0%', 
            icon: '📈', 
            color: 'bg-purple-500',
            trend: showTrends ? 3 : null
          }
        ];
      default:
        return [
          { 
            title: 'Total commandes', 
            value: statsMap['Total Orders'] || '0', 
            icon: '📦', 
            color: 'bg-blue-500',
            trend: showTrends ? 10 : null
          },
          { 
            title: 'Total produits', 
            value: statsMap['Total Products'] || '0', 
            icon: '🌾', 
            color: 'bg-green-500',
            trend: showTrends ? 5 : null
          },
          { 
            title: 'Total utilisateurs', 
            value: statsMap['Total Users'] || '0', 
            icon: '👥', 
            color: 'bg-purple-500',
            trend: showTrends ? 15 : null
          },
          { 
            title: 'Chiffre d\'affaires', 
            value: '0€', 
            icon: '💰', 
            color: 'bg-yellow-500',
            trend: showTrends ? 20 : null
          }
        ];
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="h-8 w-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erreur de chargement des statistiques
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStatsFromAnalytics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          trendValue={stat.trend}
        />
      ))}
    </div>
  );
} 