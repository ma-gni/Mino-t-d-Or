import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { HomeScreenProps } from '../types/navigation';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import Button from '../components/common/Button';

const { width } = Dimensions.get('window');

interface MenuItemProps {
  title: string;
  icon: string;
  onPress: () => void;
  color?: string;
  count?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, onPress, color = COLORS.primary, count }) => (
  <TouchableOpacity 
    style={[styles.menuItem, { borderLeftColor: color }]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Image 
        source={{ uri: icon }} 
        style={[styles.icon, { tintColor: color }]} 
      />
    </View>
    <View style={styles.menuTextContainer}>
      <Text style={styles.menuText}>{title}</Text>
      {count !== undefined && (
        <View style={[styles.countBadge, { backgroundColor: color }]}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { signOut, user } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  
  // Données de démonstration
  const [deliveryStats, setDeliveryStats] = useState({
    pending: 5,
    inProgress: 3,
    completed: 12,
    total: 20
  });

  const handleLogout = async () => {
    await signOut();
  };
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simuler un chargement des données
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* En-tête avec profil utilisateur */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
        </View>
        <View style={styles.profileContainer}>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>{(user?.name || 'U').charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Carte de statistiques */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Aperçu des livraisons</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.warning}20` }]}>
                <Text style={[styles.statIcon, { color: COLORS.warning }]}>⌛</Text>
              </View>
              <Text style={styles.statValue}>{deliveryStats.pending}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.info}20` }]}>
                <Text style={[styles.statIcon, { color: COLORS.info }]}>🚚</Text>
              </View>
              <Text style={styles.statValue}>{deliveryStats.inProgress}</Text>
              <Text style={styles.statLabel}>En cours</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.success}20` }]}>
                <Text style={[styles.statIcon, { color: COLORS.success }]}>✓</Text>
              </View>
              <Text style={styles.statValue}>{deliveryStats.completed}</Text>
              <Text style={styles.statLabel}>Livrées</Text>
            </View>
          </View>
        </View>
        
        {/* Actions principales */}
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.menuGrid}>
          <MenuItem 
            title="Liste des livraisons" 
            icon="https://cdn-icons-png.flaticon.com/512/9683/9683722.png"
            onPress={() => navigation.navigate('DeliveryList')}
            count={deliveryStats.pending + deliveryStats.inProgress}
            color={COLORS.primary}
          />
          
          <MenuItem 
            title="Scanner QR Code" 
            icon="https://cdn-icons-png.flaticon.com/512/2932/2932801.png"
            onPress={() => navigation.navigate('ScanQRCode')}
            color={COLORS.secondary}
          />
          
          <MenuItem 
            title="Suivi GPS" 
            icon="https://cdn-icons-png.flaticon.com/512/2801/2801401.png"
            onPress={() => navigation.navigate('DeliveryTracking', { deliveryId: undefined })}
            color={COLORS.info}
          />
          
          <MenuItem 
            title="Historique" 
            icon="https://cdn-icons-png.flaticon.com/512/2874/2874770.png"
            onPress={() => navigation.navigate('DeliveryHistory')}
            color={COLORS.dark}
          />
        </View>
        
        {/* Autres options */}
        <Text style={styles.sectionTitle}>Autres fonctionnalités</Text>
        <View style={styles.menuGrid}>
          <MenuItem 
            title="Notifications" 
            icon="https://cdn-icons-png.flaticon.com/512/3602/3602123.png"
            onPress={() => {
              Alert.alert(
                'Notifications',
                'Vous serez notifié en temps réel des changements de statut des livraisons.',
                [{ text: 'OK', onPress: () => console.log('Notification modal closed') }]
              );
            }}
            count={2}
            color={COLORS.danger}
          />
          
          <MenuItem 
            title="Détails de livraison" 
            icon="https://cdn-icons-png.flaticon.com/512/3789/3789844.png"
            onPress={() => {
              if (deliveryStats.pending + deliveryStats.inProgress > 0) {
                navigation.navigate('DeliveryList');
              } else {
                Alert.alert('Info', 'Aucune livraison en cours pour le moment.');
              }
            }}
            color={COLORS.success}
          />
        </View>
        
        {/* Déconnexion */}
        <View style={styles.logoutContainer}>
          <Button 
            title="Se déconnecter" 
            onPress={handleLogout}
            type="outline"
          />
        </View>
        
        {/* Pied de page */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Minot'Or Mobile v1.0</Text>
          <Text style={styles.footerText}> 2025 Tous droits réservés</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.medium,
    backgroundColor: COLORS.primary,
  },
  greeting: {
    fontSize: FONTS.small,
    fontWeight: FONTS.normal,
    color: COLORS.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: FONTS.large,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: FONTS.large,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: SPACING.medium,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginBottom: SPACING.large,
    ...SHADOWS.medium,
  },
  statsTitle: {
    fontSize: FONTS.medium,
    fontWeight: FONTS.semiBold,
    color: COLORS.dark,
    marginBottom: SPACING.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  statIcon: {
    fontSize: FONTS.extraLarge,
  },
  statValue: {
    fontSize: FONTS.extraLarge,
    fontWeight: FONTS.bold,
    color: COLORS.dark,
  },
  statLabel: {
    fontSize: FONTS.small,
    color: COLORS.gray,
    marginTop: SPACING.tiny,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: FONTS.semiBold,
    color: COLORS.dark,
    marginBottom: SPACING.medium,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - SPACING.medium * 3) / 2,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.small,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  icon: {
    width: 30,
    height: 30,
  },
  menuTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: FONTS.medium,
    fontWeight: FONTS.semiBold,
    color: COLORS.dark,
    flex: 1,
  },
  countBadge: {
    width: 22,
    height: 22,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: FONTS.extraSmall,
    fontWeight: FONTS.bold,
    color: COLORS.white,
  },
  logoutContainer: {
    marginVertical: SPACING.large,
  },
  footer: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  footerText: {
    fontSize: FONTS.small,
    color: COLORS.gray,
    marginVertical: SPACING.tiny,
  },
});

export default HomeScreen;
