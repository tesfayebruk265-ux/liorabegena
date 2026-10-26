import { Course, Teacher, Product, Event, Testimonial, Language } from '../types';

export const TRANSLATIONS = {
  en: {
    brandName: 'LIORA BEGENA SCHOOL',
    tagline: 'Traditional Ethiopian Music School',
    location: 'Addis Ababa, Ethiopia',
    nav: {
      home: 'Home',
      about: 'About',
      aboutAbel: 'About Bruk',
      ourStory: 'Our Story',
      ourMission: 'Our Mission',
      ourVision: 'Our Vision',
      begenaHistory: 'Begena History',
      courses: 'Courses',
      teachers: 'Teachers',
      learning: 'Learning',
      howItWorks: 'How It Works',
      onlineLearning: 'Online Learning',
      physicalLearning: 'Physical Learning',
      practiceSystem: 'Practice System',
      certificates: 'Certificates',
      gallery: 'Gallery',
      events: 'Events',
      upcomingEvents: 'Upcoming Events',
      concerts: 'Concerts',
      workshops: 'Workshops',
      community: 'Community',
      store: 'Store',
      contact: 'Contact',
      donate: 'Donate',
      login: 'Login',
      register: 'Get started',
      search: 'Search...',
      designSystem: 'Design System Portal'
    },
    hero: {
      eyebrow: 'TRADITIONAL ETHIOPIAN BEGENA SCHOOL',
      headline: 'Learn the Sound of Ethiopian Heritage.',
      supporting: 'Discover the timeless beauty of Begena, Krar, Masinqo, Washint, Vocal, and Kebero through a learning experience built around tradition, discipline, and community.',
      primaryCTA: 'Get started',
      secondaryCTA: 'Explore Courses'
    },
    stats: {
      students: '100+ Active Learners',
      branches: 'Hawassa Main Branch',
      teachers: '15+ Master Instructors',
      programs: '6+ Traditional Instruments'
    },
    intro: {
      title: 'Keeping Ethiopian Traditional Begena Heritage Alive.',
      body1: 'Founded on centuries of acoustic artistry, the Liora Begena School is dedicated to the systematic protection, study, and elevation of Ethiopian sacred and secular Begena traditions.',
      body2: 'We provide structured pathways for beginners and advanced scholars alike, translating the ancient microtones, sacred notation, and deep techniques into clear educational models.',
      cta: 'Learn More Our Story'
    },
    founder: {
      title: 'ABOUT THE FOUNDER',
      name: 'Bruk Tesfaye',
      role: 'Founder of Liora Begena',
      bio: '“For Bruk, Begena is more than an instrument—it is a source of light, inspiration, and spiritual connection. Through Liora Begena, he is committed to preserving Ethiopia’s musical heritage and making traditional instrument education accessible to the next generation.”',
      cta: 'Meet Bruk'
    },
    instruments: {
      title: 'Find Your Instrument.',
      subtitle: 'Select from our traditional programs, each led by master practitioners.',
      viewAll: 'View All Courses'
    },
    journey: {
      badge: 'Traditional Curriculum Timeline',
      title: 'Featured Begena Learning Journey',
      subtitle: 'Explore our structured multi-semester timeline designed to take complete novices to advanced solo performers.',
      phase1Tag: 'Basic Phase 1',
      phase1Title: 'Introduction & Foundations',
      phase1Desc: 'Master proper sitting posture, learn the acoustic history of the Harp of David, set up finger placements, and align your basic tuning using ears and buzzed strings.',
      phase2Tag: 'Basic Phase 2',
      phase2Title: 'Mezmur & Hand Positions',
      phase2Desc: 'Introduce intermediate hand pluck mechanics, tune in traditional Qenet intervals, and perform initial spiritual accompaniment melodies with basic vocal alignment.',
      phase3Tag: 'Basic Phase 3',
      phase3Title: 'Advanced Ornamentations',
      phase3Desc: 'Explore advanced vibrato (buzz calibration), memorize traditional Ge\'ez notations, and deliver certified solo public performances before academic peers.',
      cta: 'EXPLORE BEGENA SYLLABUS DETAIL'
    },
    howItWorksSection: {
      title: 'How Your Journey Unfolds',
      subtitle: 'Five simple milestones to begin practicing traditional instruments with certified masters.',
      step1Title: 'Choose Your Course',
      step1Desc: 'Select from our traditional string, wind, or percussion programs.',
      step2Title: 'Create Your Account',
      step2Desc: 'Setup your safe student profile to access digital sheets and logs.',
      step3Title: 'Choose Your Learning Mode',
      step3Desc: 'Attend our Hawassa main branch at Center Point Tower or log in from abroad.',
      step4Title: 'Coordinate Schedule',
      step4Desc: 'Select morning, evening, or weekend cohorts that suit your lifestyle.',
      step5Title: 'Begin Your Journey',
      step5Desc: 'Uncover the sound of ancestors and graduate with standard certificates.'
    },
    onlineSection: {
      badge: 'Virtual Portal',
      title: 'Flexible Hybrid & Distance Education',
      desc: 'Study from anywhere in the diaspora with our high-definition weekly streaming classes, dedicated practice apps, and live teacher reviews.',
      f1: 'High-Definition Streaming Lessons',
      f2: 'Personalized Teacher Feedback',
      f3: 'Notation PDF Downloads',
      f4: 'Global Diaspora Alumni Network',
      cta: 'EXPLORE ONLINE CLASSES',
      demoTitle: 'Virtual Classroom Demo',
      demoDesc: 'Access streaming tutorials from any browser tab.'
    },
    teachersSection: {
      title: 'Meet Our Key Instructors',
      subtitle: 'Our faculty includes active research authors, classical recital vocalists, and liturgical deacons.',
      viewProfile: 'VIEW PROFILE',
      viewAll: 'MEET ALL FACULTY MEMBERS'
    },
    testimonialsSection: {
      title: 'Student Success Journeys',
      subtitle: 'Read verified reviews from local and international diaspora pupils studying under our deans.'
    },
    gallerySection: {
      title: 'Our Media Gallery',
      subtitle: 'Visual moments from inside our practice workshops, instrument setups, and local festivals.',
      viewAll: 'VIEW FULL MEDIA GALLERY'
    },
    storeSection: {
      badge: 'Handcrafted Sacred Instruments',
      title: 'Liora Begena Sacred Store',
      subtitle: 'Acquire certified traditional gut strings, sustainably harvested bamboo flutes, and hand-carved olive wood lyres.',
      status: 'Store Coming Soon',
      viewAll: 'Explore Store (Coming Soon)'
    },
    faqSection: {
      title: 'Frequently Asked Questions',
      subtitle: 'Common inquiries regarding admission timelines, payment methods, and virtual support classes.'
    },
    ctaSection: {
      badge: 'Traditional Musical Heritage Foundation',
      title: 'Your Master Class Journey Begins Here.',
      subtitle: 'Learn the sound of ancient saints. Master your traditional instruments. Connect with global pupils and preserve Ethiopian musical heritage.',
      primaryCTA: 'Get started',
      secondaryCTA: 'Explore Courses'
    },
    footer: {
      schoolName: 'LIORA BEGENA Traditional Music School',
      location: 'Addis Ababa, Ethiopia',
      desc: 'Keeping ancient Ethiopian musical legacy alive by combining centuries-old church/folk methodologies with modern accessible designs.',
      quickLinks: 'Quick Navigation Hub',
      fastAccess: 'Fast Access',
      copyright: '© 2026 Liora Begena Traditional Music School. All rights reserved.'
    },
    coursesPage: {
      title: 'Our Musical Curriculums',
      subtitle: 'Explore our structured multi-level instrument programs, certified by church liturgical and folk cultural experts.',
      searchLabel: 'Search Program',
      searchPlaceholder: 'Search Begena, Krar, Washint...',
      difficultyLabel: 'Difficulty Level',
      allDifficulties: 'All Difficulties',
      modeLabel: 'Learning Mode',
      allModes: 'All Modes',
      inPerson: 'In-Person Only',
      online: 'Online Learning',
      reset: 'Reset',
      viewSyllabus: 'VIEW SYLLABUS',
      comingSoon: 'COMING SOON',
      noMatch: 'No courses match your filter parameters.',
      noMatchSub: 'Try resetting the filters or modifying your search query to find related traditional instruments.'
    },
    courseDetail: {
      structuredSyllabus: 'Structured Syllabus',
      curriculumSoon: 'Curriculum In Development • Coming Soon',
      overviewTab: 'Outcomes & Rules',
      curriculumTab: 'Weekly Curriculum',
      pricingTab: 'Pricing Options',
      whatYouWillMaster: 'What You Will Master',
      requirements: 'Requirements for Admission',
      coreTopics: 'Core topics covered:',
      regFeeNote: 'Standard Registration Admission Fee (one-time):',
      admissionOpen: 'Syllabus Admission Open',
      admissionSoon: 'Curriculum Coming Soon',
      startJourney: 'Start Your Musical Journey',
      beFirstToKnow: 'Be First To Know',
      enrollButton: 'Enroll In Course Now',
      waitlistButton: 'Join Early Access Waitlist',
      begenaShortcut: 'Enroll In Begena Course',
      krarShortcut: 'Enroll In Krar Course',
      activeCoursesHeader: 'Available Active Courses',
      paymentNotice: 'Our enrollment wizard supports CBE Transfer, Telebirr Wallet, and Cash Payments at physical office branches.'
    },
    aboutAbelPage: {
      deanTag: 'Founder of Liora Begena',
      nameTitle: 'Bruk Tesfaye',
      heroSubtitle: 'Musician, teacher, and technology enthusiast committed to preserving Ethiopia’s musical heritage and sharing the sacred beauty of the Begena.',
      activeTag: 'Founder & Musician',
      liturgicalMaster: 'Teacher & Technology Enthusiast',
      journeyTitle: 'About the Founder',
      bioP1: 'Bruk Tesfaye is the founder of Liora Begena, established with a passion for Ethiopian spiritual music and a deep love for the traditional Begena. As a musician, teacher, and technology enthusiast, Bruk is committed to preserving Ethiopia’s musical heritage and making traditional instrument education accessible to the next generation.',
      bioP2: 'Through Liora Begena, he aims to create a welcoming learning environment where students can develop their musical skills, strengthen their connection to Ethiopian tradition, and discover the beauty of spiritual music.',
      messageHeader: 'Bruk’s Vision',
      messageQuote: '“For Bruk, Begena is more than an instrument—it is a source of light, inspiration, and spiritual connection.”',
      summaryTitle: 'Founder Profile Summary',
      cred1Title: 'Passion for Begena',
      cred1Desc: 'Deep love for traditional Begena and Ethiopian spiritual music.',
      cred2Title: 'Heritage Preservation',
      cred2Desc: 'Committed to preserving musical heritage and educating the next generation.',
      cred3Title: 'Welcoming Environment',
      cred3Desc: 'Inspiring students to discover the beauty and spiritual connection of traditional music.',
      studyButton: 'STUDY WITH BRUK'
    },
    aboutBegenaPage: {
      coverBadge: 'The Ancient Harp of David',
      coverTitle: 'Understanding the Begena',
      coverSubtitle: 'The Begena is one of the oldest continuously played string instruments on earth, carrying a rich legacy of spiritual prayer, biblical narrative, and profound meditation.',
      tabHistory: 'History & Significance',
      tabStructure: 'Instrument Structure',
      tabPlaying: 'How It Is Played',
      histTitle: 'Spiritual Roots and Centuries-Old Heritage',
      histP1: 'Historically linked to King David of biblical antiquity, the Begena has held a unique, non-entertainment status in Ethiopian culture. It was originally played in royal palaces and monasteries as a medium of prayer, spiritual contemplation, and repentance during fasts, such as the Holy Great Lent (Abiy Tsom).',
      histP2: 'Unlike secular folk lutes, the Begena\'s acoustic signature is calibrated to accompany quiet, deeply theological poetry. The lyrics are historically written in Ge\'ez or high Amharic, invoking stories of mortality, divine mercy, and spiritual philosophy.',
      milestonesTitle: 'Key Historical Milestones',
      m1Title: '1000 BC Era:',
      m1Desc: 'Biblical linkages to King David\'s temple musicians.',
      m2Title: 'Imperial Integration:',
      m2Desc: 'Used for solemn court meditations in Gondar and Lalibela.',
      m3Title: 'Modern Century:',
      m3Desc: 'Protected from extinction through the creation of structured school cohorts.',
      structTitle: 'Acoustics of the 10 Strings',
      structP1: 'The body of a Begena consists of a hollowed rectangular soundbox carved from aged olive, cedar, or walnut wood, covered with stretched ox or cattle hide. Two thick wooden arms rise upwards, connected by a crossbar.',
      structP2: 'Ten strings made of traditional hand-twisted sheep-gut stretch down to the bridge. Five of these strings are actively plucked by the musician\'s fingers, while the other five serve as sympathetic resonators or rhythmic finger rest nodes.',
      box1Title: 'Olive Soundbox',
      box1Desc: 'Highly resonant wooden frame wrapped in tanned cattle hide.',
      box2Title: 'Sheep-Gut Strings',
      box2Desc: 'High-tensile natural fibers providing deep low-frequency buzz.',
      box3Title: 'The Birz (Beeswax)',
      box3Desc: 'Leather or wax pads that create the trademark vibrating buzz.',
      box4Title: 'Wooden Pegs',
      box4Desc: 'Traditional friction pegs adjusted manually for pentatonic Qenets.',
      playStep1Title: 'The Posture',
      playStep1Desc: 'The player sits solemnly on a low stool. The heavy wooden soundbox rests securely on the thighs, angled slightly to the left.',
      playStep2Title: 'The Pluck',
      playStep2Desc: 'The left-hand fingers pluck the active strings (1, 4, 6, 8, 10) downwards. The index, middle, and thumb must synchronize with breathing.',
      playStep3Title: 'The Vocal Sync',
      playStep3Desc: 'Traditional begena playing is incomplete without vocals. The singer delivers solemn, rhythmic lines in between acoustic string echoes.',
      exploreCTA: 'EXPLORE COMPLETE BEGENA SYLLABUS'
    },
    common: {
      soon: 'Soon',
      comingSoon: 'Coming Soon',
      viewCourse: 'VIEW COURSE',
      allLevels: 'All Levels',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      months: 'Months',
      rating: 'Rating',
      difficulty: 'Difficulty',
      duration: 'Duration',
      close: 'Close',
      submit: 'Submit',
      email: 'Email',
      phone: 'Phone',
      fullName: 'Full Name'
    },
    galleryPage: {
      title: 'Our Media Gallery',
      subtitle: 'Browse the newly uploaded gallery set of 23 school images, curated directly from the media dashboard.',
      curatedBadge: '📸 Showing 23 curated images from the media dashboard',
      categories: {
        all: 'All',
        begena: 'Begena',
        krar: 'Krar',
        masenqo: 'Masenqo',
        washint: 'Washint',
        students: 'Students',
        events: 'Events',
        graduation: 'Graduation',
        teachers: 'Teachers'
      }
    },
    eventsPage: {
      title: 'Traditional Events & Recitals',
      subtitle: 'Attend our sacred liturgical gatherings, interactive acoustic symposia, and local neighborhood outdoor drumming circles.',
      upcomingTab: 'Upcoming (Live)',
      pastTab: 'Past Recitals',
      viewDetail: 'VIEW DETAIL',
      hostedBy: 'HOSTED BY / KEY PERFORMER',
      logistics: 'Event Logistics',
      timeSchedule: 'Time & Schedule',
      location: 'Location',
      rsvpTitle: 'RSVP Reservation',
      seatReserved: 'Seat Reserved!',
      reserveBtn: 'RESERVE SPOT NOW',
      pastClosed: '⛔ This is a past event. Registration is closed.'
    },
    contactPage: {
      title: 'Contact Our Offices',
      subtitle: 'Have questions about enrollment fees, traditional wood curation, or physical branch coordinates? Reach out to our teams.',
      leaveMessage: 'Leave a Message',
      yourName: 'Your Name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number (Optional)',
      subject: 'Subject',
      selectBranch: 'Select School Office',
      hawassa: 'Hawassa Campus (Center Point Tower, 1st Floor)',
      yourMessage: 'Your Message',
      messagePlaceholder: 'Describe your inquiry in detail...',
      dispatchBtn: 'DISPATCH ENQUIRY',
      sentTitle: 'Message Dispatched Successfully!',
      sentFollowup: 'We will get back to you via email or phone within 12 working hours.',
      sendAnother: 'Send another message',
      hubCoordinates: 'School Location & Coordinates'
    },
    donatePage: {
      badge: 'Cultural Preservation Fund',
      title: 'Support Traditional Music Preservation',
      subtitle: 'By donating, you directly sponsor gifted students who cannot afford tuition, fund the acquisition of raw highland bamboo for Washint, and support master craftsmen carving Begena and Krar frames from sustainably harvested olive wood.',
      selectAmount: 'Select Contribution Amount (ETB)',
      customAmount: 'Or enter custom amount (ETB)',
      donorDetails: 'Donor Details',
      fullName: 'Your Full Name (or write Anonymous)',
      paymentMethod: 'Preferred Bank Transfer Method',
      cbe: 'Commercial Bank of Ethiopia (CBE)',
      telebirr: 'Telebirr Mobile Wallet ready',
      confirmGift: 'CONFIRM GIFT OF',
      thankTitle: 'Egziabher Yistiln! (Thank You!)',
      thankDesc: 'A tax-deductible receipt has been reserved. You are helping keep the sacred vibrations of Ethiopia alive for generations to come.',
      returnBtn: 'Return to Fundraiser',
      transparencyTitle: 'Donor Transparency Index',
      transparencyDesc: '100% of public donations are audited directly. You can specify which cause you want to fund during registration:',
      causeScholarships: 'Scholarships: Helping talented, underprivileged kids learn free of cost.',
      causeCraft: 'Craft Preservation: Sponsoring wood purchases for traditional carvers.',
      causeDigital: 'Digital Access: Funding server hosts for remote villages to view tutorial streams.'
    },
    globalSearch: {
      placeholder: 'Search courses, teachers, events, products...',
      popularQueries: 'Popular Quick Queries',
      results: 'Results',
      noResults: 'No results match',
      tryChecking: 'Try checking your spelling.'
    },
    authModal: {
      loginTitle: 'LOG IN TO ECOSYSTEM',
      registerTitle: 'CREATE STUDENT PORTAL',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Security Password',
      agreeTerms: 'I agree to the Begena School respect directives.',
      loginBtn: 'ENTER ACCREDITED PORTAL',
      registerBtn: 'BEGIN YOUR PORTAL PROFILE',
      switchRegister: "Don't have a profile? Register now",
      switchLogin: 'Already registered? Log in',
      authSuccessTitle: 'Authentication Token Active',
      authSuccessDesc: 'You have successfully logged in / registered.',
      enterDashboard: 'ENTER DASHBOARD'
    }
  },
  am: {
    brandName: 'ሊዮራ በገና ትምህርት ቤት',
    tagline: 'የኢትዮጵያ ታላቅ የበገና ትምህርት ቤት',
    location: 'አዲስ አበባ ፣ ኢትዮጵያ',
    nav: {
      home: 'ዋና ገጽ',
      about: 'ስለ እኛ',
      aboutAbel: 'ስለ ብሩክ',
      ourStory: 'ታሪካችን',
      ourMission: 'ተልዕኮአችን',
      ourVision: 'ራዕያችን',
      begenaHistory: 'የበገና ታሪክ',
      courses: 'ትምህርቶች',
      teachers: 'አስተማሪዎች',
      learning: 'አማራጮች',
      howItWorks: 'እንዴት እንደሚሰራ',
      onlineLearning: 'በኦንላይን መማር',
      physicalLearning: 'በአካል መማር',
      practiceSystem: 'የልምምድ ሥርዓት',
      certificates: 'የምስክር ወረቀት',
      gallery: 'ፎቶዎቻችን',
      events: 'ክስተቶች',
      upcomingEvents: 'የሚመጡ ክስተቶች',
      concerts: 'ኮንሰርቶች',
      workshops: 'ወርክሾፖች',
      community: 'ማህበረሰብ',
      store: 'ሱቅ',
      contact: 'አድራሻ',
      donate: 'ይደግፉን',
      login: 'ግባ',
      register: 'መማር ይጀምሩ',
      search: 'ይፈልጉ...',
      designSystem: 'የዲዛይን ስርዓት'
    },
    hero: {
      eyebrow: 'የኢትዮጵያ ታላቅ የበገና ትምህርት ቤት',
      headline: 'የኢትዮጵያ የበገና ትውፊታዊ ዜማን ይማሩ።',
      supporting: 'ዘመን የማይሽረውን የበገና፣ የክራር፣ የማሲንቆ፣ የዋሽንት፣ የድምፅ እና የከበሮ ጥበቦችን በባህል፣ በዲሲፕሊን እና በማህበረሰባዊ እሴት በተገነባ የላቀ የትምህርት አሰጣጥ ይማሩ።',
      primaryCTA: 'መማር ይጀምሩ',
      secondaryCTA: 'ትምህርቶችን ይመልከቱ'
    },
    stats: {
      students: 'ከ 100+ በላይ ተማሪዎች',
      branches: 'ዋና ቅርንጫፍ በሐዋሳ',
      teachers: '15+ አንጋፋ አስተማሪዎች',
      programs: '6+ የዜማ መሳሪያዎች ስልጠና'
    },
    intro: {
      title: 'አባቶቻችን ያስረከቡንን የኢትዮጵያን የበገና ቅርስ ከ ትውልድ ወደ ትውልድ ማስተላለፍ።',
      body1: 'ለዘመናት በቆዩ የበገና ጥበቦች ላይ የተመሰረተው የሊዮራ በገና ትምህርት ቤት የኢትዮጵያን መንፈሳዊ የዜማ እሴቶችን በዘመናዊ የጥናት መንገድ ለማስተማር የተቋቋመ ነው።',
      body2: 'ለጀማሪዎችም ሆነ ለላቁ ተማሪዎች በጥንቃቄ የተዘጋጁ መማሪያ መንገዶችን በማቅረብ ጥንታዊ የዜማ ስልቶችን እና የ ቅዱስ ያሬድ የዜማ ምልክቶችን በቀላሉ ያስተምራል።',
      cta: 'ስለ እኛ ታሪክ የበለጠ ይረዱ'
    },
    founder: {
      title: 'ስለ መስራቹ',
      name: 'ብሩክ ተስፋዬ',
      role: 'የሊዮራ በገና መስራች',
      bio: '«ለብሩክ፣ በገና ከመሣሪያ በላይ ነው—የብርሃን፣ የተመስጦና የመንፈሳዊ ግንኙነት ምንጭ ነው። በሊዮራ በገና በኩል የኢትዮጵያን የሙዚቃ ቅርስ ለመጠበቅና የባህላዊ መሣሪያዎችን ትምህርት ለቀጣዩ ትውልድ ተደራሽ ለማድረግ በትጋት ይሰራል::»',
      cta: 'ስለ ብሩክ ይወቁ'
    },
    instruments: {
      title: 'የሚፈልጉትን መሣሪያ ይምረጡ።',
      subtitle: 'በአንጋፋ ባለሙያዎች ከሚመሩት ጥንታዊ የቤተክርስቲያናችን የዜማ እቃዎች መካከል ይምረጡ።',
      viewAll: 'ሁሉንም ትምህርቶች ይመልከቱ'
    },
    journey: {
      badge: 'የባህላዊ ሥርዓተ-ትምህርት ደረጃዎች',
      title: 'ልዩ የበገና የመማሪያ ጉዞ',
      subtitle: 'ሙሉ ጀማሪዎችን ወደ ላቀ የበገና ደርዳሪነት የሚያሸጋግር የተደራጀውን የትምህርት ደረጃዎቻችንን ይጎብኙ።',
      phase1Tag: 'ደረጃ 1',
      phase1Title: 'መሰረታዊ ትምህርትና አቀማመጥ',
      phase1Desc: 'ትክክለኛውን የአቀማመጥ ሥርዓት ይማሩ፤ የበገናን መንፈሳዊ ታሪክ ይረዱ፤ የጣት አቀማመጥንና የማስተካከያ (ድርድር) ዘዴን ይለማመዱ።',
      phase2Tag: 'ደረጃ 2',
      phase2Title: 'የመዝሙር ድርድርና የዜማ ስልቶች',
      phase2Desc: 'የቀኝና የግራ እጅ ቅንጅትን ያዳብሩ፤ በዋና ዋና የቅኝት ዓይነቶች (ትዝታና ባቲ) በገናን ይደርድሩ፤ ከመዝሙር ጋር ያቀናጁ።',
      phase3Tag: 'ደረጃ 3',
      phase3Title: 'የላቀ የብርዝ ማስተካከያና ምስክር ወረቀት',
      phase3Desc: 'የላቀውን የብርዝ ድምፅ ማስተካከያ ይማሩ፤ የቅዱስ ያሬድን የዜማ ምልክቶች ይለዩ፤ በታላቅ መድረክ የብቃት ዝግጅት አቅርበው ይመረቁ።',
      cta: 'የበገና ሥርዓተ-ትምህርቱን በዝርዝር ይመልከቱ'
    },
    howItWorksSection: {
      title: 'የመማር ጉዞዎ እንዴት ይከናወናል',
      subtitle: 'በአንጋፋ አስተማሪዎች የዜማ መሣሪያዎችን ለመማር አምስት ቀላል ደረጃዎች።',
      step1Title: 'ትምህርቱን ይምረጡ',
      step1Desc: 'ከበገና፣ ክራር፣ ማሲንቆ፣ ዋሽንት ወይም ከበሮ መርሃ ግብሮች ይምረጡ።',
      step2Title: 'መለያዎን ይፍጠሩ',
      step2Desc: 'የትምህርት ቁሳቁሶችን ለማግኘት የግል ተማሪ መለያዎን ያዘጋጁ።',
      step3Title: 'የመማሪያ መንገድ ይምረጡ',
      step3Desc: 'በሐዋሳ ዋና ቅርንጫፋችን በሴንተር ፖይንት ታወር በአካል ወይም በኢንተርኔት ይማሩ።',
      step4Title: 'ሰዓትዎን ያስተካክሉ',
      step4Desc: 'ከእርስዎ የዕለት ተዕለት ኑሮ ጋር የሚስማሙ የመማሪያ ሰዓቶችን ይምረጡ።',
      step5Title: 'ጉዞዎን ይጀምሩ',
      step5Desc: 'የአባቶችን ድምጽ ያግኙ እና ህጋዊ ምስክር ወረቀት ይቀበሉ።'
    },
    onlineSection: {
      badge: 'የኦንላይን መማሪያ መድረክ',
      title: 'በኢንተርኔትና በቅርንጫፍ የሚሰጥ ምቹ ትምህርት',
      desc: 'በየትኛውም የዓለም ክፍል ሆነው ጥራት ባላቸው የቪዲዮ ትምህርቶች፣ የልምምድ ደብተሮች እና በየሳምንቱ ከአስተማሪዎች ጋር በሚደረግ የቀጥታ ግንኙነት ይማሩ።',
      f1: 'ጥራት ያላቸው የቪዲዮ ትምህርቶች',
      f2: 'ከአስተማሪዎች የሚሰጥ ቀጥታ ክትትል',
      f3: 'የዜማ ኖታና የጽሁፍ ሰነዶች',
      f4: 'የዓለም አቀፍ ተማሪዎች ማህበረሰብ',
      cta: 'የኦንላይን ትምህርቶችን ይመልከቱ',
      demoTitle: 'የኦንላይን ክፍል ማሳያ',
      demoDesc: 'በስልክዎ ወይም በኮምፒውተርዎ በቀላሉ ትምህርቶችን ይከታተሉ።'
    },
    teachersSection: {
      title: 'ዋና ዋና አስተማሪዎቻችንን ያግኙ',
      subtitle: 'መምህራኖቻችን ጥንታዊውን የቤተክርስቲያን ዜማ ጠንቅቀው የሚያውቁ፣ ጥናት ያካሄዱ እና የተመሰከረላቸው ዲያቆናት ናቸው።',
      viewProfile: 'መገለጫ ይመልከቱ',
      viewAll: 'ሁሉንም መምህራን ይመልከቱ'
    },
    testimonialsSection: {
      title: 'የተማሪዎቻችን ምስክርነት',
      subtitle: 'በትምህርት ቤታችን ተምረው የዜማ ባለቤት የሆኑ የአገር ውስጥና የውጭ አገር ተማሪዎች አስተያየት።'
    },
    gallerySection: {
      title: 'የፎቶ ማህደር',
      subtitle: 'ከትምህርት ክፍሎቻችን፣ ከመሣሪያ ዝግጅትና ከመድረክ አቀራረቦች የተወሰዱ ምስሎች።',
      viewAll: 'ሁሉንም ፎቶዎች ይመልከቱ'
    },
    storeSection: {
      badge: 'በእጅ የተሰሩ የዜማ መሣሪያዎች',
      title: 'የሊዮራ መሣሪያዎች ሱቅ',
      subtitle: 'ጥራት ያላቸው የበገና አውታሮች፣ የቀርከሃ ዋሽንቶችና ከወይራ እንጨት የተሰሩ በገናዎችን ያግኙ።',
      status: 'በቅርቡ ይከፈታል',
      viewAll: 'ሱቁን ይመልከቱ (በቅርቡ)'
    },
    faqSection: {
      title: 'ተደጋግመው የሚጠየቁ ጥያቄዎች',
      subtitle: 'ስለ ምዝገባ፣ የትምህርት ክፍያና የኦንላይን አሰጣጥ በተደጋጋሚ የሚነሱ ጥያቄዎችና መልሶቻቸው።'
    },
    ctaSection: {
      badge: 'የባህላዊ የዜማ ቅርስ ተቋም',
      title: 'የመማር ጉዞዎ ዛሬ ይጀምራል።',
      subtitle: 'የአባቶችን ድምጽ ይማሩ፤ የዜማ መሣሪያዎችን ይደርድሩ፤ ባህላችንንና መንፈሳዊ ቅርሳችንን ለቀጣዩ ትውልድ በጋራ እናስተላልፍ።',
      primaryCTA: 'መማር ይጀምሩ',
      secondaryCTA: 'ትምህርቶችን ይመልከቱ'
    },
    footer: {
      schoolName: 'ሊዮራ ባህላዊ የበገና ትምህርት ቤት',
      location: 'አዲስ አበባ ፣ ኢትዮጵያ',
      desc: 'የጥንቱን የኢትዮጵያ የዜማ ቅርስ ከዘመናዊና ምቹ የማስተማሪያ ዘዴ ጋር በማዋሃድ ትውፊቱን በሕያውነት የማስቀጠል ተልዕኮ።',
      quickLinks: 'ፈጣን ማውጫ',
      fastAccess: 'ቀጥታ አገናኞች',
      copyright: '© 2026 ሊዮራ ባህላዊ የበገና ትምህርት ቤት። መብቱ በሕግ የተጠበቀ ነው።'
    },
    coursesPage: {
      title: 'የሙዚቃና የዜማ ሥርዓተ-ትምህርቶቻችን',
      subtitle: 'በቤተክርስቲያን ሊቃውንትና በባህል ተመራማሪዎች የተዘጋጁ ደረጃቸውን የጠበቁ የዜማ መሣሪያዎች ትምህርቶች።',
      searchLabel: 'ትምህርት ይፈልጉ',
      searchPlaceholder: 'በገና፣ ክራር፣ ዋሽንት...',
      difficultyLabel: 'የትምህርት ደረጃ',
      allDifficulties: 'ሁሉም ደረጃዎች',
      modeLabel: 'የመማሪያ መንገድ',
      allModes: 'ሁሉም መንገዶች',
      inPerson: 'በአካል ብቻ',
      online: 'በኦንላይን',
      reset: 'ዳግም ጀምር',
      viewSyllabus: 'ሥርዓተ-ትምህርቱን ይመልከቱ',
      comingSoon: 'በቅርቡ ይጠብቁን',
      noMatch: 'የመረጡትን መስፈርት የሚያሟላ ትምህርት አልተገኘም።',
      noMatchSub: 'እባክዎ ፍለጋዎን ይቀይሩ ወይም ዳግም በማስጀመር ሌሎች የዜማ መሳሪያዎችን ይመልከቱ።'
    },
    courseDetail: {
      structuredSyllabus: 'ደረጃውን የጠበቀ ሥርዓተ-ትምህርት',
      curriculumSoon: 'ዝግጅት ላይ ያለ • በቅርቡ ይጠብቁን',
      overviewTab: 'የትምህርቱ ግቦችና ደንቦች',
      curriculumTab: 'የሳምንታት ትምህርት ማውጫ',
      pricingTab: 'የክፍያ አማራጮች',
      whatYouWillMaster: 'የሚማሩት ዋና ዋና ክህሎቶች',
      requirements: 'ለመመዝገብ የሚያስፈልጉ ቅድመ-ሁኔታዎች',
      coreTopics: 'ዋና ዋና ርዕሶች፡',
      regFeeNote: 'የአንድ ጊዜ ምዝገባ ክፍያ፡',
      admissionOpen: 'ምዝገባ ተከፍቷል',
      admissionSoon: 'ትምህርቱ በቅርቡ ይጀምራል',
      startJourney: 'የመማር ጉዞዎን ይጀምሩ',
      beFirstToKnow: 'ቀዳሚ ሆነው ይመዝገቡ',
      enrollButton: 'አሁን ይመዝገቡ',
      waitlistButton: 'በቅድሚያ መጠባበቂያ ዝርዝር ውስጥ ይግቡ',
      begenaShortcut: 'በበገና ትምህርት ይመዝገቡ',
      krarShortcut: 'በክራር ትምህርት ይመዝገቡ',
      activeCoursesHeader: 'አሁን የሚሰጡ ንቁ ትምህርቶች',
      paymentNotice: 'ትምህርት ቤታችን በንግድ ባንክ (CBE)፣ በቴሌብር (Telebirr) እና በቅርንጫፎቻችን በጥሬ ገንዘብ ክፍያዎችን ይቀበላል።'
    },
    aboutAbelPage: {
      deanTag: 'የሊዮራ በገና መስራች',
      nameTitle: 'ብሩክ ተስፋዬ',
      heroSubtitle: 'የኢትዮጵያን የሙዚቃ ቅርስ ለመጠበቅና የበገናን መንፈሳዊ ውበት ለቀጣዩ ትውልድ ለማስተላለፍ የሚተጋ ሙዚቀኛ፣ መምህርና የቴክኖሎጂ አፍቃሪ።',
      activeTag: 'መስራችና ሙዚቀኛ',
      liturgicalMaster: 'መምህርና የቴክኖሎጂ አፍቃሪ',
      journeyTitle: 'ስለ መስራቹ',
      bioP1: 'ብሩክ ተስፋዬ ለኢትዮጵያ መንፈሳዊ ዜማ ባለው ፍቅርና ለባህላዊው በገና ባለው ጥልቅ ክብር ሊዮራ በገናን የመሰረተ ነው። እንደ ሙዚቀኛ፣ መምህርና የቴክኖሎጂ አፍቃሪ፣ የኢትዮጵያን የሙዚቃ ቅርስ ለመጠበቅና የባህላዊ መሣሪያዎችን ትምህርት ለቀጣዩ ትውልድ ተደራሽ ለማድረግ በትጋት ይሰራል::',
      bioP2: 'በሊዮራ በገና በኩል ተማሪዎች የሙዚቃ ክህሎታቸውን የሚያዳብሩበት፣ ከኢትዮጵያ ባህል ጋር ያላቸውን ትስስር የሚያጠናክሩበትና የመንፈሳዊ ዜማን ውበት የሚለማመዱበት ሞቅ ያለ የመማሪያ ከባቢ መፍጠርን ያለመ ነው።',
      messageHeader: 'የብሩክ ራዕይ',
      messageQuote: '«ለብሩክ፣ በገና ከመሣሪያ በላይ ነው—የብርሃን፣ የተመስጦና የመንፈሳዊ ግንኙነት ምንጭ ነው።»',
      summaryTitle: 'የመስራቹ ዋና ዋና መገለጫዎች',
      cred1Title: 'የሙዚቃ ፍቅርና ጥበብ',
      cred1Desc: 'የባህላዊው በገና አፍቃሪና የኢትዮጵያ መንፈሳዊ ዜማ መምህር።',
      cred2Title: 'ተልዕኮና ራዕይ',
      cred2Desc: 'የኢትዮጵያን የሙዚቃ ቅርስ መጠበቅና የባህላዊ መሣሪያዎችን ትምህርት ለቀጣዩ ትውልድ ተደራሽ ማድረግ።',
      cred3Title: 'ሞቅ ያለ የመማሪያ ከባቢ',
      cred3Desc: 'ጥንታዊውን ባህል ከዘመናዊ አቀራረብ ጋር በማቀናጀት ለሁሉም ተደራሽ ማድረግ።',
      studyButton: 'ከብሩክ ጋር ይማሩ'
    },
    aboutBegenaPage: {
      coverBadge: 'የዳዊት በገና',
      coverTitle: 'ስለ በገና ጥበብ ማወቅ',
      coverSubtitle: 'በገና በዓለማችን ላይ ካሉ እጅግ ጥንታዊ የዜማ መሣሪያዎች አንዱ ሲሆን የጸሎት፣ የመንፈሳዊ ታሪክና የታላቅ ተመስጦ መገለጫ ነው።',
      tabHistory: 'ታሪክና ፋይዳ',
      tabStructure: 'የበገናው አካላት',
      tabPlaying: 'አደራደርና አጨዋወት',
      histTitle: 'መንፈሳዊ መሰረትና የዘመናት ቅርስ',
      histP1: 'በገና በታሪክ ከንጉሥ ዳዊት ጋር የተሳሰረ ሲሆን በኢትዮጵያ ባህል ውስጥ የመዝናኛ ሳይሆን የመንፈሳዊ አምልኮና የጸሎት መሣሪያ ሆኖ ቆይቷል። በተለይም በዐቢይ ጾም ወቅት በቤተ-መንግሥትና በገዳማት ለጸሎት፣ ለንስሐና ለእግዚአብሔር ምስጋና ይደረደራል።',
      histP2: 'ከተራ የህዝብ መሣሪያዎች በተለየ የበገና ድምፅ የተረጋጋና ምስጢራዊ ዜማዎችን የሚያጅብ ነው። ቃላቶቹም በግዕዝ ወይም በጥልቅ አማርኛ የተጻፉ የሕይወትን ከንቱነት፣ የእግዚአብሔርን ምህረትና መንፈሳዊ ፍልስፍናን የሚያወሱ ናቸው።',
      milestonesTitle: 'ዋና ዋና የታሪክ ምዕራፎች',
      m1Title: 'ከ1000 ዓመተ-ዓለም በፊት፡',
      m1Desc: 'ከንጉሥ ዳዊትና ከመቅደሱ መዘምራን ጋር ያለው ትውፊታዊ ትስስር።',
      m2Title: 'በቤተ መንግሥት አገልግሎት፡',
      m2Desc: 'በጎንደርና በላሊበላ ነገሥታት ዘንድ ለጸሎትና ለተመስጦ ይደርደር ነበር።',
      m3Title: 'በአዲሱ ዘመን፡',
      m3Desc: 'ዘመናዊ የትምህርት ተቋም በማቋቋም ጥበቡ እንዳይጠፋ ተደርጓል።',
      structTitle: 'የአስሩ አውታሮች ምስጢር',
      structP1: 'የበገና አካል ከወይራ፣ ከዝግባ ወይም ከጥቁር እንጨት በተፈለፈለ ሳጥን ላይ የከብት ቆዳ ተወጥሮበት ይዘጋጃል። ሁለት ጠንካራ የእንጨት እግሮች ወደ ላይ ተነስተው በብርኩማ ይገናኛሉ።',
      structP2: 'አስር የበግ አንጀት አውታሮች ከብርኩማው ተነስተው ወደ ድልድዩ ይወርዳሉ። ከእነዚህ ውስጥ አምስቱ በጣቶች የሚደረደሩ ሲሆኑ፣ ቀሪዎቹ አምስቱ ደግሞ አስተጋቢ (አጃቢ) ሆነው ያገለግላሉ።',
      box1Title: 'የወይራ እንጨት ሳጥን',
      box1Desc: 'የተወጠረ ቆዳ የለበሰ ድምፅን በከፍተኛ ጥራት የሚያስተጋባ አካል።',
      box2Title: 'የበግ አንጀት አውታሮች',
      box2Desc: 'ጥልቅና ረጋ ያለ የብርዝ ድምፅ የሚያወጡ የተፈጥሮ ክሮች።',
      box3Title: 'ብርዝ (የቆዳ/ሰም መደገፊያ)',
      box3Desc: 'በገናው ልዩ የሚያደርገውን የሚርገበገብ ድምፅ የሚፈጥር አካል።',
      box4Title: 'የእንጨት ቁልፎች (እርኩማን)',
      box4Desc: 'አውታሮችን ለማጥበቅና በባህላዊ ቅኝቶች ለማስተካከል የሚያገለግሉ።',
      playStep1Title: 'አቀማመጥ',
      playStep1Desc: 'ተጫዋቹ በዝቅተኛ ወንበር ላይ በክብር ይቀመጣል፤ የበገናው ሳጥን ጭኖች ላይ አርፎ ወደ ግራ በኩል በጥቂቱ ዘንበል ይላል።',
      playStep2Title: 'አደራደር',
      playStep2Desc: 'የግራ እጅ ጣቶች አምስቱን ንቁ አውታሮች (1, 4, 6, 8, 10) ወደ ታች ይደርድራሉ፤ ይህም ከአተነፋፈስ ጋር መጣጣም አለበት።',
      playStep3Title: 'የድምፅ ቅንጅት',
      playStep3Desc: 'የበገና ድርድር ያለ ዝማሬ የተሟላ አይሆንም፤ ዘማሪው በአውታሮቹ ድምፅ መሃል የተረጋጋ መንፈሳዊ ስንኞችን ያቀርባል።',
      exploreCTA: 'የበገና ሥርዓተ-ትምህርቱን በዝርዝር ይመልከቱ'
    },
    common: {
      soon: 'በቅርቡ',
      comingSoon: 'በቅርቡ ይጠብቁን',
      viewCourse: 'ትምህርቱን ይመልከቱ',
      allLevels: 'ሁሉም ደረጃዎች',
      beginner: 'ጀማሪ',
      intermediate: 'መካከለኛ',
      advanced: 'ከፍተኛ',
      months: 'ወራት',
      rating: 'ደረጃ',
      difficulty: 'ደረጃ',
      duration: 'የጊዜ ርዝማኔ',
      close: 'ዝጋ',
      submit: 'አስገባ',
      email: 'ኢሜይል',
      phone: 'ስልክ',
      fullName: 'ሙሉ ስም'
    },
    galleryPage: {
      title: 'የፎቶ ማህደር',
      subtitle: 'ከትምህርት ክፍሎቻችን፣ ከመሣሪያ ዝግጅትና ከመድረክ አቀራረቦች የተመረጡ 23 ምስሎችን ይመልከቱ።',
      curatedBadge: '📸 ከተመረጡ የትምህርት ቤቱ ማህደሮች የተወሰዱ 23 ፎቶዎች',
      categories: {
        all: 'ሁሉም',
        begena: 'በገና',
        krar: 'ክራር',
        masenqo: 'ማሲንቆ',
        washint: 'ዋሽንት',
        students: 'ተማሪዎች',
        events: 'ክስተቶች',
        graduation: 'ምረቃ',
        teachers: 'አስተማሪዎች'
      }
    },
    eventsPage: {
      title: 'ባህላዊ የዜማ ሁነቶችና ኮንሰርቶች',
      subtitle: 'የተቀደሱ የዜማ ዝግጅቶቻችንን፣ ሲምፖዚየሞችንና የከበሮ ምት መርሃ-ግብሮቻችንን ይከታተሉ።',
      upcomingTab: 'የሚመጡ (ቀጥታ)',
      pastTab: 'ያለፉ ሁነቶች',
      viewDetail: 'ዝርዝሩን ይመልከቱ',
      hostedBy: 'አዘጋጅ / ዋና አቅራቢ',
      logistics: 'የዝግጅቱ ዝርዝር መረጃ',
      timeSchedule: 'ሰዓትና የጊዜ ሰሌዳ',
      location: 'ቦታ',
      rsvpTitle: 'የመቀመጫ ቦታ ማስያዣ',
      seatReserved: 'ቦታዎ ተይዟል!',
      reserveBtn: 'አሁን ቦታ ይያዙ',
      pastClosed: '⛔ ይህ ያለፈ ዝግጅት ነው፤ ምዝገባ ተዘግቷል።'
    },
    contactPage: {
      title: 'ቢሮዎቻችንን ያግኙ',
      subtitle: 'ስለ ምዝገባ ክፍያ፣ ስለ መሣሪያዎች አሰራር ወይም ቅርንጫፎቻችንን በሚመለከት ጥያቄ ካለዎት ያነጋግሩን።',
      leaveMessage: 'መልዕክት ይላኩ',
      yourName: 'ስምዎ',
      emailAddress: 'ኢሜይል አድራሻ',
      phoneNumber: 'ስልክ ቁጥር (አማራጭ)',
      subject: 'ርዕሰ ጉዳይ',
      selectBranch: 'የትምህርት ቤት ቢሮ ይምረጡ',
      hawassa: 'የሐዋሳ ካምፓስ (ሴንተር ፖይንት ታወር 1ኛ ፎቅ)',
      yourMessage: 'የእርስዎ መልዕክት',
      messagePlaceholder: 'መልዕክትዎን ወይም ጥያቄዎን በዝርዝር ይጻፉ...',
      dispatchBtn: 'መልዕክቱን ላክ',
      sentTitle: 'መልዕክትዎ በተሳካ ሁኔታ ተልኳል!',
      sentFollowup: 'በ12 የሥራ ሰዓታት ውስጥ በስልክ ወይም በኢሜይል ምላሽ እንሰጥዎታለን።',
      sendAnother: 'ሌላ መልዕክት ይላኩ',
      hubCoordinates: 'የትምህርት ቤታችን አድራሻ'
    },
    donatePage: {
      badge: 'የባህልና ቅርስ መጠበቂያ ፈንድ',
      title: 'የባህላዊ ዜማ ቅርሳችንን ይጠብቁና ይደግፉ',
      subtitle: 'በሚለግሱት ድጋፍ አቅም የሌላቸውን ጎበዝ ተማሪዎች ያስተምራሉ፣ ለዋሽንት የሚሆን ጥራት ያለው ቀርከሃ ይገዛሉ፣ እንዲሁም የበገናና ክራር እንጨት ጠራቢ ባለሙያዎችን ይደግፋሉ።',
      selectAmount: 'የመዋጮ መጠን ይምረጡ (በብር)',
      customAmount: 'ወይም የተለየ የገንዘብ መጠን ያስገቡ (በብር)',
      donorDetails: 'የለጋሽ መረጃ',
      fullName: 'ሙሉ ስምዎ (ወይም ማንነቱ ያልተገለጸ)',
      paymentMethod: 'የባንክ ወይም የክፍያ አማራጭ ይምረጡ',
      cbe: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
      telebirr: 'በቴሌብር (Telebirr)',
      confirmGift: 'የስጦታ ድጋፉን ያረጋግጡ፡',
      thankTitle: 'እግዚአብሔር ይስጥልን! እናመሰግናለን!',
      thankDesc: 'ደረጃውን የጠበቀ ደረሰኝ ተዘጋጅቷል። የተቀደሰውን የኢትዮጵያ ዜማ ለቀጣዩ ትውልድ ለማስተላለፍ ላደረጉት አስተዋጽኦ እጅግ እናመሰግናለን።',
      returnBtn: 'ወደ መዋጮው ገጽ ይመለሱ',
      transparencyTitle: 'የድጋፍ አጠቃቀም ግልጽነት',
      transparencyDesc: '100% የሚሆኑት የህዝብ ድጋፎች በቀጥታ ኦዲት ይደረጋሉ። ለየትኛው የድጋፍ መስክ እንደሚውል መምረጥ ይችላሉ፡',
      causeScholarships: 'ነጻ የትምህርት ዕድል፡ አቅም የሌላቸውን ታዳጊዎች በነጻ ማስተማር።',
      causeCraft: 'የመሣሪያዎች ስራ፡ ለባህላዊ የእንጨት ጠራቢዎች ጥሬ ዕቃ ማቅረብ።',
      causeDigital: 'የዲጂታል ተደራሽነት፡ በገጠርና በሩቅ ለሚገኙ ተማሪዎች የትምህርት ቪዲዮዎችን ማዳረስ።'
    },
    globalSearch: {
      placeholder: 'ትምህርቶችን፣ መምህራንን፣ ሁነቶችን ወይም ዕቃዎችን ይፈልጉ...',
      popularQueries: 'ተደጋግመው የሚፈለጉ ቃላት',
      results: 'የፍለጋ ውጤቶች',
      noResults: 'ከዚህ ጋር የሚዛመድ ውጤት አልተገኘም፡',
      tryChecking: 'እባክዎ ፊደላትን ያረጋግጡ።'
    },
    authModal: {
      loginTitle: 'ወደ ተማሪዎች ገጽ ይግቡ',
      registerTitle: 'አዲስ የተማሪ መለያ ይፍጠሩ',
      fullName: 'ሙሉ ስም',
      email: 'ኢሜይል አድራሻ',
      password: 'የይለፍ ቃል',
      agreeTerms: 'የትምህርት ቤቱን የዲሲፕሊንና የክብር ደንቦች አከብራለሁ።',
      loginBtn: 'ወደ መለያዎ ይግቡ',
      registerBtn: 'መለያዎን ይፍጠሩ',
      switchRegister: 'መለያ የለዎትም? አሁን ይመዝገቡ',
      switchLogin: 'ቀደም ሲል ተመዝግበዋል? ይግቡ',
      authSuccessTitle: 'መለያዎ በተሳካ ሁኔታ ተከፍቷል',
      authSuccessDesc: 'በተሳካ ሁኔታ ገብተዋል።',
      enterDashboard: 'ወደ ዳሽቦርድ ይግቡ'
    }
  }
};

/**
 * Global phrase & sentence dictionary for automatic full-page localization
 */
export const AMHARIC_DICTIONARY: Record<string, string> = {
  // Navigation & General
  'Home': 'ዋና ገጽ',
  'About': 'ስለ እኛ',
  'About Bruk': 'ስለ ብሩክ',
  'Our Story': 'ታሪካችን',
  'Our Mission': 'ተልዕኮአችን',
  'Our Vision': 'ራዕያችን',
  'Begena History': 'የበገና ታሪክ',
  'Courses': 'ትምህርቶች',
  'Teachers': 'አስተማሪዎች',
  'Learning': 'አማራጮች',
  'How It Works': 'እንዴት እንደሚሰራ',
  'Online Learning': 'በኦንላይን መማር',
  'Physical Learning': 'በአካል መማር',
  'Practice System': 'የልምምድ ሥርዓት',
  'Certificates': 'የምስክር ወረቀት',
  'Gallery': 'ፎቶዎቻችን',
  'Events': 'ክስተቶች',
  'Upcoming Events': 'የሚመጡ ክስተቶች',
  'Concerts': 'ኮንሰርቶች',
  'Workshops': 'ወርክሾፖች',
  'Community': 'ማህበረሰብ',
  'Store': 'ሱቅ',
  'Contact': 'አድራሻ',
  'Donate': 'ይደግፉን',
  'Login': 'ግባ',
  'Get started': 'መማር ይጀምሩ',
  'Start Learning': 'መማር ይጀምሩ',
  'Search...': 'ይፈልጉ...',
  'Search': 'ይፈልጉ',
  'Reset': 'ዳግም ጀምር',

  // Buttons & Actions
  'VIEW COURSE': 'ትምህርቱን ይመልከቱ',
  'View Course': 'ትምህርቱን ይመልከቱ',
  'VIEW SYLLABUS': 'ሥርዓተ-ትምህርቱን ይመልከቱ',
  'View Syllabus': 'ሥርዓተ-ትምህርቱን ይመልከቱ',
  'COMING SOON': 'በቅርቡ ይጠብቁን',
  'Coming Soon': 'በቅርቡ ይጠብቁን',
  'Soon': 'በቅርቡ',
  'Enroll In Course Now': 'አሁን ይመዝገቡ',
  'Enroll in Course': 'ይመዝገቡ',
  'Join Early Access Waitlist': 'በቅድሚያ መጠባበቂያ ዝርዝር ውስጥ ይግቡ',
  'Enroll In Begena Course': 'በበገና ትምህርት ይመዝገቡ',
  'Enroll In Krar Course': 'በክራር ትምህርት ይመዝገቡ',
  'Enroll in Begena Instead': 'በበገና ትምህርት ይመዝገቡ',
  'Ask a Question': 'ጥያቄ ይጠይቁ',
  'Book Free Trial Session': 'የነጻ ሙከራ ቀጠሮ ይያዙ',
  'VIEW PROFILE': 'መገለጫ ይመልከቱ',
  'MEET ALL FACULTY MEMBERS': 'ሁሉንም መምህራን ይመልከቱ',
  'VIEW FULL media GALLERY': 'ሁሉንም ፎቶዎች ይመልከቱ',
  'VIEW FULL MEDIA GALLERY': 'ሁሉንም ፎቶዎች ይመልከቱ',
  'VIEW FULL INVENTORY (PREVIEW)': 'ሁሉንም ዕቃዎች ይመልከቱ',
  'Close Settings': 'ቅንብሮችን ዝጋ',
  'Cancel': 'ሰርዝ',
  'Save': 'አስቀምጥ',
  'Submit': 'አስገባ',

  // Statuses & Levels
  'All Levels': 'ሁሉም ደረጃዎች',
  'Beginner': 'ጀማሪ',
  'Intermediate': 'መካከለኛ',
  'Advanced': 'ከፍተኛ',
  'All Difficulties': 'ሁሉም ደረጃዎች',
  'All Modes': 'ሁሉም መንገዶች',
  'In-Person': 'በአካል',
  'In-Person Only': 'በአካል ብቻ',
  'Online': 'በኦንላይን',
  'Hybrid': 'ቅይጥ (በአካልና ኦንላይን)',
  'In-Person & Online': 'በአካልና በኦንላይን',

  // Common Headings
  'Our Musical Curriculums': 'የሙዚቃና የዜማ ሥርዓተ-ትምህርቶቻችን',
  'Our Master Instructors': 'የተከበሩ መምህራኖቻችን',
  'Meet Our Key Instructors': 'ዋና ዋና አስተማሪዎቻችንን ያግኙ',
  'Student Success Journeys': 'የተማሪዎቻችን ምስክርነት',
  'Our Media Gallery': 'የፎቶ ማህደር',
  'Bruk Signature Store Preview': 'የሊዮራ መሣሪያዎች ሱቅ',
  'Frequently Asked Questions': 'ተደጋግመው የሚጠየቁ ጥያቄዎች',
  'Your Master Class Journey Begins Here.': 'የመማር ጉዞዎ ዛሬ ይጀምራል።',
  'Traditional Curriculum Timeline': 'የባህላዊ ሥርዓተ-ትምህርት ደረጃዎች',
  'Featured Begena Learning Journey': 'ልዩ የበገና የመማሪያ ጉዞ',
  'How Your Journey Unfolds': 'የመማር ጉዞዎ እንዴት ይከናወናል',
  'Structured Syllabus': 'ደረጃውን የጠበቀ ሥርዓተ-ትምህርት',
  'Syllabus Admission Open': 'ምዝገባ ተከፍቷል',
  'Curriculum Coming Soon': 'ትምህርቱ በቅርቡ ይጀምራል',
  'Start Your Musical Journey': 'የመማር ጉዞዎን ይጀምሩ',
  'Be First To Know': 'ቀዳሚ ሆነው ይመዝገቡ',
  'What You Will Master': 'የሚማሩት ዋና ዋና ክህሎቶች',
  'Requirements for Admission': 'ለመመዝገብ የሚያስፈልጉ ቅድመ-ሁኔታዎች',
  'Weekly Curriculum': 'የሳምንታት ትምህርት ማውጫ',
  'Pricing Options': 'የክፍያ አማራጮች',
  'Outcomes & Rules': 'የትምህርቱ ግቦችና ደንቦች',

  // Pricing & Periods
  'total course fee': 'አጠቃላይ የትምህርት ክፍያ',
  'total': 'አጠቃላይ',
  'per month': 'በወር',
  'Standard Reg Fee (One-Time):': 'የአንድ ጊዜ ምዝገባ ክፍያ፡',
  'Standard Registration Admission Fee (one-time):': 'የአንድ ጊዜ ምዝገባ ክፍያ፡',
  'Class Duration Options:': 'የትምህርት ቆይታ አማራጮች፡',
  'Learning Formats:': 'የመማሪያ መንገዶች፡',
  '3 to 6 Months': 'ከ3 እስከ 6 ወራት',
  '3, 4 and 6 Months': '3፣ 4 እና 6 ወራት',
  '3 Months': '3 ወራት',
  '4 Months': '4 ወራት',
  '6 Months': '6 ወራት',

  // Categories & Filters
  'All': 'ሁሉም',
  'Begena': 'በገና',
  'Krar': 'ክራር',
  'Masenqo': 'ማሲንቆ',
  'Washint': 'ዋሽንት',
  'Students': 'ተማሪዎች',
  'Graduation': 'ምረቃ',

  // Events & Details
  'Traditional Events & Recitals': 'ባህላዊ የዜማ ሁነቶችና ኮንሰርቶች',
  'Upcoming (Live)': 'የሚመጡ (ቀጥታ)',
  'Past Recitals': 'ያለፉ ሁነቶች',
  'VIEW DETAIL': 'ዝርዝሩን ይመልከቱ',
  'View Detail': 'ዝርዝሩን ይመልከቱ',
  'Event Logistics': 'የዝግጅቱ ዝርዝር መረጃ',
  'Time & Schedule': 'ሰዓትና የጊዜ ሰሌዳ',
  'Location': 'ቦታ',
  'RSVP Reservation': 'የመቀመጫ ቦታ ማስያዣ',
  'Seat Reserved!': 'ቦታዎ ተይዟል!',
  'RESERVE SPOT NOW': 'አሁን ቦታ ይያዙ',
  'HOSTED BY / KEY PERFORMER': 'አዘጋጅ / ዋና አቅራቢ',

  // Contact
  'Contact Our Offices': 'ቢሮዎቻችንን ያግኙ',
  'Contact Us': 'ያግኙን',
  'Leave a Message': 'መልዕክት ይላኩ',
  'Your Name': 'ስምዎ',
  'Email Address': 'ኢሜይል አድራሻ',
  'Phone Number (Optional)': 'ስልክ ቁጥር (አማራጭ)',
  'Subject': 'ርዕሰ ጉዳይ',
  'Select Branch Desk': 'የትምህርት ቤት ቢሮ ይምረጡ',
  'Select School Office': 'የትምህርት ቤት ቢሮ ይምረጡ',
  'Your Message': 'የእርስዎ መልዕክት',
  'DISPATCH ENQUIRY': 'መልዕክቱን ላክ',
  'Hawassa Campus': 'የሐዋሳ ካምፓስ',
  'Center Point Tower, first floor, Hawassa, Ethiopia': 'ሴንተር ፖይንት ታወር፣ 1ኛ ፎቅ፣ ሐዋሳ፣ ኢትዮጵያ',
  'Center Point Tower Campus, Hawassa': 'ሴንተር ፖይንት ታወር ካምፓስ፣ ሐዋሳ',
  'School Location & Coordinates': 'የትምህርት ቤታችን አድራሻ',
  'Physical Hub Coordinates': 'የትምህርት ቤታችን አድራሻ',
  'Begena Level 1': 'በገና ደረጃ 1',
  'Begena Level 2': 'በገና ደረጃ 2',
  'Begena Level 3': 'በገና ደረጃ 3',
  'Package 1 (3 Months)': 'ጥቅል 1 (3 ወር)',
  'Package 2 (4 Months)': 'ጥቅል 2 (4 ወር)',
  'Package 3 (6 Months)': 'ጥቅል 3 (6 ወር)',

  // Donate
  'Support Traditional Music Preservation': 'የባህላዊ ዜማ ቅርሳችንን ይጠብቁና ይደግፉ',
  'Cultural Preservation Fund': 'የባህልና ቅርስ መጠበቂያ ፈንድ',
  'Donor Details': 'የለጋሽ መረጃ',
  'Preferred Bank Transfer Method': 'የባንክ ወይም የክፍያ አማራጭ ይምረጡ',
  'Commercial Bank of Ethiopia (CBE)': 'የኢትዮጵያ ንግድ ባንክ (CBE)',
  'Telebirr Mobile Wallet ready': 'በቴሌብር (Telebirr)',
  'Egziabher Yistiln! (Thank You!)': 'እግዚአብሔር ይስጥልን! እናመሰግናለን!',
  'Donor Transparency Index': 'የድጋፍ አጠቃቀም ግልጽነት',
  'Return to Fundraiser': 'ወደ መዋጮው ገጽ ይመለሱ',
  'Select Contribution Amount (ETB)': 'የመዋጮ መጠን ይምረጡ (በብር)',
  'Or enter custom amount (ETB)': 'ወይም የተለየ የገንዘብ መጠን ያስገቡ (በብር)',

  // Search & Auth
  'Popular Quick Queries': 'ተደጋግመው የሚፈለጉ ቃላት',
  'Search courses, teachers, events, products...': 'ትምህርቶችን፣ መምህራንን፣ ሁነቶችን ወይም ዕቃዎችን ይፈልጉ...',
  'LOG IN TO ECOSYSTEM': 'ወደ ተማሪዎች ገጽ ይግቡ',
  'CREATE STUDENT PORTAL': 'አዲስ የተማሪ መለያ ይፍጠሩ',
  'Full Name': 'ሙሉ ስም',
  'Security Password': 'የይለፍ ቃል',
  'I agree to the Begena School respect directives.': 'የትምህርት ቤቱን የዲሲፕሊንና የክብር ደንቦች አከብራለሁ።',
  'ENTER ACCREDITED PORTAL': 'ወደ መለያዎ ይግቡ',
  'BEGIN YOUR PORTAL PROFILE': 'መለያዎን ይፍጠሩ',
  "Don't have a profile? Register now": 'መለያ የለዎትም? አሁን ይመዝገቡ',
  'Already registered? Log in': 'ቀደም ሲል ተመዝግበዋል? ይግቡ',
  'Authentication Token Active': 'መለያዎ በተሳካ ሁኔታ ተከፍቷል',
  'ENTER DASHBOARD': 'ወደ ዳሽቦርድ ይግቡ',

  // Header & Footer
  'Quick Navigation Hub': 'ፈጣን ማውጫ',
  'Fast Access': 'ቀጥታ አገናኞች',
  'Home Portal': 'ዋና ገጽ',
  'Instrument Courses': 'የትምህርት ዓይነቶች',
  'Faculty Profiles': 'የመምህራን መገለጫ',
  'Certificates & Lookup': 'የምስክር ወረቀቶች',
  'Help & Support': 'እርዳታና ድጋፍ',
  'View All Courses': 'ሁሉንም ትምህርቶች ይመልከቱ',
  'Online Learning Mode': 'በኦንላይን መማር',
  'Physical Branches': 'የአካል ቅርንጫፎች',
  'Media': 'የፎቶ ማህደር',
  'Media Gallery': 'የፎቶ ማህደር',
  'Nagen': 'የናጌን ኮንሰርት',
  'Youth Begena Competitions': 'የወጣቶች በገና ውድድር',
  'Graduation Ceremony': 'የምረቃ ስነ-ስርዓት',
  'Alumni & Mentorship': 'የምሩቃን ህብረት',
  'Traditional Ethiopian Begena': 'የኢትዮጵያ ባህላዊ በገና',
  'LIORA BEGENA Traditional Music School': 'ሊዮራ ባህላዊ የበገና ትምህርት ቤት',
  'School overview & main entry': 'የትምህርት ቤቱ መግቢያና አጠቃላይ እይታ',
  'Begena, Krar, Masenqo & Zema': 'በገና፣ ክራር፣ ማሲንቆና የዜማ ስልጠና',
  'Master instructors & Zemari': 'አንጋፋ መምህራንና ዘማሪዎች',
  'Digital QR credentials': 'ዲጂታል የትምህርት ምስክር ወረቀቶች',
  'Admissions, fees & contact': 'ምዝገባ፣ ክፍያና አድራሻዎቻችን'
};

/**
 * Translate helper that looks up in structured TRANSLATIONS or the text dictionary
 */
export function tr(text: string, lang: Language): string {
  if (lang !== 'am' || !text) return text;
  const trimmed = text.trim();
  if (AMHARIC_DICTIONARY[trimmed]) {
    return AMHARIC_DICTIONARY[trimmed];
  }
  return text;
}

/**
 * Returns localized course data depending on selected language
 */
export function getLocalizedCourse(course: Course, lang: Language): Course {
  if (lang !== 'am') return course;

  const amharicNames: Record<string, { name: string; shortDesc: string; desc: string; outcomes: string[]; reqs: string[] }> = {
    begena: {
      name: 'በገና (የዳዊት በገና)',
      shortDesc: 'የኢትዮጵያ መንፈሳዊ የጸሎትና የተመስጦ አስር አውታር የዜማ መሣሪያ።',
      desc: 'የዳዊት በገና ተብሎ የሚታወቀውንና ለዘመናት በኢትዮጵያ ቤተክርስቲያን መንፈሳዊ የጸሎትና የዝማሬ መሣሪያ ሆኖ ያገለገለውን በገና ከአመታቱ፣ ከቅኝቱ፣ ከጣት አቀማመጡና ከዜማ ስልቱ ጋር በጥልቀት ይማሩ።',
      outcomes: [
        'በገናን በተለያዩ ቅኝቶች በራስ ችሎታ ማስተካከል',
        'የባህላዊ የጣት ድርድር ስልቶችን ጠንቅቆ ማወቅ',
        'የቤተክርስቲያን የዜማ ስልቶችንና ምቶችን መረዳት',
        'ከ12 በላይ ጥንታዊ መንፈሳዊ መዝሙራትን መደርደር'
      ],
      reqs: [
        'የ10 አውታር የኢትዮጵያ በገና ማዘጋጀት (በትምህርት ቤታችን ሱቅ ይገኛል)',
        'የቀደመ የሙዚቃ ልምድ አይጠይቅም',
        'ለትዕግስትና ለረጋ ልምምድ ፍላጎት መኖር'
      ]
    },
    krar: {
      name: 'ክራር (ባህላዊ ክራር)',
      shortDesc: 'ተወዳጁ የ6 አውታር የኢትዮጵያ ባህላዊና ዘመናዊ የዜማ መሣሪያ።',
      desc: 'በኢትዮጵያ ባህላዊ ዜማና ማህበራዊ በዓላት ውስጥ ግንባር ቀደም የሆነውን አምስትና ስድስት አውታር ክራር በጣት አደራደርና በመምቻ (ጎርት) ስልቶች ጠንቅቀው ይማሩ። ዋና ዋና የቅኝት ዓይነቶችን (ትዝታ፣ ባቲ፣ አምባሰልና አንቺሆዬ) ይለማመዳሉ።',
      outcomes: [
        'የጣትና የመምቻ (መክትት) የአደራደር ዘዴዎችን ማወቅ',
        'በአራቱም ዋና ዋና የኢትዮጵያ ቅኝቶች ክራርን ማስተካከል',
        'የባህላዊ ውዝዋዜዎችንና ግጥሞችን ማጀብ',
        'የኤሌክትሪክ ክራር አሰራርና ቅንጅትን መረዳት'
      ],
      reqs: [
        'ባለ 6 አውታር አኮስቲክ ወይም ኤሌክትሪክ ክራር',
        'ለፈጣን ምትና ልምምድ ዝግጁ መሆን'
      ]
    },
    masenqo: {
      name: 'ማሲንቆ (ባለአንድ አውታር ጭረት)',
      shortDesc: 'የፈረስ ጭራና የቆዳ ድምፅ ማጉያ ያለው የአዝማሪዎች ጥንታዊ መሣሪያ።',
      desc: 'በአንድ አውታርና በፈረስ ጭራ መጎተቻ የሚጫወተውን ጥንታዊውን የኢትዮጵያ ማሲንቆ ይማሩ። ጥልቅ የድምፅ ግንዛቤንና የእጅ ቅንጅትን ይጠይቃል።',
      outcomes: ['ትክክለኛ የመጎተቻ ስልት', 'የቅኝቶች አያያዝ', 'ባህላዊ ግጥሞችን ማጀብ'],
      reqs: ['ባህላዊ ማሲንቆ ማዘጋጀት', 'ለጥልቅ ድምፅ ልምምድ ትዕግስት መኖር']
    },
    washint: {
      name: 'ዋሽንት (የቀርከሃ ዋሽንት)',
      shortDesc: 'ልብ የሚነካ ረቂቅ ድምፅ ያለው ባህላዊ የቀርከሃ ዋሽንት።',
      desc: 'ከቀርከሃ የሚሰራውንና በአየር ንፋስ የሚጫወተውን ባህላዊ ዋሽንት ይማሩ። የተለያዩ የጣት ቀዳዳዎችን አያያዝና የትንፋሽ ቁጥጥርን ይለማመዳሉ።',
      outcomes: ['ትክክለኛ የትንፋሽ ቁጥጥር', 'የቀዳዳዎች አጠቃቀም', 'የመንፈሳዊና ባህላዊ ዜማዎች ቅኝት'],
      reqs: ['ባለ 4 ወይም ባለ 6 ቀዳዳ የቀርከሃ ዋሽንት']
    },
    vocal: {
      name: 'የያሬዳዊና ባህላዊ ዜማ ስልጠና',
      shortDesc: 'የቅዱስ ያሬድን የዜማ ስልቶችና ጥንታዊ የድምፅ አወጣጥ ጥበብ።',
      desc: 'የጥንቱን የኢትዮጵያ የቤተክርስቲያን ዜማ (ግዕዝ፣ ዕዝልና አራራይ) እንዲሁም ባህላዊ የድምፅ አወጣጥ ስልቶችን ከአንጋፋ መምህራን ጋር ይማሩ።',
      outcomes: ['የድምፅ ጥራትና ጥንካሬ', 'የያሬድ ዜማ ስልቶች', 'የበገናና የክራር ዝማሬዎችን ማጀብ'],
      reqs: ['የመዘመር ፍላጎትና ቁርጠኝነት']
    },
    kebero: {
      name: 'ከበሮ (ባህላዊና ያሬዳዊ ከበሮ)',
      shortDesc: 'የቤተክርስቲያን ሥርዓተ-ማኅሌትና የባህል በዓላት ምት መምሪያ።',
      desc: 'የተቀደሰውን የቤተክርስቲያን ከበሮ ምት፣ አመታትና የዝማሬ ቅንጅት ከአንጋፋ መምህራን ጋር ይለማመዱ።',
      outcomes: ['ትክክለኛ የአመታት ስልት', 'የማኅሌት ምቶችን መምራት', 'የእጅና የክንድ ቅንጅት'],
      reqs: ['ባህላዊ ከበሮ']
    }
  };

  const override = amharicNames[course.id];
  if (!override) return course;

  return {
    ...course,
    name: override.name,
    shortDescription: override.shortDesc,
    description: override.desc,
    learningOutcomes: override.outcomes,
    requirements: override.reqs,
    difficulty: course.difficulty,
    duration: course.duration
  };
}

/**
 * Returns localized teacher data depending on selected language
 */
export function getLocalizedTeacher(teacher: Teacher, lang: Language): Teacher {
  if (lang !== 'am') return teacher;

  const amharicTeachers: Record<string, { specialization: string; bio: string }> = {
    'abel': {
      specialization: 'የሊዮራ በገና መስራች፣ መምህርና ሙዚቀኛ',
      bio: 'ብሩክ ተስፋዬ ለኢትዮጵያ መንፈሳዊ ዜማ ባለው ፍቅርና ለባህላዊው በገና ባለው ጥልቅ ክብር ሊዮራ በገናን የመሰረተ ነው። እንደ ሙዚቀኛ፣ መምህርና የቴክኖሎጂ አፍቃሪ፣ የኢትዮጵያን የሙዚቃ ቅርስ ለመጠበቅና የባህላዊ መሣሪያዎችን ትምህርት ለቀጣዩ ትውልድ ተደራሽ ለማድረግ በትጋት ይሰራል:: በሊዮራ በገና በኩል ተማሪዎች የሙዚቃ ክህሎታቸውን የሚያዳብሩበት፣ ከኢትዮጵያ ባህል ጋር ያላቸውን ትስስር የሚያጠናክሩበትና የመንፈሳዊ ዜማን ውበት የሚለማመዱበት ሞቅ ያለ የመማሪያ ከባቢ መፍጠርን ያለመ ነው። ለብሩክ፣ በገና ከመሣሪያ በላይ ነው—የብርሃን፣ የተመስጦና የመንፈሳዊ ግንኙነት ምንጭ ነው።'
    },
    'bruk': {
      specialization: 'የሊዮራ በገና መስራች፣ መምህርና ሙዚቀኛ',
      bio: 'ብሩክ ተስፋዬ ለኢትዮጵያ መንፈሳዊ ዜማ ባለው ፍቅርና ለባህላዊው በገና ባለው ጥልቅ ክብር ሊዮራ በገናን የመሰረተ ነው። እንደ ሙዚቀኛ፣ መምህርና የቴክኖሎጂ አፍቃሪ፣ የኢትዮጵያን የሙዚቃ ቅርስ ለመጠበቅና የባህላዊ መሣሪያዎችን ትምህርት ለቀጣዩ ትውልድ ተደራሽ ለማድረግ በትጋት ይሰራል:: በሊዮራ በገና በኩል ተማሪዎች የሙዚቃ ክህሎታቸውን የሚያዳብሩበት፣ ከኢትዮጵያ ባህል ጋር ያላቸውን ትስስር የሚያጠናክሩበትና የመንፈሳዊ ዜማን ውበት የሚለማመዱበት ሞቅ ያለ የመማሪያ ከባቢ መፍጠርን ያለመ ነው። ለብሩክ፣ በገና ከመሣሪያ በላይ ነው—የብርሃን፣ የተመስጦና የመንፈሳዊ ግንኙነት ምንጭ ነው።'
    },
    '1': {
      specialization: 'የበገና ሊቅ፣ የቅዱስ ያሬድ ዜማ ተመራማሪ',
      bio: 'ከ15 ዓመታት በላይ በኢትዮጵያ ቤተክርስቲያን ያገለገሉ፣ በገናን በማስተማርና በመደርደር በርካታ ደቀ-መዛሙርትን ያፈሩ አንጋፋ መምህር።'
    },
    '2': {
      specialization: 'የክራር መምህርና የባህል አቀናባሪ',
      bio: 'በአኮስቲክና ኤሌክትሪክ ክራር አጨዋወት የታወቁ፣ ባህላዊውን ዜማ ለዘመናዊ ትውልድ ተደራሽ ያደረጉ ባለሙያ።'
    },
    '3': {
      specialization: 'የዋሽንትና ማሲንቆ መምህር',
      bio: 'ባህላዊ የቀርከሃ ዋሽንትና የማሲንቆ ዜማዎችን በማስተማር የረጅም ዓመታት ልምድ ያላቸው አዋቂ።'
    }
  };

  const override = amharicTeachers[teacher.id];
  if (!override) return teacher;

  return {
    ...teacher,
    specialization: override.specialization,
    bio: override.bio
  };
}
