/**
 * NettoyageCuve.jsx (Maintenance)
 * --------------------------------------------------
 * Page d'enregistrement d'un nettoyage de cuve
 * 
 * Cette page permet de :
 * - Sélectionner une cuve à nettoyer
 * - Remplir un formulaire de nettoyage
 * - Mettre à jour le statut de la cuve après nettoyage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NettoyageCuve() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const cuveId = searchParams.get('id');
  
  // État des cuves (données fictives)
  const [cuves, setCuves] = useState([
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
  
  // Types de nettoyage disponibles
  const typesNettoyage = [
    { id: 'standard', nom: 'Nettoyage standard' },
    { id: 'complet', nom: 'Nettoyage complet' },
    { id: 'desinfection', nom: 'Nettoyage avec désinfection' }
  ];
  
  // État du formulaire
  const [formData, setFormData] = useState({
    cuveId: '',
    dateNettoyage: new Date().toISOString().split('T')[0],
    typeNettoyage: 'standard',
    technicien: user?.firstName + ' ' + user?.lastName || '',
    observations: '',
    prochainNettoyage: '',
    photos: []
  });
  
  // État pour la cuve sélectionnée
  const [selectedCuve, setSelectedCuve] = useState(null);
  
  // État pour la soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Sélectionner une cuve si l'ID est présent dans l'URL
  useEffect(() => {
    if (cuveId) {
      const cuve = cuves.find(c => c.id === cuveId);
      if (cuve) {
        setSelectedCuve(cuve);
        setFormData(prev => ({
          ...prev,
          cuveId: cuve.id,
          prochainNettoyage: calculateDefaultNextDate(new Date())
        }));
      }
    }
  }, [cuveId, cuves]);
  
  // Fonction pour calculer la date du prochain nettoyage (par défaut aujourd'hui + 30 jours)
  const calculateDefaultNextDate = (date) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 30);
    return nextDate.toISOString().split('T')[0];
  };
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si l'utilisateur change la cuve sélectionnée
    if (name === 'cuveId' && value !== formData.cuveId) {
      const cuve = cuves.find(c => c.id === value);
      setSelectedCuve(cuve || null);
    }
    
    // Mise à jour du formulaire
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Réinitialisation des erreurs pour ce champ
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation du formulaire
    const errors = {};
    if (!formData.cuveId) errors.cuveId = 'Veuillez sélectionner une cuve';
    if (!formData.dateNettoyage) errors.dateNettoyage = 'Veuillez sélectionner une date de nettoyage';
    if (!formData.typeNettoyage) errors.typeNettoyage = 'Veuillez sélectionner un type de nettoyage';
    if (!formData.technicien) errors.technicien = 'Veuillez indiquer le nom du technicien';
    if (!formData.prochainNettoyage) errors.prochainNettoyage = 'Veuillez sélectionner une date pour le prochain nettoyage';
    
    // S'il y a des erreurs, les afficher et ne pas soumettre
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Simulation de la soumission
    setIsSubmitting(true);
    
    // Mise à jour de l'état de la cuve
    setTimeout(() => {
      // Dans une vraie application, on enverrait ces données à une API
      const updatedCuves = cuves.map(cuve => {
        if (cuve.id === formData.cuveId) {
          return {
            ...cuve,
            statut: 'Propre',
            dernierNettoyage: formData.dateNettoyage,
            prochainNettoyage: formData.prochainNettoyage
          };
        }
        return cuve;
      });
      
      setCuves(updatedCuves);
      
      // Redirection après succès
      alert('Nettoyage enregistré avec succès!');
      navigate('/maintenance/cuves');
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  // État chargement
  if (!cuves) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Chargement des données...</p>
      </div>
    );
  }
  
  // Filtrer les cuves à nettoyer pour la liste déroulante
  const cuvesANettoyer = cuves.filter(cuve => cuve.statut === 'À nettoyer');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enregistrement de Nettoyage</h1>
          <p className="text-gray-600">Documentez le nettoyage d'une cuve et mettez à jour son statut</p>
        </div>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Retour
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de nettoyage */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Formulaire de nettoyage</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Sélection de la cuve */}
              <div className="space-y-2">
                <label htmlFor="cuveId" className="block text-sm font-medium text-gray-700">
                  Cuve à nettoyer *
                </label>
                <select
                  id="cuveId"
                  name="cuveId"
                  value={formData.cuveId}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${formErrors.cuveId ? 'border-red-300' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  disabled={Boolean(cuveId)}
                >
                  <option value="">Sélectionner une cuve</option>
                  {cuvesANettoyer.map(cuve => (
                    <option key={cuve.id} value={cuve.id}>
                      {cuve.id} - {cuve.nom} ({cuve.location})
                    </option>
                  ))}
                </select>
                {formErrors.cuveId && (
                  <p className="text-red-500 text-sm">{formErrors.cuveId}</p>
                )}
              </div>
              
              {/* Date de nettoyage */}
              <div className="space-y-2">
                <label htmlFor="dateNettoyage" className="block text-sm font-medium text-gray-700">
                  Date de nettoyage *
                </label>
                <input
                  type="date"
                  id="dateNettoyage"
                  name="dateNettoyage"
                  value={formData.dateNettoyage}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full rounded-md border ${formErrors.dateNettoyage ? 'border-red-300' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {formErrors.dateNettoyage && (
                  <p className="text-red-500 text-sm">{formErrors.dateNettoyage}</p>
                )}
              </div>
              
              {/* Type de nettoyage */}
              <div className="space-y-2">
                <label htmlFor="typeNettoyage" className="block text-sm font-medium text-gray-700">
                  Type de nettoyage *
                </label>
                <select
                  id="typeNettoyage"
                  name="typeNettoyage"
                  value={formData.typeNettoyage}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${formErrors.typeNettoyage ? 'border-red-300' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="">Sélectionner un type</option>
                  {typesNettoyage.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.nom}
                    </option>
                  ))}
                </select>
                {formErrors.typeNettoyage && (
                  <p className="text-red-500 text-sm">{formErrors.typeNettoyage}</p>
                )}
              </div>
              
              {/* Technicien */}
              <div className="space-y-2">
                <label htmlFor="technicien" className="block text-sm font-medium text-gray-700">
                  Technicien responsable *
                </label>
                <input
                  type="text"
                  id="technicien"
                  name="technicien"
                  value={formData.technicien}
                  onChange={handleChange}
                  placeholder="Nom du technicien"
                  className={`w-full rounded-md border ${formErrors.technicien ? 'border-red-300' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {formErrors.technicien && (
                  <p className="text-red-500 text-sm">{formErrors.technicien}</p>
                )}
              </div>
              
              {/* Date du prochain nettoyage */}
              <div className="space-y-2">
                <label htmlFor="prochainNettoyage" className="block text-sm font-medium text-gray-700">
                  Date du prochain nettoyage *
                </label>
                <input
                  type="date"
                  id="prochainNettoyage"
                  name="prochainNettoyage"
                  value={formData.prochainNettoyage}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full rounded-md border ${formErrors.prochainNettoyage ? 'border-red-300' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {formErrors.prochainNettoyage && (
                  <p className="text-red-500 text-sm">{formErrors.prochainNettoyage}</p>
                )}
              </div>
              
              {/* Observations */}
              <div className="space-y-2">
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
                  Observations
                </label>
                <textarea
                  id="observations"
                  name="observations"
                  rows="4"
                  value={formData.observations}
                  onChange={handleChange}
                  placeholder="Observations, problèmes rencontrés, etc."
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              
              {/* Upload de photos */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Photos du nettoyage (optionnel)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Télécharger des fichiers</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/maintenance/cuves')}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer le nettoyage'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Détails de la cuve sélectionnée */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Détails de la cuve</h2>
            </div>
            
            {selectedCuve ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-gray-900">{selectedCuve.nom}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedCuve.statut === 'À nettoyer' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedCuve.statut}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ID:</span> {selectedCuve.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type de produit:</span> {selectedCuve.typeProduit}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Capacité:</span> {selectedCuve.capacite}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Localisation:</span> {selectedCuve.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Responsable:</span> {selectedCuve.responsable}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dernières maintenances</h4>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dernier nettoyage:</span> {new Date(selectedCuve.dernierNettoyage).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dernier contrôle:</span> {new Date(selectedCuve.dernierControle).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Prochain nettoyage prévu:</span> {new Date(selectedCuve.prochainNettoyage).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Priorité:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedCuve.priorite === 'Haute' ? 'bg-red-100 text-red-800' :
                      selectedCuve.priorite === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedCuve.priorite}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>Sélectionnez une cuve pour voir ses détails</p>
              </div>
            )}
          </div>
          
          {/* Aide et information */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
            <h3 className="font-medium mb-2">Guide de nettoyage</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Vérifiez que la cuve est vide avant de commencer</li>
              <li>Suivez les procédures de sécurité</li>
              <li>Pour un nettoyage standard: utiliser les produits du groupe A</li>
              <li>Pour un nettoyage complet: utiliser les produits des groupes A et B</li>
              <li>Pour une désinfection: ajouter les produits du groupe C</li>
              <li>N'oubliez pas de documenter avec des photos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
