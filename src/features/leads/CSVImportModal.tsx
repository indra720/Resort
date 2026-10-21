import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { createLead, checkDuplicateLead } from '@/api/leads';
import { downloadSampleCSVTemplate } from './CSVExport';
import { toast } from '@/store/useToastStore';

export interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedRow {
  name: string;
  phone: string;
  email: string;
  city: string;
  interested_in: string;
  adults: number;
  children: number;
  preferred_date: string;
  budget_min: number;
  budget_max: number;
  source: string;
  assigned_to: string;
  remarks: string;
  isValid: boolean;
  errorReason?: string;
  isDuplicate?: boolean;
}

export const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentResort, user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const parseCSVText = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      toast.error('Invalid CSV', 'The CSV file must contain a header row and at least 1 lead row.');
      return;
    }

    const headers = lines[0]
      .split(',')
      .map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

    const nameIdx = headers.findIndex((h) => h.includes('name'));
    const phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile'));
    const emailIdx = headers.findIndex((h) => h.includes('email'));
    const cityIdx = headers.findIndex((h) => h.includes('city') || h.includes('location'));
    const interestIdx = headers.findIndex((h) => h.includes('interest'));
    const budgetMinIdx = headers.findIndex((h) => h.includes('budget min') || h.includes('min'));
    const budgetMaxIdx = headers.findIndex((h) => h.includes('budget max') || h.includes('budget'));
    const sourceIdx = headers.findIndex((h) => h.includes('source') || h.includes('channel'));
    const assignedIdx = headers.findIndex((h) => h.includes('assigned') || h.includes('rep'));

    const rows: ParsedRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Split by comma taking quoted commas into account
      const rawCols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const cols = rawCols.map((c) => c.replace(/^["']|["']$/g, '').trim());

      const name = nameIdx >= 0 ? cols[nameIdx] || '' : cols[0] || '';
      const phone = phoneIdx >= 0 ? cols[phoneIdx] || '' : cols[1] || '';
      const email = emailIdx >= 0 ? cols[emailIdx] || '' : cols[2] || '';
      const city = cityIdx >= 0 ? cols[cityIdx] || 'Mumbai' : 'Mumbai';
      const interested_in = interestIdx >= 0 ? cols[interestIdx] || 'Weekend Stay' : 'Weekend Stay';
      const budget_min = budgetMinIdx >= 0 ? Number(cols[budgetMinIdx]) || 30000 : 30000;
      const budget_max = budgetMaxIdx >= 0 ? Number(cols[budgetMaxIdx]) || 50000 : 50000;
      const source = sourceIdx >= 0 ? cols[sourceIdx] || 'Website' : 'Website';
      const assigned_to = assignedIdx >= 0 ? cols[assignedIdx] || 'Sameer Verma' : 'Sameer Verma';

      // Validation
      let isValid = true;
      let errorReason = '';

      if (!name || name.trim().length < 2) {
        isValid = false;
        errorReason = 'Missing or invalid guest name';
      } else {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          isValid = false;
          errorReason = 'Invalid phone number (must be at least 10 digits)';
        }
      }

      // Duplicate check against current resort
      const dup = checkDuplicateLead(phone, email, currentResort.id);

      rows.push({
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        city: city || 'Mumbai',
        interested_in,
        adults: 2,
        children: 0,
        preferred_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        budget_min,
        budget_max,
        source,
        assigned_to: assigned_to || 'Sameer Verma',
        remarks: 'Imported from CSV list',
        isValid,
        errorReason,
        isDuplicate: dup.isDuplicate,
      });
    }

    setParsedRows(rows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        parseCSVText(content);
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleConfirmImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid && !r.isDuplicate);
    if (validRows.length === 0) {
      toast.error('No Valid Leads', 'No rows passed validation criteria for import.');
      return;
    }

    setIsProcessing(true);
    let importedCount = 0;

    for (const r of validRows) {
      const res = createLead(
        {
          name: r.name,
          phone: r.phone,
          email: r.email,
          city: `${r.city}, India`,
          interested_in: (r.interested_in as any) || 'Weekend Stay',
          guests_adults: r.adults,
          guests_children: r.children,
          preferred_date: r.preferred_date,
          budget_min: r.budget_min,
          budget_max: r.budget_max,
          source: (r.source as any) || 'Website',
          priority: 'Medium',
          status: 'New',
          score: 'Warm',
          tags: ['CSV Import'],
          assigned_to: r.assigned_to,
          remarks: r.remarks,
        },
        currentResort.id,
        user
      );
      if (res.success) importedCount++;
    }

    setIsProcessing(false);
    toast.success('CSV Import Completed', `Successfully imported ${importedCount} leads into ${currentResort.name}.`);
    onSuccess();
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid && !r.isDuplicate).length;
  const duplicateCount = parsedRows.filter((r) => r.isDuplicate).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl lg:max-w-4xl p-6 sm:p-7 shadow-2xl border border-[#E2E8F0] my-auto text-left text-xs text-[#0F172A] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Import Leads from CSV</h2>
              <p className="text-xs text-[#64748B]">
                Upload a spreadsheet to import sales leads into <strong>{currentResort.name}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!file ? (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-[#CBD5E1] hover:border-[#0F5132] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F8FAFC]">
              <Upload className="w-8 h-8 text-[#0F5132] mb-2" />
              <span className="font-bold text-[#0F172A] text-sm">Choose CSV File to Upload</span>
              <span className="text-[11px] text-[#64748B] mt-1">Supports standard CSV format with headers</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[#475569]">Need a ready-made template to fill your contacts?</span>
              <button
                type="button"
                onClick={downloadSampleCSVTemplate}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-[#0F5132] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Template</span>
              </button>
            </div>
          </div>
        ) : (
          /* Preview Section */
          <div className="space-y-4">
            {/* Summary Statistics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-semibold text-emerald-800 block">Ready to Import</span>
                <span className="text-lg font-black text-[#0F5132]">{validCount} rows</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[11px] font-semibold text-amber-800 block">Existing Duplicates</span>
                <span className="text-lg font-black text-amber-900">{duplicateCount} skipped</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[11px] font-semibold text-rose-800 block">Validation Errors</span>
                <span className="text-lg font-black text-rose-900">{errorCount} rejected</span>
              </div>
            </div>

            {/* Preview Table of First 5 Rows */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="p-2.5 bg-[#F8FAFC] font-bold text-xs text-[#475569] border-b border-[#E2E8F0]">
                Preview of Rows ({parsedRows.length} total detected)
              </div>
              <div className="overflow-x-auto max-h-56 scrollbar-thin">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#F1F5F9] text-[#64748B] font-semibold">
                    <tr>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Phone</th>
                      <th className="py-2 px-3">Interested In</th>
                      <th className="py-2 px-3">Max Budget</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {parsedRows.slice(0, 8).map((r, i) => (
                      <tr key={i} className={!r.isValid ? 'bg-rose-50/40' : r.isDuplicate ? 'bg-amber-50/40' : ''}>
                        <td className="py-2 px-3">
                          {!r.isValid ? (
                            <span className="text-rose-700 font-bold" title={r.errorReason}>
                              ❌ Error
                            </span>
                          ) : r.isDuplicate ? (
                            <span className="text-amber-700 font-bold">⚠️ Duplicate</span>
                          ) : (
                            <span className="text-emerald-700 font-bold">✅ Valid</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-semibold text-[#0F172A]">{r.name}</td>
                        <td className="py-2 px-3">{r.phone}</td>
                        <td className="py-2 px-3">{r.interested_in}</td>
                        <td className="py-2 px-3 font-bold text-[#0F5132]">₹{r.budget_max.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setParsedRows([]);
                }}
                className="text-xs text-[#64748B] hover:text-[#0F172A] hover:underline"
              >
                Choose another file
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={validCount === 0 || isProcessing}
                  onClick={handleConfirmImport}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  <span>Import {validCount} Valid Leads</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
