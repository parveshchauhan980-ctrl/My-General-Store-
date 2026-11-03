import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { buildUpiUri, buildUpiAppLinks, generateQrDataUrl, isValidUtr } from '../../utils/upi.ts';
import type { StoreSettings } from '../../types/index.ts';

interface UpiPaymentCardProps {
  settings: StoreSettings;
  amount: number;
  orderNumber: string;
  upiTransactionId: string;
  onUpiTransactionIdChange: (value: string) => void;
  onPaymentConfirmed?: () => void;
}

export const UpiPaymentCard: React.FC<UpiPaymentCardProps> = ({
  settings,
  amount,
  orderNumber,
  upiTransactionId,
  onUpiTransactionIdChange,
  onPaymentConfirmed
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dynamic' | 'standee'>('dynamic');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes timer
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(true);
  const [showUtrHelp, setShowUtrHelp] = useState<boolean>(false);

  const upiId = settings.upiId || 'parveshchauhan980@okhdfcbank';
  const upiName = settings.upiName || settings.storeName || 'My General Store';

  const upiUri = buildUpiUri({
    upiId,
    upiName,
    amount,
    orderNumber,
    transactionNote: `Order ${orderNumber} at ${settings.storeName}`
  });

  const appLinks = buildUpiAppLinks(upiUri);

  // Generate dynamic QR code data URL whenever amount, upiId or orderNumber change
  useEffect(() => {
    let isMounted = true;
    setIsGeneratingQr(true);

    generateQrDataUrl(upiUri, { width: 320 })
      .then((url) => {
        if (isMounted) {
          setQrCodeUrl(url);
          setIsGeneratingQr(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate dynamic UPI QR:', err);
        if (isMounted) setIsGeneratingQr(false);
      });

    return () => {
      isMounted = false;
    };
  }, [upiUri]);

  // 5-minute countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = activeTab === 'standee' && settings.upiQrImageUrl ? settings.upiQrImageUrl : qrCodeUrl;
    link.download = `UPI-QR-${orderNumber || 'Order'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasCustomStandee = Boolean(settings.upiQrImageUrl && settings.upiQrImageUrl.trim() !== '');

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-b from-emerald-50/90 to-white rounded-2xl border-2 border-emerald-300 shadow-sm space-y-4">
      {/* Header with 0% Fee & Timer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5">
              <span>Instant UPI Payment Gateway</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-300">
                0% Extra Fee
              </span>
            </h3>
            <p className="text-[11px] text-gray-600">Scan QR or tap your preferred UPI app below</p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>QR Valid: {formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* QR Tab Switcher (if custom standee is configured) */}
      {hasCustomStandee && (
        <div className="flex items-center gap-2 p-1 bg-emerald-100/60 rounded-xl max-w-sm">
          <button
            type="button"
            onClick={() => setActiveTab('dynamic')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'dynamic'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dynamic QR (₹{amount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('standee')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'standee'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Merchant Standee QR</span>
          </button>
        </div>
      )}

      {/* QR Code Presentation & Merchant Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* QR Code Display */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative p-3 bg-white rounded-2xl border-2 border-emerald-300 shadow-md group">
            {activeTab === 'dynamic' ? (
              isGeneratingQr ? (
                <div className="w-48 h-48 sm:w-52 sm:h-52 flex flex-col items-center justify-center bg-gray-50 rounded-xl text-gray-400">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-[11px] font-medium">Generating QR...</span>
                </div>
              ) : qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt={`UPI QR for ${upiId}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg text-xs text-gray-500">
                  QR unavailable
                </div>
              )
            ) : (
              <img
                src={settings.upiQrImageUrl}
                alt="Store Merchant QR Standee"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg bg-gray-50"
              />
            )}

            {/* Amount Badge pinned at bottom */}
            <div className="mt-2 text-center">
              <span className="inline-block bg-emerald-900 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                Pay Exactly: ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownloadQr}
            className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 hover:border-emerald-300 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save / Download QR</span>
          </button>

          {/* Google Pay Gallery Notice Explanation */}
          <div className="mt-2.5 p-2 bg-amber-50 rounded-xl border border-amber-200/80 text-[10px] text-amber-900 leading-tight max-w-[240px] text-left space-y-1">
            <p className="font-bold flex items-center gap-1 text-amber-950">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Scanning from Phone Gallery?</span>
            </p>
            <p className="text-[10px] text-amber-800">
              If Google Pay shows <em>&quot;You can pay up to ₹2,000 with QR codes via gallery&quot;</em>, simply tap <strong>DISMISS</strong>. This is a standard NPCI notice, not an error!
            </p>
          </div>
        </div>

        {/* Merchant Information & Mobile 1-Tap Trigger */}
        <div className="md:col-span-7 space-y-3">
          {/* 1-Tap Direct Mobile Payment Button (Opens native UPI drawer directly without QR scanning) */}
          <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl text-white shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-200" />
                <span>Paying on this Mobile Phone?</span>
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">1-Tap Pay</span>
            </div>
            <p className="text-[11px] text-emerald-100 leading-snug">
              No need to screenshot or scan! Tap below to open Google Pay, PhonePe, or Paytm directly:
            </p>
            <a
              href={upiUri}
              className="w-full py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pay ₹{amount.toFixed(2)} via Any UPI App</span>
            </a>
          </div>

          {/* Merchant VPA & Name Card */}
          <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-500">Merchant Name</span>
              <span className="font-bold text-gray-900 text-right">{upiName}</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
              <span className="text-[11px] font-medium text-gray-500">Merchant UPI VPA</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  title="Copy UPI ID"
                  className="p-1 rounded bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
              <span className="text-[11px] font-medium text-gray-500">Payment Reference</span>
              <span className="font-mono text-gray-700 font-semibold">{orderNumber}</span>
            </div>
          </div>

          {/* App-Specific 1-Tap Mobile UPI Launcher */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-xs font-bold text-gray-900">
                Or launch your favorite UPI app directly:
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Google Pay */}
              <a
                href={appLinks.gpay}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-gray-200 bg-white hover:bg-blue-50/50 hover:border-blue-400 text-gray-800 text-xs font-bold shadow-2xs transition-all active:scale-95"
              >
                <span className="text-blue-600 font-black">G</span>Pay
              </a>

              {/* PhonePe */}
              <a
                href={appLinks.phonepe}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-gray-200 bg-white hover:bg-purple-50/50 hover:border-purple-400 text-gray-800 text-xs font-bold shadow-2xs transition-all active:scale-95"
              >
                <span className="text-purple-700 font-black">पे</span> PhonePe
              </a>

              {/* Paytm */}
              <a
                href={appLinks.paytm}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-gray-200 bg-white hover:bg-sky-50/50 hover:border-sky-400 text-gray-800 text-xs font-bold shadow-2xs transition-all active:scale-95"
              >
                <span className="text-sky-600 font-black">Pay</span>tm
              </a>

              {/* Any UPI App */}
              <a
                href={appLinks.generic}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-emerald-300 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all active:scale-95"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Any App</span>
              </a>
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5">
              * Tapping any button opens the app with recipient &amp; ₹{amount.toFixed(2)} pre-filled.
            </p>
          </div>
        </div>
      </div>

      {/* UTR / Transaction Reference Submission */}
      <div className="pt-3 border-t border-emerald-200 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <label className="block text-xs font-bold text-emerald-950">
            UPI Reference / 12-Digit UTR Number
          </label>
          <button
            type="button"
            onClick={() => setShowUtrHelp(!showUtrHelp)}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Where to find UTR?</span>
            {showUtrHelp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable UTR location helper */}
        {showUtrHelp && (
          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-[11px] text-gray-700 space-y-2 animate-fadeIn shadow-2xs">
            <p className="font-bold text-emerald-950">How to find your 12-digit payment reference:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 bg-blue-50/60 rounded-lg border border-blue-100">
                <span className="font-bold text-blue-900 block mb-0.5">Google Pay</span>
                <span className="text-[10px] text-gray-600">Open transaction &gt; look for <strong>UPI transaction ID</strong> (12 digits).</span>
              </div>
              <div className="p-2 bg-purple-50/60 rounded-lg border border-purple-100">
                <span className="font-bold text-purple-900 block mb-0.5">PhonePe</span>
                <span className="text-[10px] text-gray-600">Open payment details &gt; look for <strong>UTR</strong> number.</span>
              </div>
              <div className="p-2 bg-sky-50/60 rounded-lg border border-sky-100">
                <span className="font-bold text-sky-900 block mb-0.5">Paytm / Others</span>
                <span className="text-[10px] text-gray-600">Open payment receipt &gt; look for <strong>UPI Ref No</strong>.</span>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={upiTransactionId}
            onChange={(e) => onUpiTransactionIdChange(e.target.value.trim())}
            placeholder="e.g. 423984719201 or tap button below"
            className="w-full px-3 py-2.5 bg-white border-2 border-emerald-300 rounded-xl text-xs font-mono font-bold text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
          />
          {upiTransactionId && (
            <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[11px]">
              {isValidUtr(upiTransactionId) ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Valid Format
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Added
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick Helper Shortcut Buttons if user doesn't want to type manual UTR */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onUpiTransactionIdChange(`PAID-${Date.now().toString().slice(-6)}`)}
            className="text-[11px] font-bold py-1 px-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg border border-emerald-300 transition-colors flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>I have paid in App (Auto-Confirm)</span>
          </button>

          <button
            type="button"
            onClick={() => onUpiTransactionIdChange(`VERIFY-ON-DELIVERY-${orderNumber}`)}
            className="text-[11px] font-medium py-1 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-200 transition-colors"
          >
            Don&apos;t have UTR? Verify via Phone
          </button>
        </div>

        <div className="flex items-start gap-1.5 text-[11px] text-emerald-900 pt-0.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            100% Secure Kirana Payment. If you don&apos;t have the UTR number, tap &quot;I have paid in App&quot; above and our team will match your payment against the store ledger.
          </span>
        </div>
      </div>
    </div>
  );
};
