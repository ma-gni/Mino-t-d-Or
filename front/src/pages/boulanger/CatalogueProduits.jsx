/**
 * CatalogueProduits.jsx (Boulanger)
 * --------------------------------------------------
 * Page du catalogue produits pour les boulangers
 * 
 * Cette page permet aux boulangers de :
 * - Consulter les produits disponibles
 * - Filtrer par catégorie, prix, etc.
 * - Ajouter des produits à leur panier pour créer un devis
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CatalogueProduits() {
  // États pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('name');
  
  // Catégories de produits
  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'farine', name: 'Farines' },
    { id: 'levure', name: 'Levures' },
    { id: 'ameliorant', name: 'Améliorants' },
    { id: 'graines', name: 'Graines et céréales' },
    { id: 'equipement', name: 'Équipements' }
  ];
  
  // Données de produits (simulées)
  const [products] = useState([
    {
      id: 1,
      name: 'Farine T65',
      category: 'farine',
      description: 'Farine de blé T65 pour tous types de pains.',
      price: 1.2,
      unit: 'kg',
      packaging: 'Sac 25kg',
      image: 'https://placehold.co/300x200?text=Farine+T65',
      stock: 'En stock'
    },
    {
      id: 2,
      name: 'Farine T45',
      category: 'farine',
      description: 'Farine de blé T45 pour pâtisseries et viennoiseries.',
      price: 1.4,
      unit: 'kg',
      packaging: 'Sac 25kg',
      image: 'https://placehold.co/300x200?text=Farine+T45',
      stock: 'En stock'
    },
    {
      id: 3,
      name: 'Farine T80',
      category: 'farine',
      description: 'Farine de blé T80 semi-complète pour pains spéciaux.',
      price: 1.5,
      unit: 'kg',
      packaging: 'Sac 25kg',
      image: 'https://placehold.co/300x200?text=Farine+T80',
      stock: 'En stock'
    },
    {
      id: 4,
      name: 'Farine de Seigle',
      category: 'farine',
      description: 'Farine de seigle pour pains rustiques et pain de seigle.',
      price: 1.6,
      unit: 'kg',
      packaging: 'Sac 25kg',
      image: 'https://placehold.co/300x200?text=Farine+Seigle',
      stock: 'En stock'
    },
    {
      id: 5,
      name: 'Levure fraîche',
      category: 'levure',
      description: 'Levure fraîche pour tous types de pains et viennoiseries.',
      price: 3.2,
      unit: 'kg',
      packaging: 'Paquet 1kg',
      image: 'https://placehold.co/300x200?text=Levure+Fraîche',
      stock: 'En stock'
    },
    {
      id: 6,
      name: 'Levure sèche active',
      category: 'levure',
      description: 'Levure sèche active pour une longue conservation.',
      price: 9.5,
      unit: 'kg',
      packaging: 'Sachet 500g',
      image: 'https://placehold.co/300x200?text=Levure+Sèche',
      stock: 'Stock limité'
    },
    {
      id: 7,
      name: 'Améliorant baguette',
      category: 'ameliorant',
      description: 'Améliorant pour baguettes traditionnelles et pains blancs.',
      price: 4.8,
      unit: 'kg',
      packaging: 'Sac 10kg',
      image: 'https://placehold.co/300x200?text=Améliorant',
      stock: 'En stock'
    },
    {
      id: 8,
      name: 'Graines de lin',
      category: 'graines',
      description: 'Graines de lin pour pains aux graines et décoration.',
      price: 3.9,
      unit: 'kg',
      packaging: 'Sac 5kg',
      image: 'https://placehold.co/300x200?text=Graines+Lin',
      stock: 'En stock'
    },
    {
      id: 9,
      name: 'Mélange 5 graines',
      category: 'graines',
      description: 'Mélange de 5 graines pour pains spéciaux et décoration.',
      price: 5.2,
      unit: 'kg',
      packaging: 'Sac 5kg',
      image: 'https://placehold.co/300x200?text=Mélange+Graines',
      stock: 'En stock'
    },
    {
      id: 10,
      name: 'Moules à pain',
      category: 'equipement',
      description: 'Moules à pain en acier antiadhésif, lot de 3.',
      price: 29.9,
      unit: 'lot',
      packaging: 'Lot de 3',
      image: 'https://placehold.co/300x200?text=Moules',
      stock: 'En stock'
    }
  ]);
  
  // Filtrer les produits selon les critères
  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === 'price_asc') {
        return a.price - b.price;
      } else if (sortOrder === 'price_desc') {
        return b.price - a.price;
      }
      return 0;
    });
  
  // Gérer la recherche
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Gérer le changement de catégorie
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  // Gérer le changement d'ordre de tri
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
  
  // Simulation d'ajout au devis
  const handleAddToQuote = (productId) => {
    // Dans une vraie application, on ajouterait le produit à un état global ou à un contexte de panier
    alert(`Produit ${productId} ajouté au devis`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Catalogue produits</h1>
      
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
              placeholder="Rechercher un produit..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="w-full md:w-auto">
          <label htmlFor="category" className="sr-only">Catégorie</label>
          <select
            id="category"
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-auto">
          <label htmlFor="sort" className="sr-only">Trier par</label>
          <select
            id="sort"
            name="sort"
            value={sortOrder}
            onChange={handleSortChange}
            className="py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="name">Nom (A-Z)</option>
            <option value="price_asc">Prix (croissant)</option>
            <option value="price_desc">Prix (décroissant)</option>
          </select>
        </div>
      </div>
      
      {/* Grille de produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Aucun produit ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    product.stock === 'En stock' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.stock}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold">{product.price.toFixed(2)} €</span>
                    <span className="text-gray-500 text-sm">/{product.unit}</span>
                  </div>
                  <span className="text-sm text-gray-500">{product.packaging}</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleAddToQuote(product.id)}
                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Ajouter au devis
                  </button>
                  <Link
                    to={`/boulanger/produits/${product.id}`}
                    className="py-2 px-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
