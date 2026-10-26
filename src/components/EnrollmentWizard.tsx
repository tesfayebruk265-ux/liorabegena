import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  BookOpen,
  Calendar,
  Sparkles,
  Music,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Camera,
  Trash2,
  Check,
  Building,
  Info,
  DollarSign,
  AlertTriangle,
  FileText,
  CreditCard,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { compressImageFile, safeSetItem } from '../utils/storage';
import { Button, Input } from './InteractiveComponents';
import { COURSES_DATA, isCourseComingSoon } from '../data/websiteData';
import { PageId, Course } from '../types';

interface EnrollmentWizardProps {
  lang: 'en' | 'am';
  onNavigate: (page: PageId, params?: any) => void;
  initialCourseId?: string;
}

export function EnrollmentWizard({ lang, onNavigate, initialCourseId }: EnrollmentWizardProps) {
  const { currentUser, addNotification, updateProfile } = useAuth();
  const { addStudentEnrollment, addStudentRegistration, submitPaymentReceipt } = useData();

  // WIZARD STEPS DEFINITION
  const steps = [
    { num: '01', title: 'Personal Information', desc: 'Ethiopian naming, DOB & profile photo' },
    { num: '02', title: 'Contact & Emergency', desc: 'Contact details & emergency guarantor' },
    { num: '03', title: 'Address & Location', desc: 'Ethiopia-friendly address system' },
    { num: '04', title: 'Education & Occupation', desc: 'Student or employment status' },
    { num: '05', title: 'Musical Background', desc: 'Instrument ownership & experience' },
    { num: '06', title: 'Course Selection', desc: 'Select instrument program' },
    { num: '07', title: 'Learning Preferences', desc: 'Level, learning mode & branch' },
    { num: '08', title: 'Schedule & Time', desc: 'Choose frequency & available days' },
    { num: '09', title: 'Enrollment Review', desc: 'Verify details & pricing breakdown' },
    { num: '10', title: 'Tuition Payment', desc: 'Payment instructions (CBE, Telebirr, Cash)' },
    { num: '11', title: 'Receipt Submission', desc: 'Upload screenshot & receipt data' },
    { num: '12', title: 'Application Submitted', desc: 'Success & tracking timeline' }
  ];

  // ----------------------------------------------------
  // DATA STRUCTURE FOR THE REGISTRATION WIZARD STATE
  // ----------------------------------------------------
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Emergency contact fields
  const [altPhone, setAltPhone] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyAltPhone, setEmergencyAltPhone] = useState('');
  const [emergencyAddress, setEmergencyAddress] = useState('');

  // Address fields
  const [country, setCountry] = useState('Ethiopia');
  const [region, setRegion] = useState('Addis Ababa');
  const [city, setCity] = useState('Addis Ababa');
  const [subCity, setSubCity] = useState('');
  const [woreda, setWoreda] = useState('');
  const [kebele, setKebele] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');

  // Student vs Employee type info
  const [registerAs, setRegisterAs] = useState<'Student' | 'Employee' | 'Other'>('Student');
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [educationType, setEducationType] = useState('University');
  const [instName, setInstName] = useState('');
  const [deptName, setDeptName] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [degreeType, setDegreeType] = useState("Bachelor's");
  const [currentYear, setCurrentYear] = useState('');

  const [isEmployed, setIsEmployed] = useState<boolean>(false);
  const [employmentType, setEmploymentType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [occupation, setOccupation] = useState('');
  const [workAddress, setWorkAddress] = useState('');

  // Musical Experience
  const [prevExp, setPrevExp] = useState<boolean>(false);
  const [prevInstrument, setPrevInstrument] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [prevTeacher, setPrevTeacher] = useState('');
  const [musicSchool, setMusicSchool] = useState('');
  const [expDescription, setExpDescription] = useState('');
  
  const [ownInstrument, setOwnInstrument] = useState<boolean>(false);
  const [ownType, setOwnType] = useState('Begena');
  const [haveAccess, setHaveAccess] = useState<boolean>(true);

  // Church Information (Optional)
  const [churchName, setChurchName] = useState('');
  const [churchLocation, setChurchLocation] = useState('');
  const [churchRole, setChurchRole] = useState('');

  // Course & Schedule Choice
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(
    COURSES_DATA.find(c => c.id === initialCourseId) || COURSES_DATA[0]
  );
  const [selectedLevelName, setSelectedLevelName] = useState('');
  const [learningMode, setLearningMode] = useState<'In-Person' | 'Online'>('In-Person');
  const [selectedBranch, setSelectedBranch] = useState('Hawassa Campus');
  const [selectedDurationIndex, setSelectedDurationIndex] = useState(0); // index in pricing array
  const [selectedScheduleDays, setSelectedScheduleDays] = useState<string[]>([]);
  const [selectedClassTime, setSelectedClassTime] = useState('Morning (9:00 AM - 12:00 PM)');

  // Payment receipts
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'CBE' | 'Telebirr'>('CBE');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountPaid, setAmountPaid] = useState('');
  const [receiptPhoto, setReceiptPhoto] = useState<string | null>(null);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedAppId, setGeneratedAppId] = useState('');

  // Drag & drop dragOver states
  const [isDragOverPhoto, setIsDragOverPhoto] = useState(false);
  const [isDragOverReceipt, setIsDragOverReceipt] = useState(false);

  // ----------------------------------------------------
  // AUTO-SAVE / LOAD SYSTEM
  // ----------------------------------------------------
  useEffect(() => {
    // Attempt loading draft
    const savedDraft = localStorage.getItem('ab_incomplete_registration_v3');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.userId === currentUser?.id) {
          setCurrentStep(draft.currentStep || 1);
          setProfilePhoto(draft.profilePhoto || null);
          setFirstName(draft.firstName || '');
          setMiddleName(draft.middleName || '');
          setLastName(draft.lastName || '');
          setGender(draft.gender || 'Male');
          setDob(draft.dob || '');
          setAge(draft.age || '');
          setPhone(draft.phone || currentUser?.phone || '');
          setEmail(draft.email || currentUser?.email || '');
          setAltPhone(draft.altPhone || '');
          setEmergencyName(draft.emergencyName || '');
          setEmergencyRelation(draft.emergencyRelation || '');
          setEmergencyPhone(draft.emergencyPhone || '');
          setEmergencyAltPhone(draft.emergencyAltPhone || '');
          setEmergencyAddress(draft.emergencyAddress || '');
          setCountry(draft.country || 'Ethiopia');
          setRegion(draft.region || 'Addis Ababa');
          setCity(draft.city || 'Addis Ababa');
          setSubCity(draft.subCity || '');
          setWoreda(draft.woreda || '');
          setKebele(draft.kebele || '');
          setStreetArea(draft.streetArea || '');
          setDetailedAddress(draft.detailedAddress || '');
          setRegisterAs(draft.registerAs || 'Student');
          setIsStudent(draft.isStudent !== undefined ? draft.isStudent : true);
          setEducationType(draft.educationType || 'University');
          setInstName(draft.instName || '');
          setDeptName(draft.deptName || '');
          setYearLevel(draft.yearLevel || '');
          setDegreeType(draft.degreeType || "Bachelor's");
          setCurrentYear(draft.currentYear || '');
          setIsEmployed(draft.isEmployed !== undefined ? draft.isEmployed : false);
          setEmploymentType(draft.employmentType || '');
          setCompanyName(draft.companyName || '');
          setJobTitle(draft.jobTitle || '');
          setOccupation(draft.occupation || '');
          setWorkAddress(draft.workAddress || '');
          setPrevExp(draft.prevExp !== undefined ? draft.prevExp : false);
          setPrevInstrument(draft.prevInstrument || '');
          setYearsExp(draft.yearsExp || '');
          setCurrentLevel(draft.currentLevel || 'Beginner');
          setPrevTeacher(draft.prevTeacher || '');
          setMusicSchool(draft.musicSchool || '');
          setExpDescription(draft.expDescription || '');
          setOwnInstrument(draft.ownInstrument !== undefined ? draft.ownInstrument : false);
          setOwnType(draft.ownType || 'Begena');
          setHaveAccess(draft.haveAccess !== undefined ? draft.haveAccess : true);
          setChurchName(draft.churchName || '');
          setChurchLocation(draft.churchLocation || '');
          setChurchRole(draft.churchRole || '');
          if (draft.selectedCourseId) {
            const courseObj = COURSES_DATA.find(c => c.id === draft.selectedCourseId);
            if (courseObj) setSelectedCourse(courseObj);
          }
          setSelectedLevelName(draft.selectedLevelName || '');
          setLearningMode(draft.learningMode || 'In-Person');
          setSelectedBranch(draft.selectedBranch || 'Hawassa Campus');
          setSelectedDurationIndex(draft.selectedDurationIndex || 0);
          setSelectedScheduleDays(draft.selectedScheduleDays || []);
          setSelectedClassTime(draft.selectedClassTime || 'Morning (9:00 AM - 12:00 PM)');
          setPaymentMethod(draft.paymentMethod || 'CBE');
          setTransactionRef(draft.transactionRef || '');
          setPaymentDate(draft.paymentDate || new Date().toISOString().split('T')[0]);
          setAmountPaid(draft.amountPaid || '');
          setReceiptPhoto(draft.receiptPhoto || null);
          setTermsAccepted(draft.termsAccepted || false);
          setGeneratedAppId(draft.generatedAppId || '');
        }
      } catch (err) {
        console.error('Failed to parse registration draft', err);
      }
    } else {
      // Pre-fill user details if no draft
      if (currentUser) {
        setPhone(currentUser.phone || '');
        setEmail(currentUser.email || '');
        const names = (currentUser.fullName || '').split(' ');
        if (names.length > 0) setFirstName(names[0]);
        if (names.length > 1) setMiddleName(names[1]);
        if (names.length > 2) setLastName(names.slice(2).join(' '));
      }
    }
  }, [currentUser]);

  // Set default level when course changes
  useEffect(() => {
    if (selectedCourse) {
      setSelectedLevelName(selectedCourse.levels[0]);
      // reset selected schedule days based on duration/frequency
      setSelectedScheduleDays([]);
    }
  }, [selectedCourse]);

  // Auto calculate age from date of birth
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const calculatedAge = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
      if (!isNaN(calculatedAge) && calculatedAge >= 0) {
        setAge(calculatedAge);
      }
    }
  }, [dob]);

  // Save progress draft helper
  const saveProgressDraft = (targetStep = currentStep) => {
    if (!currentUser) return;
    const draftData = {
      userId: currentUser.id,
      currentStep: targetStep,
      profilePhoto,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      age,
      phone,
      email,
      altPhone,
      emergencyName,
      emergencyRelation,
      emergencyPhone,
      emergencyAltPhone,
      emergencyAddress,
      country,
      region,
      city,
      subCity,
      woreda,
      kebele,
      streetArea,
      detailedAddress,
      registerAs,
      isStudent,
      educationType,
      instName,
      deptName,
      yearLevel,
      degreeType,
      currentYear,
      isEmployed,
      employmentType,
      companyName,
      jobTitle,
      occupation,
      workAddress,
      prevExp,
      prevInstrument,
      yearsExp,
      currentLevel,
      prevTeacher,
      musicSchool,
      expDescription,
      ownInstrument,
      ownType,
      haveAccess,
      churchName,
      churchLocation,
      churchRole,
      selectedCourseId: selectedCourse?.id,
      selectedLevelName,
      learningMode,
      selectedBranch,
      selectedDurationIndex,
      selectedScheduleDays,
      selectedClassTime,
      paymentMethod,
      transactionRef,
      paymentDate,
      amountPaid,
      receiptPhoto,
      termsAccepted,
      generatedAppId,
      lastUpdated: new Date().toISOString()
    };
    safeSetItem('ab_incomplete_registration_v3', JSON.stringify(draftData));
  };

  const handleSaveAndContinueLater = () => {
    saveProgressDraft();
    addNotification(
      'Registration Progress Saved',
      `Your registration progress has been securely cached. You can return to step ${currentStep} at any time.`,
      'registration'
    );
    onNavigate('student');
  };

  const handleStartOver = () => {
    localStorage.removeItem('ab_incomplete_registration_v3');
      // Reset states
      setProfilePhoto(null);
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setGender('Male');
      setDob('');
      setAge('');
      setAltPhone('');
      setEmergencyName('');
      setEmergencyRelation('');
      setEmergencyPhone('');
      setEmergencyAltPhone('');
      setEmergencyAddress('');
      setRegion('Addis Ababa');
      setCity('Addis Ababa');
      setSubCity('');
      setWoreda('');
      setKebele('');
      setStreetArea('');
      setDetailedAddress('');
      setRegisterAs('Student');
      setIsStudent(true);
      setIsEmployed(false);
      setPrevExp(false);
      setOwnInstrument(false);
      setChurchName('');
      setChurchLocation('');
      setChurchRole('');
      setSelectedCourse(COURSES_DATA[0]);
      setSelectedScheduleDays([]);
      setReceiptPhoto(null);
      setTransactionRef('');
      setTermsAccepted(false);
      setCurrentStep(1);
  };

  // ----------------------------------------------------
  // STEP VALIDATIONS & SUBMIT PROGRESS LOGIC
  // ----------------------------------------------------
  const handleNextStep = () => {
    setErrorMsg(null);

    // Validate active step
    if (currentStep === 1) {
      if (!firstName.trim() || !middleName.trim()) {
        setErrorMsg('Please enter at least your First and Middle Names (traditional Ethiopian naming).');
        return;
      }
      if (!dob) {
        setErrorMsg('Date of Birth is required to calculate student category.');
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Primary phone number is required.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!emergencyName.trim() || !emergencyRelation.trim() || !emergencyPhone.trim()) {
        setErrorMsg('Emergency contact name, relation, and phone are strictly required.');
        return;
      }
    }

    if (currentStep === 3) {
      if (!region.trim() || !city.trim() || !subCity.trim()) {
        setErrorMsg('Address details (Region, City, Sub-city) are required.');
        return;
      }
    }

    if (currentStep === 4) {
      if (registerAs === 'Student') {
        if (!instName.trim() || !deptName.trim()) {
          setErrorMsg('Education details are required for active school registration.');
          return;
        }
      } else if (registerAs === 'Employee') {
        if (!companyName.trim() || !jobTitle.trim()) {
          setErrorMsg('Employment details are required for active company registration.');
          return;
        }
      }
    }

    if (currentStep === 5) {
      // Optional background steps
    }

    if (currentStep === 6) {
      if (!selectedCourse) {
        setErrorMsg('Please choose an instrument/course to enroll.');
        return;
      }
    }

    if (currentStep === 7) {
      if (!selectedLevelName) {
        setErrorMsg('Please choose your target enrollment level.');
        return;
      }
    }

    if (currentStep === 8) {
      const requiredDaysCount = getRequiredDaysCount();
      if (selectedScheduleDays.length !== requiredDaysCount) {
        setErrorMsg(`Please select exactly ${requiredDaysCount} available schedule days for your duration choice.`);
        return;
      }
    }

    if (currentStep === 9) {
      // Confirm terms
      if (!termsAccepted) {
        setErrorMsg('Please confirm that you authorize the academic credentials as accurate.');
        return;
      }
      // Generate App ID
      if (!generatedAppId) {
        const appId = `APP-${Math.floor(100000 + Math.random() * 900000)}`;
        setGeneratedAppId(appId);
      }
    }

    if (currentStep === 10) {
      // Advanced to receipts
    }

    if (currentStep === 11) {
      if (paymentMethod !== 'Cash' && !transactionRef.trim()) {
        setErrorMsg('Transaction reference is required for digital verification.');
        return;
      }
      if (paymentMethod !== 'Cash' && !receiptPhoto) {
        setErrorMsg('Please upload a file or photo of your payment receipt.');
        return;
      }

      // SUBMIT THE APPLICATION offically
      handleSubmitApplication();
    }

    const next = currentStep + 1;
    setCurrentStep(next);
    saveProgressDraft(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      saveProgressDraft(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ----------------------------------------------------
  // SUBMIT COMPLETED APPLICATION RECORD
  // ----------------------------------------------------
  const handleSubmitApplication = () => {
    if (!currentUser || !selectedCourse) return;

    const finalAppId = generatedAppId || `APP-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedAppId(finalAppId);

    const priceDetails = selectedCourse.pricing[selectedDurationIndex] || selectedCourse.pricing[0];
    const totalCourseFee = priceDetails.price;
    const isMonthly = priceDetails.period === 'per month';
    const totalDue = selectedCourse.registrationFee + totalCourseFee;

    const newApplication = {
      id: finalAppId,
      userId: currentUser.id,
      studentName: `${firstName} ${middleName} ${lastName}`,
      gender,
      age: Number(age) || 18,
      dob,
      phone,
      email,
      altPhone,
      emergency: {
        name: emergencyName,
        relation: emergencyRelation,
        phone: emergencyPhone,
        altPhone: emergencyAltPhone,
        address: emergencyAddress
      },
      address: {
        country,
        region,
        city,
        subCity,
        woreda,
        kebele,
        streetArea,
        detailedAddress
      },
      profileType: registerAs,
      education: registerAs === 'Student' ? {
        type: educationType,
        institution: instName,
        department: deptName,
        degreeType,
        year: currentYear
      } : null,
      employment: registerAs === 'Employee' ? {
        type: employmentType,
        company: companyName,
        title: jobTitle,
        address: workAddress
      } : null,
      musicalBackground: {
        hasExp: prevExp,
        instrument: prevInstrument,
        years: yearsExp,
        level: currentLevel,
        teacher: prevTeacher,
        school: musicSchool,
        description: expDescription,
        ownInstrument,
        ownType,
        haveAccess
      },
      churchInfo: {
        name: churchName,
        location: churchLocation,
        role: churchRole
      },
      course: {
        id: selectedCourse.id,
        name: selectedCourse.name,
        registrationFee: selectedCourse.registrationFee,
        courseFee: totalCourseFee,
        isMonthly,
        totalDue
      },
      level: selectedLevelName,
      learningMode,
      branch: learningMode === 'In-Person' ? selectedBranch : 'Online',
      duration: priceDetails.duration,
      scheduleDays: selectedScheduleDays,
      classTime: selectedClassTime,
      payment: {
        method: paymentMethod,
        ref: transactionRef,
        date: paymentDate,
        amount: Number(amountPaid) || totalDue,
        receipt: receiptPhoto
      },
      paymentStatus: paymentMethod === 'Cash' ? 'Pending Cash Verification' : 'Pending Verification',
      status: 'Application Submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expectedNextStep: paymentMethod === 'Cash' 
        ? 'Present cash payment at your selected branch to activate enrollment.' 
        : 'Our accountant is verifying your transaction reference. Verification completes in 2-4 hours.'
    };

    // Store in global list of applications
    const savedApps = localStorage.getItem('ab_applications_v3');
    let applicationsList = [];
    if (savedApps) {
      try {
        applicationsList = JSON.parse(savedApps);
      } catch (e) {
        console.error(e);
      }
    }

    // Replace if exists, or append
    const existingIndex = applicationsList.findIndex((a: any) => a.id === finalAppId || (a.userId === currentUser?.id && a.status === 'Incomplete'));
    if (existingIndex > -1) {
      applicationsList[existingIndex] = newApplication;
    } else {
      applicationsList.unshift(newApplication);
    }

    safeSetItem('ab_applications_v3', JSON.stringify(applicationsList));

    // Also persist directly to Accountant Transactions (`ab_transactions_v3`) for immediate visibility
    try {
      const savedTxns = JSON.parse(localStorage.getItem('ab_transactions_v3') || '[]');
      const studentFullName = `${firstName} ${middleName} ${lastName}`.trim() || currentUser?.fullName || 'New Student';
      const branchName = learningMode === 'In-Person' ? (selectedBranch || 'Hawassa Campus') : 'Online';
      
      const newTxn = {
        id: `TXN-${finalAppId}`,
        studentName: studentFullName,
        studentId: currentUser?.id || finalAppId,
        course: selectedCourse.name,
        level: selectedLevelName,
        branch: branchName,
        paymentType: 'Course Registration & Tuition',
        amount: Number(amountPaid) || totalDue,
        paymentMethod: paymentMethod,
        date: paymentDate || new Date().toISOString().split('T')[0],
        referenceNumber: transactionRef || `REF-${finalAppId}`,
        receiptImage: receiptPhoto || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        status: 'Pending',
        createdBy: 'Student Direct Registration',
        notes: `Submitted online application for ${selectedCourse.name}`
      };

      const existingTxnIdx = savedTxns.findIndex((t: any) => t.id === newTxn.id || (t.referenceNumber && t.referenceNumber === newTxn.referenceNumber));
      if (existingTxnIdx > -1) {
        savedTxns[existingTxnIdx] = newTxn;
      } else {
        savedTxns.unshift(newTxn);
      }
      safeSetItem('ab_transactions_v3', JSON.stringify(savedTxns));
    } catch (e) {
      console.error("Failed to write transaction to ab_transactions_v3", e);
    }

    // 1. Create/Update Persistent Student in DataContext
    const studentFullName = `${firstName} ${middleName} ${lastName}`.trim() || currentUser?.fullName || 'New Student';
    const branchName = learningMode === 'In-Person' ? (selectedBranch || 'Hawassa Campus') : 'Online';
    
    try {
      addStudentRegistration({
        fullName: studentFullName,
        email: email || currentUser?.email || 'student@begena.com',
        phone: phone || currentUser?.phone || '',
        gender: gender || 'Male',
        age: Number(age) || 18,
        emergencyContact: `${emergencyName} (${emergencyRelation}) - ${emergencyPhone}`,
        address: `${city}, ${subCity}, ${woreda}`,
        previousExperience: prevExp ? `${yearsExp} years playing ${prevInstrument}` : 'No previous experience',
        instrumentOwned: ownInstrument ? ownType : 'None',
        churchName: churchName || undefined,
        occupation: registerAs === 'Employee' ? jobTitle : registerAs,
        photoUrl: profilePhoto || undefined,
        courseId: selectedCourse?.id || 'begena',
        courseName: selectedCourse?.name || 'Begena - Level 1',
        instrument: selectedCourse?.instrument || selectedCourse?.name || 'Begena',
        level: selectedLevelName || 'Level 1: Basic Foundation',
        branch: branchName,
        learningMode: learningMode,
        scheduleFrequency: selectedDurationIndex === 0 ? '5 Days' : selectedDurationIndex === 1 ? '3 Days' : '2 Days',
        scheduleDays: selectedScheduleDays.length > 0 ? selectedScheduleDays : (selectedDurationIndex === 0 ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] : selectedDurationIndex === 1 ? ['Monday', 'Wednesday', 'Friday'] : ['Tuesday', 'Thursday']),
        scheduleDayTime: `${(selectedScheduleDays.length > 0 ? selectedScheduleDays : (selectedDurationIndex === 0 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : selectedDurationIndex === 1 ? ['Mon', 'Wed', 'Fri'] : ['Tue', 'Thu'])).map(d => d.slice(0, 3)).join('/')} - ${selectedClassTime || 'Morning (9:00 AM - 12:00 PM)'}`,
        schedule: `${(selectedScheduleDays.length > 0 ? selectedScheduleDays : (selectedDurationIndex === 0 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : selectedDurationIndex === 1 ? ['Mon', 'Wed', 'Fri'] : ['Tue', 'Thu'])).map(d => d.slice(0, 3)).join('/')} - ${selectedClassTime || 'Morning (9:00 AM - 12:00 PM)'}`,
        classTime: selectedClassTime || 'Morning (9:00 AM - 12:00 PM)',
        durationMonths: selectedDurationIndex === 0 ? 3 : selectedDurationIndex === 1 ? 4 : 6,
        registrationFeeETB: selectedCourse.registrationFee,
        courseFeeETB: totalCourseFee,
        totalFeeETB: totalDue,
        paymentReference: transactionRef || `REF-${finalAppId}`,
        paymentProofUrl: receiptPhoto || undefined,
        paymentMethod: paymentMethod,
        registrationSource: 'Self-Registered',
        registeredBy: 'Self'
      });
    } catch (e) {
      console.error('Error adding persistent student registration', e);
    }

    // 2. Submit Payment Receipt in DataContext if non-cash or reference provided
    if (paymentMethod !== 'Cash' || transactionRef) {
      try {
        submitPaymentReceipt({
          studentId: currentUser?.id || finalAppId,
          studentName: studentFullName,
          studentEmail: email || currentUser?.email || 'student@begena.com',
          studentPhone: phone || currentUser?.phone || '',
          courseName: selectedCourse?.name || 'Begena',
          instrument: selectedCourse?.instrument || selectedCourse?.name || 'Begena',
          branch: branchName,
          learningMode: learningMode,
          amountETB: Number(amountPaid) || totalDue,
          paymentMethod: paymentMethod,
          referenceNumber: transactionRef || `REF-${finalAppId}`,
          paymentDate: paymentDate || new Date().toISOString().split('T')[0],
          screenshotUrl: receiptPhoto || undefined,
          studentPhotoUrl: profilePhoto || undefined
        });
      } catch (e) {
        console.error('Error submitting payment receipt', e);
      }
    }

    // Update user profile status via updateProfile to correctly sync state and update React context across the app!
    updateProfile({
      avatar: profilePhoto || currentUser?.avatar,
      studentStatus: 'Payment Under Review',
      status: 'Pending Approval',
      isRegistrationCompleted: true,
      isPaymentCompleted: false
    });

    // Trigger notification
    addNotification(
      'Application Transmitted',
      `Application ${finalAppId} for ${selectedCourse.name} successfully submitted for accountant review.`,
      'registration'
    );

    // Create persistent Student Enrollment record
    try {
      addStudentEnrollment({
        studentId: currentUser?.id || finalAppId,
        studentName: studentFullName,
        studentEmail: email || currentUser?.email || 'student@begena.com',
        studentPhone: phone || currentUser?.phone || '',
        courseId: selectedCourse?.id || 'begena',
        courseName: selectedCourse?.name || 'Begena - Level 1',
        instrument: selectedCourse?.instrument || selectedCourse?.name || 'Begena',
        level: selectedLevelName || 'Level 1: Basic Foundation',
        learningMode: learningMode,
        branch: branchName,
        status: 'Pending Verification'
      }, 'Student Online Registration');
    } catch (e) {
      console.error("Failed to create student enrollment", e);
    }

    // Clear incomplete registration draft since it's submitted!
    localStorage.removeItem('ab_incomplete_registration_v3');
  };

  // Duration dictates schedule frequency
  const getRequiredDaysCount = () => {
    if (selectedDurationIndex === 0) return 5; // Package 1: 3 months = 5 days/wk (1 hr/day)
    if (selectedDurationIndex === 1) return 3; // Package 2: 4 months = 3 days/wk (1.5 hrs/day)
    return 2; // Package 3: 6 months = 2 days/wk (2 hrs/day)
  };

  // Schedule status indicators generator
  const getDayStatus = (day: string) => {
    // Generate static deterministic statuses
    const dayCode = day.charCodeAt(0) + day.charCodeAt(day.length - 1);
    if (dayCode % 7 === 0) return { label: 'Full', color: 'text-red-500 bg-red-50 border-red-200' };
    if (dayCode % 5 === 0) return { label: 'Almost Full', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (dayCode % 3 === 0) return { label: 'Waitlist', color: 'text-blue-500 bg-blue-50 border-blue-200' };
    return { label: 'Available', color: 'text-green-600 bg-green-50 border-green-200' };
  };

  // Real File Upload Handler with Validation
  const handleFileUpload = (file: File, type: 'profile' | 'receipt') => {
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 5MB limit. Please select a smaller file.');
      return;
    }

    // Validate file extension/type
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (type === 'profile' && !isImage) {
      setErrorMsg('Profile photo must be a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (type === 'receipt' && !isImage && !isPdf) {
      setErrorMsg('Payment receipt must be an image (JPG, PNG, WebP) or PDF file.');
      return;
    }

    setErrorMsg(null);
    compressImageFile(file).then((result) => {
      if (type === 'profile') {
        setProfilePhoto(result);
        addNotification('Profile Photo Selected', 'Your profile photo has been loaded and saved.', 'system');
      } else {
        setReceiptPhoto(result);
        addNotification('Payment Receipt Selected', 'Payment receipt image uploaded successfully.', 'payment');
      }
    });
  };

  // Handle Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent, type: 'profile' | 'receipt') => {
    e.preventDefault();
    if (type === 'profile') setIsDragOverPhoto(true);
    else setIsDragOverReceipt(true);
  };

  const handleDragLeave = (type: 'profile' | 'receipt') => {
    if (type === 'profile') setIsDragOverPhoto(false);
    else setIsDragOverReceipt(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'profile' | 'receipt') => {
    e.preventDefault();
    if (type === 'profile') setIsDragOverPhoto(false);
    else setIsDragOverReceipt(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], type);
    }
  };

  // ----------------------------------------------------
  // PRICING HELPER
  // ----------------------------------------------------
  const getPricingSummary = () => {
    if (!selectedCourse) return { registrationFee: 0, courseFee: 0, total: 0, isMonthly: false };
    const priceDetails = selectedCourse.pricing[selectedDurationIndex] || selectedCourse.pricing[0];
    const courseFee = priceDetails.price;
    const registrationFee = selectedCourse.registrationFee;
    const isMonthly = priceDetails.period === 'per month';
    const total = registrationFee + courseFee;
    return { registrationFee, courseFee, total, isMonthly };
  };

  const { registrationFee, courseFee, total, isMonthly } = getPricingSummary();

  return (
    <div className="max-w-4xl mx-auto py-6 text-left">
      
      {/* 1. TOP PROGRESS RAIL & STICKY CONTROLS */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none">
          {/* Subtle decoration */}
        </div>
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#E89B52] uppercase font-bold">
            Liora Begena School Onboarding
          </span>
          <h2 className="font-display font-black text-xl text-[#2B2B2B]">
            STUDENT ENROLLMENT REGISTER
          </h2>
          <p className="text-xs text-gray-400">
            Current Stage: <span className="text-[#C79A2B] font-bold">Step {steps[currentStep - 1].num} — {steps[currentStep - 1].title}</span>
          </p>
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col text-right pr-2">
            <span className="text-xs font-mono font-bold text-[#E89B52]">
              {Math.round((currentStep / 12) * 100)}% Complete
            </span>
            <span className="text-[10px] text-gray-400">Estimated 3 mins left</span>
          </div>
          {currentStep < 12 && (
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveAndContinueLater}
                className="text-[11px] text-[#6F4E37] uppercase font-bold hover:bg-[#FAF6EF]"
              >
                Save Draft
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStartOver}
                className="text-[11px] text-red-600 hover:text-white uppercase font-bold hover:bg-red-500"
              >
                Reset
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN SPLIT LAYOUT (INDICATOR SIDEBAR + STEP CONTAINER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR TIMELINE STAGES */}
        <div className="hidden lg:block lg:col-span-3 space-y-2 bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-xs">
          <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-4 border-b pb-2">
            Journey Steps
          </h3>
          <div className="space-y-3">
            {steps.map((s, idx) => {
              const stepIndex = idx + 1;
              const isCurrent = currentStep === stepIndex;
              const isCompleted = currentStep > stepIndex;

              return (
                <div
                  key={s.num}
                  className={`flex items-start gap-3 p-1.5 rounded-lg transition-colors ${
                    isCurrent ? 'bg-[#FAF6EF]' : ''
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-[#E89B52] border-[#E89B52] text-white ring-2 ring-[#E89B52]/20'
                        : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-[#E7DED1] text-gray-400'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </span>
                  <div className="text-left">
                    <p
                      className={`text-[11px] font-bold leading-none ${
                        isCurrent ? 'text-[#2B2B2B]' : isCompleted ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-1">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIVE FORM AREA */}
        <div className="lg:col-span-9 bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-sm relative min-h-[500px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ERROR NOTICE DISPLAY */}
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-800" id="wizard-error">
                  <AlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Please check registration rules</span>
                    <p>{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 1: PERSONAL INFORMATION
                  ---------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">01 • Personal Identity</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Please specify your authentic names as registered on government IDs.</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-center border-b pb-6">
                    {/* Drag and Drop Profile photo */}
                    <input
                      type="file"
                      id="profile-photo-input"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profile')}
                    />
                    <div
                      onDragOver={(e) => handleDragOver(e, 'profile')}
                      onDragLeave={() => handleDragLeave('profile')}
                      onDrop={(e) => handleDrop(e, 'profile')}
                      onClick={() => document.getElementById('profile-photo-input')?.click()}
                      className={`w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-all ${
                        isDragOverPhoto
                          ? 'border-[#E89B52] bg-[#FAF6EF]'
                          : profilePhoto
                          ? 'border-green-500 bg-green-50/20'
                          : 'border-[#E7DED1] hover:border-[#C79A2B] hover:bg-[#FAF6EF]/50'
                      }`}
                    >
                      {profilePhoto ? (
                        <>
                          <img src={profilePhoto} alt="Student preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfilePhoto(null);
                            }}
                            className="absolute bottom-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
                            title="Remove photo"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-3 text-gray-400 space-y-1">
                          <Camera size={24} className="mx-auto text-[#C79A2B]" />
                          <p className="text-[9px] font-bold leading-tight text-[#2B2B2B]">Drag and drop profile photo</p>
                          <p className="text-[8px] text-amber-700 font-semibold">or click to browse file</p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-left">
                      <h4 className="text-xs font-bold text-[#2B2B2B]">Student Identity Photo (Real Upload)</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        An official face shot from your device is required for official records, student credentials, and certificates.
                        <br />
                        <span className="font-semibold text-gray-700">Supported formats:</span> JPG, PNG, WebP (Max size: 5MB).
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-[11px] font-bold bg-[#FAF6EF] border-[#E7DED1] hover:bg-[#E89B52] hover:text-white"
                          onClick={() => document.getElementById('profile-photo-input')?.click()}
                        >
                          <Upload size={12} className="mr-1.5 inline" /> Select Photo File
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Naming inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">First Name (Your Name)</label>
                      <Input
                        required
                        placeholder="e.g. Abebe"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Middle Name (Father's Name)</label>
                      <Input
                        required
                        placeholder="e.g. Kebede"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Last Name (Grandfather's)</label>
                      <Input
                        placeholder="e.g. Tola"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Gender Selection</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Date of Birth</label>
                      <Input
                        required
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Calculated Age</label>
                      <div className="w-full h-10 px-3 bg-[#FAF6EF]/60 border border-[#E7DED1] rounded-md text-sm flex items-center text-gray-500 font-bold">
                        {age !== '' ? `${age} Years Old` : 'Provide Date of Birth'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Email Address</label>
                      <Input
                        type="email"
                        placeholder="student@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail size={16} className="text-gray-400" />}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Mobile Number (Primary)</label>
                      <Input
                        required
                        placeholder="+251 911 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        leftIcon={<Phone size={16} className="text-gray-400" />}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 2: CONTACT & EMERGENCY
                  ---------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">02 • Contact & Emergency Contacts</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Ensure school staff can contact your guarantor in case of emergencies or scheduling changes.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Alternative Phone Number</label>
                      <Input
                        placeholder="+251 922 000 000"
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        leftIcon={<Phone size={16} className="text-gray-400" />}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Emergency Contact Full Name</label>
                      <Input
                        required
                        placeholder="Guarantor / Parent / Spouse name"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        leftIcon={<User size={16} className="text-gray-400" />}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Guarantor Relationship</label>
                      <Input
                        required
                        placeholder="e.g. Mother, Father, Spouse"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Emergency Phone (Primary)</label>
                      <Input
                        required
                        placeholder="+251 9..."
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        leftIcon={<Phone size={16} className="text-gray-400" />}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Emergency Phone (Alternative)</label>
                      <Input
                        placeholder="+251 9..."
                        value={emergencyAltPhone}
                        onChange={(e) => setEmergencyAltPhone(e.target.value)}
                        leftIcon={<Phone size={16} className="text-gray-400" />}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Guarantor's Permanent Address</label>
                    <textarea
                      placeholder="Specify neighborhood, house number, woreda..."
                      value={emergencyAddress}
                      onChange={(e) => setEmergencyAddress(e.target.value)}
                      className="w-full h-20 px-3 py-2 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 3: ADDRESS
                  ---------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">03 • Residential Address</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Provide detailed location data. Appropriate for students residing in Addis Ababa, other regional cities, or abroad.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Country</label>
                      <Input
                        required
                        placeholder="e.g. Ethiopia"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        leftIcon={<MapPin size={16} className="text-gray-400" />}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Region / State</label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                      >
                        <option value="Addis Ababa">Addis Ababa</option>
                        <option value="Amhara">Amhara</option>
                        <option value="Oromia">Oromia</option>
                        <option value="Tigray">Tigray</option>
                        <option value="Sidama">Sidama</option>
                        <option value="SNNPR">SNNPR</option>
                        <option value="Harari">Harari</option>
                        <option value="Dire Dawa">Dire Dawa</option>
                        <option value="Afar">Afar</option>
                        <option value="Gambela">Gambela</option>
                        <option value="Benishangul-Gumuz">Benishangul-Gumuz</option>
                        <option value="Outside Ethiopia">Outside Ethiopia (Diaspora)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">City</label>
                      <Input
                        required
                        placeholder="e.g. Addis Ababa"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Sub-city / Zone</label>
                      <Input
                        required
                        placeholder="e.g. Bole, Kirkos, Arada"
                        value={subCity}
                        onChange={(e) => setSubCity(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Woreda</label>
                      <Input
                        placeholder="e.g. 03"
                        value={woreda}
                        onChange={(e) => setWoreda(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Kebele</label>
                      <Input
                        placeholder="e.g. 14"
                        value={kebele}
                        onChange={(e) => setKebele(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Street / Local Area</label>
                      <Input
                        placeholder="e.g. Bole Medhanialem, near Atlas"
                        value={streetArea}
                        onChange={(e) => setStreetArea(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Specific / Detailed Address</label>
                      <Input
                        placeholder="House Number, Condominium Block, Apartment No."
                        value={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 4: EDUCATION & OCCUPATION
                  ---------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">04 • Education & Occupation</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Please indicate your primary category. The academy supports academic adjustment structures.</p>
                  </div>

                  <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E7DED1] flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <span className="text-xs font-bold text-[#6F4E37] uppercase tracking-wider">
                      "I am registering as a:"
                    </span>
                    <div className="flex bg-white border border-[#E7DED1] rounded-lg overflow-hidden shrink-0">
                      {(['Student', 'Employee', 'Other'] as const).map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => {
                            setRegisterAs(type);
                            setIsStudent(type === 'Student');
                            setIsEmployed(type === 'Employee');
                          }}
                          className={`px-4 py-2 text-xs font-bold uppercase transition-all ${
                            registerAs === type
                              ? 'bg-[#E89B52] text-white'
                              : 'text-gray-400 hover:text-[#2B2B2B]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {registerAs === 'Student' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Education Type</label>
                          <select
                            value={educationType}
                            onChange={(e) => setEducationType(e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                          >
                            <option value="Elementary">Elementary School</option>
                            <option value="High School">High School</option>
                            <option value="TVET">TVET College</option>
                            <option value="University">University</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">School / Institution Name</label>
                          <Input
                            required
                            placeholder="e.g. Addis Ababa University"
                            value={instName}
                            onChange={(e) => setInstName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Department / Field</label>
                          <Input
                            required
                            placeholder="e.g. Architecture, Medicine, Social"
                            value={deptName}
                            onChange={(e) => setDeptName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Degree Type</label>
                          <select
                            value={degreeType}
                            onChange={(e) => setDegreeType(e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                          >
                            <option value="None">None (Elementary/Highschool)</option>
                            <option value="TVET Certificate">TVET Certificate</option>
                            <option value="Bachelor's">Bachelor's Degree</option>
                            <option value="Master's">Master's Degree</option>
                            <option value="PhD">Doctor of Philosophy (PhD)</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Current Academic Year</label>
                          <Input
                            required
                            placeholder="e.g. 3rd Year"
                            value={currentYear}
                            onChange={(e) => setCurrentYear(e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {registerAs === 'Employee' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Employment Sector</label>
                          <Input
                            placeholder="e.g. Government, Tech, Private"
                            value={employmentType}
                            onChange={(e) => setEmploymentType(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Company / Organization</label>
                          <Input
                            required
                            placeholder="e.g. Commercial Bank of Ethiopia"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Job Title / Role</label>
                          <Input
                            required
                            placeholder="e.g. Senior Accountant, Software Engineer"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Office / Work Address</label>
                          <Input
                            placeholder="Specify neighborhood/building"
                            value={workAddress}
                            onChange={(e) => setWorkAddress(e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {registerAs === 'Other' && (
                    <div className="p-4 bg-[#FAF6EF]/50 rounded-xl border border-dashed text-xs text-gray-500">
                      Education or employment are not required. You can bypass specific occupation parameters. Proceed directly to the musical background details.
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 5: MUSICAL BACKGROUND & CHURCH INFO
                  ---------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">05 • Musical Experience & Affiliation</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Understanding your prior experience helps place you with appropriate classmates.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prevExp}
                        onChange={() => setPrevExp(!prevExp)}
                        className="w-4 h-4 text-[#E89B52] border-[#E7DED1] rounded"
                      />
                      <span className="text-xs font-bold text-[#2B2B2B] uppercase">
                        "I have previous musical training or instrument experience"
                      </span>
                    </label>

                    {prevExp && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Instrument Learned</label>
                          <Input
                            placeholder="e.g. Krar, Piano, Flute"
                            value={prevInstrument}
                            onChange={(e) => setPrevInstrument(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Years Played</label>
                          <Input
                            placeholder="e.g. 2 years"
                            value={yearsExp}
                            onChange={(e) => setYearsExp(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Self-assessed Level</label>
                          <select
                            value={currentLevel}
                            onChange={(e) => setCurrentLevel(e.target.value)}
                            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div className="space-y-1.5 sm:col-span-3">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Brief description of musical background</label>
                          <textarea
                            placeholder="Explain what chants, hymns, or pieces you can perform..."
                            value={expDescription}
                            onChange={(e) => setExpDescription(e.target.value)}
                            className="w-full h-16 px-3 py-2 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Instrument Ownership */}
                  <div className="border-t pt-4 space-y-4">
                    <h4 className="text-xs font-bold text-[#2B2B2B] uppercase">Instrument Access</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-start gap-2.5 cursor-pointer border p-3 rounded-xl bg-white hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={ownInstrument}
                          onChange={() => setOwnInstrument(!ownInstrument)}
                          className="w-4 h-4 text-[#E89B52] border-[#E7DED1] rounded mt-0.5 animate-pulse"
                        />
                        <div className="text-left text-xs">
                          <p className="font-bold">I currently own an instrument</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">You have a personal instrument ready at home.</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer border p-3 rounded-xl bg-white hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={haveAccess}
                          onChange={() => setHaveAccess(!haveAccess)}
                          className="w-4 h-4 text-[#E89B52] border-[#E7DED1] rounded mt-0.5"
                        />
                        <div className="text-left text-xs">
                          <p className="font-bold">I have daily practice access</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Access to a friend's, local church, or school instrument.</p>
                        </div>
                      </label>
                    </div>

                    {ownInstrument && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-[#FAF6EF]/70 border rounded-xl flex gap-3 text-xs items-center"
                      >
                        <span className="text-[10px] font-bold text-[#6F4E37]">OWNED INSTRUMENT TYPE:</span>
                        <select
                          value={ownType}
                          onChange={(e) => setOwnType(e.target.value)}
                          className="px-2.5 py-1 bg-white border rounded text-xs focus:border-[#C79A2B] outline-none"
                        >
                          <option value="Begena">Begena</option>
                          <option value="Krar">Krar</option>
                          <option value="Masenqo">Masenqo</option>
                          <option value="Washint">Washint</option>
                          <option value="Kebero">Kebero</option>
                          <option value="Other">Other</option>
                        </select>
                      </motion.div>
                    )}
                  </div>

                  {/* Optional Church Affiliation */}
                  <div className="border-t pt-4 space-y-4">
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-[#2B2B2B] uppercase">Spiritual / Church Affiliation (Optional)</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Provide this if you currently perform choir or service roles within your parish.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Parish Church Name</label>
                        <Input
                          placeholder="e.g. Bole Medhanialem"
                          value={churchName}
                          onChange={(e) => setChurchName(e.target.value)}
                          leftIcon={<Building size={16} className="text-gray-400" />}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Parish Location</label>
                        <Input
                          placeholder="e.g. Addis Ababa"
                          value={churchLocation}
                          onChange={(e) => setChurchLocation(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Service / Choir Role</label>
                        <Input
                          placeholder="e.g. Deacon, Choir Member"
                          value={churchRole}
                          onChange={(e) => setChurchRole(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 6: COURSE SELECTION
                  ---------------------------------------------------- */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">06 • Choose Instrument Course</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Choose the traditional program you want to study. You can study other instruments later.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {COURSES_DATA.map((course) => {
                      const isComingSoon = isCourseComingSoon(course.id);
                      const isSelected = selectedCourse?.id === course.id;
                      return (
                        <div
                          key={course.id}
                          onClick={() => {
                            if (isComingSoon) {
                              addNotification(
                                `${course.name} - Coming Soon`,
                                `Admissions for ${course.name} are currently under preparation. Active admissions are available for Begena and Krar!`,
                                'system'
                              );
                              alert(`Admissions for ${course.name} are coming soon! Currently only Begena and Krar have active registrations open.`);
                              return;
                            }
                            setSelectedCourse(course);
                          }}
                          className={`border rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between group relative ${
                            isComingSoon
                              ? 'border-amber-200/80 bg-amber-50/20 hover:border-amber-400'
                              : isSelected
                              ? 'border-[#E89B52] ring-2 ring-[#E89B52]/20 bg-[#FAF6EF]/30 shadow-xs'
                              : 'border-[#E7DED1] hover:border-[#C79A2B] bg-white hover:shadow-2xs'
                          }`}
                        >
                          <div className="aspect-[3/4] w-full relative overflow-hidden bg-[#FAF6EF]">
                            <img
                              src={course.image}
                              alt={course.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {isComingSoon ? (
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border border-amber-500/40">
                                Coming Soon
                              </div>
                            ) : (
                              <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-xs">
                                ★ {course.rating}
                              </div>
                            )}
                            {isSelected && !isComingSoon && (
                              <div className="absolute inset-0 bg-[#E89B52]/20 backdrop-blur-[1px] flex items-center justify-center">
                                <span className="bg-[#E89B52] text-white p-2 rounded-full shadow-md">
                                  <Check size={20} />
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-3.5 space-y-2 text-left flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs font-bold text-[#2B2B2B] group-hover:text-[#E89B52] transition-colors">{course.name}</h4>
                                {isComingSoon && (
                                  <span className="text-[8px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-1 py-0.2 rounded">
                                    Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                {course.shortDescription}
                              </p>
                            </div>
                            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-gray-400 pt-2 border-t border-[#FAF6EF]">
                              <span>Reg Fee: {course.registrationFee} ETB</span>
                              <span className="text-[#E89B52] font-sans font-bold">
                                {isComingSoon ? 'Coming Soon' : `${course.pricing[0].price} ETB`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 7: LEARNING PREFERENCES
                  ---------------------------------------------------- */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">07 • Learning Preferences</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Configure your syllabus level, classroom format, and billing options.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Level selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block">Select Target Level</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedCourse?.levels.map((lvl) => {
                          const isSel = selectedLevelName === lvl;
                          return (
                            <div
                              key={lvl}
                              onClick={() => setSelectedLevelName(lvl)}
                              className={`border p-3 rounded-xl cursor-pointer text-xs font-bold flex items-center justify-between transition-colors ${
                                isSel
                                  ? 'border-[#E89B52] bg-[#FAF6EF]'
                                  : 'border-[#E7DED1] hover:border-[#C79A2B] bg-white'
                              }`}
                            >
                              <span>{lvl.split(':')[0]}</span>
                              {isSel && <CheckCircle size={14} className="text-[#E89B52]" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Learning mode */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block">Learning Mode</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => setLearningMode('In-Person')}
                          className={`border p-4 rounded-xl cursor-pointer text-left transition-colors ${
                            learningMode === 'In-Person'
                              ? 'border-[#E89B52] bg-[#FAF6EF]/50'
                              : 'border-[#E7DED1] hover:border-[#C79A2B] bg-white'
                          }`}
                        >
                          <p className="text-xs font-bold uppercase">Physical / In-Person</p>
                          <p className="text-[10px] text-gray-400 mt-1">Study inside real classrooms with teachers at our Hawassa campus.</p>
                        </div>

                        <div
                          onClick={() => setLearningMode('Online')}
                          className={`border p-4 rounded-xl cursor-pointer text-left transition-colors ${
                            learningMode === 'Online'
                              ? 'border-[#E89B52] bg-[#FAF6EF]/50'
                              : 'border-[#E7DED1] hover:border-[#C79A2B] bg-white'
                          }`}
                        >
                          <p className="text-xs font-bold uppercase">Online / Virtual</p>
                          <p className="text-[10px] text-gray-400 mt-1">Global classes via Google Meet. Receive live 1-on-1 assignments & materials.</p>
                        </div>
                      </div>
                    </div>

                    {/* Physical branch if physical */}
                    {learningMode === 'In-Person' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        <label className="text-[10px] font-bold text-gray-500 uppercase block">Select Branch Location</label>
                        <select
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                        >
                          <option value="Hawassa Campus">Hawassa Campus (Center Point Tower, 1st Floor)</option>
                        </select>
                      </motion.div>
                    )}

                    {/* Duration Option Packages */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block">Select Duration & Pricing Pack</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedCourse?.pricing.map((opt, idx) => {
                          const isSel = selectedDurationIndex === idx;
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedDurationIndex(idx);
                                // reset schedule selection when duration switches (since frequency changes)
                                setSelectedScheduleDays([]);
                              }}
                              className={`border p-4 rounded-xl cursor-pointer text-center space-y-1 transition-all ${
                                isSel
                                  ? 'border-[#E89B52] bg-[#FAF6EF] ring-1 ring-[#E89B52]'
                                  : 'border-[#E7DED1] bg-white hover:border-[#C79A2B]'
                              }`}
                            >
                              <p className="text-[10px] font-bold uppercase text-gray-500">{opt.duration}</p>
                              <p className="text-lg font-black text-[#2B2B2B]">{opt.price} ETB</p>
                              <p className="text-[9px] text-[#666666]">
                                {opt.period === 'per month' ? '/ month' : ' per month'}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 8: SCHEDULE
                  ---------------------------------------------------- */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">08 • Class Schedule Allocation</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Your chosen billing duration requires a specific weekly class frequency.</p>
                  </div>

                  {/* Frequency explanation */}
                  <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-1 text-xs">
                    <p className="font-bold text-[#6F4E37] uppercase">Weekly Frequency Allocation Rule:</p>
                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 text-gray-500">
                      <div>
                        <span className="font-bold text-[#E89B52]">Package 1 (3 Months):</span>
                        <p>5 class days / week (1 hr/day)</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#E89B52]">Package 2 (4 Months):</span>
                        <p>3 class days / week (1.5 hrs/day)</p>
                      </div>
                      <div>
                        <span className="font-bold text-[#E89B52]">Package 3 (6 Months):</span>
                        <p>2 class days / week (2 hrs/day)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        Select Available Class Days
                      </span>
                      <span className="text-xs font-bold text-[#E89B52]">
                        Please choose exactly {getRequiredDaysCount()} days
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                        const isSelected = selectedScheduleDays.includes(day);
                        const statusInfo = getDayStatus(day);
                        const isFull = statusInfo.label === 'Full';

                        return (
                          <div
                            key={day}
                            onClick={() => {
                              if (isFull) return;
                              if (isSelected) {
                                setSelectedScheduleDays(selectedScheduleDays.filter((d) => d !== day));
                              } else {
                                if (selectedScheduleDays.length < getRequiredDaysCount()) {
                                  setSelectedScheduleDays([...selectedScheduleDays, day]);
                                } else {
                                  // replace first element or show error
                                  setSelectedScheduleDays([...selectedScheduleDays.slice(1), day]);
                                }
                              }
                            }}
                            className={`border p-3 rounded-xl cursor-pointer flex flex-col justify-between h-20 transition-all text-left ${
                              isSelected
                                ? 'border-[#E89B52] bg-[#FAF6EF]'
                                : isFull
                                ? 'border-red-100 bg-red-50/20 cursor-not-allowed opacity-60'
                                : 'border-[#E7DED1] hover:border-[#C79A2B] bg-white'
                            }`}
                          >
                            <span className="text-xs font-bold text-[#2B2B2B]">{day}</span>
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border self-start ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Class time */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block">Preferred Class Time Slots</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { name: 'Morning (9:00 AM - 12:00 PM)', detail: 'Available Seats' },
                        { name: 'Afternoon (2:00 PM - 5:00 PM)', detail: 'Limited Seats' },
                        { name: 'Evening (6:00 PM - 8:30 PM)', detail: 'Available Seats' }
                      ].map((slot) => {
                        const isSel = selectedClassTime === slot.name;
                        return (
                          <div
                            key={slot.name}
                            onClick={() => setSelectedClassTime(slot.name)}
                            className={`border p-3.5 rounded-xl cursor-pointer text-left transition-colors ${
                              isSel
                                ? 'border-[#E89B52] bg-[#FAF6EF]'
                                : 'border-[#E7DED1] hover:border-[#C79A2B] bg-white'
                            }`}
                          >
                            <p className="text-xs font-bold">{slot.name.split(' ')[0]}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{slot.name.split(' ')[1]}</p>
                            <span className="text-[8px] text-green-600 bg-green-50 border border-green-200 px-1 py-0.2 rounded mt-1 inline-block">
                              {slot.detail}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 9: ENROLLMENT REVIEW
                  ---------------------------------------------------- */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">09 • Review Course Enrollment</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Review your application payload carefully before submitting to the school registry.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF6EF]/60 p-6 rounded-2xl border border-[#E7DED1] text-xs">
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#6F4E37] uppercase tracking-wider border-b pb-1">STUDENT PROFILE</h4>
                      <p><strong>Full Name:</strong> {firstName} {middleName} {lastName}</p>
                      <p><strong>Gender:</strong> {gender}</p>
                      <p><strong>Calculated Age:</strong> {age} Years Old (DOB: {dob})</p>
                      <p><strong>Contact:</strong> {phone} / {email}</p>
                      <p><strong>Emergency contact:</strong> {emergencyName} ({emergencyRelation}) • {emergencyPhone}</p>
                      <p><strong>Permanent address:</strong> {city}, {subCity}, Woreda {woreda}</p>
                      <p><strong>Profile classification:</strong> {registerAs}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-[#6F4E37] uppercase tracking-wider border-b pb-1">ENROLLMENT PREFERENCES</h4>
                      <p><strong>Instrument program:</strong> {selectedCourse?.name}</p>
                      <p><strong>Target level:</strong> {selectedLevelName}</p>
                      <p><strong>Instruction format:</strong> {learningMode} {learningMode === 'In-Person' ? `(${selectedBranch})` : '(Google Meet)'}</p>
                      <p><strong>Duration package:</strong> {selectedCourse?.pricing[selectedDurationIndex].duration}</p>
                      <p><strong>Schedule:</strong> {selectedScheduleDays.join(', ')} ({selectedClassTime})</p>
                      <p><strong>Weekly frequency:</strong> {getRequiredDaysCount()} Days per Week</p>
                    </div>
                  </div>

                  {/* Pricing Breakdown Card */}
                  <div className="p-5 bg-white border-2 border-[#E7DED1] rounded-2xl shadow-sm text-xs space-y-3">
                    <h4 className="font-bold text-[#2B2B2B] uppercase tracking-wider border-b pb-2">PRICING TRANSPARENCY DEED</h4>
                    
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500">Standard School Admission Registration Fee (One-time):</span>
                      <span className="font-bold">{registrationFee} ETB</span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500">
                        {selectedCourse?.name} Monthly Tuition ({selectedCourse?.pricing[selectedDurationIndex]?.duration}):
                      </span>
                      <span className="font-bold">
                        {courseFee} ETB / month
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-t font-bold text-sm text-[#6F4E37]">
                      <span>INITIAL PAYMENT DUE (REGISTRATION + FIRST MONTH):</span>
                      <span className="text-lg font-black text-[#E89B52]">
                        {total} ETB
                      </span>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer pt-2 select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      className="w-4 h-4 text-[#E89B52] border-[#E7DED1] rounded mt-0.5"
                    />
                    <div className="text-left text-xs text-gray-500 leading-relaxed font-medium">
                      I legally confirm that all submitted educational, occupational, and financial receipts represent actual facts. I comply with the school's spiritual preservation code of conduct.
                    </div>
                  </label>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 10: PAYMENT METHOD
                  ---------------------------------------------------- */}
              {currentStep === 10 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">10 • Payment Method Selection</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Select your preferred payment medium. Provide authentic transaction receipt in the next step.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'CBE',
                        name: 'Commercial Bank of Ethiopia',
                        desc: 'CBE Birr / Direct Transfer',
                        instructions: 'Transfer the total amount to CBE Account No: [Configure in Admin Settings]. Take a screenshot of the confirmation.'
                      },
                      {
                        id: 'Telebirr',
                        name: 'Telebirr Wallet',
                        desc: 'Instant Mobile Money',
                        instructions: 'Send money to merchant number: [Configure in Admin Settings]. Save transaction receipt.'
                      },
                      {
                        id: 'Cash',
                        name: 'Cash Payment',
                        desc: 'Pay at physical office',
                        instructions: 'Please visit your selected branch location within 24 hours. The registration desk or accountant will manually sign your clearance.'
                      }
                    ].map((method) => {
                      const isSel = paymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`border p-5 rounded-2xl cursor-pointer text-left flex flex-col justify-between transition-all ${
                            isSel
                              ? 'border-[#E89B52] bg-[#FAF6EF]'
                              : 'border-[#E7DED1] bg-white hover:border-[#C79A2B]'
                          }`}
                        >
                          <div className="space-y-2">
                            <span className="text-xl">
                              {method.id === 'Cash' ? '💵' : method.id === 'CBE' ? '🏛️' : '📱'}
                            </span>
                            <h4 className="text-xs font-bold leading-tight">{method.name}</h4>
                            <p className="text-[10px] text-gray-400">{method.desc}</p>
                          </div>
                          {isSel && (
                            <span className="text-[9px] font-bold text-[#E89B52] mt-4 block">
                              ✓ Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment Instructions Board */}
                  <div className="p-5 bg-[#FAF6EF] rounded-2xl border border-[#E7DED1] text-xs space-y-3">
                    <h4 className="font-bold text-[#6F4E37] uppercase tracking-wider">OFFICIAL INSTRUCTIONS</h4>
                    
                    <p className="leading-relaxed">
                      {paymentMethod === 'CBE' && 'Please complete your transfer to: CBE Account Name: Liora Begena Traditional School • Account No: [Configure in Admin Settings] (Branch: Hawassa).'}
                      {paymentMethod === 'Telebirr' && 'Open your Telebirr application. Pay to Merchant / Merchant Number: [Configure in Admin Settings] (Liora Begena Traditional School).'}
                      {paymentMethod === 'Cash' && 'Your registration will reside in "Pending Cash Verification" status. Visit our office at Center Point Tower, 1st floor, Hawassa to settle transaction in person.'}
                    </p>

                    <div className="p-3 bg-white rounded-lg border flex gap-2.5 items-center font-bold text-[#C79A2B]">
                      <Info size={16} />
                      <span>INITIAL PAYMENT DUE: {total} ETB</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 11: RECEIPT SCREENSHOT SUBMISSION
                  ---------------------------------------------------- */}
              {currentStep === 11 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">11 • Submit Payment Receipt</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Provide confirmation details so that our accounting team can authorize your ledger.</p>
                  </div>

                  {paymentMethod === 'Cash' ? (
                    <div className="p-6 bg-[#FAF6EF] rounded-2xl border text-center space-y-4 max-w-md mx-auto">
                      <span className="text-3xl">💵</span>
                      <h4 className="text-sm font-bold uppercase text-[#2B2B2B]">Physical Cash Settle</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        You selected physical cash. Simply proceed to the final submission. Settle your payment of <b>{total} ETB</b> at our Hawassa Campus desk (Center Point Tower, 1st floor) to complete activation.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Drag and Drop receipt */}
                      <input
                        type="file"
                        id="receipt-photo-input"
                        accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'receipt')}
                      />
                      <div className="flex flex-col md:flex-row gap-6 items-center border-b pb-6">
                        <div
                          onDragOver={(e) => handleDragOver(e, 'receipt')}
                          onDragLeave={() => handleDragLeave('receipt')}
                          onDrop={(e) => handleDrop(e, 'receipt')}
                          onClick={() => document.getElementById('receipt-photo-input')?.click()}
                          className={`w-full md:w-44 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-all ${
                            isDragOverReceipt
                              ? 'border-[#E89B52] bg-[#FAF6EF]'
                              : receiptPhoto
                              ? 'border-green-500 bg-green-50/20'
                              : 'border-[#E7DED1] hover:border-[#C79A2B] hover:bg-[#FAF6EF]/50'
                          }`}
                        >
                          {receiptPhoto ? (
                            <>
                              <img src={receiptPhoto} alt="Payment receipt screenshot" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReceiptPhoto(null);
                                }}
                                className="absolute bottom-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-3 text-gray-400 space-y-1">
                              <Upload size={24} className="mx-auto text-[#C79A2B]" />
                              <p className="text-[9px] font-bold text-[#2B2B2B]">Drag payment receipt screenshot</p>
                              <p className="text-[8px] text-amber-700 font-semibold">or click to browse file</p>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-2 text-left">
                          <h4 className="text-xs font-bold text-[#2B2B2B] uppercase">Payment Receipt Upload (Real Verification)</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            Please upload the official digital transaction screenshot from Telebirr, CBE Birr, or your Mobile Banking app for accountant review.
                            <br />
                            <span className="font-semibold text-gray-700">Accepted formats:</span> JPG, PNG, WebP, PDF (Max size: 5MB).
                          </p>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-[11px] font-bold bg-[#FAF6EF] border-[#E7DED1] hover:bg-[#E89B52] hover:text-white"
                            onClick={() => document.getElementById('receipt-photo-input')?.click()}
                          >
                            <Upload size={12} className="mr-1.5 inline" /> Select Receipt Image File
                          </Button>
                        </div>
                      </div>

                      {/* Receipt data inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Transaction Reference Number</label>
                          <Input
                            required
                            placeholder="e.g. FT262334882..."
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Payment Date</label>
                          <Input
                            required
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Amount Paid (ETB)</label>
                          <Input
                            required
                            placeholder={total.toString()}
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ----------------------------------------------------
                  STEP 12: APPLICATION SUBMITTED
                  ---------------------------------------------------- */}
              {currentStep === 12 && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 bg-green-50 text-green-500 border border-green-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle size={32} />
                  </div>

                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="font-display font-black text-xl text-[#2B2B2B] uppercase">Application Transmitted!</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Congratulations, your student enrollment form for <b>{selectedCourse?.name} ({selectedLevelName})</b> is transmitted. Settle payment review blocks to begin learning.
                    </p>
                  </div>

                  <div className="border border-[#E7DED1] p-4 rounded-xl bg-[#FAF6EF]/60 text-xs text-left max-w-lg mx-auto grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="text-gray-400 block text-[9px] font-mono">APPLICATION ID</span>
                      <strong className="text-gray-700">{generatedAppId}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] font-mono">LEARNING MODE</span>
                      <strong className="text-gray-700">{learningMode} {learningMode === 'In-Person' ? `(${selectedBranch})` : ''}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] font-mono">PAYMENT METHOD</span>
                      <strong className="text-gray-700">{paymentMethod}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9px] font-mono">INITIAL BILLING DUE</span>
                      <strong className="text-gray-700">{total} ETB</strong>
                    </div>
                  </div>

                  {/* Progressive visual timeline checking */}
                  <div className="max-w-md mx-auto text-left space-y-4 pt-4 border-t">
                    <h4 className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider">Estimated Progress Timeline</h4>
                    
                    <div className="space-y-4">
                      {[
                        { title: 'Information Review', state: 'Verification Complete', date: new Date().toLocaleDateString() },
                        { title: 'Payment Verification', state: paymentMethod === 'Cash' ? 'Pending Cash Settle' : 'Under Accountant Review', active: true },
                        { title: 'Dean / Admin Approval', state: 'Staged' }
                      ].map((track, i) => (
                        <div key={i} className="flex gap-3 items-start text-xs">
                          <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${track.active ? 'bg-amber-500 animate-ping' : i === 0 ? 'bg-green-500' : 'bg-gray-200'}`} />
                          <div>
                            <p className="font-bold text-[#2B2B2B]">{track.title}</p>
                            <p className="text-[10px] text-gray-400">{track.state} {track.date ? `• ${track.date}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 max-w-sm mx-auto">
                    <Button
                      variant="primary"
                      className="w-full font-bold uppercase py-3"
                      onClick={() => onNavigate('student')}
                    >
                      Go to Student Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 3. STEPPER FOOTER BUTTONS */}
          {currentStep < 12 && (
            <div className="flex justify-between items-center pt-8 mt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors ${
                  currentStep === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:text-[#C79A2B]'
                }`}
              >
                <ChevronLeft size={16} />
                Previous Step
              </button>

              <div className="flex gap-2">
                {currentStep === 9 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      // Bypass review straight to cash instruction
                      setPaymentMethod('Cash');
                      setTermsAccepted(true);
                      setCurrentStep(10);
                    }}
                    className="text-xs text-gray-400 font-bold hover:text-[#2B2B2B]"
                  >
                    Bypass to Cash Settle
                  </Button>
                )}
                
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  rightIcon={currentStep === 11 ? undefined : <ChevronRight size={16} />}
                  className="font-bold uppercase tracking-wider text-xs px-5 py-2.5"
                >
                  {currentStep === 11 ? 'Submit Enrollment' : currentStep === 9 ? 'Proceed to Payment' : 'Next Step'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

