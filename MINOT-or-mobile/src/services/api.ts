import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, getApiTimeout } from '../config/environment';

// Configuration de l'API
const API_BASE_URL = getApiBaseUrl();
const API_TIMEOUT = getApiTimeout();

// Types pour les réponses API
interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

interface Delivery {
  id: number;
  orderId: number;
  status: string;
  address: string;
  clientName?: string;
  clientPhone?: string;
  city?: string;
  postalCode?: string;
  deliveryDate?: string;
  products?: Product[];
  qrCode?: string;
  latitude?: number;
  longitude?: number;
}

interface Product {
  id: number;
  name: string;
  quantity: number;
  price?: number;
  unit?: string;
}

interface DriverStats {
  driverId: number;
  driverName: string;
  totalDeliveries: number;
  completedThisWeek: number;
  pendingDeliveries: number;
  averageRating: number;
  totalDistance: number;
  averageDeliveryTime: number;
  recentDeliveries: Delivery[];
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  address?: string;
  deliveryId?: number;
}

interface NotificationData {
  title: string;
  message: string;
  type: string;
  data?: any;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// Classe principale pour les appels API
class ApiService {
  private token: string | null = null;

  // Initialiser le token depuis le stockage
  async initialize() {
    try {
      this.token = await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
  }

  // Définir le token
  setToken(token: string) {
    this.token = token;
  }

  // Obtenir les headers avec authentification
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Méthode générique pour les appels API avec timeout
  private async apiCall<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      // Logs de debug
      console.log('🔗 API Call:', `${API_BASE_URL}${endpoint}`);
      console.log('📋 Method:', method);
      console.log('🔑 Headers:', this.getHeaders());
      if (body) {
        console.log('📦 Body:', JSON.stringify(body, null, 2));
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('📡 Response Status:', response.status);
      console.log('📡 Response Headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      return data;
    } catch (error: any) {
      console.error(`❌ Erreur API ${endpoint}:`, error);
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout détecté');
        throw new Error('Timeout: La requête a pris trop de temps');
      }
      throw error;
    }
  }

  // Authentification
  async login(username: string, password: string): Promise<LoginResponse> {
    return this.apiCall<LoginResponse>('/auth/login', 'POST', { username, password });
  }

  async register(userData: {
    username: string;
    password: string;
    email: string;
    address: string;
  }): Promise<any> {
    return this.apiCall('/auth/register', 'POST', userData);
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('userToken');
    this.token = null;
  }

  // Livraisons
  async getActiveDeliveries(): Promise<Delivery[]> {
    return this.apiCall<Delivery[]>('/mobile/deliveries');
  }

  async getDeliveryDetails(deliveryId: number): Promise<Delivery> {
    return this.apiCall<Delivery>(`/mobile/deliveries/${deliveryId}`);
  }

  async confirmDelivery(deliveryId: number): Promise<ApiResponse<Delivery>> {
    return this.apiCall<ApiResponse<Delivery>>(`/mobile/deliveries/${deliveryId}/confirm`, 'POST');
  }

  // Localisation
  async updateLocation(locationData: LocationData): Promise<ApiResponse<any>> {
    return this.apiCall<ApiResponse<any>>('/mobile/location', 'POST', locationData);
  }

  // Statistiques
  async getDriverStats(driverId: number): Promise<DriverStats> {
    return this.apiCall<DriverStats>(`/mobile/drivers/${driverId}/stats`);
  }

  // QR Code
  async scanQRCode(qrCode: string): Promise<ApiResponse<Delivery>> {
    return this.apiCall<ApiResponse<Delivery>>('/mobile/qr/scan', 'POST', { qrCode });
  }

  async generateQRCode(deliveryId: number): Promise<ApiResponse<any>> {
    return this.apiCall<ApiResponse<any>>(`/mobile/qr/generate/${deliveryId}`, 'POST');
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    return this.apiCall<any[]>('/mobile/notifications');
  }

  async markNotificationAsRead(notificationId: number): Promise<ApiResponse<any>> {
    return this.apiCall<ApiResponse<any>>(`/mobile/notifications/${notificationId}/read`, 'POST');
  }

  async sendNotification(notificationData: NotificationData): Promise<ApiResponse<any>> {
    return this.apiCall<ApiResponse<any>>('/mobile/notifications/send', 'POST', notificationData);
  }

  // Utilisateurs
  async getUserInfo(username: string): Promise<any> {
    return this.apiCall(`/mobile/users/${username}`);
  }

  // Commandes
  async getAllOrders(): Promise<any[]> {
    return this.apiCall<any[]>('/mobile/orders');
  }

  async getOrderById(orderId: number): Promise<any> {
    return this.apiCall(`/mobile/orders/${orderId}`);
  }

  // Produits
  async getAllProducts(): Promise<Product[]> {
    return this.apiCall<Product[]>('/mobile/products');
  }

  async getProductById(productId: number): Promise<Product> {
    return this.apiCall<Product>(`/mobile/products/${productId}`);
  }

  // Vérification de connexion
  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/actuator/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    }
  }

  getBaseUrl(): string {
    return API_BASE_URL;
  }

  getTimeout(): number {
    return API_TIMEOUT;
  }
}

export const apiService = new ApiService(); 