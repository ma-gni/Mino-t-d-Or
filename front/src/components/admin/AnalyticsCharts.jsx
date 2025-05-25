/**
 * AnalyticsCharts.jsx
 * --------------------------------------------------
 * Composants de graphiques réutilisables pour les analytics
 * 
 * Ces composants utilisent Recharts pour créer des visualisations 
 * personnalisées pour le tableau de bord d'analytics
 */

import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Couleurs utilisées dans les graphiques
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A478F5', '#FF6B6B'];

/**
 * Graphique de visites par jour
 */
export const VisitesJourChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="jour" />
        <YAxis />
        <Tooltip formatter={(value, name) => [value, name === 'visites' ? 'Sessions' : 'Utilisateurs uniques']} />
        <Legend />
        <Bar dataKey="visites" name="Sessions" fill="#8884d8" />
        <Bar dataKey="utilisateurs" name="Utilisateurs uniques" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * Graphique horizontal des pages les plus visitées
 */
export const PagesPopulairesChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="page" type="category" width={150} />
        <Tooltip formatter={(value) => [`${value} vues`, 'Nombre de vues']} />
        <Legend />
        <Bar dataKey="vues" name="Nombre de vues" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * Graphique circulaire de la répartition par rôle
 */
export const RolesPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} vues`, name]} />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * Graphique de l'évolution des visites
 */
export const EvolutionVisitesChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="visiteurs" name="Visiteurs" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="pageVues" name="Pages vues" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

/**
 * Graphique pour les sources de trafic
 */
export const SourcesTraficChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} sessions`, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

/**
 * Composant pour le résumé des données par rôle avec légende colorée
 */
export const RoleSummary = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="p-4">
      <h3 className="text-base font-medium text-gray-800 mb-3">Répartition détaillée</h3>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li key={index} className="flex items-center">
            <span 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            <span className="flex-1">{item.name}</span>
            <span className="font-medium">{item.value} vues</span>
            <span className="text-sm text-gray-500 ml-2">
              ({((item.value / total) * 100).toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Carte statistique pour les métriques principales
 */
export const StatCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      {trend && (
        <div className={`mt-2 text-sm ${trendValue > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trendValue > 0 ? '↑' : '↓'} {Math.abs(trendValue)}% par rapport à la période précédente
        </div>
      )}
    </div>
  );
};

export default {
  VisitesJourChart,
  PagesPopulairesChart,
  RolesPieChart,
  EvolutionVisitesChart,
  SourcesTraficChart,
  RoleSummary,
  StatCard,
  COLORS
};
