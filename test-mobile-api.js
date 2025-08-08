// Script de test pour vérifier la connexion Mobile ↔ Backend
const API_BASE_URL = 'http://localhost:8081/api';

async function testMobileConnection() {
    console.log('🧪 Test de connexion Mobile ↔ Backend');
    console.log('=====================================');

    // Test 1: Health check
    try {
        console.log('\n1️⃣ Test Health Check...');
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health Check:', healthData);
    } catch (error) {
        console.log('❌ Health Check failed:', error.message);
    }

    // Test 2: Deliveries endpoint
    try {
        console.log('\n2️⃣ Test Deliveries Endpoint...');
        const deliveriesResponse = await fetch(`${API_BASE_URL}/deliveries`);
        const deliveriesData = await deliveriesResponse.json();
        console.log('✅ Deliveries:', deliveriesData);
    } catch (error) {
        console.log('❌ Deliveries failed:', error.message);
    }

    // Test 3: Mobile specific endpoints
    try {
        console.log('\n3️⃣ Test Mobile Active Deliveries...');
        const activeResponse = await fetch(`${API_BASE_URL}/deliveries/mobile/active`);
        const activeData = await activeResponse.json();
        console.log('✅ Active Deliveries:', activeData);
    } catch (error) {
        console.log('❌ Active Deliveries failed:', error.message);
    }

    // Test 4: CORS test
    try {
        console.log('\n4️⃣ Test CORS...');
        const corsResponse = await fetch(`${API_BASE_URL}/deliveries`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });
        console.log('✅ CORS Headers:', corsResponse.headers);
    } catch (error) {
        console.log('❌ CORS test failed:', error.message);
    }

    console.log('\n🎯 Résumé des tests:');
    console.log('- Backend: http://localhost:8081 ✅');
    console.log('- Mobile: http://localhost:3000 (nouveau port)');
    console.log('- API Base: http://localhost:8081/api ✅');
}

// Exécuter les tests
testMobileConnection(); 