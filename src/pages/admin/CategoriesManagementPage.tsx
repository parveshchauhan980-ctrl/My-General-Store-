import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import type { Category } from '../../types/index.ts';
import { Plus, Edit, Trash2, X, Save, Layers, ArrowRight } from 'lucide-react';

export const CategoriesManagementPage: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1585994192701-f1a505c8b7be?w=600&auto=format&fit=crop&q=80',
    isActive: true
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      hindiName: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1585994192701-f1a505c8b7be?w=600&auto=format&fit=crop&q=80',
      isActive: true
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      hindiName: cat.hindiName || '',
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      isActive: cat.isActive
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name,
        hindiName: formData.hindiName,
        slug,
        description: formData.description,
        image: formData.image,
        isActive: formData.isActive
      });
      setEditingCategory(null);
    } else {
      addCategory({
        name: formData.name,
        hindiName: formData.hindiName,
        slug,
        description: formData.description,
        image: formData.image,
        itemCount: 0,
        isActive: formData.isActive
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Categories Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Organize store aisles, departments, and category banners</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-28 w-full bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm leading-tight">{cat.name}</h3>
                  {cat.hindiName && (
                    <p className="text-[11px] text-emerald-300 font-medium">{cat.hindiName}</p>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <p className="text-gray-500 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                    {productCount} Products Linked
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {(isAddModalOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-gray-800 relative">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingCategory(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dals & Pulses"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Hindi Name (Optional)</label>
                <input
                  type="text"
                  value={formData.hindiName}
                  onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                  placeholder="e.g. दालें और दलहन"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. dals-pulses (auto-generated if empty)"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of items in this category"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
