/**
 * App.jsx
 * --------------------------------------------------
 * Composant principal de l'application Minot'Or
 * 
 * Ce fichier contient :
 * - La configuration des routes principales de l'application
 * - La gestion des routes protégées nécessitant une authentification
 * - La structure générale de l'application avec le layout et ses composants
 * 
 * L'application utilise React Router pour la gestion des routes
 * et un contexte d'authentification pour gérer l'état de connexion.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute, {
  ROUTE_BOULANGER,
  ROUTE_COMMERCIAL,
  ROUTE_APPROVISIONNEMENT,
  ROUTE_PREPARATION,
  ROUTE_MAINTENANCE
} from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Profil from './pages/Profil';
import Aide from './pages/Aide';

// Gestion des devis
import QuoteList from './pages/quotes/QuoteList';
import QuoteForm from './pages/quotes/QuoteForm';

// Gestion des produits
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';

// Pages du rôle boulanger
import CatalogueProduits from './pages/boulanger/CatalogueProduits';
import MesDevis from './pages/boulanger/MesDevis';
import MesCommandes from './pages/boulanger/MesCommandes';
import DeclarerInvendus from './pages/boulanger/DeclarerInvendus';

// Layout principal
import MainLayout from './components/layout/MainLayout';

import { AuthProvider, useAuth, ROLES } from './context/AuthContext';

/**
 * Composant App
 * 
 * Ce composant est le point d'entrée de l'application.
 * Il contient la structure générale de l'application et les routes principales.
 */
function App() {
  return (
    /**
     * Contexte d'authentification
     * 
     * Ce contexte est utilisé pour gérer l'état de connexion de l'utilisateur.
     */
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/aide" element={<Aide />} />
            
            {/* Route de profil utilisateur */}
            <Route 
              path="/profil" 
              element={
                <ProtectedRoute roles={[...ROUTE_BOULANGER, ...ROUTE_COMMERCIAL, ...ROUTE_APPROVISIONNEMENT, ...ROUTE_PREPARATION, ...ROUTE_MAINTENANCE]}>
                  <MainLayout>
                    <Profil />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Route de paramètres utilisateur */}
            <Route 
              path="/parametres" 
              element={
                <ProtectedRoute roles={[...ROUTE_BOULANGER, ...ROUTE_COMMERCIAL, ...ROUTE_APPROVISIONNEMENT, ...ROUTE_PREPARATION, ...ROUTE_MAINTENANCE]}>
                  <MainLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
                      <p>Page de paramètres en cours de développement.</p>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Route de redirection pour /dashboard vers le tableau de bord spécifique au rôle */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute roles={[...ROUTE_BOULANGER, ...ROUTE_COMMERCIAL, ...ROUTE_APPROVISIONNEMENT, ...ROUTE_PREPARATION, ...ROUTE_MAINTENANCE]}>
                  <DashboardRedirect />
                </ProtectedRoute>
              } 
            />
            
            {/* Route de redirection pour /produits vers la page produits spécifique au rôle */}
            <Route 
              path="/produits" 
              element={
                <ProtectedRoute roles={[...ROUTE_BOULANGER, ...ROUTE_COMMERCIAL, ...ROUTE_APPROVISIONNEMENT, ...ROUTE_PREPARATION, ...ROUTE_MAINTENANCE]}>
                  <ProduitsRedirect />
                </ProtectedRoute>
              } 
            />
            
            {/* ===== Routes Boulanger ===== */}
            <Route path="/boulanger/*" element={
              <ProtectedRoute roles={ROUTE_BOULANGER}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="catalogue" element={<CatalogueProduits />} />
                    <Route path="devis" element={<MesDevis />} />
                    <Route path="devis/nouveau" element={<QuoteForm />} />
                    <Route path="commandes" element={<MesCommandes />} />
                    <Route path="invendus" element={<DeclarerInvendus />} />
                    <Route path="produits" element={<CatalogueProduits />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* ===== Routes Commercial ===== */}
            <Route path="/commercial/*" element={
              <ProtectedRoute roles={ROUTE_COMMERCIAL}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="devis" element={<QuoteList />} />
                    <Route path="produits" element={<ProductList />} />
                    <Route path="produits/nouveau" element={<ProductForm />} />
                    <Route path="clients" element={<div>Gestion des clients</div>} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* ===== Routes Approvisionnement ===== */}
            <Route path="/approvisionnement/*" element={
              <ProtectedRoute roles={ROUTE_APPROVISIONNEMENT}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="stocks" element={<div>Gestion des stocks</div>} />
                    <Route path="transports" element={<div>Bons de transport</div>} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* ===== Routes Préparation ===== */}
            <Route path="/preparation/*" element={
              <ProtectedRoute roles={ROUTE_PREPARATION}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="commandes" element={<div>Préparation des commandes</div>} />
                    <Route path="planning" element={<div>Planning de production</div>} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* ===== Routes Maintenance ===== */}
            <Route path="/maintenance/*" element={
              <ProtectedRoute roles={ROUTE_MAINTENANCE}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="camions" element={<div>Entretien des camions</div>} />
                    <Route path="calendrier" element={<div>Calendrier des entretiens</div>} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Route par défaut - redirection vers la page d'accueil */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

/**
 * Composant pour rediriger vers le tableau de bord spécifique au rôle
 * 
 * Ce composant utilise le contexte d'authentification pour déterminer
 * le rôle de l'utilisateur et le rediriger vers le tableau de bord approprié.
 */
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  // Déterminer la redirection en fonction du rôle
  let redirectPath = '/';
  
  if (user) {
    switch (user.role) {
      case ROLES.BOULANGER:
        redirectPath = '/boulanger/dashboard';
        break;
      case ROLES.COMMERCIAL:
        redirectPath = '/commercial/dashboard';
        break;
      case ROLES.APPROVISIONNEMENT:
        redirectPath = '/approvisionnement/dashboard';
        break;
      case ROLES.PREPARATION:
        redirectPath = '/preparation/dashboard';
        break;
      case ROLES.MAINTENANCE:
        redirectPath = '/maintenance/dashboard';
        break;
      default:
        redirectPath = '/';
    }
  }
  
  return <Navigate to={redirectPath} replace />;
};

/**
 * Composant pour rediriger vers la page produits spécifique au rôle
 * 
 * Ce composant utilise le contexte d'authentification pour déterminer
 * le rôle de l'utilisateur et le rediriger vers la page produits appropriée.
 */
const ProduitsRedirect = () => {
  const { user } = useAuth();
  
  // Déterminer la redirection en fonction du rôle
  let redirectPath = '/';
  
  if (user) {
    switch (user.role) {
      case ROLES.BOULANGER:
        redirectPath = '/boulanger/produits';
        break;
      case ROLES.COMMERCIAL:
        redirectPath = '/commercial/produits';
        break;
      case ROLES.APPROVISIONNEMENT:
        redirectPath = '/approvisionnement/stocks';
        break;
      case ROLES.PREPARATION:
        // Rediriger vers les commandes pour le rôle préparation
        redirectPath = '/preparation/commandes';
        break;
      case ROLES.MAINTENANCE:
        // Rediriger vers les cuves pour le rôle maintenance
        redirectPath = '/maintenance/cuves';
        break;
      default:
        redirectPath = '/';
    }
  }
  
  return <Navigate to={redirectPath} replace />;
};

export default App;
