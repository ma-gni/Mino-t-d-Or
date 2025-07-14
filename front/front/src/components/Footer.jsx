/**
 * Footer.jsx
 * --------------------------------------------------
 * Pied de page pour l'application Minot'Or
 * 
 * Ce composant affiche les informations légales, les liens utiles
 * et les coordonnées de contact en bas de toutes les pages.
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant de pied de page
 * 
 * @returns {JSX.Element} Le pied de page de l'application
 */
const Footer = () => {
  // Année courante pour le copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div>
            <h2 className="text-xl font-bold mb-4">Minot'Or</h2>
            <p className="text-sm text-gray-400 mb-4">
              Plateforme dédiée à la gestion des commandes et livraisons entre boulangers et meuniers.
            </p>
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Minot'Or - Tous droits réservés
            </p>
          </div>
          
          {/* Liens utiles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/a-propos" className="text-gray-400 hover:text-white transition">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link to="/aide" className="text-gray-400 hover:text-white transition">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/mentions-legales" className="text-gray-400 hover:text-white transition">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-gray-400 hover:text-white transition">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="text-gray-400 hover:text-white transition">
                  Conditions générales
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="text-sm text-gray-400 not-italic space-y-2">
              <p>15 rue des Meuniers</p>
              <p>75012 Paris, France</p>
              <p className="mt-4">
                <a href="tel:+33123456789" className="hover:text-white transition">
                  +33 1 23 45 67 89
                </a>
              </p>
              <p>
                <a href="mailto:contact@minotor.fr" className="hover:text-white transition">
                  contact@minotor.fr
                </a>
              </p>
            </address>
            
            {/* Réseaux sociaux */}
            <div className="mt-4 flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                aria-label="Facebook"
              >
                <span role="img" aria-label="Facebook">📱</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                aria-label="Twitter"
              >
                <span role="img" aria-label="Twitter">🐦</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <span role="img" aria-label="LinkedIn">💼</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
