import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .required('Nom complet requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
  phone: Yup.string()
    .min(10, 'Numéro de téléphone invalide')
    .required('Téléphone requis'),
});

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: Props) => {
  interface SignUpValues {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

const handleSignUp = async (values: SignUpValues) => {
    try {
      const response = await axios.post('http://localhost:8080/api/deliverers/signup', values);
      if (response.status === 201) {
        Alert.alert('Succès', 'Compte créé avec succès');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de créer le compte');
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={100} icon="truck" style={styles.avatar} />
      <Text style={styles.title}>Inscription Livreur</Text>

      <Formik
        initialValues={{ fullName: '', email: '', password: '', phone: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              label="Nom Complet"
              style={styles.input}
              onChangeText={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              value={values.fullName}
              
            />
            {touched.fullName && errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

            <TextInput
              label="Email"
              style={styles.input}
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={Boolean(touched.email && errors.email)}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              label="Mot de Passe"
              style={styles.input}
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={Boolean(touched.password && errors.password)}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TextInput
              label="Téléphone"
              style={styles.input}
              keyboardType="phone-pad"
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.phone}
              error={Boolean(touched.phone && errors.phone)}
            />
            {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

            <Button mode="contained" onPress={() => handleSubmit()} style={styles.button}>
              S'inscrire
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#4CAF50',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignUpScreen;
