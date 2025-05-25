/**
 * DeclarerInvendus.jsx (Boulanger)
 * --------------------------------------------------
 * Page de déclaration des invendus pour les boulangers
 * 
 * Cette page permet aux boulangers de :
 * - Déclarer leurs produits invendus
 * - Sélectionner les produits concernés
 * - Spécifier les quantités
 * - Suivre l'historique des déclarations
 */

import React, { useState } from 'react';

export default function DeclarerInvendus() {
  // États pour le formulaire
  const [formData, setFormData] = useState({
    date: new Date().toISOString().substr(0, 10),
    products: [],
    reason: '',
    comments: ''
  });
  
  // État pour le produit en cours d'ajout
  const [currentProduct, setCurrentProduct] = useState({
    id: '',
    name: '',
    quantity: 1,
    unit: 'kg'
  });
  
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState('new');
  
  // État pour l'historique des déclarations
  const [history] = useState([
    {
      id: 'INV-2025-001',
      date: '15/04/2025',
      status: 'processed',
      products: [
        { name: 'Farine T65', quantity: 15, unit: 'kg' },
        { name: 'Levure fraîche', quantity: 1.5, unit: 'kg' }
      ]
    },
    {
      id: 'INV-2025-002',
      date: '08/04/2025',
      status: 'processed',
      products: [
        { name: 'Farine T45', quantity: 8, unit: 'kg' },
        { name: 'Farine de Seigle', quantity: 5, unit: 'kg' }
      ]
    },
    {
      id: 'INV-2025-003',
      date: '01/04/2025',
      status: 'processed',
      products: [
        { name: 'Améliorant baguette', quantity: 2, unit: 'kg' },
        { name: 'Mélange 5 graines', quantity: 3, unit: 'kg' }
      ]
    }
  ]);
  
  // Liste des produits disponibles (simulée)
  const availableProducts = [
    { id: 'p1', name: 'Farine T65', unit: 'kg' },
    { id: 'p2', name: 'Farine T45', unit: 'kg' },
    { id: 'p3', name: 'Farine T80', unit: 'kg' },
    { id: 'p4', name: 'Farine de Seigle', unit: 'kg' },
    { id: 'p5', name: 'Levure fraîche', unit: 'kg' },
    { id: 'p6', name: 'Levure sèche active', unit: 'kg' },
    { id: 'p7', name: 'Améliorant baguette', unit: 'kg' },
    { id: 'p8', name: 'Graines de lin', unit: 'kg' },
    { id: 'p9', name: 'Mélange 5 graines', unit: 'kg' }
  ];
  
  // Liste des raisons d'invendus
  const reasons = [
    { id: 'r1', label: 'Produit endommagé lors du transport' },
    { id: 'r2', label: 'Produit périmé ou proche de la date limite' },
    { id: 'r3', label: 'Excès de stock' },
    { id: 'r4', label: 'Qualité non conforme' },
    { id: 'r5', label: 'Autre raison' }
  ];
  
  // Gérer le changement de l'onglet actif
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Gérer les changements dans le formulaire principal
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Gérer les changements dans le produit en cours d'ajout
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'id') {
      const selectedProduct = availableProducts.find(p => p.id === value);
      setCurrentProduct({
        id: value,
        name: selectedProduct ? selectedProduct.name : '',
        quantity: currentProduct.quantity,
        unit: selectedProduct ? selectedProduct.unit : 'kg'
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value
      });
    }
  };
  
  // Ajouter un produit à la liste des produits invendus
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    if (!currentProduct.id || !currentProduct.quantity) {
      alert('Veuillez sélectionner un produit et spécifier une quantité.');
      return;
    }
    
    const newProduct = {
      id: currentProduct.id,
      name: currentProduct.name,
      quantity: parseFloat(currentProduct.quantity),
      unit: currentProduct.unit
    };
    
    setFormData({
      ...formData,
      products: [...formData.products, newProduct]
    });
    
    // Réinitialiser le produit en cours d'ajout
    setCurrentProduct({
      id: '',
      name: '',
      quantity: 1,
      unit: 'kg'
    });
  };
  
  // Supprimer un produit de la liste des produits invendus
  const handleRemoveProduct = (index) => {
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    
    setFormData({
      ...formData,
      products: updatedProducts
    });
  };
  
  // Soumettre le formulaire de déclaration d'invendus
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.products.length === 0) {
      alert('Veuillez ajouter au moins un produit.');
      return;
    }
    
    if (!formData.reason) {
      alert('Veuillez sélectionner une raison.');
      return;
    }
    
    // Dans une vraie application, on enverrait ces données à une API
    alert('Déclaration d\'invendus soumise avec succès!');
    
    // Réinitialiser le formulaire
    setFormData({
      date: new Date().toISOString().substr(0, 10),
      products: [],
      reason: '',
      comments: ''
    });
  };
  
  // Traduction des statuts en français
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'processed': return 'Traitée';
      case 'rejected': return 'Rejetée';
      default: return status;
    }
  };
  
  // Couleurs selon le statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Déclarer des invendus</h1>
      
      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('new')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'new'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Nouvelle déclaration
          </button>
          <button
            onClick={() => handleTabChange('history')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Historique
          </button>
        </nav>
      </div>
      
      {/* Contenu selon l'onglet actif */}
      {activeTab === 'new' ? (
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date de déclaration */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date de la déclaration
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            {/* Liste des produits invendus */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Produits invendus</h3>
              
              {/* Formulaire d'ajout de produit */}
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ajouter un produit</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="product-id" className="block text-sm font-medium text-gray-700">
                      Produit
                    </label>
                    <select
                      id="product-id"
                      name="id"
                      value={currentProduct.id}
                      onChange={handleProductChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Sélectionner un produit</option>
                      {availableProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="product-quantity" className="block text-sm font-medium text-gray-700">
                      Quantité
                    </label>
                    <input
                      type="number"
                      id="product-quantity"
                      name="quantity"
                      min="0.1"
                      step="0.1"
                      value={currentProduct.quantity}
                      onChange={handleProductChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Liste des produits ajoutés */}
              {formData.products.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-md">
                  <p className="text-gray-500">Aucun produit ajouté pour le moment.</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantité
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unité
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Raison de la déclaration */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Raison
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleFormChange}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Sélectionner une raison</option>
                {reasons.map(reason => (
                  <option key={reason.id} value={reason.id}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Commentaires */}
            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Commentaires (facultatif)
              </label>
              <textarea
                id="comments"
                name="comments"
                rows={3}
                value={formData.comments}
                onChange={handleFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Informations complémentaires sur les invendus"
              />
            </div>
            
            {/* Bouton de soumission */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Soumettre la déclaration
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Historique des déclarations</h2>
          
          {history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucune déclaration d'invendus dans l'historique.</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Référence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((declaration) => (
                    <tr key={declaration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {declaration.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {declaration.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <ul className="list-disc list-inside space-y-1">
                          {declaration.products.map((product, index) => (
                            <li key={index}>
                              {product.name}: {product.quantity} {product.unit}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(declaration.status)}`}>
                          {getStatusText(declaration.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
