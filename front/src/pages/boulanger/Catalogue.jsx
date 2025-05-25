/**
 * Catalogue.jsx (Boulanger)
 * --------------------------------------------------
 * Page de catalogue produits pour les boulangers
 * 
 * Cette page permet aux boulangers de :
 * - Consulter le catalogue complet des produits
 * - Filtrer les produits selon différents critères
 * - Voir les prix (HT/TTC ou mention "prix sur demande")
 * - Ajouter des produits à un nouveau devis
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Catalogue() {
  // États pour les filtres et le panier
  const [filters, setFilters] = useState({
    farine: '',
    conditionnement: '',
    minotier: '',
    prixMax: '',
    searchTerm: ''
  });
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Fonction de gestion des changements de filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      farine: '',
      conditionnement: '',
      minotier: '',
      prixMax: '',
      searchTerm: ''
    });
  };

  // Fonction pour ajouter un produit au panier
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Fonction pour supprimer un produit du panier
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // Fonction pour mettre à jour la quantité d'un produit
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  // Fonction pour créer un devis à partir du panier
  const createQuote = () => {
    if (cartItems.length === 0) return;
    
    // Stockage temporaire dans le localStorage - dans une vraie application, on enverrait au serveur
    localStorage.setItem('draftQuote', JSON.stringify(cartItems));
    
    // Redirection vers la page de création de devis
    window.location.href = '/boulanger/devis/nouveau';
  };

  // Données fictives pour les produits
  const products = [
    {
      id: 1,
      name: 'Farine T65 Tradition',
      description: 'Farine de blé de type 65, idéale pour la baguette tradition',
      type: 'Blé',
      packaging: 'Sac 25kg',
      miller: 'Minoterie Dupuis',
      priceHT: 42.50,
      priceTTC: 44.84,
      image: '/images/farine-t65.jpg'
    },
    {
      id: 2,
      name: 'Farine T45 Pâtissière',
      description: 'Farine fine pour toutes vos pâtisseries',
      type: 'Blé',
      packaging: 'Sac 10kg',
      miller: 'Grands Moulins de Paris',
      priceHT: 22.80,
      priceTTC: 24.05,
      image: '/images/farine-t45.jpg'
    },
    {
      id: 3,
      name: 'Farine de Seigle T130',
      description: 'Farine de seigle pour pain de seigle et pain de campagne',
      type: 'Seigle',
      packaging: 'Sac 25kg',
      miller: 'Minoterie Artisanale',
      priceHT: 48.90,
      priceTTC: 51.59,
      image: '/images/farine-seigle.jpg'
    },
    {
      id: 4,
      name: 'Farine Bio T80',
      description: 'Farine de blé semi-complète issue de l\'agriculture biologique',
      type: 'Blé Bio',
      packaging: 'Sac 25kg',
      miller: 'Moulins Bio',
      priceHT: 56.75,
      priceTTC: 59.87,
      image: '/images/farine-bio-t80.jpg'
    },
    {
      id: 5,
      name: 'Farine T110 Complète',
      description: 'Farine complète pour pains spéciaux et complets',
      type: 'Blé',
      packaging: 'Sac 25kg',
      miller: 'Minoterie Dupuis',
      priceHT: 46.80,
      priceTTC: 49.37,
      image: '/images/farine-t110.jpg'
    },
    {
      id: 6,
      name: 'Farine de Châtaigne',
      description: 'Farine de châtaigne pour pains et pâtisseries spéciales',
      type: 'Châtaigne',
      packaging: 'Sac 5kg',
      miller: 'Minoterie Artisanale',
      priceOnRequest: true,
      image: '/images/farine-chataigne.jpg'
    },
    {
      id: 7,
      name: 'Levain Déshydraté',
      description: 'Levain en poudre pour faciliter vos panifications',
      type: 'Additif',
      packaging: 'Sachet 500g',
      miller: 'Grands Moulins de Paris',
      priceHT: 12.40,
      priceTTC: 13.08,
      image: '/images/levain.jpg'
    },
    {
      id: 8,
      name: 'Améliorant Baguette',
      description: 'Améliorant pour baguettes croustillantes',
      type: 'Additif',
      packaging: 'Sachet 1kg',
      miller: 'Moulins Bio',
      priceHT: 18.90,
      priceTTC: 19.94,
      image: '/images/ameliorant.jpg'
    }
  ];

  // Options pour les filtres
  const typeOptions = ['Blé', 'Seigle', 'Châtaigne', 'Blé Bio', 'Additif'];
  const packagingOptions = ['Sac 5kg', 'Sac 10kg', 'Sac 25kg', 'Sachet 500g', 'Sachet 1kg'];
  const millerOptions = ['Minoterie Dupuis', 'Grands Moulins de Paris', 'Minoterie Artisanale', 'Moulins Bio'];

  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    return (
      (filters.farine === '' || product.type === filters.farine) &&
      (filters.conditionnement === '' || product.packaging === filters.conditionnement) &&
      (filters.minotier === '' || product.miller === filters.minotier) &&
      (filters.prixMax === '' || (product.priceHT && product.priceHT <= parseFloat(filters.prixMax))) &&
      (filters.searchTerm === '' || 
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catalogue Produits</h1>
          <p className="text-gray-600">Découvrez notre sélection de farines et produits de minoterie</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCart(!showCart)}
            className="relative px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center"
          >
            <span className="mr-2">🛒</span> Panier
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                {cartItems.length}
              </span>
            )}
          </button>
          <Link 
            to="/boulanger/devis/nouveau" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Créer un devis
          </Link>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="mb-4">
          <label className="sr-only">Rechercher</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">🔍</span>
            </div>
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Rechercher un produit..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de farine</label>
            <select
              name="farine"
              value={filters.farine}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Tous les types</option>
              {typeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conditionnement</label>
            <select
              name="conditionnement"
              value={filters.conditionnement}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Tous les conditionnements</option>
              {packagingOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minotier</label>
            <select
              name="minotier"
              value={filters.minotier}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Tous les minotiers</option>
              {millerOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix max HT (€)</label>
            <input
              type="number"
              name="prixMax"
              value={filters.prixMax}
              onChange={handleFilterChange}
              placeholder="Prix maximum"
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

      {/* Carte panier (conditionnelle) */}
      {showCart && (
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Panier ({cartItems.length} produits)</h2>
            <button 
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Votre panier est vide</p>
          ) : (
            <>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                        ) : (
                          <span className="text-gray-500">📦</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.priceOnRequest ? 'Prix sur demande' : `${item.priceHT.toFixed(2)} € HT`}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-3 text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total HT: 
                    <span className="font-bold ml-1">
                      {cartItems.reduce((total, item) => {
                        return item.priceOnRequest 
                          ? total 
                          : total + (item.priceHT * item.quantity);
                      }, 0).toFixed(2)} €
                    </span>
                  </p>
                </div>
                <div>
                  <button 
                    onClick={createQuote}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Créer un devis
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Liste des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Aucun produit ne correspond à vos critères de recherche</p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-900"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-4xl">📦</span>
                )}
              </div>
              <div className="p-5 flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p><span className="font-medium">Type:</span> {product.type}</p>
                  <p><span className="font-medium">Conditionnement:</span> {product.packaging}</p>
                  <p className="col-span-2"><span className="font-medium">Minotier:</span> {product.miller}</p>
                </div>
              </div>
              <div className="p-5 border-t flex justify-between items-center">
                <div>
                  {product.priceOnRequest ? (
                    <p className="font-medium text-orange-600">Prix sur demande</p>
                  ) : (
                    <div>
                      <p className="font-bold text-gray-900">{product.priceHT.toFixed(2)} € HT</p>
                      <p className="text-sm text-gray-600">{product.priceTTC.toFixed(2)} € TTC</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Ajouter
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
