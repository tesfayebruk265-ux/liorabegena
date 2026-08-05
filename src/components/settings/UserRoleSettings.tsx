import React, { useState } from 'react';
import { Users, Shield, Lock, Search, Plus, Edit2, CheckCircle2, XCircle, AlertCircle, Key } from 'lucide-react';
import { UserAccountItem, INITIAL_USERS } from './SettingsData';

export const UserRoleSettings: React.FC = () => {
  const [userList, setUserList] = useState<UserAccountItem[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState<Partial<UserAccountItem>>({
    fullName: '',
    email: '',
    phone: '',
    role: 'Student',
    branchScope: 'Megenagna',
    status: 'Active',
    mfaEnabled: false
  });

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesRole = selectedRoleFilter === 'All' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleStatusChange = (id: string, status: UserAccountItem['status']) => {
    setUserList((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  const handleRoleChange = (id: string, role: UserAccountItem['role']) => {
    setUserList((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const handleBranchScopeChange = (id: string, branchScope: UserAccountItem['branchScope']) => {
    setUserList((prev) => prev.map((u) => (u.id === id ? { ...u, branchScope } : u)));
  };

  const handleCreateUser = () => {
    if (!newUser.fullName || !newUser.email) return;
    const created: UserAccountItem = {
      id: `USR-${Date.now()}`,
      fullName: newUser.fullName!,
      email: newUser.email!,
      phone: newUser.phone || '+251 900 000 000',
      role: newUser.role as UserAccountItem['role'],
      branchScope: newUser.branchScope as UserAccountItem['branchScope'],
      status: newUser.status as UserAccountItem['status'],
      mfaEnabled: !!newUser.mfaEnabled,
      lastLogin: 'Never',
      ipAddress: 'N/A'
    };

    setUserList((prev) => [created, ...prev]);
    setShowAddUserModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-700" /> User Directory, Roles & Granular Permissions
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage system access across 10 distinct roles, account activation statuses, and branch scoping.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Provision New User
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-neutral-600 shrink-0">Filter Role:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl text-xs px-3 py-2 font-semibold focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Founder">Founder</option>
            <option value="Admin">Admin</option>
            <option value="Accountant">Accountant</option>
            <option value="Branch Manager">Branch Manager</option>
            <option value="Registration Staff">Registration Staff</option>
            <option value="Teacher">Teacher</option>
            <option value="Parent">Parent</option>
            <option value="Student">Student</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-neutral-600 font-bold">
                <th className="p-3.5">User Details</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Branch Scope</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">MFA</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-amber-50/40">
                  <td className="p-3.5">
                    <div className="font-bold text-neutral-800 text-sm">{u.fullName}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{u.email}</div>
                    <div className="text-[10px] text-neutral-400">{u.phone}</div>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className="bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 font-bold text-xs text-amber-900 focus:outline-none"
                    >
                      <option value="Founder">Founder</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Branch Manager">Branch Manager</option>
                      <option value="Registration Staff">Registration Staff</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Parent">Parent</option>
                      <option value="Student">Student</option>
                      <option value="Visitor">Visitor</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={u.branchScope}
                      onChange={(e) => handleBranchScopeChange(u.id, e.target.value as any)}
                      className="bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 font-medium text-xs text-neutral-800 focus:outline-none"
                    >
                      <option value="All Branches">All Branches</option>
                      <option value="Piazza">Piazza</option>
                      <option value="Megenagna">Megenagna</option>
                      <option value="Lebu">Lebu</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={u.status}
                      onChange={(e) => handleStatusChange(u.id, e.target.value as any)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border ${
                        u.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : u.status === 'Suspended'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-stone-200 text-stone-700 border-stone-300'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Deactivated">Deactivated</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.mfaEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {u.mfaEnabled ? '2FA Active' : 'Off'}
                    </span>
                  </td>
                  <td className="p-3.5 text-neutral-500 font-mono text-[11px]">
                    {u.lastLogin}
                    <span className="block text-[10px] text-neutral-400">IP: {u.ipAddress}</span>
                  </td>
                  <td className="p-3.5 text-right font-bold">
                    <button
                      onClick={() => handleStatusChange(u.id, u.status === 'Active' ? 'Suspended' : 'Active')}
                      className="text-amber-800 hover:underline"
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-neutral-800 text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-700" /> Provision New User Account
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="e.g. Solomon Worku"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="user@abelbegena.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+251 9..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">System Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as any }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Parent">Parent</option>
                    <option value="Registration Staff">Registration Staff</option>
                    <option value="Branch Manager">Branch Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Admin">Admin</option>

                    <option value="Founder">Founder</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Branch Scope</label>
                  <select
                    value={newUser.branchScope}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, branchScope: e.target.value as any }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Piazza">Piazza</option>
                    <option value="Megenagna">Megenagna</option>
                    <option value="Lebu">Lebu</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 bg-stone-200 text-neutral-800 font-bold text-xs rounded-xl hover:bg-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={!newUser.fullName || !newUser.email}
                className="px-5 py-2 bg-amber-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl hover:bg-amber-900"
              >
                Provision User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

