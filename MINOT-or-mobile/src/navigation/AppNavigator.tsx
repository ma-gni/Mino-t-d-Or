import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { AuthContext } from '../context/AuthContext';

// Import des écrans
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DeliveryListScreen from '../screens/DeliveryListScreen';
import DeliveryDetailsScreen from '../screens/DeliveryDetailsScreen';
import ScanQRCodeScreen from '../screens/ScanQRCodeScreen';
import DeliveryTrackingScreen from '../screens/DeliveryTrackingScreen';
import DeliveryHistoryScreen from '../screens/DeliveryHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // Utilisation du contexte d'authentification au lieu de gérer l'état localement
  const { userToken, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={userToken ? "Home" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        {userToken ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Accueil' }} 
            />
            <Stack.Screen 
              name="DeliveryList" 
              component={DeliveryListScreen} 
              options={{ title: 'Liste des Livraisons' }} 
            />
            <Stack.Screen 
              name="DeliveryDetails" 
              component={DeliveryDetailsScreen} 
              options={{ title: 'Détails de Livraison' }} 
            />
            <Stack.Screen 
              name="ScanQRCode" 
              component={ScanQRCodeScreen} 
              options={{ title: 'Scanner QR Code' }} 
            />
            <Stack.Screen 
              name="DeliveryTracking" 
              component={DeliveryTrackingScreen} 
              options={{ title: 'Suivi en Temps Réel' }} 
            />
            <Stack.Screen 
              name="DeliveryHistory" 
              component={DeliveryHistoryScreen} 
              options={{ title: 'Historique des Livraisons' }} 
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: 'Mon Profil' }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default AppNavigator;
