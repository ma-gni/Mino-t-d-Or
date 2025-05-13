import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Page de sélection du rôle
import RoleSelectionScreen from '../screens/Auth/RoleSelectionScreen';

// Nouveau : on remplace les Home directement par des Stacks
import DeliveryStack from './DeliveryStack';
import BoulangerStack from './BoulangerStack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoleSelection" screenOptions={{ headerShown: false }}>
        {/* Page de sélection de rôle */}
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

        {/* Stack dédiée au livreur (remplace DeliveryHome directement) */}
        <Stack.Screen name="DeliveryStack" component={DeliveryStack} />

        {/* Stack dédiée au boulanger (remplace BoulangerHome directement) */}
        <Stack.Screen name="BoulangerStack" component={BoulangerStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
