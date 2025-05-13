import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeliveryHome from '../screens/Delivery/HomeScreen';

const Stack = createNativeStackNavigator();

export default function DeliveryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DeliveryHome" component={DeliveryHome} />
      {/* Tu peux ajouter d’autres écrans ici plus tard */}
    </Stack.Navigator>
  );
}
