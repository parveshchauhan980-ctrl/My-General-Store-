import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { formatINR } from '../../utils/calculations.ts';
import { Users, Search, Mail, Phone, MapPin, ShoppingBag, Calendar } from 'lucide-react';

export const CustomersManagementPage: React.FC = () => {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.displayName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phoneNumber && c.phoneNumber.includes(q)) ||
        (c.address?.city && c.address.city.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Customer Directory</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage customer accounts, delivery addresses, and lifetime order values</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-gray-500 font-semibold">{filteredCustomers.length} registered customers</span>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Delivery City</th>
                <th className="px-4 py-3">Orders Placed</th>
                <th className="px-4 py-3">Total Spend</th>
                <th className="px-4 py-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((cust) => {
                const custOrders = orders.filter((o) => o.customerId === cust.uid || o.customerEmail === cust.email);
                const totalSpent = custOrders.reduce((acc, o) => acc + (o.orderStatus !== 'cancelled' ? o.total : 0), 0);

                return (
                  <tr key={cust.uid} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {cust.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{cust.displayName}</p>
                          <p className="text-[11px] text-gray-500">{cust.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 font-mono">
                      {cust.phoneNumber || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      {cust.address?.city ? (
                        <span>{cust.address.city} ({cust.address.postalCode})</span>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {custOrders.length} orders
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-emerald-950">
                      {formatINR(totalSpent)}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-IN') : 'Jan 2026'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
