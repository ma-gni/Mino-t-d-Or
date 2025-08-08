/**
 * QuoteStatusCard.jsx
 * --------------------------------------------------
 * Composant de carte de statut des devis
 * 
 * Ce composant affiche les devis avec leur statut :
 * - Référence du devis
 * - Date de création
 * - Statut actuel
 * - Montant total
 * - Actions disponibles
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant QuoteStatusCard
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.quotes - La liste des devis
 * @param {number} [props.maxItems] - Nombre maximum d'éléments à afficher
 * @param {boolean} [props.showActions] - Afficher les actions
 * @returns {JSX.Element} Le composant QuoteStatusCard
 */
export default function QuoteStatusCard({ 
  quotes = [], 
  maxItems = 5, 
  showActions = true 
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepté':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'en attente':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refusé':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'confirmé':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'livré':
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Accepté';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Refusé';
      case 'confirmed':
        return 'Confirmé';
      case 'delivered':
        return 'Livré';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'accepté':
      case 'approved':
        return '✅';
      case 'en attente':
      case 'pending':
        return '⏳';
      case 'refusé':
      case 'rejected':
        return '❌';
      case 'confirmé':
      case 'confirmed':
        return '✅';
      case 'livré':
      case 'delivered':
        return '📦';
      default:
        return '📄';
    }
  };

  const displayedQuotes = quotes.slice(0, maxItems);

  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Devis récents</h2>
        </div>
        <div className="p-5 text-center text-gray-500">
          Aucun devis récent
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-5 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Devis récents</h2>
          {quotes.length > maxItems && (
            <Link 
              to="/boulanger/devis" 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Voir tous ({quotes.length})
            </Link>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          {displayedQuotes.map((quote, index) => (
            <div key={quote.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStatusIcon(quote.status)}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    <Link 
                      to={`/boulanger/devis/${quote.id}`} 
                      className="hover:text-indigo-600"
                    >
                      {quote.id}
                    </Link>
                  </div>
                  <div className="text-xs text-gray-500">
                    {quote.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                  {getStatusText(quote.status)}
                </span>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {typeof quote.total === 'number' 
                      ? `${quote.total.toFixed(2)} €` 
                      : quote.total
                    }
                  </div>
                </div>
                {showActions && (
                  <div className="flex space-x-2">
                    <Link 
                      to={`/boulanger/devis/${quote.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Détails
                    </Link>
                    {quote.status === 'En attente' && (
                      <button 
                        className="text-xs text-green-600 hover:text-green-800"
                        onClick={() => console.log('Accepter devis:', quote.id)}
                      >
                        Accepter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 