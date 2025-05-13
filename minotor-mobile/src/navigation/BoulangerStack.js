import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoulangerHome from '../screens/Boulanger/HomeScreen';

const Stack = createNativeStackNavigator();

export default function BoulangerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BoulangerHome" component={BoulangerHome} />
      {/* Tu pourras ajouter d’autres écrans ici plus tard */}
    </Stack.Navigator>
  );
}
