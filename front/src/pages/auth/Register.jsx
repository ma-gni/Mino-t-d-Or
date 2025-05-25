/**
 * Register.jsx
 * --------------------------------------------------
 * Page d'inscription de l'application Minot'Or
 * 
 * Cette page permet aux nouveaux boulangers exclusivement :
 * - De créer un compte en fournissant leurs informations personnelles
 * - De définir leurs identifiants de connexion
 * - D'enregistrer les informations de leur boulangerie
 * 
 * Après une inscription réussie, l'utilisateur est redirigé vers la page de connexion.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';

/**
 * Fonction Register
 * 
 * Cette fonction définit la page d'inscription des boulangers.
 * Elle utilise les hooks useState pour gérer les données du formulaire
 * et useAuth pour accéder aux fonctions d'inscription.
 * 
 * @returns {JSX.Element} La page d'inscription
 */
export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    
    // Informations boulangerie
    companyName: '',
    siret: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Informations personnelles, 2: Informations boulangerie

  /**
   * Fonction handleChange
   * 
   * Cette fonction est appelée lorsqu'un champ du formulaire est modifié.
   * Elle met à jour les données du formulaire en conséquence.
   * 
   * @param {Event} e L'événement de modification du champ
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Fonction nextStep
   * 
   * Cette fonction vérifie les informations de l'étape 1 avant de passer à l'étape 2
   */
  const nextStep = () => {
    // Vérification des mots de passe
    if (formData.password !== formData.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    setError('');
    setStep(2);
  };

  /**
   * Fonction previousStep
   * 
   * Cette fonction permet de revenir à l'étape précédente
   */
  const previousStep = () => {
    setStep(1);
  };

  /**
   * Fonction handleSubmit
   * 
   * Cette fonction est appelée lorsqu'on soumet le formulaire.
   * Elle tente d'inscrire l'utilisateur en utilisant les données du formulaire.
   * Si l'inscription est réussie, elle redirige l'utilisateur vers la page de connexion.
   * 
   * @param {Event} e L'événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      // Simulation d'une inscription réussie
      // Dans une application réelle, il faudrait appeler une API d'inscription
      setTimeout(() => {
        // Connexion automatique après inscription
        login({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: ROLES.BOULANGER
        });
        
        // Redirection vers le tableau de bord boulanger
        navigate('/boulanger/dashboard');
      }, 1500);
    } catch (err) {
      setError('Erreur lors de l\'inscription: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Créer un compte boulanger</h2>
          <p className="mt-2 text-gray-600">
            Déjà inscrit? <Link to="/connexion" className="text-indigo-600 hover:text-indigo-500">Se connecter</Link>
          </p>
        </div>
        
        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Indicateur d'étape */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>1</div>
          <div className="h-1 w-16 bg-gray-200 mx-2"></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>2</div>
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
          {/* Étape 1: Informations personnelles */}
          {step === 1 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-6 text-indigo-700">Vos informations personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Informations boulangerie */}
          {step === 2 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-6 text-indigo-700">Informations de votre boulangerie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boulangerie</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">SIRET</label>
                  <input
                    type="text"
                    name="siret"
                    value={formData.siret}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between mt-8">
            {step === 2 && (
              <button
                type="button"
                onClick={previousStep}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Retour
              </button>
            )}
            <div className={step === 2 ? 'ml-auto' : 'w-full'}>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {loading ? 'Traitement en cours...' : step === 1 ? 'Continuer' : 'S\'inscrire'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
