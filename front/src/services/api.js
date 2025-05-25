/**
 * api.js
 * --------------------------------------------------
 * Service API pour l'application Minot'Or
 * 
 * Ce fichier regroupe toutes les méthodes d'appel à l'API pour :
 * - Authentification
 * - Gestion des utilisateurs
 * - Gestion des produits
 * - Gestion des commandes
 * - Gestion des devis
 * - Gestion des stocks
 * - Gestion des livraisons
 * - Gestion des invendus
 */

import axios from './axiosConfig';

// ===== SERVICE D'AUTHENTIFICATION =====
export const authService = {
  /**
   * Connexion utilisateur
   * @param {Object} credentials - Identifiants de connexion
   * @returns {Promise} Promesse avec les données utilisateur
   */
  login: (credentials) => {
    return axios.post('/auth/login', credentials);
  },

  /**
   * Inscription utilisateur (boulanger uniquement)
   * @param {Object} userData - Données d'inscription
   * @returns {Promise} Promesse avec les données utilisateur
   */
  register: (userData) => {
    return axios.post('/auth/register', userData);
  },

  /**
   * Déconnexion utilisateur
   * @returns {Promise} Promesse avec statut de déconnexion
   */
  logout: () => {
    return axios.post('/auth/logout');
  },

  /**
   * Réinitialisation du mot de passe
   * @param {Object} data - Données de réinitialisation
   * @returns {Promise} Promesse avec statut de la demande
   */
  resetPassword: (data) => {
    return axios.post('/auth/reset-password', data);
  },

  /**
   * Vérification du token JWT
   * @returns {Promise} Promesse avec validité du token
   */
  verifyToken: () => {
    return axios.get('/auth/verify-token');
  }
};

// ===== SERVICE DE GESTION DES UTILISATEURS =====
export const userService = {
  /**
   * Récupération du profil utilisateur
   * @returns {Promise} Promesse avec les données utilisateur
   */
  getProfile: () => {
    return axios.get('/users/profile');
  },

  /**
   * Mise à jour du profil utilisateur
   * @param {Object} userData - Nouvelles données utilisateur
   * @returns {Promise} Promesse avec les données utilisateur mises à jour
   */
  updateProfile: (userData) => {
    return axios.put('/users/profile', userData);
  },

  /**
   * Changement du mot de passe
   * @param {Object} passwordData - Données de changement de mot de passe
   * @returns {Promise} Promesse avec statut du changement
   */
  changePassword: (passwordData) => {
    return axios.put('/users/change-password', passwordData);
  },

  /**
   * Récupération des utilisateurs (pour rôles admin seulement)
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Promesse avec liste d'utilisateurs
   */
  getUsers: (params = {}) => {
    return axios.get('/users', { params });
  }
};

// ===== SERVICE DE GESTION DES PRODUITS =====
export const productService = {
  /**
   * Récupération du catalogue de produits
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Promesse avec liste de produits
   */
  getProducts: (params = {}) => {
    return axios.get('/products', { params });
  },

  /**
   * Récupération d'un produit par son ID
   * @param {String} id - ID du produit
   * @returns {Promise} Promesse avec les détails du produit
   */
  getProductById: (id) => {
    return axios.get(`/products/${id}`);
  },

  /**
   * Ajout d'un nouveau produit (pour rôles admin/commercial)
   * @param {Object} productData - Données du produit
   * @returns {Promise} Promesse avec le produit créé
   */
  createProduct: (productData) => {
    return axios.post('/products', productData);
  },

  /**
   * Mise à jour d'un produit (pour rôles admin/commercial)
   * @param {String} id - ID du produit
   * @param {Object} productData - Nouvelles données du produit
   * @returns {Promise} Promesse avec le produit mis à jour
   */
  updateProduct: (id, productData) => {
    return axios.put(`/products/${id}`, productData);
  },

  /**
   * Suppression d'un produit (pour rôles admin/commercial)
   * @param {String} id - ID du produit
   * @returns {Promise} Promesse avec statut de suppression
   */
  deleteProduct: (id) => {
    return axios.delete(`/products/${id}`);
  },

  /**
   * Récupération des catégories de produits
   * @returns {Promise} Promesse avec liste de catégories
   */
  getCategories: () => {
    return axios.get('/products/categories');
  }
};

// ===== SERVICE DE GESTION DES DEVIS =====
export const quoteService = {
  /**
   * Récupération des devis (filtrés selon le rôle)
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Promesse avec liste de devis
   */
  getQuotes: (params = {}) => {
    return axios.get('/quotes', { params });
  },

  /**
   * Récupération d'un devis par son ID
   * @param {String} id - ID du devis
   * @returns {Promise} Promesse avec les détails du devis
   */
  getQuoteById: (id) => {
    return axios.get(`/quotes/${id}`);
  },

  /**
   * Création d'un nouveau devis
   * @param {Object} quoteData - Données du devis
   * @returns {Promise} Promesse avec le devis créé
   */
  createQuote: (quoteData) => {
    return axios.post('/quotes', quoteData);
  },

  /**
   * Mise à jour d'un devis
   * @param {String} id - ID du devis
   * @param {Object} quoteData - Nouvelles données du devis
   * @returns {Promise} Promesse avec le devis mis à jour
   */
  updateQuote: (id, quoteData) => {
    return axios.put(`/quotes/${id}`, quoteData);
  },

  /**
   * Suppression d'un devis
   * @param {String} id - ID du devis
   * @returns {Promise} Promesse avec statut de suppression
   */
  deleteQuote: (id) => {
    return axios.delete(`/quotes/${id}`);
  },

  /**
   * Acceptation d'un devis
   * @param {String} id - ID du devis
   * @returns {Promise} Promesse avec le devis mis à jour
   */
  acceptQuote: (id) => {
    return axios.put(`/quotes/${id}/accept`);
  },

  /**
   * Refus d'un devis
   * @param {String} id - ID du devis
   * @param {Object} data - Données de refus (raison, etc.)
   * @returns {Promise} Promesse avec le devis mis à jour
   */
  rejectQuote: (id, data = {}) => {
    return axios.put(`/quotes/${id}/reject`, data);
  }
};

// ===== SERVICE DE GESTION DES COMMANDES =====
export const orderService = {
  /**
   * Récupération des commandes (filtrées selon le rôle)
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Promesse avec liste de commandes
   */
  getOrders: (params = {}) => {
    return axios.get('/orders', { params });
  },

  /**
   * Récupération d'une commande par son ID
   * @param {String} id - ID de la commande
   * @returns {Promise} Promesse avec les détails de la commande
   */
  getOrderById: (id) => {
    return axios.get(`/orders/${id}`);
  },

  /**
   * Création d'une nouvelle commande
   * @param {Object} orderData - Données de la commande
   * @returns {Promise} Promesse avec la commande créée
   */
  createOrder: (orderData) => {
    return axios.post('/orders', orderData);
  },

  /**
   * Mise à jour d'une commande
   * @param {String} id - ID de la commande
   * @param {Object} orderData - Nouvelles données de la commande
   * @returns {Promise} Promesse avec la commande mise à jour
   */
  updateOrder: (id, orderData) => {
    return axios.put(`/orders/${id}`, orderData);
  },

  /**
   * Annulation d'une commande
   * @param {String} id - ID de la commande
   * @param {Object} data - Données d'annulation (raison, etc.)
   * @returns {Promise} Promesse avec la commande mise à jour
   */
  cancelOrder: (id, data = {}) => {
    return axios.put(`/orders/${id}/cancel`, data);
  },

  /**
   * Téléchargement du bon de livraison
   * @param {String} id - ID de la commande
   * @returns {Promise} Promesse avec le fichier PDF
   */
  downloadDeliveryNote: (id) => {
    return axios.get(`/orders/${id}/delivery-note`, {
      responseType: 'blob'
    });
  },

  /**
   * Signalement d'un problème sur une commande
   * @param {String} id - ID de la commande
   * @param {Object} issueData - Données du problème
   * @returns {Promise} Promesse avec la commande mise à jour
   */
  reportIssue: (id, issueData) => {
    return axios.post(`/orders/${id}/issues`, issueData);
  }
};

// ===== SERVICE DE GESTION DES LIVRAISONS =====
export const deliveryService = {
  /**
   * Récupération des livraisons (filtrées selon le rôle)
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Promesse avec liste de livraisons
   */
  getDeliveries: (params = {}) => {
    return axios.get('/deliveries', { params });
  },

  /**
   * Récupération d'une livraison par son ID
   * @param {String} id - ID de la livraison
   * @returns {Promise} Promesse avec les détails de la livraison
   */
  getDeliveryById: (id) => {
    return axios.get(`/deliveries/${id}`);
  },

  /**
   * Mise à jour du statut d'une livraison
   * @param {String} id - ID de la livraison
   * @param {Object} statusData - Données de mise à jour du statut
   * @returns {Promise} Promesse avec la livraison mise à jour
   */
  updateDeliveryStatus: (id, statusData) => {
    return axios.put(`/deliveries/${id}/status`, statusData);
  },

  /**
   * Génération des QR codes pour les palettes d'une livraison
   * @param {String} id - ID de la livraison
   * @returns {Promise} Promesse avec les QR codes générés
   */
  generateQRCodes: (id) => {
    return axios.get(`/deliveries/${id}/qr-codes`);
  }
};

// ===== SERVICE DE GESTION DES STOCKS =====
export const stockService = {
  /**
   * Récupération des stocks (filtrés selon le rôle)
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Promesse avec les niveaux de stock
   */
  getStocks: (params = {}) => {
    return axios.get('/stocks', { params });
  },

  /**
   * Récupération du stock d'un produit
   * @param {String} productId - ID du produit
   * @returns {Promise} Promesse avec le niveau de stock
   */
  getProductStock: (productId) => {
    return axios.get(`/stocks/products/${productId}`);
  },

  /**
   * Mise à jour du niveau de stock
   * @param {String} productId - ID du produit
   * @param {Object} stockData - Données de mise à jour du stock
   * @returns {Promise} Promesse avec le stock mis à jour
   */
  updateStock: (productId, stockData) => {
    return axios.put(`/stocks/products/${productId}`, stockData);
  },

  /**
   * Récupération de l'historique des mouvements de stock
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Promesse avec l'historique des mouvements
   */
  getStockHistory: (params = {}) => {
    return axios.get('/stocks/history', { params });
  }
};

// ===== SERVICE DE GESTION DES INVENDUS =====
export const unsoldService = {
  /**
   * Récupération des déclarations d'invendus
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Promesse avec liste des déclarations
   */
  getUnsoldDeclarations: (params = {}) => {
    return axios.get('/unsold', { params });
  },

  /**
   * Récupération d'une déclaration d'invendus par son ID
   * @param {String} id - ID de la déclaration
   * @returns {Promise} Promesse avec les détails de la déclaration
   */
  getUnsoldDeclarationById: (id) => {
    return axios.get(`/unsold/${id}`);
  },

  /**
   * Création d'une nouvelle déclaration d'invendus
   * @param {Object} declarationData - Données de la déclaration
   * @returns {Promise} Promesse avec la déclaration créée
   */
  createUnsoldDeclaration: (declarationData) => {
    return axios.post('/unsold', declarationData);
  },

  /**
   * Mise à jour d'une déclaration d'invendus
   * @param {String} id - ID de la déclaration
   * @param {Object} declarationData - Nouvelles données de la déclaration
   * @returns {Promise} Promesse avec la déclaration mise à jour
   */
  updateUnsoldDeclaration: (id, declarationData) => {
    return axios.put(`/unsold/${id}`, declarationData);
  }
};

// Export d'un objet unifié pour un accès plus simple
export default {
  auth: authService,
  users: userService,
  products: productService,
  quotes: quoteService,
  orders: orderService,
  deliveries: deliveryService,
  stocks: stockService,
  unsold: unsoldService
};
