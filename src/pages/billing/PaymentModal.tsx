import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import { QrCode, CreditCard, Banknote, Landmark, CheckCircle2 } from 'lucide-react';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId?: string;
  guestName: string;
  amount: number;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  guestName,
  amount,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'cash' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('guest@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        'Payment Settled',
        `Received ${formatINR(amount)} via ${method.toUpperCase()} for ${guestName}`
      );
      onPaymentSuccess();
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Payment"
      description={`Settle Folio for ${guestName} • Due: ${formatINR(amount)}`}
      maxWidth="md"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
          <Button variant="ghost" fullWidth className="sm:w-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            className="sm:w-auto"
            onClick={handlePay}
            isLoading={isProcessing}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Confirm {formatINR(amount)} Payment
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'upi', label: 'UPI / QR', icon: QrCode },
            { id: 'card', label: 'Card', icon: CreditCard },
            { id: 'cash', label: 'Cash', icon: Banknote },
            { id: 'netbanking', label: 'NetBank', icon: Landmark },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = method === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id as typeof method)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs ${
                  isSelected
                    ? 'bg-[#FFF1E6] border-[#FED7AA] text-[#C2410C] font-semibold'
                    : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. UPI Tab */}
        {method === 'upi' && (
          <div className="p-4 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] space-y-4 text-center">
            <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto flex items-center justify-center shadow-lg border border-[#E5E7EB]">
              {/* Simulated QR Code SVG pattern */}
              <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-black" />
                  <div className="w-6 h-6 bg-black" />
                </div>
                <div className="text-[10px] text-black font-extrabold tracking-tighter">
                  AURA PALMS RESORT
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-black" />
                  <div className="w-6 h-6 bg-black" />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6B7280]">
              Scan using any Indian UPI App (Google Pay, PhonePe, Paytm, BHIM)
            </p>

            <Input
              label="Or Request to Guest UPI VPA"
              placeholder="e.g. mobile@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {/* 2. Credit / Debit Card Tab */}
        {method === 'card' && (
          <div className="space-y-3">
            <Input
              label="Card Number"
              placeholder="4532 •••• •••• 8821"
              defaultValue="4532 9821 4410 8821"
              leftIcon={<CreditCard className="w-4 h-4" />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Expiry Date" placeholder="MM/YY" defaultValue="08/29" />
              <Input label="CVV" placeholder="•••" type="password" defaultValue="342" />
            </div>
            <Input label="Name on Card" placeholder="Cardholder name" defaultValue={guestName} />
          </div>
        )}

        {/* 3. Cash Tab */}
        {method === 'cash' && (
          <div className="p-4 rounded-xl bg-[#FFF8F3] border border-[#E5E7EB] space-y-3">
            <Input
              label="Amount Received (₹)"
              type="number"
              defaultValue={amount}
            />
            <div className="p-3 rounded-lg bg-white border border-[#E5E7EB] text-xs text-[#6B7280] flex justify-between">
              <span>Change to return to guest:</span>
              <span className="font-bold text-[#22C55E]">{formatINR(0)}</span>
            </div>
          </div>
        )}

        {/* 4. Net Banking Tab */}
        {method === 'netbanking' && (
          <div className="space-y-3">
            <Select
              label="Select Bank"
              options={[
                { label: 'HDFC Bank', value: 'hdfc' },
                { label: 'State Bank of India (SBI)', value: 'sbi' },
                { label: 'ICICI Bank', value: 'icici' },
                { label: 'Axis Bank', value: 'axis' },
                { label: 'Kotak Mahindra Bank', value: 'kotak' },
              ]}
            />
            <Input label="Corporate Reference ID" placeholder="e.g. CORP-PO-9921" />
          </div>
        )}
      </div>
    </Modal>
  );
};
