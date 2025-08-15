import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ProfileScreenProps } from '../types/navigation';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/300?img=11'; // Avatar par défaut

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { user, signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnecter', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            // La navigation sera gérée par le contexte d'authentification
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: user?.avatar || DEFAULT_AVATAR }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name || 'Livreur Minot\'Or'}</Text>
        <Text style={styles.userRole}>{user?.role || 'Livreur'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informations Personnelles</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>{user?.email || 'email@example.com'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>{user?.phone || 'Non renseigné'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>{user?.username || 'username'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Statistiques de Livraison</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Livraisons cette semaine</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>Livraisons totales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Note moyenne</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.large,
    alignItems: 'center',
    borderBottomLeftRadius: BORDER_RADIUS.large,
    borderBottomRightRadius: BORDER_RADIUS.large,
    ...SHADOWS.medium,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.medium,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  userName: {
    fontSize: FONTS.extraLarge,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginBottom: SPACING.tiny,
  },
  userRole: {
    fontSize: FONTS.medium,
    color: COLORS.white,
    opacity: 0.8,
  },
  card: {
    margin: SPACING.medium,
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONTS.large,
    fontWeight: FONTS.semiBold,
    color: COLORS.dark,
    marginBottom: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: `${COLORS.lightGray}80`,
    paddingBottom: SPACING.small,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  infoText: {
    fontSize: FONTS.medium,
    color: COLORS.dark,
    marginLeft: SPACING.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
  },
  statNumber: {
    fontSize: FONTS.extraLarge,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.tiny,
  },
  logoutButton: {
    margin: SPACING.medium,
    padding: SPACING.medium,
    backgroundColor: COLORS.danger,
    borderRadius: BORDER_RADIUS.medium,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  logoutButtonText: {
    fontSize: FONTS.medium,
    fontWeight: FONTS.semiBold,
    color: COLORS.white,
    marginLeft: SPACING.small,
  },
});

export default ProfileScreen;
