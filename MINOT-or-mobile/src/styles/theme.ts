// Thème unifié pour l'application Minot'Or Mobile

export const COLORS = {
  // Couleurs principales
  primary: '#2D6A9F',       // Bleu foncé
  primaryLight: '#4A8BC2',  // Bleu clair  
  secondary: '#F2A007',     // Orange/or pour le "Or" de Minot'Or
  
  // Couleurs de statut
  success: '#28a745',       // Vert pour les succès/livraisons terminées
  warning: '#ffc107',       // Jaune/Orange pour les avertissements/en attente
  danger: '#dc3545',        // Rouge pour les erreurs
  info: '#17a2b8',          // Bleu clair pour les informations
  
  // Couleurs neutres
  dark: '#343a40',          // Presque noir pour le texte principal
  gray: '#6c757d',          // Gris pour le texte secondaire
  lightGray: '#e9ecef',     // Gris clair pour les bordures et séparateurs
  white: '#ffffff',         // Blanc pour les fonds
  background: '#f8f9fa',    // Gris très clair pour le fond d'écran
};

export const FONTS = {
  // Tailles de police
  extraSmall: 10,
  small: 12,
  medium: 14,
  regular: 16,
  large: 18,
  extraLarge: 20,
  huge: 24,
  
  // Poids de police (utilisez des valeurs numériques pour la compatibilité TypeScript)
  light: 300 as const,
  normal: 400 as const,
  semiBold: 600 as const,
  bold: 700 as const,
};

export const SPACING = {
  // Espacement
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  extraLarge: 32,
  huge: 48,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  small: 4,
  medium: 8,
  large: 12,
  extraLarge: 20,
  round: 100,
};
