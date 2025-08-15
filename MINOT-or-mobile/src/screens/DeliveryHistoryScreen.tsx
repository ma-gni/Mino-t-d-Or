import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  RefreshControl
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { DeliveryHistoryScreenProps } from '../types/navigation';
import { Delivery } from '../types/models';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import StatusBadge from '../components/common/StatusBadge';
import * as Notifications from 'expo-notifications';

const DeliveryHistoryScreen = ({ navigation }: DeliveryHistoryScreenProps) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userToken } = useContext(AuthContext);

  // Fonction pour charger l'historique des livraisons
  const fetchDeliveryHistory = async () => {
    try {
      setLoading(true);
      
      // Simulation de données pour la démonstration
      // Dans un environnement réel, nous ferions un appel API à '/api/deliveries/history'
      setTimeout(() => {
        const mockDeliveries: Delivery[] = [
          {
            id: 101,
            clientName: 'Boulangerie Dubois',
            clientPhone: '0612345678',
            address: '15 Rue des Artisans',
            city: 'Lyon',
            postalCode: '69001',
            deliveryDate: new Date('2025-04-28').toISOString(),
            status: 'delivered',
            products: [
              { id: 1, name: 'Farine T65', quantity: 150 },
              { id: 2, name: 'Farine de Seigle', quantity: 50 }
            ]
          },
          {
            id: 102,
            clientName: 'Pâtisserie Martin',
            clientPhone: '0687654321',
            address: '8 Avenue Centrale',
            city: 'Lyon',
            postalCode: '69002',
            deliveryDate: new Date('2025-05-02').toISOString(),
            status: 'delivered',
            products: [
              { id: 3, name: 'Farine T45', quantity: 100 },
              { id: 4, name: 'Farine T55', quantity: 200 }
            ]
          },
          {
            id: 103,
            clientName: 'Boulangerie Petit',
            clientPhone: '0678901234',
            address: '22 Rue Marchand',
            city: 'Villeurbanne',
            postalCode: '69100',
            deliveryDate: new Date('2025-05-05').toISOString(),
            status: 'delivered',
            products: [
              { id: 1, name: 'Farine T65', quantity: 100 },
              { id: 5, name: 'Farine Complète', quantity: 75 }
            ]
          },
          {
            id: 104,
            clientName: 'Artisan Boulangers Associés',
            clientPhone: '0654321098',
            address: '45 Rue Commerciale',
            city: 'Lyon',
            postalCode: '69003',
            deliveryDate: new Date('2025-05-08').toISOString(),
            status: 'delivered',
            products: [
              { id: 2, name: 'Farine de Seigle', quantity: 50 },
              { id: 6, name: 'Farine de Maïs', quantity: 25 }
            ]
          }
        ];

        setDeliveries(mockDeliveries);
        setLoading(false);
        setRefreshing(false);
        
        // Envoi d'une notification pour indiquer que l'historique a été chargé
        sendNotification();
      }, 1500);
      
      // Code pour l'API réelle (commenté pour la démonstration)
      /*
      const response = await fetch('http://10.0.2.2:8080/api/deliveries/history', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDeliveries(data);
      } else {
        Alert.alert('Erreur', 'Impossible de récupérer l\'historique des livraisons');
      }
      setLoading(false);
      setRefreshing(false);
      */
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique', error);
      Alert.alert('Erreur', 'Problème de connexion au serveur');
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fonction pour envoyer une notification
  const sendNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Historique mis à jour 📚",
          body: "L'historique des livraisons a été chargé avec succès.",
        },
        trigger: null, // Notification immédiate
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  };

  useEffect(() => {
    fetchDeliveryHistory();
    
    // Actualiser la liste quand on revient à cet écran
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDeliveryHistory();
    });
    
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDeliveryHistory();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const renderItem = ({ item }: { item: Delivery }) => (
    <TouchableOpacity 
      style={styles.deliveryCard}
      onPress={() => navigation.navigate('DeliveryDetails', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        <StatusBadge status={item.status} />
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.city}>{item.postalCode} {item.city}</Text>
        
        {item.products && (
          <Text style={styles.products}>
            {item.products.length} produit(s)
          </Text>
        )}
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.date}>
          Livré le {formatDate(item.deliveryDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement de l'historique...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique des livraisons</Text>
        <Text style={styles.subtitle}>Consultez vos livraisons passées</Text>
      </View>
      
      {deliveries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune livraison dans l'historique</Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    ...SHADOWS.small,
  },
  title: {
    fontSize: FONTS.large,
    fontWeight: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.tiny,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.medium,
    fontSize: FONTS.regular,
    color: COLORS.gray,
  },
  listContainer: {
    padding: SPACING.medium,
  },
  deliveryCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  clientName: {
    fontSize: FONTS.medium,
    fontWeight: FONTS.bold,
    color: COLORS.dark,
  },
  cardBody: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: SPACING.small,
    marginBottom: SPACING.small,
  },
  address: {
    fontSize: FONTS.regular,
    color: COLORS.dark,
  },
  city: {
    fontSize: FONTS.regular,
    color: COLORS.gray,
    marginBottom: SPACING.tiny,
  },
  products: {
    fontSize: FONTS.small,
    color: COLORS.primary,
    marginTop: SPACING.tiny,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: FONTS.small,
    fontWeight: FONTS.semiBold,
    color: COLORS.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.regular,
    color: COLORS.gray,
  },
});

export default DeliveryHistoryScreen;
