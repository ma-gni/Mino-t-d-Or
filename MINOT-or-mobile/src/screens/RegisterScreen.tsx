import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { RegisterScreenProps } from '../types/navigation';
import { COLORS, FONTS, SPACING, SHADOWS } from '../styles/theme';
import LottieView from 'lottie-react-native';

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const { register } = useContext(AuthContext);

  // États pour le formulaire
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('camion');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [availableWeekends, setAvailableWeekends] = useState(false);
  const [acceptsLongDistance, setAcceptsLongDistance] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return;
    }
    const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide.');
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName,
        email,
        phoneNumber,
        password,
        licenseNumber,
        vehicleType,
        vehiclePlate,
        vehicleCapacity,
        yearsExperience,
        availableWeekends,
        acceptsLongDistance,
      });
      Alert.alert('Succès', 'Inscription réussie !');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Erreur', "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LottieView
        source={require('../../assets/lottie-delivery.json')}
        autoPlay
        loop
        style={{ width: 180, height: 180, alignSelf: 'center', marginBottom: SPACING.large }}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Créer un compte livreur</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom complet *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Votre nom complet"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="exemple@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Téléphone *</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="06 12 34 56 78"
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mot de passe *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Mot de passe"
            secureTextEntry
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirmer le mot de passe *</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirmez le mot de passe"
            secureTextEntry
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Numéro de permis</Text>
          <TextInput
            style={styles.input}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="Permis de conduire"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Type de véhicule</Text>
          <TextInput
            style={styles.input}
            value={vehicleType}
            onChangeText={setVehicleType}
            placeholder="camion, utilitaire..."
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Plaque d'immatriculation</Text>
          <TextInput
            style={styles.input}
            value={vehiclePlate}
            onChangeText={setVehiclePlate}
            placeholder="AA-123-BB"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Capacité du véhicule</Text>
          <TextInput
            style={styles.input}
            value={vehicleCapacity}
            onChangeText={setVehicleCapacity}
            placeholder="en tonnes ou m³"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Années d'expérience</Text>
          <TextInput
            style={styles.input}
            value={yearsExperience}
            onChangeText={setYearsExperience}
            placeholder="Nombre d'années"
            keyboardType="numeric"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Disponible le week-end</Text>
          <Switch
            value={availableWeekends}
            onValueChange={setAvailableWeekends}
            thumbColor={availableWeekends ? COLORS.primary : COLORS.gray}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          />
        </View>
        <View style={styles.switchGroup}>
          <Text style={styles.switchLabel}>Accepte les longues distances</Text>
          <Switch
            value={acceptsLongDistance}
            onValueChange={setAcceptsLongDistance}
            thumbColor={acceptsLongDistance ? COLORS.primary : COLORS.gray}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Inscription...' : "S'inscrire"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.large,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.large,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: FONTS.huge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: SPACING.medium,
  },
  label: {
    fontSize: FONTS.regular,
    color: COLORS.dark,
    marginBottom: SPACING.tiny,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: FONTS.regular,
    backgroundColor: COLORS.background,
    color: COLORS.dark,
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.medium,
  },
  switchLabel: {
    fontSize: FONTS.regular,
    color: COLORS.dark,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.medium,
    borderRadius: 8,
    marginTop: SPACING.small,
    marginBottom: SPACING.small,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.large,
    fontWeight: 'bold',
  },
  link: {
    color: COLORS.secondary,
    fontSize: FONTS.regular,
    marginTop: SPACING.small,
    textAlign: 'center',
  },
});

export default RegisterScreen;
