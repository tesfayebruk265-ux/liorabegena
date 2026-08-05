import React, { useState } from 'react';
import { RotateCcw, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { StoreOrder, StoreReturnRequest, Language } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';

interface StoreReturnsViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  ordersList: StoreOrder[];
  returnsList: StoreReturnRequest[];
  onRequestReturn: (request: StoreReturnRequest) => void;
}

export function StoreReturnsView({
  lang,
  onNavigate,
  ordersList,
  returnsList,
  onRequestReturn
}: StoreReturnsViewProps) {
  const { currentUser, addNotification } = useAuth();

  const [selectedOrderId, setSelectedOrderId] = useState(ordersList[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [reason, setReason] = useState('Defective or Damaged Instrument');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const activeOrder = ordersList.find((o) => o.id === selectedOrderId);

  const handleSubmitReturn = () => {
    if (!activeOrder) return;
    const prod = activeOrder.items?.find((i) => i.productId === selectedProductId) || activeOrder.items?.[0];
    if (!prod) return;

    const req: StoreReturnRequest = {
      id: `ret-${Date.now()}`,
      orderId: activeOrder.id,
      orderNumber: activeOrder.orderNumber,
      customerName: activeOrder.customerName,
      customerPhone: activeOrder.customerPhone,
      productId: prod.productId,
      productName: prod.productName,
      reason,
      description,
      photoUrls: photoUrl ? [photoUrl] : undefined,
      requestDate: new Date().toISOString().substring(0, 10),
      status: 'Requested',
      refundType: 'Full Refund'
    };

    onRequestReturn(req);
    setDescription('');
    addNotification('Return Request Submitted', `Return request for order ${activeOrder.orderNumber} is under review.`, 'system');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <RotateCcw size={14} />
            <span>Customer Returns & Exchanges</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            PRODUCT RETURN & EXCHANGE PORTAL
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Submit inspection return requests for damaged instruments or incorrect string gauges according to school policy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* NEW RETURN FORM */}
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">SUBMIT RETURN REQUEST</h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Select Order Number *</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
              >
                {ordersList.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} ({o.orderDate})
                  </option>
                ))}
              </select>
            </div>

            {activeOrder && (
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Select Product to Return *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
                >
                  <option value="">-- Select Product --</option>
                  {activeOrder.items.map((i) => (
                    <option key={i.productId} value={i.productId}>
                      {i.productName} ({i.quantity} x {i.priceETB} ETB)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Reason for Return *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
              >
                <option value="Defective or Damaged Instrument">Defective or Damaged Instrument</option>
                <option value="Wrong String Gauge Received">Wrong String Gauge Received</option>
                <option value="Missing Accessories or Parts">Missing Accessories or Parts</option>
                <option value="Changed Mind">Changed Mind (Store Credit)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Description / Notes</label>
              <Input
                type="text"
                placeholder="Describe condition or defect..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>

            <Button variant="primary" size="md" onClick={handleSubmitReturn} className="w-full">
              Submit Return Request
            </Button>
          </div>
        </div>

        {/* RETURNS HISTORY */}
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">MY RETURN REQUESTS</h3>

          {returnsList.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No active return requests.</p>
          ) : (
            <div className="space-y-3">
              {returnsList.map((r) => (
                <div key={r.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Order {r.orderNumber}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold">{r.status}</span>
                  </div>
                  <p className="font-bold text-[#2B2B2B]">{r.productName}</p>
                  <p className="text-gray-600">{r.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

