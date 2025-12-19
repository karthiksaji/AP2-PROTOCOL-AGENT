import { Product } from '../api/ap2Api';
import { ShoppingCart, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProceed: () => void;
  isAutoPurchasing?: boolean;
}

export function ProductCard({ product, onProceed, isAutoPurchasing }: ProductCardProps) {
  return (
    <div className="w-full bg-surface border border-border rounded-xl p-6 animate-in zoom-in-95 duration-500">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
          <p className="text-gray-400">Selected best match: {product.merchant || product.brand}</p>
        </div>
        <div className="bg-indigo-500/10 p-3 rounded-lg">
          <ShoppingCart className="w-6 h-6 text-indigo-400" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-white">₹{product.price.toLocaleString()}</p>
        </div>
        <button
          onClick={onProceed}
          disabled={product.price === 0 || isAutoPurchasing}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isAutoPurchasing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Auto-Processing...
            </>
          ) : (
            product.price === 0 ? 'Unavailable' : 'Proceed to Payment'
          )}
        </button>
      </div>
    </div>
  );
}

