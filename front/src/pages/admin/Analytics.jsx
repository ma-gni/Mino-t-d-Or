/**
 * Analytics.jsx (Admin)
 * --------------------------------------------------
 * Tableau de bord d'analytics simplifié pour les administrateurs
 * 
 * Cette page permet de :
 * - Visualiser les statistiques de fréquentation
 * - Consulter les logs de navigation utilisateur
 * - Filtrer les données par date et utilisateur
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  // État pour les filtres
  const [filters, setFilters] = useState({
    dateDebut: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    dateFin: new Date().toISOString().split('T')[0],
    utilisateur: 'all',
    role: 'all',
    page: ''
  });
  
  // État pour les statistiques générales
  const [stats, setStats] = useState({
    visiteursUniques: 48,
    sessionsTotal: 128,
    pagesVues: 856,
    dureeSessionMoyenne: '00:12:35',
    tauxRebond: '23%'
  });
  
  // État pour les données du graphique de visites par jour
  const [visitesParJour, setVisitesParJour] = useState([
    { jour: 'Lun 15/04', visites: 42, utilisateurs: 18 },
    { jour: 'Mar 16/04', visites: 38, utilisateurs: 15 },
    { jour: 'Mer 17/04', visites: 45, utilisateurs: 22 },
    { jour: 'Jeu 18/04', visites: 40, utilisateurs: 19 },
    { jour: 'Ven 19/04', visites: 52, utilisateurs: 25 },
    { jour: 'Sam 20/04', visites: 25, utilisateurs: 12 },
    { jour: 'Dim 21/04', visites: 18, utilisateurs: 8 },
    { jour: 'Lun 22/04', visites: 48, utilisateurs: 21 }
  ]);
  
  // État pour les données du graphique de répartition par rôle
  const [visitesParRole, setVisitesParRole] = useState([
    { name: 'Boulanger', value: 250 },
    { name: 'Commercial', value: 180 },
    { name: 'Approvisionnement', value: 200 },
    { name: 'Préparation', value: 120 },
    { name: 'Maintenance', value: 80 },
    { name: 'Admin', value: 26 }
  ]);
  
  // État pour les données du graphique de pages les plus visitées
  const [pagesPopulaires, setPagesPopulaires] = useState([
    { page: 'Tableau de bord', vues: 215 },
    { page: 'Catalogue produits', vues: 185 },
    { page: 'Demande de devis', vues: 148 },
    { page: 'Commandes', vues: 125 },
    { page: 'Suivi des stocks', vues: 98 },
    { page: 'Préparation de commandes', vues: 85 }
  ]);
  
  // État pour les logs de navigation
  const [navigationLogs, setNavigationLogs] = useState([
    { 
      id: 1, 
      utilisateur: 'Jean Dupont', 
      role: 'Boulanger', 
      page: '/boulanger/catalogue', 
      action: 'Visite page', 
      date: '2025-04-22T09:45:23',
      duree: '00:03:12',
      userAgent: 'Chrome/118.0.0.0 Windows' 
    },
    { 
      id: 2, 
      utilisateur: 'Marie Martin', 
      role: 'Commercial', 
      page: '/commercial/devis/12345', 
      action: 'Modification devis', 
      date: '2025-04-22T10:12:45',
      duree: '00:08:34',
      userAgent: 'Firefox/115.0 MacOS' 
    },
    { 
      id: 3, 
      utilisateur: 'Pierre Legrand', 
      role: 'Approvisionnement', 
      page: '/approvisionnement/stocks', 
      action: 'Visite page', 
      date: '2025-04-22T10:30:12',
      duree: '00:04:56',
      userAgent: 'Chrome/118.0.0.0 Windows' 
    },
    { 
      id: 4, 
      utilisateur: 'Sophie Petit', 
      role: 'Préparation', 
      page: '/preparation/commandes/45678', 
      action: 'Mise à jour statut', 
      date: '2025-04-22T11:05:34',
      duree: '00:01:45',
      userAgent: 'Safari/605.1.15 iOS' 
    },
    { 
      id: 5, 
      utilisateur: 'Paul Moreau', 
      role: 'Maintenance', 
      page: '/maintenance/cuves', 
      action: 'Visite page', 
      date: '2025-04-22T11:23:09',
      duree: '00:05:21',
      userAgent: 'Chrome/118.0.0.0 Android' 
    },
    { 
      id: 6, 
      utilisateur: 'Jean Dupont', 
      role: 'Boulanger', 
      page: '/boulanger/commandes', 
      action: 'Création commande', 
      date: '2025-04-22T11:45:52',
      duree: '00:06:18',
      userAgent: 'Chrome/118.0.0.0 Windows' 
    },
    { 
      id: 7, 
      utilisateur: 'Admin', 
      role: 'Admin', 
      page: '/admin/utilisateurs', 
      action: 'Modification utilisateur', 
      date: '2025-04-22T12:05:16',
      duree: '00:02:49',
      userAgent: 'Chrome/118.0.0.0 Windows' 
    },
    { 
      id: 8, 
      utilisateur: 'Marie Martin', 
      role: 'Commercial', 
      page: '/commercial/produits', 
      action: 'Visite page', 
      date: '2025-04-22T13:18:27',
      duree: '00:04:32',
      userAgent: 'Firefox/115.0 MacOS' 
    },
    { 
      id: 9, 
      utilisateur: 'Pierre Legrand', 
      role: 'Approvisionnement', 
      page: '/approvisionnement/bons-transport/nouveau', 
      action: 'Création bon', 
      date: '2025-04-22T14:02:38',
      duree: '00:07:20',
      userAgent: 'Chrome/118.0.0.0 Windows' 
    },
    { 
      id: 10, 
      utilisateur: 'Sophie Petit', 
      role: 'Préparation', 
      page: '/preparation/imprimer', 
      action: 'Impression', 
      date: '2025-04-22T14:35:41',
      duree: '00:00:58',
      userAgent: 'Safari/605.1.15 iOS' 
    }
  ]);
  
  // Liste des utilisateurs pour les filtres
  const utilisateurs = [
    { id: 1, nom: 'Jean Dupont', role: 'Boulanger' },
    { id: 2, nom: 'Marie Martin', role: 'Commercial' },
    { id: 3, nom: 'Pierre Legrand', role: 'Approvisionnement' },
    { id: 4, nom: 'Sophie Petit', role: 'Préparation' },
    { id: 5, nom: 'Paul Moreau', role: 'Maintenance' },
    { id: 6, nom: 'Admin', role: 'Admin' }
  ];
  
  // Liste des rôles pour les filtres
  const roles = [
    { id: 'boulanger', nom: 'Boulanger' },
    { id: 'commercial', nom: 'Commercial' },
    { id: 'approvisionnement', nom: 'Approvisionnement' },
    { id: 'preparation', nom: 'Préparation' },
    { id: 'maintenance', nom: 'Maintenance' },
    { id: 'admin', nom: 'Admin' }
  ];
  
  // Couleurs pour le graphique camembert
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A478F5', '#FF6B6B'];
  
  // Effet pour simuler le chargement des données
  useEffect(() => {
    // Dans une application réelle, on chargerait les données depuis une API
    // en fonction des filtres sélectionnés
    console.log('Filtres mis à jour:', filters);
    
    // Simulation d'un appel API
    // Pour une application réelle, cette partie serait remplacée
    // par un appel à une API de tracking qui renverrait les données
    // en fonction des filtres
  }, [filters]);
  
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
      dateDebut: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
      dateFin: new Date().toISOString().split('T')[0],
      utilisateur: 'all',
      role: 'all',
      page: ''
    });
  };
  
  // Fonction pour filtrer les logs de navigation
  const filteredLogs = navigationLogs.filter(log => {
    const logDate = new Date(log.date);
    const dateDebut = new Date(filters.dateDebut);
    const dateFin = new Date(filters.dateFin);
    dateFin.setHours(23, 59, 59); // Inclure toute la journée de fin
    
    // Filtre par date
    if (logDate < dateDebut || logDate > dateFin) {
      return false;
    }
    
    // Filtre par utilisateur
    if (filters.utilisateur !== 'all' && log.utilisateur !== filters.utilisateur) {
      return false;
    }
    
    // Filtre par rôle
    if (filters.role !== 'all' && log.role !== filters.role) {
      return false;
    }
    
    // Filtre par page
    if (filters.page && !log.page.toLowerCase().includes(filters.page.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Fonction pour exporter les données en CSV
  const exportToCsv = () => {
    // Entêtes CSV
    let csvContent = 'ID,Utilisateur,Rôle,Page,Action,Date,Durée,User Agent\n';
    
    // Ajouter chaque log au fichier CSV
    filteredLogs.forEach(log => {
      const row = [
        log.id,
        log.utilisateur,
        log.role,
        log.page,
        log.action,
        formatDate(log.date),
        log.duree,
        log.userAgent
      ].map(cell => `"${cell}"`).join(',');
      
      csvContent += row + '\n';
    });
    
    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_navigation_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Statistiques de fréquentation et logs de navigation</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCsv}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition flex items-center"
          >
            <span className="mr-2">📊</span>
            <span>Exporter CSV</span>
          </button>
          <Link 
            to="/admin/dashboard"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Tableau de bord admin
          </Link>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Visiteurs uniques</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.visiteursUniques}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Sessions</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.sessionsTotal}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Pages vues</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.pagesVues}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Durée moyenne</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.dureeSessionMoyenne}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Taux de rebond</p>
          <p className="text-2xl font-semibold text-gray-800">{stats.tauxRebond}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              id="dateDebut"
              name="dateDebut"
              value={filters.dateDebut}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="date"
              id="dateFin"
              name="dateFin"
              value={filters.dateFin}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="utilisateur" className="block text-sm font-medium text-gray-700 mb-1">
              Utilisateur
            </label>
            <select
              id="utilisateur"
              name="utilisateur"
              value={filters.utilisateur}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les utilisateurs</option>
              {utilisateurs.map(user => (
                <option key={user.id} value={user.nom}>{user.nom}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              id="role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les rôles</option>
              {roles.map(role => (
                <option key={role.id} value={role.nom}>{role.nom}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="page" className="block text-sm font-medium text-gray-700 mb-1">
              Page
            </label>
            <input
              type="text"
              id="page"
              name="page"
              value={filters.page}
              onChange={handleFilterChange}
              placeholder="Rechercher une page..."
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
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
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de visites par jour */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Visites par jour</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visitesParJour}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visites" name="Sessions" fill="#8884d8" />
                <Bar dataKey="utilisateurs" name="Utilisateurs uniques" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pages les plus visitées */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pages les plus visitées</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={pagesPopulaires}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="page" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="vues" name="Nombre de vues" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Graphique répartition par rôle */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Répartition des visites par rôle</h2>
        <div className="flex flex-row">
          <div className="w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visitesParRole}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {visitesParRole.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} vues`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 p-4">
            <h3 className="text-base font-medium text-gray-800 mb-3">Répartition détaillée</h3>
            <ul className="space-y-2">
              {visitesParRole.map((role, index) => (
                <li key={index} className="flex items-center">
                  <span 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="flex-1">{role.name}</span>
                  <span className="font-medium">{role.value} vues</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({((role.value / visitesParRole.reduce((sum, r) => sum + r.value, 0)) * 100).toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Logs de navigation */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Logs de navigation</h2>
          <span className="text-sm text-gray-600">{filteredLogs.length} résultats</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Agent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {log.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.utilisateur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {log.page}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {formatDate(log.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {log.duree}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                      {log.userAgent}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                    Aucun log ne correspond aux critères de recherche.
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
    </div>
  );
}
