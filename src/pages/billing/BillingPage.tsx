import React, { useState } from 'react';
import { Invoice } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import { PaymentModal } from './PaymentModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { toast } from '@/store/useToastStore';
import { Receipt, CreditCard, RotateCcw, Eye } from 'lucide-react';

export const BillingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv-1',
      invoiceNumber: 'TAX-INV-2026-081',
      guestName: 'Rohan Mehra',
      date: '2026-10-05',
      subTotal: 16500,
      gstRate: 12,
      gstAmount: 1980,
      grandTotal: 18480,
      status: 'Paid',
    },
    {
      id: 'inv-2',
      invoiceNumber: 'TAX-INV-2026-082',
      guestName: 'Kavita Iyer',
      date: '2026-10-06',
      subTotal: 34500,
      gstRate: 18,
      gstAmount: 6210,
      grandTotal: 40710,
      status: 'Pending',
    },
    {
      id: 'inv-3',
      invoiceNumber: 'TAX-INV-2026-083',
      guestName: 'Devendra Singhania',
      date: '2026-10-04',
      subTotal: 72000,
      gstRate: 18,
      gstAmount: 12960,
      grandTotal: 84960,
      status: 'Paid',
    },
    {
      id: 'inv-4',
      invoiceNumber: 'TAX-INV-2026-084',
      guestName: 'Amitabh Joshi',
      date: '2026-10-03',
      subTotal: 11000,
      gstRate: 12,
      gstAmount: 1320,
      grandTotal: 12320,
      status: 'Paid',
    },
  ]);

  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<Invoice | null>(null);
  const [invoiceToRefund, setInvoiceToRefund] = useState<Invoice | null>(null);

  const handlePaymentSuccess = () => {
    if (!selectedInvoiceForPay) return;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoiceForPay.id ? { ...inv, status: 'Paid' } : inv
      )
    );
  };

  const handleRefundConfirm = () => {
    if (!invoiceToRefund) return;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceToRefund.id ? { ...inv, status: 'Pending' } : inv
      )
    );
    toast.warning(
      'Refund Dispatched',
      `Refund of ${formatINR(invoiceToRefund.grandTotal)} initiated to ${invoiceToRefund.guestName}'s source account.`
    );
    setInvoiceToRefund(null);
  };

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Tax Invoice #',
      accessor: (i) => <span className="font-bold text-[#B84C00]">{i.invoiceNumber}</span>,
      sortable: true,
      sortValue: (i) => i.invoiceNumber,
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      accessor: (i) => <span className="font-semibold text-[#0F172A]">{i.guestName}</span>,
      sortable: true,
      sortValue: (i) => i.guestName,
    },
    {
      key: 'date',
      header: 'Date',
      accessor: (i) => <span>{formatDate(i.date)}</span>,
    },
    {
      key: 'gstAmount',
      header: 'GST Breakup',
      accessor: (i) => (
        <span className="text-xs text-[#64748B]">
          {formatINR(i.gstAmount)} ({i.gstRate}%)
        </span>
      ),
    },
    {
      key: 'grandTotal',
      header: 'Total Bill (₹)',
      accessor: (i) => (
        <span className="font-bold text-[#0F172A]">{formatINR(i.grandTotal)}</span>
      ),
      sortable: true,
      sortValue: (i) => i.grandTotal,
    },
    {
      key: 'status',
      header: 'Payment Status',
      accessor: (i) => <StatusBadge status={i.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#B84C00]">
          Billing & GST Tax Invoices
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Compliant GST invoices, UPI payments, and hospitality refunds.
        </p>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        keyExtractor={(i) => i.id}
        pageSize={6}
        actions={(inv) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedInvoiceForView(inv)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Invoice
            </Button>

            {inv.status === 'Pending' ? (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setSelectedInvoiceForPay(inv)}
                leftIcon={<CreditCard className="w-3.5 h-3.5" />}
              >
                Pay
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setInvoiceToRefund(inv)}
                title="Initiate refund"
              >
                Refund
              </Button>
            )}
          </div>
        )}
      />

      {/* Invoice Detail & Print Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoiceForView}
        isOpen={!!selectedInvoiceForView}
        onClose={() => setSelectedInvoiceForView(null)}
      />

      {/* Payment Settlement Modal */}
      {selectedInvoiceForPay && (
        <PaymentModal
          isOpen={!!selectedInvoiceForPay}
          onClose={() => setSelectedInvoiceForPay(null)}
          guestName={selectedInvoiceForPay.guestName}
          amount={selectedInvoiceForPay.grandTotal}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Refund Confirmation Dialog */}
      {invoiceToRefund && (
        <ConfirmDialog
          isOpen={!!invoiceToRefund}
          onClose={() => setInvoiceToRefund(null)}
          title="Process GST Refund?"
          description={`Are you sure you want to issue a refund of ${formatINR(
            invoiceToRefund.grandTotal
          )} to ${invoiceToRefund.guestName}? A credit note will be generated.`}
          confirmText="Issue Refund"
          variant="warning"
          onConfirm={handleRefundConfirm}
        />
      )}
    </div>
  );
};
