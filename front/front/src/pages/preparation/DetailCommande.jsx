/**
 * DetailCommande.jsx (Préparation)
 * --------------------------------------------------
 * Page de détail d'une commande à préparer
 * 
 * Cette page permet de :
 * - Visualiser les produits à préparer
 * - Mettre à jour le statut de préparation
 * - Générer un bordereau de livraison avec QR Code
 * - Imprimer les QR Codes pour les palettes
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function DetailCommande() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // État pour la commande
  const [commande, setCommande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreparationComplete, setIsPreparationComplete] = useState(false);
  
  // État pour le suivi de préparation
  const [produitsPreparation, setProduitsPreparation] = useState([]);
  
  // Effet pour charger les données de la commande
  useEffect(() => {
    // Simulation de l'appel API
    const fetchCommande = () => {
      // Données fictives
      const mockCommande = {
        id: id,
        reference: 'REF-B1042',
        dateLivraison: '2025-04-22',
        heureLivraison: '09:00 - 11:00',
        client: {
          id: 1,
          nom: 'Boulangerie Durand',
          adresse: '12 Rue de la République, 75001 Paris',
          contact: 'Jean Durand',
          telephone: '01 23 45 67 89'
        },
        entrepot: {
          id: 1,
          nom: 'Entrepôt Paris',
          adresse: '123 Boulevard Périphérique, 75019 Paris',
        },
        status: 'En attente',
        dateCreation: '2025-04-18',
        produits: [
          {
            id: 1,
            produitId: 1,
            nom: 'Farine T65 Tradition',
            categorie: 'Farine',
            conditionnement: 'Sac 25kg',
            quantite: 50,
            palettes: 1,
            emplacement: 'A-12-3'
          },
          {
            id: 2,
            produitId: 2,
            nom: 'Farine T45 Pâtissière',
            categorie: 'Farine',
            conditionnement: 'Sac 10kg',
            quantite: 30,
            palettes: 1,
            emplacement: 'A-10-4'
          },
          {
            id: 3,
            produitId: 6,
            nom: 'Farine Seigle',
            categorie: 'Farine',
            conditionnement: 'Sac 25kg',
            quantite: 20,
            palettes: 1,
            emplacement: 'B-05-2'
          },
          {
            id: 4,
            produitId: 4,
            nom: 'Levain Déshydraté',
            categorie: 'Additifs',
            conditionnement: 'Sachet 1kg',
            quantite: 15,
            palettes: 0.5,
            emplacement: 'C-02-1'
          },
          {
            id: 5,
            produitId: 8,
            nom: 'Gluten Vital',
            categorie: 'Additifs',
            conditionnement: 'Sachet 5kg',
            quantite: 10,
            palettes: 0.5,
            emplacement: 'C-03-2'
          }
        ],
        commentaires: 'Livraison à déposer à l\'arrière du bâtiment.',
        nbPalettesTotal: 4,
        poids: 2450
      };
      
      setCommande(mockCommande);
      
      // Initialiser l'état de préparation des produits
      const produitsInit = mockCommande.produits.map(produit => ({
        ...produit,
        prepared: false
      }));
      setProduitsPreparation(produitsInit);
      
      setIsLoading(false);
    };
    
    setTimeout(fetchCommande, 500); // Simuler un délai d'API
  }, [id]);
  
  // Effet pour vérifier si tous les produits sont préparés
  useEffect(() => {
    if (produitsPreparation.length > 0) {
      const allPrepared = produitsPreparation.every(p => p.prepared);
      setIsPreparationComplete(allPrepared);
    }
  }, [produitsPreparation]);
  
  // Fonction pour mettre à jour l'état de préparation d'un produit
  const handleProductPreparationToggle = (index) => {
    const updatedProduits = [...produitsPreparation];
    updatedProduits[index].prepared = !updatedProduits[index].prepared;
    setProduitsPreparation(updatedProduits);
  };
  
  // Fonction pour mettre à jour le statut de la commande
  const updateStatus = (newStatus) => {
    if (newStatus === 'Prête pour expédition' && !isPreparationComplete) {
      if (!window.confirm('Tous les produits ne sont pas encore préparés. Êtes-vous sûr de vouloir marquer la commande comme prête pour expédition ?')) {
        return;
      }
    }
    
    setCommande({
      ...commande,
      status: newStatus
    });
    
    // Simulation d'une requête API
    console.log(`Commande ${id} mise à jour avec le statut : ${newStatus}`);
  };
  
  // Fonction pour générer le bordereau de livraison
  const generateBordereau = () => {
    // Dans une vraie application, on appellerait une API pour générer le PDF
    alert('Bordereau de livraison généré avec succès !');
    // On pourrait ensuite ouvrir le PDF dans un nouvel onglet
  };
  
  // Fonction pour imprimer les QR Codes pour les palettes
  const printQRCodes = () => {
    // Dans une vraie application, on appellerait une API pour générer les QR Codes
    // puis on ouvrirait la fenêtre d'impression
    alert('QR Codes générés et prêts pour impression !');
    navigate(`/preparation/imprimer?commande=${id}`);
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Fonction pour générer un QR Code factice (pour démonstration)
  const generateFakeQRCode = () => {
    return `data:image/png;base64,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`;
  };

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
          onClick={() => navigate('/preparation/commandes')}
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
          <h1 className="text-2xl font-bold text-gray-900">Préparation de Commande</h1>
          <p className="text-gray-600">Référence: {commande.id}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/preparation/commandes')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Retour
          </button>
        </div>
      </div>

      {/* Détails de la commande et actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Informations commande */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Détails de la commande</h2>
            <span className={`px-3 py-1 text-sm rounded-full ${
              commande.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
              commande.status === 'En préparation' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {commande.status}
            </span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">Client</h3>
                <p className="text-gray-700 font-medium">{commande.client.nom}</p>
                <p className="text-gray-600">{commande.client.adresse}</p>
                <p className="text-gray-600">Contact: {commande.client.contact}</p>
                <p className="text-gray-600">Téléphone: {commande.client.telephone}</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">Entrepôt</h3>
                <p className="text-gray-700 font-medium">{commande.entrepot.nom}</p>
                <p className="text-gray-600">{commande.entrepot.adresse}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-sm text-gray-500">Date de livraison</p>
                <p className="text-gray-700">{formatDate(commande.dateLivraison)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Heure de livraison</p>
                <p className="text-gray-700">{commande.heureLivraison}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Poids total</p>
                <p className="text-gray-700">{commande.poids} kg</p>
              </div>
            </div>
            
            {commande.commentaires && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">Commentaires:</p>
                <p className="text-gray-600">{commande.commentaires}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* QR Code et actions */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
          
          {/* QR Code */}
          <div className="flex flex-col items-center space-y-3 p-3 border border-gray-200 rounded-lg">
            <img 
              src={generateFakeQRCode()} 
              alt="QR Code de la commande"
              className="w-32 h-32"
            />
            <p className="text-xs text-gray-500">Commande #{commande.id}</p>
          </div>
          
          {/* Boutons d'action */}
          <div className="space-y-3 mt-4">
            <button
              onClick={generateBordereau}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
            >
              <span>📄</span>
              <span>Générer le bordereau</span>
            </button>
            
            <button
              onClick={printQRCodes}
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition flex items-center justify-center space-x-2"
            >
              <span>🖨️</span>
              <span>Imprimer QR Codes</span>
            </button>
            
            {commande.status === 'En attente' && (
              <button
                onClick={() => updateStatus('En préparation')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Commencer la préparation
              </button>
            )}
            
            {commande.status === 'En préparation' && (
              <button
                onClick={() => updateStatus('Prête pour expédition')}
                className={`w-full px-4 py-2 rounded-md transition ${
                  isPreparationComplete 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Marquer comme prête
              </button>
            )}
            
            {commande.status === 'Prête pour expédition' && (
              <div className="p-3 bg-green-50 text-green-700 rounded-md text-center">
                Commande prête pour expédition
              </div>
            )}
          </div>
          
          {/* Informations palettes */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Informations palettes:</h3>
            <p className="text-gray-600">Nombre de palettes: {commande.nbPalettesTotal}</p>
          </div>
        </div>
      </div>

      {/* Liste des produits à préparer */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Produits à préparer</h2>
          <div className="text-sm text-gray-600">
            {produitsPreparation.filter(p => p.prepared).length} / {produitsPreparation.length} préparés
          </div>
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Palettes
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emplacement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  État
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {produitsPreparation.map((produit, index) => (
                <tr key={produit.id} className={`hover:bg-gray-50 ${produit.prepared ? 'bg-green-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{produit.nom}</div>
                    <div className="text-sm text-gray-500">{produit.categorie}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {produit.conditionnement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                    {produit.quantite}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {produit.palettes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    {produit.emplacement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {commande.status === 'En préparation' ? (
                      <button
                        onClick={() => handleProductPreparationToggle(index)}
                        className={`px-4 py-1 rounded-md transition ${
                          produit.prepared
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {produit.prepared ? 'Préparé ✓' : 'À préparer'}
                      </button>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        produit.prepared ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {produit.prepared ? 'Préparé' : 'À préparer'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
