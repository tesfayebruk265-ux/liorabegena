import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Star,
  Heart,
  Eye,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  X,
  Share2,
  Tag,
  ShieldCheck,
  Truck,
  MapPin,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  StoreProductExtended,
  CartItem,
  WishlistItem,
  ProductCondition,
  ProductReview,
  ProductQuestion,
  Language
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';
import { SAMPLE_STORE_PRODUCTS, SAMPLE_REVIEWS, SAMPLE_QUESTIONS } from './StoreData';

interface StoreFrontProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  cartItems: CartItem[];
  onAddToCart: (product: StoreProductExtended, quantity: number, variantId?: string, branchId?: string) => void;
  wishlistItems: WishlistItem[];
  onToggleWishlist: (product: StoreProductExtended) => void;
  selectedBranchFilter?: string;
  initialCategory?: string;
}

export function StoreFront({
  lang,
  onNavigate,
  cartItems,
  onAddToCart,
  wishlistItems,
  onToggleWishlist,
  selectedBranchFilter = 'All',
  initialCategory
}: StoreFrontProps) {
  const { currentUser, addNotification } = useAuth();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedBranch, setSelectedBranch] = useState<string>(selectedBranchFilter);
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest' | 'rating'>('featured');
  const [priceMax, setPriceMax] = useState<number>(25000);

  // Active Detail Modal Product
  const [detailProduct, setDetailProduct] = useState<StoreProductExtended | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('b-piazza');
  const [quantity, setQuantity] = useState(1);

  // Reviews and Q&A state for active product modal
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(SAMPLE_REVIEWS);
  const [questionsList, setQuestionsList] = useState<ProductQuestion[]>(SAMPLE_QUESTIONS);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Categories list
  const categories = ['All', 'Begena', 'Krar', 'Strings', 'Masenqo', 'Accessories', 'Learning Materials'];

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return SAMPLE_STORE_PRODUCTS.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Branch filter
      if (selectedBranch !== 'All') {
        const hasStockInBranch = p.branchStock.some(
          (b) => (b.branchName.toLowerCase().includes(selectedBranch.toLowerCase()) || b.branchId === selectedBranch) && b.quantity > 0
        );
        if (!hasStockInBranch) return false;
      }

      // Condition filter
      if (selectedCondition !== 'All' && p.condition !== selectedCondition) return false;

      // Price filter
      if (p.priceETB > priceMax) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.priceETB - b.priceETB;
      if (sortBy === 'price-high') return b.priceETB - a.priceETB;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedBranch, selectedCondition, sortBy, priceMax]);

  const handleOpenDetail = (p: StoreProductExtended) => {
    setDetailProduct(p);
    setSelectedImageIndex(0);
    setSelectedVariantId(p.variants?.[0]?.id || '');
    setSelectedBranchId(p.branchStock.find((b) => b.quantity > 0)?.branchId || 'b-piazza');
    setQuantity(1);
  };

  const handleAddReview = () => {
    if (!newReviewComment.trim() || !detailProduct) return;
    const r: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: detailProduct.id,
      userName: currentUser?.fullName || 'Music Enthusiast',
      userRole: currentUser?.role === 'student' ? 'Student' : 'Customer',
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().substring(0, 10),
      isVerifiedPurchase: true,
      status: 'Approved'
    };
    setReviewsList([r, ...reviewsList]);
    setNewReviewComment('');
    addNotification('Review Submitted', 'Thank you for reviewing this product!', 'system');
  };

  const handleAskQuestion = () => {
    if (!newQuestionText.trim() || !detailProduct) return;
    const q: ProductQuestion = {
      id: `q-${Date.now()}`,
      productId: detailProduct.id,
      askedBy: currentUser?.fullName || 'Customer',
      question: newQuestionText,
      date: new Date().toISOString().substring(0, 10)
    };
    setQuestionsList([q, ...questionsList]);
    setNewQuestionText('');
    addNotification('Question Submitted', 'Our instrument master will respond shortly.', 'system');
  };

  const isWishlisted = (productId: string) => wishlistItems.some((w) => w.productId === productId);

  // Student course recommendations
  const studentCourse = currentUser?.enrolledCourse || `${currentUser?.enrolledInstrument || 'Begena'} Course`;
  const recommendedForStudent = SAMPLE_STORE_PRODUCTS.filter(
    (p) => currentUser?.enrolledInstrument && p.recommendedForCourses?.some((c) => c.includes(currentUser.enrolledInstrument!))
  );

  return (
    <div className="space-y-8 pb-20">
      {/* STORE HERO BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <ShoppingBag size={14} />
            <span>Abel Begena Official Instrument & Supply Store</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-wide uppercase leading-tight">
            TRADITIONAL SACRED INSTRUMENTS, GUT STRINGS & ACADEMY SUPPLIES
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Direct from our master Ethiopian workshops in Addis Ababa. Authentic 10-string Begena harps, 6-string Krars, ox-gut string sets, padded gig bags, and official academy textbooks. Every purchase supports sacred musical heritage.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-amber-200">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Certified Master Quality</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-amber-200">
              <Building2 size={14} className="text-amber-400" />
              <span>Pickup at Piazza, Megenagna & Lebu</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-amber-200">
              <Truck size={14} className="text-amber-400" />
              <span>Doorstep Delivery Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* STUDENT COURSE RECOMMENDATION BANNER */}
      {currentUser?.role === 'student' && recommendedForStudent.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-500/30 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <Sparkles size={16} className="text-[#E89B52]" />
              <span>Curated for Your Course: <b>{studentCourse}</b></span>
            </div>
            <span className="text-[10px] font-mono font-black text-[#E89B52] uppercase bg-[#E89B52]/10 px-2.5 py-0.5 rounded-full">
              Student Discount Eligible
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendedForStudent.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-3 bg-white border border-[#E7DED1] rounded-2xl flex items-center gap-3 shadow-2xs">
                <img src={rec.images[0]} alt={rec.name} className="w-14 h-14 object-cover rounded-xl bg-amber-50" />
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#2B2B2B] truncate">{rec.name}</h4>
                  <p className="text-xs font-black text-[#E89B52]">{rec.priceETB.toLocaleString()} ETB</p>
                  <button
                    onClick={() => handleOpenDetail(rec)}
                    className="text-[10px] text-amber-900 font-bold hover:underline flex items-center gap-0.5"
                  >
                    View Product <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white border border-[#E7DED1] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search instruments, gut strings, bags, books, SKUs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* SORTING SELECT */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-600 shrink-0">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
            >
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2B2B2B] text-white shadow-xs'
                  : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#E7DED1]'
              }`}
            >
              {cat === 'All' ? '✨ All Products' : cat}
            </button>
          ))}
        </div>

        {/* SECONDARY FILTER CHIPS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E7DED1]/60 text-xs text-gray-600">
          <div className="flex flex-wrap items-center gap-3">
            {/* BRANCH FILTER */}
            <div className="flex items-center gap-1.5">
              <Building2 size={14} className="text-[#E89B52]" />
              <span className="font-bold">Branch:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent font-medium border-none text-[#2B2B2B] focus:ring-0 text-xs p-0 cursor-pointer"
              >
                <option value="All">All Campuses & Warehouse</option>
                <option value="Piazza">Piazza Campus</option>
                <option value="Megenagna">Megenagna Campus</option>
                <option value="Lebu">Lebu Campus</option>
              </select>
            </div>

            {/* CONDITION FILTER */}
            <div className="flex items-center gap-1.5">
              <Tag size={14} className="text-[#E89B52]" />
              <span className="font-bold">Condition:</span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="bg-transparent font-medium border-none text-[#2B2B2B] focus:ring-0 text-xs p-0 cursor-pointer"
              >
                <option value="All">Any Condition</option>
                <option value="New">Brand New</option>
                <option value="Custom Made">Custom Made</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Pre-Owned">Pre-Owned</option>
              </select>
            </div>
          </div>

          <div className="text-gray-500 font-medium">
            Showing <b>{filteredProducts.length}</b> products
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-[#E89B52] flex items-center justify-center mx-auto">
            <ShoppingBag size={24} />
          </div>
          <h3 className="font-display font-black text-lg text-[#2B2B2B]">NO PRODUCTS MATCH YOUR FILTERS</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query, price limit, or campus availability selection.
          </p>
          <Button variant="secondary" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedBranch('All'); setSelectedCondition('All'); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const wish = isWishlisted(p.id);
            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-[#E7DED1] rounded-3xl overflow-hidden flex flex-col shadow-xs hover:shadow-md transition"
              >
                {/* IMAGE AREA */}
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden group">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {p.isFeatured && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E89B52] text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                        ★ Featured
                      </span>
                    )}
                    {p.isNewArrival && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                        New Arrival
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold uppercase backdrop-blur-xs">
                      {p.condition}
                    </span>
                  </div>

                  {/* WISHLIST BUTTON */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(p); }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                      wish ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <Heart size={16} className={wish ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* DETAILS AREA */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                      <span className="uppercase text-[#E89B52] font-bold">{p.category}</span>
                      <span>SKU: {p.sku}</span>
                    </div>

                    <h3 className="font-display font-black text-base text-[#2B2B2B] leading-tight line-clamp-2">
                      {p.name}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* RATING */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-500">
                      <Star size={14} className="fill-current" />
                      <span className="font-black text-[#2B2B2B]">{p.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-[10px]">({p.reviewCount} reviews)</span>
                    </div>

                    {/* BRANCH STOCK BADGES */}
                    <div className="pt-2 flex flex-wrap gap-1.5 text-[10px]">
                      {p.branchStock.map((b) => (
                        <span
                          key={b.branchId}
                          className={`px-2 py-0.5 rounded-md font-mono font-bold ${
                            b.quantity > 0
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                              : 'bg-stone-100 text-stone-400 border border-stone-200 line-through'
                          }`}
                        >
                          {b.branchName.replace(' Branch', '')}: {b.quantity > 0 ? `${b.quantity} in stock` : 'Out'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* PRICE & ACTION */}
                  <div className="pt-3 border-t border-[#E7DED1] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-mono block">Price</span>
                      <span className="font-display font-black text-lg text-[#2B2B2B]">
                        {p.priceETB.toLocaleString()} <span className="text-xs font-bold text-[#E89B52]">ETB</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDetail(p)}
                        className="p-2.5 rounded-xl bg-[#FAF6EF] hover:bg-[#E7DED1] text-[#2B2B2B] transition cursor-pointer"
                        title="View Full Specifications"
                      >
                        <Eye size={16} />
                      </button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAddToCart(p, 1)}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <ShoppingBag size={14} />
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      <AnimatePresence>
        {detailProduct && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E7DED1] rounded-3xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl relative"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setDetailProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* GALLERY COLUMN */}
                <div className="p-6 bg-[#FAF6EF] flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-r border-[#E7DED1]">
                  <div className="space-y-3">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[#E7DED1] relative">
                      <img
                        src={detailProduct.images[selectedImageIndex] || detailProduct.images[0]}
                        alt={detailProduct.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 text-white text-[10px] font-mono rounded-full">
                        {detailProduct.condition} Condition
                      </span>
                    </div>

                    {/* THUMBNAILS */}
                    {detailProduct.images.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {detailProduct.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                              selectedImageIndex === idx ? 'border-[#E89B52]' : 'border-transparent opacity-60'
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* GUARANTEE NOTE */}
                  <div className="p-3 bg-white rounded-xl border border-[#E7DED1] text-[11px] text-gray-600 space-y-1">
                    <div className="font-bold text-[#2B2B2B] flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Certified Abel Begena Guarantee</span>
                    </div>
                    <p className="text-gray-500">
                      Hand-inspected at our Piazza master workshop before release.
                    </p>
                  </div>
                </div>

                {/* DETAILS COLUMN */}
                <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                      <span className="text-[#E89B52] font-bold uppercase">{detailProduct.category}</span>
                      <span>SKU: {detailProduct.sku}</span>
                    </div>

                    <h2 className="font-display font-black text-xl sm:text-2xl text-[#2B2B2B] leading-tight">
                      {detailProduct.name}
                    </h2>

                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.floor(detailProduct.rating) ? 'fill-current' : 'text-stone-300'} />
                        ))}
                      </div>
                      <span className="font-black text-[#2B2B2B]">{detailProduct.rating.toFixed(1)}</span>
                      <span className="text-gray-400 font-mono">({detailProduct.reviewCount} customer reviews)</span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed pt-1">
                      {detailProduct.description}
                    </p>
                  </div>

                  {/* VARIANTS SELECTOR */}
                  {detailProduct.variants && detailProduct.variants.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 block">Select Variant / Size:</label>
                      <div className="grid grid-cols-1 gap-2">
                        {detailProduct.variants.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariantId(v.id)}
                            className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between cursor-pointer ${
                              selectedVariantId === v.id
                                ? 'bg-amber-500/10 border-[#E89B52] text-[#2B2B2B] font-bold'
                                : 'bg-[#FAF6EF] border-[#E7DED1] text-gray-700 hover:bg-[#E7DED1]'
                            }`}
                          >
                            <span>{v.variantName}</span>
                            <span className="font-black">{v.priceETB.toLocaleString()} ETB</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BRANCH STOCK SELECTION */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block">Select Pickup / Fulfilling Campus:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {detailProduct.branchStock.map((b) => (
                        <button
                          key={b.branchId}
                          disabled={b.quantity === 0}
                          onClick={() => setSelectedBranchId(b.branchId)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition flex flex-col cursor-pointer ${
                            b.quantity === 0
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                              : selectedBranchId === b.branchId
                              ? 'bg-[#2B2B2B] text-white border-[#2B2B2B]'
                              : 'bg-[#FAF6EF] border-[#E7DED1] text-gray-800 hover:bg-[#E7DED1]'
                          }`}
                        >
                          <span className="font-bold">{b.branchName}</span>
                          <span className="text-[10px] font-mono opacity-80">
                            {b.quantity > 0 ? `${b.quantity} items available` : 'Out of Stock'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SPECIFICATIONS TABLE */}
                  <div className="space-y-2 pt-2 border-t border-[#E7DED1]">
                    <h4 className="font-bold text-xs text-[#2B2B2B] uppercase tracking-wider">Product Specifications</h4>
                    <div className="bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl p-3 space-y-1.5 text-xs text-gray-700">
                      {Object.entries(detailProduct.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between border-b border-[#E7DED1]/60 last:border-0 pb-1 last:pb-0">
                          <span className="text-gray-500">{key}:</span>
                          <span className="font-medium text-[#2B2B2B]">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QUANTITY & ADD TO CART */}
                  <div className="space-y-3 pt-3 border-t border-[#E7DED1]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600">Quantity:</span>
                        <div className="flex items-center border border-[#E7DED1] rounded-xl bg-[#FAF6EF] overflow-hidden">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 hover:bg-[#E7DED1] text-gray-700 transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 font-mono font-bold text-xs text-[#2B2B2B]">{quantity}</span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-2 hover:bg-[#E7DED1] text-gray-700 transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block font-mono">Total Price</span>
                        <span className="font-display font-black text-xl text-[#2B2B2B]">
                          {(detailProduct.priceETB * quantity).toLocaleString()}{' '}
                          <span className="text-xs text-[#E89B52]">ETB</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => {
                          onAddToCart(detailProduct, quantity, selectedVariantId, selectedBranchId);
                          setDetailProduct(null);
                        }}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        <span>Add to Cart</span>
                      </Button>

                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          onAddToCart(detailProduct, quantity, selectedVariantId, selectedBranchId);
                          setDetailProduct(null);
                          onNavigate('store-checkout');
                        }}
                        className="flex-1"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>

                  {/* REVIEWS & Q&A SECTION */}
                  <div className="space-y-4 pt-4 border-t border-[#E7DED1]">
                    <h4 className="font-bold text-xs text-[#2B2B2B] uppercase tracking-wider">Customer Reviews & Questions</h4>

                    {/* SUBMIT REVIEW FORM */}
                    <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1] space-y-3">
                      <span className="text-xs font-bold text-[#2B2B2B]">Write a Verified Review</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Rating:</span>
                        <div className="flex text-amber-500 cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= newReviewRating ? 'fill-current' : 'text-stone-300'}
                              onClick={() => setNewReviewRating(star)}
                            />
                          ))}
                        </div>
                      </div>
                      <Input
                        type="text"
                        placeholder="Share your experience with this instrument or string set..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="text-xs bg-white"
                      />
                      <Button variant="primary" size="sm" onClick={handleAddReview}>
                        Submit Review
                      </Button>
                    </div>

                    {/* REVIEWS LIST */}
                    <div className="space-y-2">
                      {reviewsList.filter((r) => r.productId === detailProduct.id).map((r) => (
                        <div key={r.id} className="p-3 bg-white border border-[#E7DED1] rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#2B2B2B]">{r.userName} ({r.userRole})</span>
                            <span className="text-[10px] text-gray-400 font-mono">{r.date}</span>
                          </div>
                          <p className="text-gray-600">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

