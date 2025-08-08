/**
 * api.js
 * --------------------------------------------------
 * Service API centralisé pour l'application Minot'Or
 * 
 * Ce service gère tous les appels API avec :
 * - Gestion automatique des tokens JWT
 * - Gestion centralisée des erreurs
 * - Intercepteurs pour les requêtes/réponses
 * - Retry automatique en cas d'échec
 */

import axios from 'axios';

// Configuration de base
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Instance axios avec configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentative de rafraîchissement du token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token } = response.data;
          localStorage.setItem('authToken', token);
          
          // Retry de la requête originale
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnexion
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  },

  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur d\'inscription');
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};

// Service des produits
export const productService = {
  async getAllProducts(params = {}) {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des produits');
    }
  },

  async getProductById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du produit');
    }
  },

  async createProduct(productData) {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du produit');
    }
  },

  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du produit');
    }
  },

  async deleteProduct(id) {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du produit');
    }
  }
};

// Service des commandes
export const orderService = {
  async getAllOrders(params = {}) {
    try {
      const response = await apiClient.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des commandes');
    }
  },

  async getOrderById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement de la commande');
    }
  },

  async createOrder(orderData) {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de la commande');
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    }
  }
};

// Service des devis
export const quoteService = {
  async getAllQuotes(params = {}) {
    try {
      const response = await apiClient.get('/quotes', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des devis');
    }
  },

  async getQuoteById(id) {
    try {
      const response = await apiClient.get(`/quotes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement du devis');
    }
  },

  async createQuote(quoteData) {
    try {
      const response = await apiClient.post('/quotes', quoteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du devis');
    }
  },

  async updateQuoteStatus(id, status) {
    try {
      const response = await apiClient.patch(`/quotes/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    }
  }
};

// Service des utilisateurs
export const userService = {
  async getAllUsers(params = {}) {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    }
  },

  async getUserById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement de l\'utilisateur');
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    }
  },

  async deleteUser(id) {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    }
  }
};

// Service des stocks
export const stockService = {
  async getAllStocks(params = {}) {
    try {
      const response = await apiClient.get('/stocks', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des stocks');
    }
  },

  async updateStock(id, stockData) {
    try {
      const response = await apiClient.put(`/stocks/${id}`, stockData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du stock');
    }
  }
};

// Service des analytics
export const analyticsService = {
  async getAnalytics() {
    try {
      const response = await apiClient.get('/analytics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des analytics');
    }
  },

  async getOrderAnalytics() {
    try {
      const response = await apiClient.get('/analytics/orders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des analytics de commandes');
    }
  },

  async getProductAnalytics() {
    try {
      const response = await apiClient.get('/analytics/products');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du chargement des analytics de produits');
    }
  }
};

export default apiClient;
