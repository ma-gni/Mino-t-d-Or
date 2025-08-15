# 🔗 Intégration Mobile-Backend Minot'Or

Ce document explique comment l'application mobile React Native est connectée au backend Spring Boot.

## 📋 **Configuration**

### **1. Configuration d'Environnement**

L'application mobile utilise différents environnements selon la plateforme :

- **Android Emulator**: `http://10.0.2.2:8081/api`
- **iOS Simulator**: `http://localhost:8081/api`
- **Device Réel**: `http://192.168.1.100:8081/api` (à adapter)

### **2. Fichiers de Configuration**

- `src/config/environment.ts` - Configuration des URLs et timeouts
- `src/services/api.ts` - Service principal pour les appels API
- `src/context/AuthContext.tsx` - Gestion de l'authentification

## 🔐 **Authentification**

### **Flux de Connexion**

1. **Login**: L'utilisateur saisit ses identifiants
2. **API Call**: `POST /api/auth/login`
3. **Token Storage**: Le JWT est stocké dans AsyncStorage
4. **Context Update**: Le contexte d'authentification est mis à jour

### **Gestion des Tokens**

- **Stockage**: AsyncStorage pour la persistance
- **Headers**: Ajout automatique du token dans les requêtes
- **Expiration**: Gestion des erreurs 401 pour déconnexion

## 📱 **APIs Intégrées**

### **1. Authentification**
```typescript
// Connexion
await apiService.login(username, password);

// Inscription
await apiService.register(userData);

// Déconnexion
await apiService.logout();
```

### **2. Livraisons**
```typescript
// Récupérer les livraisons actives
const deliveries = await apiService.getActiveDeliveries();

// Détails d'une livraison
const delivery = await apiService.getDeliveryDetails(deliveryId);

// Confirmer une livraison
await apiService.confirmDelivery(deliveryId);
```

### **3. Géolocalisation**
```typescript
// Mettre à jour la position
await apiService.updateLocation(locationData);
```

### **4. Statistiques**
```typescript
// Statistiques du livreur
const stats = await apiService.getDriverStats(driverId);
```

### **5. QR Codes**
```typescript
// Scanner un QR code
const result = await apiService.scanQRCode(qrCode);

// Générer un QR code
await apiService.generateQRCode(deliveryId);
```

## 🛠 **Gestion d'Erreurs**

### **Types d'Erreurs Gérées**

- **401 Unauthorized**: Session expirée, redirection vers login
- **404 Not Found**: Ressource non trouvée
- **500 Server Error**: Erreur serveur
- **Timeout**: Requête trop longue
- **Network Error**: Problème de connexion

### **Messages d'Erreur**

```typescript
if (error.message?.includes('401')) {
  Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
} else if (error.message?.includes('404')) {
  Alert.alert('Erreur', 'Ressource non trouvée');
} else if (error.message?.includes('500')) {
  Alert.alert('Erreur', 'Erreur serveur');
} else {
  Alert.alert('Erreur', 'Problème de connexion au serveur');
}
```

## 🔄 **Écrans Intégrés**

### **1. LoginScreen**
- ✅ Utilise l'API `/api/auth/login`
- ✅ Gestion des erreurs de connexion
- ✅ Stockage automatique du token

### **2. DeliveryListScreen**
- ✅ Récupère les livraisons via `/api/mobile/deliveries/active`
- ✅ Pull-to-refresh pour actualiser
- ✅ Gestion des états de chargement

### **3. DeliveryDetailsScreen**
- ✅ Détails via `/api/deliveries/{id}`
- ✅ Confirmation via `/api/mobile/deliveries/{id}/confirm`
- ✅ Affichage des produits et statuts

## 🚀 **Démarrage Rapide**

### **1. Démarrer le Backend**
```bash
cd MinotOr
mvn spring-boot:run
```

### **2. Vérifier la Connexion**
```bash
curl http://localhost:8081/actuator/health
```

### **3. Créer un Utilisateur de Test**
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "livreur1",
    "password": "password123",
    "email": "livreur@minotor.com",
    "address": "123 Rue de la Livraison, Lyon"
  }'
```

### **4. Activer l'Utilisateur**
```bash
curl -X PUT http://localhost:8081/api/auth/users/{id}/activate
```

### **5. Lancer l'Application Mobile**
```bash
cd MINOT-or-mobile
npm start
# ou
expo start
```

## 🔧 **Configuration Avancée**

### **Changer l'URL de l'API**

Modifiez `src/config/environment.ts` :

```typescript
export const androidConfig: Environment = {
  API_BASE_URL: 'http://votre-ip:8081/api',
  API_TIMEOUT: 10000,
  DEBUG_MODE: true,
};
```

### **Ajouter de Nouvelles APIs**

1. **Ajouter la méthode dans `api.ts`** :
```typescript
async nouvelleFonction(): Promise<TypeRetour> {
  return await this.apiCall<TypeRetour>('/nouveau/endpoint');
}
```

2. **Utiliser dans les écrans** :
```typescript
const data = await apiService.nouvelleFonction();
```

## 📊 **Monitoring et Debug**

### **Logs de Debug**

```typescript
// Activer les logs détaillés
console.log('API Call:', endpoint, data);
console.log('API Response:', response);
```

### **Vérification de Connexion**

```typescript
const isConnected = await apiService.checkConnection();
console.log('Backend accessible:', isConnected);
```

## 🔒 **Sécurité**

### **Bonnes Pratiques**

- ✅ Tokens JWT stockés de manière sécurisée
- ✅ Headers d'authentification automatiques
- ✅ Gestion des sessions expirées
- ✅ Validation des données côté client
- ✅ Timeout sur les requêtes

### **Recommandations**

1. **En Production** : Utiliser HTTPS
2. **Tokens** : Implémenter un refresh token
3. **Validation** : Ajouter plus de validation côté client
4. **Monitoring** : Ajouter des métriques de performance

## 🐛 **Dépannage**

### **Problèmes Courants**

1. **Erreur de Connexion**
   - Vérifier que le backend tourne sur le bon port
   - Vérifier l'URL dans la configuration
   - Tester avec curl/Postman

2. **Erreur 401**
   - Vérifier que l'utilisateur est activé
   - Vérifier les identifiants
   - Vérifier le token JWT

3. **Timeout**
   - Augmenter le timeout dans la configuration
   - Vérifier la connexion réseau
   - Vérifier la performance du backend

### **Commandes de Test**

```bash
# Test de santé du backend
curl http://localhost:8081/actuator/health

# Test de connexion
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"livreur1","password":"password123"}'

# Test des livraisons
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8081/api/mobile/deliveries/active
```

## 📈 **Prochaines Étapes**

1. **Implémenter** les notifications push
2. **Ajouter** la géolocalisation en temps réel
3. **Optimiser** les performances de l'API
4. **Ajouter** des tests automatisés
5. **Implémenter** le mode hors ligne

---

**🎉 L'intégration mobile-backend est maintenant complète et fonctionnelle !** 