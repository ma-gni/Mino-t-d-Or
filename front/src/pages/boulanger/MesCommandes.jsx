/**
 * MesCommandes.jsx (Boulanger)
 * --------------------------------------------------
 * Page de gestion des commandes pour les boulangers
 * 
 * Cette page permet aux boulangers de :
 * - Consulter leurs commandes en cours et passées
 * - Filtrer et rechercher parmi leurs commandes
 * - Suivre l'état de livraison de leurs commandes
 * - Télécharger les bons de livraison
 * - Signaler des problèmes sur une commande
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MesCommandes() {
  const location = useLocation();
  
  // État pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // État pour les onglets
  const [activeTab, setActiveTab] = useState('all');
  
  // Données simulées des commandes
  const [orders] = useState([
    {
      id: 'CMD-2025-001',
      date: '16/04/2025',
      estimatedDelivery: '23/04/2025',
      status: 'processing',
      trackingCode: 'TRACK-001-2025',
      totalAmount: 256.75,
      paymentStatus: 'paid',
      items: [
        { name: 'Farine T65', quantity: 100, unit: 'kg', price: 1.2, total: 120 },
        { name: 'Levure fraîche', quantity: 5, unit: 'kg', price: 3.2, total: 16 },
        { name: 'Améliorant baguette', quantity: 2, unit: 'kg', price: 4.8, total: 9.6 }
      ],
      notes: 'Livraison souhaitée pour le 23/04',
      deliveryAddress: '15 rue des Boulangers, 75005 Paris'
    },
    {
      id: 'CMD-2025-002',
      date: '12/04/2025',
      estimatedDelivery: '19/04/2025',
      status: 'shipped',
      trackingCode: 'TRACK-002-2025',
      totalAmount: 348.50,
      paymentStatus: 'paid',
      items: [
        { name: 'Farine T45', quantity: 50, unit: 'kg', price: 1.4, total: 70 },
        { name: 'Farine T80', quantity: 75, unit: 'kg', price: 1.5, total: 112.5 },
        { name: 'Mélange 5 graines', quantity: 10, unit: 'kg', price: 5.2, total: 52 }
      ],
      notes: 'Commande mensuelle habituelle',
      deliveryAddress: '15 rue des Boulangers, 75005 Paris'
    },
    {
      id: 'CMD-2025-003',
      date: '08/04/2025',
      estimatedDelivery: '15/04/2025',
      status: 'delivered',
      trackingCode: 'TRACK-003-2025',
      totalAmount: 286.50,
      paymentStatus: 'paid',
      items: [
        { name: 'Farine de Seigle', quantity: 100, unit: 'kg', price: 1.6, total: 160 },
        { name: 'Graines de lin', quantity: 10, unit: 'kg', price: 3.9, total: 39 },
        { name: 'Levure fraîche', quantity: 8, unit: 'kg', price: 3.2, total: 25.6 }
      ],
      notes: '',
      deliveryAddress: '15 rue des Boulangers, 75005 Paris'
    },
    {
      id: 'CMD-2025-004',
      date: '01/04/2025',
      estimatedDelivery: '08/04/2025',
      status: 'delivered',
      trackingCode: 'TRACK-004-2025',
      totalAmount: 562.80,
      paymentStatus: 'paid',
      items: [
        { name: 'Farine T65', quantity: 200, unit: 'kg', price: 1.2, total: 240 },
        { name: 'Farine T45', quantity: 100, unit: 'kg', price: 1.4, total: 140 },
        { name: 'Levure fraîche', quantity: 15, unit: 'kg', price: 3.2, total: 48 },
        { name: 'Améliorant baguette', quantity: 5, unit: 'kg', price: 4.8, total: 24 },
        { name: 'Mélange 5 graines', quantity: 15, unit: 'kg', price: 5.2, total: 78 }
      ],
      notes: 'Commande spéciale pour événement',
      deliveryAddress: '15 rue des Boulangers, 75005 Paris'
    },
    {
      id: 'CMD-2025-005',
      date: '19/04/2025',
      estimatedDelivery: '26/04/2025',
      status: 'pending',
      trackingCode: 'TRACK-005-2025',
      totalAmount: 420.30,
      paymentStatus: 'pending',
      items: [
        { name: 'Farine T65', quantity: 150, unit: 'kg', price: 1.2, total: 180 },
        { name: 'Levure fraîche', quantity: 10, unit: 'kg', price: 3.2, total: 32 },
        { name: 'Mélange 5 graines', quantity: 20, unit: 'kg', price: 5.2, total: 104 }
      ],
      notes: 'Paiement en attente',
      deliveryAddress: '15 rue des Boulangers, 75005 Paris'
    }
  ]);
  
  // Traduction des statuts en français
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En préparation';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };
  
  // Couleurs selon le statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Traduction des statuts de paiement en français
  const getPaymentStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payée';
      case 'failed': return 'Échec';
      case 'refunded': return 'Remboursée';
      default: return status;
    }
  };
  
  // Couleurs selon le statut de paiement
  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filtrer les commandes
  const filteredOrders = orders
    .filter(order => {
      // Filtre par statut
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      
      // Filtre par onglet actif
      if (activeTab === 'pending' && order.status !== 'pending' && order.status !== 'processing') {
        return false;
      } else if (activeTab === 'shipped' && order.status !== 'shipped') {
        return false;
      } else if (activeTab === 'delivered' && order.status !== 'delivered') {
        return false;
      }
      
      // Filtre par recherche
      if (searchQuery && 
          !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Filtre par date
      if (dateFilter === 'recent' && new Date(order.date.split('/').reverse().join('-')) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Tri par date décroissante (du plus récent au plus ancien)
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB - dateA;
    });
  
  // Gérer le changement de recherche
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Gérer le changement de filtre de statut
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Gérer le changement de filtre de date
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };
  
  // Gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Simuler le téléchargement d'un bon de livraison
  const handleDownloadDeliveryNote = (orderId) => {
    alert(`Téléchargement du bon de livraison pour la commande ${orderId}`);
  };
  
  // Simuler le signalement d'un problème
  const handleReportIssue = (orderId) => {
    alert(`Signalement d'un problème pour la commande ${orderId}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>
      
      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('all')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Toutes les commandes
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'pending'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            En attente / En préparation
          </button>
          <button
            onClick={() => handleTabChange('shipped')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'shipped'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Expédiées
          </button>
          <button
            onClick={() => handleTabChange('delivered')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'delivered'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Livrées
          </button>
        </nav>
      </div>
      
      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Rechercher</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">🔍</span>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rechercher une commande par ID ou produit..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <label htmlFor="status" className="sr-only">Statut</label>
          <select
            id="status"
            name="status"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processing">En préparation</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto">
          <label htmlFor="date" className="sr-only">Date</label>
          <select
            id="date"
            name="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">Toutes les dates</option>
            <option value="recent">30 derniers jours</option>
          </select>
        </div>
      </div>
      
      {/* Liste des commandes */}
      <div className="overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucune commande ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livraison estimée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.estimatedDelivery}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {getPaymentStatusText(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.totalAmount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/boulanger/commandes/${order.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Détails
                        </Link>
                        {order.status === 'shipped' || order.status === 'delivered' ? (
                          <button
                            onClick={() => handleDownloadDeliveryNote(order.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Bon de livraison
                          </button>
                        ) : null}
                        {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                          <button
                            onClick={() => handleReportIssue(order.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Signaler un problème
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
