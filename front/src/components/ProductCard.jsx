export default function ProductCard({ product }) {
    return (
      <div className="border rounded-2xl p-4 shadow hover:shadow-lg transition bg-white">
        <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <p className="text-green-600 font-semibold mt-2">{product.price} € HT</p>
        {product.onQuote && (
          <p className="text-yellow-600 text-sm mt-1">Sur demande de devis</p>
        )}
      </div>
    );
  }
  