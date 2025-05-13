import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RoleSelectionScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Minot'Or 👋</Text>
      <Text style={styles.subtitle}>Veuillez choisir votre rôle :</Text>

      {/* Navigation vers le stack du livreur */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DeliveryStack')}
      >
        <Text style={styles.buttonText}>Je suis Livreur 🚚</Text>
      </TouchableOpacity>

      {/* Navigation vers le stack du boulanger */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BoulangerStack')}
      >
        <Text style={styles.buttonText}>Je suis Boulanger 🥖</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 30 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
