import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { WishlistItem, Language, StoreProductExtended } from '../../types';
import { Button } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import { SAMPLE_STORE_PRODUCTS } from './StoreData';

interface StoreWishlistViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  wishlistItems: WishlistItem[];
  onToggleWishlist: (product: StoreProductExtended) => void;
  onAddToCart: (product: StoreProductExtended, quantity: number) => void;
}

export function StoreWishlistView({
  lang,
  onNavigate,
  wishlistItems,
  onToggleWishlist,
  onAddToCart
}: StoreWishlistViewProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Heart size={14} className="fill-current text-[#E89B52]" />
            <span>Saved Wishlist</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            MY SAVED INSTRUMENTS & ACCESSORIES
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Keep track of instruments, strings, and books you wish to acquire for your music practice.
          </p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Heart size={32} />
          </div>
          <h2 className="font-display font-black text-xl text-[#2B2B2B]">YOUR WISHLIST IS EMPTY</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore our store catalog and click the heart icon on instruments or string sets to save them here.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate('store')}>
            Explore Store Catalog
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="divide-y divide-[#E7DED1]">
            {wishlistItems.map((item) => {
              const fullProduct = SAMPLE_STORE_PRODUCTS.find((p) => p.id === item.productId);
              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.productImage} alt="" className="w-16 h-16 object-cover rounded-2xl bg-stone-100" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#E89B52] uppercase font-bold">{item.category}</span>
                      <h4 className="font-bold text-sm text-[#2B2B2B]">{item.productName}</h4>
                      <span className="font-display font-black text-sm text-[#2B2B2B]">
                        {item.priceETB.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {fullProduct && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAddToCart(fullProduct, 1)}
                        className="flex items-center gap-1.5"
                      >
                        <ShoppingBag size={14} />
                        <span>Move to Cart</span>
                      </Button>
                    )}

                    {fullProduct && (
                      <button
                        onClick={() => onToggleWishlist(fullProduct)}
                        className="p-2 text-gray-400 hover:text-red-600 transition cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

