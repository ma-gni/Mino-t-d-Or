import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { confirmerLivraison } from '../services/api';

export default function LivraisonDetailScreen({ route, navigation }) {
  const { livraison } = route.params;

  const handleConfirmerLivraison = async () => {
    const result = await confirmerLivraison(livraison.id);
    if (result.success) {
      Alert.alert('Succès', 'Livraison confirmée.');
      navigation.navigate('Livraisons');
    } else {
      Alert.alert('Erreur', 'Impossible de confirmer la livraison.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Client :</Text>
      <Text style={styles.value}>{livraison.client}</Text>

      <Text style={styles.label}>Adresse :</Text>
      <Text style={styles.value}>{livraison.adresse}</Text>

      <Text style={styles.label}>État :</Text>
      <Text style={styles.value}>{livraison.etat || 'En cours'}</Text>

      <View style={styles.spacer} />
      <Button title="Confirmer livraison" onPress={handleConfirmerLivraison} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: '700',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  spacer: {
    height: 30,
  },
});
