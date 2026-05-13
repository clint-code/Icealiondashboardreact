import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Shield, ChevronLeft, ChevronRight, MoreVertical, Key } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { AddUserModal, NewUser } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Toast } from './Toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'general_insurance' | 'asset_management';
  division: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

export function UsersManagement() {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);
  const [selectedUserForPasswordReset, setSelectedUserForPasswordReset] = useState<User | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<User[]>([
    {
      id: 'U001',
      name: 'John Kamau',
      email: 'john.kamau@icealion.co.ke',
      role: 'super_admin',
      division: 'All Divisions',
      status: 'active',
      lastActive: '2 mins ago',
    },
    {
      id: 'U002',
      name: 'Mary Wanjiru',
      email: 'mary.wanjiru@icealion.co.ke',
      role: 'general_insurance',
      division: 'General Insurance',
      status: 'active',
      lastActive: '1 hour ago',
    },
    {
      id: 'U003',
      name: 'Peter Ochieng',
      email: 'peter.ochieng@icealion.co.ke',
      role: 'asset_management',
      division: 'Asset Management',
      status: 'active',
      lastActive: '3 hours ago',
    },
    {
      id: 'U004',
      name: 'Grace Akinyi',
      email: 'grace.akinyi@icealion.co.ke',
      role: 'general_insurance',
      division: 'General Insurance',
      status: 'inactive',
      lastActive: '2 days ago',
    },
  ]);

  const handleAddUser = (newUser: NewUser) => {
    // Generate new user ID
    const newUserId = `U${String(users.length + 1).padStart(3, '0')}`;

    const userToAdd: User = {
      id: newUserId,
      ...newUser,
      lastActive: 'Just now',
    };

    setUsers([userToAdd, ...users]);

    // Show success notification
    setToastMessage(`User ${newUser.name} added successfully`);
    setToastType('success');
    setShowToast(true);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));

    // Show success notification
    setToastMessage(`User ${updatedUser.name} updated successfully`);
    setToastType('success');
    setShowToast(true);
  };

  const handleDeleteUser = () => {
    if (selectedUserForDelete) {
      setUsers(users.filter(user => user.id !== selectedUserForDelete.id));

      // Show success notification
      setToastMessage(`User ${selectedUserForDelete.name} deleted successfully`);
      setToastType('success');
      setShowToast(true);

      setSelectedUserForDelete(null);
    }
  };

  const handleResetPassword = async (user: User) => {
    // In production, this would send password reset request to API
    // Example API call:
    // const response = await fetch('/api/users/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: user.email })
    // });
    // const data = await response.json();
    // const resetToken = data.resetToken;

    // Generate a demo reset token
    const resetToken = `RST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In production, this would send an email with a reset link like:
    // https://your-app.com/reset-password?token=${resetToken}
    console.log('Password reset link:', `${window.location.origin}/reset-password?token=${resetToken}`);
    console.log('Sending reset email to:', user.email);

    // For demo purposes, show the reset token in console
    // The email would contain a link that the user clicks to access the ResetPasswordPage

    setToastMessage(`Password reset email sent to ${user.email}. Check console for demo reset link.`);
    setToastType('success');
    setShowToast(true);
    setSelectedUserForPasswordReset(null);
    setOpenDropdownId(null);
  };

  const toggleDropdown = (userId: string) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openEditModal = (user: User) => {
    setSelectedUserForEdit(user);
    setIsEditUserModalOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUserForDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-700';
      case 'general_insurance':
        return 'bg-blue-100 text-blue-700';
      case 'asset_management':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'general_insurance':
        return 'General Insurance';
      case 'asset_management':
        return 'Asset Management';
      default:
        return role;
    }
  };

  // Apply filters
  let filteredUsers = users;

  // Search filter
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Status filter
  if (statusFilter !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }

  // Role filter
  if (roleFilter) {
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(user => user.id)));
    }
  };

  const toggleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  const isAllSelected = paginatedUsers.length > 0 && selectedUsers.size === paginatedUsers.length;
  const isSomeSelected = selectedUsers.size > 0 && selectedUsers.size < paginatedUsers.length;

  // Prepare data for export
  const dataToExport = selectedUsers.size > 0
    ? filteredUsers.filter(user => selectedUsers.has(user.id))
    : filteredUsers;

  const exportData = dataToExport.map(user => ({
    'ID': user.id,
    'Name': user.name,
    'Email': user.email,
    'Role': getRoleLabel(user.role),
    'Division': user.division,
    'Status': user.status,
    'Last Active': user.lastActive,
  }));

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
    setSelectedUsers(new Set());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage user access and permissions across divisions
        </p>
      </div>

      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
                  placeholder="Search users by name, email, or ID..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="relative min-w-[180px]">
                <select
                  value={roleFilter}
                  onChange={(e) => handleFilterChange(() => setRoleFilter(e.target.value))}
                  className="w-full h-10 px-3 pr-8 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="general_insurance">General Insurance</option>
                  <option value="asset_management">Asset Management</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative min-w-[140px]">
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(() => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive'))}
                  className="w-full h-10 px-3 pr-8 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedUsers.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  {selectedUsers.size} selected
                </span>
              )}
              <ExportButton
                data={exportData}
                filename={`users-${new Date().toISOString().split('T')[0]}`}
                variant="secondary"
              />
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#AFCB09] text-[#1a202c] rounded-lg hover:bg-[#9bb908] transition-colors shadow-md font-medium"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Active: {filteredUsers.filter(u => u.status === 'active').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded-full"></div>
              <span className="text-sm text-muted-foreground">Inactive: {filteredUsers.filter(u => u.status === 'inactive').length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-input cursor-pointer"
                  />
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Division
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Active
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-4 h-4 rounded border-input cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role === 'super_admin' && <Shield className="w-3 h-3" />}
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user.division}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative" ref={openDropdownId === user.id ? dropdownRef : null}>
                      <button
                        onClick={() => toggleDropdown(user.id)}
                        className="p-2 hover:bg-accent rounded transition-colors"
                        title="More actions"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>

                      {openDropdownId === user.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-50">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setSelectedUserForPasswordReset(user);
                                handleResetPassword(user);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                            >
                              <Key className="w-4 h-4 text-muted-foreground" />
                              Reset Password
                            </button>
                            <button
                              onClick={() => {
                                openEditModal(user);
                                setOpenDropdownId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                            >
                              <Edit className="w-4 h-4 text-muted-foreground" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                openDeleteDialog(user);
                                setOpenDropdownId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{startIndex + 1}</span> to{' '}
              <span className="font-medium text-foreground">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
              <span className="font-medium text-foreground">{filteredUsers.length}</span> users
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Rows per page:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-input rounded hover:bg-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-input hover:bg-accent'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-input rounded hover:bg-accent transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUserForEdit(null);
        }}
        onEditUser={handleEditUser}
        user={selectedUserForEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUserForDelete(null);
        }}
        onConfirm={handleDeleteUser}
        userName={selectedUserForDelete?.name || ''}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
