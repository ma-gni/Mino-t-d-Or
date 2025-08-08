/**
 * RecentOrdersTable.jsx
 * --------------------------------------------------
 * Composant de tableau des commandes récentes
 * 
 * Ce composant affiche un tableau des commandes récentes avec :
 * - Référence de commande
 * - Date de commande
 * - Statut
 * - Montant total
 * - Actions rapides
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant RecentOrdersTable
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.orders - La liste des commandes récentes
 * @param {number} [props.maxItems] - Nombre maximum d'éléments à afficher
 * @param {boolean} [props.showActions] - Afficher les actions
 * @returns {JSX.Element} Le composant RecentOrdersTable
 */
export default function RecentOrdersTable({ 
  orders = [], 
  maxItems = 5, 
  showActions = true 
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'livrée':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'en livraison':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'en cours':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'annulée':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'Livrée';
      case 'shipped':
        return 'En livraison';
      case 'processing':
        return 'En cours';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const displayedOrders = orders.slice(0, maxItems);

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Commandes récentes</h2>
        </div>
        <div className="p-5 text-center text-gray-500">
          Aucune commande récente
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-5 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Commandes récentes</h2>
          {orders.length > maxItems && (
            <Link 
              to="/boulanger/commandes" 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Voir toutes ({orders.length})
            </Link>
          )}
        </div>
      </div>
      <div className="p-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              {showActions && (
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedOrders.map((order, index) => (
              <tr key={order.id || index} className="hover:bg-gray-50">
                <td className="py-3 text-sm font-medium text-indigo-600">
                  <Link to={`/boulanger/commandes/${order.id}`} className="hover:underline">
                    {order.id}
                  </Link>
                </td>
                <td className="py-3 text-sm text-gray-700">
                  {order.date}
                </td>
                <td className="py-3 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-700 text-right">
                  {typeof order.total === 'number' 
                    ? `${order.total.toFixed(2)} €` 
                    : order.total
                  }
                </td>
                {showActions && (
                  <td className="py-3 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/boulanger/commandes/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs"
                      >
                        Détails
                      </Link>
                      {order.status === 'En livraison' && (
                        <Link 
                          to={`/boulanger/commandes/${order.id}/suivi`}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Suivi
                        </Link>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 