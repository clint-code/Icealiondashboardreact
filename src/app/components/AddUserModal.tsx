import { useState } from 'react';
import { X } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: NewUser) => void;
}

export interface NewUser {
  name: string;
  email: string;
  role: 'super_admin' | 'general_insurance' | 'asset_management';
  division: string;
  status: 'active' | 'inactive';
}

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [formData, setFormData] = useState<NewUser>({
    name: '',
    email: '',
    role: 'general_insurance',
    division: 'General Insurance',
    status: 'active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof NewUser, string>>>({});

  if (!isOpen) return null;

  const handleRoleChange = (role: 'super_admin' | 'general_insurance' | 'asset_management') => {
    let division = '';
    switch (role) {
      case 'super_admin':
        division = 'All Divisions';
        break;
      case 'general_insurance':
        division = 'General Insurance';
        break;
      case 'asset_management':
        division = 'Asset Management';
        break;
    }
    setFormData({ ...formData, role, division });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NewUser, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddUser(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'general_insurance',
        division: 'General Insurance',
        status: 'active',
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'general_insurance',
      division: 'General Insurance',
      status: 'active',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Add New User</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className={`w-full h-10 px-4 rounded-lg border ${
                errors.name ? 'border-destructive' : 'border-input'
              } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@icealion.co.ke"
              className={`w-full h-10 px-4 rounded-lg border ${
                errors.email ? 'border-destructive' : 'border-input'
              } bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring`}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleRoleChange(e.target.value as 'super_admin' | 'general_insurance' | 'asset_management')}
              className="w-full h-10 px-3 pr-8 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
            >
              <option value="general_insurance">General Insurance</option>
              <option value="asset_management">Asset Management</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {/* Division Field (Auto-populated based on role) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Division
            </label>
            <input
              type="text"
              value={formData.division}
              disabled
              className="w-full h-10 px-4 rounded-lg border border-input bg-muted text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Division is automatically assigned based on role
            </p>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full h-10 px-3 pr-8 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-input rounded-lg hover:bg-accent transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md text-sm font-medium"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
