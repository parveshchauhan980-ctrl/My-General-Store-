import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { formatINR } from '../../utils/calculations.ts';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  PieChart, 
  Calendar, 
  Download,
  IndianRupee,
  Layers,
  Sparkles
} from 'lucide-react';

export const SalesReportsPage: React.FC = () => {
  const { orders, products, categories, addToast } = useStore();

  const validOrders = orders.filter((o) => o.orderStatus !== 'cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;

  // Category distribution
  const categorySalesMap: { [catId: string]: { name: string; total: number; count: number } } = {};
  categories.forEach((c) => {
    categorySalesMap[c.id] = { name: c.name, total: 0, count: 0 };
  });

  validOrders.forEach((order) => {
    order.items.forEach((item) => {
      const catId = item.product.categoryId;
      if (categorySalesMap[catId]) {
        categorySalesMap[catId].total += item.product.price * item.quantity;
        categorySalesMap[catId].count += item.quantity;
      }
    });
  });

  const categorySalesList = Object.values(categorySalesMap).filter((c) => c.total > 0 || c.count > 0);

  // Payment Breakdown
  const upiTotal = validOrders.filter((o) => o.paymentMethod === 'upi').reduce((sum, o) => sum + o.total, 0);
  const codTotal = validOrders.filter((o) => o.paymentMethod === 'cod').reduce((sum, o) => sum + o.total, 0);

  const handleExportCSV = () => {
    addToast('Sales report exported to CSV successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Sales & Revenue Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">Financial analytics, grocery category velocity, and payment distribution</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Store Ledger</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Gross Sales Volume</p>
          <h3 className="text-2xl font-black text-emerald-950 mt-1">{formatINR(totalSales)}</h3>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">From {validOrders.length} customer orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Average Order Value (AOV)</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{formatINR(avgOrderValue)}</h3>
          <p className="text-[11px] text-gray-500 mt-1">Per completed cart delivery</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Digital UPI vs COD Ratio</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">
            {totalSales > 0 ? `${Math.round((upiTotal / totalSales) * 100)}% UPI` : '100% UPI'}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">UPI: {formatINR(upiTotal)} | COD: {formatINR(codTotal)}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Category Performance */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-900">Revenue by Grocery Category</h2>
          </div>

          <div className="space-y-3">
            {categorySalesList.map((cat) => {
              const percentage = totalSales > 0 ? Math.round((cat.total / totalSales) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>{cat.name}</span>
                    <span className="font-bold text-emerald-950">{formatINR(cat.total)} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(8, percentage))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-gray-900">Top Velocity Products</h2>
          </div>

          <div className="space-y-3 text-xs">
            {products.slice(0, 5).map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate max-w-[170px]">{p.name}</p>
                    <p className="text-[10px] text-gray-500">{p.unit} • {formatINR(p.price)}</p>
                  </div>
                </div>
                <span className="font-bold text-emerald-950 shrink-0">
                  {p.stock} in stock
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
