import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { notificationService } from './utils/notifications';

export default function App() {
  useEffect(() => {
    // Initialiser le service de notifications
    notificationService.initialize();
  }, []);

  return (
    <AuthProvider>
      <StatusBar backgroundColor="#3498db" />
      <AppNavigator />
    </AuthProvider>
  );
}
