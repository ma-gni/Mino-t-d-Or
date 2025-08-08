// Test simple de connectivité
const http = require('http');

function testConnection() {
  console.log('🧪 Test de connectivité simple...');
  
  const options = {
    hostname: 'localhost',
    port: 8081,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ Réponse reçue:', jsonData);
        console.log('\n🎉 Le serveur fonctionne!');
        console.log('📱 Votre application mobile peut maintenant se connecter!');
      } catch (error) {
        console.log('📄 Réponse brute:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Erreur de connexion:', error.message);
  });

  req.end();
}

testConnection(); 