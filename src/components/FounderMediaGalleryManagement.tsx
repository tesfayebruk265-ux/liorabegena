import React, { useState, useMemo, useRef } from 'react';
import {
  Image as ImageIcon, Plus, Upload, Trash2, Edit, Eye, EyeOff, Check, X,
  Filter, Search, Calendar, MapPin, Tag, Layers, CheckCircle, AlertCircle,
  FolderPlus, FolderEdit, Move, Download, RefreshCw, ChevronLeft, ChevronRight,
  Sparkles, CheckSquare, Square, FileImage, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { PersistentMediaAsset } from '../types';
import { Button } from './InteractiveComponents';

interface FounderMediaGalleryManagementProps {
  onNavigatePage?: (page: string) => void;
}

export function FounderMediaGalleryManagement({ onNavigatePage }: FounderMediaGalleryManagementProps) {
  const { currentUser } = useAuth();
  const {
    mediaAssets,
    mediaCategories,
    addMediaAsset,
    updateMediaAsset,
    deleteMediaAsset,
    toggleMediaPublished,
    setMediaStatus,
    addMediaCategory,
    renameMediaCategory,
    deleteMediaCategory
  } = useData();

  // Active View Tab: 'grid' | 'upload' | 'categories'
  const [activeTab, setActiveTab] = useState<'grid' | 'upload' | 'categories'>('grid');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedPlacementFilter, setSelectedPlacementFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Multi-select bulk state
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  // Modals state
  const [editingAsset, setEditingAsset] = useState<PersistentMediaAsset | null>(null);
  const [lightboxAsset, setLightboxAsset] = useState<PersistentMediaAsset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<PersistentMediaAsset | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState<boolean>(false);

  // Category Manager Modal state
  const [newCatName, setNewCatName] = useState('');
  const [renamingCat, setRenamingCat] = useState<{ oldName: string; newName: string } | null>(null);
  const [deletingCat, setDeletingCat] = useState<{ catName: string; moveTarget: string } | null>(null);

  // Upload Form State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadMode, setUploadMode] = useState<'files' | 'url'>('files');
  const [urlInput, setUrlInput] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<string>('School Events');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadDate, setUploadDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [uploadLocation, setUploadLocation] = useState('');
  const [uploadPlacement, setUploadPlacement] = useState<'Gallery' | 'Hero' | 'Course' | 'Teacher Profile' | 'Event'>('Gallery');
  const [uploadStatus, setUploadStatus] = useState<'Draft' | 'Published' | 'Unpublished'>('Published');
  const [uploadedFilesData, setUploadedFilesData] = useState<{ name: string; url: string; sizeKB: number }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Filtering Media Assets
  const filteredAssets = useMemo(() => {
    return mediaAssets.filter((asset) => {
      // Search
      const matchesSearch =
        !searchQuery ||
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.location && asset.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        asset.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategoryFilter === 'All' || asset.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

      // Status
      const currentStatus = asset.status || (asset.isPublished ? 'Published' : 'Draft');
      const matchesStatus =
        selectedStatusFilter === 'All' || currentStatus.toLowerCase() === selectedStatusFilter.toLowerCase();

      // Placement
      const matchesPlacement =
        selectedPlacementFilter === 'All' || asset.placement.toLowerCase() === selectedPlacementFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus && matchesPlacement;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sortBy === 'oldest') return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      return a.title.localeCompare(b.title);
    });
  }, [mediaAssets, searchQuery, selectedCategoryFilter, selectedStatusFilter, selectedPlacementFilter, sortBy]);

  // Bulk Actions
  const toggleSelectAsset = (id: string) => {
    setSelectedAssetIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map(a => a.id));
    }
  };

  const handleBulkPublish = () => {
    selectedAssetIds.forEach(id => setMediaStatus(id, 'Published'));
    setSelectedAssetIds([]);
  };

  const handleBulkUnpublish = () => {
    selectedAssetIds.forEach(id => setMediaStatus(id, 'Unpublished'));
    setSelectedAssetIds([]);
  };

  const handleBulkDelete = () => {
    setConfirmBulkDelete(true);
  };

  const executeBulkDelete = () => {
    selectedAssetIds.forEach(id => deleteMediaAsset(id));
    setSelectedAssetIds([]);
    setConfirmBulkDelete(false);
  };

  // Upload Processing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newItems: { name: string; url: string; sizeKB: number }[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          newItems.push({
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: result,
            sizeKB: Math.round(file.size / 1024)
          });

          if (newItems.length === files.length) {
            setUploadedFilesData(prev => [...prev, ...newItems]);
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProcessUploadSubmit = () => {
    let count = 0;
    const author = currentUser?.email || 'founder@begena.com';

    if (uploadMode === 'url' && urlInput.trim()) {
      addMediaAsset({
        title: uploadTitle || 'Uploaded Media Asset',
        url: urlInput.trim(),
        caption: uploadCaption || uploadTitle || 'School media archive item',
        category: uploadCategory,
        placement: uploadPlacement,
        altText: uploadTitle || 'Media Asset',
        status: uploadStatus,
        isPublished: uploadStatus === 'Published',
        uploadedBy: author,
        photoDate: uploadDate,
        location: uploadLocation,
        fileSizeKB: 250
      });
      count++;
    } else if (uploadedFilesData.length > 0) {
      uploadedFilesData.forEach((item, idx) => {
        addMediaAsset({
          title: uploadTitle ? (uploadedFilesData.length > 1 ? `${uploadTitle} (${idx + 1})` : uploadTitle) : item.name,
          url: item.url,
          caption: uploadCaption || 'School Media Vault Asset',
          category: uploadCategory,
          placement: uploadPlacement,
          altText: item.name,
          status: uploadStatus,
          isPublished: uploadStatus === 'Published',
          uploadedBy: author,
          photoDate: uploadDate,
          location: uploadLocation,
          fileSizeKB: item.sizeKB
        });
        count++;
      });
    }

    setUploadSuccessMsg(`Successfully uploaded and registered ${count} image asset(s) into the database!`);
    setTimeout(() => setUploadSuccessMsg(''), 4000);

    // Reset Form
    setUrlInput('');
    setUploadTitle('');
    setUploadCaption('');
    setUploadLocation('');
    setUploadedFilesData([]);
    setActiveTab('grid');
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#2B2B2B] via-[#3A3228] to-[#1E1711] text-white p-6 rounded-2xl border border-[#E7DED1] shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
            <ShieldCheck size={16} /> Founder Media Vault & Dynamic Gallery System
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Media Gallery Management
          </h1>
          <p className="text-xs text-amber-100/80 max-w-xl">
            Upload, categorize, edit, publish, or purge assets. All changes reflect real-time across the school public website gallery and course pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setActiveTab('upload')}
            className="bg-[#E89B52] hover:bg-[#d88a41] text-white font-bold flex items-center gap-2 text-xs py-2.5 px-4 rounded-xl shadow-md cursor-pointer"
          >
            <Upload size={16} /> Upload New Pictures
          </Button>
          <Button
            variant="secondary"
            onClick={() => setActiveTab('categories')}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs py-2.5 px-4 rounded-xl cursor-pointer flex items-center gap-2"
          >
            <Layers size={16} /> Manage Categories ({mediaCategories.length})
          </Button>
        </div>
      </div>

      {/* METRICS STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white border border-[#E7DED1] p-3.5 rounded-xl shadow-2xs space-y-1">
          <div className="text-gray-500 font-bold text-[10px] uppercase flex items-center justify-between">
            <span>Total Media Assets</span>
            <ImageIcon size={14} className="text-[#E89B52]" />
          </div>
          <p className="text-2xl font-black font-mono text-[#2B2B2B]">{mediaAssets.length}</p>
        </div>

        <div className="bg-white border border-[#E7DED1] p-3.5 rounded-xl shadow-2xs space-y-1">
          <div className="text-gray-500 font-bold text-[10px] uppercase flex items-center justify-between">
            <span>Published (Public)</span>
            <CheckCircle size={14} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-700">
            {mediaAssets.filter(m => (m.status ? m.status === 'Published' : m.isPublished)).length}
          </p>
        </div>

        <div className="bg-white border border-[#E7DED1] p-3.5 rounded-xl shadow-2xs space-y-1">
          <div className="text-gray-500 font-bold text-[10px] uppercase flex items-center justify-between">
            <span>Drafts / Unpublished</span>
            <EyeOff size={14} className="text-amber-600" />
          </div>
          <p className="text-2xl font-black font-mono text-amber-700">
            {mediaAssets.filter(m => m.status === 'Draft' || m.status === 'Unpublished').length}
          </p>
        </div>

        <div className="bg-white border border-[#E7DED1] p-3.5 rounded-xl shadow-2xs space-y-1">
          <div className="text-gray-500 font-bold text-[10px] uppercase flex items-center justify-between">
            <span>Categories Active</span>
            <Tag size={14} className="text-sky-600" />
          </div>
          <p className="text-2xl font-black font-mono text-sky-900">{mediaCategories.length}</p>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION */}
      {uploadSuccessMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>{uploadSuccessMsg}</span>
          </div>
          <button onClick={() => setUploadSuccessMsg('')} className="text-emerald-700 hover:text-black">
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* TOP NAVIGATION TABS */}
      <div className="flex border-b border-[#E7DED1] bg-white rounded-t-xl px-2 pt-2 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('grid')}
          className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'grid'
              ? 'bg-[#FAF6EF] text-[#E89B52] border-t-2 border-x border-[#E7DED1] font-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <ImageIcon size={14} /> Media Gallery Archive ({mediaAssets.length})
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-[#FAF6EF] text-[#E89B52] border-t-2 border-x border-[#E7DED1] font-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <Upload size={14} /> Upload & Multi-Picture Studio
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#FAF6EF] text-[#E89B52] border-t-2 border-x border-[#E7DED1] font-black'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <Layers size={14} /> Media Categories Manager ({mediaCategories.length})
        </button>
      </div>

      {/* VIEW 1: MEDIA GALLERY ARCHIVE GRID & BULK ACTIONS */}
      {activeTab === 'grid' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS CONTROLS */}
          <div className="bg-white border border-[#E7DED1] p-4 rounded-xl shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets by title, caption, category, or location..."
                  className="w-full pl-9 pr-3 py-2 border border-[#E7DED1] rounded-xl outline-none bg-[#FAF6EF]/50 focus:bg-white focus:border-[#E89B52]"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="p-2 border border-[#E7DED1] rounded-xl bg-white font-bold text-gray-700 outline-none"
                >
                  <option value="All">All Categories ({mediaCategories.length})</option>
                  {mediaCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="p-2 border border-[#E7DED1] rounded-xl bg-white font-bold text-gray-700 outline-none"
                >
                  <option value="All">All Visibility Statuses</option>
                  <option value="Published">Published Only</option>
                  <option value="Draft">Drafts Only</option>
                  <option value="Unpublished">Unpublished Only</option>
                </select>

                <select
                  value={selectedPlacementFilter}
                  onChange={(e) => setSelectedPlacementFilter(e.target.value)}
                  className="p-2 border border-[#E7DED1] rounded-xl bg-white font-bold text-gray-700 outline-none"
                >
                  <option value="All">All Placements</option>
                  <option value="Gallery">Public Gallery</option>
                  <option value="Hero">Hero Banners</option>
                  <option value="Course">Course Cards</option>
                  <option value="Teacher Profile">Teacher Profiles</option>
                  <option value="Event">Event Gallery</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-2 border border-[#E7DED1] rounded-xl bg-white font-bold text-gray-700 outline-none"
                >
                  <option value="newest">Sort: Newest Uploads</option>
                  <option value="oldest">Sort: Oldest Uploads</option>
                  <option value="title">Sort: Alphabetical Title</option>
                </select>
              </div>
            </div>

            {/* BULK SELECTION BAR */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-black cursor-pointer bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200"
                >
                  {selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0 ? (
                    <CheckSquare size={16} className="text-[#E89B52]" />
                  ) : (
                    <Square size={16} className="text-gray-400" />
                  )}
                  <span>Select All ({filteredAssets.length})</span>
                </button>

                {selectedAssetIds.length > 0 && (
                  <span className="font-bold text-[#E89B52] bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    {selectedAssetIds.length} item(s) selected
                  </span>
                )}
              </div>

              {selectedAssetIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleBulkPublish}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs py-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Check size={14} /> Publish Selected
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleBulkUnpublish}
                    className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold text-xs py-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <EyeOff size={14} /> Unpublish Selected
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleBulkDelete}
                    className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold text-xs py-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete Selected
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* GRID OF ASSETS */}
          {filteredAssets.length === 0 ? (
            <div className="bg-white border border-[#E7DED1] p-12 rounded-2xl text-center space-y-3">
              <FileImage size={48} className="mx-auto text-gray-300" />
              <h3 className="font-bold text-gray-800 text-sm">No Media Assets Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No picture matching your search filters was found. Upload new pictures or adjust your categories/filters.
              </p>
              <Button
                variant="primary"
                onClick={() => setActiveTab('upload')}
                className="bg-[#E89B52] text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Upload First Picture
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedAssetIds.includes(asset.id);
                const currentStatus = asset.status || (asset.isPublished ? 'Published' : 'Draft');

                return (
                  <div
                    key={asset.id}
                    className={`bg-white border rounded-2xl overflow-hidden shadow-2xs space-y-2 p-3 transition-all relative flex flex-col justify-between ${
                      isSelected ? 'border-[#E89B52] bg-amber-50/20 ring-2 ring-[#E89B52]/20' : 'border-[#E7DED1] hover:border-gray-400'
                    }`}
                  >
                    {/* Checkbox badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <button
                        onClick={() => toggleSelectAsset(asset.id)}
                        className="bg-white/95 rounded-md p-1 border border-gray-300 shadow-sm cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare size={16} className="text-[#E89B52]" />
                        ) : (
                          <Square size={16} className="text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div
                      onClick={() => setLightboxAsset(asset)}
                      className="h-44 w-full rounded-xl overflow-hidden bg-gray-100 relative group cursor-pointer"
                    >
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                        <Eye size={20} />
                        <span className="text-xs font-bold">Preview</span>
                      </div>

                      {/* Status pill */}
                      <span
                        className={`absolute top-2 right-2 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur-xs border shadow-2xs ${
                          currentStatus === 'Published'
                            ? 'bg-emerald-600/90 text-white border-emerald-400'
                            : currentStatus === 'Draft'
                            ? 'bg-amber-600/90 text-white border-amber-400'
                            : 'bg-gray-700/90 text-white border-gray-500'
                        }`}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold uppercase text-[#E89B52] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {asset.category}
                        </span>
                        <span className="text-[9px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {asset.placement}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm truncate leading-snug">{asset.title}</h4>
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-tight">{asset.caption}</p>

                      <div className="text-[10px] text-gray-400 space-y-0.5 pt-1 border-t border-gray-100">
                        {asset.photoDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={10} /> Date: {asset.photoDate}
                          </div>
                        )}
                        {asset.location && (
                          <div className="flex items-center gap-1 truncate">
                            <MapPin size={10} /> {asset.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs font-bold">
                      <button
                        onClick={() => setEditingAsset(asset)}
                        className="text-gray-700 hover:text-[#E89B52] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit size={13} /> Edit
                      </button>

                      <button
                        onClick={() => toggleMediaPublished(asset.id)}
                        className={`text-[11px] cursor-pointer ${
                          currentStatus === 'Published' ? 'text-amber-700 hover:underline' : 'text-emerald-700 hover:underline'
                        }`}
                      >
                        {currentStatus === 'Published' ? 'Unpublish' : 'Publish'}
                      </button>

                      <button
                        onClick={() => setDeletingAsset(asset)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete Picture"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: UPLOAD & MULTI-PICTURE STUDIO */}
      {activeTab === 'upload' && (
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-display font-black text-lg text-[#2B2B2B] flex items-center gap-2">
              <Upload className="text-[#E89B52]" size={20} /> Founder Media Upload Studio
            </h2>
            <p className="text-xs text-gray-500">
              Upload single or multiple pictures directly from your computer, or register an image URL. All pictures will be saved in the database.
            </p>
          </div>

          {/* UPLOAD METHOD TOGGLE */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUploadMode('files')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center justify-center gap-2 ${
                uploadMode === 'files'
                  ? 'bg-amber-50 border-[#E89B52] text-amber-900 shadow-2xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload size={16} /> Local File Upload (Drag & Drop / Select Multiple)
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border cursor-pointer transition-all flex items-center justify-center gap-2 ${
                uploadMode === 'url'
                  ? 'bg-amber-50 border-[#E89B52] text-amber-900 shadow-2xs'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ImageIcon size={16} /> Web Image Link / URL Address
            </button>
          </div>

          {/* FILE SELECTION BOX */}
          {uploadMode === 'files' ? (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E7DED1] hover:border-[#E89B52] bg-[#FAF6EF]/50 hover:bg-[#FAF6EF] p-8 rounded-2xl text-center cursor-pointer transition-all space-y-3"
              >
                <div className="w-14 h-14 bg-amber-100 text-[#E89B52] rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Upload size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Click to Select Pictures or Drag & Drop</h4>
                  <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP. Select multiple pictures at once.</p>
                </div>
                <Button variant="secondary" className="bg-white border-[#E7DED1] text-xs font-bold py-1.5 px-4 rounded-xl cursor-pointer">
                  Browse Files
                </Button>
              </div>

              {/* Uploaded Files Queue */}
              {uploadedFilesData.length > 0 && (
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <h4 className="font-bold text-xs text-gray-800 flex items-center justify-between">
                    <span>Selected File Queue ({uploadedFilesData.length} picture(s))</span>
                    <button
                      onClick={() => setUploadedFilesData([])}
                      className="text-red-600 text-[11px] hover:underline cursor-pointer"
                    >
                      Clear Queue
                    </button>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {uploadedFilesData.map((item, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden p-2 bg-gray-50 text-[10px] relative group">
                        <img src={item.url} alt={item.name} className="h-20 w-full object-cover rounded-lg" />
                        <p className="font-bold truncate mt-1">{item.name}</p>
                        <p className="text-gray-400 font-mono">{item.sizeKB} KB</p>
                        <button
                          onClick={() => setUploadedFilesData(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image Web Address / Direct URL</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full p-3 border border-[#E7DED1] rounded-xl outline-none font-mono text-xs"
              />
              {urlInput && (
                <div className="mt-3 h-40 w-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={urlInput} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          )}

          {/* METADATA FORM FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Picture Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Begena Graduation Ceremony 2026"
                className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Select Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
              >
                {mediaCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Target Placement</label>
              <select
                value={uploadPlacement}
                onChange={(e) => setUploadPlacement(e.target.value as any)}
                className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
              >
                <option value="Gallery">Public Gallery Vault</option>
                <option value="Hero">Homepage Hero Banner</option>
                <option value="Course">Course Showcase</option>
                <option value="Teacher Profile">Teacher Faculty Profile</option>
                <option value="Event">Event Gallery</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Visibility Status</label>
              <select
                value={uploadStatus}
                onChange={(e) => setUploadStatus(e.target.value as any)}
                className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
              >
                <option value="Published">Published (Publicly Visible)</option>
                <option value="Draft">Draft (Internal Only)</option>
                <option value="Unpublished">Unpublished (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Photo Date (Optional)</label>
              <input
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Location / Venue (Optional)</label>
              <input
                type="text"
                value={uploadLocation}
                onChange={(e) => setUploadLocation(e.target.value)}
                placeholder="e.g. Piazza Branch Auditorium, Addis Ababa"
                className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block font-bold text-gray-700 uppercase mb-1">Description / Caption</label>
              <textarea
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                rows={3}
                placeholder="Write a clear description of what is happening in this picture..."
                className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button
              variant="secondary"
              onClick={() => setActiveTab('grid')}
              className="px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleProcessUploadSubmit}
              disabled={uploadMode === 'url' ? !urlInput.trim() : uploadedFilesData.length === 0}
              className="bg-[#E89B52] hover:bg-[#d88a41] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
            >
              <CheckCircle size={16} /> Save & Register to Media Vault
            </Button>
          </div>
        </div>
      )}

      {/* VIEW 3: CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-display font-black text-lg text-[#2B2B2B] flex items-center gap-2">
                <Layers className="text-[#E89B52]" size={20} /> Media Categories Management
              </h2>
              <p className="text-gray-500">
                Organize school media assets into structured categories. Create, edit, or delete categories with automatic picture reallocation.
              </p>
            </div>
          </div>

          {/* ADD NEW CATEGORY FIELD */}
          <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E7DED1] space-y-2">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <FolderPlus size={16} className="text-[#E89B52]" /> Create New Media Category
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Masterclasses 2026, Spiritual Retreats..."
                className="flex-1 p-2.5 border border-[#E7DED1] rounded-xl bg-white outline-none font-bold"
              />
              <Button
                variant="primary"
                onClick={() => {
                  if (addMediaCategory(newCatName)) {
                    setNewCatName('');
                  } else {
                    alert('Category name already exists or is invalid.');
                  }
                }}
                disabled={!newCatName.trim()}
                className="bg-[#E89B52] text-white font-bold px-5 rounded-xl cursor-pointer"
              >
                Add Category
              </Button>
            </div>
          </div>

          {/* CATEGORY LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaCategories.map((cat) => {
              const count = mediaAssets.filter(m => m.category.toLowerCase() === cat.toLowerCase()).length;

              return (
                <div key={cat} className="border border-[#E7DED1] rounded-xl p-4 bg-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-[#E89B52]" />
                      <h4 className="font-black text-gray-900 text-sm">{cat}</h4>
                    </div>
                    <span className="bg-amber-50 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[10px] border border-amber-200">
                      {count} picture(s)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 border-t border-gray-100 pt-3 text-xs font-bold">
                    <button
                      onClick={() => setRenamingCat({ oldName: cat, newName: cat })}
                      className="text-gray-700 hover:text-[#E89B52] flex items-center gap-1 cursor-pointer"
                    >
                      <FolderEdit size={14} /> Rename
                    </button>

                    <button
                      onClick={() => setDeletingCat({ catName: cat, moveTarget: mediaCategories.find(c => c !== cat) || 'School Events' })}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer ml-auto"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT ASSET MODAL */}
      <AnimatePresence>
        {editingAsset && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#E7DED1] max-w-xl w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Edit Media Asset Details</h3>
                <button onClick={() => setEditingAsset(null)} className="text-gray-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={editingAsset.url} alt={editingAsset.title} className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Asset Title</label>
                  <input
                    type="text"
                    value={editingAsset.title}
                    onChange={(e) => setEditingAsset({ ...editingAsset, title: e.target.value })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select
                    value={editingAsset.category}
                    onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                  >
                    {mediaCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Visibility Status</label>
                  <select
                    value={editingAsset.status || (editingAsset.isPublished ? 'Published' : 'Draft')}
                    onChange={(e) => {
                      const st = e.target.value as any;
                      setEditingAsset({ ...editingAsset, status: st, isPublished: st === 'Published' });
                    }}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft</option>
                    <option value="Unpublished">Unpublished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Placement</label>
                  <select
                    value={editingAsset.placement}
                    onChange={(e) => setEditingAsset({ ...editingAsset, placement: e.target.value as any })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                  >
                    <option value="Gallery">Public Gallery</option>
                    <option value="Hero">Hero Banner</option>
                    <option value="Course">Course Showcase</option>
                    <option value="Teacher Profile">Teacher Profile</option>
                    <option value="Event">Event Gallery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Photo Date</label>
                  <input
                    type="date"
                    value={editingAsset.photoDate || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, photoDate: e.target.value })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={editingAsset.location || ''}
                    onChange={(e) => setEditingAsset({ ...editingAsset, location: e.target.value })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Caption / Description</label>
                  <textarea
                    value={editingAsset.caption}
                    onChange={(e) => setEditingAsset({ ...editingAsset, caption: e.target.value })}
                    rows={3}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setEditingAsset(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-[#E89B52] text-white cursor-pointer"
                  onClick={() => {
                    updateMediaAsset(editingAsset.id, editingAsset);
                    setEditingAsset(null);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENAME CATEGORY MODAL */}
      <AnimatePresence>
        {renamingCat && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-sm w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Rename Category</h3>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">New Category Name</label>
                <input
                  type="text"
                  value={renamingCat.newName}
                  onChange={(e) => setRenamingCat({ ...renamingCat, newName: e.target.value })}
                  className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none font-bold"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setRenamingCat(null)}>Cancel</Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-[#E89B52] text-white cursor-pointer"
                  onClick={() => {
                    renameMediaCategory(renamingCat.oldName, renamingCat.newName);
                    setRenamingCat(null);
                  }}
                >
                  Rename Category
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CATEGORY MODAL WITH REASSIGN TARGET */}
      <AnimatePresence>
        {deletingCat && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-sm w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <h3 className="font-display font-black text-sm uppercase text-red-600 flex items-center gap-2">
                <AlertCircle size={18} /> Delete Category: {deletingCat.catName}
              </h3>
              <p className="text-gray-600">
                Select a fallback category to reassign existing pictures belonging to "{deletingCat.catName}":
              </p>
              <select
                value={deletingCat.moveTarget}
                onChange={(e) => setDeletingCat({ ...deletingCat, moveTarget: e.target.value })}
                className="w-full p-2.5 border border-[#E7DED1] rounded-xl font-bold bg-white"
              >
                {mediaCategories.filter(c => c !== deletingCat.catName).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setDeletingCat(null)}>Cancel</Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-red-600 text-white cursor-pointer"
                  onClick={() => {
                    deleteMediaCategory(deletingCat.catName, deletingCat.moveTarget);
                    setDeletingCat(null);
                  }}
                >
                  Confirm Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX PREVIEW MODAL */}
      <AnimatePresence>
        {lightboxAsset && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1A1A1A] border border-gray-800 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl text-white text-left flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="md:w-2/3 bg-black flex items-center justify-center relative min-h-[300px]">
                <img src={lightboxAsset.url} alt={lightboxAsset.title} className="max-h-[80vh] w-full object-contain" />
              </div>

              <div className="md:w-1/3 p-6 space-y-4 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-gray-800">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E89B52] bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800">
                      {lightboxAsset.category}
                    </span>
                    <button onClick={() => setLightboxAsset(null)} className="text-gray-400 hover:text-white cursor-pointer">
                      <X size={20} />
                    </button>
                  </div>

                  <h3 className="font-display font-black text-lg text-white leading-tight">{lightboxAsset.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{lightboxAsset.caption}</p>

                  <div className="space-y-1.5 text-xs text-gray-400 border-t border-gray-800 pt-3">
                    {lightboxAsset.photoDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#E89B52]" /> Date: {lightboxAsset.photoDate}
                      </div>
                    )}
                    {lightboxAsset.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#E89B52]" /> Location: {lightboxAsset.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      Uploaded by: {lightboxAsset.uploadedBy}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex gap-2 flex-wrap">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingAsset(lightboxAsset);
                      setLightboxAsset(null);
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-xl cursor-pointer"
                  >
                    Edit Asset
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setDeletingAsset(lightboxAsset);
                      setLightboxAsset(null);
                    }}
                    className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs py-2 px-3 rounded-xl cursor-pointer flex items-center justify-center gap-1 font-bold"
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setLightboxAsset(null)}
                    className="flex-1 bg-[#E89B52] text-white text-xs py-2 rounded-xl cursor-pointer"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE SINGLE ASSET MODAL */}
      <AnimatePresence>
        {deletingAsset && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <AlertCircle size={20} />
                  <span>Delete Picture Asset?</span>
                </div>
                <button onClick={() => setDeletingAsset(null)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                <img
                  src={deletingAsset.url}
                  alt={deletingAsset.title}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-300 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{deletingAsset.title}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{deletingAsset.category} • {deletingAsset.placement}</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to permanently delete this picture from the media vault? This action will remove it from the gallery and cannot be undone.
              </p>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setDeletingAsset(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer font-bold flex items-center justify-center gap-1.5"
                  onClick={() => {
                    deleteMediaAsset(deletingAsset.id);
                    setDeletingAsset(null);
                  }}
                >
                  <Trash2 size={14} /> Yes, Delete Picture
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BULK DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmBulkDelete && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <AlertCircle size={20} />
                  <span>Delete {selectedAssetIds.length} Selected Assets?</span>
                </div>
                <button onClick={() => setConfirmBulkDelete(false)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-red-600">{selectedAssetIds.length}</strong> selected picture assets from the school media vault?
              </p>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setConfirmBulkDelete(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer font-bold flex items-center justify-center gap-1.5"
                  onClick={executeBulkDelete}
                >
                  <Trash2 size={14} /> Yes, Delete Selected
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
