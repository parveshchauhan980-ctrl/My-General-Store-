import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';
import { 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  X, 
  CheckCircle2, 
  ExternalLink,
  QrCode,
  Sparkles,
  FileCode2,
  Copy,
  Check,
  Package
} from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'mobile' | 'floating' | 'footer' | 'admin-banner';
  customLabel?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'header',
  customLabel 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'apk' | 'ios'>('android');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mygeneralstore.app';

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const copyStoreUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `🛒 Order fresh groceries from My General Store! Open on your Android phone to install our app directly:\n${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`;

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-sm"
          title="Install App & Download Android APK"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
          <span>{customLabel || (isInstalled ? '📱 App Installed' : '📱 Install APK / App')}</span>
        </button>
      )}

      {variant === 'mobile' && (
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between py-2.5 px-3 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>{customLabel || '📱 Android App & APK Center'}</span>
          </div>
          <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {isInstalled ? 'Manage' : 'Install'}
          </span>
        </button>
      )}

      {variant === 'footer' && (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white font-medium transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>{customLabel || '📱 Android APK & Mobile App Install'}</span>
        </button>
      )}

      {variant === 'admin-banner' && (
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl border border-emerald-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center text-emerald-200 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Android Mobile App & APK Distribution</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
                  v1.0 Ready
                </span>
              </h4>
              <p className="text-xs text-emerald-200 mt-0.5">
                Install as native WebAPK on Android or generate a standalone .APK file for WhatsApp distribution
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Open APK & App Center</span>
          </button>
        </div>
      )}

      {/* Installation Guide & APK Download Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 backdrop-blur-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">Android App & APK Center</h3>
                  <p className="text-xs text-emerald-200">मोबाइल ऐप और APK डाउनलोड केंद्र</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform & APK Tabs */}
            <div className="flex p-2 bg-gray-100 border-b border-gray-200 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'android'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>🤖 1-Click Install</span>
              </button>
              <button
                onClick={() => setActiveTab('apk')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'apk'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>📦 Standalone .APK</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'ios'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>🍏 iPhone (iOS)</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
              {activeTab === 'android' && (
                <div className="space-y-4">
                  {/* Explanation card */}
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-950">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Instant Android App Installation (No APK File Needed)</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Android automatically generates and installs a high-speed <strong>WebAPK</strong> straight to your home screen! It runs in full-screen standalone mode with app icon, splash screen, and offline grocery caching.
                    </p>
                  </div>

                  {/* 1-click install button if supported */}
                  {isInstallable ? (
                    <button
                      onClick={async () => {
                        await install();
                        setShowModal(false);
                      }}
                      className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install My General Store on Android</span>
                    </button>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="font-bold text-gray-800">Direct Steps on Android Chrome Browser:</p>
                      <div className="space-y-2 p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-gray-700">
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                          <span>Open this store in <strong>Google Chrome</strong> on your Android phone.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                          <span>Tap the <strong>three dots menu (⋮)</strong> at top right corner.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                          <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Sharing */}
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-800">Share App with Customers</h4>
                      <p className="text-[11px] text-gray-500">Send direct install link over WhatsApp</p>
                    </div>
                    <button
                      onClick={shareOnWhatsApp}
                      className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'apk' && (
                <div className="space-y-4">
                  {/* Why APK is not in raw code explanation */}
                  <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-blue-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-900">
                      <FileCode2 className="w-4 h-4 text-blue-700" />
                      <span>Why isn&apos;t an .APK binary stored directly in source code?</span>
                    </div>
                    <p className="text-[11px] text-blue-900/90 leading-relaxed">
                      Source code repositories contain TypeScript and web source code. Compiled Android <strong>.apk</strong> binary files are compiled on demand. We have provided ready-to-use Android files (<code>android/twa-manifest.json</code>, <code>android/build-apk.sh</code>, and <code>capacitor.config.json</code>) in the code section!
                    </p>
                  </div>

                  {/* Direct Android APK Download */}
                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-teal-950">
                      <Download className="w-4 h-4 text-teal-700" />
                      <span>Direct Android APK Package (Built & Ready)</span>
                    </div>
                    <p className="text-[11px] text-teal-800 leading-relaxed">
                      Download the pre-compiled standalone Android APK binary directly for installation and offline background services:
                    </p>
                    <a
                      href="/youpi-sms-gateway.apk"
                      download="youpi-sms-gateway.apk"
                      className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Android APK (289 KB)</span>
                    </a>
                  </div>

                  {/* 1-Click PWABuilder APK Generator */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-emerald-950">
                      <Download className="w-4 h-4 text-emerald-700" />
                      <span>Generate Store APK Online (Via PWABuilder)</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Use Microsoft&apos;s free official tool to package this store into a standalone Android <code>.apk</code> package in under 30 seconds:
                    </p>
                    <a
                      href={pwaBuilderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Generate APK on PWABuilder.com</span>
                    </a>
                  </div>

                  {/* Store URL Box for easy copy */}
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-700 block">Your Store Web URL for APK Builder:</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={currentUrl} 
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-800 outline-none"
                      />
                      <button
                        onClick={copyStoreUrl}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Local Command-line Build */}
                  <div className="p-3 bg-gray-900 text-gray-100 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-emerald-400">Build APK via Command Line (CLI):</span>
                    </div>
                    <pre className="text-[10px] font-mono text-gray-300 bg-black/40 p-2.5 rounded-lg overflow-x-auto">
{`# In terminal:
npm run build:apk
# Or with Bubblewrap:
npm i -g @bubblewrap/cli
cd android && bubblewrap build`}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-bold text-gray-800">How to Install on iPhone / iPad:</p>
                    <p className="text-[11px] text-gray-500">
                      Apple iOS allows web apps to be installed directly from Safari without needing the App Store.
                    </p>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-gray-700">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="block text-gray-900 font-semibold">1. Tap the Share Button</strong>
                          <span className="text-[11px] text-gray-500">In Safari&apos;s bottom toolbar, tap the square icon with an arrow pointing up.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <PlusSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="block text-gray-900 font-semibold">2. Tap &quot;Add to Home Screen&quot;</strong>
                          <span className="text-[11px] text-gray-500">Scroll down the menu and choose <strong>Add to Home Screen (होम स्क्रीन पर जोड़ें)</strong>.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="block text-gray-900 font-semibold">3. Tap &quot;Add&quot;</strong>
                          <span className="text-[11px] text-gray-500">The My General Store icon will appear on your iPhone screen like a native app!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-gray-400 font-mono">
                Docs: See APK_DOWNLOAD_AND_INSTALL.md
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
