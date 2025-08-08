// Serveur de test simple pour l'application mobile MinotOr
const http = require('http');
const url = require('url');

// Données de test
const testData = {
  health: {
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "MinotOr Mobile API Test Server"
  },
  deliveries: [
    {
      id: 1,
      address: "123 Rue de la Paix, Paris",
      status: "EN_COURS",
      orderId: 1001,
      createdAt: "2024-01-01T10:00:00Z"
    },
    {
      id: 2,
      address: "456 Avenue des Champs, Lyon",
      status: "LIVREE",
      orderId: 1002,
      createdAt: "2024-01-01T11:00:00Z"
    },
    {
      id: 3,
      address: "789 Boulevard Central, Marseille",
      status: "EN_ATTENTE",
      orderId: 1003,
      createdAt: "2024-01-01T12:00:00Z"
    }
  ]
};

// Configuration CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

const server = http.createServer((req, res) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  console.log(`${new Date().toISOString()} - ${req.method} ${path}`);

  // Routes
  if (path === '/api/health' && req.method === 'GET') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify(testData.health));
  }
  else if (path === '/api/deliveries' && req.method === 'GET') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify(testData.deliveries));
  }
  else if (path.match(/^\/api\/deliveries\/\d+$/) && req.method === 'GET') {
    const id = parseInt(path.split('/').pop());
    const delivery = testData.deliveries.find(d => d.id === id);
    
    if (delivery) {
      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify(delivery));
    } else {
      res.writeHead(404, corsHeaders);
      res.end(JSON.stringify({ error: 'Livraison non trouvée' }));
    }
  }
  else if (path.match(/^\/api\/deliveries\/\d+$/) && req.method === 'PUT') {
    const id = parseInt(path.split('/').pop());
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const updateData = JSON.parse(body);
        const deliveryIndex = testData.deliveries.findIndex(d => d.id === id);
        
        if (deliveryIndex !== -1) {
          testData.deliveries[deliveryIndex] = {
            ...testData.deliveries[deliveryIndex],
            ...updateData
          };
          
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify(testData.deliveries[deliveryIndex]));
        } else {
          res.writeHead(404, corsHeaders);
          res.end(JSON.stringify({ error: 'Livraison non trouvée' }));
        }
      } catch (error) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Données invalides' }));
      }
    });
  }
  else if (path === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const loginData = JSON.parse(body);
        
        // Simulation d'authentification
        if (loginData.username && loginData.password) {
          res.writeHead(200, corsHeaders);
          res.end(JSON.stringify({
            token: 'test-token-12345',
            user: {
              id: 1,
              username: loginData.username,
              role: 'MOBILE_USER'
            }
          }));
        } else {
          res.writeHead(401, corsHeaders);
          res.end(JSON.stringify({ error: 'Identifiants invalides' }));
        }
      } catch (error) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({ error: 'Données invalides' }));
      }
    });
  }
  else {
    res.writeHead(404, corsHeaders);
    res.end(JSON.stringify({ error: 'Endpoint non trouvé' }));
  }
});

const PORT = 8081;
const HOST = '0.0.0.0'; // Écoute sur toutes les interfaces

server.listen(PORT, HOST, () => {
  console.log('🚀 Serveur de test MinotOr Mobile démarré!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📱 Mobile: http://192.168.99.223:${PORT}`);
  console.log('');
  console.log('📋 Endpoints disponibles:');
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  GET  http://localhost:${PORT}/api/deliveries`);
  console.log(`  GET  http://localhost:${PORT}/api/deliveries/:id`);
  console.log(`  PUT  http://localhost:${PORT}/api/deliveries/:id`);
  console.log(`  POST http://localhost:${PORT}/api/auth/login`);
  console.log('');
  console.log('⏹️  Appuyez sur Ctrl+C pour arrêter');
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur de test...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
}); 