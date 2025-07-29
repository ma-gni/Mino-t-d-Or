# 🖥️ MinotOr Desktop Application

Application desktop JavaFX pour l'analyse et la gestion des données MinotOr.

## 🚀 Fonctionnalités

- **Authentification JWT** avec le backend Spring Boot
- **Récupération des données** depuis l'API REST
- **Analytics en temps réel** des commandes, produits, utilisateurs
- **Export des données** en CSV et PDF
- **Interface moderne** avec thème clair/sombre
- **Gestion des stocks** et des commandes
- **Graphiques interactifs** pour visualiser les données

## 📋 Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- Backend Spring Boot MinotOr en cours d'exécution

## 🔧 Installation

### 1. Démarrer le backend

```bash
cd MinotOr
mvn spring-boot:run
```

Le backend doit être accessible sur `http://localhost:8080`

### 2. Compiler l'application desktop

```bash
cd Minotor-desktop
mvn clean compile
```

### 3. Lancer l'application

```bash
mvn javafx:run
```

## 🔐 Authentification

L'application utilise l'authentification JWT du backend :

1. **Connexion** : Entrez vos identifiants (admin/admin par défaut)
2. **Token automatique** : Le token JWT est automatiquement géré
3. **Sessions persistantes** : L'authentification est maintenue pendant la session

## 📊 Fonctionnalités principales

### Analytics Dashboard
- **Vue d'ensemble** : Statistiques globales
- **Commandes** : Suivi des commandes en temps réel
- **Produits** : Gestion du catalogue et des stocks
- **Utilisateurs** : Gestion des comptes utilisateurs

### Export de données
- **CSV** : Export des données tabulaires
- **PDF** : Rapports formatés
- **Sélection multiple** : Export des lignes sélectionnées

### Interface utilisateur
- **Thème adaptatif** : Mode clair/sombre
- **Filtres avancés** : Recherche et filtrage par date
- **Pagination** : Navigation dans les grandes listes
- **Graphiques** : Visualisation des tendances

## 🔧 Configuration

Le fichier `src/main/resources/config.properties` permet de configurer :

```properties
# URL du backend
api.base.url=http://localhost:8080/api/

# Timeout des requêtes
api.timeout=30000

# Configuration de l'interface
window.width=1000
window.height=700
```

## 🛠️ Développement

### Structure du projet

```
src/main/java/com/magnii/minotordesktop/
├── controller/          # Contrôleurs JavaFX
├── model/              # DTOs pour les données
├── service/            # Services API
└── Main.java          # Point d'entrée
```

### Ajouter de nouvelles fonctionnalités

1. **Créer un nouveau DTO** dans `model/`
2. **Ajouter les méthodes API** dans `ApiService`
3. **Créer le contrôleur** dans `controller/`
4. **Définir l'interface** dans `fxml/`

## 🐛 Dépannage

### Problèmes de connexion
- Vérifiez que le backend est démarré sur le port 8080
- Vérifiez les logs pour les erreurs de connexion
- Testez l'API directement avec curl ou Postman

### Problèmes d'authentification
- Vérifiez que les identifiants sont corrects
- Vérifiez que le backend génère bien les tokens JWT
- Consultez les logs du backend pour les erreurs d'auth

### Problèmes d'interface
- Vérifiez que JavaFX est correctement installé
- Vérifiez la version de Java (17+ requis)
- Consultez les logs de l'application

## 📝 Logs

Les logs sont affichés dans la console et incluent :
- Connexions API
- Erreurs d'authentification
- Chargement des données
- Exports de fichiers

## 🔄 Mise à jour

Pour mettre à jour l'application :

1. **Arrêter l'application**
2. **Puller les changements** : `git pull`
3. **Recompiler** : `mvn clean compile`
4. **Relancer** : `mvn javafx:run`

## 📞 Support

Pour toute question ou problème :
- Consultez les logs de l'application
- Vérifiez la documentation du backend
- Testez l'API directement

---

**MinotOr Desktop** - Application d'analyse et de gestion pour la plateforme MinotOr 