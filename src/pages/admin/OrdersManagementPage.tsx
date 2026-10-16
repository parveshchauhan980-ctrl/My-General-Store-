import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import type { Order, OrderStatus } from '../../types/index.ts';
import { formatINR } from '../../utils/calculations.ts';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/common/StatusBadge.tsx';
import { 
  Search, 
  Eye, 
  X, 
  MapPin, 
  Calendar, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Truck,
  Filter
} from 'lucide-react';

export const OrdersManagementPage: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q)
      );
    }
    return true;
  });

  const ALL_STATUSES: { key: OrderStatus; label: string }[] = [
    { key: 'placed', label: 'Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'packing', label: 'Packing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Orders Management</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage customer fulfillment, dispatch rider logistics, and deliveries</p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders ({orders.length})
            </button>
            {ALL_STATUSES.map((st) => {
              const count = orders.filter((o) => o.orderStatus === st.key).length;
              return (
                <button
                  key={st.key}
                  onClick={() => setStatusFilter(st.key)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    statusFilter === st.key
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {st.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order # or customer..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-[11px] text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {order.items.length} items
                  </td>
                  <td className="px-4 py-3 font-extrabold text-emerald-950">
                    {formatINR(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-500"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st.key} value={st.key}>{st.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-gray-800 relative max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold text-gray-900">
                  {selectedOrder.orderNumber}
                </span>
                <OrderStatusBadge status={selectedOrder.orderStatus} />
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Customer Details */}
            <div className="bg-gray-50 p-3.5 rounded-xl space-y-1.5">
              <p className="font-bold text-gray-900">Customer & Delivery</p>
              <p><span className="text-gray-500">Name:</span> {selectedOrder.customerName}</p>
              <p><span className="text-gray-500">Phone:</span> {selectedOrder.customerPhone}</p>
              <p><span className="text-gray-500">Email:</span> {selectedOrder.customerEmail}</p>
              <p className="pt-1">
                <span className="text-gray-500">Address:</span> {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.landmark ? `${selectedOrder.deliveryAddress.landmark}, ` : ''}{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.postalCode}
              </p>
              {selectedOrder.notes && (
                <p className="text-amber-800 font-medium pt-1">
                  Rider Note: {selectedOrder.notes}
                </p>
              )}
            </div>

            {/* Items */}
            <div>
              <p className="font-bold text-gray-900 mb-2">Order Items ({selectedOrder.items.length})</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900 truncate max-w-[200px]">{item.product.name}</p>
                        <p className="text-[10px] text-gray-500">{item.product.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatINR(item.product.price * item.quantity)}</p>
                      <p className="text-[10px] text-gray-500">{item.quantity} × {formatINR(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatINR(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax:</span>
                <span>{formatINR(selectedOrder.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : formatINR(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-950 text-sm pt-1 border-t border-emerald-200">
                <span>Total Amount:</span>
                <span>{formatINR(selectedOrder.total)}</span>
              </div>
              <div className="pt-2 text-[11px] text-gray-600 flex justify-between items-center">
                <span>Payment Method: {selectedOrder.paymentMethod.toUpperCase()}</span>
                <PaymentStatusBadge status={selectedOrder.paymentStatus} />
              </div>
              {selectedOrder.paymentTransactionId && (
                <p className="text-[10px] font-mono text-emerald-900 bg-white px-2 py-1 rounded border border-emerald-200">
                  UTR Reference: {selectedOrder.paymentTransactionId}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
