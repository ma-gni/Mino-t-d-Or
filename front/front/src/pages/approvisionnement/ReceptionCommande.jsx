/**
 * ReceptionCommande.jsx (Approvisionnement)
 * --------------------------------------------------
 * Page de réception des commandes fournisseur
 * 
 * Cette page permet au service approvisionnement de :
 * - Visualiser les commandes en attente de réception
 * - Réceptionner une commande complète
 * - Gérer les livraisons partielles
 * - Mettre à jour les stocks automatiquement
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ReceptionCommande() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États pour la commande et les produits
  const [commande, setCommande] = useState(null);
  const [produits, setProduits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentaires, setCommentaires] = useState('');
  const [isPartial, setIsPartial] = useState(false);
  
  // Simulation de récupération des données
  useEffect(() => {
    // Dans une application réelle, ces données proviendraient d'une API
    const mockCommande = {
      id: 'CMD-2025-058',
      reference: 'REF-F1042',
      datePrevue: '2025-04-23',
      fournisseur: {
        id: 1,
        nom: 'Grands Moulins de Paris',
        adresse: '99 Rue Mirabeau, 94200 Ivry-sur-Seine',
        contact: 'Pierre Dupont',
        telephone: '01 23 45 67 89'
      },
      entrepot: {
        id: 1,
        nom: 'Entrepôt Paris',
        adresse: '123 Boulevard Périphérique, 75019 Paris',
      },
      status: 'En transit',
      commentaireCommande: 'Livraison express demandée',
      dateCreation: '2025-04-18'
    };
    
    const mockProduits = [
      {
        id: 1,
        produitId: 1,
        nom: 'Farine T65 Tradition',
        categorie: 'Farine',
        conditionnement: 'Sac 25kg',
        quantiteCommandee: 50,
        quantiteRecue: 0,
        prixUnitaire: 38.50
      },
      {
        id: 2,
        produitId: 2,
        nom: 'Farine T45 Pâtissière',
        categorie: 'Farine',
        conditionnement: 'Sac 10kg',
        quantiteCommandee: 30,
        quantiteRecue: 0,
        prixUnitaire: 21.20
      },
      {
        id: 3,
        produitId: 6,
        nom: 'Farine Seigle',
        categorie: 'Farine',
        conditionnement: 'Sac 25kg',
        quantiteCommandee: 20,
        quantiteRecue: 0,
        prixUnitaire: 44.80
      },
      {
        id: 4,
        produitId: 4,
        nom: 'Levain Déshydraté',
        categorie: 'Additifs',
        conditionnement: 'Sachet 1kg',
        quantiteCommandee: 15,
        quantiteRecue: 0,
        prixUnitaire: 17.90
      },
      {
        id: 5,
        produitId: 8,
        nom: 'Gluten Vital',
        categorie: 'Additifs',
        conditionnement: 'Sachet 5kg',
        quantiteCommandee: 10,
        quantiteRecue: 0,
        prixUnitaire: 29.50
      }
    ];
    
    setCommande(mockCommande);
    setProduits(mockProduits);
    setIsLoading(false);
  }, [id]);
  
  // Gestion des changements de quantité reçue
  const handleQuantityChange = (index, value) => {
    const newValue = parseInt(value, 10) || 0;
    const updatedProduits = [...produits];
    const produit = updatedProduits[index];
    
    // Limite la quantité reçue à la quantité commandée maximum
    const quantiteRecue = Math.min(newValue, produit.quantiteCommandee);
    
    updatedProduits[index] = {
      ...produit,
      quantiteRecue: quantiteRecue
    };
    
    // Si une des quantités est différente de la quantité commandée, c'est une livraison partielle
    const hasPartialItem = updatedProduits.some(p => p.quantiteRecue !== p.quantiteCommandee);
    setIsPartial(hasPartialItem);
    
    setProduits(updatedProduits);
  };
  
  // Fonction pour remplir toutes les quantités
  const fillAllQuantities = () => {
    const updatedProduits = produits.map(produit => ({
      ...produit,
      quantiteRecue: produit.quantiteCommandee
    }));
    setProduits(updatedProduits);
    setIsPartial(false);
  };
  
  // Fonction pour vider toutes les quantités
  const clearAllQuantities = () => {
    const updatedProduits = produits.map(produit => ({
      ...produit,
      quantiteRecue: 0
    }));
    setProduits(updatedProduits);
    setIsPartial(true);
  };
  
  // Fonction pour valider la réception
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier que des produits ont été reçus
    const totalRecu = produits.reduce((sum, produit) => sum + produit.quantiteRecue, 0);
    if (totalRecu === 0) {
      alert('Aucun produit n\'a été réceptionné. Veuillez saisir les quantités reçues.');
      return;
    }
    
    // Préparer les données pour l'envoi
    const receptionData = {
      commandeId: commande.id,
      dateReception: new Date().toISOString(),
      estPartielle: isPartial,
      commentaires: commentaires,
      produits: produits.map(produit => ({
        produitId: produit.produitId,
        quantiteRecue: produit.quantiteRecue
      }))
    };
    
    // Simulation d'envoi des données
    console.log('Données de réception:', receptionData);
    
    // Simulation de réussite
    const message = isPartial 
      ? 'Réception partielle enregistrée avec succès. Les stocks ont été mis à jour.'
      : 'Réception complète enregistrée avec succès. Les stocks ont été mis à jour.';
    
    alert(message);
    navigate('/approvisionnement/reception-commandes');
  };
  
  // Calculer les totaux
  const calculerTotaux = () => {
    const totalCommande = produits.reduce((sum, produit) => {
      return sum + (produit.quantiteCommandee * produit.prixUnitaire);
    }, 0);
    
    const totalRecu = produits.reduce((sum, produit) => {
      return sum + (produit.quantiteRecue * produit.prixUnitaire);
    }, 0);
    
    return {
      totalCommande: totalCommande.toFixed(2),
      totalRecu: totalRecu.toFixed(2)
    };
  };
  
  const { totalCommande, totalRecu } = calculerTotaux();
  
  // État de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Chargement des données de la commande...</p>
      </div>
    );
  }
  
  // Si la commande n'est pas trouvée
  if (!commande) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Commande non trouvée</h2>
        <p className="text-gray-600 mb-4">La commande que vous recherchez n'existe pas ou a été supprimée.</p>
        <button
          onClick={() => navigate('/approvisionnement/reception-commandes')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Réception de Commande</h1>
          <p className="text-gray-600">Référence: {commande.id}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/approvisionnement/reception-commandes')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Annuler
          </button>
        </div>
      </div>

      {/* Informations sur la commande */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Détails de la commande</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Fournisseur</h3>
              <p className="text-gray-700 font-medium">{commande.fournisseur.nom}</p>
              <p className="text-gray-600">{commande.fournisseur.adresse}</p>
              <p className="text-gray-600">Contact: {commande.fournisseur.contact}</p>
              <p className="text-gray-600">Téléphone: {commande.fournisseur.telephone}</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">Entrepôt de livraison</h3>
              <p className="text-gray-700 font-medium">{commande.entrepot.nom}</p>
              <p className="text-gray-600">{commande.entrepot.adresse}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-sm text-gray-500">Date de commande</p>
              <p className="text-gray-700">{new Date(commande.dateCreation).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de livraison prévue</p>
              <p className="text-gray-700">{new Date(commande.datePrevue).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p className="px-2 py-1 inline-flex text-xs rounded-full bg-blue-100 text-blue-800">
                {commande.status}
              </p>
            </div>
          </div>
          
          {commande.commentaireCommande && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Commentaire sur la commande:</p>
              <p className="text-gray-600">{commande.commentaireCommande}</p>
            </div>
          )}
        </div>
      </div>

      {/* Formulaire de réception */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Actions rapides */}
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            {isPartial ? (
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                Réception partielle
              </span>
            ) : (
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                Réception complète
              </span>
            )}
          </div>
          <div className="space-x-3">
            <button
              type="button"
              onClick={fillAllQuantities}
              className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition"
            >
              Tout réceptionner
            </button>
            <button
              type="button"
              onClick={clearAllQuantities}
              className="px-4 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Articles à réceptionner</h2>
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
                    Quantité commandée
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité reçue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produits.map((produit, index) => {
                  const isComplete = produit.quantiteRecue === produit.quantiteCommandee;
                  const isPartialItem = produit.quantiteRecue > 0 && produit.quantiteRecue < produit.quantiteCommandee;
                  
                  return (
                    <tr key={produit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                        <div className="text-sm text-gray-500">{produit.categorie}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        {produit.conditionnement}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        {produit.quantiteCommandee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="0"
                            max={produit.quantiteCommandee}
                            value={produit.quantiteRecue}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            className={`w-20 text-center py-1 px-2 border rounded-md 
                              ${isComplete ? 'border-green-300 bg-green-50' : 
                                isPartialItem ? 'border-yellow-300 bg-yellow-50' : 
                                'border-gray-300'}`}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {produit.prixUnitaire.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {(produit.quantiteRecue * produit.prixUnitaire).toFixed(2)} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-sm text-right font-medium text-gray-700">
                    Total commande:
                  </td>
                  <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">
                    {totalCommande} €
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-sm text-right font-medium text-gray-700">
                    Total réceptionné:
                  </td>
                  <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-bold">
                    {totalRecu} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Commentaires */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Commentaires sur la réception</h2>
          <textarea
            value={commentaires}
            onChange={(e) => setCommentaires(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Commentaires sur l'état de la livraison, problèmes rencontrés, etc."
          ></textarea>
        </div>

        {/* Boutons de soumission */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/approvisionnement/reception-commandes')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Valider la réception
          </button>
        </div>
      </form>
    </div>
  );
}
