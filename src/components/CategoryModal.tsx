import { X } from 'lucide-react';
import { useEffect } from 'react';
import type { CategoryProduct } from '../data/categoryDetails';
import { resolveImage } from '../data/supabaseClient';

interface CategoryModalProps {
  categoryName: string;
  products: CategoryProduct[];
  customImages?: Record<string, string>;
  onClose: () => void;
}

export default function CategoryModal({ categoryName, products, customImages = {}, onClose }: CategoryModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-8 py-5 flex items-center justify-between z-10">
          <h3 className="text-2xl font-bold text-gray-900">{categoryName}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-8">
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Product details coming soon for this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-orange-200"
                >
                  <div className="h-48 overflow-hidden bg-gray-200 relative">
                    <img
                      src={resolveImage(categoryName, product, customImages)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h4>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
