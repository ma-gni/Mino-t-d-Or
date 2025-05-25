/**
 * GestionCamions.jsx (Maintenance)
 * --------------------------------------------------
 * Page de gestion des camions
 * 
 * Cette page permet de :
 * - Visualiser tous les camions et leur statut
 * - Marquer un camion comme "en maintenance"
 * - Marquer un camion comme "disponible" après maintenance
 * - Planifier des maintenances futures
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GestionCamions() {
  // État pour les filtres
  const [filters, setFilters] = useState({
    statut: 'all',
    recherche: ''
  });
  
  // État pour les camions (données fictives)
  const [camions, setCamions] = useState([
    { 
      id: 'CAM-001', 
      immatriculation: 'AB-123-CD', 
      modele: 'Mercedes Sprinter',
      annee: 2023,
      capacite: '3.5 tonnes',
      kilometrage: 35000,
      statut: 'En maintenance',
      dateMaintenance: '2025-04-20',
      typeMaintenance: 'Révision moteur',
      finPrevue: '2025-04-23',
      responsable: 'Jacques Martin',
      base: 'Paris'
    },
    { 
      id: 'CAM-002', 
      immatriculation: 'EF-456-GH', 
      modele: 'Renault Master',
      annee: 2022,
      capacite: '3 tonnes',
      kilometrage: 52000,
      statut: 'Disponible',
      derniereMaintenance: '2025-03-15',
      prochaineMaintenance: '2025-06-15',
      responsable: 'Paul Dubois',
      base: 'Paris'
    },
    { 
      id: 'CAM-003', 
      immatriculation: 'IJ-789-KL', 
      modele: 'Renault Master',
      annee: 2024,
      capacite: '3 tonnes',
      kilometrage: 12000,
      statut: 'En maintenance',
      dateMaintenance: '2025-04-21',
      typeMaintenance: 'Changement filtres',
      finPrevue: '2025-04-22',
      responsable: 'Philippe Legrand',
      base: 'Paris'
    },
    { 
      id: 'CAM-004', 
      immatriculation: 'MN-012-OP', 
      modele: 'Iveco Daily',
      annee: 2023,
      capacite: '5 tonnes',
      kilometrage: 28000,
      statut: 'Disponible',
      derniereMaintenance: '2025-04-10',
      prochaineMaintenance: '2025-07-10',
      responsable: 'Sophie Martin',
      base: 'Lyon'
    },
    { 
      id: 'CAM-005', 
      immatriculation: 'QR-345-ST', 
      modele: 'Iveco Daily',
      annee: 2022,
      capacite: '5 tonnes',
      kilometrage: 45000,
      statut: 'Maintenance planifiée',
      dateMaintenance: '2025-04-25',
      typeMaintenance: 'Contrôle technique',
      finPrevue: '2025-04-25',
      responsable: 'Sophie Martin',
      base: 'Lyon'
    },
    { 
      id: 'CAM-006', 
      immatriculation: 'UV-678-WX', 
      modele: 'Mercedes Atego',
      annee: 2021,
      capacite: '7.5 tonnes',
      kilometrage: 68000,
      statut: 'Disponible',
      derniereMaintenance: '2025-03-28',
      prochaineMaintenance: '2025-05-28',
      responsable: 'Pierre Durand',
      base: 'Marseille'
    },
    { 
      id: 'CAM-007', 
      immatriculation: 'YZ-901-AB', 
      modele: 'Mercedes Atego',
      annee: 2024,
      capacite: '7.5 tonnes',
      kilometrage: 15000,
      statut: 'Disponible',
      derniereMaintenance: '2025-04-05',
      prochaineMaintenance: '2025-07-05',
      responsable: 'Pierre Durand',
      base: 'Marseille'
    }
  ]);
  
  // Fonction pour mettre à jour les filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  
  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      statut: 'all',
      recherche: ''
    });
  };
  
  // Fonction pour filtrer les camions
  const filteredCamions = camions.filter(camion => {
    // Filtre par statut
    if (filters.statut !== 'all' && camion.statut !== filters.statut) {
      return false;
    }
    
    // Filtre par recherche
    if (
      filters.recherche && 
      !camion.immatriculation.toLowerCase().includes(filters.recherche.toLowerCase()) &&
      !camion.id.toLowerCase().includes(filters.recherche.toLowerCase()) &&
      !camion.modele.toLowerCase().includes(filters.recherche.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Fonction pour récupérer la couleur du statut
  const getStatusColor = (statut) => {
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
  
  // Fonction pour mettre à jour le statut d'un camion
  const updateCamionStatus = (id, newStatus) => {
    // Confirmer l'action
    if (!window.confirm(`Êtes-vous sûr de vouloir marquer ce camion comme "${newStatus}" ?`)) {
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Mise à jour du statut
    const updatedCamions = camions.map(camion => {
      if (camion.id === id) {
        if (newStatus === 'Disponible') {
          return {
            ...camion,
            statut: newStatus,
            derniereMaintenance: today,
            prochaineMaintenance: calculateNextMaintenanceDate(today),
            dateMaintenance: null,
            typeMaintenance: null,
            finPrevue: null
          };
        } else if (newStatus === 'En maintenance') {
          return {
            ...camion,
            statut: newStatus,
            dateMaintenance: today,
            finPrevue: calculateMaintenanceEndDate(today)
          };
        }
      }
      return camion;
    });
    
    setCamions(updatedCamions);
  };
  
  // Fonction pour calculer la date de fin de maintenance (par défaut aujourd'hui + 3 jours)
  const calculateMaintenanceEndDate = (date) => {
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 3);
    return endDate.toISOString().split('T')[0];
  };
  
  // Fonction pour calculer la date de prochaine maintenance (par défaut aujourd'hui + 3 mois)
  const calculateNextMaintenanceDate = (date) => {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 3);
    return nextDate.toISOString().split('T')[0];
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Camions</h1>
          <p className="text-gray-600">Suivez et gérez l'état de maintenance de la flotte de camions</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/maintenance/camions/planification"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Planifier une maintenance
          </Link>
          <Link 
            to="/maintenance/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="statut"
              name="statut"
              value={filters.statut}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="Disponible">Disponible</option>
              <option value="En maintenance">En maintenance</option>
              <option value="Maintenance planifiée">Maintenance planifiée</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="recherche" className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <div className="relative">
              <input
                type="text"
                id="recherche"
                name="recherche"
                value={filters.recherche}
                onChange={handleFilterChange}
                placeholder="Rechercher par immatriculation, ID ou modèle..."
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {filters.recherche && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, recherche: '' }))}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Tableau des camions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Liste des camions</h2>
          <span className="text-sm text-gray-600">{filteredCamions.length} camions trouvés</span>
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
                  Kilométrage
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière/Actuelle
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prochaine
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCamions.length > 0 ? (
                filteredCamions.map((camion) => (
                  <tr key={camion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {camion.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {camion.immatriculation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {camion.modele} ({camion.annee})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {camion.kilometrage.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(camion.statut)}`}>
                        {camion.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {camion.statut === 'Disponible' ? (
                        formatDate(camion.derniereMaintenance)
                      ) : (
                        <div>
                          <div>{formatDate(camion.dateMaintenance)}</div>
                          <div className="text-xs">{camion.typeMaintenance}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {camion.statut === 'Disponible' ? (
                        formatDate(camion.prochaineMaintenance)
                      ) : (
                        <div>Fin prévue: {formatDate(camion.finPrevue)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link to={`/maintenance/camions/${camion.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Détails
                        </Link>
                        {camion.statut === 'Disponible' && (
                          <button 
                            onClick={() => updateCamionStatus(camion.id, 'En maintenance')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Mettre en maintenance
                          </button>
                        )}
                        {camion.statut === 'En maintenance' && (
                          <button 
                            onClick={() => updateCamionStatus(camion.id, 'Disponible')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Marquer disponible
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                    Aucun camion ne correspond aux critères de recherche.
                    <br />
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-indigo-600 hover:text-indigo-900"
                    >
                      Réinitialiser les filtres
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé des statuts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé de la flotte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-green-800">Disponibles</h3>
                <p className="text-2xl font-semibold text-green-900">
                  {camions.filter(c => c.statut === 'Disponible').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">En maintenance</h3>
                <p className="text-2xl font-semibold text-red-900">
                  {camions.filter(c => c.statut === 'En maintenance').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-yellow-800">Planifiées</h3>
                <p className="text-2xl font-semibold text-yellow-900">
                  {camions.filter(c => c.statut === 'Maintenance planifiée').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Aide mémoire */}
      <div className="bg-indigo-50 rounded-lg p-6 text-sm text-indigo-700">
        <h3 className="font-medium text-lg mb-2">Procédure de mise à jour du statut</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">Mise en maintenance:</h4>
            <p>Lorsqu'un camion est mis en maintenance, il devient indisponible pour les livraisons et transferts.</p>
          </div>
          <div>
            <h4 className="font-medium">Retour à disponible:</h4>
            <p>Avant de marquer un camion comme disponible, assurez-vous que:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Toutes les réparations sont terminées</li>
              <li>Les tests de sécurité ont été effectués</li>
              <li>Les documents de maintenance sont complétés</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Maintenance planifiée:</h4>
            <p>Utilisez cette option pour prévoir une maintenance future sans immobiliser le camion immédiatement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
