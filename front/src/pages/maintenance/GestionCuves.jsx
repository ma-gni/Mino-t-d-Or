/**
 * GestionCuves.jsx (Maintenance)
 * --------------------------------------------------
 * Page de gestion des cuves
 * 
 * Cette page permet de :
 * - Visualiser toutes les cuves avec leur statut de maintenance
 * - Filtrer les cuves par état, location, ou priorité
 * - Accéder aux détails d'une cuve spécifique
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GestionCuves() {
  // État pour les filtres
  const [filters, setFilters] = useState({
    location: 'all',
    statut: 'all',
    priorite: 'all',
    recherche: ''
  });
  
  // État pour les cuves (données fictives)
  const [cuves] = useState([
    { 
      id: 'CUV-001', 
      nom: 'Cuve A1', 
      typeProduit: 'Farine T65',
      capacite: '10000 kg',
      dernierNettoyage: '2025-03-25',
      dernierControle: '2025-04-15',
      prochainNettoyage: '2025-04-25',
      statut: 'À nettoyer',
      priorite: 'Haute',
      location: 'Entrepôt Paris',
      responsable: 'Martin Dupont'
    },
    { 
      id: 'CUV-002', 
      nom: 'Cuve A2', 
      typeProduit: 'Farine T55',
      capacite: '8000 kg',
      dernierNettoyage: '2025-04-10',
      dernierControle: '2025-04-15',
      prochainNettoyage: '2025-05-10',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Paris',
      responsable: 'Martin Dupont'
    },
    { 
      id: 'CUV-003', 
      nom: 'Cuve A3', 
      typeProduit: 'Farine T55',
      capacite: '8000 kg',
      dernierNettoyage: '2025-03-28',
      dernierControle: '2025-04-15',
      prochainNettoyage: '2025-04-28',
      statut: 'À nettoyer',
      priorite: 'Haute',
      location: 'Entrepôt Paris',
      responsable: 'Martin Dupont'
    },
    { 
      id: 'CUV-004', 
      nom: 'Cuve A4', 
      typeProduit: 'Farine T80',
      capacite: '8000 kg',
      dernierNettoyage: '2025-04-12',
      dernierControle: '2025-04-15',
      prochainNettoyage: '2025-05-12',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Paris',
      responsable: 'Martin Dupont'
    },
    { 
      id: 'CUV-005', 
      nom: 'Cuve A5', 
      typeProduit: 'Farine T110',
      capacite: '5000 kg',
      dernierNettoyage: '2025-04-08',
      dernierControle: '2025-04-15',
      prochainNettoyage: '2025-05-08',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Paris',
      responsable: 'Martin Dupont'
    },
    { 
      id: 'CUV-006', 
      nom: 'Cuve B1', 
      typeProduit: 'Farine T65',
      capacite: '10000 kg',
      dernierNettoyage: '2025-04-15',
      dernierControle: '2025-04-18',
      prochainNettoyage: '2025-05-15',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Lyon',
      responsable: 'Sophie Martin'
    },
    { 
      id: 'CUV-007', 
      nom: 'Cuve B1', 
      typeProduit: 'Farine T55',
      capacite: '8000 kg',
      dernierNettoyage: '2025-04-02',
      dernierControle: '2025-04-15',
      prochainNettoyage: '2025-05-02',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Lyon',
      responsable: 'Sophie Martin'
    },
    { 
      id: 'CUV-008', 
      nom: 'Cuve B2', 
      typeProduit: 'Farine Bio T80',
      capacite: '5000 kg',
      dernierNettoyage: '2025-03-30',
      dernierControle: '2025-04-16',
      prochainNettoyage: '2025-04-30',
      statut: 'À nettoyer',
      priorite: 'Moyenne',
      location: 'Entrepôt Lyon',
      responsable: 'Sophie Martin'
    },
    { 
      id: 'CUV-009', 
      nom: 'Cuve B3', 
      typeProduit: 'Farine Bio T110',
      capacite: '5000 kg',
      dernierNettoyage: '2025-04-05',
      dernierControle: '2025-04-16',
      prochainNettoyage: '2025-05-05',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Lyon',
      responsable: 'Sophie Martin'
    },
    { 
      id: 'CUV-010', 
      nom: 'Cuve B4', 
      typeProduit: 'Farine de Seigle',
      capacite: '3000 kg',
      dernierNettoyage: '2025-04-18',
      dernierControle: '2025-04-19',
      prochainNettoyage: '2025-05-18',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Lyon',
      responsable: 'Sophie Martin'
    },
    { 
      id: 'CUV-011', 
      nom: 'Cuve C1', 
      typeProduit: 'Farine T65',
      capacite: '10000 kg',
      dernierNettoyage: '2025-04-14',
      dernierControle: '2025-04-20',
      prochainNettoyage: '2025-05-14',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Marseille',
      responsable: 'Pierre Durand'
    },
    { 
      id: 'CUV-012', 
      nom: 'Cuve C2', 
      typeProduit: 'Farine Complète',
      capacite: '5000 kg',
      dernierNettoyage: '2025-04-02',
      dernierControle: '2025-04-18',
      prochainNettoyage: '2025-05-02',
      statut: 'À nettoyer',
      priorite: 'Basse',
      location: 'Entrepôt Marseille',
      responsable: 'Pierre Durand'
    },
    { 
      id: 'CUV-013', 
      nom: 'Cuve C3', 
      typeProduit: 'Farine T55',
      capacite: '8000 kg',
      dernierNettoyage: '2025-04-17',
      dernierControle: '2025-04-20',
      prochainNettoyage: '2025-05-17',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Marseille',
      responsable: 'Pierre Durand'
    },
    { 
      id: 'CUV-014', 
      nom: 'Cuve C3', 
      typeProduit: 'Farine Bio T65',
      capacite: '5000 kg',
      dernierNettoyage: '2025-04-09',
      dernierControle: '2025-04-20',
      prochainNettoyage: '2025-05-09',
      statut: 'Propre',
      priorite: 'Basse',
      location: 'Entrepôt Marseille',
      responsable: 'Pierre Durand'
    },
    { 
      id: 'CUV-015', 
      nom: 'Cuve C4', 
      typeProduit: 'Farine T45',
      capacite: '5000 kg',
      dernierNettoyage: '2025-04-05',
      dernierControle: '2025-04-20',
      prochainNettoyage: '2025-05-05',
      statut: 'À nettoyer',
      priorite: 'Basse',
      location: 'Entrepôt Marseille',
      responsable: 'Pierre Durand'
    }
  ]);
  
  // Liste des localisations
  const locations = [
    { id: 'paris', name: 'Entrepôt Paris' },
    { id: 'lyon', name: 'Entrepôt Lyon' },
    { id: 'marseille', name: 'Entrepôt Marseille' }
  ];
  
  // Liste des statuts
  const statuts = [
    { id: 'a-nettoyer', name: 'À nettoyer' },
    { id: 'propre', name: 'Propre' }
  ];
  
  // Liste des priorités
  const priorites = [
    { id: 'haute', name: 'Haute' },
    { id: 'moyenne', name: 'Moyenne' },
    { id: 'basse', name: 'Basse' }
  ];
  
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
      location: 'all',
      statut: 'all',
      priorite: 'all',
      recherche: ''
    });
  };
  
  // Fonction pour filtrer les cuves
  const filteredCuves = cuves.filter(cuve => {
    // Filtre par localisation
    if (filters.location !== 'all' && cuve.location !== filters.location) {
      return false;
    }
    
    // Filtre par statut
    if (filters.statut !== 'all' && cuve.statut !== filters.statut) {
      return false;
    }
    
    // Filtre par priorité
    if (filters.priorite !== 'all' && cuve.priorite !== filters.priorite) {
      return false;
    }
    
    // Filtre par recherche
    if (
      filters.recherche && 
      !cuve.nom.toLowerCase().includes(filters.recherche.toLowerCase()) &&
      !cuve.id.toLowerCase().includes(filters.recherche.toLowerCase()) &&
      !cuve.typeProduit.toLowerCase().includes(filters.recherche.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
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
  
  // Fonction pour récupérer la couleur du statut
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'À nettoyer':
        return 'bg-red-100 text-red-800';
      case 'Propre':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  // Fonction pour calculer le nombre de jours jusqu'au prochain nettoyage
  const getDaysUntilNextCleaning = (dateString) => {
    const today = new Date();
    const nextCleaning = new Date(dateString);
    const diffTime = Math.abs(nextCleaning - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return nextCleaning < today ? -diffDays : diffDays;
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Cuves</h1>
          <p className="text-gray-600">Suivez l'état de maintenance des cuves dans tous les entrepôts</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/maintenance/cuves/nettoyage"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Enregistrer un nettoyage
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Localisation
            </label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Toutes les localisations</option>
              {locations.map(location => (
                <option key={location.id} value={location.name}>{location.name}</option>
              ))}
            </select>
          </div>
          
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
              {statuts.map(statut => (
                <option key={statut.id} value={statut.name}>{statut.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="priorite" className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              id="priorite"
              name="priorite"
              value={filters.priorite}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Toutes les priorités</option>
              {priorites.map(priorite => (
                <option key={priorite.id} value={priorite.name}>{priorite.name}</option>
              ))}
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
                placeholder="Rechercher une cuve..."
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

      {/* Tableau des cuves */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Liste des cuves</h2>
          <span className="text-sm text-gray-600">{filteredCuves.length} cuves trouvées</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
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
                  Prochain nettoyage
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCuves.length > 0 ? (
                filteredCuves.map((cuve) => {
                  const joursRestants = getDaysUntilNextCleaning(cuve.prochainNettoyage);
                  
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
                          joursRestants < 0 ? 'bg-red-100 text-red-800' :
                          joursRestants <= 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {joursRestants < 0 
                            ? `Retard de ${Math.abs(joursRestants)} jours` 
                            : joursRestants === 0 
                              ? "Aujourd'hui" 
                              : `Dans ${joursRestants} jours`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(cuve.statut)}`}>
                          {cuve.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(cuve.priorite)}`}>
                          {cuve.priorite}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cuve.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link to={`/maintenance/cuves/${cuve.id}`} className="text-indigo-600 hover:text-indigo-900">
                            Détails
                          </Link>
                          <Link to={`/maintenance/cuves/nettoyage?id=${cuve.id}`} className="text-indigo-600 hover:text-indigo-900">
                            Nettoyer
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-500">
                    Aucune cuve ne correspond aux critères de recherche.
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

      {/* Résumé par localisation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé par localisation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map(location => {
            const locationCuves = cuves.filter(c => c.location === location.name);
            const aNettoyer = locationCuves.filter(c => c.statut === 'À nettoyer').length;
            const propres = locationCuves.filter(c => c.statut === 'Propre').length;
            
            return (
              <div key={location.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{location.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total cuves:</span>
                    <span className="font-medium">{locationCuves.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">À nettoyer:</span>
                    <span className={`font-medium ${aNettoyer > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                      {aNettoyer}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Propres:</span>
                    <span className="font-medium text-green-600">{propres}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <Link 
                      to={`/maintenance/cuves?location=${location.name}`}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
