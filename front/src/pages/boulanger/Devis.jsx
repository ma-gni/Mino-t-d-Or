/**
 * Devis.jsx (Boulanger)
 * --------------------------------------------------
 * Page de gestion des devis pour les boulangers
 * 
 * Cette page permet aux boulangers de :
 * - Visualiser tous leurs devis (envoyés, reçus, acceptés, refusés)
 * - Filtrer les devis par statut ou date
 * - Transformer un devis accepté en commande
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Devis() {
  // État pour les filtres
  const [filters, setFilters] = useState({
    status: '',
    dateDebut: '',
    dateFin: '',
    searchTerm: ''
  });

  // Fonction de gestion des changements de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      status: '',
      dateDebut: '',
      dateFin: '',
      searchTerm: ''
    });
  };

  // Fonction pour transformer un devis en commande
  const transformToOrder = (quoteId) => {
    // Dans une vraie application, on ferait un appel API
    alert(`Le devis ${quoteId} a été transformé en commande`);
  };

  // Données fictives pour les devis
  const quotes = [
    {
      id: 'DV-2025-012',
      date: '2025-04-20',
      dueDate: '2025-04-27',
      status: 'En attente',
      totalHT: 1850.00,
      totalTTC: 1951.75,
      miller: 'Minoterie Dupuis',
      products: [
        { name: 'Farine T65 Tradition', quantity: 20, price: 42.50 },
        { name: 'Farine T45 Pâtissière', quantity: 10, price: 22.80 },
        { name: 'Améliorant Baguette', quantity: 5, price: 18.90 }
      ]
    },
    {
      id: 'DV-2025-011',
      date: '2025-04-19',
      dueDate: '2025-04-26',
      status: 'Accepté',
      totalHT: 2325.75,
      totalTTC: 2453.66,
      miller: 'Grands Moulins de Paris',
      products: [
        { name: 'Farine T65 Tradition', quantity: 25, price: 43.20 },
        { name: 'Farine Bio T80', quantity: 15, price: 56.75 }
      ]
    },
    {
      id: 'DV-2025-010',
      date: '2025-04-15',
      dueDate: '2025-04-22',
      status: 'Refusé',
      totalHT: 1560.30,
      totalTTC: 1646.12,
      miller: 'Minoterie Artisanale',
      products: [
        { name: 'Farine de Seigle T130', quantity: 15, price: 48.90 },
        { name: 'Farine T110 Complète', quantity: 10, price: 46.80 }
      ]
    },
    {
      id: 'DV-2025-009',
      date: '2025-04-10',
      dueDate: '2025-04-17',
      status: 'Confirmé',
      totalHT: 3450.80,
      totalTTC: 3640.59,
      miller: 'Moulins Bio',
      products: [
        { name: 'Farine Bio T80', quantity: 50, price: 56.75 },
        { name: 'Farine T45 Pâtissière', quantity: 25, price: 22.80 }
      ]
    },
    {
      id: 'DV-2025-008',
      date: '2025-04-05',
      dueDate: '2025-04-12',
      status: 'Livré',
      totalHT: 2780.50,
      totalTTC: 2933.43,
      miller: 'Minoterie Dupuis',
      products: [
        { name: 'Farine T65 Tradition', quantity: 40, price: 42.50 },
        { name: 'Levain Déshydraté', quantity: 20, price: 12.40 },
        { name: 'Améliorant Baguette', quantity: 15, price: 18.90 }
      ]
    }
  ];

  // Filtrage des devis
  const filteredQuotes = quotes.filter(quote => {
    const quoteDate = new Date(quote.date);
    const dateDebut = filters.dateDebut ? new Date(filters.dateDebut) : null;
    const dateFin = filters.dateFin ? new Date(filters.dateFin) : null;
    
    return (
      (filters.status === '' || quote.status === filters.status) &&
      (dateDebut === null || quoteDate >= dateDebut) &&
      (dateFin === null || quoteDate <= dateFin) &&
      (filters.searchTerm === '' || 
        quote.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        quote.miller.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    );
  });

  // Options pour le statut des devis
  const statusOptions = ['En attente', 'Accepté', 'Refusé', 'Confirmé', 'Livré'];

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      case 'Confirmé':
        return 'bg-blue-100 text-blue-800';
      case 'Livré':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Devis</h1>
          <p className="text-gray-600">Consultez et gérez tous vos devis</p>
        </div>
        <div>
          <Link 
            to="/boulanger/devis/nouveau" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Nouveau devis
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Rechercher par ID ou minotier..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Tous les statuts</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
            <input
              type="date"
              name="dateDebut"
              value={filters.dateDebut}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
            <input
              type="date"
              name="dateFin"
              value={filters.dateFin}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Liste des devis */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Liste des devis ({filteredQuotes.length})</h2>
        </div>
        
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun devis ne correspond à vos critères de recherche</p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minotier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total TTC</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map(quote => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      <Link to={`/boulanger/devis/${quote.id}`}>{quote.id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(quote.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {quote.miller}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {quote.totalHT.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {quote.totalTTC.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/boulanger/devis/${quote.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Voir
                        </Link>
                        {quote.status === 'Accepté' && (
                          <button
                            onClick={() => transformToOrder(quote.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Commander
                          </button>
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

      {/* Détails du processus de devis */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Processus de devis</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          <div className="p-4 border rounded-lg">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl mx-auto mb-2">
              1
            </div>
            <h3 className="font-medium text-gray-900">Création</h3>
            <p className="text-sm text-gray-600 mt-1">Vous créez un nouveau devis</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl mx-auto mb-2">
              2
            </div>
            <h3 className="font-medium text-gray-900">En attente</h3>
            <p className="text-sm text-gray-600 mt-1">Le minotier étudie votre demande</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl mx-auto mb-2">
              3
            </div>
            <h3 className="font-medium text-gray-900">Acceptation</h3>
            <p className="text-sm text-gray-600 mt-1">Le minotier accepte votre devis</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl mx-auto mb-2">
              4
            </div>
            <h3 className="font-medium text-gray-900">Commande</h3>
            <p className="text-sm text-gray-600 mt-1">Vous transformez le devis en commande</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl mx-auto mb-2">
              5
            </div>
            <h3 className="font-medium text-gray-900">Livraison</h3>
            <p className="text-sm text-gray-600 mt-1">Votre commande est livrée</p>
          </div>
        </div>
      </div>
    </div>
  );
}
