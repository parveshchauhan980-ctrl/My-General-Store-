import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { formatINR } from '../../utils/calculations.ts';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/common/StatusBadge.tsx';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  CreditCard, 
  ArrowUpRight, 
  ArrowRight, 
  Users, 
  CheckCircle2,
  Clock,
  Boxes
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    orders, 
    products, 
    payments, 
    customers, 
    navigateAdmin, 
    updateOrderStatus,
    settings 
  } = useStore();

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.orderStatus !== 'cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'placed').length;
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);
  const pendingPayments = payments.filter((p) => p.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Sales Volume</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{formatINR(totalRevenue)}</h3>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Verified Indian Retail</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{orders.length}</h3>
            <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-0.5 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingOrders} awaiting dispatch</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Catalog SKU Count */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Catalog SKUs</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{products.length} Items</h3>
            <span className="text-[11px] text-gray-500 font-medium mt-1 block">
              Across 7 grocery aisles
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Stock Alerts</p>
            <h3 className="text-2xl font-black text-amber-900 mt-1">{lowStockProducts.length} Items</h3>
            <button
              onClick={() => navigateAdmin('admin-inventory')}
              className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline mt-1 block text-left"
            >
              Restock warehouse now →
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Row: Recent Orders & Quick Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Recent Customer Orders</h2>
              <p className="text-[11px] text-gray-500">Live order status and processing queue</p>
            </div>
            <button
              onClick={() => navigateAdmin('admin-orders')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 text-gray-600 font-bold border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Order Status</th>
                  <th className="px-4 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-[11px] text-gray-500">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-emerald-950">
                      {formatINR(order.total)}
                    </td>
                    <td className="px-4 py-3.5">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-3.5">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {order.orderStatus === 'placed' ? (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-[11px] transition-colors"
                        >
                          Confirm
                        </button>
                      ) : order.orderStatus === 'confirmed' ? (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                          className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded text-[11px] transition-colors"
                        >
                          Dispatch
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Stock Warnings & Payments */}
        <div className="lg:col-span-4 space-y-6">
          {/* Inventory Alerts Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-gray-900">Inventory Alerts</h2>
              </div>
              <button
                onClick={() => navigateAdmin('admin-inventory')}
                className="text-[11px] font-bold text-emerald-700 hover:underline"
              >
                Manage
              </button>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-2.5">
                {lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-900 truncate max-w-[170px]">{p.name}</p>
                      <p className="text-[10px] text-amber-800 font-semibold">
                        Stock: {p.stock} units left (Min Alert: {p.minStockAlert})
                      </p>
                    </div>
                    <button
                      onClick={() => navigateAdmin('admin-inventory')}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] rounded transition-colors"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-gray-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p>All catalog products are well-stocked.</p>
              </div>
            )}
          </div>

          {/* Pending Payment Verification Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-gray-900">UPI / COD Verifications</h2>
              </div>
              <button
                onClick={() => navigateAdmin('admin-payments')}
                className="text-[11px] font-bold text-emerald-700 hover:underline"
              >
                Audit ({pendingPayments.length})
              </button>
            </div>

            {pendingPayments.length > 0 ? (
              <div className="space-y-2">
                {pendingPayments.slice(0, 3).map((pay) => (
                  <div
                    key={pay.id}
                    className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-gray-900">{pay.orderNumber}</span>
                      <span className="font-extrabold text-emerald-950">{formatINR(pay.amount)}</span>
                    </div>
                    <p className="text-[11px] text-gray-500">{pay.customerName} • {pay.paymentMethod.toUpperCase()}</p>
                    {pay.transactionReference && (
                      <p className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                        Ref: {pay.transactionReference}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-2 text-center">No pending verifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
