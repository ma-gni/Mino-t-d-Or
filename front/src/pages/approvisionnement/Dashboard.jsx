/**
 * Dashboard.jsx (Approvisionnement)
 * --------------------------------------------------
 * Tableau de bord pour le service approvisionnement
 * 
 * Cette page présente une vue d'ensemble des activités d'approvisionnement:
 * - État des stocks dans les différents entrepôts
 * - Alertes de stock faible
 * - Bons de transport récents
 * - Commandes en attente de réception
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ApprovisionnementDashboard() {
  const { user } = useAuth();

  // Données fictives pour les statistiques
  const stats = [
    { title: 'Entrepôts', value: '3', icon: '🏭', color: 'bg-blue-500' },
    { title: 'Produits en stock', value: '152', icon: '📦', color: 'bg-green-500' },
    { title: 'Alertes stock', value: '8', icon: '⚠️', color: 'bg-red-500' },
    { title: 'Bons de transport', value: '12', icon: '🚚', color: 'bg-yellow-500' }
  ];

  // Données fictives pour les alertes de stock
  const stockAlerts = [
    { id: 1, product: 'Farine T65 Tradition', warehouse: 'Entrepôt Paris', currentStock: 150, minStock: 200 },
    { id: 2, product: 'Farine T45 Pâtissière', warehouse: 'Entrepôt Lyon', currentStock: 40, minStock: 100 },
    { id: 3, product: 'Farine Bio T80', warehouse: 'Entrepôt Paris', currentStock: 25, minStock: 50 },
    { id: 4, product: 'Levain Déshydraté', warehouse: 'Entrepôt Marseille', currentStock: 15, minStock: 30 }
  ];

  // Données fictives pour les bons de transport récents
  const recentTransports = [
    { id: 'BT-2025-045', date: '21/04/2025', from: 'Grands Moulins de Paris', to: 'Entrepôt Paris', status: 'En cours' },
    { id: 'BT-2025-044', date: '20/04/2025', from: 'Entrepôt Lyon', to: 'Boulangerie Durand', status: 'Livré' },
    { id: 'BT-2025-043', date: '19/04/2025', from: 'Minoterie Dupuis', to: 'Entrepôt Marseille', status: 'En cours' }
  ];

  // Données fictives pour les commandes à réceptionner
  const pendingOrders = [
    { id: 'CMD-2025-058', supplier: 'Grands Moulins de Paris', date: '18/04/2025', status: 'En transit', items: 5 },
    { id: 'CMD-2025-057', supplier: 'Moulins Bio', date: '17/04/2025', status: 'En attente', items: 3 },
    { id: 'CMD-2025-056', supplier: 'Minoterie Artisanale', date: '15/04/2025', status: 'En retard', items: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête du tableau de bord */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.firstName}</h1>
          <p className="text-gray-600">Tableau de bord approvisionnement</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/approvisionnement/bons-transport/nouveau" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Nouveau bon de transport
          </Link>
          <Link 
            to="/approvisionnement/stocks" 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Voir les stocks
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

      {/* Alertes de stock */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Alertes de stock</h2>
          <Link to="/approvisionnement/stocks" className="text-sm text-indigo-600 hover:text-indigo-800">
            Voir tous les stocks →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrepôt</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock actuel</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Seuil minimum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.warehouse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      {alert.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{alert.minStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/approvisionnement/bons-transport/nouveau?product=${alert.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Créer bon de transport
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bons de transport récents */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Bons de transport récents</h2>
            <Link to="/approvisionnement/bons-transport" className="text-sm text-indigo-600 hover:text-indigo-800">
              Voir tous →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransports.map((transport) => (
                <div key={transport.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium text-indigo-600">{transport.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transport.status === 'Livré' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transport.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><span className="font-medium">Date:</span> {transport.date}</p>
                    <p><span className="font-medium">De:</span> {transport.from}</p>
                    <p><span className="font-medium">Vers:</span> {transport.to}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commandes à réceptionner */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Commandes à réceptionner</h2>
            <Link to="/approvisionnement/reception-commandes" className="text-sm text-indigo-600 hover:text-indigo-800">
              Voir toutes →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium text-indigo-600">{order.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'En retard' ? 'bg-red-100 text-red-800' :
                      order.status === 'En transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><span className="font-medium">Fournisseur:</span> {order.supplier}</p>
                    <p><span className="font-medium">Date:</span> {order.date}</p>
                    <p><span className="font-medium">Articles:</span> {order.items}</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Link to={`/approvisionnement/reception-commandes/${order.id}`} className="text-sm text-indigo-600 hover:text-indigo-900">
                      Réceptionner →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/approvisionnement/stocks"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">📊</span>
            <span className="text-sm font-medium">Gérer les stocks</span>
          </Link>
          <Link 
            to="/approvisionnement/bons-transport/nouveau"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">🚚</span>
            <span className="text-sm font-medium">Nouveau bon de transport</span>
          </Link>
          <Link 
            to="/approvisionnement/reception-commandes"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">📥</span>
            <span className="text-sm font-medium">Réceptionner commandes</span>
          </Link>
          <Link 
            to="/approvisionnement/entrepots"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">🏭</span>
            <span className="text-sm font-medium">Gérer les entrepôts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
