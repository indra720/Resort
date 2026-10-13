import React, { useState, useEffect } from "react";
import {
  getHousekeepingTasks,
  updateHousekeepingTaskStatus,
  HousekeepingTask,
} from "@/api/housekeepingApi";
import { MOCK_ROOMS } from "@/data/mockData";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "@/store/useToastStore";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Wrench,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  issue: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  reportedAt: string;
}

export const HousekeepingPage: React.FC = () => {
  const { currentResort, role } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"kanban" | "maintenance">(
    "kanban",
  );

  // Kanban tasks state
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);

  const loadTasks = () => {
    const isSuperAdmin = role === "Super Admin";
    const list = getHousekeepingTasks(currentResort.id, isSuperAdmin);
    setTasks(list);
  };

  useEffect(() => {
    loadTasks();
  }, [currentResort.id, role]);

  // Maintenance tickets state
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([
    {
      id: "TCK-201",
      roomNumber: "V-02",
      issue: "Private plunge pool heater temperature sensor error.",
      priority: "High",
      status: "Open",
      reportedAt: "Today, 09:30 AM",
    },
    {
      id: "TCK-202",
      roomNumber: "104",
      issue: "Balcony sliding door latch needs lubrication.",
      priority: "Low",
      status: "In Progress",
      reportedAt: "Yesterday, 04:15 PM",
    },
  ]);

  // Maintenance ticket modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketRoom, setTicketRoom] = useState("102");
  const [ticketIssue, setTicketIssue] = useState("");
  const [ticketPriority, setTicketPriority] = useState<
    "High" | "Medium" | "Low"
  >("Medium");

  const moveTask = (
    taskId: string,
    targetStatus: "Dirty" | "InProgress" | "Clean",
  ) => {
    updateHousekeepingTaskStatus(taskId, targetStatus);
    loadTasks();
    if (targetStatus === "Clean") {
      toast.success(
        "Room Sanitized & Inspected",
        "Room marked Clean. Status synchronized to Available on Front Desk!",
      );
    } else {
      toast.info("Housekeeping Stage Updated", `Room moved to ${targetStatus}`);
    }
  };

  const handleCreateTicket = () => {
    if (!ticketIssue) return;
    const newTck: MaintenanceTicket = {
      id: `TCK-${Math.floor(200 + Math.random() * 800)}`,
      roomNumber: ticketRoom,
      issue: ticketIssue,
      priority: ticketPriority,
      status: "Open",
      reportedAt: "Just now",
    };
    setTickets((prev) => [newTck, ...prev]);
    toast.success(
      "Maintenance Ticket Created",
      `Ticket ${newTck.id} dispatched to engineering.`,
    );
    setIsTicketModalOpen(false);
    setTicketIssue("");
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132]">
            Housekeeping & Maintenance Operations
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
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
      <div className="flex flex-col md:flex-row items-center border-b border-[#E5E7EB] gap-4">
        <button
          onClick={() => setActiveTab("kanban")}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "kanban"
              ? "border-[#0F5132] text-[#0F5132]"
              : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Turnover Kanban Board ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("maintenance")}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "maintenance"
              ? "border-[#0F5132] text-[#0F5132]"
              : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Maintenance Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* KANBAN BOARD VIEW (Swipes horizontally on mobile) */}
      {activeTab === "kanban" && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[850px] md:min-w-0 md:grid md:grid-cols-3">
            {/* Column 1: Dirty / Turnover Needed */}
            <div className="flex-1 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <div className="flex  items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <h3 className="text-sm font-bold text-[#1F2937]">
                    Dirty / Turnover
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  {tasks.filter((t) => t.status === "Dirty").length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {tasks
                  .filter((t) => t.status === "Dirty")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-[#0F5132]/30 transition-all overflow-hidden text-left"
                    >
                      {/* Card Header Banner */}
                      <div className="bg-gradient-to-r from-rose-50/70 via-slate-50/50 to-white px-3.5 py-2.5 border-b border-[#F1F5F9] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span className="font-extrabold text-sm text-[#0F172A]">
                            Room #{task.roomNumber}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[#64748B] shadow-2xs">
                          {task.category}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2.5">
                        <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
                          {task.notes}
                        </p>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#64748B] font-medium">Assigned:</span>
                          <span className="font-bold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {task.assignedTo}
                          </span>
                        </div>
                      </div>

                      <div className="px-3.5 py-2.5 bg-[#F8FAFC]/90 border-t border-[#F1F5F9] flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => moveTask(task.id, "InProgress")}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          className="w-full sm:w-auto"
                        >
                          Start Cleaning
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: In Progress */}
            <div className="flex-1 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <div className="flex  items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <h3 className="text-sm font-bold text-[#1F2937]">
                    In Progress
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                  {tasks.filter((t) => t.status === "InProgress").length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {tasks
                  .filter((t) => t.status === "InProgress")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-[#0F5132]/30 transition-all overflow-hidden text-left"
                    >
                      {/* Card Header Banner */}
                      <div className="bg-gradient-to-r from-amber-50/70 via-slate-50/50 to-white px-3.5 py-2.5 border-b border-[#F1F5F9] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="font-extrabold text-sm text-[#0F172A]">
                            Room #{task.roomNumber}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[#64748B] shadow-2xs">
                          {task.category}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2.5">
                        <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
                          {task.notes}
                        </p>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#64748B] font-medium">Cleaning:</span>
                          <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            {task.assignedTo}
                          </span>
                        </div>
                      </div>

                      <div className="px-3.5 py-2.5 bg-[#F8FAFC]/90 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveTask(task.id, "Dirty")}
                          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                        >
                          Revert
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => moveTask(task.id, "Clean")}
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
            <div className="flex-1 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <div className="flex  items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  <h3 className="text-sm font-bold text-[#1F2937]">
                    Clean & Inspected
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  {tasks.filter((t) => t.status === "Clean").length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {tasks
                  .filter((t) => t.status === "Clean")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-[#0F5132]/30 transition-all overflow-hidden text-left"
                    >
                      {/* Card Header Banner */}
                      <div className="bg-gradient-to-r from-emerald-50/70 via-slate-50/50 to-white px-3.5 py-2.5 border-b border-[#F1F5F9] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" />
                          <span className="font-extrabold text-sm text-[#0F172A]">
                            Room #{task.roomNumber}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
                          Ready
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2.5">
                        <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
                          {task.notes}
                        </p>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#64748B] font-medium">Inspected:</span>
                          <span className="font-bold text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {task.assignedTo}
                          </span>
                        </div>
                      </div>

                      <div className="px-3.5 py-2.5 bg-[#F8FAFC]/90 border-t border-[#F1F5F9] flex justify-start">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveTask(task.id, "InProgress")}
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
      {activeTab === "maintenance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((tck) => (
            <div
              key={tck.id}
              className="rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all overflow-hidden text-left"
            >
              <div className="bg-gradient-to-r from-slate-50 via-emerald-50/20 to-white px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#0F172A]">{tck.id}</span>
                    <span className="text-xs font-bold text-[#0F5132] bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                      Room #{tck.roomNumber}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    tck.priority === "High"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {tck.priority} Priority
                </span>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-[#1E293B] bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {tck.issue}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-[#64748B] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {tck.reportedAt}
                  </span>
                  <span className="font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {tck.status}
                  </span>
                </div>
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
            <Button
              variant="ghost"
              fullWidth
              className="sm:w-auto"
              onClick={() => setIsTicketModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              className="sm:w-auto"
              onClick={handleCreateTicket}
            >
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
              onChange={(e) =>
                setTicketPriority(e.target.value as "High" | "Medium" | "Low")
              }
              options={[
                { label: "High (Guest inconvenience)", value: "High" },
                { label: "Medium (Minor repair)", value: "Medium" },
                { label: "Low (Scheduled preventative)", value: "Low" },
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
