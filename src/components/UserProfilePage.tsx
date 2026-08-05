import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Shield,
  CheckCircle,
  Key,
  Bell,
  BookOpen,
  Save,
  LogOut,
  Building,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  Lock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageId } from '../types';
import { compressImageFile } from '../utils/storage';

interface UserProfilePageProps {
  lang: 'en' | 'am';
  onNavigate: (page: PageId, params?: any) => void;
}

export function UserProfilePage({ lang, onNavigate }: UserProfilePageProps) {
  const { currentUser, updateProfile, changePassword, addNotification, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'academic'>('profile');

  // Form states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [username, setUsername] = useState(currentUser?.username || currentUser?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [emergencyContact, setEmergencyContact] = useState<string>(
    typeof currentUser?.emergencyContact === 'object'
      ? currentUser.emergencyContact?.name || ''
      : currentUser?.emergencyContact || ''
  );
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.gender || 'Male');
  const [age, setAge] = useState(currentUser?.age || 20);
  const [branch, setBranch] = useState(currentUser?.branch || 'Piazza Branch');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Photo state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Notification toggles
  const [emailNotifs, setEmailNotifs] = useState(currentUser?.notificationPreferences?.email ?? true);
  const [smsNotifs, setSmsNotifs] = useState(currentUser?.notificationPreferences?.sms ?? true);
  const [pushNotifs, setPushNotifs] = useState(currentUser?.notificationPreferences?.push ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <AlertCircle size={48} className="mx-auto text-amber-500" />
        <h3 className="font-display font-black text-xl text-[#2B2B2B]">Profile Access Restricted</h3>
        <p className="text-xs text-gray-500">Please log in to your account to view and manage your profile details.</p>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const compressed = await compressImageFile(file, 400, 400, 0.7);
      if (compressed) {
        await updateProfile({ avatar: compressed });
        addNotification('Profile Picture Updated', 'Your new profile photo has been synchronized across all school records.', 'system');
      }
    } catch (err) {
      console.error('[ProfilePhoto] Upload error:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);
    try {
      await updateProfile({ avatar: '' });
      addNotification('Profile Picture Removed', 'Your profile photo has been removed and reset to default.', 'system');
    } catch (err) {
      console.error('[ProfilePhoto] Remove error:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile({
        fullName,
        username,
        email,
        phone,
        address,
        branch,
        emergencyContact: {
          name: emergencyContact,
          relation: 'Emergency Contact',
          phone: phone
        },
        gender,
        age,
        notificationPreferences: {
          email: emailNotifs,
          sms: smsNotifs,
          push: pushNotifs
        }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (!result.success) {
        setPasswordError(result.error || 'Failed to change password.');
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err?.message || 'Error updating password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'parent': return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'teacher': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'admin':
      case 'super_admin':
      case 'founder': return 'bg-purple-100 text-purple-900 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left pb-12">
      {/* HEADER HERO CARD */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Authoritative Profile Picture Box - Blank if no uploaded image */}
            <div className="relative group shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName || 'User Profile'}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#E89B52] shadow-md shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#3B2818] text-[#E89B52] border-2 border-[#E89B52] shadow-md shrink-0 flex items-center justify-center font-display font-black text-3xl">
                  {currentUser.fullName ? currentUser.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-black text-2xl text-[#2B2B2B]">
                  {currentUser.fullName}
                </h1>
                <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full border ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.role.replace('_', ' ')}
                </span>
                {currentUser.verified && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={10} /> Verified Account
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 font-mono">
                {currentUser.email} {currentUser.username ? `• @${currentUser.username}` : ''} • {currentUser.phone || 'No phone set'}
              </p>

              <div className="text-[11px] text-gray-500 flex items-center gap-3 pt-1">
                <span className="flex items-center gap-1"><Building size={12} className="text-[#E89B52]" /> {currentUser.branch || 'Piazza Central Branch'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={12} className="text-[#E89B52]" /> Account Status: <strong className="text-emerald-700">{currentUser.status || 'Active'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onNavigate(currentUser.role as PageId)}
              className="flex-1 md:flex-none px-4 py-2 bg-[#2B2B2B] hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Briefcase size={14} className="text-[#E89B52]" />
              <span>Go to My Portal</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* PHOTO MANAGEMENT BAR */}
        <div className="mt-5 pt-4 border-t border-[#E7DED1]/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="px-3.5 py-1.5 bg-[#E89B52] hover:bg-[#d4863e] text-white text-xs font-bold rounded-xl cursor-pointer transition inline-flex items-center gap-1.5 shadow-2xs">
              <Camera size={14} />
              <span>{currentUser.avatar ? 'Change Profile Picture' : 'Upload Profile Picture'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploadingPhoto}
              />
            </label>

            {currentUser.avatar && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl cursor-pointer transition inline-flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Remove Photo</span>
              </button>
            )}

            {isUploadingPhoto && (
              <span className="text-xs text-amber-600 font-semibold animate-pulse">Compressing and saving photo...</span>
            )}
          </div>

          <p className="text-[11px] text-gray-400">
            Uploaded photos synchronize across all teacher, admin, and student rosters automatically.
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-[#E7DED1] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile' ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <UserIcon size={14} />
          <span>Personal & Contact Info</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security' ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Shield size={14} />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'notifications' ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Bell size={14} />
          <span>Notification Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('academic')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'academic' ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <BookOpen size={14} />
          <span>Academic & Role Overview</span>
        </button>
      </div>

      {/* TAB CONTENT: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Profile Information</h3>
              <p className="text-[11px] text-gray-400">Update your account username, legal name, and official contact details.</p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle size={14} /> Profile synchronized everywhere!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <UserIcon size={12} className="text-[#E89B52]" />
                  Full Legal Name
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <UserCheck size={12} className="text-[#E89B52]" />
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. chala_begena"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Mail size={12} className="text-[#E89B52]" />
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Phone size={12} className="text-[#E89B52]" />
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+251 911 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <MapPin size={12} className="text-[#E89B52]" />
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="Bole Subcity, Addis Ababa"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Briefcase size={12} className="text-[#E89B52]" />
                  Emergency Contact Name & Phone
                </label>
                <input
                  type="text"
                  placeholder="Parent / Relative (+251 911 222 333)"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Age</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Campus Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52] font-semibold text-gray-800"
                  >
                    <option value="Piazza Branch">Piazza Branch</option>
                    <option value="Megenagna Branch">Megenagna Branch</option>
                    <option value="Lebu Branch">Lebu Branch</option>
                    <option value="Central Headquarters">Central Headquarters</option>
                    <option value="Online">Online Campus</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-2 transition"
              >
                <Save size={14} />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-1.5">
              <Lock size={16} className="text-[#E89B52]" />
              Password & Security Settings
            </h3>
            <p className="text-[11px] text-gray-400">
              Update your account password. Verification of your current password is required before saving.
            </p>
          </div>

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle size={16} /> Password changed successfully! You can now use your new password.
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
              <AlertCircle size={16} /> {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Current Password</label>
              <div className="relative flex items-center">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 pr-10 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-[#E89B52] cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">New Password</label>
              <div className="relative flex items-center">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 pr-10 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-[#E89B52] cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Confirm New Password</label>
              <div className="relative flex items-center">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 pr-10 bg-white border border-[#E7DED1] rounded-lg outline-none focus:border-[#E89B52]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-[#E89B52] cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 bg-[#2B2B2B] hover:bg-black text-white font-bold rounded-xl cursor-pointer transition flex items-center gap-2"
            >
              <Key size={14} className="text-[#E89B52]" />
              <span>{isChangingPassword ? 'Updating Password...' : 'Save New Password'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: NOTIFICATION PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-1.5">
              <Bell size={16} className="text-[#E89B52]" />
              Notification Subscriptions
            </h3>
            <p className="text-[11px] text-gray-400">Choose how Abel Begena School updates you regarding classes and payments.</p>
          </div>

          <div className="space-y-4 max-w-lg text-xs">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
              <div>
                <span className="block font-bold text-gray-800">Email Notifications</span>
                <span className="block text-[10px] text-gray-500">Receive class schedules, payment receipts and announcements.</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 accent-[#E89B52] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
              <div>
                <span className="block font-bold text-gray-800">SMS / Mobile Alerts</span>
                <span className="block text-[10px] text-gray-500">Urgent branch reminders and class cancellation alerts.</span>
              </div>
              <input
                type="checkbox"
                checked={smsNotifs}
                onChange={(e) => setSmsNotifs(e.target.checked)}
                className="w-4 h-4 accent-[#E89B52] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
              <div>
                <span className="block font-bold text-gray-800">Browser / In-App Notifications</span>
                <span className="block text-[10px] text-gray-500">Real-time alerts when logged into Abel Begena portal.</span>
              </div>
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="w-4 h-4 accent-[#E89B52] cursor-pointer"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-5 py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold rounded-xl cursor-pointer"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACADEMIC / ROLE OVERVIEW */}
      {activeTab === 'academic' && (
        <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Academic & Role Summary</h3>
            <p className="text-[11px] text-gray-400">System attributes assigned to your account.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Role</span>
              <span className="block font-bold text-base text-[#2B2B2B] capitalize">{currentUser.role.replace('_', ' ')}</span>
              <p className="text-[10px] text-gray-500">Access privileges verified in Auth Context.</p>
            </div>

            <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Registration Status</span>
              <span className="block font-bold text-base text-[#E89B52]">{currentUser.studentStatus || 'Active'}</span>
              <p className="text-[10px] text-gray-500">Academic verification level.</p>
            </div>

            <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Primary Branch</span>
              <span className="block font-bold text-base text-[#2B2B2B]">{currentUser.branch || 'Piazza Central Branch'}</span>
              <p className="text-[10px] text-gray-500">Addis Ababa, Ethiopia.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
