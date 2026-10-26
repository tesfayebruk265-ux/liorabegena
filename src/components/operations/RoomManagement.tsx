import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Plus,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Music,
  Tv,
  Mic,
  Sliders,
  Maximize2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language, ClassRoom } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';

const SAMPLE_ROOM_LIST: ClassRoom[] = [
  {
    id: 'r-101',
    branchId: 'b-hawassa',
    branchName: 'Hawassa Main Branch',
    name: 'Room 101 - Begena Sanctuary',
    roomNumber: '101',
    capacity: 20,
    type: 'Begena Classroom',
    equipment: ['10 Begena Instruments', 'Acoustic Wall Panels', 'Whiteboard', '20 Music Stands'],
    status: 'Available'
  },
  {
    id: 'r-102',
    branchId: 'b-hawassa',
    branchName: 'Hawassa Main Branch',
    name: 'Room 102 - Krar & Strings Studio',
    roomNumber: '102',
    capacity: 15,
    type: 'Krar Classroom',
    equipment: ['12 Krar Instruments', 'Audio Amplifiers', 'Tuning Peg Kit'],
    status: 'Occupied'
  },
  {
    id: 'r-201',
    branchId: 'b-hawassa',
    branchName: 'Hawassa Main Branch',
    name: 'Room 201 - Digital Recording & Streaming Lab',
    roomNumber: '201',
    capacity: 25,
    type: 'Recording Room',
    equipment: ['Acoustic Isolation Booth', '4 Condenser Microphones', 'Google Meet HD Cam', 'HD Projector'],
    status: 'Available'
  },
  {
    id: 'r-301',
    branchId: 'b-hawassa',
    branchName: 'Hawassa Main Branch',
    name: 'Room 301 - Main Choir & Performance Hall',
    roomNumber: '301',
    capacity: 50,
    type: 'Performance Hall',
    equipment: ['PA Sound System', 'Kebero Drums Set', 'Stage Lighting', '50 Chairs'],
    status: 'Reserved'
  }
];

interface RoomManagementProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function RoomManagement({ lang, onNavigate }: RoomManagementProps) {
  const [rooms, setRooms] = useState<ClassRoom[]>(SAMPLE_ROOM_LIST);
  const [selectedBranch, setSelectedBranch] = useState('all');

  // New Room Modal
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('104');
  const [newCapacity, setNewCapacity] = useState(20);
  const [newBranchName, setNewBranchName] = useState('Piazza Branch');
  const [newRoomType, setNewRoomType] = useState<any>('Begena Classroom');

  const handleAddRoom = () => {
    if (!newRoomName) return;
    const r: ClassRoom = {
      id: `r-${Date.now()}`,
      branchId: 'b-hawassa',
      branchName: newBranchName || 'Hawassa Main Branch',
      name: newRoomName,
      roomNumber: newRoomNumber,
      capacity: newCapacity,
      type: newRoomType,
      equipment: ['Chairs', 'Music Stands', 'Standard Instrument Pegs'],
      status: 'Available'
    };
    setRooms([...rooms, r]);
    setShowAddRoomModal(false);
    setNewRoomName('');
  };

  const filteredRooms = rooms.filter((r) => selectedBranch === 'all' || r.branchName === selectedBranch);

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <Building2 size={14} />
              <span>Campus Facilities & Acoustic Studios</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 shadow-md"
              onClick={() => setShowAddRoomModal(true)}
            >
              <Plus size={14} />
              <span>+ Add New Classroom / Room</span>
            </Button>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            ROOM & FACILITY MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Configure classrooms, acoustic studios, recording booths, and choir practice halls across all campuses with equipment tracking and availability calendars.
          </p>
        </div>
      </div>

      {/* BRANCH FILTER BAR */}
      <div className="bg-white border border-[#E7DED1] p-4 rounded-3xl flex justify-between items-center shadow-xs">
        <span className="text-xs font-bold text-[#2B2B2B] uppercase">Filter Facilities by Campus:</span>
        <select
          className="p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="all">All Locations</option>
          <option value="Hawassa Main Branch">Hawassa Main Branch</option>
        </select>
      </div>

      {/* ROOM CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((r) => (
          <div key={r.id} className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase block">{r.branchName} • Room {r.roomNumber}</span>
                <h3 className="font-display font-black text-base text-[#2B2B2B]">{r.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                r.status === 'Available' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
              }`}>
                {r.status}
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Category: <b>{r.type}</b> • Max Capacity: <b>{r.capacity} Students</b>
            </p>

            <div className="p-4 bg-[#FAF6EF] rounded-2xl border border-[#E7DED1] space-y-1.5 text-xs text-gray-700">
              <span className="font-bold text-[#2B2B2B] block text-[10px] uppercase">Classroom Gear & Instruments:</span>
              <ul className="list-disc pl-4 space-y-1 text-gray-600">
                {r.equipment.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                onClick={() => alert(`Showing schedule for ${r.name}`)}
              >
                📅 View Booking Calendar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD ROOM MODAL */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">PROVISION NEW CLASSROOM</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Room Name</label>
                <Input
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Room 104 - Acoustic Vocal Studio"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Room Number</label>
                  <Input value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Student Capacity</label>
                  <Input type="number" value={newCapacity} onChange={(e) => setNewCapacity(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Branch Campus</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                >
                  <option value="Hawassa Main Branch">Hawassa Main Branch</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Room Type</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value as any)}
                >
                  <option value="Begena Classroom">Begena Classroom</option>
                  <option value="Krar Classroom">Krar Classroom</option>
                  <option value="Vocal Room">Vocal Room</option>
                  <option value="Recording Room">Recording Room</option>
                  <option value="Performance Hall">Performance Hall</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAddRoomModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddRoom}>
                Save Facility
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

