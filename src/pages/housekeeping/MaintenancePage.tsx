import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import {
  Wrench,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  User,
  Sparkles,
} from 'lucide-react';

export interface MaintenanceTicket {
  id: string;
  roomOrArea: string;
  category: 'Air Conditioning' | 'Plumbing & Water' | 'Plunge Pool Filter' | 'Electrical' | 'Keycard Lock' | 'Carpentry';
  issue: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  technician: string;
  reportedAt: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'TCK-301',
    roomOrArea: 'Pool Villa V-02',
    category: 'Plunge Pool Filter',
    issue: 'Temperature sensor malfunctioning; pool heater not kicking on.',
    priority: 'Critical',
    technician: 'Suresh Kumar (Chief Engineer)',
    reportedAt: 'Today, 09:30 AM',
    status: 'In Progress',
  },
  {
    id: 'TCK-302',
    roomOrArea: 'Room #104',
    category: 'Air Conditioning',
    issue: 'Daikin VRV indoor unit making rattling noise on medium fan speed.',
    priority: 'High',
    technician: 'Ramesh Sharma (HVAC Tech)',
    reportedAt: 'Today, 10:15 AM',
    status: 'Open',
  },
  {
    id: 'TCK-303',
    roomOrArea: 'Room #202',
    category: 'Plumbing & Water',
    issue: 'Jacuzzi jet pressure low. Needs impeller descaling.',
    priority: 'Medium',
    technician: 'Suresh Kumar (Chief Engineer)',
    reportedAt: 'Yesterday, 04:15 PM',
    status: 'Open',
  },
  {
    id: 'TCK-304',
    roomOrArea: 'Dining Beachside Deck',
    category: 'Electrical',
    issue: 'Outdoor string fairy light transformer tripped after rain.',
    priority: 'Low',
    technician: 'Gopal Patil (Electrician)',
    reportedAt: 'Yesterday, 02:00 PM',
    status: 'Resolved',
  },
];

export const MaintenancePage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [roomOrArea, setRoomOrArea] = useState('Room #105');
  const [category, setCategory] = useState<MaintenanceTicket['category']>('Air Conditioning');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('High');
  const [issue, setIssue] = useState('');
  const [technician, setTechnician] = useState('Suresh Kumar (Chief Engineer)');

  const filtered = tickets.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    return true;
  });

  const openTickets = tickets.filter((t) => t.status === 'Open').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'In Progress').length;
  const criticalTickets = tickets.filter((t) => t.priority === 'Critical' && t.status !== 'Resolved').length;

  const handleStatusChange = (id: string, status: MaintenanceTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    toast.success('Ticket Updated', `Status changed to ${status}`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue) return;

    const newTck: MaintenanceTicket = {
      id: `TCK-${Math.floor(305 + Math.random() * 90)}`,
      roomOrArea,
      category,
      issue,
      priority,
      technician,
      reportedAt: 'Just now',
      status: 'Open',
    };

    setTickets([newTck, ...tickets]);
    setIsAddOpen(false);
    toast.success('Ticket Logged', `${newTck.id} dispatched to ${technician}`);
    setIssue('');
  };

  const columns: Column<MaintenanceTicket>[] = [
    {
      key: 'id',
      header: 'Ticket ID & Time',
      accessor: (t) => (
        <div>
          <span className="font-bold text-[#0F172A] block">{t.id}</span>
          <span className="text-[11px] text-[#64748B]">{t.reportedAt}</span>
        </div>
      ),
      sortable: true,
      sortValue: (t) => t.id,
    },
    {
      key: 'roomOrArea',
      header: 'Location & Trade',
      accessor: (t) => (
        <div>
          <span className="font-semibold text-slate-800 block">{t.roomOrArea}</span>
          <span className="text-[11px] text-[#0F5132] font-semibold">{t.category}</span>
        </div>
      ),
      sortable: true,
      sortValue: (t) => t.roomOrArea,
    },
    {
      key: 'issue',
      header: 'Reported Technical Issue',
      accessor: (t) => (
        <span className="text-xs text-slate-700 leading-relaxed block max-w-sm">
          {t.issue}
        </span>
      ),
    },
    {
      key: 'priority',
      header: 'Severity',
      accessor: (t) => {
        const color =
          t.priority === 'Critical'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : t.priority === 'High'
            ? 'bg-orange-50 text-orange-800 border-orange-200'
            : 'bg-slate-100 text-slate-700 border-slate-200';
        return (
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${color}`}>
            {t.priority}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Work Status',
      accessor: (t) => {
        const color =
          t.status === 'Resolved'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : t.status === 'In Progress'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-rose-50 text-rose-800 border-rose-200';
        return (
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${color}`}>
            {t.status}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Resolution Action',
      accessor: (t) => (
        <div className="flex items-center gap-1.5 justify-end">
          {t.status === 'Open' && (
            <button
              type="button"
              onClick={() => handleStatusChange(t.id, 'In Progress')}
              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold"
            >
              Start Work
            </button>
          )}
          {t.status === 'In Progress' && (
            <button
              type="button"
              onClick={() => handleStatusChange(t.id, 'Resolved')}
              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold"
            >
              Mark Resolved
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <Wrench className="w-6 h-6 text-[#0F5132]" />
              <span>Engineering & Facility Maintenance Desk</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            AC cooling, plunge pool filtration, plumbing repairs, and electrical fault tracking.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Raise Maintenance Ticket
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-rose-600">Critical Outages</p>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-700 mt-1">{criticalTickets}</p>
          <span className="text-[10px] text-rose-600 font-medium">Guest impacting</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-amber-600">Open Tickets</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">{openTickets}</p>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting assignment</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-blue-600">In Progress Work</p>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">{inProgressTickets}</p>
          <span className="text-[10px] text-blue-600 font-medium">Technicians on-site</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-emerald-600">Resolved Today</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F5132] mt-1">
            {tickets.filter((t) => t.status === 'Resolved').length}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">94% within 2-hour SLA</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5 pb-1">
        {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === st
                ? 'bg-[#0F5132] text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            {st} ({st === 'All' ? tickets.length : tickets.filter((t) => t.status === st).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={filtered}
        columns={columns}
        keyExtractor={(t) => t.id}
        searchPlaceholder="Search tickets by room, category, or technician..."
        pageSize={6}
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Raise Technical Maintenance Ticket"
        description="Dispatch engineering technicians for HVAC, plumbing, or plunge pool repair"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Room / Facility Location"
              placeholder="e.g. Pool Villa V-01"
              value={roomOrArea}
              onChange={(e) => setRoomOrArea(e.target.value)}
              required
            />
            <Select
              label="Engineering Trade"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { label: 'Air Conditioning (VRV / Split)', value: 'Air Conditioning' },
                { label: 'Plumbing & Hot Water Geyser', value: 'Plumbing & Water' },
                { label: 'Plunge Pool Filter & Heater', value: 'Plunge Pool Filter' },
                { label: 'Electrical & Power Supply', value: 'Electrical' },
                { label: 'RFID Door Keycard Lock', value: 'Keycard Lock' },
                { label: 'Carpentry & Furniture', value: 'Carpentry' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Severity Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { label: 'Critical (Occupied Villa Down)', value: 'Critical' },
                { label: 'High (Guest Inconvenience)', value: 'High' },
                { label: 'Medium (Routine Fix)', value: 'Medium' },
                { label: 'Low (Cosmetic / Hardware)', value: 'Low' },
              ]}
            />
            <Select
              label="Assign Technician"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              options={[
                { label: 'Suresh Kumar (Chief Engineer)', value: 'Suresh Kumar (Chief Engineer)' },
                { label: 'Ramesh Sharma (HVAC Specialist)', value: 'Ramesh Sharma (HVAC Tech)' },
                { label: 'Gopal Patil (Electrician)', value: 'Gopal Patil (Electrician)' },
                { label: 'On-Duty Maintenance Assistant', value: 'Duty Maintenance Tech' },
              ]}
            />
          </div>

          <div>
            <label className="font-semibold text-xs text-[#334155] block mb-1">
              Issue Diagnosis & Symptoms
            </label>
            <textarea
              rows={3}
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. AC unit leaking condensate water onto wooden floor. Filter clean, needs drain line flush."
              className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<Sparkles className="w-4 h-4" />}>
              Dispatch Ticket to Engineering
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
