// Script de test pour vérifier la connectivité mobile
const API_BASE_URL = 'http://localhost:8081/api';

async function testMobileConnection() {
  console.log('🔍 Test de connectivité pour l\'application mobile...');
  console.log(`📍 URL de test: ${API_BASE_URL}/health`);
  
  try {
    // Test 1: Endpoint de santé
    console.log('\n📡 Test 1: Endpoint de santé...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Serveur accessible:', healthData);
    } else {
      console.log('❌ Serveur non accessible:', healthResponse.status);
    }
    
    // Test 2: Endpoint des livraisons (pour l'app mobile)
    console.log('\n📡 Test 2: Endpoint des livraisons...');
    const deliveriesResponse = await fetch(`${API_BASE_URL}/deliveries`);
    
    if (deliveriesResponse.ok) {
      const deliveriesData = await deliveriesResponse.json();
      console.log('✅ Endpoint livraisons accessible:', deliveriesData.length, 'livraisons trouvées');
    } else {
      console.log('❌ Endpoint livraisons non accessible:', deliveriesResponse.status);
    }
    
    // Test 3: Authentification
    console.log('\n📡 Test 3: Endpoint d\'authentification...');
    const authResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'test',
        password: 'test'
      })
    });
    
    if (authResponse.ok) {
      console.log('✅ Endpoint d\'authentification accessible');
    } else {
      console.log('❌ Endpoint d\'authentification non accessible:', authResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\n🔧 Solutions possibles:');
    console.log('1. Vérifiez que le serveur Spring Boot est démarré sur le port 8081');
    console.log('2. Vérifiez que la base de données MySQL est accessible');
    console.log('3. Vérifiez les logs du serveur pour plus de détails');
  }
}

// Test de connectivité réseau
async function testNetworkConnectivity() {
  console.log('\n🌐 Test de connectivité réseau...');
  
  try {
    // Test de base avec localhost
    const response = await fetch('http://localhost:8081/api/health');
    console.log('✅ Connexion locale réussie');
    
    // Test avec l'IP locale (pour mobile)
    const localIP = '192.168.1.58'; // Remplacez par votre IP locale
    const mobileResponse = await fetch(`http://${localIP}:8081/api/health`);
    console.log('✅ Connexion mobile réussie');
    
  } catch (error) {
    console.log('❌ Problème de connectivité:', error.message);
    console.log('\n💡 Pour l\'application mobile:');
    console.log('- Assurez-vous que votre téléphone et ordinateur sont sur le même réseau WiFi');
    console.log('- Vérifiez que le pare-feu Windows autorise les connexions sur le port 8081');
    console.log('- Utilisez l\'IP locale de votre ordinateur dans l\'app mobile');
  }
}

// Exécution des tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests de connectivité MinotOr Mobile...\n');
  
  await testMobileConnection();
  await testNetworkConnectivity();
  
  console.log('\n✅ Tests terminés!');
}

// Exécuter si le script est appelé directement
if (typeof window === 'undefined') {
  runAllTests();
}

module.exports = { testMobileConnection, testNetworkConnectivity }; 