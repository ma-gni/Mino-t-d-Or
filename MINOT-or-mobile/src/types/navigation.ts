import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Définition des types pour les paramètres de navigation
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  SignUp: undefined;
  Home: undefined;
  DeliveryList: undefined;
  DeliveryDetails: { deliveryId: number };
  ScanQRCode: undefined;
  DeliveryTracking: { deliveryId?: number };
  DeliveryHistory: undefined;
  Profile: undefined;
};

// Création de types pour chaque écran
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DeliveryListScreenProps = NativeStackScreenProps<RootStackParamList, 'DeliveryList'>;
export type DeliveryDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'DeliveryDetails'>;
export type ScanQRCodeScreenProps = NativeStackScreenProps<RootStackParamList, 'ScanQRCode'>;
export type DeliveryTrackingScreenProps = NativeStackScreenProps<RootStackParamList, 'DeliveryTracking'>;
export type DeliveryHistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'DeliveryHistory'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
