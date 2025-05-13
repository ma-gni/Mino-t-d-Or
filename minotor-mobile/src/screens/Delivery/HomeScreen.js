import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DeliveryHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accueil Livreur</Text>
      <Text style={styles.subtitle}>Bienvenue 👋</Text>
      {/* Tu pourras ajouter ici un résumé des livraisons, bouton scan, etc. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#777' },
});
