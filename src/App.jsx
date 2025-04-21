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
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';

// Gestion des devis
import QuoteList from './pages/quotes/QuoteList';
import QuoteForm from './pages/quotes/QuoteForm';

// Gestion des produits
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';

import { AuthProvider } from './context/AuthContext';

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
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-16">
          {/* Configuration des routes */}
          {/* 
           * Les routes sont configurées à l'aide de React Router.
           * Les routes protégées nécessitent une authentification.
           */}
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Routes Devis */}
            <Route path="/quotes" element={
              <ProtectedRoute roles={['baker', 'commercial']}>
                <QuoteList />
              </ProtectedRoute>
            } />
            <Route path="/quotes/new" element={
              <ProtectedRoute roles={['baker']}>
                <QuoteForm />
              </ProtectedRoute>
            } />

            {/* Routes Produits */}
            <Route path="/products" element={
              <ProtectedRoute roles={['baker', 'commercial', 'supply']}>
                <ProductList />
              </ProtectedRoute>
            } />
            <Route path="/products/new" element={
              <ProtectedRoute roles={['commercial']}>
                <ProductForm />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
