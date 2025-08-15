import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { apiService } from '../services/api';

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized || Platform.OS === 'web') {
      return;
    }

    try {
      // Configuration du handler de notifications
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // Demander les permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('✅ Permissions de notifications accordées');
      } else {
        console.log('⚠️ Permissions de notifications refusées');
      }

      this.isInitialized = true;
    } catch (error) {
      console.log('❌ Erreur lors de l\'initialisation des notifications:', error);
    }
  }

  public async scheduleNotification(title: string, body: string, data?: any): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('📱 Notification simulée (web):', { title, body, data });
      return;
    }

    try {
      await this.initialize();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Notification immédiate
      });
      
      console.log('✅ Notification programmée:', title);
    } catch (error) {
      console.log('❌ Erreur lors de la programmation de notification:', error);
    }
  }

  public async sendDeliveryNotification(message: string): Promise<void> {
    try {
      // Envoyer la notification locale
      await this.scheduleNotification(
        'Mise à jour de livraison',
        message,
        { type: 'delivery' }
      );

      // Envoyer la notification au backend
      await apiService.sendNotification({
        title: 'Mise à jour de livraison',
        message: message,
        type: 'delivery'
      });
      
      console.log('✅ Notification de livraison envoyée:', message);
    } catch (error) {
      console.log('❌ Erreur lors de l\'envoi de notification de livraison:', error);
    }
  }

  public async sendLoginNotification(username: string): Promise<void> {
    try {
      // Envoyer la notification locale
      await this.scheduleNotification(
        'Connexion réussie',
        `Bienvenue ${username} !`,
        { username, type: 'login' }
      );

      // Envoyer la notification au backend
      await apiService.sendNotification({
        title: 'Connexion réussie',
        message: `Bienvenue ${username} !`,
        type: 'login'
      });
      
      console.log('✅ Notification de connexion envoyée:', username);
    } catch (error) {
      console.log('❌ Erreur lors de l\'envoi de notification de connexion:', error);
    }
  }

  public async getNotifications(): Promise<any[]> {
    try {
      const notifications = await apiService.getNotifications();
      return notifications;
    } catch (error) {
      console.log('❌ Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }

  public async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await apiService.markNotificationAsRead(notificationId);
      console.log('✅ Notification marquée comme lue:', notificationId);
    } catch (error) {
      console.log('❌ Erreur lors du marquage de notification:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance(); 