import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  StatusBar
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ScanQRCodeScreenProps } from '../types/navigation';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import Button from '../components/common/Button';
import { apiService } from '../services/api';

const ScanQRCodeScreen = ({ navigation }: ScanQRCodeScreenProps) => {
  const [deliveryId, setDeliveryId] = useState('');
  const [loading, setLoading] = useState(false);
  const { userToken } = useContext(AuthContext);

  const handleManualSubmit = async () => {
    if (!deliveryId || isNaN(parseInt(deliveryId))) {
      Alert.alert('Erreur', 'Veuillez saisir un numéro de livraison valide');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Confirmation de livraison:', deliveryId);
      
      // Appel à l'API réelle
      const response = await apiService.confirmDelivery(parseInt(deliveryId));
      
      Alert.alert(
        '✅ Succès', 
        `Livraison #${deliveryId} confirmée avec succès`, 
        [
          { 
            text: 'Voir les détails', 
            onPress: () => navigation.navigate('DeliveryDetails', { deliveryId: parseInt(deliveryId) }) 
          },
          { 
            text: 'Retour à la liste', 
            onPress: () => navigation.navigate('DeliveryList') 
          }
        ]
      );
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la confirmation:', error);
      let errorMessage = 'Impossible de confirmer cette livraison';
      
      if (error.message?.includes('404')) {
        errorMessage = 'Livraison non trouvée. Vérifiez le numéro.';
      } else if (error.message?.includes('401')) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.message?.includes('400')) {
        errorMessage = 'Cette livraison ne peut pas être confirmée.';
      } else if (error.message?.includes('Timeout')) {
        errorMessage = 'Connexion lente. Vérifiez votre connexion internet.';
      }
      
      Alert.alert('❌ Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2932/2932801.png' }} 
            style={styles.qrIcon} 
          />
          <Text style={styles.title}>Confirmation de livraison</Text>
          <Text style={styles.subtitle}>Entrez le numéro de livraison</Text>
        </View>
        
        <View style={styles.formSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Normalement, vous scanneriez un QR code avec la caméra, mais pour cette démo, vous pouvez saisir directement le numéro de livraison.            
            </Text>
          </View>
          
          <Text style={styles.inputLabel}>Numéro de livraison</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1"
            value={deliveryId}
            onChangeText={setDeliveryId}
            keyboardType="numeric"
            maxLength={10}
          />
          
          <Button
            title={loading ? 'Confirmation en cours...' : 'Confirmer la livraison'}
            onPress={handleManualSubmit}
            disabled={loading}
            loading={loading}
            style={styles.confirmButton}
          />
          
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Exemples de numéros de démo :</Text>
            <TouchableOpacity onPress={() => setDeliveryId('1')} style={styles.exampleItem}>
              <Text style={styles.exampleText}>1 - Boulangerie Dupont</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeliveryId('2')} style={styles.exampleItem}>
              <Text style={styles.exampleText}>2 - Pâtisserie Martin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.large,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: SPACING.large,
    marginBottom: SPACING.large,
  },
  qrIcon: {
    width: 80,
    height: 80,
    tintColor: COLORS.primary,
    marginBottom: SPACING.medium,
  },
  title: {
    fontSize: FONTS.huge,
    fontWeight: FONTS.bold,
    color: COLORS.dark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.medium,
    color: COLORS.gray,
    marginTop: SPACING.small,
    textAlign: 'center',
  },
  formSection: {
    marginTop: SPACING.large,
  },
  infoCard: {
    backgroundColor: `${COLORS.info}15`,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginBottom: SPACING.large,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoIcon: {
    fontSize: FONTS.large,
    marginRight: SPACING.small,
  },
  infoText: {
    fontSize: FONTS.small,
    color: COLORS.dark,
    lineHeight: 20,
    flex: 1,
  },
  inputLabel: {
    fontSize: FONTS.regular,
    fontWeight: FONTS.semiBold,
    color: COLORS.dark,
    marginBottom: SPACING.small,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    fontSize: FONTS.large,
    fontWeight: FONTS.semiBold,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    textAlign: 'center',
    marginBottom: SPACING.medium,
    ...SHADOWS.small,
  },
  confirmButton: {
    marginTop: SPACING.medium,
  },
  examplesContainer: {
    marginTop: SPACING.large,
  },
  examplesTitle: {
    fontSize: FONTS.small,
    fontWeight: FONTS.semiBold,
    color: COLORS.gray,
    marginBottom: SPACING.small,
  },
  exampleItem: {
    backgroundColor: COLORS.white,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.small,
    marginBottom: SPACING.small,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  exampleText: {
    fontSize: FONTS.regular,
    color: COLORS.dark,
  },
  footer: {
    padding: SPACING.medium,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  cancelButton: {
    padding: SPACING.medium,
  },
  cancelText: {
    color: COLORS.primary,
    fontSize: FONTS.regular,
    fontWeight: FONTS.semiBold,
  },
});

export default ScanQRCodeScreen;
