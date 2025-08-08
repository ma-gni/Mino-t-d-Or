# 📱 APIs MinotOr Mobile

## 🔐 Authentification

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "livreur1",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "livreur1",
  "role": "livreur"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "nouveau_livreur",
  "password": "password123",
  "email": "livreur@minotor.com",
  "address": "123 Rue de la Livraison, Lyon"
}
```

## 🚚 Livraisons

### Récupérer les livraisons actives
```http
GET /api/mobile/deliveries/active
Authorization: Bearer {token}
```

**Réponse :**
```json
[
  {
    "id": 1,
    "orderId": 101,
    "status": "processing",
    "address": "12 Rue de Paris",
    "clientName": "Boulangerie Dupont",
    "clientPhone": "0612345678",
    "city": "Lyon",
    "postalCode": "69001",
    "deliveryDate": "2025-01-15T10:30:00",
    "products": [
      {
        "id": 1,
        "name": "Farine T65",
        "quantity": 100
      }
    ],
    "qrCode": "1",
    "latitude": 45.7640,
    "longitude": 4.8357
  }
]
```

### Confirmer une livraison
```http
POST /api/mobile/deliveries/{id}/confirm
Authorization: Bearer {token}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Livraison confirmée avec succès",
  "delivery": {
    "id": 1,
    "status": "delivered",
    ...
  }
}
```

### Récupérer les détails d'une livraison
```http
GET /api/deliveries/{id}
Authorization: Bearer {token}
```

## 📍 Géolocalisation

### Mettre à jour la position
```http
POST /api/mobile/location/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "driverId": 1,
  "latitude": 45.7640,
  "longitude": 4.8357,
  "timestamp": "2025-01-15T10:30:00",
  "address": "12 Rue de Paris, Lyon",
  "deliveryId": 1
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Position mise à jour",
  "timestamp": "2025-01-15T10:30:00"
}
```

## 📊 Statistiques

### Récupérer les stats du livreur
```http
GET /api/mobile/stats/driver/{driverId}
Authorization: Bearer {token}
```

**Réponse :**
```json
{
  "driverId": 1,
  "driverName": "Livreur Demo",
  "totalDeliveries": 128,
  "completedThisWeek": 23,
  "pendingDeliveries": 5,
  "averageRating": 4.8,
  "totalDistance": 450,
  "averageDeliveryTime": 25,
  "recentDeliveries": [...]
}
```

## 🔍 QR Codes

### Scanner un QR code
```http
POST /api/mobile/qr/scan
Authorization: Bearer {token}
Content-Type: application/json

{
  "qrCode": "12345"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "QR Code validé avec succès",
  "delivery": {
    "id": 12345,
    "status": "delivered",
    ...
  }
}
```

### Générer un QR code
```http
POST /api/mobile/qr/generate/{deliveryId}
Authorization: Bearer {token}
```

**Réponse :**
```json
{
  "success": true,
  "qrCode": "12345",
  "deliveryId": 12345
}
```

## 🔔 Notifications

### Récupérer les notifications
```http
GET /api/mobile/notifications/{userId}
Authorization: Bearer {token}
```

**Réponse :**
```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "Nouvelle livraison",
    "message": "Vous avez une nouvelle livraison à effectuer",
    "type": "new_delivery",
    "createdAt": "2025-01-15T10:30:00",
    "isRead": false,
    "deliveryId": 1
  }
]
```

### Marquer comme lue
```http
PUT /api/mobile/notifications/{notificationId}/read
Authorization: Bearer {token}
```

## 👤 Utilisateurs

### Récupérer les infos utilisateur
```http
GET /api/users/{username}
Authorization: Bearer {token}
```

**Réponse :**
```json
{
  "id": 1,
  "username": "livreur1",
  "email": "livreur@minotor.com",
  "address": "123 Rue de la Livraison, Lyon",
  "activated": true,
  "roles": ["ROLE_LIVREUR"]
}
```

## 📦 Commandes

### Récupérer les commandes d'un utilisateur
```http
GET /api/orders/user/{userId}
Authorization: Bearer {token}
```

### Récupérer une commande par ID
```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

## 🛍️ Produits

### Récupérer tous les produits
```http
GET /api/products
Authorization: Bearer {token}
```

### Récupérer un produit par ID
```http
GET /api/products/{id}
Authorization: Bearer {token}
```

## 🔧 Configuration

### URLs de base
- **Android Emulator :** `http://10.0.2.2:8080/api`
- **iOS Simulator :** `http://localhost:8080/api`
- **Device réel :** `http://your-server-ip:8080/api`

### Headers requis
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Codes de statut
- `200` : Succès
- `201` : Créé avec succès
- `400` : Erreur de requête
- `401` : Non autorisé
- `404` : Non trouvé
- `500` : Erreur serveur

## 📱 Mapping des Statuts

### Backend → Mobile
- `PREPARING` → `pending`
- `SHIPPED` → `processing`
- `DELIVERED` → `delivered`

### Mobile → Backend
- `pending` → `PREPARING`
- `processing` → `SHIPPED`
- `delivered` → `DELIVERED`

## 🚀 Exemples d'utilisation

### Connexion et récupération des livraisons
```javascript
// 1. Se connecter
const loginResponse = await fetch('http://10.0.2.2:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'livreur1', password: 'password123' })
});

const { token } = await loginResponse.json();

// 2. Récupérer les livraisons actives
const deliveriesResponse = await fetch('http://10.0.2.2:8080/api/mobile/deliveries/active', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const deliveries = await deliveriesResponse.json();
```

### Confirmer une livraison
```javascript
const confirmResponse = await fetch(`http://10.0.2.2:8080/api/mobile/deliveries/${deliveryId}/confirm`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

const result = await confirmResponse.json();
if (result.success) {
  console.log('Livraison confirmée !');
}
```

### Scanner un QR code
```javascript
const scanResponse = await fetch('http://10.0.2.2:8080/api/mobile/qr/scan', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ qrCode: '12345' })
});

const result = await scanResponse.json();
if (result.success) {
  console.log('QR Code validé !');
}
``` 