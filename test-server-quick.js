// Test rapide du serveur de test
const API_URL = 'http://localhost:8081/api';

async function testServer() {
  console.log('🧪 Test du serveur de test...');
  
  try {
    // Test 1: Endpoint de santé
    console.log('\n📡 Test 1: /api/health');
    const healthResponse = await fetch(`${API_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Serveur accessible:', healthData);
    } else {
      console.log('❌ Erreur:', healthResponse.status);
    }
    
    // Test 2: Endpoint des livraisons
    console.log('\n📡 Test 2: /api/deliveries');
    const deliveriesResponse = await fetch(`${API_URL}/deliveries`);
    if (deliveriesResponse.ok) {
      const deliveriesData = await deliveriesResponse.json();
      console.log('✅ Livraisons récupérées:', deliveriesData.length, 'livraisons');
    } else {
      console.log('❌ Erreur:', deliveriesResponse.status);
    }
    
    // Test 3: Authentification
    console.log('\n📡 Test 3: /api/auth/login');
    const authResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'test' })
    });
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Authentification réussie:', authData.token ? 'Token reçu' : 'Pas de token');
    } else {
      console.log('❌ Erreur:', authResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

testServer(); 