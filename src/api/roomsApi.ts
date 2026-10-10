import { Room } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';
import { checkResortLimits } from './plansApi';

export interface RoomRecord extends Room {
  resortId: string;
}

export function getRooms(resortId?: string, isSuperAdmin = false): RoomRecord[] {
  const rooms = getDbItem<RoomRecord[]>(DB_KEYS.ROOMS, []);
  if (isSuperAdmin && !resortId) {
    return rooms;
  }
  return rooms.filter((r) => r.resortId === (resortId || 'resort-1'));
}

export function addRoom(
  room: Omit<Room, 'id'>,
  resortId: string
): { success: boolean; data?: RoomRecord; error?: string } {
  const limits = checkResortLimits(resortId);
  if (limits.isRoomLimitReached) {
    return {
      success: false,
      error: `Room limit reached (${limits.roomsUsed}/${limits.roomLimit} villas on ${limits.plan} plan). Please upgrade your subscription.`,
    };
  }

  const rooms = getDbItem<RoomRecord[]>(DB_KEYS.ROOMS, []);
  const newRoom: RoomRecord = {
    ...room,
    id: `rm-${Date.now()}`,
    resortId,
  };

  setDbItem(DB_KEYS.ROOMS, [newRoom, ...rooms]);
  return { success: true, data: newRoom };
}

export function updateRoom(room: RoomRecord): boolean {
  const rooms = getDbItem<RoomRecord[]>(DB_KEYS.ROOMS, []);
  const idx = rooms.findIndex((r) => r.id === room.id);
  if (idx === -1) return false;

  rooms[idx] = room;
  setDbItem(DB_KEYS.ROOMS, rooms);
  return true;
}

export function deleteRoom(roomId: string): boolean {
  const rooms = getDbItem<RoomRecord[]>(DB_KEYS.ROOMS, []);
  const filtered = rooms.filter((r) => r.id !== roomId);
  setDbItem(DB_KEYS.ROOMS, filtered);
  return true;
}

export function setRoomStatus(roomId: string, status: Room['status']): boolean {
  const rooms = getDbItem<RoomRecord[]>(DB_KEYS.ROOMS, []);
  const idx = rooms.findIndex((r) => r.id === roomId);
  if (idx === -1) return false;

  rooms[idx] = { ...rooms[idx], status };
  setDbItem(DB_KEYS.ROOMS, rooms);
  return true;
}

export function setRoomStatusByNumber(
  roomNumber: string,
  status: Room['status'],
  resortId?: string
): boolean {
  const rooms = getDbItem<RoomRecord[]>(DB_KEYS.ROOMS, []);
  const idx = rooms.findIndex(
    (r) => (r.roomNumber === roomNumber || (r as any).number === roomNumber) && (!resortId || r.resortId === resortId)
  );
  if (idx === -1) return false;

  rooms[idx] = { ...rooms[idx], status };
  setDbItem(DB_KEYS.ROOMS, rooms);
  return true;
}
