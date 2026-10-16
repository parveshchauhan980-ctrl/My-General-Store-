import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import type { PaymentRecord, PaymentStatus } from '../../types/index.ts';
import { formatINR } from '../../utils/calculations.ts';
import { PaymentStatusBadge } from '../../components/common/StatusBadge.tsx';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  X, 
  ShieldCheck, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export const PaymentVerificationPage: React.FC = () => {
  const { payments, verifyPayment, adminUser, settings } = useStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  const filteredPayments = payments.filter((pay) => {
    if (filter !== 'all' && pay.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        pay.orderNumber.toLowerCase().includes(q) ||
        pay.customerName.toLowerCase().includes(q) ||
        (pay.transactionReference && pay.transactionReference.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAction = (status: PaymentStatus) => {
    if (!selectedPayment) return;
    verifyPayment(selectedPayment.id, status, verificationNotes);
    setSelectedPayment(null);
    setVerificationNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-2 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Payment Verification Ledger</h1>
        <p className="text-xs text-gray-500 mt-0.5">Audit customer UPI transaction references and cash on delivery clearances</p>
      </div>

      {/* Security notice */}
      <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Real Merchant UPI VPA: {settings.upiId} ({settings.upiName})</p>
          <p className="text-[11px] text-emerald-800">
            For online UPI payments, confirm the 12-digit UTR against your HDFC/ICICI merchant statement before clicking "Verify". Verified records update the order to Confirmed status.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filter === 'all' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Payments ({payments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filter === 'pending' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending Verification ({payments.filter(p => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filter === 'verified' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Verified ({payments.filter(p => p.status === 'verified').length})
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order #, customer, UTR..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Transaction UTR / Ref</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verified By</th>
                <th className="px-4 py-3 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-gray-900">
                    {pay.orderNumber}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900">
                    {pay.customerName}
                  </td>
                  <td className="px-4 py-3.5 font-extrabold text-emerald-950">
                    {formatINR(pay.amount)}
                  </td>
                  <td className="px-4 py-3.5 font-bold uppercase text-[11px] text-gray-700">
                    {pay.paymentMethod}
                  </td>
                  <td className="px-4 py-3.5">
                    {pay.transactionReference ? (
                      <span className="font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        {pay.transactionReference}
                      </span>
                    ) : (
                      <span className="text-gray-400">Cash collection</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <PaymentStatusBadge status={pay.status} />
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-[11px]">
                    {pay.verifiedBy ? (
                      <span>{pay.verifiedBy} ({new Date(pay.verifiedAt!).toLocaleDateString('en-IN')})</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">Pending Audit</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {pay.status === 'pending' ? (
                      <button
                        onClick={() => {
                          setSelectedPayment(pay);
                          setVerificationNotes(pay.paymentMethod === 'cod' ? 'Cash verified on delivery' : 'Bank statement credit confirmed');
                        }}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                      >
                        Verify / Review
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedPayment(pay)}
                        className="px-2.5 py-1 text-gray-500 hover:text-gray-800 rounded font-semibold text-xs"
                      >
                        View Audit Log
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-gray-800 relative space-y-4 text-xs">
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Payment Audit Review</h3>
                <p className="text-[11px] text-gray-500">{selectedPayment.orderNumber}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="font-bold text-gray-900">{selectedPayment.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payable Amount:</span>
                <span className="font-extrabold text-emerald-950 text-sm">{formatINR(selectedPayment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-bold uppercase text-gray-900">{selectedPayment.paymentMethod}</span>
              </div>
              {selectedPayment.transactionReference && (
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">Customer UTR:</span>
                  <span className="font-mono font-bold text-emerald-900">{selectedPayment.transactionReference}</span>
                </div>
              )}
            </div>

            {selectedPayment.status === 'pending' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Administrator Audit Note
                  </label>
                  <input
                    type="text"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="e.g. Verified in UPI merchant ledger"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAction('rejected')}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject / Flag</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('verified')}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Clear</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <p className="font-bold text-emerald-950">Payment Record Already Settled</p>
                <p className="text-emerald-800">Status: <span className="font-semibold uppercase">{selectedPayment.status}</span></p>
                <p className="text-emerald-800">Audited By: {selectedPayment.verifiedBy}</p>
                <p className="text-emerald-800">Note: {selectedPayment.notes || '—'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
