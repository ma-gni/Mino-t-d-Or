/**
 * Login.jsx
 * --------------------------------------------------
 * Page de connexion de l'application Minot'Or
 * 
 * Cette page permet aux utilisateurs :
 * - De se connecter avec leur email et mot de passe
 * - De sélectionner leur rôle (boulanger, commercial, etc.)
 * - D'accéder à l'option de récupération de mot de passe
 * - De naviguer vers la page d'inscription (pour les boulangers uniquement)
 * 
 * Après une connexion réussie, l'utilisateur est redirigé vers le tableau de bord correspondant à son rôle.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';

/**
 * Fonction principale de la page de connexion
 * 
 * Cette fonction utilise les hooks useState et useNavigate pour gérer les données de connexion et la navigation.
 * Elle utilise également le hook useAuth pour accéder au contexte d'authentification.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ROLES.BOULANGER
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Fonction de soumission du formulaire de connexion
   * 
   * Cette fonction est appelée lorsque l'utilisateur soumet le formulaire de connexion.
   * Elle simule une connexion réussie et redirige l'utilisateur vers le tableau de bord correspondant à son rôle.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Simulation d'une connexion réussie
      login({
        email: formData.email,
        firstName: 'Jean',
        lastName: 'Dupont',
        role: formData.role
      });
      
      // Redirection vers le tableau de bord correspondant au rôle
      switch(formData.role) {
        case ROLES.BOULANGER:
          navigate('/boulanger/dashboard');
          break;
        case ROLES.COMMERCIAL:
          navigate('/commercial/dashboard');
          break;
        case ROLES.APPROVISIONNEMENT:
          navigate('/approvisionnement/dashboard');
          break;
        case ROLES.PREPARATION:
          navigate('/preparation/dashboard');
          break;
        case ROLES.MAINTENANCE:
          navigate('/maintenance/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction de mise à jour des données de connexion
   * 
   * Cette fonction est appelée lorsque l'utilisateur modifie les champs du formulaire de connexion.
   * Elle met à jour les données de connexion en conséquence.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link to="/inscription" className="font-medium text-indigo-600 hover:text-indigo-500">
              Créer un compte boulanger
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">Rôle</label>
              <select
                id="role"
                name="role"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value={ROLES.BOULANGER}>Boulanger</option>
                <option value={ROLES.COMMERCIAL}>Commercial</option>
                <option value={ROLES.APPROVISIONNEMENT}>Approvisionnement</option>
                <option value={ROLES.PREPARATION}>Préparation</option>
                <option value={ROLES.MAINTENANCE}>Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
