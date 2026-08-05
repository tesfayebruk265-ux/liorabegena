import React, { useState } from 'react';
import {
  Building2,
  Users,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  Package,
  Wrench,
  CheckCircle2,
  Edit,
  Plus,
  MessageSquare,
  DollarSign,
  UserCheck,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, SchoolBranch, BranchStaffMember, ClassRoom } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';
import { MOCK_BRANCHES } from './OperationsCenter';

interface BranchDetailViewProps {
  branchId: string;
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

const SAMPLE_BRANCH_STAFF: BranchStaffMember[] = [
  {
    id: 's-1',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    name: 'Solomon Worku',
    role: 'Branch Manager',
    email: 'solomon@abelbegena.com',
    phone: '+251 911 234 567',
    status: 'Active',
    workingSchedule: 'Mon - Sat: 8:00 AM - 5:00 PM'
  },
  {
    id: 's-2',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    name: 'Abel Begena',
    role: 'Teacher',
    email: 'abel@abelbegena.com',
    phone: '+251 911 111 222',
    status: 'Active',
    workingSchedule: 'Sun, Tue, Thu: 9:00 AM - 4:00 PM',
    assignedInstruments: ['Begena']
  },
  {
    id: 's-3',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    name: 'Bethlehem Tadesse',
    role: 'Registration Staff',
    email: 'bethlehem@abelbegena.com',
    phone: '+251 911 333 444',
    status: 'Active',
    workingSchedule: 'Mon - Fri: 8:30 AM - 5:30 PM'
  }
];

const SAMPLE_ROOMS: ClassRoom[] = [
  {
    id: 'r-101',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    name: 'Room 101 - Begena Sanctuary',
    roomNumber: '101',
    capacity: 20,
    type: 'Begena Classroom',
    equipment: ['10 Begena Instruments', 'Acoustic Wall Panels', 'Whiteboard', 'Music Stands'],
    status: 'Available'
  },
  {
    id: 'r-102',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    name: 'Room 102 - Krar & Strings Studio',
    roomNumber: '102',
    capacity: 15,
    type: 'Krar Classroom',
    equipment: ['12 Krar Instruments', 'Audio Amplifiers', 'Tuning Peg Kit'],
    status: 'Occupied'
  }
];

export function BranchDetailView({ branchId, lang, onNavigate }: BranchDetailViewProps) {
  const branch = MOCK_BRANCHES.find((b) => b.id === branchId) || MOCK_BRANCHES[0];

  const [activeTab, setActiveTab] = useState<'info' | 'staff' | 'students' | 'rooms' | 'inventory' | 'payments'>('info');

  // Status edit state
  const [branchStatus, setBranchStatus] = useState(branch.status);

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('operations')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              ← Back to Operations Hub
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300">Status:</span>
              <select
                className="p-1.5 bg-white/10 text-white rounded-lg text-xs font-bold border border-white/20"
                value={branchStatus}
                onChange={(e) => setBranchStatus(e.target.value as any)}
              >
                <option value="Active" className="bg-[#2B2B2B]">Active</option>
                <option value="Temporarily Closed" className="bg-[#2B2B2B]">Temporarily Closed</option>
                <option value="Under Maintenance" className="bg-[#2B2B2B]">Under Maintenance</option>
                <option value="Inactive" className="bg-[#2B2B2B]">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#E89B52] uppercase block">
              CAMPUS CODE: {branch.code}
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
              {branch.name.toUpperCase()} WORKSPACE
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              {branch.address} • Manager: <b>{branch.managerName}</b>
            </p>
          </div>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E7DED1] rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Enrolled Students</span>
          <div className="font-display font-black text-2xl text-green-800">{branch.totalStudents}</div>
        </div>
        <div className="p-4 bg-white border border-[#E7DED1] rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Active Teachers</span>
          <div className="font-display font-black text-2xl text-[#E89B52]">{branch.totalTeachers}</div>
        </div>
        <div className="p-4 bg-white border border-[#E7DED1] rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Today's Classes</span>
          <div className="font-display font-black text-2xl text-[#2B2B2B]">{branch.classesTodayCount}</div>
        </div>
        <div className="p-4 bg-white border border-[#E7DED1] rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Available Rooms</span>
          <div className="font-display font-black text-2xl text-blue-800">{branch.availableRoomsCount}</div>
        </div>
      </div>

      {/* SUB-TAB NAVIGATION */}
      <div className="flex border-b border-[#E7DED1] gap-2 overflow-x-auto pb-px">
        {[
          { id: 'info', label: 'ℹ️ Branch Location & Contact' },
          { id: 'staff', label: '👥 Staff & Teachers' },
          { id: 'students', label: '🎓 Branch Students' },
          { id: 'rooms', label: '🏛️ Rooms & Equipment' },
          { id: 'inventory', label: '📦 Campus Inventory' },
          { id: 'payments', label: '💳 Payments Summary' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#E89B52] text-[#2B2B2B] bg-[#FAF6EF]'
                : 'border-transparent text-gray-400 hover:text-[#2B2B2B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {/* INFO TAB */}
        {activeTab === 'info' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <h3 className="font-display font-black text-lg text-[#2B2B2B]">Location & Contact Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-gray-400 block">Full Physical Address</span>
                    <p className="font-medium text-sm text-[#2B2B2B]">{branch.address}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 block">City / Sub-City / Woreda</span>
                    <p className="font-medium">{branch.city}, {branch.subCity} Sub-City, Woreda {branch.woreda || '01'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 block">Google Maps Coordinates</span>
                    <p className="font-mono text-amber-700">Latitude: {branch.latitude}, Longitude: {branch.longitude}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-gray-400 block">Branch Manager</span>
                    <p className="font-medium text-sm text-[#2B2B2B]">{branch.managerName}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 block">Primary Contact Phone</span>
                    <p className="font-medium">{branch.contactPhone}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 block">Emergency Operations Line</span>
                    <p className="font-medium text-red-600">{branch.emergencyPhone}</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 block">Operating Hours</span>
                    <p className="font-medium">{branch.operatingHours}</p>
                  </div>
                </div>
              </div>

              {/* MOCK GOOGLE MAP PREVIEW */}
              <div className="bg-[#FAF6EF] border border-[#E7DED1] p-6 rounded-2xl text-center space-y-2">
                <MapPin className="mx-auto text-[#E89B52]" size={32} />
                <h4 className="font-bold text-xs uppercase text-[#2B2B2B]">Google Maps Navigation Sync Active</h4>
                <p className="text-[11px] text-gray-500">
                  Latitude: {branch.latitude} • Longitude: {branch.longitude} • Directions available on student registration portal.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAFF TAB */}
        {activeTab === 'staff' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-lg text-[#2B2B2B]">Assigned Branch Personnel</h3>
                <Button variant="primary" size="sm">+ Assign Staff to Branch</Button>
              </div>

              <div className="space-y-3">
                {SAMPLE_BRANCH_STAFF.map((s) => (
                  <div key={s.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <span className="font-bold text-sm text-[#2B2B2B]">{s.name}</span>
                      <p className="text-amber-800 font-bold">{s.role} • {s.status}</p>
                      <p className="text-gray-500">{s.phone} • {s.email}</p>
                    </div>
                    <div className="text-right text-[11px] text-gray-500 font-mono">
                      <span>{s.workingSchedule}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ROOMS TAB */}
        {activeTab === 'rooms' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-lg text-[#2B2B2B]">Classrooms & Performance Studios</h3>
                <Button variant="primary" size="sm">+ Add New Room</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SAMPLE_ROOMS.map((r) => (
                  <div key={r.id} className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-3 shadow-xs">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-[#2B2B2B]">{r.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        r.status === 'Available' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">Type: {r.type} • Capacity: <b>{r.capacity} Students</b></p>

                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-gray-600 block">Equipped Instruments & Gear:</span>
                      <ul className="list-disc pl-4 text-gray-600 space-y-0.5">
                        {r.equipment.map((eq, i) => (
                          <li key={i}>{eq}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PAYMENTS SUMMARY TAB */}
        {activeTab === 'payments' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <h3 className="font-display font-black text-lg text-[#2B2B2B]">Authorized Branch Financial Snapshot</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl space-y-1">
                  <span className="font-bold text-green-900 block uppercase text-[10px]">Collected Tuition (July)</span>
                  <div className="font-display font-black text-xl text-green-950">285,400 ETB</div>
                  <span className="text-[10px] text-green-800">CBE & Telebirr verified</span>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <span className="font-bold text-amber-900 block uppercase text-[10px]">Pending Branch Verification</span>
                  <div className="font-display font-black text-xl text-amber-950">14,200 ETB</div>
                  <span className="text-[10px] text-amber-800">Bank receipt slips submitted</span>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                  <span className="font-bold text-blue-900 block uppercase text-[10px]">Approved Operational Expenses</span>
                  <div className="font-display font-black text-xl text-blue-950">18,500 ETB</div>
                  <span className="text-[10px] text-blue-800">Stationery & Instrument Repairs</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

