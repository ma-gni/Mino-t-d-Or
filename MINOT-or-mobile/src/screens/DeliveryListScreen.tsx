import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Alert
} from 'react-native';
import { DeliveryListScreenProps } from '../types/navigation';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Delivery } from '../types/models';
import StatusBadge from '../components/common/StatusBadge';

const DeliveryListScreen = ({ navigation }: DeliveryListScreenProps) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userToken } = useContext(AuthContext);

  const fetchDeliveries = async () => {
    try {
      // Utiliser l'API réelle pour récupérer les livraisons actives
      const activeDeliveries = await apiService.getActiveDeliveries();
      setDeliveries(activeDeliveries);
      setLoading(false);
      setRefreshing(false);
    } catch (error: any) {
      console.error('Erreur de récupération des livraisons:', error);
      
      // Gérer les différents types d'erreurs
      if (error.message?.includes('401')) {
        Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
      } else if (error.message?.includes('404')) {
        Alert.alert('Erreur', 'Aucune livraison trouvée');
      } else if (error.message?.includes('500')) {
        Alert.alert('Erreur', 'Erreur serveur');
      } else {
        Alert.alert('Erreur', 'Problème de connexion au serveur');
      }
      
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDeliveries();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { text: 'En attente', color: '#FFA500' };
      case 'processing':
        return { text: 'En cours', color: '#007AFF' };
      case 'completed':
        return { text: 'Terminée', color: '#34C759' };
      case 'cancelled':
        return { text: 'Annulée', color: '#FF3B30' };
      default:
        return { text: status, color: '#8E8E93' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderItem = ({ item }: { item: Delivery }) => (
    <TouchableOpacity 
      style={styles.deliveryCard}
      onPress={() => navigation.navigate('DeliveryDetails', { deliveryId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.clientName}>{item.clientName || 'Client'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBadge(item.status).color }]}>
          <Text style={styles.statusText}>{getStatusBadge(item.status).text}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Adresse:</Text>
          <Text style={styles.infoValue}>{item.address}</Text>
        </View>
        
        {item.city && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ville:</Text>
            <Text style={styles.infoValue}>{item.city}</Text>
          </View>
        )}
        
        {item.deliveryDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{formatDate(item.deliveryDate)}</Text>
          </View>
        )}
        
        {item.products && item.products.length > 0 && (
          <View style={styles.productsContainer}>
            <Text style={styles.productsTitle}>Produits:</Text>
            {item.products.slice(0, 2).map((product, index) => (
              <Text key={index} style={styles.productItem}>
                • {product.name} ({product.quantity})
              </Text>
            ))}
            {item.products.length > 2 && (
              <Text style={styles.moreProducts}>+{item.products.length - 2} autres</Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.tapToView}>Appuyez pour voir les détails</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement des livraisons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {deliveries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune livraison disponible</Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  deliveryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  productsContainer: {
    marginTop: 10,
  },
  productsTitle: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productItem: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 2,
  },
  moreProducts: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  cardFooter: {
    alignItems: 'center',
    paddingTop: 10,
  },
  tapToView: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
});

export default DeliveryListScreen;
