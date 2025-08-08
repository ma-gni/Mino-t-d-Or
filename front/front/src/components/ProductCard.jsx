/**
 * ProductCard.jsx
 * --------------------------------------------------
 * Composant de carte produit amélioré
 * 
 * Ce composant affiche un produit avec :
 * - Image du produit
 * - Nom et description
 * - Prix et disponibilité
 * - Actions (ajouter au panier, voir détails)
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant ProductCard
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.product - Les données du produit
 * @param {boolean} [props.showActions] - Afficher les actions
 * @param {Function} [props.onAddToCart] - Fonction d'ajout au panier
 * @param {Function} [props.onAddToQuote] - Fonction d'ajout au devis
 * @returns {JSX.Element} Le composant ProductCard
 */
export default function ProductCard({ 
  product, 
  showActions = true, 
  onAddToCart, 
  onAddToQuote 
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (onAddToCart) {
      setIsLoading(true);
      try {
        await onAddToCart(product);
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddToQuote = async () => {
    if (onAddToQuote) {
      setIsLoading(true);
      try {
        await onAddToQuote(product);
      } catch (error) {
        console.error('Erreur lors de l\'ajout au devis:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Rupture', color: 'text-red-600' };
    if (stock < 10) return { text: 'Stock faible', color: 'text-orange-600' };
    return { text: 'En stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus(product.stockQuantity || 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image du produit */}
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl">🌾</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          {product.onQuote && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Sur devis
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Informations produit */}
        <div className="space-y-2 mb-4">
          {product.type && (
            <div className="text-xs text-gray-500">
              Type: {product.type}
            </div>
          )}
          {product.packaging && (
            <div className="text-xs text-gray-500">
              Conditionnement: {product.packaging}
            </div>
          )}
          {product.miller && (
            <div className="text-xs text-gray-500">
              Minotier: {product.miller}
            </div>
          )}
        </div>

        {/* Prix et stock */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {product.priceHT ? `${product.priceHT.toFixed(2)} € HT` : 'Sur devis'}
            </div>
            {product.priceTTC && (
              <div className="text-sm text-gray-500">
                {product.priceTTC.toFixed(2)} € TTC
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${stockStatus.color}`}>
              {stockStatus.text}
            </div>
            {product.stockQuantity > 0 && (
              <div className="text-xs text-gray-500">
                {product.stockQuantity} disponibles
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <Link
              to={`/products/${product.id}`}
              className="flex-1 text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Voir détails
            </Link>
            
            {!product.onQuote && onAddToCart && (
              <button
                onClick={handleAddToCart}
                disabled={isLoading || product.stockQuantity <= 0}
                className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : 'Ajouter'}
              </button>
            )}
            
            {product.onQuote && onAddToQuote && (
              <button
                onClick={handleAddToQuote}
                disabled={isLoading}
                className="flex-1 bg-yellow-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : 'Demander devis'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
  