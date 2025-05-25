/**
 * Profil.jsx
 * --------------------------------------------------
 * Page de profil utilisateur pour l'application Minot'Or
 * 
 * Cette page permet à l'utilisateur de :
 * - Consulter ses informations personnelles
 * - Mettre à jour ses coordonnées
 * - Gérer ses préférences de notification
 * - Changer son mot de passe
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Composant de la page Profil
 * 
 * @returns {JSX.Element} Page de profil utilisateur
 */
export default function Profil() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('infos');
  
  // États pour les formulaires
  const [infosForm, setInfosForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    browser: true,
    orderUpdates: true,
    marketingMessages: false,
    newsletterSubscription: true
  });
  
  // Gestion du changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Gestion des changements de formulaire
  const handleInfosChange = (e) => {
    const { name, value } = e.target;
    setInfosForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotifChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Soumission des formulaires
  const handleInfosSubmit = (e) => {
    e.preventDefault();
    // Dans une application réelle, appel API pour mettre à jour les informations
    alert('Informations mises à jour avec succès !');
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validation basique
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    // Dans une application réelle, appel API pour changer le mot de passe
    alert('Mot de passe mis à jour avec succès !');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handleNotifSubmit = (e) => {
    e.preventDefault();
    // Dans une application réelle, appel API pour mettre à jour les préférences
    alert('Préférences de notification mises à jour avec succès !');
  };
  
  // Rendu des onglets
  const renderTabContent = () => {
    switch (activeTab) {
      case 'infos':
        return (
          <form onSubmit={handleInfosSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={infosForm.firstName}
                  onChange={handleInfosChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={infosForm.lastName}
                  onChange={handleInfosChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={infosForm.email}
                  onChange={handleInfosChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={infosForm.phone}
                  onChange={handleInfosChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Entreprise
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={infosForm.company}
                  onChange={handleInfosChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={infosForm.address}
                  onChange={handleInfosChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={infosForm.city}
                  onChange={handleInfosChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Code postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={infosForm.postalCode}
                  onChange={handleInfosChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        );
        
      case 'password':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, un chiffre et un caractère spécial.
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        );
        
      case 'notifications':
        return (
          <form onSubmit={handleNotifSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email"
                    name="email"
                    type="checkbox"
                    checked={notificationPrefs.email}
                    onChange={handleNotifChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email" className="font-medium text-gray-700">
                    Notifications par email
                  </label>
                  <p className="text-gray-500">
                    Recevez des notifications par email pour les mises à jour importantes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="browser"
                    name="browser"
                    type="checkbox"
                    checked={notificationPrefs.browser}
                    onChange={handleNotifChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="browser" className="font-medium text-gray-700">
                    Notifications navigateur
                  </label>
                  <p className="text-gray-500">
                    Recevez des notifications dans votre navigateur lorsque vous êtes connecté.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="orderUpdates"
                    name="orderUpdates"
                    type="checkbox"
                    checked={notificationPrefs.orderUpdates}
                    onChange={handleNotifChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="orderUpdates" className="font-medium text-gray-700">
                    Mises à jour des commandes
                  </label>
                  <p className="text-gray-500">
                    Recevez des notifications sur le statut de vos commandes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketingMessages"
                    name="marketingMessages"
                    type="checkbox"
                    checked={notificationPrefs.marketingMessages}
                    onChange={handleNotifChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingMessages" className="font-medium text-gray-700">
                    Messages marketing
                  </label>
                  <p className="text-gray-500">
                    Recevez des offres spéciales et autres communications promotionnelles.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletterSubscription"
                    name="newsletterSubscription"
                    type="checkbox"
                    checked={notificationPrefs.newsletterSubscription}
                    onChange={handleNotifChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletterSubscription" className="font-medium text-gray-700">
                    Abonnement à la newsletter
                  </label>
                  <p className="text-gray-500">
                    Recevez notre newsletter mensuelle avec les dernières nouveautés.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Enregistrer les préférences
              </button>
            </div>
          </form>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon profil</h1>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {/* En-tête avec avatar et informations principales */}
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="ml-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {user?.email}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Rôle: <span className="font-medium capitalize">{user?.role}</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleTabChange('infos')}
              className={`
                py-4 px-6 border-b-2 font-medium text-sm
                ${activeTab === 'infos'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Informations personnelles
            </button>
            <button
              onClick={() => handleTabChange('password')}
              className={`
                py-4 px-6 border-b-2 font-medium text-sm
                ${activeTab === 'password'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Mot de passe
            </button>
            <button
              onClick={() => handleTabChange('notifications')}
              className={`
                py-4 px-6 border-b-2 font-medium text-sm
                ${activeTab === 'notifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Préférences de notification
            </button>
          </nav>
        </div>
        
        {/* Contenu de l'onglet actif */}
        <div className="px-4 py-5 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
