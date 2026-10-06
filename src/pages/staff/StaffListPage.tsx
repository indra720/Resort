import React, { useState } from 'react';
import { MOCK_USERS } from '@/data/mockData';
import { User, UserRole } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import {
  Users,
  PlusCircle,
  Briefcase,
  Clock,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export const StaffListPage: React.FC = () => {
  const [staffList, setStaffList] = useState<User[]>(
    MOCK_USERS.filter((u) => u.role !== 'Guest')
  );

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [newRole, setNewRole] = useState<UserRole>('Receptionist');
  const [newShift, setNewShift] = useState('Morning (07:00 - 15:30)');

  const handleAddStaff = () => {
    if (!newName || !newEmail) return;

    const newStaff: User = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      shift: newShift,
      department:
        newRole === 'Restaurant/F&B'
          ? 'Culinary & F&B'
          : newRole === 'Housekeeping'
          ? 'Housekeeping'
          : 'Front Office',
    };

    setStaffList((prev) => [newStaff, ...prev]);
    toast.success('Staff Member Enrolled', `${newName} added to ${newRole}`);
    setIsAddStaffOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Employee Name',
      accessor: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1C1C24] border border-[#2A2A35] flex items-center justify-center font-bold text-xs text-[#FF6B00]">
            {u.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-[#F5F5F7] block">{u.name}</span>
            <span className="text-[11px] text-[#A1A1AA]">{u.email}</span>
          </div>
        </div>
      ),
      sortable: true,
      sortValue: (u) => u.name,
    },
    {
      key: 'role',
      header: 'Role & Permissions',
      accessor: (u) => (
        <span className="text-xs px-2.5 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30 font-medium">
          {u.role}
        </span>
      ),
      sortable: true,
      sortValue: (u) => u.role,
    },
    {
      key: 'department',
      header: 'Department',
      accessor: (u) => <span className="text-xs">{u.department || 'Operations'}</span>,
    },
    {
      key: 'shift',
      header: 'Assigned Shift',
      accessor: (u) => (
        <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
          {u.shift || 'General (09:00 - 18:00)'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Attendance',
      accessor: () => (
        <span className="inline-flex items-center gap-1.5 text-xs text-[#22C55E] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" /> On Duty
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
            Staff Personnel & Shift Rostering
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Resort employee directory, departmental shifts, and role administration.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddStaffOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Enroll Employee
        </Button>
      </div>

      <DataTable
        data={staffList}
        columns={columns}
        keyExtractor={(s) => s.id}
        searchPlaceholder="Search staff by name or role..."
        pageSize={6}
      />

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        title="Enroll New Resort Staff Member"
        description="Assign role, contact details, and operational shift timings"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="ghost" onClick={() => setIsAddStaffOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddStaff}>
              Enroll Staff
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <Input
            label="Full Employee Name"
            placeholder="e.g. Ramesh Kadam"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Staff Email"
              type="email"
              placeholder="e.g. ramesh.k@tajhaveli.in"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+91 98000 11223"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="System Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              options={[
                { label: 'Super Admin', value: 'Super Admin' },
                { label: 'Resort Manager', value: 'Resort Manager' },
                { label: 'Receptionist', value: 'Receptionist' },
                { label: 'Housekeeping', value: 'Housekeeping' },
                { label: 'Restaurant/F&B', value: 'Restaurant/F&B' },
                { label: 'Accountant', value: 'Accountant' },
              ]}
            />

            <Select
              label="Shift Roster"
              value={newShift}
              onChange={(e) => setNewShift(e.target.value)}
              options={[
                { label: 'Morning (07:00 - 15:30)', value: 'Morning (07:00 - 15:30)' },
                { label: 'Evening (15:00 - 23:30)', value: 'Evening (15:00 - 23:30)' },
                { label: 'Night (23:00 - 07:30)', value: 'Night (23:00 - 07:30)' },
                { label: 'General (09:00 - 18:00)', value: 'General (09:00 - 18:00)' },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
