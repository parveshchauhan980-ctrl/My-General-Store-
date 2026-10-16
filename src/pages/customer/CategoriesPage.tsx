import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { CategoryCard } from '../../components/common/CategoryCard.tsx';
import { Layers, ArrowLeft } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, navigateCustomer } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateCustomer('home')}
              className="p-1 text-gray-500 hover:text-emerald-700 transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Product Categories
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 pl-6">
            Browse our organized aisles of grains, pulses, spices, and household essentials
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};
