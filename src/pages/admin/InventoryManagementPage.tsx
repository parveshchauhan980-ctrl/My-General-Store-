import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import type { Product } from '../../types/index.ts';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  History, 
  X, 
  Search, 
  ArrowUpRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export const InventoryManagementPage: React.FC = () => {
  const { products, inventoryLogs, restockProduct } = useStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState(20);
  const [restockNotes, setRestockNotes] = useState('');

  // Stock calculations
  const totalSKUs = products.length;
  const outOfStock = products.filter((p) => p.stock <= 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert);
  const inStock = products.filter((p) => p.stock > p.minStockAlert);

  const filteredProducts = products.filter((p) => {
    if (filterStatus === 'out' && p.stock > 0) return false;
    if (filterStatus === 'low' && (p.stock <= 0 || p.stock > p.minStockAlert)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    restockProduct(selectedProduct.id, restockAmount, restockNotes || 'Backoffice Restock');
    setSelectedProduct(null);
    setRestockNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Inventory & Stock Management</h1>
        <p className="text-xs text-gray-500 mt-0.5">Track warehouse levels, receive vendor restocks, and inspect audit logs</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-500 font-semibold uppercase text-[10px]">Total SKUs</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{totalSKUs}</p>
          <span className="text-emerald-700 font-medium text-[11px]">All catalog lines</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-500 font-semibold uppercase text-[10px]">Healthy Stock</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{inStock.length}</p>
          <span className="text-gray-400 text-[11px]">Above safe threshold</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-500 font-semibold uppercase text-[10px]">Low Stock Warning</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{lowStock.length}</p>
          <span className="text-amber-800 text-[11px] font-semibold">Needs reorder</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-500 font-semibold uppercase text-[10px]">Out of Stock</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{outOfStock.length}</p>
          <span className="text-rose-700 text-[11px] font-semibold">Customers cannot buy</span>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                filterStatus === 'all' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setFilterStatus('low')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                filterStatus === 'low' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Stock ({lowStock.length})
            </button>
            <button
              onClick={() => setFilterStatus('out')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                filterStatus === 'out' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Out of Stock ({outOfStock.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3">Min Alert Threshold</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isOut = p.stock <= 0;
                const isLow = !isOut && p.stock <= p.minStockAlert;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {p.name}
                      <span className="block text-[10px] text-gray-500 font-normal">
                        Pack: {p.unit} • Brand: {p.brand}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.categoryName}</td>
                    <td className="px-4 py-3 font-mono font-bold text-gray-900 text-sm">
                      {p.stock}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500">
                      {p.minStockAlert} units
                    </td>
                    <td className="px-4 py-3">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span>Out of Stock</span>
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Stock Alert</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>In Stock</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setRestockAmount(20);
                        }}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Audit Logs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <History className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-gray-900">Inventory Movement & Audit Logs</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold">
              <tr>
                <th className="px-3 py-2.5">Timestamp</th>
                <th className="px-3 py-2.5">Product</th>
                <th className="px-3 py-2.5">Change Type</th>
                <th className="px-3 py-2.5">Delta</th>
                <th className="px-3 py-2.5">Previous → New</th>
                <th className="px-3 py-2.5">Audit Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventoryLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-gray-900">{log.productName}</td>
                  <td className="px-3 py-2.5 uppercase text-[10px] font-bold">
                    <span className={`px-2 py-0.5 rounded ${
                      log.changeType === 'restock'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.changeType === 'sale'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {log.changeType}
                    </span>
                  </td>
                  <td className={`px-3 py-2.5 font-bold font-mono ${log.quantityDelta > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {log.quantityDelta > 0 ? `+${log.quantityDelta}` : log.quantityDelta}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-600">
                    {log.previousStock} → {log.newStock}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 italic">{log.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-gray-800 relative space-y-4 text-xs">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Restock Product</h3>
                <p className="text-[11px] text-gray-500">{selectedProduct.name}</p>
              </div>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg flex justify-between">
                <span>Current Stock:</span>
                <span className="font-bold text-gray-900">{selectedProduct.stock} units</span>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Quantity to Add *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Vendor / Mandi Batch Note</label>
                <input
                  type="text"
                  value={restockNotes}
                  onChange={(e) => setRestockNotes(e.target.value)}
                  placeholder="e.g. Mandi morning delivery, Lot #42"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Submit Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
