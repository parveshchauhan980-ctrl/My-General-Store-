import React from 'react';
import type { Category } from '../../types/index.ts';
import { useStore } from '../../context/StoreContext.tsx';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { navigateCustomer, products } = useStore();

  const count = products.filter((p) => p.categoryId === category.id).length;

  return (
    <div
      onClick={() => navigateCustomer('products', { categoryId: category.id })}
      className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col text-left"
    >
      <div className="relative h-36 w-full overflow-hidden bg-emerald-950">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
        
        {/* Floating count badge */}
        <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
          {count} items
        </span>
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
              {category.name}
            </h3>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
          </div>
          {category.hindiName && (
            <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
              {category.hindiName}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
          <span>Explore Category</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
};
