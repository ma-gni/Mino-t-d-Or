import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Linking,
  Platform
} from 'react-native';
import * as Location from 'expo-location';
import { DeliveryTrackingScreenProps } from '../types/navigation';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';
import { notificationService } from '../utils/notifications';

const DeliveryTrackingScreen = ({ route, navigation }: DeliveryTrackingScreenProps) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const { userToken } = useContext(AuthContext);
  
  // Si un ID de livraison est passé en paramètre
  const deliveryId = route.params?.deliveryId;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Demander les permissions de localisation
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission de localisation refusée');
          Alert.alert(
            'Permission refusée', 
            'La localisation est nécessaire pour suivre les livraisons.'
          );
          return;
        }

        // Obtenir la position actuelle
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setLocation(currentLocation);
        
        // Envoyer la position initiale au backend
        if (deliveryId) {
          await updateLocationOnServer(currentLocation);
        }
        
      } catch (error) {
        console.error('Erreur de localisation:', error);
        setErrorMsg('Impossible d\'obtenir la localisation');
      } finally {
        setLoading(false);
      }
    })();
    
    // Configurer un écouteur de localisation en temps réel
    const locationSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,  // Mise à jour toutes les 10 secondes
        distanceInterval: 50  // ou après 50 mètres de déplacement
      },
      async (newLocation) => {
        setLocation(newLocation);
        
        // Envoyer la nouvelle position au backend
        if (deliveryId) {
          await updateLocationOnServer(newLocation);
        }
      }
    );

    // Nettoyage lors du démontage du composant
    return () => {
      // Annuler l'abonnement à la localisation
      locationSubscription.then(sub => sub.remove());
    };
  }, [deliveryId]);

  // Fonction pour mettre à jour la position sur le serveur
  const updateLocationOnServer = async (locationData: Location.LocationObject) => {
    try {
      setUpdatingLocation(true);
      console.log('📍 Mise à jour de position:', locationData.coords);
      
      await apiService.updateLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
        accuracy: locationData.coords.accuracy || 0,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Position mise à jour avec succès');
      
      // Envoyer une notification de mise à jour
      await notificationService.sendDeliveryNotification(
        `Position mise à jour à ${new Date().toLocaleTimeString()}`
      );
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de position:', error);
      // Ne pas afficher d'alerte pour éviter de spammer l'utilisateur
    } finally {
      setUpdatingLocation(false);
    }
  };

  // Fonction pour partager manuellement la position
  const shareLocation = async () => {
    if (!location) {
      Alert.alert('Erreur', 'Position non disponible');
      return;
    }
    
    try {
      setUpdatingLocation(true);
      await updateLocationOnServer(location);
      Alert.alert('✅ Succès', 'Position partagée avec succès !');
    } catch (error: any) {
      Alert.alert('❌ Erreur', 'Impossible de partager la position');
    } finally {
      setUpdatingLocation(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Ouvrir l'application de carte native avec les coordonnées
  const openInMaps = () => {
    if (!location) return;
    
    const { latitude, longitude } = location.coords;
    const url = Platform.select({
      ios: `maps:?q=Ma+Position@${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(Ma+Position)`,
    }) || `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir les cartes sur votre appareil');
      }
    }).catch(err => {
      console.error('Erreur lors de l\'ouverture des cartes:', err);
      Alert.alert('Erreur', 'Impossible d\'ouvrir les cartes sur votre appareil');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Suivi en Temps Réel 📍</Text>
        {deliveryId && (
          <Text style={styles.subtitle}>Livraison #{deliveryId}</Text>
        )}
        {updatingLocation && (
          <Text style={styles.updatingText}>Mise à jour en cours...</Text>
        )}
      </View>
      
      {location ? (
        <View style={styles.locationContainer}>
          <View style={styles.mapPlaceholder}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png'
              }}
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>Position actuelle détectée</Text>
            
            <TouchableOpacity 
              style={styles.openMapsButton}
              onPress={openInMaps}
            >
              <Text style={styles.openMapsButtonText}>Ouvrir dans l'application Cartes</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesTitle}>Vos coordonnées actuelles :</Text>
            <Text style={styles.coordinatesText}>
              Latitude: {location.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Longitude: {location.coords.longitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Précision: ±{Math.round(location.coords.accuracy || 0)} mètres
            </Text>
            <Text style={styles.lastUpdatedText}>
              Dernière mise à jour: {new Date().toLocaleTimeString()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.notifyButton, updatingLocation && styles.disabledButton]}
            onPress={shareLocation}
            disabled={updatingLocation}
          >
            <Text style={styles.notifyButtonText}>
              {updatingLocation ? 'Partage en cours...' : 'Partager ma position'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.infoText}>Localisation en cours...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.large,
  },
  headerContainer: {
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
    fontSize: FONTS.regular,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.tiny,
  },
  updatingText: {
    fontSize: FONTS.small,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: SPACING.tiny,
    fontStyle: 'italic',
  },
  locationContainer: {
    flex: 1,
    padding: SPACING.medium,
  },
  mapPlaceholder: {
    backgroundColor: `${COLORS.primary}10`,
    height: 200,
    borderRadius: BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.medium,
    ...SHADOWS.small,
  },
  locationIcon: {
    width: 60,
    height: 60,
    tintColor: COLORS.primary,
    marginBottom: SPACING.medium,
  },
  locationText: {
    fontSize: FONTS.medium,
    color: COLORS.dark,
    fontWeight: FONTS.semiBold,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  openMapsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.large,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOWS.small,
  },
  openMapsButtonText: {
    color: COLORS.white,
    fontSize: FONTS.small,
    fontWeight: FONTS.semiBold,
  },
  coordinatesContainer: {
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.medium,
    ...SHADOWS.small,
  },
  coordinatesTitle: {
    fontSize: FONTS.regular,
    fontWeight: FONTS.bold,
    color: COLORS.dark,
    marginBottom: SPACING.small,
  },
  coordinatesText: {
    fontSize: FONTS.small,
    color: COLORS.dark,
    marginBottom: SPACING.tiny,
  },
  lastUpdatedText: {
    fontSize: FONTS.extraSmall,
    color: COLORS.gray,
    marginTop: SPACING.small,
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: FONTS.regular,
    color: COLORS.gray,
    marginTop: SPACING.medium,
  },
  errorText: {
    fontSize: FONTS.regular,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.large,
    borderRadius: BORDER_RADIUS.medium,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.regular,
    fontWeight: FONTS.semiBold,
  },
  infoText: {
    fontSize: FONTS.regular,
    color: COLORS.gray,
  },
  notifyButton: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
    opacity: 0.6,
  },
  notifyButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.semiBold,
    fontSize: FONTS.regular,
  },
});

export default DeliveryTrackingScreen;
