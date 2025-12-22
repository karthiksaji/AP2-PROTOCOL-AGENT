import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../api/ap2Api';

interface ProductCarouselProps {
  products: Product[];
  onSelect: (product: Product) => void;
  selectedProduct: Product | null;
}

export function ProductCarousel({ products, onSelect, selectedProduct }: ProductCarouselProps) {
  return (
    <div className="w-full space-y-4">
      {products.map((product, index) => {
        const isSelected = selectedProduct?.name === product.name;
        
        return (
          <div 
            key={index}
            onClick={() => onSelect(product)}
            className={`
              w-full flex items-center gap-4 bg-surface border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group p-3
              ${isSelected 
                ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                : 'border-border hover:border-gray-600 hover:bg-white/5'
              }
            `}
          >
            {/* Image Placeholder */}
            <div className="h-24 w-24 flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <ShoppingCart className={`w-8 h-8 ${isSelected ? 'text-indigo-400' : 'text-gray-600'} transition-colors`} />
              
              {/* Badge */}
              {index === 0 && (
                 <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                   Best
                 </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div>
                <h3 className="font-bold text-white leading-tight truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {product.merchant || product.brand || 'Unknown Source'}
                </p>
              </div>

              <div className="mt-1">
                <span className="text-lg font-bold text-white">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                 <p className="text-xs text-gray-500 truncate max-w-[70%]">
                   High quality product from trusted merchant.
                 </p>
                 <button 
                  className={`
                    p-1.5 rounded-md transition-colors
                    ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'}
                  `}
                >
                  {isSelected ? <Star className="w-3 h-3 fill-current" /> : <ShoppingCart className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
