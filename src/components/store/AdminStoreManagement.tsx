import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Archive,
  TrendingUp,
  DollarSign,
  Package,
  Building2,
  Tag,
  Gift,
  Users,
  RotateCcw,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  StoreProductExtended,
  StoreOrder,
  StoreReturnRequest,
  StoreCoupon,
  StoreBundle,
  SupplierRecord,
  Language
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import {
  SAMPLE_STORE_PRODUCTS,
  SAMPLE_STORE_ORDERS,
  SAMPLE_COUPONS,
  SAMPLE_BUNDLES,
  SAMPLE_SUPPLIERS,
  SAMPLE_RETURNS
} from './StoreData';

const STORE_IMAGE_DEFAULT = new URL('../../assets/images/store (1).jpg', import.meta.url).href;

interface AdminStoreManagementProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function AdminStoreManagement({ lang, onNavigate }: AdminStoreManagementProps) {
  const { addNotification } = useAuth();

  const [activeTab, setActiveTab] = useState<'products' | 'coupons' | 'bundles' | 'suppliers' | 'returns' | 'analytics'>('products');

  // State
  const [productsList, setProductsList] = useState<StoreProductExtended[]>(SAMPLE_STORE_PRODUCTS);
  const [couponsList, setCouponsList] = useState<StoreCoupon[]>(SAMPLE_COUPONS);
  const [bundlesList, setBundlesList] = useState<StoreBundle[]>(SAMPLE_BUNDLES);
  const [suppliersList, setSuppliersList] = useState<SupplierRecord[]>(SAMPLE_SUPPLIERS);
  const [returnsList, setReturnsList] = useState<StoreReturnRequest[]>(SAMPLE_RETURNS);

  // New Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Begena' | 'Krar' | 'Strings' | 'Accessories' | 'Learning Materials'>('Begena');
  const [newProductPrice, setNewProductPrice] = useState(1500);
  const [newProductSKU, setNewProductSKU] = useState('AB-NEW-01');
  const [newProductStock, setNewProductStock] = useState(10);
  const [newProductDesc, setNewProductDesc] = useState('');

  // New Coupon Modal
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(10);

  const handleCreateProduct = () => {
    if (!newProductName.trim()) return;
    const p: StoreProductExtended = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      category: newProductCategory,
      description: newProductDesc || 'Authentic traditional Ethiopian instrument item.',
      priceETB: Number(newProductPrice),
      costETB: Number(newProductPrice) * 0.6,
      sku: newProductSKU,
      condition: 'New',
      stockQuantity: Number(newProductStock),
      branchStock: [
        { branchId: 'b-piazza', branchName: 'Piazza Branch', quantity: Math.floor(newProductStock / 2) },
        { branchId: 'b-megenagna', branchName: 'Megenagna Branch', quantity: Math.ceil(newProductStock / 2) }
      ],
      images: [STORE_IMAGE_DEFAULT],
      specifications: { Material: 'Traditional Aged Hardwood', Origin: 'Addis Ababa' },
      status: 'Active',
      rating: 5.0,
      reviewCount: 1
    };
    setProductsList([p, ...productsList]);
    setShowAddProductModal(false);
    addNotification('Product Added', `Product "${newProductName}" added to store catalog!`, 'system');
  };

  const handleCreateCoupon = () => {
    if (!newCouponCode.trim()) return;
    const c: StoreCoupon = {
      id: `c-${Date.now()}`,
      code: newCouponCode.toUpperCase(),
      discountType: 'Percentage',
      discountValue: Number(newCouponValue),
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      usageLimit: 50,
      timesUsed: 0,
      status: 'Active'
    };
    setCouponsList([c, ...couponsList]);
    setShowAddCouponModal(false);
    addNotification('Coupon Created', `Promo code ${newCouponCode.toUpperCase()} activated!`, 'system');
  };

  // Analytics Metrics
  const totalRevenue = SAMPLE_STORE_ORDERS.reduce((acc, o) => acc + o.totalETB, 0);
  const totalOrdersCount = SAMPLE_STORE_ORDERS.length;
  const inventoryValue = productsList.reduce((acc, p) => acc + p.priceETB * p.stockQuantity, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-[#FFFFFF] p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <ShoppingBag size={14} />
            <span>Admin & Founder Commercial Control Center</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#FFFFFF] tracking-wide uppercase">
            ONLINE STORE & INVENTORY MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Catalog controls, stock level adjustments, coupon vouchers, supplier purchase orders, return inspections, and commercial sales analytics.
          </p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-2xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Total Store Sales</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">{totalRevenue.toLocaleString()} ETB</span>
        </div>
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-2xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Total Orders</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">{totalOrdersCount} Orders</span>
        </div>
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-2xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Inventory Valuation</span>
          <span className="font-display font-black text-2xl text-emerald-700">{inventoryValue.toLocaleString()} ETB</span>
        </div>
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-2xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Active Products</span>
          <span className="font-display font-black text-2xl text-[#E89B52]">{productsList.length} SKUs</span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E7DED1]">
        {[
          { id: 'products', label: 'Products & Stock', icon: Package },
          { id: 'coupons', label: 'Coupons & Vouchers', icon: Tag },
          { id: 'bundles', label: 'Bundles', icon: Gift },
          { id: 'suppliers', label: 'Suppliers & POs', icon: Users },
          { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw },
          { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#2B2B2B] text-white shadow-xs'
                  : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#E7DED1]'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCTS & INVENTORY */}
      {activeTab === 'products' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-[#E7DED1]">
            <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">PRODUCT CATALOG MANAGEMENT</h3>
            <Button variant="primary" size="sm" onClick={() => setShowAddProductModal(true)} className="flex items-center gap-1.5">
              <Plus size={14} /> Add New Product
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#E7DED1] rounded-2xl overflow-hidden">
              <thead className="bg-[#FAF6EF] text-[#2B2B2B] font-bold uppercase border-b border-[#E7DED1]">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Total Stock</th>
                  <th className="p-3">Campus Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DED1]">
                {productsList.map((p) => (
                  <tr key={p.id} className="hover:bg-amber-50/50">
                    <td className="p-3 font-bold text-[#2B2B2B]">
                      <div className="flex items-center gap-2">
                        <img src={p.images[0]} alt="" className="w-8 h-8 object-cover rounded-lg" />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 uppercase font-bold text-[#E89B52]">{p.category}</td>
                    <td className="p-3 font-mono">{p.sku}</td>
                    <td className="p-3 font-mono font-bold">{p.priceETB.toLocaleString()} ETB</td>
                    <td className="p-3 font-mono">{p.stockQuantity}</td>
                    <td className="p-3 font-mono text-[10px]">
                      {p.branchStock.map((b) => `${b.branchName.replace(' Branch', '')}:${b.quantity}`).join(' | ')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-gray-500 hover:text-[#2B2B2B] p-1">
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COUPONS & VOUCHERS */}
      {activeTab === 'coupons' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-[#E7DED1]">
            <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">DISCOUNT COUPONS & PROMO CODES</h3>
            <Button variant="primary" size="sm" onClick={() => setShowAddCouponModal(true)}>
              <Plus size={14} /> Create New Coupon
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {couponsList.map((c) => (
              <div key={c.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-sm text-[#E89B52] uppercase">{c.code}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    {c.status}
                  </span>
                </div>
                <p className="font-bold text-[#2B2B2B]">
                  Discount: {c.discountValue}{c.discountType === 'Percentage' ? '%' : ' ETB'} OFF
                </p>
                <div className="text-[10px] text-gray-500 font-mono">
                  Used: {c.timesUsed} / {c.usageLimit} times
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUNDLES */}
      {activeTab === 'bundles' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">PROMOTIONAL STARTER BUNDLES</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bundlesList.map((b) => (
              <div key={b.id} className="p-5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-sm text-[#2B2B2B]">{b.title}</h4>
                <p className="text-gray-600">{b.description}</p>
                <div className="p-3 bg-white rounded-xl border space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Individual Total:</span>
                    <span className="line-through">{b.individualTotalETB.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-[#2B2B2B]">
                    <span>Bundle Discounted Price:</span>
                    <span className="text-[#E89B52]">{b.bundlePriceETB.toLocaleString()} ETB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">REGISTERED INSTRUMENT SUPPLIERS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suppliersList.map((s) => (
              <div key={s.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1 text-xs">
                <h4 className="font-bold text-sm text-[#2B2B2B]">{s.supplierName}</h4>
                <p className="text-gray-600">Contact: <b>{s.contactPerson}</b> ({s.phone})</p>
                <p className="text-gray-500">Address: {s.address}</p>
                <div className="pt-2 flex gap-1">
                  {s.suppliedCategories.map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] rounded-md font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RETURNS & REFUNDS */}
      {activeTab === 'returns' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">CUSTOMER RETURNS & REFUND REQUESTS</h3>
          <div className="space-y-3">
            {returnsList.map((r) => (
              <div key={r.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl text-xs space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Order {r.orderNumber} • Customer: {r.customerName} ({r.customerPhone})</span>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">{r.status}</span>
                </div>
                <p><b>Product:</b> {r.productName}</p>
                <p className="text-gray-600"><b>Reason:</b> {r.reason} — {r.description}</p>
                <div className="pt-2 flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => addNotification('Return Approved', 'Return inspect approved!', 'system')}>
                    Approve Return & Restock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SALES ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-6 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">COMMERCIAL SALES & FOUNDER OVERVIEW</h3>

          <div className="p-5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-[#2B2B2B]">Best Performing Campus for Store Sales:</h4>
            <div className="space-y-2 font-mono">
              <div className="flex justify-between bg-white p-2.5 rounded-xl border">
                <span>1. Piazza Campus Workshop</span>
                <span className="font-bold text-emerald-700">185,000 ETB (62%)</span>
              </div>
              <div className="flex justify-between bg-white p-2.5 rounded-xl border">
                <span>2. Megenagna Campus Store</span>
                <span className="font-bold text-emerald-700">75,000 ETB (25%)</span>
              </div>
              <div className="flex justify-between bg-white p-2.5 rounded-xl border">
                <span>3. Lebu Campus Store</span>
                <span className="font-bold text-emerald-700">38,000 ETB (13%)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#E7DED1] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">ADD NEW PRODUCT</h3>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Product Title</label>
                <Input type="text" placeholder="e.g. Master Begena Gut String" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
                >
                  <option value="Begena">Begena</option>
                  <option value="Krar">Krar</option>
                  <option value="Strings">Strings</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Learning Materials">Learning Materials</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Price (ETB)</label>
                  <Input type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(Number(e.target.value))} className="text-xs" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Total Stock</label>
                  <Input type="number" value={newProductStock} onChange={(e) => setNewProductStock(Number(e.target.value))} className="text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowAddProductModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleCreateProduct}>Create Product</Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD COUPON MODAL */}
      <AnimatePresence>
        {showAddCouponModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#E7DED1] rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
              <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">CREATE PROMO CODE</h3>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Coupon Code</label>
                <Input type="text" placeholder="e.g. SACRED15" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} className="text-xs uppercase font-mono" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Discount %</label>
                <Input type="number" value={newCouponValue} onChange={(e) => setNewCouponValue(Number(e.target.value))} className="text-xs" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowAddCouponModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleCreateCoupon}>Save Coupon</Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

