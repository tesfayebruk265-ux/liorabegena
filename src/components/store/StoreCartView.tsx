import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Building2,
  AlertCircle,
  Bookmark,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Language, StoreCoupon } from '../../types';
import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import { SAMPLE_COUPONS } from './StoreData';

interface StoreCartViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onToggleSaveForLater: (cartItemId: string) => void;
  appliedCoupon: StoreCoupon | null;
  onApplyCoupon: (coupon: StoreCoupon | null) => void;
}

export function StoreCartView({
  lang,
  onNavigate,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onToggleSaveForLater,
  appliedCoupon,
  onApplyCoupon
}: StoreCartViewProps) {
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code || '');
  const [couponError, setCouponError] = useState('');

  const activeItems = cartItems.filter((i) => !i.isSavedForLater);
  const savedItems = cartItems.filter((i) => i.isSavedForLater);

  const subtotal = activeItems.reduce((acc, item) => acc + item.priceETB * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'Percentage') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const estimatedTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponInput.trim()) {
      onApplyCoupon(null);
      return;
    }
    const found = SAMPLE_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.trim().toUpperCase() && c.status === 'Active'
    );
    if (found) {
      if (found.minOrderETB && subtotal < found.minOrderETB) {
        setCouponError(`Minimum order amount of ${found.minOrderETB} ETB required for coupon ${found.code}.`);
        return;
      }
      onApplyCoupon(found);
    } else {
      setCouponError('Invalid or expired coupon code. Try BEGENA10 or WELCOME500.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <ShoppingBag size={14} />
            <span>Shopping Cart</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            YOUR SELECTED INSTRUMENTS & SUPPLIES
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Review items, choose pickup campus, apply promotional vouchers, and proceed to checkout.
          </p>
        </div>
      </div>

      {activeItems.length === 0 && savedItems.length === 0 ? (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#E89B52] flex items-center justify-center mx-auto">
            <ShoppingBag size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-black text-xl text-[#2B2B2B]">YOUR CART IS CURRENTLY EMPTY</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Explore our traditional 10-string Begena harps, 6-string Krars, ox-gut string sets, and official academy textbooks.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => onNavigate('store')}>
            Browse Store Catalog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ITEMS LIST (2 COLS) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7DED1]">
                <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase tracking-wide">
                  CART ITEMS ({activeItems.reduce((a, b) => a + b.quantity, 0)})
                </h3>
                <button
                  onClick={() => onNavigate('store')}
                  className="text-xs font-bold text-[#E89B52] hover:underline"
                >
                  + Add More Products
                </button>
              </div>

              {activeItems.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No active items in cart.</p>
              ) : (
                <div className="divide-y divide-[#E7DED1]/60">
                  {activeItems.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* ITEM INFO */}
                      <div className="flex items-center gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-2xl bg-stone-100 border border-[#E7DED1] shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#E89B52]">
                            {item.category} • {item.condition}
                          </span>
                          <h4 className="font-bold text-sm text-[#2B2B2B] leading-tight">{item.productName}</h4>
                          {item.variantName && (
                            <p className="text-xs text-gray-500">Variant: {item.variantName}</p>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Building2 size={12} className="text-[#E89B52]" />
                              Pickup: <b>{item.selectedBranchName || 'Piazza Campus'}</b>
                            </span>
                            <span>• SKU: {item.sku}</span>
                          </div>
                        </div>
                      </div>

                      {/* CONTROLS & PRICE */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                        {/* QTY SPINNER */}
                        <div className="flex items-center border border-[#E7DED1] rounded-xl bg-[#FAF6EF] overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-[#E7DED1] text-gray-700 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 font-mono font-bold text-xs text-[#2B2B2B]">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-[#E7DED1] text-gray-700 transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* PRICE */}
                        <div className="text-right min-w-[90px]">
                          <span className="font-display font-black text-base text-[#2B2B2B]">
                            {(item.priceETB * item.quantity).toLocaleString()} ETB
                          </span>
                          <span className="text-[10px] text-gray-400 block">{item.priceETB.toLocaleString()} each</span>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleSaveForLater(item.id)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 transition cursor-pointer"
                            title="Save for Later"
                          >
                            <Bookmark size={16} />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SAVED FOR LATER SECTION */}
            {savedItems.length > 0 && (
              <div className="bg-[#FAF6EF] border border-[#E7DED1] rounded-3xl p-6 space-y-4">
                <h3 className="font-display font-black text-sm text-[#2B2B2B] uppercase tracking-wide flex items-center gap-2">
                  <Bookmark size={16} className="text-[#E89B52]" />
                  <span>SAVED FOR LATER ({savedItems.length})</span>
                </h3>

                <div className="divide-y divide-[#E7DED1]">
                  {savedItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded-xl bg-white" />
                        <div>
                          <h5 className="font-bold text-xs text-[#2B2B2B]">{item.productName}</h5>
                          <span className="text-xs font-black text-[#E89B52]">{item.priceETB.toLocaleString()} ETB</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => onToggleSaveForLater(item.id)} className="text-[11px]">
                          Move to Cart
                        </Button>
                        <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY (1 COL) */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-6 shadow-xs sticky top-24">
              <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase tracking-wide border-b border-[#E7DED1] pb-3">
                ORDER SUMMARY
              </h3>

              {/* COUPON INPUT */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Tag size={14} className="text-[#E89B52]" />
                  <span>Promo Code / Voucher</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. BEGENA10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="text-xs uppercase font-mono"
                  />
                  <Button variant="secondary" size="sm" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
                {couponError && <p className="text-[10px] text-red-600 font-bold">{couponError}</p>}
                {appliedCoupon && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between font-bold">
                    <span>Code {appliedCoupon.code} Applied</span>
                    <button onClick={() => { onApplyCoupon(null); setCouponInput(''); }} className="text-red-600 hover:underline text-[10px]">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* BREAKDOWN */}
              <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-[#E7DED1]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#2B2B2B]">{subtotal.toLocaleString()} ETB</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span>-{discountAmount.toLocaleString()} ETB</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Campus Pickup Fee:</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>

                <div className="pt-3 border-t border-[#E7DED1] flex justify-between items-baseline">
                  <span className="font-display font-black text-sm text-[#2B2B2B]">ESTIMATED TOTAL:</span>
                  <span className="font-display font-black text-2xl text-[#2B2B2B]">
                    {estimatedTotal.toLocaleString()} <span className="text-xs text-[#E89B52]">ETB</span>
                  </span>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <Button
                variant="primary"
                size="md"
                disabled={activeItems.length === 0}
                onClick={() => onNavigate('store-checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Button>

              <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl text-[11px] text-gray-500 space-y-1">
                <div className="font-bold text-[#2B2B2B] flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Secure Local Payment Guarantee</span>
                </div>
                <p>Accepts CBE, Telebirr & Cash on Pickup with official digital receipt verification.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

