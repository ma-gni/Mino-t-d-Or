import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  ImageBackground
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LoginScreenProps } from '../types/navigation';
import { User } from '../types/models';
import { COLORS, FONTS, SPACING, SHADOWS, BORDER_RADIUS } from '../styles/theme';
import Button from '../components/common/Button';
import { testBackendConnection, getConnectionInfo } from '../utils/connectionTest';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    // Validation de base
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🚀 Début de la connexion...');
      
      // Utiliser l'API réelle pour la connexion
      await login(username, password);
      setLoading(false);
      console.log('✅ Connexion réussie !');
      
    } catch (error: any) {
      setLoading(false);
      console.error('❌ Erreur de connexion:', error);
      
      // Afficher un message d'erreur plus informatif
      Alert.alert(
        'Erreur de Connexion', 
        error.message || 'Problème de connexion au serveur',
        [
          { 
            text: 'Réessayer', 
            onPress: () => handleLogin() 
          },
          { 
            text: 'Annuler', 
            style: 'cancel' 
          }
        ]
      );
    }
  };

  const handleTestConnection = async () => {
    const connectionInfo = getConnectionInfo();
    console.log('🔗 Informations de connexion:', connectionInfo);
    
    await testBackendConnection();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Section supérieure avec image et dégradé */}
      <View style={styles.topSection}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3081/3081986.png' }} 
              style={styles.logo} 
            />
            <Text style={styles.appName}>Minot'Or</Text>
            <Text style={styles.tagline}>Gestion de livraisons boulangerie</Text>
          </View>
        </ImageBackground>
      </View>
      
      {/* Section formulaire */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bottomSection}
      >
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Bon retour parmi nous !</Text>
          <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Identifiant</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Entrez votre nom d'utilisateur" 
              placeholderTextColor={COLORS.gray}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
              value={username}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Entrez votre mot de passe" 
              placeholderTextColor={COLORS.gray}
              secureTextEntry 
              onChangeText={setPassword}
              value={password}
            />
          </View>
          
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
          
          <Button
            title="Se connecter"
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
            style={styles.loginButton}
          />
          
          {/* Bouton de test de connexion */}
          <TouchableOpacity 
            style={styles.testConnectionButton}
            onPress={handleTestConnection}
          >
            <Text style={styles.testConnectionText}>🔗 Tester la connexion</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')} 
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>
              Pas encore de compte? <Text style={styles.registerLinkHighlight}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>2025 Minot'Or - Tous droits réservés</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topSection: {
    height: height * 0.35,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 106, 159, 0.7)', // Couleur primaire semi-transparente
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  appName: {
    fontSize: FONTS.huge,
    fontWeight: FONTS.bold,
    color: COLORS.white,
    marginTop: SPACING.small,
  },
  tagline: {
    fontSize: FONTS.medium,
    color: COLORS.white,
    marginTop: SPACING.tiny,
    opacity: 0.9,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.extraLarge,
    borderTopRightRadius: BORDER_RADIUS.extraLarge,
    marginTop: -20,
  },
  formContainer: {
    flex: 1,
    padding: SPACING.large,
  },
  welcomeText: {
    fontSize: FONTS.extraLarge,
    fontWeight: FONTS.bold,
    color: COLORS.dark,
    marginTop: SPACING.medium,
  },
  subtitle: {
    fontSize: FONTS.medium,
    color: COLORS.gray,
    marginBottom: SPACING.large,
  },
  inputContainer: {
    marginBottom: SPACING.medium,
  },
  inputLabel: {
    fontSize: FONTS.small,
    fontWeight: FONTS.semiBold,
    color: COLORS.dark,
    marginBottom: SPACING.tiny,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    fontSize: FONTS.regular,
    backgroundColor: COLORS.background,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: SPACING.medium,
  },
  forgotPassword: {
    color: COLORS.primary,
    fontSize: FONTS.small,
  },
  loginButton: {
    marginTop: SPACING.medium,
  },
  testConnectionButton: {
    marginTop: SPACING.medium,
    backgroundColor: COLORS.lightGray,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testConnectionText: {
    color: COLORS.dark,
    fontSize: FONTS.regular,
  },
  registerLink: {
    marginTop: SPACING.large,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: FONTS.regular,
    color: COLORS.gray,
  },
  registerLinkHighlight: {
    color: COLORS.primary,
    fontWeight: FONTS.semiBold,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: SPACING.small,
  },
  footerText: {
    fontSize: FONTS.extraSmall,
    color: COLORS.gray,
  },
});

export default LoginScreen;
