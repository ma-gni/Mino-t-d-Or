 import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue Livreur 👋</Text>
      <Button
        title="📦 Voir mes livraisons"
        onPress={() => navigation.navigate('Livraisons')}
      />
      <View style={styles.spacer} />
      <Button
        title="🔍 Scanner un QR Code"
        onPress={() => navigation.navigate('Scanner')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    fontWeight: '600',
  },
  spacer: {
    height: 20,
  },
});

