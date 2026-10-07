import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { toast } from '@/store/useToastStore';
import { Settings, Shield, Building, Receipt, Save, Check, ArrowLeftRight } from 'lucide-react';
import { UserRole } from '@/types';

export const SettingsPage: React.FC = () => {
  const [resortName, setResortName] = useState('Aura Palms Resort & Spa');
  const [gstin, setGstin] = useState('30AABCA1234F1Z8');
  const [phone, setPhone] = useState('+91 832 249 9888');
  const [address, setAddress] = useState('Candolim Beach Road, North Goa, 403515');

  const [roomGstRate, setRoomGstRate] = useState('18');
  const [fnbGstRate, setFnbGstRate] = useState('5');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings Saved', 'Resort configuration and tax parameters updated.');
  };

  const modules = [
    { name: 'Rooms & Villas', roles: ['Super Admin', 'Resort Manager', 'Receptionist', 'Housekeeping', 'Guest'] },
    { name: 'Bookings & Check-In', roles: ['Super Admin', 'Resort Manager', 'Receptionist'] },
    { name: 'Housekeeping Board', roles: ['Super Admin', 'Resort Manager', 'Housekeeping'] },
    { name: 'Restaurant & F&B', roles: ['Super Admin', 'Resort Manager', 'Restaurant/F&B'] },
    { name: 'Billing & GST Invoices', roles: ['Super Admin', 'Resort Manager', 'Receptionist', 'Accountant'] },
    { name: 'Financial Reports', roles: ['Super Admin', 'Resort Manager', 'Accountant'] },
    { name: 'Staff Management', roles: ['Super Admin', 'Resort Manager'] },
    { name: 'System Settings', roles: ['Super Admin'] },
  ];

  const allRoles: UserRole[] = [
    'Super Admin',
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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#B84C00] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#B84C00]" />
          <span>Resort Settings & RBAC Permissions</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Hospitality property metadata, GSTIN tax credentials, and role permission policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
        {/* General Property Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#B84C00]" />
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
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#B84C00]" />
              <span>Goods & Services Tax (GST) Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="State GSTIN Number"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                helperText="15-digit valid Indian GSTIN"
                required
              />

              <Select
                label="Luxury Room GST Rate"
                value={roomGstRate}
                onChange={(e) => setRoomGstRate(e.target.value)}
                options={[
                  { label: '18% GST (Tariff ≥ ₹7,500/night)', value: '18' },
                  { label: '12% GST (Tariff < ₹7,500/night)', value: '12' },
                ]}
              />

              <Select
                label="Dining & F&B GST Rate"
                value={fnbGstRate}
                onChange={(e) => setFnbGstRate(e.target.value)}
                options={[
                  { label: '5% GST (Standard Restaurant Rate)', value: '5' },
                  { label: '18% GST (Non-composite Liquor/Banquet)', value: '18' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions Matrix */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#B84C00]" />
                <span>Role-Based Access Control (RBAC) Matrix</span>
              </CardTitle>
              <span className="text-xs text-[#64748B]">
                Multi-role access privileges for resort modules
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Mobile swipe helper */}
            <div className="sm:hidden flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#B84C00] animate-pulse shrink-0" />
                <span>Swipe horizontally to view all roles</span>
              </span>
              <span className="text-[10px] text-[#B84C00] font-medium bg-[#FFF7ED] px-1.5 py-0.5 rounded border border-[#FFEDD5]">
                7 Roles
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] pb-1">
              <table className="w-full min-w-[760px] text-xs text-left border-collapse">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap font-semibold">Module</th>
                    {allRoles.map((r) => (
                      <th key={r} className="py-3 px-3 text-center text-xs whitespace-nowrap font-semibold">
                        {r.split('/')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {modules.map((m) => (
                    <tr key={m.name} className="hover:bg-[#F8FAFC]/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#0F172A] whitespace-nowrap">{m.name}</td>
                      {allRoles.map((r) => {
                        const hasAccess = m.roles.includes(r);
                        return (
                          <td key={r} className="py-3 px-3 text-center whitespace-nowrap">
                            {hasAccess ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                                <Check className="w-3 h-3" />
                              </div>
                            ) : (
                              <span className="text-[#CBD5E1] font-mono">—</span>
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

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Resort Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
