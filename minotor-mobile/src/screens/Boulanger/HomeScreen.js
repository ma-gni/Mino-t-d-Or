import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BoulangerHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accueil Boulanger</Text>
      <Text style={styles.subtitle}>Bienvenue 👨‍🍳</Text>
      {/* Tu pourras ajouter ici les commandes, invendus, produits, etc. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#777' },
});
