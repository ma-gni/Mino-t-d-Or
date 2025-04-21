import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => `
    relative px-3 py-2 text-sm font-medium transition-colors duration-200
    ${isActivePath(path)
      ? 'text-indigo-600'
      : 'text-gray-700 hover:text-indigo-600'
    }
    ${isActivePath(path) && 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600'}
  `;

  return (
    <nav className={`
      fixed w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-md' 
        : 'bg-white/80 backdrop-blur-sm'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Minot'Or
              </span>
            </Link>
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              <Link to="/" className={linkClass('/')}>
                Accueil
              </Link>
              <Link to="/products" className={linkClass('/products')}>
                Produits
              </Link>
              <Link to="/about" className={linkClass('/about')}>
                À propos
              </Link>
              <Link to="/contact" className={linkClass('/contact')}>
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex md:items-center md:space-x-4">
                  <Link to="/dashboard" className={linkClass('/dashboard')}>
                    Tableau de bord
                  </Link>
                  <Link to="/quotes" className={linkClass('/quotes')}>
                    Devis
                  </Link>
                  <Link to="/orders" className={linkClass('/orders')}>
                    Commandes
                  </Link>
                </div>
                <div className="relative group">
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="hidden md:flex md:flex-col md:items-start">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.firstName || 'Utilisateur'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.role || 'Compte'}
                      </span>
                    </div>
                  </div>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
