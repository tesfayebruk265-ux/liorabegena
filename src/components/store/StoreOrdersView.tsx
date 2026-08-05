import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Printer,
  Download,
  Building2,
  Truck,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreOrder, Language } from '../../types';
import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';

interface StoreOrdersViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  ordersList: StoreOrder[];
  onOpenReturnRequest?: (order: StoreOrder) => void;
}

export function StoreOrdersView({
  lang,
  onNavigate,
  ordersList,
  onOpenReturnRequest
}: StoreOrdersViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(ordersList[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const filteredOrders = ordersList.filter((o) => {
    if (statusFilter !== 'All' && o.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.items.some((i) => i.productName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Ready for Pickup':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-black animate-pulse';
      case 'Payment Verification':
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Pending Payment':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Package size={14} />
            <span>Customer Order History & Pickup Receipts</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            MY INSTRUMENT & SUPPLY ORDERS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            View order status, show QR pickup codes at campus counters, download official school invoices, or request returns.
          </p>
        </div>
      </div>

      {ordersList.length === 0 ? (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-amber-50 text-[#E89B52] rounded-full flex items-center justify-center mx-auto">
            <Package size={32} />
          </div>
          <h2 className="font-display font-black text-xl text-[#2B2B2B]">NO STORE ORDERS FOUND</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You have not placed any store orders yet. Browse our instruments, gut strings, and books!
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate('store')}>
            Browse Store Catalog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ORDERS LIST (1 COL) */}
          <div className="space-y-4">
            {/* SEARCH & FILTER */}
            <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 space-y-3 shadow-xs">
              <Input
                type="text"
                placeholder="Search order #, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
              >
                <option value="All">All Order Statuses</option>
                <option value="Payment Verification">Payment Verification</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Completed">Completed Orders</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* LIST CARDS */}
            <div className="space-y-3">
              {filteredOrders.map((ord) => {
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
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className={`font-bold line-clamp-1 ${isSelected ? 'text-amber-200' : 'text-[#2B2B2B]'}`}>
                        {ord.items.map((i) => i.productName).join(', ')}
                      </p>
                      <div className={`flex justify-between text-[11px] ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        <span>{ord.orderDate}</span>
                        <span className="font-mono font-bold">{ord.totalETB.toLocaleString()} ETB</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ORDER DETAILS PANEL (2 COLS) */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                {/* HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7DED1] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-black text-xl text-[#2B2B2B]">{selectedOrder.orderNumber}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">Placed on {selectedOrder.orderDate}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowInvoiceModal(true)} className="flex items-center gap-1.5 text-xs">
                      <FileText size={14} />
                      <span>Invoice & Receipt</span>
                    </Button>

                    {onOpenReturnRequest && selectedOrder.orderStatus === 'Completed' && (
                      <Button variant="secondary" size="sm" onClick={() => onOpenReturnRequest(selectedOrder)} className="flex items-center gap-1.5 text-xs">
                        <RotateCcw size={14} />
                        <span>Return / Exchange</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* QR CODE & PICKUP CARD (IF READY) */}
                {selectedOrder.fulfillmentType === 'Branch Pickup' && (
                  <div className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-50 to-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-xs text-amber-950">
                      <div className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2">
                        <Building2 size={16} className="text-[#E89B52]" />
                        <span>Campus Pickup Location: <b>{selectedOrder.pickupBranchName}</b></span>
                      </div>
                      <p className="text-gray-600">{selectedOrder.pickupAddress}</p>
                      <p className="text-[11px] text-amber-800 font-mono">
                        Expected Ready Date: {selectedOrder.expectedPickupDate}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-amber-200 text-center shadow-2xs">
                      <QrCode size={64} className="mx-auto text-[#2B2B2B]" />
                      <span className="text-[9px] font-mono font-bold text-gray-500 uppercase block mt-1">
                        Show Code at Counter
                      </span>
                    </div>
                  </div>
                )}

                {/* ORDER TIMELINE */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#2B2B2B] uppercase tracking-wider">Order Status Timeline</h4>
                  <div className="space-y-2">
                    {selectedOrder.timeline.map((tl, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs bg-[#FAF6EF] p-3 rounded-xl border border-[#E7DED1]">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#2B2B2B]">{tl.status}</span>
                            <span className="text-[10px] font-mono text-gray-400">{tl.date}</span>
                          </div>
                          {tl.note && <p className="text-gray-600 text-[11px]">{tl.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#2B2B2B] uppercase tracking-wider">Purchased Items</h4>
                  <div className="border border-[#E7DED1] rounded-2xl overflow-hidden divide-y divide-[#E7DED1]">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-3 flex items-center justify-between text-xs bg-white">
                        <div className="flex items-center gap-3">
                          <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded-xl bg-stone-100" />
                          <div>
                            <h5 className="font-bold text-[#2B2B2B]">{item.productName}</h5>
                            <span className="text-[10px] text-gray-500 font-mono">
                              Qty: {item.quantity} • SKU: {item.sku}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-[#2B2B2B]">
                          {(item.priceETB * item.quantity).toLocaleString()} ETB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PAYMENT SUMMARY */}
                <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-mono font-bold">{selectedOrder.subtotalETB.toLocaleString()} ETB</span>
                  </div>
                  {selectedOrder.discountETB > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({selectedOrder.couponCode}):</span>
                      <span className="font-mono font-bold">-{selectedOrder.discountETB.toLocaleString()} ETB</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fulfillment Fee:</span>
                    <span className="font-mono font-bold">{selectedOrder.deliveryFeeETB.toLocaleString()} ETB</span>
                  </div>
                  <div className="pt-2 border-t border-[#E7DED1] flex justify-between font-black text-sm text-[#2B2B2B]">
                    <span>Total Amount:</span>
                    <span>{selectedOrder.totalETB.toLocaleString()} ETB</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Select an order from the left list.</p>
            )}
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL */}
      <AnimatePresence>
        {showInvoiceModal && selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#E7DED1] rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative my-8">
              <div className="flex justify-between items-start border-b border-[#E7DED1] pb-4">
                <div>
                  <h2 className="font-display font-black text-2xl text-[#2B2B2B]">ABEL BEGENA SCHOOL</h2>
                  <p className="text-xs text-gray-500 font-mono">OFFICIAL ACADEMY STORE INVOICE & RECEIPT</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-gray-500 block">Customer Information:</span>
                  <p className="font-bold text-[#2B2B2B]">{selectedOrder.customerName}</p>
                  <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                  <p className="text-gray-600">{selectedOrder.customerEmail}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-500 block">Invoice Metadata:</span>
                  <p className="font-mono font-bold text-[#2B2B2B]">{selectedOrder.orderNumber}</p>
                  <p className="text-gray-600">Date: {selectedOrder.orderDate}</p>
                  <p className="text-gray-600">Method: {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* ITEMS BREAKDOWN */}
              <table className="w-full text-xs text-left border border-[#E7DED1] rounded-xl overflow-hidden">
                <thead className="bg-[#FAF6EF] text-[#2B2B2B] font-bold">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5">Qty</th>
                    <th className="p-2.5">Unit Price</th>
                    <th className="p-2.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DED1]">
                  {selectedOrder.items.map((it) => (
                    <tr key={it.id}>
                      <td className="p-2.5 font-bold">{it.productName}</td>
                      <td className="p-2.5 font-mono">{it.quantity}</td>
                      <td className="p-2.5 font-mono">{it.priceETB.toLocaleString()} ETB</td>
                      <td className="p-2.5 font-mono text-right">{(it.priceETB * it.quantity).toLocaleString()} ETB</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right text-xs space-y-1 border-t border-[#E7DED1] pt-3">
                <p>Subtotal: <b>{selectedOrder.subtotalETB.toLocaleString()} ETB</b></p>
                <p className="font-black text-base text-[#2B2B2B]">
                  Grand Total Paid: <b>{selectedOrder.totalETB.toLocaleString()} ETB</b>
                </p>
              </div>

              <div className="text-center pt-4 border-t border-[#E7DED1]">
                <Button variant="secondary" size="sm" onClick={() => setShowInvoiceModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

