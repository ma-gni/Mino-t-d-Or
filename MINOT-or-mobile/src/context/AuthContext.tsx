import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/models';
import { apiService } from '../services/api';
import { notificationService } from '../utils/notifications';

// Définir le type pour notre contexte
export type AuthContextType = {
  register: (data: any) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  userToken: string | null;
  user: User | null;
  loading: boolean;
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
};

// Créer le contexte
export const AuthContext = createContext<AuthContextType>({
  register: async () => {},
  login: async () => {},
  userToken: null,
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

// Provider du contexte
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté lors du lancement
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          setUserToken(token);
          setUser(JSON.parse(userData));
          // Initialiser le service API avec le token
          apiService.setToken(token);
        }
      } catch (e) {
        console.error('Erreur lors de la restauration du token', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = async (token: string, userData: any) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUserToken(token);
      setUser(userData);
      // Initialiser le service API avec le token
      apiService.setToken(token);
      
      // Envoyer une notification de succès
      await notificationService.sendLoginNotification(userData.username);
    } catch (e) {
      console.error('Erreur lors de la connexion', e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUser(null);
      // Déconnecter le service API
      await apiService.logout();
    } catch (e) {
      console.error('Erreur lors de la déconnexion', e);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('🔐 Tentative de connexion pour:', username);
      
      const response = await apiService.login(username, password);
      
      console.log('✅ Connexion réussie:', response.username);
      
      // Créer un objet utilisateur à partir de la réponse
      const userData: User = {
        id: Date.now(), // L'API ne retourne pas l'ID, on utilise un timestamp
        name: username,
        username: username,
        role: response.role,
      };
      
      await signIn(response.token, userData);
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      
      // Gestion détaillée des erreurs
      if (error.message?.includes('Timeout')) {
        throw new Error('Connexion au serveur trop lente. Vérifiez votre connexion internet.');
      } else if (error.message?.includes('401')) {
        throw new Error('Identifiants incorrects. Vérifiez votre nom d\'utilisateur et mot de passe.');
      } else if (error.message?.includes('404')) {
        throw new Error('Serveur non trouvé. Vérifiez que le backend est démarré.');
      } else if (error.message?.includes('500')) {
        throw new Error('Erreur serveur. Contactez l\'administrateur.');
      } else if (error.message?.includes('Network')) {
        throw new Error('Problème de connexion réseau. Vérifiez votre connexion internet.');
      } else {
        throw new Error('Erreur de connexion: ' + error.message);
      }
    }
  };

  const register = async (data: any) => {
    try {
      // Appeler l'API d'inscription
      await apiService.register({
        username: data.username,
        password: data.password,
        email: data.email,
        address: data.address,
      });
      
      // Après inscription réussie, connecter automatiquement
      await login(data.username, data.password);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userToken, 
      loading, 
      signIn, 
      signOut, 
      register,
      login 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
