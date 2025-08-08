/**
 * LoadingSpinner.jsx
 * --------------------------------------------------
 * Composant de chargement réutilisable
 * 
 * Ce composant affiche différents types de spinners :
 * - Spinner simple
 * - Spinner avec texte
 * - Spinner plein écran
 * - Spinner avec overlay
 */

import React from 'react';

/**
 * Composant LoadingSpinner
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} [props.size] - Taille du spinner (sm, md, lg, xl)
 * @param {string} [props.text] - Texte à afficher avec le spinner
 * @param {boolean} [props.fullScreen] - Afficher en plein écran
 * @param {boolean} [props.overlay] - Afficher avec overlay
 * @param {string} [props.color] - Couleur du spinner
 * @returns {JSX.Element} Le composant LoadingSpinner
 */
export default function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
  overlay = false,
  color = 'text-indigo-600'
}) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      case 'md':
      default:
        return 'w-6 h-6';
    }
  };

  const SpinnerContent = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={`${getSizeClasses()} ${color} animate-spin`}>
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 text-center">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <SpinnerContent />
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <SpinnerContent />
        </div>
      </div>
    );
  }

  return <SpinnerContent />;
}

/**
 * Composant LoadingDots pour un effet de points animés
 */
export function LoadingDots({ text = 'Chargement...' }) {
  return (
    <div className="flex items-center justify-center space-x-1">
      <span className="text-sm text-gray-600">{text}</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

/**
 * Composant LoadingBar pour une barre de progression
 */
export function LoadingBar({ progress = 0, text }) {
  return (
    <div className="w-full">
      {text && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{text}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Composant LoadingSkeleton pour les placeholders
 */
export function LoadingSkeleton({ type = 'text', lines = 3, className = '' }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-300 h-12 w-12" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
          </div>
        );
      
      case 'text':
      default:
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={`h-4 bg-gray-300 rounded ${
                  index === lines - 1 ? 'w-3/4' : 'w-full'
                }`}
              />
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
} 