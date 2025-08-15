import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  StatusBar
} from 'react-native';
import { DeliveryDetailsScreenProps } from '../types/navigation';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import Button from '../components/common/Button';
import { Delivery } from '../types/models';

const DeliveryDetailsScreen = ({ route, navigation }: DeliveryDetailsScreenProps) => {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userToken } = useContext(AuthContext);
  
  useEffect(() => {
    fetchDeliveryDetails();
  }, []);
  
  const fetchDeliveryDetails = async () => {
    try {
      // Utiliser l'API réelle pour récupérer les détails de la livraison
      const deliveryData = await apiService.getDeliveryDetails(deliveryId);
      setDelivery(deliveryData);
    } catch (error: any) {
      console.error('Erreur de récupération des détails:', error);
      
      // Gérer les différents types d'erreurs
      if (error.message?.includes('401')) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (error.message?.includes('404')) {
        setError('Livraison non trouvée');
      } else if (error.message?.includes('500')) {
        setError('Erreur serveur');
      } else {
        setError('Problème de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelivery = async () => {
    try {
      setLoading(true);
      
      // Utiliser l'API réelle pour confirmer la livraison
      await apiService.confirmDelivery(deliveryId);
      
      Alert.alert('Succès', 'Livraison confirmée avec succès', [
        { text: 'OK', onPress: () => navigation.navigate('DeliveryList') }
      ]);
    } catch (error: any) {
      console.error('Erreur de confirmation:', error);
      
      // Gérer les différents types d'erreurs
      if (error.message?.includes('401')) {
        Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
      } else if (error.message?.includes('404')) {
        Alert.alert('Erreur', 'Livraison non trouvée');
      } else if (error.message?.includes('500')) {
        Alert.alert('Erreur', 'Erreur serveur');
      } else {
        Alert.alert('Erreur', 'Problème de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDeliveryDetails}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return delivery ? (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Détails de la livraison #{delivery.id}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text style={styles.infoText}>
            Nom: {delivery.clientName || 'Non spécifié'}
          </Text>
          {delivery.clientPhone && (
            <Text style={styles.infoText}>
              Téléphone: {delivery.clientPhone}
            </Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse</Text>
          <Text style={styles.infoText}>{delivery.address}</Text>
          {delivery.city && (
            <Text style={styles.infoText}>
              {delivery.postalCode} {delivery.city}
            </Text>
          )}
        </View>
        
        {delivery.deliveryDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date de livraison</Text>
            <Text style={styles.infoText}>
              {new Date(delivery.deliveryDate).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        )}
        
        {delivery.products && delivery.products.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Produits</Text>
            {delivery.products.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productQuantity}>
                  Quantité: {product.quantity} {product.unit || 'unités'}
                </Text>
                {product.price && (
                  <Text style={styles.productPrice}>
                    Prix: {product.price}€
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statut</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
            <Text style={styles.statusText}>{getStatusText(delivery.status)}</Text>
          </View>
        </View>
        
        {delivery.status === 'pending' && (
          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={confirmDelivery}
            disabled={loading}
          >
            <Text style={styles.confirmButtonText}>
              {loading ? 'Confirmation...' : 'Confirmer la livraison'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  ) : null;
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#FFA500';
    case 'processing':
      return '#007AFF';
    case 'completed':
      return '#34C759';
    case 'cancelled':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'En attente';
    case 'processing':
      return 'En cours';
    case 'completed':
      return 'Terminée';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  productQuantity: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  productPrice: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeliveryDetailsScreen;
