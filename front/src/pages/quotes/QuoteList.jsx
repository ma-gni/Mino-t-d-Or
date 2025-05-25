import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
        <Link
          to="/quotes/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Nouveau devis
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun devis trouvé</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {quotes.map((quote) => (
              <li key={quote.id}>
                <Link to={`/quotes/${quote.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {quote.reference}
                          </p>
                          <p className="text-sm text-gray-500">
                            {quote.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          quote.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}
                        >
                          {quote.status === 'pending' ? 'En attente' :
                           quote.status === 'approved' ? 'Approuvé' : 'Refusé'}
                        </p>
                        <p className="ml-4 text-sm text-gray-500">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuoteList;
