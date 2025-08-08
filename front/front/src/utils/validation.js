/**
 * validation.js
 * --------------------------------------------------
 * Utilitaires de validation pour les formulaires
 * 
 * Ce fichier contient des fonctions de validation réutilisables :
 * - Validation des emails
 * - Validation des mots de passe
 * - Validation des numéros de téléphone
 * - Validation des codes postaux
 * - Validation des montants
 */

/**
 * Validation d'un email
 * 
 * @param {string} email - L'email à valider
 * @returns {Object} Résultat de la validation
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  return {
    isValid,
    message: isValid ? '' : 'Veuillez entrer une adresse email valide'
  };
};

/**
 * Validation d'un mot de passe
 * 
 * @param {string} password - Le mot de passe à valider
 * @returns {Object} Résultat de la validation
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
  }
  if (!hasUpperCase) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!hasLowerCase) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!hasNumbers) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  if (!hasSpecialChar) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return {
    isValid: errors.length === 0,
    message: errors.join(', '),
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calcul de la force du mot de passe
 * 
 * @param {string} password - Le mot de passe
 * @returns {string} Niveau de force (faible, moyen, fort)
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (score <= 2) return 'faible';
  if (score <= 3) return 'moyen';
  return 'fort';
};

/**
 * Validation d'un numéro de téléphone français
 * 
 * @param {string} phone - Le numéro de téléphone à valider
 * @returns {Object} Résultat de la validation
 */
export const validatePhone = (phone) => {
  // Supprime tous les caractères non numériques
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Validation pour les numéros français
  const frenchPhoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  const isValid = frenchPhoneRegex.test(phone) || cleanPhone.length === 10;
  
  return {
    isValid,
    message: isValid ? '' : 'Veuillez entrer un numéro de téléphone valide'
  };
};

/**
 * Validation d'un code postal français
 * 
 * @param {string} postalCode - Le code postal à valider
 * @returns {Object} Résultat de la validation
 */
export const validatePostalCode = (postalCode) => {
  const postalCodeRegex = /^[0-9]{5}$/;
  const isValid = postalCodeRegex.test(postalCode);
  
  return {
    isValid,
    message: isValid ? '' : 'Veuillez entrer un code postal valide (5 chiffres)'
  };
};

/**
 * Validation d'un montant
 * 
 * @param {string|number} amount - Le montant à valider
 * @returns {Object} Résultat de la validation
 */
export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  const isValid = !isNaN(numAmount) && numAmount >= 0;
  
  return {
    isValid,
    message: isValid ? '' : 'Veuillez entrer un montant valide',
    value: isValid ? numAmount : null
  };
};

/**
 * Validation d'une quantité
 * 
 * @param {string|number} quantity - La quantité à valider
 * @returns {Object} Résultat de la validation
 */
export const validateQuantity = (quantity) => {
  const numQuantity = parseInt(quantity);
  const isValid = !isNaN(numQuantity) && numQuantity > 0;
  
  return {
    isValid,
    message: isValid ? '' : 'Veuillez entrer une quantité valide (nombre positif)',
    value: isValid ? numQuantity : null
  };
};

/**
 * Validation d'un nom ou prénom
 * 
 * @param {string} name - Le nom à valider
 * @returns {Object} Résultat de la validation
 */
export const validateName = (name) => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  const isValid = nameRegex.test(name.trim());
  
  return {
    isValid,
    message: isValid ? '' : 'Le nom doit contenir entre 2 et 50 caractères (lettres uniquement)'
  };
};

/**
 * Validation d'un nom d'utilisateur
 * 
 * @param {string} username - Le nom d'utilisateur à valider
 * @returns {Object} Résultat de la validation
 */
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  const isValid = usernameRegex.test(username);
  
  return {
    isValid,
    message: isValid ? '' : 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres, tirets et underscores uniquement)'
  };
};

/**
 * Validation d'une date
 * 
 * @param {string} date - La date à valider
 * @returns {Object} Résultat de la validation
 */
export const validateDate = (date) => {
  const dateObj = new Date(date);
  const isValid = dateObj instanceof Date && !isNaN(dateObj);
  
  return {
    isValid,
    message: isValid ? '' : 'Veuillez entrer une date valide',
    value: isValid ? dateObj : null
  };
};

/**
 * Validation d'une date future
 * 
 * @param {string} date - La date à valider
 * @returns {Object} Résultat de la validation
 */
export const validateFutureDate = (date) => {
  const dateValidation = validateDate(date);
  if (!dateValidation.isValid) {
    return dateValidation;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isFuture = dateValidation.value > today;
  
  return {
    isValid: isFuture,
    message: isFuture ? '' : 'La date doit être dans le futur',
    value: dateValidation.value
  };
};

/**
 * Validation d'un champ requis
 * 
 * @param {string} value - La valeur à valider
 * @param {string} fieldName - Le nom du champ
 * @returns {Object} Résultat de la validation
 */
export const validateRequired = (value, fieldName = 'Ce champ') => {
  const isValid = value && value.trim().length > 0;
  
  return {
    isValid,
    message: isValid ? '' : `${fieldName} est requis`
  };
};

/**
 * Validation d'une longueur minimale
 * 
 * @param {string} value - La valeur à valider
 * @param {number} minLength - La longueur minimale
 * @param {string} fieldName - Le nom du champ
 * @returns {Object} Résultat de la validation
 */
export const validateMinLength = (value, minLength, fieldName = 'Ce champ') => {
  const isValid = value && value.length >= minLength;
  
  return {
    isValid,
    message: isValid ? '' : `${fieldName} doit contenir au moins ${minLength} caractères`
  };
};

/**
 * Validation d'une longueur maximale
 * 
 * @param {string} value - La valeur à valider
 * @param {number} maxLength - La longueur maximale
 * @param {string} fieldName - Le nom du champ
 * @returns {Object} Résultat de la validation
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Ce champ') => {
  const isValid = !value || value.length <= maxLength;
  
  return {
    isValid,
    message: isValid ? '' : `${fieldName} ne peut pas dépasser ${maxLength} caractères`
  };
};

/**
 * Validation d'un formulaire complet
 * 
 * @param {Object} formData - Les données du formulaire
 * @param {Object} validationRules - Les règles de validation
 * @returns {Object} Résultat de la validation
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(fieldName => {
    const fieldValue = formData[fieldName];
    const rules = validationRules[fieldName];
    
    // Validation de chaque règle pour le champ
    for (const rule of rules) {
      const validation = rule.validator(fieldValue, rule.params);
      
      if (!validation.isValid) {
        errors[fieldName] = validation.message;
        isValid = false;
        break; // Arrête à la première erreur pour ce champ
      }
    }
  });
  
  return {
    isValid,
    errors
  };
}; 