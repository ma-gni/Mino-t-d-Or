/**
 * Dashboard.jsx (Maintenance)
 * --------------------------------------------------
 * Tableau de bord pour le service maintenance
 * 
 * Cette page présente une vue d'ensemble des activités de maintenance:
 * - Cuves à nettoyer
 * - État des camions
 * - Alertes de maintenance
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MaintenanceDashboard() {
  const { user } = useAuth();
  
  // État pour les statistiques
  const [stats] = useState([
    { title: 'Cuves à nettoyer', value: '5', icon: '🧹', color: 'bg-red-500' },
    { title: 'Camions en maintenance', value: '2', icon: '🔧', color: 'bg-yellow-500' },
    { title: 'Maintenances planifiées', value: '3', icon: '📅', color: 'bg-blue-500' },
    { title: 'Cuves nettoyées ce mois', value: '42', icon: '✓', color: 'bg-green-500' }
  ]);
  
  // État pour les cuves à nettoyer (données fictives)
  const [cuvesANettoyer] = useState([
    { 
      id: 'CUV-001', 
      nom: 'Cuve A1', 
      typeProduit: 'Farine T65',
      dernierNettoyage: '2025-03-25',
      dernierControle: '2025-04-15',
      priorite: 'Haute',
      location: 'Entrepôt Paris'
    },
    { 
      id: 'CUV-003', 
      nom: 'Cuve A3', 
      typeProduit: 'Farine T55',
      dernierNettoyage: '2025-03-28',
      dernierControle: '2025-04-15',
      priorite: 'Haute',
      location: 'Entrepôt Paris'
    },
    { 
      id: 'CUV-008', 
      nom: 'Cuve B2', 
      typeProduit: 'Farine Bio T80',
      dernierNettoyage: '2025-03-30',
      dernierControle: '2025-04-16',
      priorite: 'Moyenne',
      location: 'Entrepôt Lyon'
    },
    { 
      id: 'CUV-012', 
      nom: 'Cuve C1', 
      typeProduit: 'Farine Complète',
      dernierNettoyage: '2025-04-02',
      dernierControle: '2025-04-18',
      priorite: 'Basse',
      location: 'Entrepôt Marseille'
    },
    { 
      id: 'CUV-015', 
      nom: 'Cuve C4', 
      typeProduit: 'Farine T45',
      dernierNettoyage: '2025-04-05',
      dernierControle: '2025-04-20',
      priorite: 'Basse',
      location: 'Entrepôt Paris'
    }
  ]);
  
  // État pour les camions à maintenir
  const [camionsAMaintenir] = useState([
    { 
      id: 'CAM-001', 
      immatriculation: 'AB-123-CD',
      modele: 'Mercedes Sprinter',
      statut: 'En maintenance',
      dateMaintenance: '2025-04-20',
      typeMaintenance: 'Révision moteur',
      finPrevue: '2025-04-23'
    },
    { 
      id: 'CAM-003', 
      immatriculation: 'EF-456-GH',
      modele: 'Renault Master',
      statut: 'En maintenance',
      dateMaintenance: '2025-04-21',
      typeMaintenance: 'Changement filtres',
      finPrevue: '2025-04-22'
    },
    { 
      id: 'CAM-005', 
      immatriculation: 'IJ-789-KL',
      modele: 'Iveco Daily',
      statut: 'Maintenance planifiée',
      dateMaintenance: '2025-04-25',
      typeMaintenance: 'Contrôle technique',
      finPrevue: '2025-04-25'
    }
  ]);
  
  // Fonction pour récupérer la couleur de priorité
  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'Haute':
        return 'bg-red-100 text-red-800';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'Basse':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour récupérer la couleur du statut du camion
  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En maintenance':
        return 'bg-red-100 text-red-800';
      case 'Maintenance planifiée':
        return 'bg-yellow-100 text-yellow-800';
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  // Fonction pour calculer le nombre de jours depuis le dernier nettoyage
  const getDaysSinceLastCleaning = (dateString) => {
    const today = new Date();
    const lastCleaning = new Date(dateString);
    const diffTime = Math.abs(today - lastCleaning);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête du tableau de bord */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonjour, {user?.firstName}</h1>
          <p className="text-gray-600">Tableau de bord maintenance</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/maintenance/cuves" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Voir toutes les cuves
          </Link>
          <Link 
            to="/maintenance/camions" 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Gérer les camions
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow p-5 flex items-center space-x-4"
          >
            <div className={`${stat.color} h-12 w-12 rounded-full flex items-center justify-center text-2xl text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cuves à nettoyer */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Cuves à nettoyer</h2>
          <Link to="/maintenance/cuves" className="text-sm text-indigo-600 hover:text-indigo-800">
            Voir toutes les cuves →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Cuve
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de produit
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernier nettoyage
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jours écoulés
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cuvesANettoyer.map((cuve) => {
                const jours = getDaysSinceLastCleaning(cuve.dernierNettoyage);
                
                return (
                  <tr key={cuve.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {cuve.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cuve.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cuve.typeProduit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {formatDate(cuve.dernierNettoyage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        jours > 28 ? 'bg-red-100 text-red-800' :
                        jours > 21 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {jours} jours
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(cuve.priorite)}`}>
                        {cuve.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/maintenance/cuves/${cuve.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Détails
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Camions en maintenance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">État des camions</h2>
          <Link to="/maintenance/camions" className="text-sm text-indigo-600 hover:text-indigo-800">
            Voir tous les camions →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Immatriculation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modèle
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date maintenance
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin prévue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {camionsAMaintenir.map((camion) => (
                <tr key={camion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {camion.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {camion.immatriculation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {camion.modele}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatutColor(camion.statut)}`}>
                      {camion.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {formatDate(camion.dateMaintenance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    {formatDate(camion.finPrevue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/maintenance/camions/${camion.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Gérer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            to="/maintenance/cuves/nettoyage"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">🧹</span>
            <span className="text-sm font-medium">Enregistrer un nettoyage</span>
          </Link>
          <Link 
            to="/maintenance/camions/statut"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">🚚</span>
            <span className="text-sm font-medium">Mise à jour statut camion</span>
          </Link>
          <Link 
            to="/maintenance/planification"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-3xl mb-2">📅</span>
            <span className="text-sm font-medium">Planifier une maintenance</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
