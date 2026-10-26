import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  ArrowRightLeft,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Plus,
  QrCode,
  Search,
  DollarSign,
  ShieldCheck,
  Building2,
  Clock,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, InventoryItem, InstrumentBorrowRecord, StoreProduct } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';

const STORE_IMAGE_1 = new URL('../../assets/images/store (1).jpg', import.meta.url).href;
const STORE_IMAGE_2 = new URL('../../assets/images/store (2).jpg', import.meta.url).href;
const STORE_IMAGE_3 = new URL('../../assets/images/store (3).jpg', import.meta.url).href;

const SAMPLE_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-101',
    name: 'Traditional Begena (10-String Box)',
    category: 'Instruments',
    instrumentType: 'Begena',
    serialNumber: 'AB-BEG-2026-001',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    condition: 'Excellent',
    quantity: 12,
    minThreshold: 3,
    unitPriceETB: 18500,
    availability: 'In Stock'
  },
  {
    id: 'inv-102',
    name: 'Gut String Set for 10-String Begena',
    category: 'Strings',
    instrumentType: 'Begena',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    condition: 'Excellent',
    quantity: 2,
    minThreshold: 5,
    unitPriceETB: 450,
    availability: 'In Stock'
  },
  {
    id: 'inv-103',
    name: 'Traditional Krar (6-String Nylon)',
    category: 'Instruments',
    instrumentType: 'Krar',
    serialNumber: 'AB-KRR-2026-014',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    condition: 'Needs Maintenance',
    quantity: 8,
    minThreshold: 2,
    unitPriceETB: 6200,
    availability: 'Under Repair'
  }
];

const SAMPLE_STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod-1',
    name: 'Master Craftsman Begena Gut String Set (10 Strings)',
    category: 'Strings',
    instrumentType: 'Begena',
    description: 'Authentic traditional ox-gut strings prepared by master craftsmen for optimal sacred resonance.',
    priceETB: 450,
    stockQuantity: 25,
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    imageUrl: STORE_IMAGE_2,
    status: 'In Stock'
  },
  {
    id: 'prod-2',
    name: 'Handcrafted 10-String Sacred Begena Instrument',
    category: 'Instruments',
    instrumentType: 'Begena',
    description: 'Carved from seasoned Wanza wood with traditional leather soundboard membrane.',
    priceETB: 18500,
    stockQuantity: 4,
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    imageUrl: STORE_IMAGE_1,
    status: 'Low Stock'
  },
  {
    id: 'prod-3',
    name: 'Acoustic Krar Nylon String Set (6 Strings)',
    category: 'Strings',
    instrumentType: 'Krar',
    description: 'High-tension nylon string set designed for clear, articulate Krar melodies.',
    priceETB: 280,
    stockQuantity: 40,
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    imageUrl: STORE_IMAGE_3,
    status: 'In Stock'
  }
];

interface InventoryAndStoreCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  activeMode?: 'inventory' | 'store';
}

export function InventoryAndStoreCenter({ lang, onNavigate, activeMode = 'inventory' }: InventoryAndStoreCenterProps) {
  const [mode, setMode] = useState<'inventory' | 'store'>(activeMode);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(SAMPLE_STORE_PRODUCTS);

  // Cart / Order State for Store
  const [cart, setCart] = useState<{ product: StoreProduct; quantity: number }[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CBE' | 'Telebirr' | 'Cash'>('Telebirr');

  // New Borrowing Checkout
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowerName, setBorrowerName] = useState('Dawit Hailu');
  const [borrowedItem, setBorrowedItem] = useState('Traditional Begena (10-String Box)');

  const handleAddToCart = (p: StoreProduct) => {
    if (!p) return;
    const existing = cart.find((c) => c.product?.id === p.id);
    if (existing) {
      setCart(cart.map((c) => (c.product?.id === p.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { product: p, quantity: 1 }]);
    }
  };

  const totalCartAmount = cart.reduce((acc, c) => acc + (c.product?.priceETB || 0) * c.quantity, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <Package size={14} />
              <span>School Inventory Control & Traditional Store</span>
            </div>

            {/* SWITCH MODE BUTTONS */}
            <div className="flex bg-white/10 p-1 rounded-xl border border-white/20">
              <button
                onClick={() => setMode('inventory')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'inventory' ? 'bg-[#E89B52] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                📦 Campus Inventory
              </button>
              <button
                onClick={() => setMode('store')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'store' ? 'bg-[#E89B52] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                🛒 School Strings Store
              </button>
            </div>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            {mode === 'inventory' ? 'SCHOOL INVENTORY & INSTRUMENT ASSET CONTROL' : 'LIORA BEGENA OFFICIAL STORE'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            {mode === 'inventory'
              ? 'Track physical instruments, serial numbers, string stock thresholds, checkout logs, and inter-branch inventory transfers.'
              : 'Purchase traditional gut string sets, handcrafted Begena & Krar instruments, and practice accessories with CBE & Telebirr integration.'}
          </p>
        </div>
      </div>

      {mode === 'inventory' ? (
        /* CAMPUS INVENTORY TAB */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Asset Registry</span>
              <h2 className="font-display font-black text-2xl text-[#2B2B2B]">INSTRUMENTS & EQUIPMENT STOCK</h2>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 text-xs shadow-xs"
              onClick={() => setShowBorrowModal(true)}
            >
              <UserCheck size={14} />
              <span>Checkout Instrument to Student/Teacher</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inventoryList.map((item) => (
              <div key={item.id} className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase block">{item.branchName}</span>
                    <h3 className="font-display font-black text-base text-[#2B2B2B]">{item.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    item.quantity <= item.minThreshold ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'
                  }`}>
                    {item.quantity <= item.minThreshold ? 'Low Stock Alert' : item.availability}
                  </span>
                </div>

                <div className="p-4 bg-[#FAF6EF] rounded-2xl border border-[#E7DED1] space-y-2 text-xs text-gray-700">
                  <div>Category: <b>{item.category}</b></div>
                  {item.serialNumber && <div>Serial No: <span className="font-mono text-amber-800">{item.serialNumber}</span></div>}
                  <div>Quantity in Stock: <b>{item.quantity} Units</b> (Min: {item.minThreshold})</div>
                  <div>Condition: <b>{item.condition}</b></div>
                  <div>Unit Value: <b>{item.unitPriceETB.toLocaleString()} ETB</b></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SCHOOL STORE TAB */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Official Store</span>
              <h2 className="font-display font-black text-2xl text-[#2B2B2B]">AUTHENTIC STRINGS & INSTRUMENTS CATALOG</h2>
            </div>

            {cart.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 shadow-md"
                onClick={() => setShowCheckoutModal(true)}
              >
                <ShoppingBag size={14} />
                <span>View Cart ({cart.reduce((a, c) => a + c.quantity, 0)}) • {totalCartAmount.toLocaleString()} ETB</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storeProducts.map((p) => (
              <div key={p.id} className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover rounded-2xl border border-[#E7DED1]" />
                  <div>
                    <span className="text-[10px] font-bold text-[#E89B52] uppercase block">{p.category} • {p.branchName}</span>
                    <h3 className="font-display font-black text-base text-[#2B2B2B]">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-display font-black text-lg text-[#2B2B2B]">{p.priceETB.toLocaleString()} ETB</span>
                    <span className="text-[10px] font-bold text-gray-400">{p.stockQuantity} in stock</span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleAddToCart(p)}
                  >
                    + Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BORROW MODAL */}
      {showBorrowModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">CHECKOUT INSTRUMENT TO BORROWER</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Borrower Name (Student/Teacher)</label>
                <Input value={borrowerName} onChange={(e) => setBorrowerName(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Select Instrument</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={borrowedItem}
                  onChange={(e) => setBorrowedItem(e.target.value)}
                >
                  <option value="Traditional Begena (10-String Box)">Traditional Begena (Piazza Branch)</option>
                  <option value="Traditional Krar (6-String Nylon)">Traditional Krar (Lebu Branch)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Expected Return Date</label>
                <Input type="date" defaultValue="2026-08-05" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowBorrowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(`Instrument checkout recorded for ${borrowerName}!`);
                  setShowBorrowModal(false);
                }}
              >
                Log Borrow Checkout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL FOR STORE */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">STORE ORDER CHECKOUT</h3>

            <div className="space-y-2 text-xs border-b border-[#E7DED1] pb-3">
              {cart.map((c, idx) => (
                <div key={c.product?.id || idx} className="flex justify-between font-bold">
                  <span>{c.product?.name || 'Product'} (x{c.quantity})</span>
                  <span>{((c.product?.priceETB || 0) * c.quantity).toLocaleString()} ETB</span>
                </div>
              ))}
              <div className="flex justify-between font-display font-black text-sm text-[#2B2B2B] pt-2">
                <span>Total Payment:</span>
                <span>{totalCartAmount.toLocaleString()} ETB</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-gray-600">Payment Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Telebirr', 'CBE', 'Cash'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                      paymentMethod === method ? 'bg-[#E89B52] text-white border-[#E89B52]' : 'bg-[#FAF6EF] text-[#2B2B2B]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
              💳 Payment request will be verified by the branch accountant upon pickup or delivery.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowCheckoutModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('Store order placed successfully! Transaction receipt generated.');
                  setCart([]);
                  setShowCheckoutModal(false);
                }}
              >
                Confirm Purchase Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

