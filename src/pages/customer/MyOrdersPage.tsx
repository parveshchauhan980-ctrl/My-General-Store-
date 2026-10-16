import React from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { OrderStatusBadge, PaymentStatusBadge } from '../../components/common/StatusBadge.tsx';
import { formatINR } from '../../utils/calculations.ts';
import { 
  Package, 
  Clock, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import type { OrderStatus } from '../../types/index.ts';

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packing', label: 'Packing' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' }
];

export const MyOrdersPage: React.FC = () => {
  const { orders, currentUser, navigateCustomer } = useStore();

  // Filter orders for logged-in user or show all demo customer orders if matching
  const customerOrders = currentUser
    ? orders.filter((o) => o.customerId === currentUser.uid || o.customerEmail === currentUser.email)
    : orders;

  if (customerOrders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-gray-100 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">No Orders Placed Yet</h2>
        <p className="text-xs text-gray-500 mt-2 mb-6">
          You haven't placed any grocery orders yet. Start shopping our fresh mandi staples!
        </p>
        <button
          onClick={() => navigateCustomer('products')}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
        >
          Explore All Products
        </button>
      </div>
    );
  }

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'confirmed': return 1;
      case 'packing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">My Orders & Tracking</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Live tracking and history of your grocery orders
        </p>
      </div>

      <div className="space-y-6">
        {customerOrders.map((order) => {
          const currentStep = getStepIndex(order.orderStatus);
          const isCancelled = order.orderStatus === 'cancelled';

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 space-y-5 transition-all hover:border-emerald-200"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-gray-900">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.orderStatus} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-gray-700 uppercase text-[10px]">
                      Payment: {order.paymentMethod.toUpperCase()}
                      {order.paymentTransactionId && ` (${order.paymentTransactionId})`}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total Amount</span>
                  <span className="text-xl font-black text-emerald-950">
                    {formatINR(order.total)}
                  </span>
                </div>
              </div>

              {/* Order Timeline Tracker */}
              {!isCancelled && (
                <div className="py-2">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Live Delivery Status
                  </p>
                  <div className="relative flex items-center justify-between">
                    {/* Track line background */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-500 z-0"
                      style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />

                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-gray-200 text-gray-500'
                            } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1.5 font-semibold text-center whitespace-nowrap ${
                              isCurrent ? 'text-emerald-900 font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-900">Ordered Items ({order.items.length})</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-gray-500">
                          {item.quantity} × {formatINR(item.product.price)} ({item.product.unit})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Note */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-950">Deliver to: </span>
                    <span>
                      {order.deliveryAddress.street}, {order.deliveryAddress.landmark ? `${order.deliveryAddress.landmark}, ` : ''}{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}
                    </span>
                  </div>
                </div>
                {order.notes && (
                  <span className="text-[11px] text-gray-500 italic">
                    Note: "{order.notes}"
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
