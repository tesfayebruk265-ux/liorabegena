import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  Globe,
  LogIn,
  Sparkles,
  MapPin,
  ChevronRight,
  ChevronDown,
  Info,
  Shield,
  Heart,
  Calendar,
  Compass,
  Palette,
  FileCheck,
  Layout,
  Youtube,
  Instagram,
  Facebook,
  Send,
  MessageSquare,
  HelpCircle,
  FileText,
  Check,
  Clock,
  Play,
  Bell,
  Settings,
  User,
  ShieldAlert,
  Lock,
  Sliders,
  LogOut,
  SlidersHorizontal,
  Mail,
  Phone,
  Briefcase,
  UserPlus,
  Home,
  Music,
  GraduationCap,
  Award,
  ShieldCheck,
  Presentation,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TiletPattern } from './components/TiletPattern';
import { TokenViewer } from './components/TokenViewer';
import { ComponentPlayground } from './components/ComponentPlayground';
import { GuidelinesSection } from './components/GuidelinesSection';
import { PageId, Language, UserRole } from './types';
import { TRANSLATIONS, COURSES_DATA, isCourseComingSoon, getLocalizedCourse, tr } from './data/websiteData';
import { Homepage } from './components/Homepage';
import {
  AboutAbelPage,
  AboutBegenaPage,
  CoursesPage,
  CourseDetailPage,
  TeachersPage,
  TeacherProfilePage,
  GalleryPage,
  EventsPage,
  EventDetailPage,
  ContactPage,
  DonatePage,
  GlobalSearch
} from './components/WebsitePages';

// Phase 2 Integrations
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import {
  LoginPage,
  RegisterPage,
  SteppedRegister,
  ForgotPasswordPage,
  VerifyAccountPage
} from './components/AuthComponents';
import {
  StudentDashboard,
  ParentDashboard,
  TeacherDashboard,
  RegistrationStaffDashboard,
  BranchManagerDashboard,
  AccountantDashboard,
  AdminDashboard,
  SuperAdminDashboard,
  FounderDashboard
} from './components/RoleDashboards';
import { EnrollmentWizard } from './components/EnrollmentWizard';

// Phase 10 Integrations
import { MessagesCenter } from './components/MessagesCenter';
import { CommunityCenter } from './components/CommunityCenter';
import { AnnouncementsCenter } from './components/AnnouncementsCenter';
import { NotificationsCenter } from './components/NotificationsCenter';
import { AdminCommunityManagement } from './components/AdminCommunityManagement';

// Phase 11 Integrations
import { LearningCenter } from './components/LearningCenter';
import { PracticeStudio } from './components/PracticeStudio';
import { MezmurLibraryCenter } from './components/MezmurLibraryCenter';
import { QuizAndAssessmentCenter } from './components/QuizAndAssessmentCenter';
import { LiveClassesCenter } from './components/LiveClassesCenter';
import { LmsTeacherAdminCenter } from './components/LmsTeacherAdminCenter';
import { ParentLearningView } from './components/ParentLearningView';

// Phase 12 Operations Integrations
import { OperationsCenter } from './components/operations/OperationsCenter';
import { BranchDetailView } from './components/operations/BranchDetailView';
import { ClassSchedulingCenter } from './components/operations/ClassSchedulingCenter';
import { RoomManagement } from './components/operations/RoomManagement';
import { StudentTransferCenter } from './components/operations/StudentTransferCenter';
import { MakeupClassesCenter } from './components/operations/MakeupClassesCenter';
import { InventoryAndStoreCenter } from './components/operations/InventoryAndStoreCenter';
import { MaintenanceAndExpensesCenter } from './components/operations/MaintenanceAndExpensesCenter';
import { StaffAndAvailabilityCenter } from './components/operations/StaffAndAvailabilityCenter';
import { AttendanceManagementCenter } from './components/operations/AttendanceManagementCenter';

// Phase 13 Online Store & Order Management Integrations
import { StoreComingSoonPage } from './components/StoreComingSoonPage';
import { StoreFront } from './components/store/StoreFront';
import { StoreCartView } from './components/store/StoreCartView';
import { StoreCheckoutView } from './components/store/StoreCheckoutView';
import { StoreOrdersView } from './components/store/StoreOrdersView';
import { BranchOrderDashboard } from './components/store/BranchOrderDashboard';
import { AdminStoreManagement } from './components/store/AdminStoreManagement';
import { StoreWishlistView } from './components/store/StoreWishlistView';
import { StoreReturnsView } from './components/store/StoreReturnsView';
import {
  SAMPLE_STORE_PRODUCTS,
  SAMPLE_STORE_ORDERS,
  SAMPLE_COUPONS,
  SAMPLE_RETURNS
} from './components/store/StoreData';
import { CartItem, WishlistItem, StoreOrder, StoreReturnRequest, StoreCoupon, StoreProductExtended } from './types';

// Phase 14 Analytics, Reporting & Founder Intelligence Center Integrations
import { AnalyticsCenter } from './components/analytics/AnalyticsCenter';
import { StudentAnalyticsView } from './components/analytics/StudentAnalyticsView';
import { TeacherAnalyticsView } from './components/analytics/TeacherAnalyticsView';
import { BranchAnalyticsView } from './components/analytics/BranchAnalyticsView';
import { AccountantAnalyticsView } from './components/analytics/AccountantAnalyticsView';
import { AdminAnalyticsView } from './components/analytics/AdminAnalyticsView';
import { FounderIntelligenceCenter } from './components/analytics/FounderIntelligenceCenter';
import { AIInsightsAndAssistant } from './components/analytics/AIInsightsAndAssistant';
import { ReportBuilderView } from './components/analytics/ReportBuilderView';

// Phase 15 Events, Competitions, Certificates, Achievements & Alumni Integrations
import { EventsCenter } from './components/events/EventsCenter';
import { CompetitionsCenter } from './components/events/CompetitionsCenter';
import { CertificatesCenter } from './components/events/CertificatesCenter';
import { AchievementsCenter } from './components/events/AchievementsCenter';
import { GraduationAndAlumniCenter } from './components/events/GraduationAndAlumniCenter';

// Phase 16 Marketing, CRM, Lead Management & Student Acquisition Integration
import { CrmCenter } from './components/crm/CrmCenter';

// Phase 17 Advanced AI Assistant, Smart Automation & Personalized Learning Engine Integration
import { AiAssistantCenter } from './components/ai/AiAssistantCenter';

// Phase 18 System Settings, Security, Backup & Disaster Recovery Integration
import { SettingsCenter } from './components/settings/SettingsCenter';
import { UserProfilePage } from './components/UserProfilePage';

// Phase 19 Master System Integration, QA & Launch Integration
import { HelpCenter } from './components/HelpCenter';
import { FounderPresentationMode } from './components/FounderPresentationMode';
import { QaAndLaunchDashboard } from './components/QaAndLaunchDashboard';
import logoImg from './assets/images/logo.jpg';

// Wrapper to inject context safely
export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </DataProvider>
  );
}

function AppContent() {
  const {
    currentUser,
    notifications,
    logout,
    updateProfile,
    addNotification,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    hasPermission
  } = useAuth();

  // Navigation & Workspace states
  const [viewMode, setViewMode] = useState<'website' | 'design-system'>('website');
  const [activePage, setActivePage] = useState<PageId>('home');
  const [pageParams, setPageParams] = useState<any>(null);
  const [lang, setLang] = useState<Language>('en');

  // Always start on the public home page when the app loads or reloads
  useEffect(() => {
    setActivePage('home');
    setPageParams(null);
  }, []);

  // Synchronize document language and Benaiah font class for Amharic translation
  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === 'am') {
      document.documentElement.classList.add('lang-am');
      document.body.classList.add('lang-am');
    } else {
      document.documentElement.classList.remove('lang-am');
      document.body.classList.remove('lang-am');
    }
  }, [lang]);

  // Interactive controls
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'about' | 'courses' | 'learning' | 'events' | 'more' | 'start-learning' | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Profile Editor modal toggle
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editEmergency, setEditEmergency] = useState('');

  // Settings Panel modal toggle
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  // Phase 13 Store State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [ordersList, setOrdersList] = useState<StoreOrder[]>(SAMPLE_STORE_ORDERS);
  const [returnsList, setReturnsList] = useState<StoreReturnRequest[]>(SAMPLE_RETURNS);
  const [appliedCoupon, setAppliedCoupon] = useState<StoreCoupon | null>(null);

  const handleAddToCart = (product: StoreProductExtended, quantity: number = 1, variantId?: string, branchId?: string) => {
    if (!product) return;
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === product.id && (!variantId || item.variantId === variantId)
    );

    const branch = product.branchStock?.find((b) => b.branchId === (branchId || 'b-piazza')) || product.branchStock?.[0];

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const variant = product.variants?.find((v) => v.id === variantId);
      const newItem: CartItem = {
        id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        category: product.category,
        variantId: variant?.id,
        variantName: variant?.variantName,
        priceETB: variant ? variant.priceETB : product.priceETB,
        quantity,
        selectedBranchId: branch?.branchId || 'b-piazza',
        selectedBranchName: branch?.branchName || 'Piazza Branch',
        condition: product.condition,
        sku: variant?.sku || product.sku,
        isSavedForLater: false
      };
      setCartItems([...cartItems, newItem]);
    }

    addNotification('Cart Updated', `${quantity}x ${product.name} added to shopping cart!`, 'system');
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(cartItems.filter((i) => i.id !== cartItemId));
    } else {
      setCartItems(cartItems.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty } : i)));
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(cartItems.filter((i) => i.id !== cartItemId));
  };

  const handleToggleSaveForLater = (cartItemId: string) => {
    setCartItems(
      cartItems.map((i) => (i.id === cartItemId ? { ...i, isSavedForLater: !i.isSavedForLater } : i))
    );
  };

  const handleToggleWishlist = (product: StoreProductExtended) => {
    if (!product) return;
    const exists = wishlistItems.some((w) => w.productId === product.id);
    if (exists) {
      setWishlistItems(wishlistItems.filter((w) => w.productId !== product.id));
      addNotification('Wishlist', `Removed ${product.name} from wishlist`, 'system');
    } else {
      const wItem: WishlistItem = {
        id: `w-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        priceETB: product.priceETB,
        category: product.category,
        inStock: product.stockQuantity > 0,
        addedDate: new Date().toISOString().substring(0, 10)
      };
      setWishlistItems([...wishlistItems, wItem]);
      addNotification('Wishlist', `Added ${product.name} to wishlist`, 'system');
    }
  };

  const handleOrderCreated = (newOrder: StoreOrder) => {
    setOrdersList([newOrder, ...ordersList]);
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: StoreOrder['orderStatus'],
    newPaymentStatus?: StoreOrder['paymentStatus'],
    note?: string
  ) => {
    setOrdersList(
      ordersList.map((o) => {
        if (o.id !== orderId) return o;
        const updatedTimeline = [
          ...o.timeline,
          {
            status: newStatus,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            note,
            updatedBy: currentUser?.fullName || 'Staff'
          }
        ];
        return {
          ...o,
          orderStatus: newStatus,
          paymentStatus: newPaymentStatus || o.paymentStatus,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          timeline: updatedTimeline
        };
      })
    );
  };

  const handleRequestReturn = (request: StoreReturnRequest) => {
    setReturnsList([request, ...returnsList]);
  };

  // Original Phase 0 tab states
  const [activeTab, setActiveTab] = useState<'playground' | 'tokens' | 'guidelines' | 'future'>('playground');
  const [futureSubTab, setFutureSubTab] = useState<'lms' | 'payment' | 'admin'>('lms');

  // Scroll position state for sticky navigation
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = TRANSLATIONS[lang];

  // Auto-redirect authenticated user if sitting on login/register pages
  useEffect(() => {
    if (currentUser && (activePage === 'login' || activePage === 'register')) {
      const roleToPageMap: Record<string, PageId> = {
        student: 'student',
        teacher: 'teacher',
        parent: 'parent',
        branch_manager: 'branch_manager',
        accountant: 'accountant',
        admin: 'admin',
        super_admin: 'super_admin',
        founder: 'founder',
        registration_staff: 'registration_staff'
      };
      const targetPage = roleToPageMap[currentUser.role] || 'student';
      setActivePage(targetPage);
    }
  }, [currentUser, activePage]);

  // Helper function to handle routing and verify auth guards
  const navigateTo = (page: string, params: any = null) => {
    const targetPage = page as PageId;

    // Determine active user dynamically from state or active local storage session to prevent stale closure issues
    const activeUser = currentUser || (() => {
      try {
        const saved = localStorage.getItem('ab_session_user');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    })();

    // 1. AUTH ROUTE GUARDS (Requirement 22, 23)
    const dashboardPages: PageId[] = [
      'student', 'parent', 'teacher', 'registration_staff', 
      'branch_manager', 'accountant', 'admin', 'super_admin', 'founder'
    ];

    const isTargetingDashboard = dashboardPages.includes(targetPage);

    if (isTargetingDashboard && !activeUser) {
      // Unauthenticated access blocked -> redirect to login
      setActivePage('login');
      addNotification(
        'Authentication Required',
        'Please log in to access the protected dashboard portals.',
        'system'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (userRequiresVerification && targetPage !== 'verify-account' && targetPage !== 'login' && targetPage !== 'register' && targetPage !== 'forgot-password' && !publicPages.includes(targetPage)) {
      setActivePage('verify-account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (isTargetingDashboard && activeUser) {
      // Check role authorization for protected dashboards
      const allowedRoleMap: Partial<Record<PageId, UserRole>> = {
        student: 'student',
        parent: 'parent',
        teacher: 'teacher',
        registration_staff: 'registration_staff',
        branch_manager: 'branch_manager',
        accountant: 'accountant',
        admin: 'admin',
        super_admin: 'super_admin',
        founder: 'founder',
        'student-dashboard': 'student',
        'parent-dashboard': 'parent',
        'teacher-dashboard': 'teacher',
        'registration-dashboard': 'registration_staff',
        'branch-manager-dashboard': 'branch_manager',
        'accountant-dashboard': 'accountant',
        'admin-dashboard': 'admin',
        'super-admin-dashboard': 'super_admin',
        'founder-dashboard': 'founder'
      };

      const requiredRole = allowedRoleMap[targetPage];
      if (requiredRole && activeUser.role !== requiredRole && activeUser.role !== 'super_admin') {
        const roleToPageMap: Record<string, PageId> = {
          student: 'student',
          teacher: 'teacher',
          parent: 'parent',
          branch_manager: 'branch_manager',
          accountant: 'accountant',
          admin: 'admin',
          super_admin: 'super_admin',
          founder: 'founder',
          registration_staff: 'registration_staff'
        };
        const ownPage = roleToPageMap[activeUser.role] || 'student';
        addNotification(
          'Access Denied',
          `Unauthorized access attempt to ${requiredRole} portal. Redirected to your authorized dashboard.`,
          'system'
        );
        setActivePage(ownPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Auto-redirect authenticated users trying to access login/register
    if ((targetPage === 'login' || targetPage === 'register') && activeUser) {
      if (userRequiresVerification) {
        setActivePage('verify-account');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const roleToPageMap: Record<string, PageId> = {
        student: 'student',
        teacher: 'teacher',
        parent: 'parent',
        branch_manager: 'branch_manager',
        accountant: 'accountant',
        admin: 'admin',
        super_admin: 'super_admin',
        founder: 'founder',
        registration_staff: 'registration_staff'
      };
      const targetRedirectPage = roleToPageMap[activeUser.role] || 'student';
      setActivePage(targetRedirectPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActivePage(targetPage);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const publicPages: PageId[] = [
    'home',
    'about-abel',
    'about-begena',
    'courses',
    'course-detail',
    'teachers',
    'teacher-profile',
    'gallery',
    'events',
    'event-detail',
    'contact',
    'donate',
    'store',
    'store-categories',
    'help-center',
    'login',
    'register',
    'stepped-register',
    'forgot-password',
    'verify-account'
  ];

  const userRequiresVerification = !!currentUser && (!currentUser.verified || currentUser.status === 'Pending Verification');

  useEffect(() => {
    if (userRequiresVerification && activePage !== 'verify-account' && !publicPages.includes(activePage)) {
      setActivePage('verify-account');
      return;
    }

    if (currentUser) {
      const dashboardRoleMap: Partial<Record<PageId, UserRole>> = {
        student: 'student',
        parent: 'parent',
        teacher: 'teacher',
        registration_staff: 'registration_staff',
        branch_manager: 'branch_manager',
        accountant: 'accountant',
        admin: 'admin',
        super_admin: 'super_admin',
        founder: 'founder',
        'student-dashboard': 'student',
        'parent-dashboard': 'parent',
        'teacher-dashboard': 'teacher',
        'registration-dashboard': 'registration_staff',
        'branch-manager-dashboard': 'branch_manager',
        'accountant-dashboard': 'accountant',
        'admin-dashboard': 'admin',
        'super-admin-dashboard': 'super_admin',
        'founder-dashboard': 'founder'
      };

      const requiredRole = dashboardRoleMap[activePage];
      if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'super_admin') {
        const roleToPageMap: Record<string, PageId> = {
          student: 'student',
          teacher: 'teacher',
          parent: 'parent',
          branch_manager: 'branch_manager',
          accountant: 'accountant',
          admin: 'admin',
          super_admin: 'super_admin',
          founder: 'founder',
          registration_staff: 'registration_staff'
        };
        const ownPage = roleToPageMap[currentUser.role] || 'student';
        setActivePage(ownPage);
      }
    }
  }, [currentUser, activePage, userRequiresVerification]);

  const handleDropdownItemClick = (page: PageId, params: any = null) => {
    navigateTo(page, params);
    setActiveDropdown(null);
  };

  // Open profile editor and pre-load user data fields
  const handleOpenProfileEditor = () => {
    if (!currentUser) return;
    setEditName(currentUser.fullName);
    setEditEmail(currentUser.email);
    setEditPhone(currentUser.phone || '');
    setEditAddress(currentUser.address || '');
    setEditEmergency(typeof currentUser.emergencyContact === 'object' ? currentUser.emergencyContact?.name || '' : (currentUser.emergencyContact || ''));
    setIsProfileEditorOpen(false);
    setIsProfileMenuOpen(false);
    navigateTo('profile');
  };

  const handleSaveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: editName,
      email: editEmail,
      phone: editPhone,
      address: editAddress,
      emergencyContact: {
        name: editEmergency,
        relation: 'Emergency Contact',
        phone: editPhone
      }
    });
    setIsProfileEditorOpen(false);
    addNotification('Profile Saved', 'Your personal account details have been successfully synchronized.', 'registration');
  };

  const handleLogoutAction = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigateTo('home');
  };

  // Unread notification count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`min-h-screen flex flex-col bg-[#FFFDF8] text-[#2B2B2B] antialiased select-none ${lang === 'am' ? 'font-benaiah font-amharic' : 'font-sans'} max-w-full overflow-x-hidden`}>
      
      {/* Tilet Pattern */}
      <TiletPattern variant="gold-warm" height={10} opacity={0.95} />

      {viewMode === 'website' ? (
        // ==========================================
        // MAIN PUBLIC WEBSITE (PHASE 1)
        // ==========================================
        <div className="flex-1 flex flex-col min-w-0">
          {/* HEADER & GLOBAL NAVIGATION */}
          <header className={`sticky top-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-[#E7DED1] py-2.5' : 'bg-[#FFFDF8] border-b border-[#E7DED1]/50 py-3.5'}`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 flex items-center justify-between gap-1.5 sm:gap-3 relative min-w-0">
              
              {/* Back drop to close dropdowns on click outside */}
              {activeDropdown && (
                <div
                  className="fixed inset-0 z-[45] bg-transparent"
                  onClick={() => setActiveDropdown(null)}
                />
              )}
              
              {/* 1. BRAND LOGO STAMP */}
              <div
                className="flex items-center gap-1.5 sm:gap-3 cursor-pointer text-left shrink-0 min-w-0"
                onClick={() => navigateTo('home')}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center border border-[#C79A2B]/40 relative overflow-hidden shadow-xs shrink-0 p-0.5">
                  <img src={logoImg} alt="Liora Begena School Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm lg:text-base font-black tracking-tighter text-[#2B2B2B] font-display truncate">
                    LIORA BEGENA SCHOOL
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#6F4E37] font-bold -mt-0.5 hidden sm:block">
                    Traditional Ethiopian Begena
                  </span>
                </div>
              </div>

              {/* 2. ROLE-AWARE DESKTOP NAVIGATION ITEMS */}
              <nav className="hidden xl:flex items-center gap-1 xl:gap-1.5 2xl:gap-2 text-[11px] 2xl:text-xs font-bold text-[#666666] uppercase relative whitespace-nowrap">
                
                {/* CASE A: PUBLIC VISITOR (UNAUTHENTICATED) */}
                {!currentUser && (
                  <>
                    <button onClick={() => navigateTo('home')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'home' ? 'text-[#E89B52] font-black' : ''}`}>
                      {t.nav.home}
                    </button>

                    {/* About Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
                        className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors flex items-center gap-1 cursor-pointer ${activePage === 'about-abel' || activePage === 'about-begena' ? 'text-[#E89B52]' : ''}`}
                      >
                        <span>{t.nav.about}</span>
                        <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'about' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 bg-white border border-[#E7DED1] rounded-lg shadow-lg py-2 w-48 text-left normal-case font-medium z-50"
                          >
                            <button onClick={() => handleDropdownItemClick('about-abel')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{lang === 'am' ? 'ስለ ብሩክ' : 'About Bruk'}</button>
                            <button onClick={() => handleDropdownItemClick('about-begena')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{lang === 'am' ? 'የበገና ታሪክ' : 'Begena History'}</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Courses Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'courses' ? null : 'courses')}
                        className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors flex items-center gap-1 cursor-pointer ${activePage === 'courses' || activePage === 'course-detail' ? 'text-[#E89B52]' : ''}`}
                      >
                        <span>{t.nav.courses}</span>
                        <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'courses' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 bg-white border border-[#E7DED1] rounded-lg shadow-lg py-2 w-56 text-left normal-case font-medium z-50"
                          >
                            {COURSES_DATA.map((course) => {
                              const localizedCourse = getLocalizedCourse(course, lang);
                              const isSoon = isCourseComingSoon(course.id);
                              return (
                                <button
                                  key={course.id}
                                  onClick={() => handleDropdownItemClick('course-detail', { courseId: course.id })}
                                  className="flex items-center justify-between w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold"
                                >
                                  <span>{localizedCourse.name}</span>
                                  {isSoon && (
                                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded uppercase">
                                      {lang === 'am' ? 'በቅርቡ' : 'Soon'}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                            <div className="border-t border-[#E7DED1] mt-1 pt-1">
                              <button onClick={() => handleDropdownItemClick('courses')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#E89B52] font-bold uppercase">{lang === 'am' ? 'ሁሉንም ትምህርቶች ይመልከቱ' : 'View All Courses'}</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button onClick={() => navigateTo('teachers')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'teachers' || activePage === 'teacher-profile' ? 'text-[#E89B52]' : ''}`}>
                      {t.nav.teachers}
                    </button>

                    {/* Learning Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'learning' ? null : 'learning')}
                        className="px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t.nav.learning}</span>
                        <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'learning' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 bg-white border border-[#E7DED1] rounded-lg shadow-lg py-2 w-52 text-left normal-case font-medium z-50"
                          >
                            <button onClick={() => handleDropdownItemClick('home')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{t.nav.howItWorks}</button>
                            <button onClick={() => handleDropdownItemClick('courses')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{lang === 'am' ? 'የኦንላይን ትምህርት' : 'Online Learning Mode'}</button>
                            <button onClick={() => handleDropdownItemClick('contact')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{lang === 'am' ? 'የአካል ቅርንጫፎች' : 'Physical Branches'}</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button onClick={() => navigateTo('gallery')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'gallery' ? 'text-[#E89B52]' : ''}`}>
                      {lang === 'am' ? 'ሚዲያ' : 'Media'}
                    </button>

                    {/* Events Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'events' ? null : 'events')}
                        className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors flex items-center gap-1 cursor-pointer ${['events', 'competitions', 'certificates', 'graduation', 'alumni'].includes(activePage) ? 'text-[#E89B52]' : ''}`}
                      >
                        <span>{t.nav.events}</span>
                        <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'events' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 bg-white border border-[#E7DED1] rounded-lg shadow-lg py-2 w-56 text-left normal-case font-medium z-50"
                          >
                            <button onClick={() => handleDropdownItemClick('events')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{lang === 'am' ? 'የናጌን ኮንሰርት' : 'Nagen'}</button>
                            <button onClick={() => handleDropdownItemClick('competitions')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{lang === 'am' ? 'የወጣቶች በገና ውድድር' : 'Youth Begena Competitions'}</button>
                            <button onClick={() => handleDropdownItemClick('graduation')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{lang === 'am' ? 'የምረቃ ስነ-ስርዓት' : 'Graduation Ceremony'}</button>
                            <button onClick={() => handleDropdownItemClick('alumni')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B] font-semibold">{lang === 'am' ? 'የምሩቃን ህብረት' : 'Alumni & Mentorship'}</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Contact Us link directly for public visitors */}
                    <button onClick={() => navigateTo('contact')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'contact' ? 'text-[#E89B52] font-black' : ''}`}>
                      {t.nav.contact}
                    </button>
                  </>
                )}

                {/* CASE B: STUDENT SPECIFIC NAVIGATION */}
                {currentUser?.role === 'student' && (
                  <>
                    <button onClick={() => navigateTo('student')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'student' ? 'text-[#E89B52] font-black' : ''}`}>
                      Dashboard
                    </button>
                    <button onClick={() => navigateTo('learn')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'learn' ? 'text-[#E89B52] font-black' : ''}`}>
                      My Learning
                    </button>
                    <button onClick={() => navigateTo('practice')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'practice' ? 'text-[#E89B52] font-black' : ''}`}>
                      Practice
                    </button>
                    <button onClick={() => navigateTo('community')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'community' ? 'text-[#E89B52] font-black' : ''}`}>
                      Community
                    </button>
                    <button onClick={() => navigateTo('store')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'store' ? 'text-[#E89B52] font-black' : ''}`}>
                      Store
                    </button>

                    {/* Student More Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                        className="px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>More</span>
                        <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'more' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 bg-white border border-[#E7DED1] rounded-lg shadow-lg py-2 w-48 text-left normal-case font-medium z-50"
                          >
                            <button onClick={() => handleDropdownItemClick('certificates')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Certificates</button>
                            <button onClick={() => handleDropdownItemClick('achievements')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Achievements</button>
                            <button onClick={() => handleDropdownItemClick('analytics')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Progress</button>
                            <button onClick={() => handleDropdownItemClick('registration-gate')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">My Payments</button>
                            <button onClick={() => handleDropdownItemClick('donate')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#E89B52] font-bold">Donate / Support</button>
                            <button onClick={() => handleDropdownItemClick('help-center')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Support</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                {/* CASE C: TEACHER SPECIFIC NAVIGATION */}
                {currentUser?.role === 'teacher' && (
                  <>
                    <button onClick={() => navigateTo('teacher')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'teacher' ? 'text-[#E89B52] font-black' : ''}`}>
                      Dashboard
                    </button>
                    <button onClick={() => navigateTo('teacher')} className="px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer">
                      My Classes
                    </button>
                    <button onClick={() => navigateTo('community')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'community' ? 'text-[#E89B52] font-black' : ''}`}>
                      Community
                    </button>
                    <button onClick={() => navigateTo('store')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'store' ? 'text-[#E89B52] font-black' : ''}`}>
                      Store
                    </button>

                    {/* Teacher More Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                        className="px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>More</span>
                        <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'more' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 bg-white border border-[#E7DED1] rounded-lg shadow-lg py-2 w-48 text-left normal-case font-medium z-50"
                          >
                            <button onClick={() => handleDropdownItemClick('mezmur-library')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Resources</button>
                            <button onClick={() => handleDropdownItemClick('announcements')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Announcements</button>
                            <button onClick={() => handleDropdownItemClick('analytics')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Reports</button>
                            <button onClick={() => handleDropdownItemClick('donate')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#E89B52] font-bold">Donate / Support</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                {/* CASE D: PARENT SPECIFIC NAVIGATION */}
                {currentUser?.role === 'parent' && (
                  <>
                    <button onClick={() => navigateTo('parent')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'parent' ? 'text-[#E89B52] font-black' : ''}`}>
                      Dashboard
                    </button>
                    <button onClick={() => navigateTo('parent')} className="px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer">
                      My Children
                    </button>
                    <button onClick={() => navigateTo('community')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'community' ? 'text-[#E89B52] font-black' : ''}`}>
                      Community
                    </button>
                    <button onClick={() => navigateTo('store')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'store' ? 'text-[#E89B52] font-black' : ''}`}>
                      Store
                    </button>

                    {/* Parent More Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                        className="px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>More</span>
                        <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'more' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 bg-white border border-[#E7DED1] rounded-lg shadow-lg py-2 w-48 text-left normal-case font-medium z-50"
                          >
                            <button onClick={() => handleDropdownItemClick('donate')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#E89B52] font-bold">Donate / Support</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

                {/* CASE E: ADMINISTRATIVE ROLES (ADMIN, SUPER ADMIN, FOUNDER, BRANCH MANAGER, ACCOUNTANT, REGISTRATION) */}
                {currentUser && ['admin', 'super_admin', 'founder', 'branch_manager', 'accountant', 'registration_staff'].includes(currentUser.role) && (
                  <>
                    <button onClick={() => navigateTo(currentUser.role as PageId)} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === currentUser.role ? 'text-[#E89B52] font-black' : ''}`}>
                      Dashboard
                    </button>

                    {/* CRM Labeled strictly "CRM" for Admin, Branch Manager, Founder, Super Admin */}
                    {['admin', 'branch_manager', 'founder', 'super_admin'].includes(currentUser.role) && (
                      <button
                        onClick={() => navigateTo('crm')}
                        className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'crm' ? 'text-[#E89B52] font-black' : ''}`}
                      >
                        CRM
                      </button>
                    )}

                    <button onClick={() => navigateTo('community')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'community' ? 'text-[#E89B52] font-black' : ''}`}>
                      Community
                    </button>

                    <button onClick={() => navigateTo('store')} className={`px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors cursor-pointer ${activePage === 'store' ? 'text-[#E89B52] font-black' : ''}`}>
                      Store
                    </button>

                    {/* Admin More Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                        className="px-2.5 py-1.5 rounded-md hover:text-[#E89B52] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>More</span>
                        <ChevronDown size={12} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === 'more' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 bg-white border border-[#E7DED1] rounded-lg shadow-lg py-2 w-48 text-left normal-case font-medium z-50"
                          >
                            <button onClick={() => handleDropdownItemClick('analytics')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Analytics</button>
                            <button onClick={() => handleDropdownItemClick('audit-logs')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Audit Logs</button>
                            <button onClick={() => handleDropdownItemClick('donate')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#E89B52] font-bold">Donate / Support</button>
                            <button onClick={() => handleDropdownItemClick('help-center')} className="block w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-[#2B2B2B]">Help Center</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}

              </nav>

              {/* 3. RIGHT CONTROLS SECTION */}
              <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
                
                {/* Global Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 sm:p-2 text-[#666666] hover:text-[#E89B52] rounded-md transition-colors cursor-pointer border border-transparent hover:border-[#E7DED1]"
                  title="Search Website"
                >
                  <Search size={16} />
                </button>

                {/* Language Toggler */}
                <button
                  onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                  className="flex items-center gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-md bg-[#FAF6EF] hover:bg-[#FAF6EF]/80 text-[#6F4E37] text-xs font-bold border border-[#E7DED1] cursor-pointer"
                >
                  <Globe size={13} />
                  <span>{lang === 'en' ? 'አማርኛ' : 'EN'}</span>
                </button>

                {/* Theme Switcher Toggle */}
                <ThemeToggle variant="pill" />

                {/* AUTHENTICATION CONTROL (VISITOR VS AUTHENTICATED) */}
                {currentUser ? (
                  <div className="flex items-center gap-2 relative">
                    
                    {/* NOTIFICATION BELL */}
                    <div className="relative">
                      <button
                        onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileMenuOpen(false); }}
                        className="p-2 hover:text-[#E89B52] text-gray-500 rounded-md border border-transparent hover:border-[#E7DED1] cursor-pointer relative"
                        title="Notifications"
                      >
                        <Bell size={16} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      <AnimatePresence>
                        {isNotificationOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-[105] bg-black/5"
                              onClick={() => setIsNotificationOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute right-0 mt-2 bg-white border border-[#E7DED1] w-80 rounded-2xl shadow-xl py-3 z-[110] overflow-hidden text-left"
                            >
                              <div className="flex justify-between items-center px-4 pb-2 border-b border-gray-100">
                                <h4 className="font-display font-black text-xs uppercase text-[#2B2B2B]">Notifications</h4>
                                {unreadCount > 0 && (
                                  <button
                                    onClick={markAllNotificationsAsRead}
                                    className="text-[10px] text-[#E89B52] font-bold uppercase hover:underline cursor-pointer"
                                  >
                                    Mark all as read
                                  </button>
                                )}
                              </div>

                              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                                {notifications.length === 0 ? (
                                  <div className="p-6 text-center text-xs text-gray-400 italic">
                                    No notifications recorded.
                                  </div>
                                ) : (
                                  notifications.map((notif, idx) => (
                                    <div
                                      key={notif.id ? `${notif.id}_${idx}` : `notif_${idx}`}
                                      onClick={() => markNotificationAsRead(notif.id)}
                                      className={`p-3 text-left transition-colors cursor-pointer flex gap-2.5 items-start ${notif.isRead ? 'bg-white opacity-60' : 'bg-[#FAF6EF]/40'}`}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#E89B52] mt-1.5 shrink-0" />
                                      <div className="space-y-0.5">
                                        <span className="block font-bold text-xs text-gray-800">{notif.title}</span>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">{notif.description}</p>
                                        <span className="text-[9px] font-mono text-gray-400 capitalize">{notif.category}</span>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* USER PROFILE AVATAR MENU */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(!isProfileMenuOpen);
                          setIsNotificationOpen(false);
                          handleOpenProfileEditor();
                        }}
                        title="Click to view Account Profile & options"
                        className={`w-9 h-9 rounded-full bg-[#2B2B2B] text-[#E89B52] border-2 ${
                          isProfileMenuOpen ? 'border-[#E89B52] ring-2 ring-[#E89B52]/30' : 'border-[#E7DED1] hover:border-[#E89B52]'
                        } flex items-center justify-center font-display font-black text-xs cursor-pointer shadow-xs transition-all active:scale-95`}
                      >
                        {currentUser.fullName ? currentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </button>

                      <AnimatePresence>
                        {isProfileMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-[105] bg-black/5"
                              onClick={() => setIsProfileMenuOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              className="absolute right-0 mt-2 bg-white border border-[#E7DED1] w-60 rounded-2xl shadow-2xl py-2 z-[110] text-left overflow-hidden"
                            >
                              <div
                                onClick={handleOpenProfileEditor}
                                className="px-4 py-3 bg-[#FAF6EF] hover:bg-[#F3ECE0] border-b border-[#E7DED1] cursor-pointer transition-colors group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="block font-bold text-xs text-gray-800 group-hover:text-[#E89B52] transition-colors">{currentUser.fullName}</span>
                                  <span className="text-[9px] bg-[#E89B52] text-white px-1.5 py-0.5 rounded font-bold uppercase">{currentUser.role.replace('_', ' ')}</span>
                                </div>
                                <span className="block text-[10px] text-gray-400 font-mono mt-0.5 truncate">{currentUser.email}</span>
                                <span className="inline-flex items-center gap-1 text-[10px] text-[#E89B52] font-bold mt-1.5 group-hover:underline">
                                  <span>View Account Profile</span> →
                                </span>
                              </div>

                              <div className="py-1">
                                <button
                                  onClick={() => { setIsProfileMenuOpen(false); navigateTo(currentUser.role as PageId); }}
                                  className="w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-gray-700 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <Layout size={14} className="text-[#E89B52]" />
                                  <span>Go to My Dashboard</span>
                                </button>

                                <button
                                  onClick={handleOpenProfileEditor}
                                  className="w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-gray-700 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <User size={14} className="text-[#E89B52]" />
                                  <span>My Account Profile</span>
                                </button>

                                <button
                                  onClick={() => { setIsProfileMenuOpen(false); navigateTo('register'); }}
                                  className="w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-gray-700 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <UserPlus size={14} className="text-[#E89B52]" />
                                  <span>Register New Account</span>
                                </button>

                                <button
                                  onClick={() => { setIsProfileMenuOpen(false); setIsSettingsPanelOpen(true); }}
                                  className="w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-gray-700 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <Settings size={14} className="text-[#E89B52]" />
                                  <span>Ecosystem Settings</span>
                                </button>
                              </div>

                              <div className="border-t border-gray-100 my-1" />

                              <button
                                onClick={handleLogoutAction}
                                className="w-full text-left px-4 py-2 hover:bg-[#FAF6EF] text-xs text-red-600 font-bold flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <LogOut size={14} />
                                <span>Log Out / Switch Account</span>
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                ) : (
                  /* PUBLIC VISITOR ACTIONS: LOGIN & START LEARNING (NEVER DISAPPEAR ON DESKTOP OR MOBILE) */
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => navigateTo('login')}
                      className="flex items-center gap-1 text-xs font-bold text-[#666666] hover:text-[#2B2B2B] px-2 sm:px-2.5 py-1.5 rounded-lg border border-[#E7DED1] hover:border-[#E89B52] bg-white transition-all cursor-pointer whitespace-nowrap"
                    >
                      <LogIn size={14} className="text-[#E89B52]" />
                      <span>{t.nav.login}</span>
                    </button>

                    {/* START LEARNING BUTTON WITH TRACK SELECTION */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === 'start-learning' ? null : 'start-learning')}
                        className="bg-[#E89B52] hover:bg-[#d4863e] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-3xs flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <span>{lang === 'am' ? 'መማር ይጀምሩ' : 'Get started'}</span>
                        <ChevronDown size={12} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === 'start-learning' && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full right-0 mt-2 bg-white border border-[#E7DED1] rounded-xl shadow-xl py-2 w-64 text-left normal-case font-medium z-50 overflow-hidden"
                          >
                            <div className="px-4 py-2.5 bg-[#FAF6EF] border-b border-gray-100">
                              <span className="block font-bold text-xs text-[#2B2B2B]">{lang === 'am' ? 'ሊዮራ በገና ትምህርት ቤትን ይቀላቀሉ' : 'Join Liora Begena School'}</span>
                              <span className="block text-[10px] text-gray-500">{lang === 'am' ? 'የመመዝገቢያ መንገድ ይምረጡ' : 'Choose registration track'}</span>
                            </div>

                            <button
                              onClick={() => { setActiveDropdown(null); navigateTo('register', { defaultRole: 'student' }); }}
                              className="w-full text-left px-4 py-2.5 hover:bg-[#FAF6EF] text-xs font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
                            >
                              <span className="w-2 h-2 rounded-full bg-[#E89B52]" />
                              <span>{lang === 'am' ? 'የተማሪዎች ምዝገባ' : 'Student Portal Registration'}</span>
                            </button>

                            <button
                              onClick={() => { setActiveDropdown(null); navigateTo('register', { defaultRole: 'parent' }); }}
                              className="w-full text-left px-4 py-2.5 hover:bg-[#FAF6EF] text-xs font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span>{lang === 'am' ? 'የወላጆች / አሳዳጊዎች ምዝገባ' : 'Parent / Guardian Portal'}</span>
                            </button>

                            <button
                              onClick={() => { setActiveDropdown(null); navigateTo('register', { defaultRole: 'teacher' }); }}
                              className="w-full text-left px-4 py-2.5 hover:bg-[#FAF6EF] text-xs font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>{lang === 'am' ? 'የመምህራን ማመልከቻ' : 'Teacher Application'}</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Mobile Hamburger menu */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="xl:hidden p-2 text-[#2B2B2B] hover:text-[#E89B52] cursor-pointer border border-[#E7DED1] rounded-md"
                  aria-label="Toggle Navigation Menu"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

            </div>
          </header>

          {/* MOBILE NAVIGATION DRAWER */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="xl:hidden border-b border-[#E7DED1] bg-[#FFFDF8] overflow-hidden z-30"
              >
                <div className="px-6 py-6 space-y-4 text-left text-xs font-bold text-[#666666] uppercase">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E7DED1]">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{lang === 'am' ? 'የገጽታ ቀለም' : 'Appearance Mode'}</span>
                    <ThemeToggle variant="pill" />
                  </div>
                  {!currentUser ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('home'); }} className="p-3 bg-[#FAF6EF] rounded-xl text-center">{t.nav.home}</button>
                        <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('courses'); }} className="p-3 bg-[#FAF6EF] rounded-xl text-center">{t.nav.courses}</button>
                        <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('teachers'); }} className="p-3 bg-[#FAF6EF] rounded-xl text-center">{t.nav.teachers}</button>
                        <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('gallery'); }} className="p-3 bg-[#FAF6EF] rounded-xl text-center">{t.nav.gallery}</button>
                        <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('events'); }} className="p-3 bg-[#FAF6EF] rounded-xl text-center">{t.nav.events}</button>
                        <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('contact'); }} className="p-3 bg-[#FAF6EF] rounded-xl text-center">{t.nav.contact}</button>
                      </div>

                      <div className="border-t border-[#E7DED1] pt-3 flex flex-col gap-2">
                        <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('about-abel'); }} className="text-left py-2 border-b border-[#FAF6EF]">{lang === 'am' ? 'ስለ ብሩክ' : 'About Bruk'}</button>
                        <button onClick={() => { setIsMobileMenuOpen(false); navigateTo('about-begena'); }} className="text-left py-2 border-b border-[#FAF6EF]">{lang === 'am' ? 'የበገና ታሪክ' : 'Begena History'}</button>
                      </div>

                      <div className="flex flex-col gap-2 pt-3 border-t border-[#E7DED1]">
                        <button
                          onClick={() => { setIsMobileMenuOpen(false); navigateTo('login'); }}
                          className="w-full bg-[#2B2B2B] text-white py-3 text-center rounded-lg cursor-pointer font-bold"
                        >
                          {t.nav.login}
                        </button>
                        <button
                          onClick={() => { setIsMobileMenuOpen(false); navigateTo('register'); }}
                          className="w-full bg-[#E89B52] text-white py-3 text-center rounded-lg cursor-pointer font-bold"
                        >
                          {lang === 'am' ? 'መማር ይጀምሩ (ይመዝገቡ)' : 'Start Learning (Register)'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div
                        onClick={() => { setIsMobileMenuOpen(false); handleOpenProfileEditor(); }}
                        className="p-3 bg-[#FAF6EF] hover:bg-[#F3ECE0] rounded-xl border border-[#E7DED1] cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <span className="block font-bold text-gray-800">{currentUser.fullName}</span>
                          <span className="block text-[10px] text-gray-400 font-mono">{currentUser.email} ({currentUser.role.toUpperCase()})</span>
                        </div>
                        <User size={16} className="text-[#E89B52]" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E7DED1]">
                        <button
                          onClick={() => { setIsMobileMenuOpen(false); navigateTo('community'); }}
                          className="p-2.5 bg-[#FAF6EF] rounded-xl text-center font-bold text-[#2B2B2B] hover:bg-[#E89B52] hover:text-white transition-colors"
                        >
                          Community
                        </button>
                        <button
                          onClick={() => { setIsMobileMenuOpen(false); navigateTo('store'); }}
                          className="p-2.5 bg-[#FAF6EF] rounded-xl text-center font-bold text-[#2B2B2B] hover:bg-[#E89B52] hover:text-white transition-colors"
                        >
                          Store
                        </button>
                        <button
                          onClick={() => { setIsMobileMenuOpen(false); navigateTo('donate'); }}
                          className="p-2.5 bg-[#FAF6EF] rounded-xl text-center font-bold text-[#E89B52] hover:bg-[#E89B52] hover:text-white transition-colors"
                        >
                          Donate
                        </button>
                      </div>

                      <button
                        onClick={() => { setIsMobileMenuOpen(false); handleOpenProfileEditor(); }}
                        className="w-full bg-[#E89B52] text-white py-2.5 text-center rounded-lg cursor-pointer font-bold flex items-center justify-center gap-2"
                      >
                        <User size={14} />
                        <span>My Account Profile</span>
                      </button>
                      <button
                        onClick={() => { setIsMobileMenuOpen(false); navigateTo(currentUser.role as PageId); }}
                        className="w-full bg-[#2B2B2B] text-white py-2.5 text-center rounded-lg cursor-pointer font-bold"
                      >
                        Go to My Dashboard
                      </button>
                      <button
                        onClick={() => { setIsMobileMenuOpen(false); navigateTo('register'); }}
                        className="w-full bg-[#FAF6EF] hover:bg-[#F3ECE0] text-[#2B2B2B] border border-[#E7DED1] py-2.5 text-center rounded-lg cursor-pointer font-bold flex items-center justify-center gap-2"
                      >
                        <UserPlus size={14} className="text-[#E89B52]" />
                        <span>Register New Account</span>
                      </button>
                      <button
                        onClick={() => { setIsMobileMenuOpen(false); handleLogoutAction(); }}
                        className="w-full bg-red-500 text-white py-2.5 text-center rounded-lg cursor-pointer font-bold"
                      >
                        Log Out / Switch Account
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC WEBPAGE RENDERER & ROUTER */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
            <AnimatePresence mode="wait">
              {activePage === 'home' && (
                <motion.div key="home" className="w-full">
                  <Homepage
                    lang={lang}
                    onNavigate={navigateTo}
                    onOpenAuth={() => navigateTo('login')}
                  />
                </motion.div>
              )}
              {activePage === 'about-abel' && (
                <motion.div key="about-abel" className="w-full">
                  <AboutAbelPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'about-begena' && (
                <motion.div key="about-begena" className="w-full">
                  <AboutBegenaPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'courses' && (
                <motion.div key="courses" className="w-full">
                  <CoursesPage lang={lang} onNavigate={navigateTo} params={pageParams} />
                </motion.div>
              )}
              {activePage === 'course-detail' && (
                <motion.div key="course-detail" className="w-full">
                  <CourseDetailPage lang={lang} onNavigate={navigateTo} params={pageParams} />
                </motion.div>
              )}
              {activePage === 'teachers' && (
                <motion.div key="teachers" className="w-full">
                  <TeachersPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'teacher-profile' && (
                <motion.div key="teacher-profile" className="w-full">
                  <TeacherProfilePage lang={lang} onNavigate={navigateTo} params={pageParams} />
                </motion.div>
              )}
              {activePage === 'gallery' && (
                <motion.div key="gallery" className="w-full">
                  <GalleryPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {/* PHASE 15 COMPREHENSIVE EVENTS, COMPETITIONS, CERTIFICATES, GRADUATION & ALUMNI ROUTES */}
              {activePage === 'events' && (
                <motion.div key="events" className="w-full">
                  <EventsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'event-detail' && (
                <motion.div key="event-detail" className="w-full">
                  <EventsCenter lang={lang} onNavigate={navigateTo} initialEventId={pageParams?.eventId} />
                </motion.div>
              )}
              {activePage === 'event-checkin' && (
                <motion.div key="event-checkin" className="w-full">
                  <EventsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'concerts' && (
                <motion.div key="concerts" className="w-full">
                  <EventsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}

              {/* COMPETITIONS */}
              {activePage === 'competitions' && (
                <motion.div key="competitions" className="w-full">
                  <CompetitionsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'competition-detail' && (
                <motion.div key="competition-detail" className="w-full">
                  <CompetitionsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}

              {/* CERTIFICATES & QR VERIFICATION */}
              {activePage === 'certificates' && (
                <motion.div key="certificates" className="w-full">
                  <CertificatesCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'certificate-detail' && (
                <motion.div key="certificate-detail" className="w-full">
                  <CertificatesCenter lang={lang} onNavigate={navigateTo} initialCertNumber={pageParams?.certificateNumber} />
                </motion.div>
              )}
              {activePage === 'certificate-verify' && (
                <motion.div key="certificate-verify" className="w-full">
                  <CertificatesCenter lang={lang} onNavigate={navigateTo} initialCertNumber={pageParams?.certificateNumber} />
                </motion.div>
              )}

              {/* ACHIEVEMENTS & BADGES */}
              {activePage === 'achievements' && (
                <motion.div key="achievements" className="w-full">
                  <AchievementsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'achievements-showcase' && (
                <motion.div key="achievements-showcase" className="w-full">
                  <AchievementsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'student-achievements' && (
                <motion.div key="student-achievements" className="w-full">
                  <AchievementsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}

              {/* GRADUATION & ALUMNI NETWORK */}
              {activePage === 'graduation' && (
                <motion.div key="graduation" className="w-full">
                  <GraduationAndAlumniCenter lang={lang} onNavigate={navigateTo} initialMode="graduation" />
                </motion.div>
              )}
              {activePage === 'graduation-gallery' && (
                <motion.div key="graduation-gallery" className="w-full">
                  <GraduationAndAlumniCenter lang={lang} onNavigate={navigateTo} initialMode="graduation" />
                </motion.div>
              )}
              {activePage === 'alumni' && (
                <motion.div key="alumni" className="w-full">
                  <GraduationAndAlumniCenter lang={lang} onNavigate={navigateTo} initialMode="alumni" />
                </motion.div>
              )}
              {activePage === 'alumni-mentorship' && (
                <motion.div key="alumni-mentorship" className="w-full">
                  <GraduationAndAlumniCenter lang={lang} onNavigate={navigateTo} initialMode="alumni" />
                </motion.div>
              )}

              {/* PHASE 16 MARKETING, CRM, LEAD MANAGEMENT & STUDENT ACQUISITION ROUTES */}
              {['crm', 'crm-leads', 'crm-lead-detail', 'crm-inquiries', 'crm-prospects', 'crm-followups', 'crm-tasks', 'crm-appointments', 'crm-trials', 'marketing', 'marketing-campaigns', 'marketing-campaign-detail', 'marketing-landing', 'marketing-referrals', 'marketing-promos', 'marketing-content', 'marketing-course-landing', 'crm-reports', 'crm-funnel'].includes(activePage) && (
                <motion.div key="crm-center" className="w-full">
                  <CrmCenter lang={lang} onNavigate={navigateTo} initialTab={
                    activePage === 'crm-leads' ? 'leads' :
                    activePage === 'crm-prospects' ? 'kanban' :
                    activePage === 'crm-inquiries' ? 'inquiries' :
                    activePage === 'crm-followups' ? 'followups' :
                    activePage === 'marketing-campaigns' ? 'campaigns' :
                    activePage === 'marketing-course-landing' ? 'courses' :
                    activePage === 'crm-reports' || activePage === 'crm-funnel' ? 'reports' : 'dashboard'
                  } />
                </motion.div>
              )}
              {activePage === 'contact' && (
                <motion.div key="contact" className="w-full">
                  <ContactPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'donate' && (
                <motion.div key="donate" className="w-full">
                  {!currentUser ? (
                    <div className="max-w-xl mx-auto py-16 px-4 text-center">
                      <div className="bg-white border border-[#E7DED1] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 text-center">
                        <div className="w-16 h-16 bg-amber-100 text-[#E89B52] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                          <Lock className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E89B52] bg-[#FAF6EF] border border-[#E7DED1] px-3 py-1 rounded-full">
                            Members Only
                          </span>
                          <h2 className="text-2xl font-black text-[#2B2B2B] font-display">Sign In to Support / Donate</h2>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                            To contribute to the Cultural Preservation Fund and support student scholarships, please sign in to your school account.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={() => navigateTo('login')}
                            className="flex-1 py-3 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Sign In to Account
                          </button>
                          <button
                            onClick={() => navigateTo('register')}
                            className="flex-1 py-3 bg-[#FAF6EF] hover:bg-[#E7DED1]/50 border border-[#E7DED1] text-[#2B2B2B] font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Create Account
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <DonatePage lang={lang} onNavigate={navigateTo} />
                  )}
                </motion.div>
              )}

              {/* AUTH PAGES INTEGRATION */}
              {activePage === 'login' && (
                <motion.div key="login" className="w-full max-w-4xl mx-auto py-4 sm:py-8">
                  <LoginPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'register' && (
                <motion.div key="register" className="w-full">
                  <RegisterPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'stepped-register' && (
                <motion.div key="stepped-register" className="w-full max-w-lg mx-auto">
                  <SteppedRegister lang={lang} onNavigate={navigateTo} role={pageParams?.role || 'student'} />
                </motion.div>
              )}
              {activePage === 'student-registration' && (
                <motion.div key="student-registration" className="w-full">
                  <EnrollmentWizard lang={lang} onNavigate={navigateTo} initialCourseId={pageParams?.courseId} />
                </motion.div>
              )}
              {activePage === 'forgot-password' && (
                <motion.div key="forgot-password" className="w-full max-w-md mx-auto">
                  <ForgotPasswordPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'verify-account' && (
                <motion.div key="verify-account" className="w-full max-w-md mx-auto">
                  <VerifyAccountPage lang={lang} onNavigate={navigateTo} params={pageParams} />
                </motion.div>
              )}

              {/* 403 UNAUTHORIZED SECURITY OVERLAY */}
              {activePage === 'unauthorized' && (
                <motion.div key="unauthorized" className="w-full max-w-md mx-auto py-12">
                  <div className="bg-white border border-red-200 rounded-2xl p-8 text-center space-y-4 shadow-xl">
                    <ShieldAlert size={48} className="mx-auto text-red-500 animate-bounce" />
                    <h3 className="font-display font-black text-lg text-[#2B2B2B]">403: UNHAUTHORIZED ACCESS</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      You are restricted from viewing this dashboard due to active role-based permission locks. Please return to your appropriate portal workspace.
                    </p>
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => navigateTo('home')}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-[#2B2B2B] text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Return Home
                      </button>
                      {currentUser && (
                        <button
                          onClick={() => navigateTo(currentUser.role as PageId)}
                          className="flex-1 py-2 bg-[#E89B52] hover:bg-[#d4863e] text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          My Portal Desk
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ROLE DASHBOARDS ROUTER (Requirement 11) */}
              {activePage === 'student' && (
                <motion.div key="student" className="w-full">
                  <StudentDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'parent' && (
                <motion.div key="parent" className="w-full">
                  <ParentDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'teacher' && (
                <motion.div key="teacher" className="w-full">
                  <TeacherDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'registration_staff' && (
                <motion.div key="registration_staff" className="w-full">
                  <RegistrationStaffDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'branch_manager' && (
                <motion.div key="branch_manager" className="w-full">
                  <BranchManagerDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'accountant' && (
                <motion.div key="accountant" className="w-full">
                  <AccountantDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'admin' && (
                <motion.div key="admin" className="w-full">
                  <AdminDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'super_admin' && (
                <motion.div key="super_admin" className="w-full">
                  <SuperAdminDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'founder' && (
                <motion.div key="founder" className="w-full">
                  <FounderDashboard lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}

              {/* PHASE 10 COMMUNICATION & COMMUNITY ROUTES */}
              {activePage === 'messages' && (
                <motion.div key="messages" className="w-full">
                  <MessagesCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'community' && (
                <motion.div key="community" className="w-full">
                  {!currentUser ? (
                    <div className="max-w-xl mx-auto py-16 px-4 text-center">
                      <div className="bg-white border border-[#E7DED1] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 text-center">
                        <div className="w-16 h-16 bg-amber-100 text-[#E89B52] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                          <Lock className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E89B52] bg-[#FAF6EF] border border-[#E7DED1] px-3 py-1 rounded-full">
                            Members Only
                          </span>
                          <h2 className="text-2xl font-black text-[#2B2B2B] font-display">Sign In to Access Community</h2>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                            The Community Hub is reserved exclusively for registered students, teachers, parents, and staff to share practice recordings, discuss spiritual music, and submit prayer requests.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={() => navigateTo('login')}
                            className="flex-1 py-3 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Sign In to Account
                          </button>
                          <button
                            onClick={() => navigateTo('register')}
                            className="flex-1 py-3 bg-[#FAF6EF] hover:bg-[#E7DED1]/50 border border-[#E7DED1] text-[#2B2B2B] font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Create Account
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <CommunityCenter
                      lang={lang}
                      onNavigate={navigateTo}
                      initialTab={pageParams?.tab || 'feed'}
                    />
                  )}
                </motion.div>
              )}
              {activePage === 'announcements' && (
                <motion.div key="announcements" className="w-full">
                  <AnnouncementsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'notifications' && (
                <motion.div key="notifications" className="w-full">
                  <NotificationsCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    initialTab={pageParams?.tab || 'inbox'}
                  />
                </motion.div>
              )}
              {activePage === 'admin-community' && (
                <motion.div key="admin-community" className="w-full">
                  <AdminCommunityManagement
                    lang={lang}
                    onNavigate={navigateTo}
                    initialSubTab={pageParams?.subTab || 'analytics'}
                  />
                </motion.div>
              )}

              {/* PHASE 11 ADVANCED LMS & PRACTICE STUDIO ROUTES */}
              {activePage === 'learn' && (
                <motion.div key="learn" className="w-full">
                  <LearningCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    initialTab={pageParams?.tab || 'courses'}
                  />
                </motion.div>
              )}
              {activePage === 'learn-courses' && (
                <motion.div key="learn-courses" className="w-full">
                  <LearningCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    initialTab="courses"
                  />
                </motion.div>
              )}
              {activePage === 'practice' && (
                <motion.div key="practice" className="w-full">
                  <PracticeStudio
                    lang={lang}
                    onNavigate={navigateTo}
                    initialTab={pageParams?.tab || 'timer'}
                  />
                </motion.div>
              )}
              {activePage === 'practice-history' && (
                <motion.div key="practice-history" className="w-full">
                  <PracticeStudio
                    lang={lang}
                    onNavigate={navigateTo}
                    initialTab="history"
                  />
                </motion.div>
              )}
              {(activePage === 'learn-mezmur' || activePage === 'mezmur-library') && (
                <motion.div key="learn-mezmur" className="w-full">
                  <MezmurLibraryCenter
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'learn-quizzes' && (
                <motion.div key="learn-quizzes" className="w-full">
                  <QuizAndAssessmentCenter
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'learn-live-classes' && (
                <motion.div key="learn-live-classes" className="w-full">
                  <LiveClassesCenter
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'learn-admin' && (
                <motion.div key="learn-admin" className="w-full">
                  <LmsTeacherAdminCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    initialSubTab={pageParams?.subTab || 'review'}
                  />
                </motion.div>
              )}
              {activePage === 'learn-parent' && (
                <motion.div key="learn-parent" className="w-full">
                  <ParentLearningView
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}

              {/* PHASE 12 SCHOOL OPERATIONS & BRANCH MANAGEMENT ROUTES */}
              {activePage === 'operations' && (
                <motion.div key="operations" className="w-full">
                  <OperationsCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    activeSubTab={pageParams?.subTab || 'overview'}
                  />
                </motion.div>
              )}
              {activePage === 'operations-branches' && (
                <motion.div key="operations-branches" className="w-full">
                  <OperationsCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    activeSubTab="branches"
                  />
                </motion.div>
              )}
              {activePage === 'operations-branch-detail' && (
                <motion.div key="operations-branch-detail" className="w-full">
                  <BranchDetailView
                    branchId={pageParams?.branchId || 'b-piazza'}
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'operations-schedule' && (
                <motion.div key="operations-schedule" className="w-full">
                  <ClassSchedulingCenter
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'operations-rooms' && (
                <motion.div key="operations-rooms" className="w-full">
                  <RoomManagement
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'operations-makeup' && (
                <motion.div key="operations-makeup" className="w-full">
                  <MakeupClassesCenter
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'operations-transfers' && (
                <motion.div key="operations-transfers" className="w-full">
                  <StudentTransferCenter
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'operations-inventory' && (
                <motion.div key="operations-inventory" className="w-full">
                  <InventoryAndStoreCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    activeMode="inventory"
                  />
                </motion.div>
              )}
              {activePage === 'operations-attendance' && (
                <motion.div key="operations-attendance" className="w-full">
                  <AttendanceManagementCenter
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {/* PHASE 13 STORE COMING SOON EXPERIENCE */}
              {(activePage === 'store' || activePage === 'store-categories' || activePage === 'store-cart' || activePage === 'store-checkout' || activePage === 'store-wishlist') && (
                <motion.div key="store-coming-soon" className="w-full">
                  <StoreComingSoonPage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'store-orders' && (
                <motion.div key="store-orders" className="w-full">
                  <StoreOrdersView
                    lang={lang}
                    onNavigate={navigateTo}
                    ordersList={ordersList}
                  />
                </motion.div>
              )}
              {activePage === 'store-branch-orders' && (
                <motion.div key="store-branch-orders" className="w-full">
                  <BranchOrderDashboard
                    lang={lang}
                    onNavigate={navigateTo}
                    ordersList={ordersList}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                  />
                </motion.div>
              )}
              {activePage === 'admin-store' && (
                <motion.div key="admin-store" className="w-full">
                  <AdminStoreManagement
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'admin-suppliers' && (
                <motion.div key="admin-suppliers" className="w-full">
                  <AdminStoreManagement
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'store-wishlist' && (
                <motion.div key="store-wishlist" className="w-full">
                  <StoreWishlistView
                    lang={lang}
                    onNavigate={navigateTo}
                    wishlistItems={wishlistItems}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              )}
              {activePage === 'store-returns' && (
                <motion.div key="store-returns" className="w-full">
                  <StoreReturnsView
                    lang={lang}
                    onNavigate={navigateTo}
                    ordersList={ordersList}
                    returnsList={returnsList}
                    onRequestReturn={handleRequestReturn}
                  />
                </motion.div>
              )}
              {/* Phase 14 Analytics, Reporting & Intelligence Center Routes */}
              {activePage === 'analytics' && (
                <motion.div key="analytics" className="w-full">
                  <AnalyticsCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'student-progress' && (
                <motion.div key="student-progress" className="w-full">
                  <StudentAnalyticsView lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'teacher-analytics' && (
                <motion.div key="teacher-analytics" className="w-full">
                  <TeacherAnalyticsView lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'branch-analytics' && (
                <motion.div key="branch-analytics" className="w-full">
                  <BranchAnalyticsView lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'accountant-analytics' && (
                <motion.div key="accountant-analytics" className="w-full">
                  <AccountantAnalyticsView lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'admin-analytics' && (
                <motion.div key="admin-analytics" className="w-full">
                  <AdminAnalyticsView lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'founder-intelligence' && (
                <motion.div key="founder-intelligence" className="w-full">
                  <FounderIntelligenceCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'analytics-insights' && (
                <motion.div key="analytics-insights" className="w-full">
                  <AIInsightsAndAssistant lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'reports-builder' && (
                <motion.div key="reports-builder" className="w-full">
                  <ReportBuilderView lang={lang} onNavigate={navigateTo} initialMode="builder" />
                </motion.div>
              )}
              {activePage === 'reports-history' && (
                <motion.div key="reports-history" className="w-full">
                  <ReportBuilderView lang={lang} onNavigate={navigateTo} initialMode="history" />
                </motion.div>
              )}
              {activePage === 'operations-maintenance' && (
                <motion.div key="operations-maintenance" className="w-full">
                  <MaintenanceAndExpensesCenter
                    lang={lang}
                    onNavigate={navigateTo}
                  />
                </motion.div>
              )}
              {activePage === 'operations-staff' && (
                <motion.div key="operations-[#2B2B2B]" className="w-full">
                  <StaffAndAvailabilityCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    activeMode="staff"
                  />
                </motion.div>
              )}
              {activePage === 'operations-tasks' && (
                <motion.div key="operations-tasks" className="w-full">
                  <StaffAndAvailabilityCenter
                    lang={lang}
                    onNavigate={navigateTo}
                    activeMode="tasks"
                  />
                </motion.div>
              )}

              {/* PHASE 16 CRM & GROWTH ROUTES */}
              {activePage === 'crm' && (
                <motion.div key="crm" className="w-full">
                  <CrmCenter lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'crm-leads' && (
                <motion.div key="crm-leads" className="w-full">
                  <CrmCenter lang={lang} onNavigate={navigateTo} initialTab="pipeline" />
                </motion.div>
              )}
              {activePage === 'crm-campaigns' && (
                <motion.div key="crm-campaigns" className="w-full">
                  <CrmCenter lang={lang} onNavigate={navigateTo} initialTab="campaigns" />
                </motion.div>
              )}

              {/* PHASE 17 ADVANCED AI ASSISTANT & SMART AUTOMATION ROUTES */}
              {activePage === 'ai' && (
                <motion.div key="ai" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Student" initialSubPath="ai" />
                </motion.div>
              )}
              {activePage === 'student-ai' && (
                <motion.div key="student-ai" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Student" initialSubPath="ai" />
                </motion.div>
              )}
              {activePage === 'student-practice-plan' && (
                <motion.div key="student-practice-plan" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Student" initialSubPath="practice-plan" />
                </motion.div>
              )}
              {activePage === 'student-learning-path' && (
                <motion.div key="student-learning-path" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Student" initialSubPath="learning-path" />
                </motion.div>
              )}
              {activePage === 'student-goals' && (
                <motion.div key="student-goals" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Student" initialSubPath="goals" />
                </motion.div>
              )}
              {activePage === 'teacher-ai' && (
                <motion.div key="teacher-ai" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Teacher" />
                </motion.div>
              )}
              {activePage === 'parent-ai' && (
                <motion.div key="parent-ai" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Parent" />
                </motion.div>
              )}
              {activePage === 'branch-manager-ai' && (
                <motion.div key="branch-manager-ai" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="BranchManager" />
                </motion.div>
              )}
              {activePage === 'accountant-ai' && (
                <motion.div key="accountant-ai" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Accountant" />
                </motion.div>
              )}
              {activePage === 'admin-ai' && (
                <motion.div key="admin-ai" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Admin" />
                </motion.div>
              )}
              {activePage === 'founder-ai' && (
                <motion.div key="founder-ai" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Founder" initialSubPath="founder" />
                </motion.div>
              )}
              {activePage === 'automation' && (
                <motion.div key="automation" className="w-full">
                  <AiAssistantCenter onNavigate={navigateTo} initialRole="Automation" initialSubPath="automation" />
                </motion.div>
              )}

              {/* PHASE 18 SYSTEM SETTINGS, SECURITY, BACKUP & DISASTER RECOVERY ROUTES */}
              {activePage === 'profile' && (
                <motion.div key="profile" className="w-full">
                  <UserProfilePage lang={lang} onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'settings' && (
                <motion.div key="settings" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="profile" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}
              {activePage === 'settings-users' && (
                <motion.div key="settings-users" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="users" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}
              {activePage === 'settings-roles' && (
                <motion.div key="settings-roles" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="users" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}
              {activePage === 'settings-integrations' && (
                <motion.div key="settings-integrations" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="integrations" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}
              {activePage === 'settings-backups' && (
                <motion.div key="settings-backups" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="backups" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}
              {activePage === 'admin-system-health' && (
                <motion.div key="admin-system-health" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="health" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}
              {(activePage === 'admin-audit-logs' || activePage === 'audit-logs') && (
                <motion.div key="admin-audit-logs" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="audit" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}
              {activePage === 'verify-certificate' && (
                <motion.div key="verify-certificate" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="verify" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}
              {activePage === 'global-search' && (
                <motion.div key="global-search" className="w-full">
                  <SettingsCenter onNavigate={navigateTo} initialTab="search" userRole={currentUser?.role || 'Founder'} />
                </motion.div>
              )}

              {/* PHASE 19 MASTER INTEGRATION, QA & LAUNCH ROUTES */}
              {(activePage === 'help' || activePage === 'help-center') && (
                <motion.div key="help" className="w-full">
                  <HelpCenter onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'qa-launch-center' && (
                <motion.div key="qa-launch-center" className="w-full">
                  <QaAndLaunchDashboard onNavigate={navigateTo} />
                </motion.div>
              )}
              {activePage === 'founder-presentation' && (
                <motion.div key="founder-presentation" className="w-full">
                  <FounderPresentationMode onNavigate={navigateTo} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* COMPREHENSIVE FOOTER */}
          <footer className="bg-[#6F4E37] text-white border-t-2 border-[#C79A2B] py-16 px-6 relative overflow-hidden text-left">
            <div className="absolute left-0 top-0 bottom-0 w-96 opacity-[0.06] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 20 L20 0 L40 20 L20 40 Z M40 20 L60 0 L80 20 L60 40 Z" fill="white" />
                <path d="M0 60 L20 40 L40 60 L20 80 Z M40 60 L60 40 L80 60 L60 80 Z" fill="white" />
              </svg>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
              <div className="md:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-[#C79A2B]/40 overflow-hidden shrink-0 p-0.5 shadow-sm">
                    <img src={logoImg} alt="Liora Begena School Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">{t.footer.schoolName}</h4>
                    <p className="text-[10px] uppercase font-semibold text-[#C79A2B] tracking-wider">{t.footer.location}</p>
                  </div>
                </div>
                <p className="text-xs text-[#FAF6EF]/90 max-w-sm leading-relaxed">
                  {t.footer.desc}
                </p>

                {/* Social links */}
                <div className="flex flex-wrap gap-2.5 text-xs pt-2">
                  <a href="https://www.instagram.com/liyora_begena?xtok=MWxxbTJ5eWJ1MTBpeA==" target="_blank" rel="noreferrer noopener" className="bg-white/10 hover:bg-[#E89B52] px-3.5 py-1.5 rounded-full border border-white/10 text-white transition-colors font-medium">Instagram</a>
                  <a href="https://t.me/liyora_begena" target="_blank" rel="noreferrer noopener" className="bg-white/10 hover:bg-[#E89B52] px-3.5 py-1.5 rounded-full border border-white/10 text-white transition-colors font-medium">Telegram</a>
                  <a href="https://www.tiktok.com/@liora_begena?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer noopener" className="bg-white/10 hover:bg-[#E89B52] px-3.5 py-1.5 rounded-full border border-white/10 text-white transition-colors font-medium">TikTok</a>
                </div>
              </div>

              {/* QUICK LINKS PLACED ON THE RIGHT SIDE WITH RICH INTERACTION */}
              <div className="md:col-span-7 space-y-3 md:ml-auto w-full">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <h5 className="font-display font-black text-xs uppercase tracking-widest text-[#C79A2B] flex items-center gap-2">
                    <Sparkles size={14} className="text-[#E89B52]" />
                    <span>{lang === 'am' ? 'ፈጣን ማውጫ' : 'Quick Navigation Hub'}</span>
                  </h5>
                  <span className="text-[10px] font-mono text-[#FAF6EF]/60 uppercase tracking-wider">{lang === 'am' ? 'ቀጥታ አገናኞች' : 'Fast Access'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    { id: 'home', label: lang === 'am' ? 'ዋና ገጽ' : 'Home Portal', icon: Home, desc: lang === 'am' ? 'የትምህርት ቤቱ መግቢያና አጠቃላይ እይታ' : 'School overview & main entry' },
                    { id: 'courses', label: lang === 'am' ? 'የትምህርት ዓይነቶች' : 'Instrument Courses', icon: Music, desc: lang === 'am' ? 'በገና፣ ክራር፣ ማሲንቆና የዜማ ስልጠና' : 'Begena, Krar, Masenqo & Zema' },
                    { id: 'teachers', label: lang === 'am' ? 'የመምህራን መገለጫ' : 'Faculty Profiles', icon: GraduationCap, desc: lang === 'am' ? 'አንጋፋ መምህራንና ዘማሪዎች' : 'Master instructors & Zemari' },
                    { id: 'certificates', label: lang === 'am' ? 'የምስክር ወረቀቶች' : 'Certificates & Lookup', icon: Award, desc: lang === 'am' ? 'ዲጂታል የትምህርት ምስክር ወረቀቶች' : 'Digital QR credentials' },
                    { id: 'help', label: lang === 'am' ? 'እርዳታና ድጋፍ' : 'Help & Support', icon: HelpCircle, desc: lang === 'am' ? 'ምዝገባ፣ ክፍያና አድራሻዎቻችን' : 'Admissions, fees & contact' },
                  ].map((link) => {
                    const IconComp = link.icon;
                    return (
                      <motion.button
                        key={link.id}
                        whileHover={{ scale: 1.03, x: 2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigateTo(link.id as PageId)}
                        className="group flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-[#E89B52] border border-white/10 hover:border-[#E89B52] text-left transition-all duration-200 cursor-pointer shadow-3xs"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-white/20 text-[#E89B52] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <IconComp size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-xs text-white group-hover:text-white flex items-center justify-between gap-1">
                            <span className="truncate">{link.label}</span>
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0 text-white" />
                          </p>
                          <p className="text-[10px] text-[#FAF6EF]/70 group-hover:text-white/90 truncate">
                            {link.desc}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

            </div>
          </footer>
        </div>
      ) : (
        // ==========================================
        // SYSTEM WORKSPACE SANDBOX (PHASE 0)
        // ==========================================
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          <div className="flex justify-between items-center pb-4 border-b border-[#E7DED1] mb-8">
            <div className="text-left">
              <h1 className="font-display font-black text-2xl text-[#2B2B2B]">LIORA BEGENA SYSTEM LAB</h1>
              <p className="text-xs text-gray-500">Inspect system foundations, interactive guidelines, and components.</p>
            </div>
            <div className="flex border border-[#E7DED1] rounded-lg overflow-hidden bg-white shadow-3xs">
              {[
                { id: 'playground', label: 'Interactive Sandbox' },
                { id: 'tokens', label: 'Design Tokens' },
                { id: 'guidelines', label: 'Brand Guidelines' },
                { id: 'future', label: 'Feature Simulator' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-[#2B2B2B] text-white' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'playground' && (
              <motion.div key="playground">
                <ComponentPlayground />
              </motion.div>
            )}
            {activeTab === 'tokens' && (
              <motion.div key="tokens">
                <TokenViewer />
              </motion.div>
            )}
            {activeTab === 'guidelines' && (
              <motion.div key="guidelines">
                <GuidelinesSection />
              </motion.div>
            )}
            {activeTab === 'future' && (
              <div className="space-y-8 text-left">
                <div className="bg-[#FAF6EF] border border-[#E7DED1] rounded-xl p-5 flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Interactive Feature Simulators</h4>
                    <p className="text-xs text-gray-500">Experience dynamic full-stack simulated blueprints.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFutureSubTab('lms')}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${futureSubTab === 'lms' ? 'bg-[#E89B52] text-white shadow-3xs' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
                    >
                      1. Student Course Workspace
                    </button>
                    <button
                      onClick={() => setFutureSubTab('payment')}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${futureSubTab === 'payment' ? 'bg-[#E89B52] text-white shadow-3xs' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
                    >
                      2. CBE Tuition Payment Portal
                    </button>
                    <button
                      onClick={() => setFutureSubTab('admin')}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${futureSubTab === 'admin' ? 'bg-[#E89B52] text-white shadow-3xs' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
                    >
                      3. Accountant Verification Console
                    </button>
                  </div>
                </div>

                {futureSubTab === 'lms' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                    <div className="lg:col-span-4 bg-white border border-[#E7DED1] rounded-xl p-5 space-y-4">
                      <div className="pb-3 border-b border-[#FAF6EF]">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#C79A2B]">Course Syllabus</span>
                        <h4 className="font-display font-bold text-md text-[#2B2B2B] mt-0.5">Washint Advanced Chants</h4>
                        <p className="text-[10px] text-[#666666]">Progression Track: 33% completed</p>
                      </div>
                      <div className="space-y-2">
                        {[
                          { num: "01", title: "Introduction to Washint Reeds", completed: true, active: false },
                          { num: "02", title: "Tizita Scale Finger Positionings", completed: true, active: false },
                          { num: "03", title: "Standard Pentatonic Air control", completed: false, active: true },
                          { num: "04", title: "Advanced Liturgical Pitchings", completed: false, active: false },
                          { num: "05", title: "Final Cohort Submission Solo", completed: false, active: false }
                        ].map((lesson, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border transition-all flex items-center justify-between ${lesson.active ? 'border-[#E89B52] bg-[#FAF6EF]/55' : 'border-[#E7DED1]/60 bg-white hover:bg-[#FAF6EF]/20'}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`text-[10px] font-mono font-bold ${lesson.active ? 'text-[#E89B52]' : 'text-[#9E9E9E]'}`}>{lesson.num}</span>
                              <span className={`text-xs font-semibold ${lesson.active ? 'text-[#2B2B2B]' : 'text-[#666666]'}`}>{lesson.title}</span>
                            </div>
                            {lesson.completed ? (
                              <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            ) : lesson.active ? (
                              <span className="text-[9px] font-bold text-[#E89B52] uppercase tracking-wider animate-pulse">Now Playing</span>
                            ) : (
                              <Clock size={12} className="text-[#9E9E9E]" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* RHS dynamic interactive player */}
                    <div className="lg:col-span-8 bg-white border border-[#E7DED1] p-6 rounded-xl relative space-y-4">
                      <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                        <img
                          src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop"
                          alt="Active Lesson"
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/80 via-black/20 to-black/40 text-white">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-600 px-2 py-0.5 rounded">RECORDED SYLLABUS LECTURE</span>
                            <span className="text-[11px] font-mono bg-black/60 px-2.5 py-1 rounded-sm">18:42 / 32:00</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold tracking-widest text-[#E89B52] uppercase">Lesson 03 · Core Practice</span>
                            <h4 className="font-display font-bold text-xl text-white mt-1">Standard Pentatonic Air control & Reed Seals</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* GLOBAL MODALS (Search) */}
      <AnimatePresence>
        {isSearchOpen && (
          <GlobalSearch
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            lang={lang}
            onNavigate={navigateTo}
          />
        )}
      </AnimatePresence>

      {/* 3. PROFILE EDITOR OVERLAY PANEL (Requirement 21) */}
      <AnimatePresence>
        {isProfileEditorOpen && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-5 shadow-2xl overflow-hidden relative"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h4 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-1.5">
                    <User size={16} className="text-[#E89B52]" />
                    Update Profile Details
                  </h4>
                  <p className="text-[10px] text-gray-400">Modify credentials and regional student addresses.</p>
                </div>
                <button onClick={() => setIsProfileEditorOpen(false)} className="text-gray-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfileDetails} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <User size={11} />
                    Full Legal Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-md outline-none focus:border-[#E89B52]"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Mail size={11} />
                    Primary Email
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-md outline-none focus:border-[#E89B52]"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Phone size={11} />
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-md outline-none focus:border-[#E89B52]"
                    placeholder="+251 911 234 567"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <MapPin size={11} />
                    Residential Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-md outline-none focus:border-[#E89B52]"
                    placeholder="Bole, Addis Ababa"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Briefcase size={11} />
                    Emergency Contact Name & Phone
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-md outline-none focus:border-[#E89B52]"
                    placeholder="Kebebush Tesfaye (+251 911 000 111)"
                    value={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileEditorOpen(false)}
                    className="flex-1 py-2.5 border border-[#E7DED1] text-[#2B2B2B] font-bold rounded-lg cursor-pointer hover:bg-gray-55"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold rounded-lg cursor-pointer"
                  >
                    Save & Update Details
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ECOSYSTEM SETTINGS PANEL */}
      <AnimatePresence>
        {isSettingsPanelOpen && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#E7DED1] max-w-sm w-full rounded-2xl p-6 text-left space-y-5 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h4 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-1.5">
                  <SlidersHorizontal size={16} className="text-[#E89B52]" />
                  Ecosystem Settings
                </h4>
                <button onClick={() => setIsSettingsPanelOpen(false)} className="text-gray-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <span className="block font-bold text-gray-500 uppercase text-[9px]">Select Language</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLang('en')}
                      className={`py-2 border rounded-xl font-bold ${lang === 'en' ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-gray-100'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLang('am')}
                      className={`py-2 border rounded-xl font-bold ${lang === 'am' ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-gray-100'}`}
                    >
                      አማርኛ (Amharic)
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                  <span className="block font-bold text-amber-900 text-[10px]">Session Security Integrity</span>
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    Account access logs are persistent inside browser storage caches. Signing out dispatches credentials destruction immediately.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsPanelOpen(false)}
                className="w-full py-2.5 bg-[#2B2B2B] hover:bg-[#1C1C1C] text-white font-bold rounded-lg cursor-pointer"
              >
                Close Settings
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

