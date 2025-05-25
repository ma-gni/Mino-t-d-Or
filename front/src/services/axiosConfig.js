/**
 * axiosConfig.js
 * --------------------------------------------------
 * Configuration d'Axios pour l'application Minot'Or
 * 
 * Ce fichier configure :
 * - L'URL de base pour toutes les requêtes API
 * - Les intercepteurs pour gérer les erreurs globalement
 * - L'ajout des tokens d'authentification aux requêtes
 * - La gestion des réponses et erreurs
 */

import axios from 'axios';

// URL de base de l'API (à modifier selon l'environnement)
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.minotor.fr/api'
  : 'http://localhost:8080/api';

// Création de l'instance Axios avec la configuration de base
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 secondes avant timeout
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  config => {
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('auth_token');
    
    // Si un token existe, on l'ajoute à l'en-tête Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    // En cas d'erreur lors de la configuration de la requête
    console.error('Erreur lors de la configuration de la requête :', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  response => {
    // Traitement des réponses réussies
    return response;
  },
  error => {
    // Gestion des erreurs de réponse
    const { response } = error;
    
    // Gestion des différents codes d'erreur
    if (response) {
      switch (response.status) {
        case 401: // Non autorisé
          // Redirection vers la page de connexion ou rafraîchissement du token
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          // Redirection possible ici ou via un événement global
          window.location.href = '/connexion';
          break;
          
        case 403: // Accès interdit
          console.error('Accès refusé à la ressource demandée');
          break;
          
        case 404: // Ressource non trouvée
          console.error('Ressource demandée non trouvée');
          break;
          
        case 500: // Erreur serveur
          console.error('Erreur serveur interne', response.data);
          break;
          
        default:
          console.error(`Erreur ${response.status}:`, response.data);
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Aucune réponse reçue du serveur:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur lors de la configuration de la requête:', error.message);
    }
    
    // Renvoie l'erreur pour permettre une gestion spécifique dans les composants
    return Promise.reject(error);
  }
);

export default axiosInstance;
