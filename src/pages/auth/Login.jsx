/**
 * Login.jsx
 * --------------------------------------------------
 * Page de connexion de l'application Minot'Or
 * 
 * Cette page permet aux utilisateurs :
 * - De se connecter avec leur email et mot de passe
 * - D'accéder à l'option de récupération de mot de passe
 * - De naviguer vers la page d'inscription
 * 
 * Après une connexion réussie, l'utilisateur est redirigé vers le tableau de bord.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    role: 'baker'
  });

  /**
   * Fonction de soumission du formulaire de connexion
   * 
   * Cette fonction est appelée lorsque l'utilisateur soumet le formulaire de connexion.
   * Elle simule une connexion réussie et redirige l'utilisateur vers le tableau de bord.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'une connexion réussie
    login({
      email: formData.email,
      firstName: 'John',
      lastName: 'Doe',
      role: formData.role
    });
    navigate('/dashboard');
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
        </div>
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
                <option value="baker">Boulanger</option>
                <option value="commercial">Commercial</option>
                <option value="supply">Approvisionneur</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
