import React, { useState } from 'react';
import { MOCK_ROOMS } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Wrench,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface KanbanTask {
  id: string;
  roomNumber: string;
  category: string;
  status: 'Dirty' | 'InProgress' | 'Clean';
  assignedTo: string;
  notes: string;
}

interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  reportedAt: string;
}

export const HousekeepingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'maintenance'>('kanban');

  // Kanban tasks state
  const [tasks, setTasks] = useState<KanbanTask[]>([
    {
      id: 'tsk-1',
      roomNumber: '102',
      category: 'Deluxe Cottage',
      status: 'Dirty',
      assignedTo: 'Sunita Devi',
      notes: 'Guest checked out at 11:00 AM. Complete linen turnover required.',
    },
    {
      id: 'tsk-2',
      roomNumber: '202',
      category: 'Luxury Suite',
      status: 'InProgress',
      assignedTo: 'Sunita Devi',
      notes: 'Deep cleaning jacuzzi and sanitizing bathroom.',
    },
    {
      id: 'tsk-3',
      roomNumber: '101',
      category: 'Deluxe Cottage',
      status: 'Clean',
      assignedTo: 'Ramesh K',
      notes: 'Passed housekeeping supervisor inspection. Ready for check-in.',
    },
    {
      id: 'tsk-4',
      roomNumber: 'V-01',
      category: 'Pool Villa',
      status: 'Clean',
      assignedTo: 'Housekeeping Team',
      notes: 'Plunge pool water pH balanced & fresh towels set.',
    },
  ]);

  // Maintenance tickets state
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([
    {
      id: 'TCK-201',
      roomNumber: 'V-02',
      issue: 'Private plunge pool heater temperature sensor error.',
      priority: 'High',
      status: 'Open',
      reportedAt: 'Today, 09:30 AM',
    },
    {
      id: 'TCK-202',
      roomNumber: '104',
      issue: 'Balcony sliding door latch needs lubrication.',
      priority: 'Low',
      status: 'In Progress',
      reportedAt: 'Yesterday, 04:15 PM',
    },
  ]);

  // Maintenance ticket modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketRoom, setTicketRoom] = useState('102');
  const [ticketIssue, setTicketIssue] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const moveTask = (taskId: string, targetStatus: 'Dirty' | 'InProgress' | 'Clean') => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );
    toast.success('Task Moved', `Room task updated to ${targetStatus}`);
  };

  const handleCreateTicket = () => {
    if (!ticketIssue) return;
    const newTck: MaintenanceTicket = {
      id: `TCK-${Math.floor(200 + Math.random() * 800)}`,
      roomNumber: ticketRoom,
      issue: ticketIssue,
      priority: ticketPriority,
      status: 'Open',
      reportedAt: 'Just now',
    };
    setTickets((prev) => [newTck, ...prev]);
    toast.success('Maintenance Ticket Created', `Ticket ${newTck.id} dispatched to engineering.`);
    setIsTicketModalOpen(false);
    setTicketIssue('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
            Housekeeping & Maintenance Operations
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Turnover Kanban, room sanitization, and technical repair tickets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsTicketModalOpen(true)}
            leftIcon={<Wrench className="w-4 h-4" />}
          >
            Raise Maintenance Ticket
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A35] gap-4">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'kanban'
              ? 'border-[#CC5500] text-[#FF8A3D]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F5F5F7]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Turnover Kanban Board ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'maintenance'
              ? 'border-[#CC5500] text-[#FF8A3D]'
              : 'border-transparent text-[#A1A1AA] hover:text-[#F5F5F7]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* KANBAN BOARD VIEW (Swipes horizontally on mobile) */}
      {activeTab === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[850px] md:min-w-0 md:grid md:grid-cols-3">
            {/* Column 1: Dirty / Turnover Needed */}
            <div className="flex-1 rounded-2xl bg-[#14141A] border border-[#2A2A35] p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A2A35]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <h3 className="text-sm font-bold text-[#F5F5F7]">Dirty / Turnover</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] font-semibold">
                  {tasks.filter((t) => t.status === 'Dirty').length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {tasks
                  .filter((t) => t.status === 'Dirty')
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-[#1C1C24] border border-[#2A2A35] space-y-2 text-left"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-[#F5F5F7]">
                          Room #{task.roomNumber}
                        </span>
                        <span className="text-[10px] text-[#A1A1AA]">{task.category}</span>
                      </div>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed">{task.notes}</p>
                      <span className="text-[11px] text-[#FF8A3D] block">
                        Assigned: {task.assignedTo}
                      </span>
                      <div className="pt-2 border-t border-[#2A2A35] flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => moveTask(task.id, 'InProgress')}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Start Cleaning
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="flex-1 rounded-2xl bg-[#14141A] border border-[#2A2A35] p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A2A35]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <h3 className="text-sm font-bold text-[#F5F5F7]">In Progress</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] font-semibold">
                  {tasks.filter((t) => t.status === 'InProgress').length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {tasks
                  .filter((t) => t.status === 'InProgress')
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-[#1C1C24] border border-[#2A2A35] space-y-2 text-left"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-[#F5F5F7]">
                          Room #{task.roomNumber}
                        </span>
                        <span className="text-[10px] text-[#A1A1AA]">{task.category}</span>
                      </div>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed">{task.notes}</p>
                      <span className="text-[11px] text-[#F59E0B] block">
                        Cleaning: {task.assignedTo}
                      </span>
                      <div className="pt-2 border-t border-[#2A2A35] flex items-center justify-between gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveTask(task.id, 'Dirty')}
                          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                        >
                          Revert
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => moveTask(task.id, 'Clean')}
                          rightIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Mark Clean
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: Clean & Inspected */}
            <div className="flex-1 rounded-2xl bg-[#14141A] border border-[#2A2A35] p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#2A2A35]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  <h3 className="text-sm font-bold text-[#F5F5F7]">Clean & Inspected</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] font-semibold">
                  {tasks.filter((t) => t.status === 'Clean').length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {tasks
                  .filter((t) => t.status === 'Clean')
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-[#1C1C24] border border-[#2A2A35] space-y-2 text-left"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-[#F5F5F7]">
                          Room #{task.roomNumber}
                        </span>
                        <span className="text-[10px] text-[#22C55E] font-medium">Ready</span>
                      </div>
                      <p className="text-xs text-[#A1A1AA] leading-relaxed">{task.notes}</p>
                      <span className="text-[11px] text-[#22C55E] block">
                        Inspected: {task.assignedTo}
                      </span>
                      <div className="pt-2 border-t border-[#2A2A35] flex justify-start">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveTask(task.id, 'InProgress')}
                          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                        >
                          Re-open
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAINTENANCE TICKETS VIEW */}
      {activeTab === 'maintenance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((tck) => (
            <div
              key={tck.id}
              className="p-5 rounded-2xl bg-[#14141A] border border-[#2A2A35] space-y-3 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#F5F5F7]">{tck.id}</span>
                  <span className="text-xs text-[#FF8A3D] font-semibold block">
                    Room #{tck.roomNumber}
                  </span>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                    tck.priority === 'High'
                      ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                      : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                  }`}
                >
                  {tck.priority} Priority
                </span>
              </div>

              <p className="text-xs text-[#A1A1AA] bg-[#1C1C24] p-3 rounded-xl border border-[#2A2A35]">
                {tck.issue}
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#2A2A35]/50">
                <span className="text-[#A1A1AA]">{tck.reportedAt}</span>
                <span className="font-semibold text-[#3B82F6]">{tck.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Maintenance Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Raise Maintenance Ticket"
        description="Notify engineering and facility maintenance crew"
        maxWidth="md"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
            <Button variant="ghost" fullWidth className="sm:w-auto" onClick={() => setIsTicketModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" fullWidth className="sm:w-auto" onClick={handleCreateTicket}>
              Dispatch Ticket
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Room / Villa Unit"
              value={ticketRoom}
              onChange={(e) => setTicketRoom(e.target.value)}
              options={MOCK_ROOMS.map((r) => ({
                label: `Room #${r.roomNumber} (${r.category})`,
                value: r.roomNumber,
              }))}
            />

            <Select
              label="Urgency Priority"
              value={ticketPriority}
              onChange={(e) => setTicketPriority(e.target.value as 'High' | 'Medium' | 'Low')}
              options={[
                { label: 'High (Guest inconvenience)', value: 'High' },
                { label: 'Medium (Minor repair)', value: 'Medium' },
                { label: 'Low (Scheduled preventative)', value: 'Low' },
              ]}
            />
          </div>

          <Input
            label="Detailed Issue Description"
            placeholder="e.g. Jacuzzi water heater trip switch failing"
            value={ticketIssue}
            onChange={(e) => setTicketIssue(e.target.value)}
            helperText="State specific technical observations"
            required
          />
        </div>
      </Modal>
    </div>
  );
};
