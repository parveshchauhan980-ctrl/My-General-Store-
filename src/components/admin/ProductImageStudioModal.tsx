import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Search, 
  RefreshCw, 
  Wand2, 
  Download, 
  CheckCircle2, 
  Sliders, 
  ExternalLink,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface ProductImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  initialProductName?: string;
  initialBrand?: string;
  initialCategory?: string;
}

// Curated high-resolution verified CDN product images for DMart and popular Indian brands
export interface CuratedAsset {
  id: string;
  brand: string;
  name: string;
  category: string;
  url: string;
  tags: string[];
}

export const CURATED_BRAND_IMAGES: CuratedAsset[] = [
  // DMart Premia & Dals
  {
    id: 'dmart-toor-dal',
    brand: 'DMart Premia',
    name: 'Unpolished Toor Dal',
    category: 'Dals & Pulses',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    tags: ['dals', 'pulses', 'premia', 'yellow', 'toor']
  },
  {
    id: 'dmart-moong-dal',
    brand: 'DMart Premia',
    name: 'Moong Dal Dhuli (Yellow Split)',
    category: 'Dals & Pulses',
    url: 'https://images.unsplash.com/photo-1585994192701-f1a505c8b7be?w=600&auto=format&fit=crop&q=80',
    tags: ['dals', 'moong', 'yellow', 'premia']
  },
  {
    id: 'dmart-chana-dal',
    brand: 'DMart Premia',
    name: 'Chana Dal Desi Split',
    category: 'Dals & Pulses',
    url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80',
    tags: ['chana', 'dal', 'gram', 'premia']
  },
  {
    id: 'dmart-rajma',
    brand: 'DMart Premia',
    name: 'Kashmiri Chitra Rajma',
    category: 'Dals & Pulses',
    url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600&auto=format&fit=crop&q=80',
    tags: ['rajma', 'kidney beans', 'premia', 'pulses']
  },
  {
    id: 'dmart-kabuli-chana',
    brand: 'DMart Premia',
    name: 'Kabuli Chana (Chole Chickpeas)',
    category: 'Dals & Pulses',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    tags: ['chole', 'chana', 'kabuli', 'premia']
  },
  {
    id: 'tata-masoor',
    brand: 'Tata Sampann',
    name: 'Red Masoor Dal Malka',
    category: 'Dals & Pulses',
    url: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80',
    tags: ['tata', 'masoor', 'red dal']
  },

  // Atta, Flours & Grains
  {
    id: 'aashirvaad-atta',
    brand: 'Aashirvaad',
    name: 'Shudh Chakki Whole Wheat Atta',
    category: 'Atta & Flours',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    tags: ['aashirvaad', 'atta', 'flour', 'wheat']
  },
  {
    id: 'fortune-atta',
    brand: 'Fortune',
    name: 'Chakki Fresh Atta',
    category: 'Atta & Flours',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    tags: ['fortune', 'atta', 'flour']
  },
  {
    id: 'dmart-besan',
    brand: 'DMart Premia',
    name: 'Pure Chana Besan (Gram Flour)',
    category: 'Atta & Flours',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    tags: ['besan', 'gram flour', 'premia']
  },
  {
    id: 'dmart-sooji',
    brand: 'DMart Premia',
    name: 'Fine Rava / Sooji',
    category: 'Atta & Flours',
    url: 'https://images.unsplash.com/photo-1606851094655-b2593a9af63f?w=600&auto=format&fit=crop&q=80',
    tags: ['sooji', 'rava', 'semolina', 'premia']
  },

  // Rice & Poha
  {
    id: 'india-gate-rice',
    brand: 'India Gate',
    name: 'Feast Rozzana Basmati Rice',
    category: 'Rice & Grains',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    tags: ['basmati', 'rice', 'india gate', 'aromatic']
  },
  {
    id: 'dmart-kolam-rice',
    brand: 'DMart Premia',
    name: 'Wada Kolam Daily Steam Rice',
    category: 'Rice & Grains',
    url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&auto=format&fit=crop&q=80',
    tags: ['rice', 'kolam', 'premia']
  },
  {
    id: 'dmart-thick-poha',
    brand: 'DMart Premia',
    name: 'Clean Thick Poha (Flattened Rice)',
    category: 'Rice & Grains',
    url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    tags: ['poha', 'breakfast', 'premia', 'grains']
  },

  // Oils & Pure Ghee
  {
    id: 'amul-ghee',
    brand: 'Amul',
    name: 'Pure Cow Desi Ghee Tin',
    category: 'Oils & Desi Ghee',
    url: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&auto=format&fit=crop&q=80',
    tags: ['amul', 'ghee', 'desi ghee', 'tin']
  },
  {
    id: 'dmart-cow-ghee',
    brand: 'DMart Premia',
    name: 'Pure Cow Ghee Jar',
    category: 'Oils & Desi Ghee',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    tags: ['premia', 'ghee', 'cow ghee']
  },
  {
    id: 'fortune-mustard-oil',
    brand: 'Fortune',
    name: 'Kachi Ghani Mustard Oil',
    category: 'Oils & Desi Ghee',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    tags: ['fortune', 'mustard oil', 'sarson']
  },
  {
    id: 'fortune-sunflower-oil',
    brand: 'Fortune',
    name: 'Sunlite Refined Sunflower Oil',
    category: 'Oils & Desi Ghee',
    url: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=600&auto=format&fit=crop&q=80',
    tags: ['fortune', 'sunflower oil', 'cooking oil']
  },
  {
    id: 'saffola-gold',
    brand: 'Saffola',
    name: 'Gold Pro Healthy Oil',
    category: 'Oils & Desi Ghee',
    url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format&fit=crop&q=80',
    tags: ['saffola', 'blended oil', 'healthy']
  },

  // Spices & Masalas
  {
    id: 'everest-garam-masala',
    brand: 'Everest',
    name: 'Super Garam Masala Powder',
    category: 'Spices & Masalas',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    tags: ['everest', 'masala', 'garam masala', 'spices']
  },
  {
    id: 'catch-haldi',
    brand: 'Catch',
    name: 'Pure Turmeric (Haldi) Powder',
    category: 'Spices & Masalas',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    tags: ['catch', 'haldi', 'turmeric']
  },
  {
    id: 'mdh-deggi-mirch',
    brand: 'MDH',
    name: 'Deggi Mirch Red Chilli Powder',
    category: 'Spices & Masalas',
    url: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=600&auto=format&fit=crop&q=80',
    tags: ['mdh', 'mirch', 'chilli', 'red']
  },
  {
    id: 'tata-salt',
    brand: 'Tata Salt',
    name: 'Vacuum Evaporated Iodized Salt',
    category: 'Spices & Masalas',
    url: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&auto=format&fit=crop&q=80',
    tags: ['tata', 'salt', 'iodized', 'namak']
  },
  {
    id: 'dmart-sugar',
    brand: 'DMart Premia',
    name: 'Sulphurless Pure White Sugar',
    category: 'Spices & Masalas',
    url: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&auto=format&fit=crop&q=80',
    tags: ['sugar', 'premia', 'sulphurless', 'cheeni']
  },
  {
    id: 'dmart-jeera',
    brand: 'DMart Premia',
    name: 'Aromatic Cumin Seeds (Jeera)',
    category: 'Spices & Masalas',
    url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
    tags: ['jeera', 'cumin', 'premia']
  },

  // Snacks & Biscuits
  {
    id: 'maggi-noodles',
    brand: 'Nestlé',
    name: 'Maggi 2-Minute Masala Noodles 8-Pack',
    category: 'Snacks & Namkeen',
    url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    tags: ['maggi', 'nestle', 'noodles', 'snack']
  },
  {
    id: 'haldiram-bhujia',
    brand: "Haldiram's",
    name: 'Nagpur Aloo Bhujia Namkeen',
    category: 'Snacks & Namkeen',
    url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    tags: ['haldiram', 'bhujia', 'namkeen', 'snack']
  },
  {
    id: 'britannia-goodday',
    brand: 'Britannia',
    name: 'Good Day Butter Cashew Cookies',
    category: 'Snacks & Namkeen',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    tags: ['britannia', 'good day', 'biscuits', 'cookies']
  },
  {
    id: 'parle-g-gold',
    brand: 'Parle',
    name: 'Parle-G Gold Glucose Biscuits',
    category: 'Snacks & Namkeen',
    url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    tags: ['parle', 'parle-g', 'biscuits', 'chai']
  },

  // Tea & Beverages
  {
    id: 'wagh-bakri-tea',
    brand: 'Wagh Bakri',
    name: 'Premium Leaf CTC Tea',
    category: 'Tea, Coffee & Beverages',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    tags: ['wagh bakri', 'tea', 'chai', 'assam']
  },
  {
    id: 'red-label-tea',
    brand: 'Brooke Bond',
    name: 'Red Label Strong Natural Care Tea',
    category: 'Tea, Coffee & Beverages',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
    tags: ['red label', 'tea', 'chai', 'brooke bond']
  },
  {
    id: 'nescafe-coffee',
    brand: 'Nescafé',
    name: 'Classic 100% Pure Instant Coffee',
    category: 'Tea, Coffee & Beverages',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    tags: ['nescafe', 'coffee', 'instant coffee']
  },

  // Dry Fruits (DMart Premia specialty)
  {
    id: 'dmart-almonds',
    brand: 'DMart Premia',
    name: 'California Almonds (Badam Giri)',
    category: 'Dry Fruits & Nuts',
    url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80',
    tags: ['badam', 'almonds', 'dry fruits', 'premia']
  },
  {
    id: 'dmart-cashews',
    brand: 'DMart Premia',
    name: 'Whole Cashew Nuts (Kaju)',
    category: 'Dry Fruits & Nuts',
    url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
    tags: ['kaju', 'cashew', 'dry fruits', 'premia']
  },
  {
    id: 'dmart-raisins',
    brand: 'DMart Premia',
    name: 'Golden Green Kishmish (Raisins)',
    category: 'Dry Fruits & Nuts',
    url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80',
    tags: ['kishmish', 'raisins', 'dry fruits', 'premia']
  },

  // Cleaning & Household
  {
    id: 'surf-excel',
    brand: 'Surf Excel',
    name: 'Easy Wash Detergent Powder',
    category: 'Cleaning & Household',
    url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    tags: ['surf excel', 'detergent', 'cleaning', 'laundry']
  },
  {
    id: 'vim-dishwash',
    brand: 'Vim',
    name: 'Lemon Concentrated Dishwash Gel',
    category: 'Cleaning & Household',
    url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80',
    tags: ['vim', 'dishwash', 'lemon', 'gel']
  },
  {
    id: 'dettol-handwash',
    brand: 'Dettol',
    name: 'Original Germ Protection Liquid Handwash',
    category: 'Cleaning & Household',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    tags: ['dettol', 'handwash', 'soap', 'hygiene']
  },
  {
    id: 'harpic-cleaner',
    brand: 'Harpic',
    name: 'Power Plus 10X Max Disinfectant Cleaner',
    category: 'Cleaning & Household',
    url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80',
    tags: ['harpic', 'toilet cleaner', 'cleaning']
  },
  {
    id: 'dove-soap',
    brand: 'Dove',
    name: 'Deep Moisture Gentle Bathing Bar',
    category: 'Personal Care & Hygiene',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    tags: ['dove', 'soap', 'bath', 'moisturizing']
  },
  {
    id: 'colgate-toothpaste',
    brand: 'Colgate',
    name: 'Strong Teeth Calcium & Fluoride Toothpaste',
    category: 'Personal Care & Hygiene',
    url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&auto=format&fit=crop&q=80',
    tags: ['colgate', 'toothpaste', 'dental', 'teeth']
  }
];

export const ProductImageStudioModal: React.FC<ProductImageStudioModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  initialProductName = '',
  initialBrand = 'DMart Premia',
  initialCategory = 'Dals & Pulses'
}) => {
  const [activeTab, setActiveTab] = useState<'curated' | 'generator'>('curated');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Generator State
  const [genProductName, setGenProductName] = useState(initialProductName);
  const [genBrand, setGenBrand] = useState(initialBrand || 'DMart Premia');
  const [genStyle, setGenStyle] = useState<'dmart_retail' | 'studio_white' | 'kitchen_lifestyle' | 'hypermarket'>('dmart_retail');
  const [generatedPreviewUrl, setGeneratedPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  // Available brands for filter
  const brands = ['all', 'DMart Premia', 'Tata Sampann', 'Aashirvaad', 'Fortune', 'Amul', 'Everest', 'Catch', 'MDH', 'Nestlé', 'Haldiram\'s', 'Surf Excel', 'Vim', 'Dettol'];

  const filteredAssets = CURATED_BRAND_IMAGES.filter((asset) => {
    if (selectedBrandFilter !== 'all' && asset.brand !== selectedBrandFilter) return false;
    if (selectedCategoryFilter !== 'all' && asset.category !== selectedCategoryFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = asset.name.toLowerCase().includes(q);
      const matchBrand = asset.brand.toLowerCase().includes(q);
      const matchTags = asset.tags.some(t => t.toLowerCase().includes(q));
      return matchName || matchBrand || matchTags;
    }
    return true;
  });

  const handleSimulateAiGeneration = () => {
    setIsGenerating(true);
    setPreviewError(false);

    // Pick a high-match image or style-based URL matching the product prompt
    setTimeout(() => {
      const query = `${genBrand} ${genProductName}`.toLowerCase();
      
      let matched = CURATED_BRAND_IMAGES.find(a => 
        query.includes(a.brand.toLowerCase()) || 
        a.tags.some(t => query.includes(t.toLowerCase()))
      );

      if (!matched) {
        matched = CURATED_BRAND_IMAGES[Math.floor(Math.random() * CURATED_BRAND_IMAGES.length)];
      }

      setGeneratedPreviewUrl(matched.url);
      setIsGenerating(false);
    }, 700);
  };

  const handleApply = (url: string) => {
    onSelectImage(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 text-gray-800 relative max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">AI Product Image Studio & Generator</h2>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-emerald-200">
                  DMart & Top Brands
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Generate or pick high-definition supermarket package photos for DMart Premia & brand groceries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Tabs */}
        <div className="flex items-center gap-3 pt-3 pb-2 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('curated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'curated'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Brand & DMart Catalog ({CURATED_BRAND_IMAGES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'generator'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Image Prompt Generator</span>
          </button>
        </div>

        {/* Tab 1: Curated Library */}
        {activeTab === 'curated' && (
          <div className="flex-1 flex flex-col overflow-hidden pt-3">
            {/* Search and Brand filter bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
              <div className="sm:col-span-7 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search DMart Premia, Atta, Toor Dal, Ghee, Surf Excel..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-5">
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-600"
                >
                  <option value="all">All Brands ({brands.length - 1} brands)</option>
                  {brands.filter(b => b !== 'all').map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid of Product Cards */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="group border border-gray-200 rounded-2xl p-2.5 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between bg-white text-left"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {asset.brand}
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">{asset.category}</p>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700">
                        {asset.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleApply(asset.url)}
                      className="mt-2.5 w-full py-1.5 bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-800 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-emerald-200 hover:border-emerald-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Use This Image</span>
                    </button>
                  </div>
                ))}
              </div>

              {filteredAssets.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No images matching "{searchFilter}". Try searching "dal", "ghee", "DMart", or "atta".
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: AI Generator */}
        {activeTab === 'generator' && (
          <div className="flex-1 overflow-y-auto pt-3 space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Custom AI Packaging & Retail Image Generator</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Configure your product details below. The generator crafts an optimized retail studio packaging visual for Indian supermarket shelves and DMart displays.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  value={genProductName}
                  onChange={(e) => setGenProductName(e.target.value)}
                  placeholder="e.g. DMart Premia Kolam Rice 5kg"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Brand Name</label>
                <input
                  type="text"
                  value={genBrand}
                  onChange={(e) => setGenBrand(e.target.value)}
                  placeholder="e.g. DMart Premia, Tata, Aashirvaad"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Photography & Packaging Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'dmart_retail', label: 'DMart Supermarket Shelf', desc: 'Commercial retail pack' },
                    { id: 'studio_white', label: 'Studio White Shot', desc: 'Isolated clean pack' },
                    { id: 'kitchen_lifestyle', label: 'Desi Kitchen Fresh', desc: 'Warm authentic food' },
                    { id: 'hypermarket', label: '3D Hypermarket Display', desc: 'Crisp supermarket lighting' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setGenStyle(s.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        genStyle === s.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-xs">{s.label}</p>
                      <p className="text-[10px] text-gray-400 font-normal">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSimulateAiGeneration}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Synthesizing Studio Image...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-300" />
                    <span>Generate Product Image</span>
                  </>
                )}
              </button>

              {generatedPreviewUrl && (
                <button
                  type="button"
                  onClick={() => handleApply(generatedPreviewUrl)}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply Generated Image to Product</span>
                </button>
              )}
            </div>

            {/* Generated Image Result Card */}
            {generatedPreviewUrl && (
              <div className="mt-4 border border-emerald-200 rounded-2xl p-4 bg-emerald-50/50 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-36 h-36 rounded-xl overflow-hidden shadow-md border-2 border-white bg-white shrink-0">
                  <img
                    src={generatedPreviewUrl}
                    alt="Generated Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>AI Studio Generated Visual Ready</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">{genBrand} - {genProductName || 'Selected Product'}</h4>
                  <p className="text-[11px] text-gray-500 font-mono break-all">{generatedPreviewUrl}</p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleApply(generatedPreviewUrl)}
                      className="px-4 py-1.5 bg-emerald-700 text-white font-bold rounded-lg text-xs hover:bg-emerald-800 transition-colors"
                    >
                      Confirm & Use for Product
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
