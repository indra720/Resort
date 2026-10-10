import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Room } from '@/types';
import { toast } from '@/store/useToastStore';

// Zod Schema for Room Form Validation
const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  category: z.enum(['Deluxe Cottage', 'Pool Villa', 'Luxury Suite', 'Heritage Room'], {
    required_error: 'Select a valid category',
  }),
  floor: z.coerce.number().min(1, 'Floor must be at least 1'),
  ratePerNight: z.coerce.number().min(1000, 'Minimum tariff is ₹1,000'),
  maxGuests: z.coerce.number().min(1).max(10, 'Max 10 guests allowed'),
  status: z.enum([
    'Available',
    'Occupied',
    'Reserved',
    'Dirty',
    'Cleaning',
    'Clean',
    'Maintenance',
    'Paid',
    'Pending',
    'Cancelled',
  ]),
});

type RoomFormData = z.infer<typeof roomSchema>;

export interface AddEditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Partial<Room>) => void;
  initialRoom?: Room | null;
}

export const AddEditRoomModal: React.FC<AddEditRoomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRoom,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: initialRoom
      ? {
          roomNumber: initialRoom.roomNumber,
          category: initialRoom.category,
          floor: initialRoom.floor,
          ratePerNight: initialRoom.ratePerNight,
          maxGuests: initialRoom.maxGuests,
          status: initialRoom.status,
        }
      : {
          roomNumber: '',
          category: 'Deluxe Cottage',
          floor: 1,
          ratePerNight: 5500,
          maxGuests: 2,
          status: 'Available',
        },
  });

  const onSubmit = (data: RoomFormData) => {
    const amenities = initialRoom?.amenities || ['Garden View', 'King Bed', 'Rain Shower', 'Wi-Fi'];
    onSave({
      ...data,
      id: initialRoom?.id || `rm-${Date.now()}`,
      amenities,
    });
    toast.success('Room Saved', `Room #${data.roomNumber} updated successfully!`);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialRoom ? `Edit Room #${initialRoom.roomNumber}` : 'Add New Resort Room'}
      description="Configure tariff rates in Indian Rupees (₹), category, and inventory status."
      maxWidth="lg"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
          <Button variant="ghost" fullWidth className="sm:w-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            fullWidth
            className="sm:w-auto"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            {initialRoom ? 'Save Changes' : 'Create Room'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Room / Villa Identifier"
            placeholder="e.g. 105 or V-03"
            {...register('roomNumber')}
            error={errors.roomNumber?.message}
          />

          <Select
            label="Room Category"
            {...register('category')}
            error={errors.category?.message}
            options={[
              { label: 'Deluxe Cottage', value: 'Deluxe Cottage' },
              { label: 'Luxury Suite', value: 'Luxury Suite' },
              { label: 'Pool Villa', value: 'Pool Villa' },
              { label: 'Heritage Room', value: 'Heritage Room' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Rate / Night (₹)"
            type="number"
            placeholder="e.g. 7500"
            {...register('ratePerNight')}
            error={errors.ratePerNight?.message}
            helperText="Excl. 12%/18% GST"
          />

          <Input
            label="Floor Level"
            type="number"
            placeholder="1"
            {...register('floor')}
            error={errors.floor?.message}
          />

          <Input
            label="Maximum Guests"
            type="number"
            placeholder="2"
            {...register('maxGuests')}
            error={errors.maxGuests?.message}
          />
        </div>

        <Select
          label="Initial Status"
          {...register('status')}
          error={errors.status?.message}
          options={[
            { label: 'Available', value: 'Available' },
            { label: 'Occupied', value: 'Occupied' },
            { label: 'Reserved', value: 'Reserved' },
            { label: 'Cleaning', value: 'Cleaning' },
            { label: 'Maintenance', value: 'Maintenance' },
          ]}
        />
      </form>
    </Modal>
  );
};
