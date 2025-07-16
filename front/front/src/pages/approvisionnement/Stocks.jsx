/**
 * Stocks.jsx (Approvisionnement)
 * --------------------------------------------------
 * Page de gestion des stocks
 * 
 * Cette page permet au service approvisionnement de :
 * - Visualiser les stocks disponibles par entrepôt
 * - Filtrer les produits par catégorie, entrepôt, et niveau de stock
 * - Voir les alertes de stock faible
 * - Gérer les ajustements de stock
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Stocks() {
  // État pour les filtres
  const [filters, setFilters] = useState({
    warehouse: 'all',
    category: 'all',
    stockLevel: 'all',
    searchQuery: ''
  });
  
  // État pour les produits en stock (données fictives)
  const [stockProducts, setStockProducts] = useState([
    { 
      id: 1, 
      name: 'Farine T65 Tradition', 
      category: 'Farine', 
      packaging: 'Sac 25kg',
      warehouse: 'Entrepôt Paris', 
      currentStock: 150, 
      minStock: 200,
      restockDate: '2025-04-28',
      lastUpdated: '2025-04-15'
    },
    { 
      id: 2, 
      name: 'Farine T45 Pâtissière', 
      category: 'Farine', 
      packaging: 'Sac 10kg',
      warehouse: 'Entrepôt Lyon', 
      currentStock: 40, 
      minStock: 100,
      restockDate: '2025-04-25',
      lastUpdated: '2025-04-10'
    },
    { 
      id: 3, 
      name: 'Farine Bio T80', 
      category: 'Farine Bio', 
      packaging: 'Sac 25kg',
      warehouse: 'Entrepôt Paris', 
      currentStock: 25, 
      minStock: 50,
      restockDate: '2025-04-23',
      lastUpdated: '2025-04-18'
    },
    { 
      id: 4, 
      name: 'Levain Déshydraté', 
      category: 'Additifs', 
      packaging: 'Sachet 1kg',
      warehouse: 'Entrepôt Marseille', 
      currentStock: 15, 
      minStock: 30,
      restockDate: '2025-04-25',
      lastUpdated: '2025-04-12'
    },
    { 
      id: 5, 
      name: 'Améliorant Baguette', 
      category: 'Additifs', 
      packaging: 'Sachet 500g',
      warehouse: 'Entrepôt Paris', 
      currentStock: 80, 
      minStock: 50,
      restockDate: null,
      lastUpdated: '2025-04-19'
    },
    { 
      id: 6, 
      name: 'Farine Seigle', 
      category: 'Farine', 
      packaging: 'Sac 25kg',
      warehouse: 'Entrepôt Lyon', 
      currentStock: 60, 
      minStock: 40,
      restockDate: null,
      lastUpdated: '2025-04-14'
    },
    { 
      id: 7, 
      name: 'Farine Complète', 
      category: 'Farine', 
      packaging: 'Sac 25kg',
      warehouse: 'Entrepôt Marseille', 
      currentStock: 95, 
      minStock: 100,
      restockDate: '2025-04-30',
      lastUpdated: '2025-04-16'
    },
    { 
      id: 8, 
      name: 'Gluten Vital', 
      category: 'Additifs', 
      packaging: 'Sachet 5kg',
      warehouse: 'Entrepôt Paris', 
      currentStock: 30, 
      minStock: 25,
      restockDate: null,
      lastUpdated: '2025-04-20'
    }
  ]);
  
  // Données des entrepôts disponibles
  const warehouses = [
    { id: 'paris', name: 'Entrepôt Paris' },
    { id: 'lyon', name: 'Entrepôt Lyon' },
    { id: 'marseille', name: 'Entrepôt Marseille' }
  ];
  
  // Données des catégories de produits
  const categories = [
    { id: 'farine', name: 'Farine' },
    { id: 'farine-bio', name: 'Farine Bio' },
    { id: 'additifs', name: 'Additifs' },
    { id: 'autres', name: 'Autres' }
  ];
  
  // Fonction pour mettre à jour les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  
  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      warehouse: 'all',
      category: 'all',
      stockLevel: 'all',
      searchQuery: ''
    });
  };
  
  // Fonction pour filtrer les produits
  const filteredProducts = stockProducts.filter(product => {
    // Filtre par entrepôt
    if (filters.warehouse !== 'all' && product.warehouse !== filters.warehouse) {
      return false;
    }
    
    // Filtre par catégorie
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }
    
    // Filtre par niveau de stock
    if (filters.stockLevel === 'low' && product.currentStock >= product.minStock) {
      return false;
    }
    if (filters.stockLevel === 'normal' && product.currentStock < product.minStock) {
      return false;
    }
    
    // Filtre par recherche
    if (
      filters.searchQuery && 
      !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Fonction pour déterminer la classe de couleur selon le niveau de stock
  const getStockLevelClass = (currentStock, minStock) => {
    const ratio = currentStock / minStock;
    if (ratio < 0.5) return 'bg-red-100 text-red-800';
    if (ratio < 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  
  // Fonction pour formater une date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  // Fonction pour exporter les données (simulation)
  const exportData = () => {
    alert('Export des données en CSV (simulation)');
    // Ici, on implémenterait la fonctionnalité réelle d'export
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
          <p className="text-gray-600">Visualisez et gérez les stocks dans tous les entrepôts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportData}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Exporter
          </button>
          <Link 
            to="/approvisionnement/stocks/ajustements"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Ajustement de stock
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 mb-1">
              Entrepôt
            </label>
            <select
              id="warehouse"
              name="warehouse"
              value={filters.warehouse}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les entrepôts</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.name}>{warehouse.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="stockLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Niveau de stock
            </label>
            <select
              id="stockLevel"
              name="stockLevel"
              value={filters.stockLevel}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les niveaux</option>
              <option value="low">Stock faible</option>
              <option value="normal">Stock normal</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <input
                type="text"
                id="searchQuery"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder="Rechercher un produit..."
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Tableau des stocks */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Produits en stock</h2>
          <span className="text-sm text-gray-600">{filteredProducts.length} produits trouvés</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conditionnement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrepôt
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock actuel
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock minimum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prochaine livraison
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.packaging}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStockLevelClass(product.currentStock, product.minStock)}`}>
                        {product.currentStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {product.minStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {product.restockDate ? formatDate(product.restockDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link to={`/approvisionnement/stocks/historique/${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Historique
                        </Link>
                        <Link to={`/approvisionnement/bons-transport/nouveau?product=${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Transférer
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                    Aucun produit ne correspond aux critères de recherche.
                    <br />
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-indigo-600 hover:text-indigo-900"
                    >
                      Réinitialiser les filtres
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé par entrepôt */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé par entrepôt</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {warehouses.map(warehouse => {
            const warehouseProducts = stockProducts.filter(p => p.warehouse === warehouse.name);
            const lowStockCount = warehouseProducts.filter(p => p.currentStock < p.minStock).length;
            const totalStock = warehouseProducts.reduce((sum, p) => sum + p.currentStock, 0);
            
            return (
              <div key={warehouse.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{warehouse.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total produits:</span>
                    <span className="font-medium">{warehouseProducts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stock faible:</span>
                    <span className={`font-medium ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                      {lowStockCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unités en stock:</span>
                    <span className="font-medium">{totalStock}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <Link 
                      to={`/approvisionnement/entrepots/${warehouse.id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
