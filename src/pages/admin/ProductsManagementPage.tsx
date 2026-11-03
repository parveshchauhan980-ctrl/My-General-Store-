import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import type { Product } from '../../types/index.ts';
import { formatINR } from '../../utils/calculations.ts';
import { ProductImageStudioModal } from '../../components/admin/ProductImageStudioModal.tsx';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Package, 
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Database,
  RefreshCw,
  Sparkles,
  RotateCcw,
  Tag,
  Wand2
} from 'lucide-react';

export const ProductsManagementPage: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    restockProduct,
    syncCatalogToFirebase,
    resetToDMartStock,
    addToast 
  } = useStore();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockItem, setRestockItem] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    brand: '',
    categoryId: categories[0]?.id || 'cat-dals',
    unit: '1 kg',
    mrp: 100,
    price: 90,
    stock: 20,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1585994192701-f1a505c8b7be?w=600&auto=format&fit=crop&q=80',
    description: '',
    isFeatured: false
  });

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      hindiName: '',
      brand: '',
      categoryId: categories[0]?.id || 'cat-dals',
      unit: '1 kg',
      mrp: 100,
      price: 85,
      stock: 25,
      minStockAlert: 5,
      image: 'https://images.unsplash.com/photo-1585994192701-f1a505c8b7be?w=600&auto=format&fit=crop&q=80',
      description: 'Authentic Indian grocery staple packed fresh.',
      isFeatured: false
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      hindiName: product.hindiName || '',
      brand: product.brand,
      categoryId: product.categoryId,
      unit: product.unit,
      mrp: product.mrp,
      price: product.price,
      stock: product.stock,
      minStockAlert: product.minStockAlert,
      image: product.image,
      description: product.description,
      isFeatured: !!product.isFeatured
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === formData.categoryId);
    const categoryName = cat ? cat.name : 'Groceries';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        hindiName: formData.hindiName,
        brand: formData.brand,
        categoryId: formData.categoryId,
        categoryName,
        unit: formData.unit,
        mrp: Number(formData.mrp),
        price: Number(formData.price),
        stock: Number(formData.stock),
        minStockAlert: Number(formData.minStockAlert),
        inStock: Number(formData.stock) > 0,
        image: formData.image,
        description: formData.description,
        isFeatured: formData.isFeatured
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name,
        hindiName: formData.hindiName,
        brand: formData.brand,
        categoryId: formData.categoryId,
        categoryName,
        unit: formData.unit,
        mrp: Number(formData.mrp),
        price: Number(formData.price),
        stock: Number(formData.stock),
        minStockAlert: Number(formData.minStockAlert),
        inStock: Number(formData.stock) > 0,
        image: formData.image,
        description: formData.description,
        isFeatured: formData.isFeatured,
        rating: 4.8,
        reviewCount: 1,
        tags: ['New Stock']
      });
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem) return;
    restockProduct(restockItem.id, restockQty, 'Backoffice Restock Form');
    setRestockItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Products Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage store grocery catalog, pricing, units, and inventory</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              if (window.confirm('Remove previous stock and reset to complete 36+ DMart Premia and top brand grocery catalog?')) {
                resetToDMartStock();
              }
            }}
            title="Remove before stock and load fresh DMart supermarket catalog"
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>Reset to DMart Stock</span>
          </button>

          <button
            onClick={() => setIsImageStudioOpen(true)}
            title="Open AI Product Image Studio & Generator"
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Image Studio</span>
          </button>

          <button
            onClick={async () => {
              setIsSyncing(true);
              await syncCatalogToFirebase();
              setIsSyncing(false);
            }}
            disabled={isSyncing}
            title="Push local catalog items to Firestore cloud database (Requires Admin login)"
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, Hindi name, or brand..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold text-gray-800 outline-none focus:border-emerald-500"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Pack Unit</th>
                <th className="px-4 py-3">MRP</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-4 py-3">Stock Level</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isOut = p.stock <= 0;
                const isLow = !isOut && p.stock <= p.minStockAlert;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0 border border-gray-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-gray-900 leading-snug">{p.name}</p>
                            {p.brand === 'DMart Premia' && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold tracking-wide uppercase shrink-0">
                                Premia
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span className="font-semibold text-emerald-800 uppercase">{p.brand}</span>
                            {p.hindiName && <span>• {p.hindiName}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {p.categoryName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-mono text-[11px]">
                        {p.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 line-through">
                      {formatINR(p.mrp)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-extrabold text-emerald-950 block">
                        {formatINR(p.price)}
                      </span>
                      {p.mrp > p.price && (
                        <span className="text-[10px] text-emerald-700 font-semibold leading-none">
                          Save {formatINR(p.mrp - p.price)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isOut
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setRestockItem(p);
                            setRestockQty(10);
                          }}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                          title="Restock units"
                        >
                          <Boxes className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${p.name}" from catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 text-gray-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingProduct ? 'Edit Product Details' : 'Add New Grocery Product'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tata Sampann Toor Dal"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Hindi Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. अरहर दाल"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Tata Sampann, Aashirvaad, Amul"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Pack Size / Unit *</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. 1 kg, 5 kg, 500 g, 1 L"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-700 font-semibold">Product Image URL *</label>
                    <button
                      type="button"
                      onClick={() => setIsImageStudioOpen(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>AI Generator & DMart Studio</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                      <img
                        src={formData.image}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Restock Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-gray-800 relative">
            <button
              onClick={() => setRestockItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Restock Product</h3>
                <p className="text-[11px] text-gray-500">{restockItem.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmRestock} className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between">
                <span>Current Warehouse Stock:</span>
                <span className="font-bold text-gray-900">{restockItem.stock} units</span>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Units to Add</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Product Image Studio Modal */}
      <ProductImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
        onSelectImage={(newUrl) => {
          setFormData((prev) => ({ ...prev, image: newUrl }));
          addToast('Product image updated from AI Studio!', 'success');
        }}
        initialProductName={formData.name || (editingProduct ? editingProduct.name : '')}
        initialBrand={formData.brand || (editingProduct ? editingProduct.brand : 'DMart Premia')}
        initialCategory={categories.find(c => c.id === formData.categoryId)?.name || 'Dals & Pulses'}
      />
    </div>
  );
};
