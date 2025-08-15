import { Alert } from 'react-native';
import apiService from '../services/api';

export const testBackendConnection = async () => {
  try {
    console.log('🔍 Test de connexion au backend...');
    
    const isConnected = await apiService.checkConnection();
    
    if (isConnected) {
      console.log('✅ Backend accessible');
      Alert.alert(
        'Connexion OK', 
        'Le backend est accessible et fonctionne correctement.',
        [{ text: 'OK' }]
      );
    } else {
      console.log('❌ Backend inaccessible');
      Alert.alert(
        'Erreur de Connexion', 
        'Le backend n\'est pas accessible. Vérifiez que le serveur est démarré sur le port 8081.',
        [{ text: 'OK' }]
      );
    }
    
    return isConnected;
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:', error);
    Alert.alert(
      'Erreur de Test', 
      'Impossible de tester la connexion au backend.',
      [{ text: 'OK' }]
    );
    return false;
  }
};

export const getConnectionInfo = () => {
  return {
    baseUrl: apiService.getBaseUrl(),
    timeout: apiService.getTimeout(),
    fullUrl: `${apiService.getBaseUrl()}/auth/login`
  };
}; 