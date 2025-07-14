/**
 * ImprimerQRCodes.jsx
 * --------------------------------------------------
 * Page d'impression des QR Codes pour les palettes
 * 
 * Cette page permet de :
 * - Générer des QR Codes pour chaque palette d'une commande
 * - Imprimer les QR Codes pour collage sur les palettes
 * - Visualiser un aperçu avant impression
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { deliveryService } from '../../services/api';

export default function ImprimerQRCodes() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const commandeId = searchParams.get('commande');
  
  const printSectionRef = useRef(null);
  
  // État pour la commande
  const [commande, setCommande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [palettes, setPalettes] = useState([]);
  const [error, setError] = useState(null);
  
  // Effet pour charger les données de la commande si un ID est spécifié
  useEffect(() => {
    if (commandeId) {
      fetchQRCodes();
    } else {
      setIsLoading(false);
      setError("Aucun identifiant de commande n'a été spécifié.");
    }
  }, [commandeId]);
  
  // Fonction pour récupérer les QR codes depuis l'API
  const fetchQRCodes = async () => {
    try {
      setIsLoading(true);
      // Utilisation du service API pour récupérer les QR codes
      const response = await deliveryService.generateQRCodes(commandeId);
      
      // Mise à jour des états avec les données reçues
      setCommande(response.data.order);
      setPalettes(response.data.palettes || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des QR codes:', err);
      setError("Impossible de récupérer les QR codes. Veuillez réessayer plus tard.");
      
      // En mode développement, utiliser des données fictives pour tester l'interface
      if (process.env.NODE_ENV === 'development') {
        const mockCommande = {
          id: commandeId,
          reference: 'REF-B1042',
          clientName: 'Boulangerie Dupont',
          createdAt: '2025-04-20',
          status: 'en_preparation',
          products: [
            { id: 'p1', name: 'Farine T65', quantity: 500, unit: 'kg' },
            { id: 'p2', name: 'Farine T45', quantity: 250, unit: 'kg' },
            { id: 'p3', name: 'Levure', quantity: 10, unit: 'kg' }
          ]
        };
        
        const mockPalettes = Array.from({ length: 5 }, (_, i) => ({
          id: `PAL-${commandeId}-${i + 1}`,
          reference: `PAL-${i + 1}`,
          products: [mockCommande.products[i % mockCommande.products.length]],
          weight: Math.floor(Math.random() * 500) + 200,
          qrCodeData: `https://minotor.fr/track/${commandeId}/palette/${i + 1}`
        }));
        
        setCommande(mockCommande);
        setPalettes(mockPalettes);
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour générer un QR Code factice (pour démonstration)
  const generateFakeQRCode = () => {
    return `data:image/png;base64,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`;
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Fonction pour imprimer les QR Codes
  const handlePrint = () => {
    const printContent = printSectionRef.current;
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print-' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=200,top=200,width=930,height=500');
    
    printWindow.document.write('<html><head><title>Impression QR Codes</title>');
    printWindow.document.write('<style type="text/css">');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; }
      .palette-card { 
        border: 1px solid #ddd; 
        padding: 1rem; 
        margin: 0.5rem; 
        page-break-inside: avoid; 
        width: 350px;
        float: left;
      }
      .qr-container { text-align: center; margin-bottom: 0.5rem; }
      .info-container { font-size: 12px; }
      .info-line { margin-bottom: 0.2rem; }
      .palette-reference { font-weight: bold; font-size: 16px; text-align: center; margin-bottom: 0.5rem; }
      @media print {
        body { margin: 0; padding: 0; }
        .print-header { display: none; }
        .no-print { display: none; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    
    // Attendre que le contenu soit chargé avant d'imprimer
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impression des QR Codes</h1>
          {commande && (
            <p className="text-gray-600">Commande: {commande.id}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Retour
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center space-x-2"
          >
            <span>🖨️</span>
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Section pour l'impression */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="print-header flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Aperçu avant impression</h2>
          {commande && (
            <div className="text-sm text-gray-600">
              {commande.nbPalettesTotal} palette{commande.nbPalettesTotal > 1 ? 's' : ''} à imprimer
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Chargement des données pour l'impression...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div ref={printSectionRef}>
            <div className="print-header mb-6 no-print">
              <h2 className="text-xl font-semibold text-center">
                QR Codes pour {commande ? `la commande ${commande.id}` : 'l\'impression'}
              </h2>
              {commande && (
                <p className="text-center text-gray-600 mb-4">
                  Client: {commande.client.nom} | Livraison: {formatDate(commande.dateLivraison)} {commande.heureLivraison}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap">
              {palettes.map((palette) => (
                <div key={palette.id} className="palette-card">
                  <div className="palette-reference">{palette.reference}</div>
                  <div className="qr-container">
                    <img 
                      src={palette.qrCode} 
                      alt={`QR Code palette ${palette.id}`}
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                  <div className="info-container">
                    <div className="info-line"><strong>Commande:</strong> {palette.commande}</div>
                    <div className="info-line"><strong>Client:</strong> {palette.client}</div>
                    <div className="info-line"><strong>Contenu:</strong> {palette.contenu}</div>
                    {commande && (
                      <div className="info-line"><strong>Livraison:</strong> {formatDate(commande.dateLivraison)}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {palettes.length === 0 && (
                <div className="w-full text-center py-12 text-gray-500">
                  {commandeId ? (
                    <p>Aucune palette trouvée pour cette commande.</p>
                  ) : (
                    <p>Sélectionnez une commande pour imprimer ses QR Codes.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow p-6 no-print">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>1.</strong> Vérifiez que tous les QR Codes sont bien visibles dans l'aperçu ci-dessus.
          </p>
          <p>
            <strong>2.</strong> Cliquez sur le bouton "Imprimer" pour lancer l'impression.
          </p>
          <p>
            <strong>3.</strong> Dans la fenêtre d'impression, assurez-vous que :
          </p>
          <ul className="list-disc pl-8 space-y-1">
            <li>L'orientation est en mode "Portrait"</li>
            <li>L'option "Ajuster à la page" est désactivée</li>
            <li>Les marges sont réduites au minimum</li>
          </ul>
          <p>
            <strong>4.</strong> Après impression, découpez soigneusement chaque QR Code et collez-le sur la palette correspondante.
          </p>
          <p>
            <strong>5.</strong> Assurez-vous que les QR Codes sont bien visibles et accessibles pour le scan.
          </p>
        </div>
      </div>
    </div>
  );
}
