/**
 * Dashboard.jsx (Préparation)
 * --------------------------------------------------
 * Tableau de bord pour le service préparation des commandes
 * 
 * Cette page présente une vue d'ensemble des commandes à préparer:
 * - Commandes en attente
 * - Commandes en cours de préparation
 * - Commandes prêtes pour expédition
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PreparationDashboard() {
  const { user } = useAuth();
  
  // État pour les statistiques
  const [stats] = useState([
    { title: 'En attente', value: '12', icon: '⏱️', color: 'bg-yellow-500' },
    { title: 'En préparation', value: '5', icon: '🔄', color: 'bg-blue-500' },
    { title: 'Prêtes pour expédition', value: '8', icon: '✅', color: 'bg-green-500' },
    { title: 'Livraisons aujourd\'hui', value: '6', icon: '🚚', color: 'bg-purple-500' }
  ]);
  
  // État pour les commandes à préparer (données fictives)
  const [commandesAPreparerAujourdhui] = useState([
    { 
      id: 'CMD-2025-101', 
      client: 'Boulangerie Durand', 
      dateLivraison: '2025-04-22', 
      heureLivraison: '09:00 - 11:00',
      nbProduits: 6,
      totalPalettes: 2,
      status: 'En attente'
    },
    { 
      id: 'CMD-2025-102', 
      client: 'Aux Délices du Pain', 
      dateLivraison: '2025-04-22', 
      heureLivraison: '10:30 - 12:30',
      nbProduits: 4,
      totalPalettes: 1,
      status: 'En préparation'
    },
    { 
      id: 'CMD-2025-103', 
      client: 'La Mie Dorée', 
      dateLivraison: '2025-04-22', 
      heureLivraison: '14:00 - 16:00',
      nbProduits: 8,
      totalPalettes: 3,
      status: 'Prête pour expédition'
    }
  ]);
  
  // État pour les commandes à venir
  const [commandesAVenir] = useState([
    { 
      id: 'CMD-2025-104', 
      client: 'Le Fournil de Pierre', 
      dateLivraison: '2025-04-23', 
      heureLivraison: '08:30 - 10:30',
      nbProduits: 5,
      totalPalettes: 2,
      status: 'En attente'
    },
    { 
      id: 'CMD-2025-105', 
      client: 'Boulangerie Martin', 
      dateLivraison: '2025-04-23', 
      heureLivraison: '11:00 - 13:00',
      nbProduits: 7,
      totalPalettes: 2,
      status: 'En attente'
    },
    { 
      id: 'CMD-2025-106', 
      client: 'Boulangerie Artisanale', 
      dateLivraison: '2025-04-24', 
      heureLivraison: '09:00 - 11:00',
      nbProduits: 3,
      totalPalettes: 1,
      status: 'En attente'
    },
    { 
      id: 'CMD-2025-107', 
      client: 'La Baguette Magique', 
      dateLivraison: '2025-04-24', 
      heureLivraison: '10:00 - 12:00',
      nbProduits: 9,
      totalPalettes: 3,
      status: 'En attente'
    }
  ]);
  
  // Fonction pour récupérer la couleur du badge de statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En préparation':
        return 'bg-blue-100 text-blue-800';
      case 'Prête pour expédition':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête du tableau de bord */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.firstName}</h1>
          <p className="text-gray-600">Tableau de bord préparation des commandes</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/preparation/commandes" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Voir toutes les commandes
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

      {/* Commandes à préparer aujourd'hui */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Commandes à préparer aujourd'hui</h2>
          <span className="text-sm text-gray-500">{formatDate(new Date())}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure de livraison
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produits
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Palettes
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commandesAPreparerAujourdhui.map((commande) => (
                <tr key={commande.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {commande.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commande.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {commande.heureLivraison}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {commande.nbProduits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {commande.totalPalettes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(commande.status)}`}>
                      {commande.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/preparation/commandes/${commande.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commandes à venir */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Commandes à venir</h2>
          <Link to="/preparation/commandes" className="text-sm text-indigo-600 hover:text-indigo-800">
            Voir tout →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de livraison
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure de livraison
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produits
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commandesAVenir.map((commande) => (
                <tr key={commande.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {commande.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commande.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {formatDate(commande.dateLivraison)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {commande.heureLivraison}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {commande.nbProduits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(commande.status)}`}>
                      {commande.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/preparation/commandes/${commande.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            to="/preparation/commandes?status=en-attente"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">⏱️</span>
            <span className="text-sm font-medium">Commandes en attente</span>
          </Link>
          <Link 
            to="/preparation/commandes?status=en-preparation"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">🔄</span>
            <span className="text-sm font-medium">Commandes en préparation</span>
          </Link>
          <Link 
            to="/preparation/imprimer"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">🖨️</span>
            <span className="text-sm font-medium">Imprimer QR Codes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
