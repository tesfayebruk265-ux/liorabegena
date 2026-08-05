import React, { useState } from 'react';
import {
  ShoppingBag,
  Building2,
  Truck,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  QrCode,
  Lock,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import { CartItem, Language, StoreOrder, StoreCoupon } from '../../types';
import { useAuth } from '../../context/AuthContext';

const STORE_RECEIPT_PLACEHOLDER = new URL('../../assets/images/store (5).jpg', import.meta.url).href;

import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';

interface StoreCheckoutViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  cartItems: CartItem[];
  appliedCoupon: StoreCoupon | null;
  onOrderCreated: (order: StoreOrder) => void;
}

export function StoreCheckoutView({
  lang,
  onNavigate,
  cartItems,
  appliedCoupon,
  onOrderCreated
}: StoreCheckoutViewProps) {
  const { currentUser, addNotification } = useAuth();

  // Active Checkout Step: 1. Info & Fulfillment -> 2. Payment & Receipt -> 3. Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Customer Form Data
  const [customerName, setCustomerName] = useState(currentUser?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+251 911 223 344');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'customer@begena.com');

  // Fulfillment Mode
  const [fulfillmentType, setFulfillmentType] = useState<'Branch Pickup' | 'Delivery'>('Branch Pickup');
  const [selectedPickupBranch, setSelectedPickupBranch] = useState<'Piazza' | 'Megenagna' | 'Lebu'>('Piazza');

  // Delivery Address
  const [deliveryCity, setDeliveryCity] = useState('Addis Ababa');
  const [deliverySubCity, setDeliverySubCity] = useState('Bole');
  const [deliveryWoreda, setDeliveryWoreda] = useState('Woreda 03');
  const [deliveryKebele, setDeliveryKebele] = useState('Kebele 05');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'CBE Bank Transfer' | 'Telebirr' | 'Awash Birr' | 'Cash on Pickup'>('CBE Bank Transfer');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [txRef, setTxRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Created Order reference for step 3
  const [createdOrder, setCreatedOrder] = useState<StoreOrder | null>(null);

  const activeItems = cartItems.filter((i) => !i.isSavedForLater);
  const subtotal = activeItems.reduce((acc, item) => acc + item.priceETB * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = appliedCoupon.discountType === 'Percentage' ? (subtotal * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue;
  }

  const deliveryFee = fulfillmentType === 'Delivery' ? 250 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handlePlaceOrder = () => {
    if (!customerName || !customerPhone) {
      alert('Please fill in your full name and phone number.');
      return;
    }

    if (paymentMethod !== 'Cash on Pickup' && !receiptFile) {
      alert('Please upload your payment receipt or transfer screenshot.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNum = `ABS-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: StoreOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        userId: currentUser?.id,
        customerName,
        customerPhone,
        customerEmail,
        customerRole: currentUser?.role || 'Guest Customer',
        fulfillmentType,
        pickupBranchId: fulfillmentType === 'Branch Pickup' ? `b-${selectedPickupBranch.toLowerCase()}` : undefined,
        pickupBranchName: fulfillmentType === 'Branch Pickup' ? `${selectedPickupBranch} Campus` : undefined,
        pickupAddress:
          selectedPickupBranch === 'Piazza'
            ? 'Piazza Campus, Church Street, Addis Ababa'
            : selectedPickupBranch === 'Megenagna'
            ? 'Megenagna Campus, Lem Hotel Area, Addis Ababa'
            : 'Lebu Campus, Varnero Junction, Addis Ababa',
        expectedPickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        deliveryAddress:
          fulfillmentType === 'Delivery'
            ? {
                city: deliveryCity,
                subCity: deliverySubCity,
                woreda: deliveryWoreda,
                kebele: deliveryKebele,
                phone: customerPhone,
                deliveryNotes
              }
            : undefined,
        deliveryFeeETB: deliveryFee,
        items: [...activeItems],
        subtotalETB: subtotal,
        discountETB: discountAmount,
        taxETB: 0,
        totalETB: totalAmount,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Pickup' ? 'Pending Payment' : 'Payment Verification',
        orderStatus: paymentMethod === 'Cash on Pickup' ? 'Pending Payment' : 'Payment Verification',
        receiptUrl: receiptFile || undefined,
        transactionReference: txRef || undefined,
        qrCodeData: `${orderNum}-VERIFIED`,
        orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        timeline: [
          {
            status: 'Order Placed',
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            note: `Order placed via ${paymentMethod}`
          }
        ]
      };

      onOrderCreated(newOrder);
      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setStep(3);

      addNotification(
        'Store Order Submitted!',
        `Order ${orderNum} has been created. Stock reserved. Track progress in your orders portal.`,
        'payment'
      );
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Lock size={14} />
            <span>Secure Order Checkout</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            ABEL BEGENA SCHOOL STORE CHECKOUT
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Finalize customer details, select pickup campus, submit payment receipt, and reserve your instruments.
          </p>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 flex items-center justify-around text-xs font-bold shadow-xs">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#E89B52]' : 'text-gray-400'}`}>
          <span className="w-6 h-6 rounded-full bg-[#E89B52]/20 flex items-center justify-center font-mono">1</span>
          <span>Customer & Fulfillment</span>
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#E89B52]' : 'text-gray-400'}`}>
          <span className="w-6 h-6 rounded-full bg-[#E89B52]/20 flex items-center justify-center font-mono">2</span>
          <span>Payment & Receipt</span>
        </div>
        <div className={`flex items-center gap-2 ${step === 3 ? 'text-[#E89B52]' : 'text-gray-400'}`}>
          <span className="w-6 h-6 rounded-full bg-[#E89B52]/20 flex items-center justify-center font-mono">3</span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* STEP 1: CUSTOMER INFO & FULFILLMENT */}
      {step === 1 && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase tracking-wide border-b border-[#E7DED1] pb-3">
            STEP 1: CUSTOMER DETAILS & FULFILLMENT MODE
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
              <Input
                type="text"
                placeholder="Abebe Bikila"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
              <Input
                type="text"
                placeholder="+251 911 000 000"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
              <Input
                type="email"
                placeholder="customer@begena.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* FULFILLMENT CHOICE */}
          <div className="space-y-3 pt-4 border-t border-[#E7DED1]">
            <label className="text-xs font-bold text-gray-800 uppercase block tracking-wider">
              Select Delivery or Campus Pickup:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFulfillmentType('Branch Pickup')}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  fulfillmentType === 'Branch Pickup'
                    ? 'bg-amber-500/10 border-[#E89B52] text-[#2B2B2B] font-bold shadow-xs'
                    : 'bg-[#FAF6EF] border-[#E7DED1] text-gray-700'
                }`}
              >
                <Building2 size={20} className="text-[#E89B52] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm block">Campus Pickup (FREE)</span>
                  <span className="text-xs text-gray-500">Collect directly at Piazza, Megenagna, or Lebu.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('Delivery')}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  fulfillmentType === 'Delivery'
                    ? 'bg-amber-500/10 border-[#E89B52] text-[#2B2B2B] font-bold shadow-xs'
                    : 'bg-[#FAF6EF] border-[#E7DED1] text-gray-700'
                }`}
              >
                <Truck size={20} className="text-[#E89B52] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm block">Doorstep Delivery (+250 ETB)</span>
                  <span className="text-xs text-gray-500">Delivered by courier within Addis Ababa.</span>
                </div>
              </button>
            </div>
          </div>

          {/* CAMPUS PICKUP OPTIONS */}
          {fulfillmentType === 'Branch Pickup' && (
            <div className="bg-[#FAF6EF] p-5 rounded-2xl border border-[#E7DED1] space-y-3">
              <label className="text-xs font-bold text-[#2B2B2B] block">Select Pickup Campus Location:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Piazza', 'Megenagna', 'Lebu'] as const).map((branch) => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => setSelectedPickupBranch(branch)}
                    className={`p-3 rounded-xl border text-xs text-left transition cursor-pointer ${
                      selectedPickupBranch === branch
                        ? 'bg-[#2B2B2B] text-white border-[#2B2B2B] font-bold'
                        : 'bg-white border-[#E7DED1] text-gray-800'
                    }`}
                  >
                    <span className="block font-bold">{branch} Campus</span>
                    <span className="text-[10px] font-mono opacity-80">Mon-Sat: 8:30 AM - 6:00 PM</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DELIVERY ADDRESS FORM */}
          {fulfillmentType === 'Delivery' && (
            <div className="bg-[#FAF6EF] p-5 rounded-2xl border border-[#E7DED1] space-y-3">
              <label className="text-xs font-bold text-[#2B2B2B] block">Addis Ababa Delivery Address Details:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block">City</label>
                  <Input type="text" value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)} className="text-xs bg-white" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block">Sub-City</label>
                  <Input type="text" value={deliverySubCity} onChange={(e) => setDeliverySubCity(e.target.value)} className="text-xs bg-white" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block">Woreda / Kebele</label>
                  <Input type="text" value={deliveryWoreda} onChange={(e) => setDeliveryWoreda(e.target.value)} className="text-xs bg-white" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-mono block">Specific Landmark / Delivery Notes</label>
                <Input
                  type="text"
                  placeholder="Near Church / Hotel / Landmark"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="text-xs bg-white"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-[#E7DED1]">
            <Button variant="secondary" size="sm" onClick={() => onNavigate('store-cart')}>
              Back to Cart
            </Button>
            <Button variant="primary" size="md" onClick={() => setStep(2)}>
              Proceed to Payment <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT & RECEIPT UPLOAD */}
      {step === 2 && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase tracking-wide border-b border-[#E7DED1] pb-3">
            STEP 2: SELECT PAYMENT METHOD & SUBMIT RECEIPT
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'CBE Bank Transfer', title: 'CBE Bank Transfer', desc: 'Account: 1000223344556' },
              { id: 'Telebirr', title: 'Telebirr Mobile', desc: 'Merchant: 0911 22 33 44' },
              { id: 'Cash on Pickup', title: 'Cash on Campus Pickup', desc: 'Pay at counter upon collection' }
            ].map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id as any)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  paymentMethod === pm.id
                    ? 'bg-amber-500/10 border-[#E89B52] text-[#2B2B2B] font-bold shadow-xs'
                    : 'bg-[#FAF6EF] border-[#E7DED1] text-gray-700'
                }`}
              >
                <CreditCard size={18} className="text-[#E89B52] mb-1" />
                <span className="font-bold text-xs block">{pm.title}</span>
                <span className="text-[10px] text-gray-500">{pm.desc}</span>
              </button>
            ))}
          </div>

          {/* PAYMENT INSTRUCTIONS */}
          {paymentMethod !== 'Cash on Pickup' && (
            <div className="bg-[#FAF6EF] p-5 rounded-2xl border border-[#E7DED1] space-y-4">
              <div className="text-xs text-gray-800 space-y-1">
                <span className="font-bold text-[#2B2B2B] block">
                  Payment Instructions for {paymentMethod}:
                </span>
                <p>
                  Please transfer exactly <b>{totalAmount.toLocaleString()} ETB</b> to our official account:
                </p>
                <div className="p-3 bg-white border border-[#E7DED1] rounded-xl font-mono text-xs text-[#2B2B2B] font-bold">
                  {paymentMethod === 'CBE Bank Transfer' ? (
                    <>
                      Commercial Bank of Ethiopia (CBE) <br />
                      Account Number: <b>1000223344556</b> <br />
                      Account Name: <b>Abel Begena School</b>
                    </>
                  ) : (
                    <>
                      Telebirr Merchant Code / Phone <br />
                      Number: <b>0911223344</b> <br />
                      Name: <b>Abel Begena Academy Store</b>
                    </>
                  )}
                </div>
              </div>

              {/* RECEIPT UPLOAD AREA */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-[#2B2B2B] block">Upload Payment Screenshot / Receipt *</label>

                {receiptFile ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-3">
                      <img src={receiptFile} alt="" className="w-12 h-12 object-cover rounded-xl" />
                      <div>
                        <span className="font-bold block">Payment Receipt Attached</span>
                        <span className="text-[10px] font-mono text-emerald-700">TxRef: {txRef || 'Auto-generated'}</span>
                      </div>
                    </div>
                    <button onClick={() => setReceiptFile(null)} className="text-red-600 hover:underline text-xs font-bold">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#E7DED1] rounded-2xl p-6 text-center space-y-2 bg-white">
                    <Upload size={24} className="text-[#E89B52] mx-auto" />
                    <p className="text-xs text-gray-600">Drag & drop or click to attach payment receipt</p>
                  </div>
                )}

                <div>
                  <label className="text-[10px] text-gray-500 font-mono block">Transaction Reference / Reference ID</label>
                  <Input
                    type="text"
                    placeholder="e.g. CBE-TXN-88331122"
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    className="text-xs bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TOTAL REVIEW */}
          <div className="p-4 bg-stone-900 text-white rounded-2xl flex justify-between items-center text-xs">
            <div>
              <span className="text-amber-400 font-mono uppercase block text-[10px]">Total Amount Due</span>
              <span className="text-xs text-gray-300">{activeItems.length} items + {fulfillmentType}</span>
            </div>
            <span className="font-display font-black text-2xl text-white">
              {totalAmount.toLocaleString()} <span className="text-xs text-[#E89B52]">ETB</span>
            </span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#E7DED1]">
            <Button variant="secondary" size="sm" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> Back
            </Button>
            <Button variant="primary" size="md" disabled={isSubmitting} onClick={handlePlaceOrder}>
              {isSubmitting ? 'Reserving Stock...' : 'Submit Order & Reserve Stock'}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER CONFIRMATION */}
      {step === 3 && createdOrder && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-lg">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-[#2B2B2B] text-xs font-mono font-bold uppercase tracking-wider">
              ORDER {createdOrder.orderNumber} CREATED
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B]">
              THANK YOU FOR YOUR ORDER!
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your instruments and supplies have been reserved. Our branch accountants are reviewing your payment verification.
            </p>
          </div>

          {/* ORDER SUMMARY CARD */}
          <div className="bg-[#FAF6EF] p-6 rounded-2xl border border-[#E7DED1] max-w-md mx-auto text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-[#E7DED1] pb-2">
              <span className="text-gray-500">Order Number:</span>
              <span className="font-mono font-bold text-[#2B2B2B]">{createdOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-[#E7DED1] pb-2">
              <span className="text-gray-500">Fulfillment:</span>
              <span className="font-bold text-[#2B2B2B]">{createdOrder.fulfillmentType} ({createdOrder.pickupBranchName || 'Delivery'})</span>
            </div>
            <div className="flex justify-between border-b border-[#E7DED1] pb-2">
              <span className="text-gray-500">Payment Status:</span>
              <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{createdOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-bold text-[#2B2B2B]">Total Paid:</span>
              <span className="font-black text-base text-[#2B2B2B]">{createdOrder.totalETB.toLocaleString()} ETB</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="primary" size="md" onClick={() => onNavigate('store-orders')}>
              Track Order Status in My Orders
            </Button>
            <Button variant="secondary" size="md" onClick={() => onNavigate('store')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

