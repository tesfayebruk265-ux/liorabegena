import React, { useState } from 'react';
import {
  Building2,
  Package,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  UserCheck,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Send,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreOrder, Language } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';

interface BranchOrderDashboardProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  ordersList: StoreOrder[];
  onUpdateOrderStatus: (
    orderId: string,
    newStatus: StoreOrder['orderStatus'],
    newPaymentStatus?: StoreOrder['paymentStatus'],
    note?: string
  ) => void;
}

export function BranchOrderDashboard({
  lang,
  onNavigate,
  ordersList,
  onUpdateOrderStatus
}: BranchOrderDashboardProps) {
  const { currentUser, addNotification } = useAuth();

  const [selectedBranch, setSelectedBranch] = useState<'All' | 'Piazza' | 'Megenagna' | 'Lebu'>('Piazza');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Counter QR Pickup Scanner Modal / Input State
  const [scanCode, setScanCode] = useState('');
  const [scannedOrder, setScannedOrder] = useState<StoreOrder | null>(null);
  const [scanError, setScanError] = useState('');

  // Active selected order for fulfillment
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(ordersList[0] || null);

  const filteredOrders = ordersList.filter((o) => {
    if (selectedBranch !== 'All' && o.pickupBranchName && !o.pickupBranchName.includes(selectedBranch)) return false;
    if (statusFilter !== 'All' && o.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.transactionReference && o.transactionReference.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleScanOrder = () => {
    setScanError('');
    if (!scanCode.trim()) return;
    const q = scanCode.trim().toLowerCase();
    const found = ordersList.find(
      (o) =>
        o.orderNumber.toLowerCase() === q ||
        o.qrCodeData?.toLowerCase() === q ||
        o.customerPhone.includes(q)
    );

    if (found) {
      setScannedOrder(found);
      setSelectedOrder(found);
    } else {
      setScanError(`No order found matching code/phone "${scanCode}". Please check spelling.`);
    }
  };

  const handleReleaseProduct = (ord: StoreOrder) => {
    onUpdateOrderStatus(
      ord.id,
      'Completed',
      'Payment Confirmed',
      `Product handed to customer ${ord.customerName} at ${ord.pickupBranchName || 'Campus Counter'}`
    );
    addNotification('Order Completed', `Order ${ord.orderNumber} successfully picked up & released!`, 'system');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Building2 size={14} />
            <span>Campus Branch Store Fulfillment & QR Pickup Portal</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            CAMPUS STORE ORDER FULFILLMENT
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Verify payment receipts, scan customer pickup QR codes, release instruments, and record stock handovers.
          </p>
        </div>
      </div>

      {/* COUNTER QR / ORDER SEARCH BAR */}
      <div className="bg-[#FAF6EF] border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2B2B2B] uppercase tracking-wider">
          <QrCode size={18} className="text-[#E89B52]" />
          <span>Counter Verification Scanner (Enter Order #, Phone or Scan QR)</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Scan QR or type ABS-2026-000101 / +251 911 223 344..."
            value={scanCode}
            onChange={(e) => setScanCode(e.target.value)}
            className="text-xs bg-white font-mono"
          />
          <Button variant="primary" size="md" onClick={handleScanOrder} className="shrink-0 flex items-center gap-2">
            <Search size={16} />
            <span>Verify Order</span>
          </Button>
        </div>

        {scanError && <p className="text-xs text-red-600 font-bold">{scanError}</p>}
      </div>

      {/* BRANCH & STATUS FILTERS */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-gray-600">Active Campus:</span>
          {(['Piazza', 'Megenagna', 'Lebu', 'All'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBranch(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedBranch === b ? 'bg-[#2B2B2B] text-white' : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#E7DED1]'
              }`}
            >
              {b} Campus
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
          >
            <option value="All">All Statuses</option>
            <option value="Payment Verification">Payment Verification</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ORDERS LIST */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-[#2B2B2B] uppercase tracking-wider">
            Branch Orders ({filteredOrders.length})
          </h3>

          {filteredOrders.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center bg-white border border-[#E7DED1] rounded-2xl">
              No orders found for selected campus or filter.
            </p>
          ) : (
            filteredOrders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#2B2B2B] text-white border-[#2B2B2B] shadow-md'
                      : 'bg-white border-[#E7DED1] text-gray-800 hover:bg-[#FAF6EF]'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold">{ord.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.orderStatus === 'Ready for Pickup' ? 'bg-amber-400 text-black animate-pulse' : 'bg-white/20'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className={`font-bold ${isSelected ? 'text-amber-200' : 'text-[#2B2B2B]'}`}>
                      {ord.customerName} ({ord.customerPhone})
                    </p>
                    <p className="text-[11px] opacity-80">{ord.items.map((i) => i.productName).join(', ')}</p>
                    <span className="font-mono font-bold text-amber-500">{ord.totalETB.toLocaleString()} ETB</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FULFILLMENT & RELEASE ACTION PANEL */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex justify-between items-start border-b border-[#E7DED1] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#E89B52] uppercase font-bold block">
                    Campus Pickup Order Verification
                  </span>
                  <h2 className="font-display font-black text-2xl text-[#2B2B2B]">{selectedOrder.orderNumber}</h2>
                  <p className="text-xs text-gray-500">Customer: <b>{selectedOrder.customerName}</b> ({selectedOrder.customerPhone})</p>
                </div>

                <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">
                  {selectedOrder.orderStatus}
                </span>
              </div>

              {/* PAYMENT RECEIPT VERIFICATION CHECK */}
              <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2B2B2B]">Payment Verification & Receipt</span>
                  <span className="font-mono text-emerald-700 font-bold">{selectedOrder.paymentStatus}</span>
                </div>

                {selectedOrder.receiptUrl ? (
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#E7DED1]">
                    <img src={selectedOrder.receiptUrl} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                    <div className="text-xs space-y-0.5">
                      <span className="font-bold text-[#2B2B2B]">Method: {selectedOrder.paymentMethod}</span>
                      <p className="font-mono text-[11px] text-gray-600">TxRef: {selectedOrder.transactionReference || 'N/A'}</p>
                      <span className="text-emerald-700 font-bold block text-[10px]">✓ Receipt Attached & Verified</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-amber-800">Cash payment on campus pickup counter.</p>
                )}
              </div>

              {/* ITEMS CHECKLIST FOR RELEASE */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-[#2B2B2B] uppercase tracking-wider">Items to Release</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="p-3 bg-white border border-[#E7DED1] rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={it.productImage} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <span className="font-bold text-[#2B2B2B]">{it.productName}</span>
                          <span className="text-[10px] text-gray-500 block font-mono">SKU: {it.sku}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-600 text-sm">Qty: {it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FULFILLMENT ACTIONS */}
              <div className="pt-4 border-t border-[#E7DED1] flex flex-wrap gap-3">
                {selectedOrder.orderStatus === 'Payment Verification' && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => onUpdateOrderStatus(selectedOrder.id, 'Ready for Pickup', 'Payment Confirmed', 'Payment approved by branch staff.')}
                  >
                    Approve Payment & Set Ready for Pickup
                  </Button>
                )}

                {selectedOrder.orderStatus === 'Ready for Pickup' && (
                  <Button variant="primary" size="md" onClick={() => handleReleaseProduct(selectedOrder)} className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Confirm Customer Identity & Release Product</span>
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => onUpdateOrderStatus(selectedOrder.id, 'Cancelled', 'Payment Rejected', 'Cancelled by branch manager.')}
                  className="text-red-600 hover:bg-red-50"
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Select an order to manage fulfillment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

