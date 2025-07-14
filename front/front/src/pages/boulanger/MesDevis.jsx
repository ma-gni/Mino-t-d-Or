/**
 * MesDevis.jsx (Boulanger)
 * --------------------------------------------------
 * Page de gestion des devis pour les boulangers
 * 
 * Cette page permet aux boulangers de :
 * - Consulter leurs devis en cours et passés
 * - Filtrer et rechercher parmi leurs devis
 * - Créer de nouveaux devis
 * - Accepter ou refuser des devis
 * - Transformer un devis en commande
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MesDevis() {
  // État pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // États pour les onglets
  const [activeTab, setActiveTab] = useState('all');
  
  // Données simulées des devis
  const [quotes] = useState([
    {
      id: 'DEV-2025-001',
      date: '15/04/2025',
      validUntil: '30/04/2025',
      status: 'pending',
      totalAmount: 256.75,
      items: [
        { name: 'Farine T65', quantity: 100, unit: 'kg', price: 1.2, total: 120 },
        { name: 'Levure fraîche', quantity: 5, unit: 'kg', price: 3.2, total: 16 },
        { name: 'Améliorant baguette', quantity: 2, unit: 'kg', price: 4.8, total: 9.6 }
      ],
      notes: 'Livraison souhaitée pour le 20/04'
    },
    {
      id: 'DEV-2025-002',
      date: '10/04/2025',
      validUntil: '25/04/2025',
      status: 'accepted',
      totalAmount: 348.50,
      items: [
        { name: 'Farine T45', quantity: 50, unit: 'kg', price: 1.4, total: 70 },
        { name: 'Farine T80', quantity: 75, unit: 'kg', price: 1.5, total: 112.5 },
        { name: 'Mélange 5 graines', quantity: 10, unit: 'kg', price: 5.2, total: 52 }
      ],
      notes: 'Commande mensuelle habituelle'
    },
    {
      id: 'DEV-2025-003',
      date: '05/04/2025',
      validUntil: '20/04/2025',
      status: 'rejected',
      totalAmount: 125.30,
      items: [
        { name: 'Levure sèche active', quantity: 10, unit: 'kg', price: 9.5, total: 95 },
        { name: 'Graines de lin', quantity: 5, unit: 'kg', price: 3.9, total: 19.5 }
      ],
      notes: 'Prix trop élevé, besoin de négocier'
    },
    {
      id: 'DEV-2025-004',
      date: '01/04/2025',
      validUntil: '16/04/2025',
      status: 'expired',
      totalAmount: 210.00,
      items: [
        { name: 'Farine de Seigle', quantity: 100, unit: 'kg', price: 1.6, total: 160 },
        { name: 'Graines de lin', quantity: 10, unit: 'kg', price: 3.9, total: 39 }
      ],
      notes: 'Devis non confirmé à temps'
    },
    {
      id: 'DEV-2025-005',
      date: '18/04/2025',
      validUntil: '03/05/2025',
      status: 'pending',
      totalAmount: 562.80,
      items: [
        { name: 'Farine T65', quantity: 200, unit: 'kg', price: 1.2, total: 240 },
        { name: 'Farine T45', quantity: 100, unit: 'kg', price: 1.4, total: 140 },
        { name: 'Levure fraîche', quantity: 15, unit: 'kg', price: 3.2, total: 48 },
        { name: 'Améliorant baguette', quantity: 5, unit: 'kg', price: 4.8, total: 24 },
        { name: 'Mélange 5 graines', quantity: 15, unit: 'kg', price: 5.2, total: 78 }
      ],
      notes: 'Commande spéciale pour événement'
    }
  ]);
  
  // Traduction des statuts en français
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Accepté';
      case 'rejected': return 'Refusé';
      case 'expired': return 'Expiré';
      default: return status;
    }
  };
  
  // Couleurs selon le statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filtrer les devis
  const filteredQuotes = quotes
    .filter(quote => {
      // Filtre par statut
      if (statusFilter !== 'all' && quote.status !== statusFilter) {
        return false;
      }
      
      // Filtre par onglet actif
      if (activeTab === 'pending' && quote.status !== 'pending') {
        return false;
      } else if (activeTab === 'accepted' && quote.status !== 'accepted') {
        return false;
      } else if (activeTab === 'others' && (quote.status !== 'rejected' && quote.status !== 'expired')) {
        return false;
      }
      
      // Filtre par recherche
      if (searchQuery && 
          !quote.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !quote.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Filtre par date
      if (dateFilter === 'recent' && new Date(quote.date.split('/').reverse().join('-')) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
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
  
  // Simuler l'acceptation d'un devis
  const handleAcceptQuote = (quoteId) => {
    alert(`Devis ${quoteId} accepté et transformé en commande`);
  };
  
  // Simuler le refus d'un devis
  const handleRejectQuote = (quoteId) => {
    alert(`Devis ${quoteId} refusé`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Mes devis</h1>
        <Link
          to="/boulanger/devis/nouveau"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="mr-2">+</span>
          Créer un nouveau devis
        </Link>
      </div>
      
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
            Tous les devis
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
            En attente
          </button>
          <button
            onClick={() => handleTabChange('accepted')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'accepted'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Acceptés
          </button>
          <button
            onClick={() => handleTabChange('others')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'others'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Refusés / Expirés
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
              placeholder="Rechercher un devis par ID ou produit..."
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
            <option value="accepted">Acceptés</option>
            <option value="rejected">Refusés</option>
            <option value="expired">Expirés</option>
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
            <option value="recent">7 derniers jours</option>
          </select>
        </div>
      </div>
      
      {/* Liste des devis */}
      <div className="overflow-hidden">
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucun devis ne correspond à vos critères.</p>
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
                    Validité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
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
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quote.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.validUntil}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.totalAmount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/boulanger/devis/${quote.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Voir
                        </Link>
                        {quote.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptQuote(quote.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() => handleRejectQuote(quote.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        {quote.status === 'accepted' && (
                          <Link
                            to={`/boulanger/commandes?from=${quote.id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Voir commande
                          </Link>
                        )}
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
