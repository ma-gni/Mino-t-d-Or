import React, { useState } from 'react';

const Catalog = () => {
  const [filters, setFilters] = useState({
    type: '',
    minWeight: '',
    maxWeight: '',
    minPrice: '',
    maxPrice: ''
  });

  const [products] = useState([
    {
      id: 1,
      name: "Farine T55 Premium",
      type: "Farine blanche",
      weight: 25,
      priceHT: 45.99,
      priceTTC: 48.50,
      description: "Farine de blé de haute qualité pour boulangerie artisanale"
    },
    // Autres produits à ajouter
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addToQuote = (productId) => {
    // TODO: Implémenter l'ajout au devis
    console.log('Ajouter au devis:', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* En-tête du catalogue */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Catalogue Produits</h1>
          <p className="mt-2 text-gray-600">
            Découvrez notre sélection de farines et produits de qualité
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filtres */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Tous</option>
                <option value="blanche">Farine blanche</option>
                <option value="complete">Farine complète</option>
                <option value="speciale">Farine spéciale</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Poids min. (kg)</label>
              <input
                type="number"
                name="minWeight"
                value={filters.minWeight}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Poids max. (kg)</label>
              <input
                type="number"
                name="maxWeight"
                value={filters.maxWeight}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prix min. (€)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prix max. (€)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-2 text-gray-600">{product.description}</p>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500">Poids: {product.weight}kg</p>
                    <div className="mt-1">
                      <span className="text-lg font-bold text-gray-900">{product.priceTTC}€ TTC</span>
                      <span className="ml-2 text-sm text-gray-500">({product.priceHT}€ HT)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToQuote(product.id)}
                    className="btn-primary"
                  >
                    Ajouter au devis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
