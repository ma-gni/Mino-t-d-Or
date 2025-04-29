/**
 * BonTransportForm.jsx (Approvisionnement)
 * --------------------------------------------------
 * Formulaire de création d'un bon de transport
 * 
 * Cette page permet de créer un bon de transport pour :
 * - Transférer des produits d'un fournisseur vers un entrepôt
 * - Transférer des produits d'un entrepôt vers un boulanger
 * - Sélectionner un camion selon sa disponibilité et sa proximité
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BonTransportForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('product');
  
  // États du formulaire
  const [formData, setFormData] = useState({
    type: 'fournisseur-entrepot', // ou 'entrepot-boulanger'
    dateTransport: '',
    fournisseur: '',
    entrepotSource: '',
    entrepotDestination: '',
    boulanger: '',
    produits: [],
    camion: '',
    chauffeur: '',
    commentaires: ''
  });
  
  // Liste des fournisseurs (données fictives)
  const fournisseurs = [
    { id: 1, name: 'Grands Moulins de Paris', address: '99 Rue Mirabeau, 94200 Ivry-sur-Seine' },
    { id: 2, name: 'Moulins Bio', address: '24 Rue de la Meunerie, 69001 Lyon' },
    { id: 3, name: 'Minoterie Dupuis', address: '15 Avenue du Blé, 13001 Marseille' },
    { id: 4, name: 'Minoterie Artisanale', address: '8 Route des Champs, 44000 Nantes' },
  ];
  
  // Liste des entrepôts (données fictives)
  const entrepots = [
    { id: 1, name: 'Entrepôt Paris', address: '123 Boulevard Périphérique, 75019 Paris' },
    { id: 2, name: 'Entrepôt Lyon', address: '45 Route de Grenoble, 69800 Saint-Priest' },
    { id: 3, name: 'Entrepôt Marseille', address: '78 Avenue du Port, 13002 Marseille' },
  ];
  
  // Liste des boulangers (données fictives)
  const boulangers = [
    { id: 1, name: 'Boulangerie Durand', address: '12 Rue de la République, 75001 Paris' },
    { id: 2, name: 'Aux Délices du Pain', address: '34 Avenue des Gobelins, 75013 Paris' },
    { id: 3, name: 'Le Fournil de Pierre', address: '7 Rue de la Liberté, 69002 Lyon' },
    { id: 4, name: 'La Mie Dorée', address: '22 Boulevard de la Plage, 13008 Marseille' },
  ];
  
  // Liste des camions disponibles (données fictives)
  const camions = [
    { id: 1, name: 'Camion MB-01', type: 'Mercedes Sprinter', capacity: '3.5 tonnes', location: 'Paris' },
    { id: 2, name: 'Camion RN-02', type: 'Renault Master', capacity: '3 tonnes', location: 'Paris' },
    { id: 3, name: 'Camion IV-03', type: 'Iveco Daily', capacity: '5 tonnes', location: 'Lyon' },
    { id: 4, name: 'Camion MB-04', type: 'Mercedes Atego', capacity: '7.5 tonnes', location: 'Marseille' },
  ];
  
  // Liste des chauffeurs disponibles (données fictives)
  const chauffeurs = [
    { id: 1, name: 'Thomas Dupont', region: 'Paris' },
    { id: 2, name: 'Laurent Martin', region: 'Paris' },
    { id: 3, name: 'Sophie Richard', region: 'Lyon' },
    { id: 4, name: 'Marc Dubois', region: 'Marseille' },
  ];
  
  // Catalogue de produits (données fictives)
  const catalogue = [
    { id: 1, name: 'Farine T65 Tradition', category: 'Farine', packaging: 'Sac 25kg' },
    { id: 2, name: 'Farine T45 Pâtissière', category: 'Farine', packaging: 'Sac 10kg' },
    { id: 3, name: 'Farine Bio T80', category: 'Farine Bio', packaging: 'Sac 25kg' },
    { id: 4, name: 'Levain Déshydraté', category: 'Additifs', packaging: 'Sachet 1kg' },
    { id: 5, name: 'Améliorant Baguette', category: 'Additifs', packaging: 'Sachet 500g' },
    { id: 6, name: 'Farine Seigle', category: 'Farine', packaging: 'Sac 25kg' },
    { id: 7, name: 'Farine Complète', category: 'Farine', packaging: 'Sac 25kg' },
    { id: 8, name: 'Gluten Vital', category: 'Additifs', packaging: 'Sachet 5kg' },
  ];
  
  // Initialisation du formulaire
  useEffect(() => {
    // Date par défaut (date du jour + 3 jours)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    const formattedDate = defaultDate.toISOString().split('T')[0];
    
    // Initialisation avec la date par défaut
    setFormData(prevData => ({
      ...prevData,
      dateTransport: formattedDate
    }));
    
    // Si un produit est spécifié dans l'URL, l'ajouter à la liste
    if (productId) {
      const produit = catalogue.find(p => p.id === parseInt(productId));
      if (produit) {
        const newProduit = {
          ...produit,
          quantite: 1,
          unite: produit.packaging,
        };
        setFormData(prevData => ({
          ...prevData,
          produits: [...prevData.produits, newProduit]
        }));
      }
    }
  }, [productId]);
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Réinitialisation des champs en fonction du type de transport
    if (name === 'type') {
      setFormData(prevData => ({
        ...prevData,
        fournisseur: '',
        entrepotSource: '',
        entrepotDestination: '',
        boulanger: '',
        camion: '',
        chauffeur: ''
      }));
    }
  };
  
  // Gestion des changements dans les produits
  const handleProductChange = (index, field, value) => {
    const updatedProduits = [...formData.produits];
    updatedProduits[index] = {
      ...updatedProduits[index],
      [field]: value
    };
    setFormData(prevData => ({
      ...prevData,
      produits: updatedProduits
    }));
  };
  
  // Ajout d'un nouveau produit à la liste
  const addProduct = () => {
    setFormData(prevData => ({
      ...prevData,
      produits: [...prevData.produits, { id: '', name: '', quantite: 1, unite: '' }]
    }));
  };
  
  // Suppression d'un produit de la liste
  const removeProduct = (index) => {
    const updatedProduits = [...formData.produits];
    updatedProduits.splice(index, 1);
    setFormData(prevData => ({
      ...prevData,
      produits: updatedProduits
    }));
  };
  
  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation de base
    if (formData.produits.length === 0) {
      alert('Veuillez ajouter au moins un produit au bon de transport.');
      return;
    }
    
    if (formData.type === 'fournisseur-entrepot' && !formData.fournisseur) {
      alert('Veuillez sélectionner un fournisseur.');
      return;
    }
    
    if (formData.type === 'fournisseur-entrepot' && !formData.entrepotDestination) {
      alert('Veuillez sélectionner un entrepôt de destination.');
      return;
    }
    
    if (formData.type === 'entrepot-boulanger' && !formData.entrepotSource) {
      alert('Veuillez sélectionner un entrepôt source.');
      return;
    }
    
    if (formData.type === 'entrepot-boulanger' && !formData.boulanger) {
      alert('Veuillez sélectionner un boulanger.');
      return;
    }
    
    if (!formData.camion) {
      alert('Veuillez sélectionner un camion.');
      return;
    }
    
    if (!formData.chauffeur) {
      alert('Veuillez sélectionner un chauffeur.');
      return;
    }
    
    // Simulation de l'envoi des données
    console.log('Données du bon de transport:', formData);
    alert('Bon de transport créé avec succès !');
    navigate('/approvisionnement/bons-transport');
  };
  
  // Filtrer les camions en fonction de la localisation source
  const getCamionsDisponibles = () => {
    let location = '';
    
    if (formData.type === 'fournisseur-entrepot') {
      const fournisseur = fournisseurs.find(f => f.id === parseInt(formData.fournisseur));
      if (fournisseur) {
        if (fournisseur.address.includes('Paris')) location = 'Paris';
        else if (fournisseur.address.includes('Lyon')) location = 'Lyon';
        else if (fournisseur.address.includes('Marseille')) location = 'Marseille';
      }
    } else if (formData.type === 'entrepot-boulanger') {
      const entrepot = entrepots.find(e => e.id === parseInt(formData.entrepotSource));
      if (entrepot) {
        if (entrepot.name.includes('Paris')) location = 'Paris';
        else if (entrepot.name.includes('Lyon')) location = 'Lyon';
        else if (entrepot.name.includes('Marseille')) location = 'Marseille';
      }
    }
    
    if (!location) return camions;
    return camions.filter(c => c.location === location);
  };
  
  // Filtrer les chauffeurs en fonction de la localisation source
  const getChauffeursDisponibles = () => {
    let region = '';
    
    if (formData.type === 'fournisseur-entrepot') {
      const fournisseur = fournisseurs.find(f => f.id === parseInt(formData.fournisseur));
      if (fournisseur) {
        if (fournisseur.address.includes('Paris')) region = 'Paris';
        else if (fournisseur.address.includes('Lyon')) region = 'Lyon';
        else if (fournisseur.address.includes('Marseille')) region = 'Marseille';
      }
    } else if (formData.type === 'entrepot-boulanger') {
      const entrepot = entrepots.find(e => e.id === parseInt(formData.entrepotSource));
      if (entrepot) {
        if (entrepot.name.includes('Paris')) region = 'Paris';
        else if (entrepot.name.includes('Lyon')) region = 'Lyon';
        else if (entrepot.name.includes('Marseille')) region = 'Marseille';
      }
    }
    
    if (!region) return chauffeurs;
    return chauffeurs.filter(c => c.region === region);
  };
  
  // Liste des camions et chauffeurs disponibles
  const camionsDisponibles = getCamionsDisponibles();
  const chauffeursDisponibles = getChauffeursDisponibles();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Création d'un Bon de Transport</h1>
          <p className="text-gray-600">Planifiez le transport de produits entre fournisseurs, entrepôts et boulangers</p>
        </div>
        <button
          onClick={() => navigate('/approvisionnement/bons-transport')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Annuler
        </button>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Type de transport */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de transport
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="fournisseur-entrepot"
                    name="type"
                    value="fournisseur-entrepot"
                    checked={formData.type === 'fournisseur-entrepot'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="fournisseur-entrepot" className="ml-2 text-sm text-gray-700">
                    Fournisseur → Entrepôt
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="entrepot-boulanger"
                    name="type"
                    value="entrepot-boulanger"
                    checked={formData.type === 'entrepot-boulanger'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="entrepot-boulanger" className="ml-2 text-sm text-gray-700">
                    Entrepôt → Boulanger
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="dateTransport" className="block text-sm font-medium text-gray-700 mb-1">
                Date de transport prévue
              </label>
              <input
                type="date"
                id="dateTransport"
                name="dateTransport"
                value={formData.dateTransport}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Source et destination */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Source et Destination</h2>
          
          {formData.type === 'fournisseur-entrepot' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fournisseur" className="block text-sm font-medium text-gray-700 mb-1">
                  Fournisseur (source)
                </label>
                <select
                  id="fournisseur"
                  name="fournisseur"
                  value={formData.fournisseur}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map(fournisseur => (
                    <option key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.name}
                    </option>
                  ))}
                </select>
                {formData.fournisseur && (
                  <p className="mt-1 text-sm text-gray-500">
                    {fournisseurs.find(f => f.id === parseInt(formData.fournisseur))?.address}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="entrepotDestination" className="block text-sm font-medium text-gray-700 mb-1">
                  Entrepôt (destination)
                </label>
                <select
                  id="entrepotDestination"
                  name="entrepotDestination"
                  value={formData.entrepotDestination}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Sélectionner un entrepôt</option>
                  {entrepots.map(entrepot => (
                    <option key={entrepot.id} value={entrepot.id}>
                      {entrepot.name}
                    </option>
                  ))}
                </select>
                {formData.entrepotDestination && (
                  <p className="mt-1 text-sm text-gray-500">
                    {entrepots.find(e => e.id === parseInt(formData.entrepotDestination))?.address}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="entrepotSource" className="block text-sm font-medium text-gray-700 mb-1">
                  Entrepôt (source)
                </label>
                <select
                  id="entrepotSource"
                  name="entrepotSource"
                  value={formData.entrepotSource}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Sélectionner un entrepôt</option>
                  {entrepots.map(entrepot => (
                    <option key={entrepot.id} value={entrepot.id}>
                      {entrepot.name}
                    </option>
                  ))}
                </select>
                {formData.entrepotSource && (
                  <p className="mt-1 text-sm text-gray-500">
                    {entrepots.find(e => e.id === parseInt(formData.entrepotSource))?.address}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="boulanger" className="block text-sm font-medium text-gray-700 mb-1">
                  Boulanger (destination)
                </label>
                <select
                  id="boulanger"
                  name="boulanger"
                  value={formData.boulanger}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Sélectionner un boulanger</option>
                  {boulangers.map(boulanger => (
                    <option key={boulanger.id} value={boulanger.id}>
                      {boulanger.name}
                    </option>
                  ))}
                </select>
                {formData.boulanger && (
                  <p className="mt-1 text-sm text-gray-500">
                    {boulangers.find(b => b.id === parseInt(formData.boulanger))?.address}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Produits */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Produits à transporter</h2>
            <button
              type="button"
              onClick={addProduct}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
            >
              + Ajouter un produit
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.produits.length > 0 ? (
              formData.produits.map((produit, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Produit #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor={`produit-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du produit
                      </label>
                      <select
                        id={`produit-${index}`}
                        value={produit.id}
                        onChange={(e) => {
                          const selectedProduct = catalogue.find(p => p.id === parseInt(e.target.value));
                          if (selectedProduct) {
                            handleProductChange(index, 'id', parseInt(e.target.value));
                            handleProductChange(index, 'name', selectedProduct.name);
                            handleProductChange(index, 'packaging', selectedProduct.packaging);
                            handleProductChange(index, 'unite', selectedProduct.packaging);
                          }
                        }}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Sélectionner un produit</option>
                        {catalogue.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.packaging})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor={`quantite-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité
                      </label>
                      <input
                        type="number"
                        id={`quantite-${index}`}
                        value={produit.quantite}
                        onChange={(e) => handleProductChange(index, 'quantite', parseInt(e.target.value))}
                        min="1"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`unite-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Unité
                      </label>
                      <input
                        type="text"
                        id={`unite-${index}`}
                        value={produit.unite}
                        onChange={(e) => handleProductChange(index, 'unite', e.target.value)}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 border border-dashed rounded-lg">
                <p>Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Transport */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informations de transport</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="camion" className="block text-sm font-medium text-gray-700 mb-1">
                Camion
              </label>
              <select
                id="camion"
                name="camion"
                value={formData.camion}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Sélectionner un camion</option>
                {camionsDisponibles.map(camion => (
                  <option key={camion.id} value={camion.id}>
                    {camion.name} - {camion.type} ({camion.capacity}) - {camion.location}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="chauffeur" className="block text-sm font-medium text-gray-700 mb-1">
                Chauffeur
              </label>
              <select
                id="chauffeur"
                name="chauffeur"
                value={formData.chauffeur}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Sélectionner un chauffeur</option>
                {chauffeursDisponibles.map(chauffeur => (
                  <option key={chauffeur.id} value={chauffeur.id}>
                    {chauffeur.name} ({chauffeur.region})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="commentaires" className="block text-sm font-medium text-gray-700 mb-1">
              Commentaires supplémentaires
            </label>
            <textarea
              id="commentaires"
              name="commentaires"
              value={formData.commentaires}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Instructions spéciales, informations de contact, etc."
            ></textarea>
          </div>
        </div>
        
        {/* Boutons de soumission */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/approvisionnement/bons-transport')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Créer bon de transport
          </button>
        </div>
      </form>
    </div>
  );
}
