import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuoteForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    products: [{ productId: '', quantity: '', requestedDate: '' }],
    notes: ''
  });

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;
    setFormData({ ...formData, products: newProducts });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productId: '', quantity: '', requestedDate: '' }]
    });
  };

  const removeProduct = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement quote submission
      navigate('/quotes');
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouveau devis</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.products.map((product, index) => (
            <div key={index} className="bg-white shadow sm:rounded-lg p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Produit
                  </label>
                  <select
                    value={product.productId}
                    onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Sélectionnez un produit</option>
                    {/* TODO: Add product options */}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    value={product.requestedDate}
                    onChange={(e) => handleProductChange(index, 'requestedDate', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                {formData.products.length > 1 && (
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={addProduct}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ajouter un produit
            </button>
          </div>

          <div className="bg-white shadow sm:rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/quotes')}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Créer le devis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;
