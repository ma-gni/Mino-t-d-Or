/**
 * Dashboard.jsx (Boulanger)
 * --------------------------------------------------
 * Tableau de bord pour les boulangers
 * 
 * Ce tableau de bord présente une vue d'ensemble des activités du boulanger:
 * - Résumé des commandes récentes
 * - Statut des devis en cours
 * - Raccourcis vers les fonctionnalités principales
 * - Notifications importantes
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Composants fictifs à créer plus tard
import StatCard from '../../components/StatCard';
import RecentOrdersTable from '../../components/RecentOrdersTable';
import QuoteStatusCard from '../../components/QuoteStatusCard';

export default function BoulangerDashboard() {
  const { user } = useAuth();

  // Ces données seraient normalement chargées depuis une API
  const stats = [
    { title: 'Commandes en cours', value: '3', icon: '📦', color: 'bg-blue-500' },
    { title: 'Devis en attente', value: '2', icon: '📝', color: 'bg-yellow-500' },
    { title: 'Commandes ce mois', value: '12', icon: '📊', color: 'bg-green-500' },
    { title: 'Invendus signalés', value: '5kg', icon: '♻️', color: 'bg-red-500' }
  ];

  const recentOrders = [
    { id: 'CMD-2025-042', date: '18/04/2025', status: 'En livraison', total: '1 245,00 €' },
    { id: 'CMD-2025-041', date: '15/04/2025', status: 'Livrée', total: '825,50 €' },
    { id: 'CMD-2025-038', date: '10/04/2025', status: 'Livrée', total: '1 547,20 €' }
  ];

  const pendingQuotes = [
    { id: 'DV-2025-012', date: '20/04/2025', status: 'En attente', total: '1 850,00 €' },
    { id: 'DV-2025-011', date: '19/04/2025', status: 'Accepté', total: '2 325,75 €' }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête du tableau de bord */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.firstName}</h1>
          <p className="text-gray-600">Voici un aperçu de votre activité</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/boulanger/devis/nouveau" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Nouveau devis
          </Link>
          <Link 
            to="/boulanger/catalogue" 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Catalogue produits
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow p-5 flex items-center space-x-4"
          >
            <div className={`${stat.color} h-12 w-12 rounded-full flex items-center justify-center text-2xl text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commandes récentes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Commandes récentes</h2>
          </div>
          <div className="p-5">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-indigo-600">{order.id}</td>
                    <td className="py-3 text-sm text-gray-700">{order.date}</td>
                    <td className="py-3 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Livrée' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-700 text-right">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right">
              <Link to="/boulanger/commandes" className="text-sm text-indigo-600 hover:text-indigo-500">
                Voir toutes les commandes →
              </Link>
            </div>
          </div>
        </div>

        {/* Devis en cours */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Devis en cours</h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {pendingQuotes.map((quote, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium text-indigo-600">{quote.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      quote.status === 'Accepté' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>Date: {quote.date}</span>
                    <span className="font-medium">{quote.total}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link to="/boulanger/devis" className="text-sm text-indigo-600 hover:text-indigo-500">
                Voir tous les devis →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/boulanger/invendus/signaler"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">♻️</span>
            <span className="text-sm font-medium">Signaler des invendus</span>
          </Link>
          <Link 
            to="/boulanger/catalogue"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">📋</span>
            <span className="text-sm font-medium">Consulter le catalogue</span>
          </Link>
          <Link 
            to="/boulanger/devis/nouveau"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">📝</span>
            <span className="text-sm font-medium">Créer un devis</span>
          </Link>
          <Link 
            to="/boulanger/historique"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">📊</span>
            <span className="text-sm font-medium">Historique des commandes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
