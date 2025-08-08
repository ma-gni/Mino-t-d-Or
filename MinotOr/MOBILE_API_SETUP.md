# 🚀 Setup des APIs Mobile MinotOr

## 📋 Prérequis

- Java 17+
- Maven 3.6+
- Base de données MySQL/PostgreSQL
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd MinotOr
```

### 2. Configurer la base de données
Modifiez `src/main/resources/application.properties` :
```properties
# Base de données
spring.datasource.url=jdbc:mysql://localhost:3306/minotor
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3. Compiler et lancer
```bash
mvn clean install
mvn spring-boot:run
```

## 🧪 Tests

### Lancer tous les tests
```bash
mvn test
```

### Lancer les tests d'intégration
```bash
mvn test -Dtest=MobileControllerTest
```

### Lancer avec profil de test
```bash
mvn spring-boot:run -Dspring.profiles.active=test
```

## 📱 APIs Disponibles

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Livraisons Mobile
- `GET /api/mobile/deliveries/active` - Livraisons actives
- `POST /api/mobile/deliveries/{id}/confirm` - Confirmer livraison
- `GET /api/deliveries/{id}` - Détails livraison

### Géolocalisation
- `POST /api/mobile/location/update` - Mettre à jour position

### Statistiques
- `GET /api/mobile/stats/driver/{driverId}` - Stats livreur

### QR Codes
- `POST /api/mobile/qr/scan` - Scanner QR code
- `POST /api/mobile/qr/generate/{deliveryId}` - Générer QR code

### Notifications
- `GET /api/mobile/notifications/{userId}` - Récupérer notifications
- `PUT /api/mobile/notifications/{notificationId}/read` - Marquer comme lue

## 🔍 Test des APIs

### Avec cURL

#### 1. Se connecter
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "livreur1",
    "password": "password123"
  }'
```

#### 2. Récupérer les livraisons actives
```bash
curl -X GET http://localhost:8080/api/mobile/deliveries/active \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Confirmer une livraison
```bash
curl -X POST http://localhost:8080/api/mobile/deliveries/1/confirm \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Scanner un QR code
```bash
curl -X POST http://localhost:8080/api/mobile/qr/scan \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "qrCode": "12345"
  }'
```

### Avec Postman

1. Importez la collection `MinotOr_Mobile_API.postman_collection.json`
2. Configurez l'URL de base : `http://localhost:8080`
3. Exécutez les requêtes dans l'ordre

## 📊 Monitoring

### Actuator Endpoints
- `GET /actuator/health` - Santé de l'application
- `GET /actuator/info` - Informations sur l'application
- `GET /actuator/metrics` - Métriques

### Logs
```bash
# Suivre les logs en temps réel
tail -f logs/application.log

# Filtrer les logs des APIs mobile
grep "MobileController" logs/application.log
```

## 🔧 Configuration Avancée

### CORS
La configuration CORS est automatique pour `/api/**` :
```java
@Configuration
public class CorsConfig {
    // Configuration automatique pour mobile
}
```

### JWT
```properties
jwt.secret=your-secret-key
jwt.expiration=86400000
```

### Base de données
```properties
# Pour développement
spring.jpa.hibernate.ddl-auto=update

# Pour production
spring.jpa.hibernate.ddl-auto=validate
```

## 🚀 Déploiement

### Développement
```bash
mvn spring-boot:run
```

### Production
```bash
mvn clean package
java -jar target/minotor-0.0.1-SNAPSHOT.jar
```

### Docker
```bash
docker build -t minotor-mobile .
docker run -p 8080:8080 minotor-mobile
```

## 📱 Intégration Mobile

### URLs de base
- **Android Emulator :** `http://10.0.2.2:8080/api`
- **iOS Simulator :** `http://localhost:8080/api`
- **Device réel :** `http://your-server-ip:8080/api`

### Headers requis
```
Authorization: Bearer {token}
Content-Type: application/json
```

## 🐛 Dépannage

### Erreurs communes

#### 1. CORS Error
```
Access to fetch at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution :** Vérifiez que CorsConfig est bien configuré

#### 2. JWT Token Invalid
```
JWT token is invalid or expired
```
**Solution :** Vérifiez la clé secrète et l'expiration

#### 3. Database Connection
```
Could not create connection to database server
```
**Solution :** Vérifiez les paramètres de base de données

### Logs de debug
```properties
logging.level.com.magnii.minotor=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG
```

## 📚 Documentation Complète

Voir `API_MOBILE_DOCUMENTATION.md` pour la documentation complète des APIs.

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir `LICENSE` pour plus de détails. 