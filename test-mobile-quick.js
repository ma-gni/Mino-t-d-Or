// Test rapide pour l'application mobile
const API_URL = 'http://192.168.99.223:8081/api';

async function quickTest() {
  console.log('🚀 Test rapide de connectivité mobile...');
  console.log(`📍 URL: ${API_URL}/health`);
  
  try {
    const response = await fetch(`${API_URL}/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Serveur accessible!');
      console.log('📊 Données:', data);
      
      // Test des livraisons
      const deliveriesResponse = await fetch(`${API_URL}/deliveries`);
      if (deliveriesResponse.ok) {
        const deliveries = await deliveriesResponse.json();
        console.log(`📦 Livraisons disponibles: ${deliveries.length}`);
      }
      
    } else {
      console.log('❌ Serveur non accessible:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
    console.log('\n💡 Solutions:');
    console.log('1. Vérifiez que le serveur est démarré');
    console.log('2. Vérifiez que votre téléphone est sur le même WiFi');
    console.log('3. Testez dans le navigateur mobile: http://192.168.99.223:8081/api/health');
  }
}

quickTest(); 