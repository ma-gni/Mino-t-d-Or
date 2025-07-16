// src/pages/Home.jsx

/**
 * Home.jsx
 * --------------------------------------------------
 * Page d'accueil de l'application Minot'Or
 * 
 * Cette page présente :
 * - Une section hero avec une image de fond et un appel à l'action
 * - Des statistiques clés sur une ligne (satisfaction client, commandes traitées, etc.)
 * - Les étapes d'utilisation du service
 * - Les avantages de la plateforme alignés horizontalement
 * - Les fonctionnalités principales du service
 * - Une section CTA (Call To Action) pour l'inscription
 * 
 * La page adapte son contenu en fonction de l'état d'authentification de l'utilisateur.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant fonctionnel Home
 * 
 * Ce composant utilise l'hook useAuth pour récupérer l'état d'authentification de l'utilisateur.
 * Il définit également les données pour les sections statistiques, étapes, avantages et fonctionnalités.
 */
const Home = () => {
  const { isAuthenticated } = useAuth();

  /**
   * Données pour la section statistiques
   * 
   * Chaque objet représente une statistique avec un nombre et une étiquette.
   */
  const stats = [
    { number: "98%", label: "Satisfaction client" },
    { number: "2.5M", label: "Commandes traitées" },
    { number: "41", label: "Entrepôts en France" },
    { number: "24/7", label: "Support disponible" }
  ];

  /**
   * Données pour la section étapes
   * 
   * Chaque objet représente une étape avec un numéro, un titre et une description.
   */
  const steps = [
    {
      number: "01",
      title: "Inscrivez-vous",
      description: "Créez votre compte en quelques minutes et accédez à notre plateforme"
    },
    {
      number: "02",
      title: "Passez commande",
      description: "Parcourez notre catalogue et commandez en quelques clics"
    },
    {
      number: "03",
      title: "Suivez en temps réel",
      description: "Surveillez l'état de vos commandes et livraisons"
    }
  ];

  /**
   * Données pour la section avantages
   * 
   * Chaque objet représente un avantage avec un icône, un titre et une description.
   */
  const benefits = [
    {
      icon: "⚡",
      title: "Gain de temps",
      description: "Réduisez de 75% le temps passé sur la gestion des commandes"
    },
    {
      icon: "💰",
      title: "Économies",
      description: "Optimisez vos coûts grâce à notre système de gestion intelligent"
    },
    {
      icon: "📊",
      title: "Visibilité totale",
      description: "Accédez à toutes vos données en temps réel"
    },
    {
      icon: "🔄",
      title: "Automatisation",
      description: "Automatisez vos processus de commande et de livraison"
    }
  ];

  /**
   * Données pour la section fonctionnalités
   * 
   * Chaque objet représente une fonctionnalité avec un icône, un titre et une description.
   */
  const features = [
    {
      icon: "🏭",
      title: "Gestion des commandes",
      description: "Passez vos commandes en quelques clics et suivez leur statut en temps réel"
    },
    {
      icon: "📦",
      title: "Gestion des stocks",
      description: "Suivez vos stocks en temps réel dans nos 41 entrepôts"
    },
    {
      icon: "🚚",
      title: "Livraison intégrée",
      description: "Planifiez et suivez vos livraisons avec notre système de transport intégré"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="full-screen-section">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3840&q=100"
            alt="Champ de blé doré"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content section-content">
          <div className="text-center">
            <h1 className="heading-1 mb-8 animate-fade-in animate-float">
              Simplifiez la gestion de vos commandes avec Minot'Or
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-white animate-slide-up delay-200">
              La solution tout-en-un qui révolutionne la relation entre boulangers et minotiers.
              Gagnez du temps et optimisez vos processus.
            </p>
            <div className="mt-10 flex justify-center gap-4 animate-scale-in delay-400">
              {!isAuthenticated ? (
                <>
                  <Link to="/inscription" className="btn-primary animate-border-glow">
                    Commencer gratuitement
                  </Link>
                  <Link to="/connexion" className="btn-secondary text-white border-white hover:bg-white/10">
                    Se connecter
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn-primary animate-border-glow">
                  Accéder au tableau de bord
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="section bg-white">
        <div className="section-content">
          <div className="flex flex-row justify-center items-center space-x-12 md:space-x-24 w-full max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-5xl font-bold text-indigo-600 mb-2 animate-float">
                  {stat.number}
                </div>
                <div className="text-xl text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="section bg-gray-50">
        <div className="section-content">
          <div className="text-center mb-16">
            <h2 className="heading-2 animate-fade-in">
              Comment ça marche ?
            </h2>
            <p className="mt-4 paragraph animate-slide-up delay-200">
              Commencez à utiliser Minot'Or en trois étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative feature-card animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-6xl font-bold text-indigo-100 absolute -top-8 -left-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 relative">
                  {step.title}
                </h3>
                <p className="text-gray-600 relative">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="section bg-white">
        <div className="section-content">
          <div className="text-center mb-16">
            <h2 className="heading-2 animate-fade-in">
              Pourquoi choisir Minot'Or ?
            </h2>
            <p className="mt-4 paragraph animate-slide-up delay-200">
              Des avantages concrets pour votre activité
            </p>
          </div>

          <div className="flex flex-row justify-center items-stretch space-x-6 flex-wrap w-full max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="feature-card text-center animate-scale-in flex-1 min-w-[250px] max-w-[300px] flex flex-col justify-between"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="text-5xl mb-4 animate-float">
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-lg text-gray-600 flex-grow">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section bg-gray-50">
        <div className="section-content">
          <div className="text-center mb-16">
            <h2 className="heading-2 animate-fade-in">
              Une solution complète
            </h2>
            <p className="mt-4 paragraph animate-slide-up delay-200">
              Toutes les fonctionnalités dont vous avez besoin
            </p>
          </div>

          <div className="grid-cols-features">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card animate-scale-in w-full max-w-xs"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="text-5xl animate-float mb-4">{feature.icon}</span>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900 text-center">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-lg text-gray-500 text-center">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section bg-indigo-700">
        <div className="section-content">
          <div className="lg:flex lg:items-center lg:justify-between animate-fade-in">
            <h2 className="heading-2 text-white">
              <span className="block animate-slide-up">Prêt à optimiser votre activité ?</span>
              <span className="block text-indigo-200 text-lg mt-2 animate-slide-up delay-200">
                Rejoignez les centaines d'entreprises qui font confiance à Minot'Or
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 animate-scale-in delay-300">
              {!isAuthenticated ? (
                <div className="flex gap-4">
                  <Link to="/inscription" className="btn-primary bg-white text-indigo-600 hover:bg-gray-100 animate-border-glow">
                    Essayer gratuitement
                  </Link>
                  <Link to="/contact" className="btn-secondary text-white border-white hover:bg-white/10">
                    Nous contacter
                  </Link>
                </div>
              ) : (
                <Link to="/dashboard" className="btn-primary bg-white text-indigo-600 hover:bg-gray-100 animate-border-glow">
                  Accéder au tableau de bord
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
