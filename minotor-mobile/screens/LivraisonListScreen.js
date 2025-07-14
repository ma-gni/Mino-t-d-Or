import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getLivraisonsLivreur } from '../services/api';

export default function LivraisonListScreen({ navigation }) {
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLivraisons() {
      const data = await getLivraisonsLivreur();
      setLivraisons(data);
      setLoading(false);
    }
    fetchLivraisons();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={livraisons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Detail', { livraison: item })}
          >
            <Text style={styles.client}>{item.client}</Text>
            <Text style={styles.adresse}>{item.adresse}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune livraison disponible.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  client: {
    fontWeight: '700',
    fontSize: 16,
  },
  adresse: {
    color: '#555',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
