// Configuration de l'environnement pour l'application mobile

export interface Environment {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  DEBUG_MODE: boolean;
}

// Configuration pour Android Emulator
export const androidConfig: Environment = {
  API_BASE_URL: 'http://10.0.2.2:8081/api',
  API_TIMEOUT: 30000, // Augmenté à 30 secondes
  DEBUG_MODE: true,
};

// Configuration pour iOS Simulator
export const iosConfig: Environment = {
  API_BASE_URL: 'http://localhost:8081/api',
  API_TIMEOUT: 30000, // Augmenté à 30 secondes
  DEBUG_MODE: true,
};

// Configuration pour device réel (remplacer par votre IP locale)
export const deviceConfig: Environment = {
  API_BASE_URL: 'http://192.168.1.100:8081/api', // Remplacer par votre IP
  API_TIMEOUT: 30000, // Augmenté à 30 secondes
  DEBUG_MODE: false,
};

// Configuration par défaut (localhost pour test)
export const defaultConfig: Environment = {
  API_BASE_URL: 'http://localhost:8081/api', // Changé pour localhost
  API_TIMEOUT: 30000, // Augmenté à 30 secondes
  DEBUG_MODE: true,
};

// Fonction pour obtenir la configuration selon la plateforme
export const getEnvironment = (): Environment => {
  // Ici vous pouvez ajouter une logique pour détecter la plateforme
  // et retourner la configuration appropriée
  return defaultConfig;
};

// Fonction pour obtenir l'URL de base de l'API
export const getApiBaseUrl = (): string => {
  return getEnvironment().API_BASE_URL;
};

// Fonction pour obtenir le timeout de l'API
export const getApiTimeout = (): number => {
  return getEnvironment().API_TIMEOUT;
};

// Fonction pour vérifier si on est en mode debug
export const isDebugMode = (): boolean => {
  return getEnvironment().DEBUG_MODE;
}; 