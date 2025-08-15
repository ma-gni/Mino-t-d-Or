# 📱 Intégration Mobile-Backend Minot'Or

## 🎯 Fonctionnalités Implémentées

### ✅ Authentification Complète
- Connexion avec JWT
- Gestion des tokens
- Gestion des erreurs

### ✅ Gestion des Livraisons
- Liste des livraisons actives
- Détails d'une livraison
- Confirmation de livraison

### ✅ Géolocalisation en Temps Réel
- Suivi GPS automatique
- Mise à jour de position
- Partage de position

### ✅ Notifications Push
- Notifications locales
- Envoi au backend
- Gestion des permissions

### ✅ Scan QR Code
- Saisie manuelle
- Confirmation
- Navigation

## �� Démarrage Rapide

1. **Backend** : `cd MinotOr && mvn spring-boot:run`
2. **Mobile** : `cd MINOT-or-mobile && npx expo start`
3. **Test** : Connexion avec `livreur1` / `password123`

## 📊 APIs Disponibles

- `POST /api/auth/login` - Connexion
- `GET /api/mobile/deliveries` - Livraisons actives
- `GET /api/mobile/deliveries/{id}` - Détails livraison
- `POST /api/mobile/deliveries/{id}/confirm` - Confirmer livraison
- `POST /api/mobile/location` - Mettre à jour position
- `POST /api/mobile/notifications/send` - Envoyer notification

## 🔧 Configuration

Voir `MINOT-or-mobile/src/config/environment.ts` pour les URLs.