import React, { useState } from 'react';
import { Building2, Plus, Edit2, CheckCircle2, AlertTriangle, Phone, MapPin, Users, ShieldAlert } from 'lucide-react';
import { BranchItem, INITIAL_BRANCHES } from './SettingsData';

export const BranchManagementSettings: React.FC = () => {
  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Branch Form
  const [newBranch, setNewBranch] = useState<Partial<BranchItem>>({
    name: '',
    code: '',
    address: '',
    phone: '',
    manager: '',
    openingHours: 'Mon-Sat 8:00 AM - 6:00 PM',
    availableTeachers: 4,
    classrooms: 4,
    capacity: 200,
    status: 'Active',
    availableCourses: ['Begena Level 1', 'Kebero']
  });

  const handleUpdateStatus = (id: string, status: BranchItem['status']) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleCreateBranch = () => {
    if (!newBranch.name || !newBranch.code) return;
    const created: BranchItem = {
      id: `BR-${Date.now()}`,
      name: newBranch.name!,
      code: newBranch.code!,
      address: newBranch.address || 'Addis Ababa, Ethiopia',
      phone: newBranch.phone || '+251 911 000 000',
      manager: newBranch.manager || 'Unassigned',
      openingHours: newBranch.openingHours || 'Mon-Sat 8:00 AM - 6:00 PM',
      availableCourses: newBranch.availableCourses || ['Begena Level 1'],
      availableTeachers: Number(newBranch.availableTeachers) || 2,
      classrooms: Number(newBranch.classrooms) || 3,
      capacity: Number(newBranch.capacity) || 150,
      status: newBranch.status as BranchItem['status']
    };

    setBranches((prev) => [...prev, created]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-700" /> Branch Operations & Physical Location Settings
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Configure Hawassa Main Branch, capacity limits, and operational statuses.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Branch
        </button>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {b.code}
                  </span>
                  <h3 className="text-base font-bold text-neutral-800 mt-1">{b.name}</h3>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    b.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : b.status === 'Temporarily Closed'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : b.status === 'Under Maintenance'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> {b.address}
              </p>
              <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" /> {b.phone}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Branch Manager</span>
                  <span className="font-semibold text-neutral-800">{b.manager}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Capacity</span>
                  <span className="font-semibold text-neutral-800">{b.capacity} Students</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Classrooms</span>
                  <span className="font-semibold text-neutral-800">{b.classrooms} Rooms</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">Teachers</span>
                  <span className="font-semibold text-neutral-800">{b.availableTeachers} Staff</span>
                </div>
              </div>
            </div>

            {/* Quick Status Selector */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-neutral-600">Update Status:</span>
              <select
                value={b.status}
                onChange={(e) => handleUpdateStatus(b.id, e.target.value as any)}
                className="bg-stone-50 border border-stone-300 rounded-lg text-xs px-2 py-1 font-bold focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Temporarily Closed">Temporarily Closed</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Inactive">Inactive</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-neutral-800 text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-700" /> Create New Branch Location
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Lebu Square Branch"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Branch Code</label>
                  <input
                    type="text"
                    value={newBranch.code}
                    onChange={(e) => setNewBranch((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. LB-04"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Full Physical Address</label>
                <input
                  type="text"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. Lebu Varnero Square, Addis Ababa"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Branch Manager</label>
                  <input
                    type="text"
                    value={newBranch.manager}
                    onChange={(e) => setNewBranch((prev) => ({ ...prev, manager: e.target.value }))}
                    placeholder="Manager Name"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+251 9..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Classrooms</label>
                  <input
                    type="number"
                    value={newBranch.classrooms}
                    onChange={(e) => setNewBranch((prev) => ({ ...prev, classrooms: Number(e.target.value) }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newBranch.capacity}
                    onChange={(e) => setNewBranch((prev) => ({ ...prev, capacity: Number(e.target.value) }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Teachers</label>
                  <input
                    type="number"
                    value={newBranch.availableTeachers}
                    onChange={(e) => setNewBranch((prev) => ({ ...prev, availableTeachers: Number(e.target.value) }))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-stone-200 text-neutral-800 font-bold text-xs rounded-xl hover:bg-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBranch}
                disabled={!newBranch.name || !newBranch.code}
                className="px-5 py-2 bg-amber-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl hover:bg-amber-900"
              >
                Create Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

