/**
 * StatCard.jsx
 * --------------------------------------------------
 * Composant de carte statistique réutilisable
 * 
 * Ce composant affiche une statistique avec :
 * - Un titre
 * - Une valeur
 * - Une icône optionnelle
 * - Une tendance optionnelle
 */

import React from 'react';

/**
 * Composant StatCard
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Le titre de la statistique
 * @param {string|number} props.value - La valeur de la statistique
 * @param {string} [props.icon] - L'icône à afficher (emoji ou classe CSS)
 * @param {string} [props.color] - La couleur de fond (classe Tailwind)
 * @param {boolean} [props.trend] - Afficher la tendance
 * @param {number} [props.trendValue] - La valeur de la tendance en pourcentage
 * @param {string} [props.trendLabel] - Le libellé de la tendance
 * @returns {JSX.Element} Le composant StatCard
 */
export default function StatCard({ 
  title, 
  value, 
  icon, 
  color = 'bg-white', 
  trend = false, 
  trendValue = 0,
  trendLabel 
}) {
  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (value) => {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
  };

  return (
    <div className={`${color} rounded-lg shadow p-5 transition-all duration-200 hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`mt-2 text-sm ${getTrendColor(trendValue)}`}>
              <span className="font-medium">
                {getTrendIcon(trendValue)} {Math.abs(trendValue)}%
              </span>
              {trendLabel && (
                <span className="text-gray-500 ml-1">vs {trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <span className="text-3xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
} 