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
import { useAuthStore } from '@/store/useAuthStore';
import { Receipt, CreditCard, RotateCcw, Eye, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { role } = useAuthStore();
  const isAccountant = role === 'Accountant';
  const isReceptionist = role === 'Receptionist';

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
      accessor: (i) => <span className="font-bold text-[#0F5132]">{i.invoiceNumber}</span>,
      sortable: true,
      sortValue: (i) => i.invoiceNumber,
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      accessor: (i) => <span className="font-semibold text-[#1F2937]">{i.guestName}</span>,
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
        <span className="text-xs text-[#6B7280]">
          {formatINR(i.gstAmount)} ({i.gstRate}%)
        </span>
      ),
    },
    {
      key: 'grandTotal',
      header: 'Total Bill (₹)',
      accessor: (i) => (
        <span className="font-bold text-[#1F2937]">{formatINR(i.grandTotal)}</span>
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
      {isAccountant && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                Chief Accountant GST Ledger & Monthly Tax Audit
              </span>
              <p className="text-xs text-[#475569] mt-0.5">
                Hospitality Tax Split: CGST 6%/9% + SGST 6%/9%. Total Invoiced: <strong>{formatINR(invoices.reduce((acc, i) => acc + i.grandTotal, 0))}</strong> | Collected: <strong>{formatINR(invoices.filter((i) => i.status === 'Paid').reduce((acc, i) => acc + i.grandTotal, 0))}</strong>
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => toast.success('Tally XML Exported', 'GSTR-1 JSON and Tally Ledger exported.')}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export GSTR-1
          </Button>
        </div>
      )}

      {isReceptionist && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Front Desk Express Checkout & Folio Settlement
              </span>
              <p className="text-xs text-[#475569] mt-0.5">
                Collect pending room charges, dining bills, and issue electronic GST tax invoices before key return.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {invoices.filter((i) => i.status === 'Pending').length} Pending Settlement
          </span>
        </div>
      )}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132]">
          {isAccountant ? 'GST Tax Invoices & Ledger Accounting' : 'Billing & Guest Tax Invoices'}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
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
