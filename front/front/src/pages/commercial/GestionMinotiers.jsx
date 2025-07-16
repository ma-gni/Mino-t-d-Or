/**
 * GestionMinotiers.jsx (Commercial)
 * --------------------------------------------------
 * Page de gestion des minotiers pour les commerciaux
 * 
 * Cette page permet aux commerciaux de :
 * - Consulter la liste des minotiers
 * - Ajouter un nouveau minotier
 * - Modifier les informations d'un minotier existant
 * - Supprimer un minotier
 */

import React, { useState } from 'react';

export default function GestionMinotiers() {
  // État pour la liste des minotiers
  const [millers, setMillers] = useState([
    {
      id: 1,
      name: 'Minoterie Dupuis',
      contact: 'Jean Dupuis',
      email: 'contact@minoterie-dupuis.fr',
      phone: '01 23 45 67 89',
      address: '12 rue des Moulins, 75001 Paris',
      siret: '12345678901234',
      created: '2024-10-15',
      active: true
    },
    {
      id: 2,
      name: 'Grands Moulins de Paris',
      contact: 'Marie Martin',
      email: 'contact@grandsmoulins.fr',
      phone: '01 98 76 54 32',
      address: '45 avenue de la Farine, 92300 Levallois-Perret',
      siret: '98765432109876',
      created: '2024-11-20',
      active: true
    },
    {
      id: 3,
      name: 'Minoterie Artisanale',
      contact: 'Pierre Lefebvre',
      email: 'p.lefebvre@minoterie-artisanale.fr',
      phone: '03 45 67 89 01',
      address: '3 chemin du Moulin, 14000 Caen',
      siret: '45678901234567',
      created: '2025-01-10',
      active: true
    },
    {
      id: 4,
      name: 'Moulins Bio',
      contact: 'Sophie Dubois',
      email: 'contact@moulins-bio.fr',
      phone: '04 56 78 90 12',
      address: '78 route des Blés, 69000 Lyon',
      siret: '78901234567890',
      created: '2025-02-05',
      active: true
    }
  ]);

  // État pour le formulaire
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    siret: '',
    active: true
  });

  // État pour le mode (ajout/modification)
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction de gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Fonction pour démarrer l'ajout d'un minotier
  const startAddMiller = () => {
    setFormData({
      id: null,
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      siret: '',
      active: true
    });
    setIsEditing(false);
    setShowForm(true);
  };

  // Fonction pour démarrer la modification d'un minotier
  const startEditMiller = (miller) => {
    setFormData({
      id: miller.id,
      name: miller.name,
      contact: miller.contact,
      email: miller.email,
      phone: miller.phone,
      address: miller.address,
      siret: miller.siret,
      active: miller.active
    });
    setIsEditing(true);
    setShowForm(true);
  };

  // Fonction pour enregistrer un minotier (ajout ou modification)
  const saveMiller = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Modification d'un minotier existant
      setMillers(millers.map(miller => 
        miller.id === formData.id ? { ...formData, created: miller.created } : miller
      ));
    } else {
      // Ajout d'un nouveau minotier
      const newMiller = {
        ...formData,
        id: Math.max(...millers.map(m => m.id), 0) + 1,
        created: new Date().toISOString().split('T')[0]
      };
      setMillers([...millers, newMiller]);
    }

    // Réinitialisation du formulaire
    setShowForm(false);
  };

  // Fonction pour supprimer un minotier
  const deleteMiller = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce minotier ?')) {
      setMillers(millers.filter(miller => miller.id !== id));
    }
  };

  // Fonction pour filtrer les minotiers selon le terme de recherche
  const filteredMillers = millers.filter(miller => 
    miller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    miller.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    miller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    miller.siret.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Minotiers</h1>
          <p className="text-gray-600">Ajoutez, modifiez et supprimez des minotiers</p>
        </div>
        <div>
          <button
            onClick={startAddMiller}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Ajouter un minotier
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout/modification (conditionnel) */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? 'Modifier un minotier' : 'Ajouter un minotier'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={saveMiller} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la minoterie *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Personne de contact *
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
                  SIRET *
                </label>
                <input
                  type="text"
                  id="siret"
                  name="siret"
                  value={formData.siret}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{14}"
                  title="Le numéro SIRET doit contenir 14 chiffres"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center h-full">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Minotier actif</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">🔍</span>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un minotier..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Liste des minotiers */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Liste des minotiers ({filteredMillers.length})
          </h2>
        </div>
        {filteredMillers.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Aucun minotier trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Minoterie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email / Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SIRET
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMillers.map((miller) => (
                  <tr key={miller.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{miller.name}</div>
                      <div className="text-sm text-gray-500">{miller.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{miller.contact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{miller.email}</div>
                      <div className="text-sm text-gray-500">{miller.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {miller.siret}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        miller.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {miller.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => startEditMiller(miller)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => deleteMiller(miller.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Informations supplémentaires */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informations</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <span className="font-medium">🔍 Recherche complète :</span> La recherche s'effectue sur le nom de la minoterie, 
            le contact, l'email et le numéro SIRET.
          </p>
          <p>
            <span className="font-medium">📋 SIRET :</span> Le numéro SIRET doit contenir exactement 14 chiffres.
          </p>
          <p>
            <span className="font-medium">⚠️ Suppression :</span> La suppression d'un minotier est définitive et supprimera 
            également tous les produits associés à ce minotier.
          </p>
        </div>
      </div>
    </div>
  );
}
