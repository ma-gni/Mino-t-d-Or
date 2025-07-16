/**
 * GestionProduits.jsx (Commercial)
 * --------------------------------------------------
 * Page de gestion du catalogue produit pour les commerciaux
 * 
 * Cette page permet aux commerciaux de :
 * - Consulter la liste des produits
 * - Ajouter de nouveaux produits
 * - Modifier les produits existants
 * - Fixer les prix de vente avec une marge ajustable
 */

import React, { useState } from 'react';

export default function GestionProduits() {
  // État pour la liste des produits
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Farine T65 Tradition',
      description: 'Farine de blé de type 65, idéale pour la baguette tradition',
      category: 'Farine',
      type: 'Blé',
      packaging: 'Sac 25kg',
      millerId: 1,
      millerName: 'Minoterie Dupuis',
      costPrice: 38.00,
      margin: 12,
      sellingPrice: 42.50,
      stock: 150,
      active: true
    },
    {
      id: 2,
      name: 'Farine T45 Pâtissière',
      description: 'Farine fine pour toutes vos pâtisseries',
      category: 'Farine',
      type: 'Blé',
      packaging: 'Sac 10kg',
      millerId: 2,
      millerName: 'Grands Moulins de Paris',
      costPrice: 18.50,
      margin: 23,
      sellingPrice: 22.80,
      stock: 85,
      active: true
    },
    {
      id: 3,
      name: 'Farine de Seigle T130',
      description: 'Farine de seigle pour pain de seigle et pain de campagne',
      category: 'Farine',
      type: 'Seigle',
      packaging: 'Sac 25kg',
      millerId: 3,
      millerName: 'Minoterie Artisanale',
      costPrice: 43.00,
      margin: 14,
      sellingPrice: 48.90,
      stock: 65,
      active: true
    },
    {
      id: 4,
      name: 'Farine Bio T80',
      description: 'Farine de blé semi-complète issue de l\'agriculture biologique',
      category: 'Farine',
      type: 'Blé Bio',
      packaging: 'Sac 25kg',
      millerId: 4,
      millerName: 'Moulins Bio',
      costPrice: 49.00,
      margin: 16,
      sellingPrice: 56.75,
      stock: 40,
      active: true
    },
    {
      id: 5,
      name: 'Levain Déshydraté',
      description: 'Levain en poudre pour faciliter vos panifications',
      category: 'Additif',
      type: 'Additif',
      packaging: 'Sachet 500g',
      millerId: 2,
      millerName: 'Grands Moulins de Paris',
      costPrice: 10.50,
      margin: 18,
      sellingPrice: 12.40,
      stock: 120,
      active: true
    }
  ]);

  // État pour la liste des minotiers
  const [millers, setMillers] = useState([
    { id: 1, name: 'Minoterie Dupuis' },
    { id: 2, name: 'Grands Moulins de Paris' },
    { id: 3, name: 'Minoterie Artisanale' },
    { id: 4, name: 'Moulins Bio' }
  ]);

  // État pour le formulaire
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    category: '',
    type: '',
    packaging: '',
    millerId: '',
    costPrice: '',
    margin: '',
    sellingPrice: '',
    stock: '',
    active: true
  });

  // Options pour les champs de sélection
  const categoryOptions = ['Farine', 'Additif', 'Améliorant', 'Levain', 'Autre'];
  const typeOptions = ['Blé', 'Seigle', 'Châtaigne', 'Blé Bio', 'Additif', 'Autre'];
  const packagingOptions = ['Sac 5kg', 'Sac 10kg', 'Sac 25kg', 'Sachet 500g', 'Sachet 1kg'];

  // État pour le mode (ajout/modification)
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // État pour la recherche et le filtre
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    millerId: '',
    active: ''
  });

  // Fonction pour filtrer les produits
  const filteredProducts = products.filter(product => {
    return (
      (searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.category === '' || product.category === filters.category) &&
      (filters.millerId === '' || product.millerId.toString() === filters.millerId) &&
      (filters.active === '' || 
        (filters.active === 'active' && product.active) || 
        (filters.active === 'inactive' && !product.active))
    );
  });

  // Fonction pour gérer les changements dans les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      category: '',
      millerId: '',
      active: ''
    });
    setSearchTerm('');
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // Si c'est un champ numérique, convertir en nombre
    if (type === 'number') {
      newValue = value === '' ? '' : parseFloat(value);
    }

    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: newValue
      };

      // Si le prix d'achat ou la marge change, recalculer le prix de vente
      if (name === 'costPrice' || name === 'margin') {
        if (newFormData.costPrice !== '' && newFormData.margin !== '') {
          const cost = parseFloat(newFormData.costPrice);
          const margin = parseFloat(newFormData.margin);
          newFormData.sellingPrice = (cost * (1 + margin / 100)).toFixed(2);
        }
      }

      // Si le prix de vente change, recalculer la marge
      if (name === 'sellingPrice' && newFormData.costPrice !== '') {
        const cost = parseFloat(newFormData.costPrice);
        const selling = parseFloat(newFormData.sellingPrice);
        if (cost > 0) {
          newFormData.margin = (((selling / cost) - 1) * 100).toFixed(2);
        }
      }

      return newFormData;
    });
  };

  // Fonction pour démarrer l'ajout d'un produit
  const startAddProduct = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      category: '',
      type: '',
      packaging: '',
      millerId: '',
      costPrice: '',
      margin: '',
      sellingPrice: '',
      stock: '',
      active: true
    });
    setIsEditing(false);
    setShowForm(true);
  };

  // Fonction pour démarrer la modification d'un produit
  const startEditProduct = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      type: product.type,
      packaging: product.packaging,
      millerId: product.millerId,
      costPrice: product.costPrice,
      margin: product.margin,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      active: product.active
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // Fonction pour enregistrer un produit (ajout ou modification)
  const saveProduct = (e) => {
    e.preventDefault();

    const millerName = millers.find(m => m.id === parseInt(formData.millerId))?.name || '';
    
    const productData = {
      ...formData,
      millerId: parseInt(formData.millerId),
      millerName,
      costPrice: parseFloat(formData.costPrice),
      margin: parseFloat(formData.margin),
      sellingPrice: parseFloat(formData.sellingPrice),
      stock: parseInt(formData.stock)
    };

    if (isEditing) {
      // Modification d'un produit existant
      setProducts(products.map(product => 
        product.id === productData.id ? productData : product
      ));
    } else {
      // Ajout d'un nouveau produit
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id), 0) + 1
      };
      setProducts([...products, newProduct]);
    }

    // Réinitialisation du formulaire
    setShowForm(false);
  };

  // Fonction pour supprimer un produit
  const deleteProduct = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Catalogue</h1>
          <p className="text-gray-600">Gérez les produits et leurs prix</p>
        </div>
        <div>
          <button
            onClick={startAddProduct}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout/modification (conditionnel) */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? 'Modifier un produit' : 'Ajouter un produit'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={saveProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="millerId" className="block text-sm font-medium text-gray-700 mb-1">
                  Minotier *
                </label>
                <select
                  id="millerId"
                  name="millerId"
                  value={formData.millerId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Sélectionner un minotier</option>
                  {millers.map(miller => (
                    <option key={miller.id} value={miller.id}>{miller.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Sélectionner un type</option>
                  {typeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="packaging" className="block text-sm font-medium text-gray-700 mb-1">
                  Conditionnement *
                </label>
                <select
                  id="packaging"
                  name="packaging"
                  value={formData.packaging}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Sélectionner un conditionnement</option>
                  {packagingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock disponible *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix d'achat (€ HT) *
                </label>
                <input
                  type="number"
                  id="costPrice"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="margin" className="block text-sm font-medium text-gray-700 mb-1">
                  Marge (%) *
                </label>
                <input
                  type="number"
                  id="margin"
                  name="margin"
                  value={formData.margin}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Prix de vente (€ HT) *
                </label>
                <input
                  type="number"
                  id="sellingPrice"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center h-full">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Produit actif</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">🔍</span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un produit..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Toutes les catégories</option>
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minotier</label>
            <select
              name="millerId"
              value={filters.millerId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tous les minotiers</option>
              {millers.map(miller => (
                <option key={miller.id} value={miller.id}>{miller.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              name="active"
              value={filters.active}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
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

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Liste des produits ({filteredProducts.length})
          </h2>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Minotier
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conditionnement
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achat HT
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marge
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vente HT
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category} - {product.type}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.millerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500">
                      {product.packaging}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">
                      {product.costPrice.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">
                      {product.margin}%
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                      {product.sellingPrice.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.stock > 50 ? 'bg-green-100 text-green-800' : 
                        product.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => startEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
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
