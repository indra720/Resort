import { getDbItem, setDbItem, DB_KEYS } from './db';
import { setRoomStatusByNumber } from './roomsApi';

export interface HousekeepingTask {
  id: string;
  resortId: string;
  roomNumber: string;
  category: string;
  status: 'Dirty' | 'InProgress' | 'Clean';
  assignedTo: string;
  notes: string;
  updatedAt: string;
}

const INITIAL_HOUSEKEEPING_TASKS: HousekeepingTask[] = [
  {
    id: 'tsk-1',
    resortId: 'resort-1',
    roomNumber: '102',
    category: 'Deluxe Cottage',
    status: 'Dirty',
    assignedTo: 'Sunita Devi',
    notes: 'Guest checked out at 11:00 AM. Complete linen turnover required.',
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'tsk-2',
    resortId: 'resort-1',
    roomNumber: '202',
    category: 'Luxury Suite',
    status: 'InProgress',
    assignedTo: 'Sunita Devi',
    notes: 'Deep cleaning jacuzzi and sanitizing bathroom.',
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'tsk-3',
    resortId: 'resort-1',
    roomNumber: '101',
    category: 'Deluxe Cottage',
    status: 'Clean',
    assignedTo: 'Ramesh K',
    notes: 'Passed housekeeping supervisor inspection. Ready for check-in.',
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  },
  {
    id: 'tsk-4',
    resortId: 'resort-1',
    roomNumber: 'V-01',
    category: 'Pool Villa',
    status: 'Clean',
    assignedTo: 'Housekeeping Team',
    notes: 'Plunge pool water pH balanced & fresh towels set.',
    updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  },
];

export function getHousekeepingTasks(resortId?: string, isSuperAdmin = false): HousekeepingTask[] {
  let tasks = getDbItem<HousekeepingTask[]>(DB_KEYS.HOUSEKEEPING_TASKS, []);
  if (!tasks || tasks.length === 0) {
    tasks = INITIAL_HOUSEKEEPING_TASKS;
    setDbItem(DB_KEYS.HOUSEKEEPING_TASKS, tasks);
  }

  if (isSuperAdmin && !resortId) {
    return tasks;
  }
  return tasks.filter((t) => !t.resortId || t.resortId === (resortId || 'resort-1'));
}

/**
 * Triggered automatically when Front Desk processes check-out.
 * Automatically marks room Dirty and places in Housekeeping queue.
 */
export function createTaskOnCheckOut(
  roomNumber: string,
  resortId: string,
  category = 'Villa / Room',
  guestName = 'Guest'
): HousekeepingTask {
  const tasks = getDbItem<HousekeepingTask[]>(DB_KEYS.HOUSEKEEPING_TASKS, INITIAL_HOUSEKEEPING_TASKS);
  
  // Also set room status to Dirty in rooms DB
  setRoomStatusByNumber(roomNumber, 'Dirty', resortId);

  // Check if existing task for this room is already pending
  const existingIdx = tasks.findIndex(
    (t) => t.roomNumber === roomNumber && t.resortId === resortId
  );

  const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (existingIdx !== -1) {
    tasks[existingIdx] = {
      ...tasks[existingIdx],
      status: 'Dirty',
      notes: `Guest ${guestName} checked out. Turnover & sanitization dispatched.`,
      updatedAt: timestamp,
    };
    setDbItem(DB_KEYS.HOUSEKEEPING_TASKS, tasks);
    return tasks[existingIdx];
  }

  const newTask: HousekeepingTask = {
    id: `tsk-${Date.now()}`,
    resortId,
    roomNumber,
    category,
    status: 'Dirty',
    assignedTo: 'Housekeeping Duty Crew',
    notes: `Guest ${guestName} checked out. Full linen change & disinfection required.`,
    updatedAt: timestamp,
  };

  const updatedTasks = [newTask, ...tasks];
  setDbItem(DB_KEYS.HOUSEKEEPING_TASKS, updatedTasks);
  return newTask;
}

/**
 * Updates task state in Kanban and synchronizes room status:
 * - 'Dirty': Room status is 'Dirty'
 * - 'InProgress': Room status is 'Cleaning'
 * - 'Clean': Room status reverts to 'Available' for Front Desk to book/check-in!
 */
export function updateHousekeepingTaskStatus(
  taskId: string,
  newStatus: 'Dirty' | 'InProgress' | 'Clean',
  assignedTo?: string
): boolean {
  const tasks = getDbItem<HousekeepingTask[]>(DB_KEYS.HOUSEKEEPING_TASKS, INITIAL_HOUSEKEEPING_TASKS);
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return false;

  const task = tasks[idx];
  task.status = newStatus;
  task.updatedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (assignedTo) task.assignedTo = assignedTo;

  tasks[idx] = task;
  setDbItem(DB_KEYS.HOUSEKEEPING_TASKS, tasks);

  // Sync back to Rooms table
  const mappedRoomStatus =
    newStatus === 'Clean'
      ? 'Available'
      : newStatus === 'InProgress'
      ? 'Cleaning'
      : 'Dirty';

  setRoomStatusByNumber(task.roomNumber, mappedRoomStatus, task.resortId);
  return true;
}
