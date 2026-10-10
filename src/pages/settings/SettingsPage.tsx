import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { getTaxConfig, saveTaxConfig, calculateGST, INDIAN_STATES, TaxConfig } from '@/api/taxApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { toast } from '@/store/useToastStore';
import { formatINR } from '@/lib/formatINR';
import {
  Settings,
  Shield,
  Building,
  Receipt,
  Save,
  Check,
  ArrowLeftRight,
  Calculator,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '@/types';

export const SettingsPage: React.FC = () => {
  const { currentResort } = useAuthStore();

  const [resortName, setResortName] = useState(currentResort.name || 'Joy Resorts Candolim Beachfront');
  const [phone, setPhone] = useState('+91 832 249 9888');
  const [address, setAddress] = useState('Candolim Beach Road, North Goa, 403515');

  // Tax Configuration State
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(getTaxConfig(currentResort.id));

  // Simulator Test Amount
  const [simRoomAmount, setSimRoomAmount] = useState(8500);
  const [simDiningAmount, setSimDiningAmount] = useState(2000);

  useEffect(() => {
    const config = getTaxConfig(currentResort.id);
    setTaxConfig(config);
    setResortName(currentResort.name);
  }, [currentResort.id, currentResort.name]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (taxConfig.gstin.length !== 15) {
      toast.error('Invalid GSTIN', 'Indian GSTIN must be exactly 15 characters (e.g. 30AAACJ9988G1Z7).');
      return;
    }

    saveTaxConfig({
      ...taxConfig,
      resortId: currentResort.id,
      resortName,
    });

    toast.success(
      'Tax & Property Settings Saved',
      `GSTIN and tax parameters for ${currentResort.name} updated successfully.`
    );
  };

  // Live GST Calculations for Preview
  const roomTaxPreview = calculateGST(
    simRoomAmount,
    simRoomAmount >= 7500 ? 'RoomAbove7500' : 'RoomUnder7500',
    taxConfig.enableInterstateIGST,
    currentResort.id
  );

  const diningTaxPreview = calculateGST(
    simDiningAmount,
    'Dining',
    taxConfig.enableInterstateIGST,
    currentResort.id
  );

  const modules = [
    { name: 'Rooms & Villas', roles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Housekeeping', 'Guest'] },
    { name: 'Bookings & Check-In', roles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist'] },
    { name: 'Housekeeping Board', roles: ['Super Admin', 'Resort Manager', 'Housekeeping'] },
    { name: 'Restaurant & F&B', roles: ['Super Admin', 'Resort Manager', 'Restaurant/F&B'] },
    { name: 'Billing & GST Invoices', roles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Accountant'] },
    { name: 'Financial Reports & P&L', roles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Accountant'] },
    { name: 'Staff Management', roles: ['Super Admin', 'Resort Owner', 'Resort Manager'] },
    { name: 'SaaS Subscription & Quota', roles: ['Super Admin', 'Resort Owner', 'Resort Manager'] },
  ];

  const allRoles: UserRole[] = [
    'Super Admin',
    'Resort Owner',
    'Resort Manager',
    'Receptionist',
    'Housekeeping',
    'Restaurant/F&B',
    'Accountant',
    'Guest',
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-5 text-left">
      <div>
        <div className="flex flex-col lg:flex-row items-center gap-2">
          <h1 className="text-md sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#0F5132]" />
            <span>Resort Settings & GST Taxation</span>
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {currentResort.name}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Property metadata, Indian GSTIN compliance, dynamic tax splits, and RBAC matrix.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
        {/* General Property Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0F5132]" />
              <span>Resort Identity & Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Resort Commercial Name"
                value={resortName}
                onChange={(e) => setResortName(e.target.value)}
                required
              />
              <Input
                label="Central Reception Landline"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                label="Physical Property Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* GST & Taxation */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#0F5132]" />
                <span>Goods & Services Tax (GST) Compliance Parameters</span>
              </CardTitle>
              <span className="text-xs text-[#0F5132] font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                HSN 9963 Hospitality Standard
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="State GSTIN Number"
                value={taxConfig.gstin}
                onChange={(e) => setTaxConfig({ ...taxConfig, gstin: e.target.value.toUpperCase() })}
                helperText="15-character Indian GSTIN"
                placeholder="30AAACJ9988G1Z7"
                required
              />

              <Input
                label="Legal Entity Registered Name"
                value={taxConfig.legalEntityName}
                onChange={(e) => setTaxConfig({ ...taxConfig, legalEntityName: e.target.value })}
                placeholder="Joy Resorts Sanctuary Pvt Ltd"
                required
              />

              <Select
                label="Registered State Jurisdiction"
                value={taxConfig.stateCode}
                onChange={(e) => {
                  const found = INDIAN_STATES.find((s) => s.code === e.target.value);
                  setTaxConfig({
                    ...taxConfig,
                    stateCode: e.target.value,
                    stateName: found ? found.name : taxConfig.stateName,
                  });
                }}
                options={INDIAN_STATES.map((s) => ({
                  label: `${s.code} - ${s.name}`,
                  value: s.code,
                }))}
              />

              <Select
                label="Room GST (Tariff ≥ ₹7,500/night)"
                value={String(taxConfig.roomGstAbove7500)}
                onChange={(e) => setTaxConfig({ ...taxConfig, roomGstAbove7500: Number(e.target.value) })}
                options={[
                  { label: '18% GST (9% CGST + 9% SGST)', value: '18' },
                  { label: '28% GST (Luxury Surcharge)', value: '28' },
                ]}
              />

              <Select
                label="Room GST (Tariff < ₹7,500/night)"
                value={String(taxConfig.roomGstUnder7500)}
                onChange={(e) => setTaxConfig({ ...taxConfig, roomGstUnder7500: Number(e.target.value) })}
                options={[
                  { label: '12% GST (6% CGST + 6% SGST)', value: '12' },
                  { label: '5% GST (Budget Slab)', value: '5' },
                  { label: '0% (Exempt)', value: '0' },
                ]}
              />

              <Select
                label="Restaurant & Dining GST Rate"
                value={String(taxConfig.restaurantGst)}
                onChange={(e) => setTaxConfig({ ...taxConfig, restaurantGst: Number(e.target.value) })}
                options={[
                  { label: '5% GST (2.5% CGST + 2.5% SGST - Standard)', value: '5' },
                  { label: '18% GST (Non-composite Liquor/Banquet)', value: '18' },
                ]}
              />

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="interstateIgst"
                  checked={taxConfig.enableInterstateIGST}
                  onChange={(e) => setTaxConfig({ ...taxConfig, enableInterstateIGST: e.target.checked })}
                  className="w-4 h-4 accent-[#0F5132] rounded"
                />
                <label htmlFor="interstateIgst" className="text-xs font-semibold text-[#1F2937] cursor-pointer">
                  Enable Interstate IGST by Default
                </label>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="compositionScheme"
                  checked={taxConfig.isCompositionScheme}
                  onChange={(e) => setTaxConfig({ ...taxConfig, isCompositionScheme: e.target.checked })}
                  className="w-4 h-4 accent-[#0F5132] rounded"
                />
                <label htmlFor="compositionScheme" className="text-xs font-semibold text-[#1F2937] cursor-pointer">
                  Composition Scheme (Flat rate)
                </label>
              </div>
            </div>

            {/* Live Interactive GST Calculator Simulator */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                <Calculator className="w-4 h-4 text-[#0F5132]" />
                <span>Live GST Calculation Simulator (Real-Time Verification)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Villa Room Night Simulation */}
                <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Sample Villa Tariff:</span>
                    <div className="flex items-center gap-1">
                      <span>₹</span>
                      <input
                        type="number"
                        value={simRoomAmount}
                        onChange={(e) => setSimRoomAmount(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-0.5 border rounded text-right font-bold text-[#0F5132]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-[#64748B]">
                    <div className="flex justify-between">
                      <span>Applied Rate:</span>
                      <span className="font-bold text-slate-800">{roomTaxPreview.rate}% GST</span>
                    </div>
                    {!taxConfig.enableInterstateIGST ? (
                      <>
                        <div className="flex justify-between">
                          <span>CGST ({roomTaxPreview.rate / 2}%):</span>
                          <span>{formatINR(roomTaxPreview.cgst)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST ({roomTaxPreview.rate / 2}%):</span>
                          <span>{formatINR(roomTaxPreview.sgst)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span>IGST ({roomTaxPreview.rate}%):</span>
                        <span>{formatINR(roomTaxPreview.igst)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-xs text-[#0F172A] pt-1 border-t">
                      <span>Grand Total Bill:</span>
                      <span className="text-[#0F5132]">{formatINR(roomTaxPreview.grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* F&B Dining Bill Simulation */}
                <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Sample Restaurant Bill:</span>
                    <div className="flex items-center gap-1">
                      <span>₹</span>
                      <input
                        type="number"
                        value={simDiningAmount}
                        onChange={(e) => setSimDiningAmount(Number(e.target.value) || 0)}
                        className="w-20 px-2 py-0.5 border rounded text-right font-bold text-[#0F5132]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-[#64748B]">
                    <div className="flex justify-between">
                      <span>Applied Rate:</span>
                      <span className="font-bold text-slate-800">{diningTaxPreview.rate}% GST</span>
                    </div>
                    {!taxConfig.enableInterstateIGST ? (
                      <>
                        <div className="flex justify-between">
                          <span>CGST ({diningTaxPreview.rate / 2}%):</span>
                          <span>{formatINR(diningTaxPreview.cgst)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST ({diningTaxPreview.rate / 2}%):</span>
                          <span>{formatINR(diningTaxPreview.sgst)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span>IGST ({diningTaxPreview.rate}%):</span>
                        <span>{formatINR(diningTaxPreview.igst)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-xs text-[#0F172A] pt-1 border-t">
                      <span>Grand Total Bill:</span>
                      <span className="text-[#0F5132]">{formatINR(diningTaxPreview.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
                Save Tax Configuration
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions Matrix */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0F5132]" />
                <span className='text-xs'>Role-Based Access Control (RBAC) Matrix</span>
              </CardTitle>
              <span className="text-xs text-[#6B7280]">
                Multi-role access privileges for resort operational modules
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Mobile / Tablet Horizontal Scroll Notice */}
            <div className="lg:hidden flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-[#0F5132] animate-pulse" />
                Scroll horizontally to view all role permissions
              </span>
              <span className="text-[10px] font-semibold text-[#0F5132] bg-white px-2 py-0.5 rounded border border-[#E2E8F0] whitespace-nowrap">
                ↔ Swipe
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] scrollbar-thin">
              <table className="w-full min-w-[780px] text-xs text-left border-collapse">
                <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#4B5563] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">System Module</th>
                    {allRoles.map((r) => (
                      <th key={r} className="py-2.5 px-2 text-center whitespace-nowrap">
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {modules.map((m) => (
                    <tr key={m.name} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-3 font-semibold text-[#1F2937] whitespace-nowrap">
                        {m.name}
                      </td>
                      {allRoles.map((r) => {
                        const hasAccess = m.roles.includes(r);
                        return (
                          <td key={r} className="py-2.5 px-2 text-center">
                            {hasAccess ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-[#0F5132]">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              </span>
                            ) : (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D1D5DB]" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
