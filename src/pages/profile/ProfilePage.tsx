import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { toast } from '@/store/useToastStore';
import { User, Shield, Mail, Phone, Clock, Save, Lock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, role } = useAuthStore();

  const [name, setName] = useState(user?.name || 'Vikram Malhotra');
  const [email, setEmail] = useState(user?.email || 'vikram.m@tajhaveli.in');
  const [phone, setPhone] = useState(user?.phone || '+91 98201 12345');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile Saved', 'Your user details have been updated.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    toast.success('Password Changed', 'Security credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="w-full space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
          My Profile & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Manage your resort employee credentials, assigned shift, and contact preferences.
        </p>
      </div>

      {/* User Header Summary Card */}
      <div className="p-6 rounded-2xl bg-[#14141A] border border-[#2A2A35] flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <div className="w-16 h-16 rounded-full bg-[#1C1C24] border-2 border-[#CC5500] flex items-center justify-center font-bold text-xl text-[#FF8A3D] shrink-0">
          {name.slice(0, 2).toUpperCase()}
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-lg font-bold text-[#F5F5F7]">{name}</h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#CC5500]/18 text-[#FF8A3D] text-xs font-semibold border border-[#CC5500]/30 w-fit mx-auto sm:mx-0">
              <Shield className="w-3.5 h-3.5" /> {role}
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA]">{email}</p>
          <p className="text-xs text-[#A1A1AA]">
            Department: {user?.department || 'Executive Resort Operations'} • {user?.shift || 'Full-Time Shift'}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />
              <Input
                label="Emergency Contact"
                defaultValue="+91 98200 99887"
                helperText="Primary next-of-kin contact"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Details
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Credentials */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="outline"
              >
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
