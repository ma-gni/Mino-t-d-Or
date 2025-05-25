/**
 * TraitementDevis.jsx (Commercial)
 * --------------------------------------------------
 * Page de traitement des demandes de devis pour les commerciaux
 * 
 * Cette page permet aux commerciaux de :
 * - Consulter les demandes de devis des boulangers
 * - Appliquer des ristournes (globales ou par article)
 * - Calculer les frais de livraison
 * - Accepter ou refuser les demandes
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TraitementDevis() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // État pour le devis actuel
  const [quote, setQuote] = useState({
    id: 'DV-2025-012',
    date: '2025-04-20',
    status: 'En attente',
    bakerId: 42,
    bakerName: 'Boulangerie Durand',
    bakerAddress: '123 rue de Paris, 75001 Paris',
    bakerEmail: 'contact@boulangerie-durand.fr',
    bakerPhone: '01 23 45 67 89',
    deliveryDate: '2025-04-27',
    deliveryFee: 45.00,
    globalDiscount: 0,
    totalHT: 1850.00,
    totalTTC: 1951.75,
    items: [
      {
        id: 1,
        productId: 1,
        name: 'Farine T65 Tradition',
        packaging: 'Sac 25kg',
        quantity: 20,
        unitPrice: 42.50,
        discount: 0,
        total: 850.00
      },
      {
        id: 2,
        productId: 2,
        name: 'Farine T45 Pâtissière',
        packaging: 'Sac 10kg',
        quantity: 10,
        unitPrice: 22.80,
        discount: 0,
        total: 228.00
      },
      {
        id: 3,
        productId: 8,
        name: 'Améliorant Baguette',
        packaging: 'Sachet 1kg',
        quantity: 5,
        unitPrice: 18.90,
        discount: 0,
        total: 94.50
      }
    ],
    comments: '',
    responseComments: ''
  });

  // État pour les modes d'édition
  const [editingGlobalDiscount, setEditingGlobalDiscount] = useState(false);
  const [editingDeliveryFee, setEditingDeliveryFee] = useState(false);
  const [editingItemDiscount, setEditingItemDiscount] = useState(null);
  
  // État pour sauvegarder les valeurs initiales pendant l'édition
  const [initialValue, setInitialValue] = useState(null);

  // Fonction pour mettre à jour le devis
  const updateQuote = (updates) => {
    const updatedQuote = { ...quote, ...updates };
    // Recalculer les totaux
    let subtotal = 0;
    updatedQuote.items.forEach(item => {
      const discountedPrice = item.unitPrice * (1 - item.discount / 100);
      item.total = discountedPrice * item.quantity;
      subtotal += item.total;
    });
    
    // Appliquer la ristourne globale
    const discountedSubtotal = subtotal * (1 - updatedQuote.globalDiscount / 100);
    updatedQuote.totalHT = discountedSubtotal + updatedQuote.deliveryFee;
    updatedQuote.totalTTC = updatedQuote.totalHT * 1.055; // TVA 5.5%
    
    setQuote(updatedQuote);
  };

  // Fonction pour mettre à jour un article du devis
  const updateQuoteItem = (itemId, updates) => {
    const updatedItems = quote.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, ...updates };
        // Recalculer le total de l'article
        const discountedPrice = updatedItem.unitPrice * (1 - updatedItem.discount / 100);
        updatedItem.total = discountedPrice * updatedItem.quantity;
        return updatedItem;
      }
      return item;
    });
    
    updateQuote({ items: updatedItems });
  };

  // Fonction pour gérer le début de l'édition
  const startEditing = (field, value) => {
    setInitialValue(value);
    
    if (field === 'globalDiscount') {
      setEditingGlobalDiscount(true);
    } else if (field === 'deliveryFee') {
      setEditingDeliveryFee(true);
    } else if (field.startsWith('itemDiscount-')) {
      const itemId = parseInt(field.split('-')[1]);
      setEditingItemDiscount(itemId);
    }
  };

  // Fonction pour gérer l'annulation de l'édition
  const cancelEditing = (field) => {
    if (field === 'globalDiscount') {
      setEditingGlobalDiscount(false);
      updateQuote({ globalDiscount: initialValue });
    } else if (field === 'deliveryFee') {
      setEditingDeliveryFee(false);
      updateQuote({ deliveryFee: initialValue });
    } else if (field.startsWith('itemDiscount-')) {
      const itemId = parseInt(field.split('-')[1]);
      setEditingItemDiscount(null);
      const item = quote.items.find(item => item.id === itemId);
      if (item) {
        updateQuoteItem(itemId, { discount: initialValue });
      }
    }
  };

  // Fonction pour gérer la fin de l'édition
  const finishEditing = (field) => {
    if (field === 'globalDiscount') {
      setEditingGlobalDiscount(false);
    } else if (field === 'deliveryFee') {
      setEditingDeliveryFee(false);
    } else if (field.startsWith('itemDiscount-')) {
      setEditingItemDiscount(null);
    }
  };

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e, field) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    
    if (field === 'globalDiscount') {
      updateQuote({ globalDiscount: value });
    } else if (field === 'deliveryFee') {
      updateQuote({ deliveryFee: value });
    } else if (field === 'responseComments') {
      updateQuote({ responseComments: value });
    } else if (field.startsWith('itemDiscount-')) {
      const itemId = parseInt(field.split('-')[1]);
      updateQuoteItem(itemId, { discount: value });
    }
  };

  // Fonction pour accepter le devis
  const acceptQuote = () => {
    if (window.confirm('Êtes-vous sûr de vouloir accepter ce devis ?')) {
      updateQuote({ status: 'Accepté' });
      // Dans une vraie application, on enverrait les données au serveur
      alert('Le devis a été accepté et envoyé au boulanger.');
      navigate('/commercial/devis');
    }
  };

  // Fonction pour refuser le devis
  const rejectQuote = () => {
    if (window.confirm('Êtes-vous sûr de vouloir refuser ce devis ?')) {
      updateQuote({ status: 'Refusé' });
      // Dans une vraie application, on enverrait les données au serveur
      alert('Le devis a été refusé.');
      navigate('/commercial/devis');
    }
  };

  // Fonction pour formater les prix
  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Traitement de Devis</h1>
          <p className="text-gray-600">Référence: {quote.id}</p>
        </div>
        <div className="flex space-x-2 items-center">
          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(quote.status)}`}>
            {quote.status}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/commercial/devis')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Retour
            </button>
            {quote.status === 'En attente' && (
              <>
                <button
                  onClick={rejectQuote}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Refuser
                </button>
                <button
                  onClick={acceptQuote}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Accepter
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Informations client */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Information client</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Coordonnées</h3>
              <p className="text-gray-700 font-medium">{quote.bakerName}</p>
              <p className="text-gray-600">{quote.bakerAddress}</p>
              <p className="text-gray-600">{quote.bakerEmail}</p>
              <p className="text-gray-600">{quote.bakerPhone}</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Informations devis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date de demande</p>
                  <p className="text-gray-700">{new Date(quote.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de livraison souhaitée</p>
                  <p className="text-gray-700">{new Date(quote.deliveryDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>
          {quote.comments && (
            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Commentaires du client</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded">{quote.comments}</p>
            </div>
          )}
        </div>
      </div>

      {/* Articles du devis */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Articles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conditionnement
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix unitaire
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remise
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total HT
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quote.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {item.packaging}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatPrice(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {editingItemDiscount === item.id ? (
                      <div className="flex items-center justify-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={item.discount}
                          onChange={(e) => handleChange(e, `itemDiscount-${item.id}`)}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md"
                        />
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => finishEditing(`itemDiscount-${item.id}`)}
                            className="text-green-500 hover:text-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => cancelEditing(`itemDiscount-${item.id}`)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(`itemDiscount-${item.id}`, item.discount)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.discount > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.discount > 0 ? `${item.discount}%` : 'Aucune'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatPrice(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Récapitulatif et calcul */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Réponse au client</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="responseComments" className="block text-sm font-medium text-gray-700 mb-1">
                Commentaires pour le client
              </label>
              <textarea
                id="responseComments"
                rows="4"
                value={quote.responseComments}
                onChange={(e) => handleChange(e, 'responseComments')}
                placeholder="Ajouter un message pour le client..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Récapitulatif</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Sous-total HT:</span>
              <span className="text-gray-900 font-medium">
                {formatPrice(quote.items.reduce((sum, item) => sum + item.total, 0))}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Ristourne globale:</span>
                {editingGlobalDiscount ? (
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={quote.globalDiscount}
                      onChange={(e) => handleChange(e, 'globalDiscount')}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md"
                    />
                    <span className="ml-1">%</span>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => finishEditing('globalDiscount')}
                        className="text-green-500 hover:text-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => cancelEditing('globalDiscount')}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing('globalDiscount', quote.globalDiscount)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      quote.globalDiscount > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {quote.globalDiscount > 0 ? `${quote.globalDiscount}%` : 'Aucune'}
                  </button>
                )}
              </div>
              <span className="text-gray-900 font-medium">
                {quote.globalDiscount > 0 ? 
                  `-${formatPrice((quote.items.reduce((sum, item) => sum + item.total, 0)) * (quote.globalDiscount / 100))}` : 
                  '0,00 €'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Frais de livraison:</span>
                {editingDeliveryFee ? (
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={quote.deliveryFee}
                      onChange={(e) => handleChange(e, 'deliveryFee')}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md"
                    />
                    <span className="ml-1">€</span>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => finishEditing('deliveryFee')}
                        className="text-green-500 hover:text-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => cancelEditing('deliveryFee')}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing('deliveryFee', quote.deliveryFee)}
                    className="text-indigo-600 hover:text-indigo-900 ml-1 text-sm underline"
                  >
                    Modifier
                  </button>
                )}
              </div>
              <span className="text-gray-900 font-medium">{formatPrice(quote.deliveryFee)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-medium">
              <span className="text-gray-700">Total HT:</span>
              <span className="text-gray-900 text-lg">{formatPrice(quote.totalHT)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">TVA (5,5%):</span>
              <span className="text-gray-900">{formatPrice(quote.totalTTC - quote.totalHT)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-bold">
              <span className="text-gray-700">Total TTC:</span>
              <span className="text-gray-900 text-xl">{formatPrice(quote.totalTTC)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
