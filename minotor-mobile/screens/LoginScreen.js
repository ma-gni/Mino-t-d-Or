import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      // Ici tu peux ajouter une vraie authentification plus tard
      navigation.replace('Home');
    } else {
      Alert.alert('Erreur', 'Veuillez saisir vos identifiants.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Connexion Livreur</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={setUsername}
        keyboardType="default"
        returnKeyType="next"
        onSubmitEditing={() => {
          passwordInput.focus();
        }}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={setPassword}
        ref={(input) => (passwordInput = input)}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      <Button title="Se connecter" onPress={handleLogin} />
    </KeyboardAvoidingView>
  );
}

let passwordInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});
