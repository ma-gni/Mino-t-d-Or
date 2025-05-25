/**
 * PageAnalytics.jsx (Admin)
 * --------------------------------------------------
 * Page d'analyse détaillée pour une page spécifique
 * 
 * Cette page permet de :
 * - Visualiser les statistiques détaillées d'une page spécifique
 * - Analyser les comportements utilisateur sur cette page
 * - Voir l'évolution des visites dans le temps
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { EvolutionVisitesChart, StatCard, SourcesTraficChart } from '../../components/admin/AnalyticsCharts';

export default function PageAnalytics() {
  const { pageUrl } = useParams();
  const navigate = useNavigate();
  const decodedPageUrl = decodeURIComponent(pageUrl || '');
  
  // État pour les filtres de période
  const [periode, setPeriode] = useState('7j');
  
  // État pour les données de la page
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Effet pour charger les données de la page
  useEffect(() => {
    // Dans une application réelle, on chargerait les données depuis une API
    // en fonction de l'URL de la page et de la période sélectionnée
    
    // Simulation d'un appel API
    const fetchPageData = () => {
      setIsLoading(true);
      
      // Données fictives pour la démonstration
      setTimeout(() => {
        const data = {
          url: decodedPageUrl,
          titre: getTitrePage(decodedPageUrl),
          statistiques: {
            vuesTotal: 256,
            visiteursUniques: 128,
            dureeVisiteMoyenne: '00:03:24',
            tauxRebond: '18%',
            tauxConversion: '4.2%'
          },
          evolution: [
            { date: '15/04', visiteurs: 15, pageVues: 22 },
            { date: '16/04', visiteurs: 18, pageVues: 25 },
            { date: '17/04', visiteurs: 12, pageVues: 18 },
            { date: '18/04', visiteurs: 21, pageVues: 30 },
            { date: '19/04', visiteurs: 24, pageVues: 35 },
            { date: '20/04', visiteurs: 16, pageVues: 24 },
            { date: '21/04', visiteurs: 18, pageVues: 28 },
            { date: '22/04', visiteurs: 22, pageVues: 32 }
          ],
          sourcesTrafic: [
            { name: 'Direct', value: 105 },
            { name: 'Navigation interne', value: 92 },
            { name: 'Recherche', value: 42 },
            { name: 'Lien externe', value: 17 }
          ],
          appareils: {
            desktop: 68,
            mobile: 28,
            tablet: 4
          },
          evenements: [
            { id: 1, type: 'Clic', element: 'Bouton Soumettre', compte: 45 },
            { id: 2, type: 'Clic', element: 'Lien En savoir plus', compte: 23 },
            { id: 3, type: 'Formulaire', element: 'Soumission', compte: 18 },
            { id: 4, type: 'Clic', element: 'Onglet Détails', compte: 37 }
          ],
          utilisateurs: [
            { role: 'Boulanger', compte: 75 },
            { role: 'Commercial', compte: 65 },
            { role: 'Approvisionnement', compte: 42 },
            { role: 'Préparation', compte: 28 },
            { role: 'Maintenance', compte: 10 }
          ]
        };
        
        setPageData(data);
        setIsLoading(false);
      }, 800);
    };
    
    if (decodedPageUrl) {
      fetchPageData();
    }
  }, [decodedPageUrl, periode]);
  
  // Fonction pour obtenir un titre lisible à partir de l'URL
  const getTitrePage = (url) => {
    // Extraire le nom de la page à partir de l'URL
    const segments = url.split('/').filter(Boolean);
    
    if (segments.length === 0) {
      return 'Page d\'accueil';
    }
    
    const lastSegment = segments[segments.length - 1];
    
    // Convertir en titre lisible (remplacer les tirets/underscore par des espaces, capitaliser)
    const titre = lastSegment
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    if (segments.length > 1) {
      const parentSegment = segments[segments.length - 2]
        .replace(/-/g, ' ')
        .replace(/_/g, ' ');
      
      return `${titre} (${parentSegment})`;
    }
    
    return titre;
  };
  
  // Fonction pour changer la période
  const handlePeriodeChange = (e) => {
    setPeriode(e.target.value);
  };
  
  // Si la page est en cours de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Chargement des données d'analytics...</p>
      </div>
    );
  }
  
  // Si aucune page n'est spécifiée ou si les données n'ont pas été trouvées
  if (!pageData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Page non trouvée</h2>
        <p className="text-gray-600 mb-4">Les données d'analytics pour cette page n'ont pas pu être récupérées.</p>
        <button
          onClick={() => navigate('/admin/analytics')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Retour aux analytics
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics de page</h1>
          <p className="text-gray-600">{pageData.titre}</p>
          <p className="text-sm text-indigo-600">{pageData.url}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="periode" className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <select
              id="periode"
              name="periode"
              value={periode}
              onChange={handlePeriodeChange}
              className="rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7j">7 derniers jours</option>
              <option value="30j">30 derniers jours</option>
              <option value="90j">90 derniers jours</option>
              <option value="annee">Année en cours</option>
            </select>
          </div>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Retour aux analytics
          </button>
        </div>
      </div>

      {/* Statistiques clés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Vues totales" 
          value={pageData.statistiques.vuesTotal} 
          icon="👁️" 
          trend={true}
          trendValue={12}
        />
        <StatCard 
          title="Visiteurs uniques" 
          value={pageData.statistiques.visiteursUniques} 
          icon="👤" 
          trend={true}
          trendValue={8}
        />
        <StatCard 
          title="Durée moyenne" 
          value={pageData.statistiques.dureeVisiteMoyenne} 
          icon="⏱️" 
          trend={true}
          trendValue={-3}
        />
        <StatCard 
          title="Taux de rebond" 
          value={pageData.statistiques.tauxRebond} 
          icon="↩️" 
          trend={true}
          trendValue={-5}
        />
        <StatCard 
          title="Taux de conversion" 
          value={pageData.statistiques.tauxConversion} 
          icon="🎯" 
          trend={true}
          trendValue={15}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des visites */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Évolution des visites</h2>
          <div className="h-64">
            <EvolutionVisitesChart data={pageData.evolution} />
          </div>
        </div>
        
        {/* Sources de trafic */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sources de trafic</h2>
          <div className="h-64">
            <SourcesTraficChart data={pageData.sourcesTrafic} />
          </div>
        </div>
      </div>
      
      {/* Répartition par appareil */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Répartition par appareil</h2>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="relative pt-1">
              <div className="flex h-6 overflow-hidden text-xs rounded-lg">
                <div
                  style={{ width: `${pageData.appareils.desktop}%` }}
                  className="flex flex-col justify-center text-center text-white bg-blue-500 shadow-none whitespace-nowrap"
                >
                  Desktop
                </div>
                <div
                  style={{ width: `${pageData.appareils.mobile}%` }}
                  className="flex flex-col justify-center text-center text-white bg-green-500 shadow-none whitespace-nowrap"
                >
                  Mobile
                </div>
                <div
                  style={{ width: `${pageData.appareils.tablet}%` }}
                  className="flex flex-col justify-center text-center text-white bg-yellow-500 shadow-none whitespace-nowrap"
                >
                  Tablette
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="text-sm">
                <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-sm"></span>
                Desktop: {pageData.appareils.desktop}%
              </div>
              <div className="text-sm">
                <span className="inline-block w-3 h-3 mr-1 bg-green-500 rounded-sm"></span>
                Mobile: {pageData.appareils.mobile}%
              </div>
              <div className="text-sm">
                <span className="inline-block w-3 h-3 mr-1 bg-yellow-500 rounded-sm"></span>
                Tablette: {pageData.appareils.tablet}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Événements et interactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Événements et interactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type d'événement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Élément
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % des visites
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageData.evenements.map((evt) => (
                <tr key={evt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {evt.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {evt.element}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    {evt.compte}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {((evt.compte / pageData.statistiques.vuesTotal) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Répartition par rôle utilisateur */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Répartition par rôle utilisateur</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de visites
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proportion
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageData.utilisateurs.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    {user.compte}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {((user.compte / pageData.statistiques.vuesTotal) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Conseil d'optimisation */}
      <div className="bg-blue-50 rounded-lg p-6 text-sm text-blue-700">
        <h3 className="font-medium text-lg mb-2">Recommandations d'optimisation</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Le taux de rebond de cette page (18%) est inférieur à la moyenne du site (23%), ce qui est positif.</li>
          <li>La durée moyenne de visite est de 3 minutes 24 secondes, ce qui indique un bon engagement.</li>
          <li>28% des visites proviennent d'appareils mobiles. Vérifiez l'expérience mobile pour l'optimiser.</li>
          <li>Considérez d'ajouter plus d'appels à l'action clairs, car le taux de conversion pourrait être amélioré.</li>
          <li>Cette page est particulièrement populaire parmi les boulangers et les commerciaux.</li>
        </ul>
      </div>
    </div>
  );
}
