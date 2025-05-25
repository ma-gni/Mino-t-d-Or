import React, { useState } from 'react';

const QuoteRequest = () => {
  const [quoteItems, setQuoteItems] = useState([
    {
      productId: 1,
      name: "Farine T55 Premium",
      quantity: 2,
      weight: 25,
      priceHT: 45.99
    }
  ]);

  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');

  const updateQuantity = (productId, newQuantity) => {
    setQuoteItems(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity: parseInt(newQuantity) || 0 }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setQuoteItems(items => items.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return quoteItems.reduce((total, item) => total + (item.priceHT * item.quantity), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Envoyer la demande de devis
    console.log({
      items: quoteItems,
      deliveryDate,
      notes,
      total: calculateTotal()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Demande de devis</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Liste des produits */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Produits sélectionnés</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix unitaire HT
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total HT
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quoteItems.map((item) => (
                      <tr key={item.productId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                          <div className="text-gray-500 text-xs">{item.weight}kg</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.priceHT.toFixed(2)}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, e.target.value)}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {(item.priceHT * item.quantity).toFixed(2)}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-right font-semibold">
                        Total HT
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-lg">
                        {calculateTotal().toFixed(2)}€
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Date de livraison */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de livraison souhaitée
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes ou instructions spéciales
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Envoyer la demande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequest;
