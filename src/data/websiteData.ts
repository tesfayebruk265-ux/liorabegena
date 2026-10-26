import { Course, Teacher, Event, Product, Article, Testimonial, Branch, GalleryItem } from '../types';
import abelBegenaPhoto from '../assets/images/Abel.jpg';
import begenaImg from '../assets/images/begena.png';
import begenaCourseImg from '../assets/images/begena.png';
import krarImg from '../assets/images/krar.png';
import krarCourseImg from '../assets/images/krar.png';
import washintImg from '../assets/images/washint.png';
import washintCourseImg from '../assets/images/washint.png';
import keberoImg from '../assets/images/kebero-1.jpg';
import masinqoImg from '../assets/images/masinqo.png';
import masinqoCourseImg from '../assets/images/masinqo.png';
import vocalImg from '../assets/images/vocal.png';
import vocalCourseImg from '../assets/images/vocal.png';
import brukImg from '../assets/images/bruk.jpg';
import newBegenaPhoto from '../assets/images/New_begena.jpg';
import begenatogetherPhoto from '../assets/images/begenatogether.jpg';
import keberoPlayingImg from '../assets/images/kebero_playing.jpg';
import begenaPlayingImg from '../assets/images/begena_playing.jpg';
const img10 = new URL('../assets/images/(10).jpg', import.meta.url).href;
const img15 = new URL('../assets/images/(15).jpg', import.meta.url).href;
const img22 = new URL('../assets/images/(22).jpg', import.meta.url).href;
const img8 = new URL('../assets/images/(8).jpg', import.meta.url).href;

export const ABEL_BEGENA_PHOTO = abelBegenaPhoto;

export const SOCIAL_MEDIA_LINKS = {
  instagram: 'https://www.instagram.com/liyora_begena?xtok=MWxxbTJ5eWJ1MTBpeA==',
  telegram: 'https://t.me/liyora_begena',
  tiktok: 'https://www.tiktok.com/@liora_begena?is_from_webapp=1&sender_device=pc',
  youtube: ''
};

// Dynamic Image Glob for IMG1..IMG40
const imageModules = import.meta.glob<{ default: string }>(
  '/src/assets/images/*.{jpg,jpeg,png,webp,svg,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

export function getImgAsset(imgNum: number, fallback: string): string {
  const fileNames = [
    `IMG${imgNum}`,
    `IMG_${imgNum}`,
    `img${imgNum}`,
    `img_${imgNum}`,
    `IMG-${imgNum}`,
    `img-${imgNum}`
  ];
  const exts = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'webp', 'WEBP'];

  for (const name of fileNames) {
    for (const ext of exts) {
      const key = `/src/assets/images/${name}.${ext}`;
      if (imageModules[key]) {
        const mod = imageModules[key];
        return typeof mod === 'string' ? mod : (mod as any).default || fallback;
      }
    }
  }
  return fallback;
}

export const isCourseComingSoon = (courseId: string): boolean => {
  return courseId !== 'begena' && courseId !== 'krar';
};

export const COURSES_DATA: Course[] = [
  {
    id: 'begena',
    isComingSoon: false,
    name: 'በገና (Harp of David)',
    description: 'Master the spiritual, ten-stringed large lyre of Ethiopia. Often referred to as the Harp of David, the Begena has been played for centuries as a meditative, prayerful, and sacred instrument. This program leads you from fundamental finger positions and tuning rituals to classical sacred chants and advanced vibrato techniques.',
    shortDescription: 'The sacred ten-stringed harp of Ethiopia, played for deep meditation and spiritual chants.',
    level: 'Beginner to Advanced',
    duration: '3 to 6 Months',
    learningMode: ['In-Person', 'Online', 'Hybrid'],
    image: begenaCourseImg,
    rating: 4.9,
    difficulty: 'All Levels',
    levels: ['Begena Level 1', 'Begena Level 2', 'Begena Level 3'],
    curriculum: [
      {
        week: 'Begena Level 1',
        title: 'Foundation, Tuning & Posture',
        topics: [
          'History and sacred origins of the Begena',
          'Tuning theory (understanding the acoustic buzz of the Birz system)',
          'Proper sitting posture and left-hand placement',
          'Basic open strings exercises and rhythmic timing'
        ]
      },
      {
        week: 'Begena Level 2',
        title: 'Intermediate Melodic Sequences & Chants',
        topics: [
          'Mastering finger plucking combinations (1st, 3rd, and 5th fingers)',
          'Tuning in traditional Qenet modes (Tizita and Bati)',
          'Beginning traditional Mezmur accompaniment',
          'Performance breathing and vocal synchronization'
        ]
      },
      {
        week: 'Begena Level 3',
        title: 'Mastery & Liturgical Repertoire',
        topics: [
          'Advanced string muting and buzz adjustment techniques',
          'Performing complex traditional spiritual melodies',
          'Improvisational patterns within traditional scales',
          'Solo certification performance'
        ]
      }
    ],
    learningOutcomes: [
      'Ability to independently tune a Begena in multiple modes',
      'Flawless execution of traditional finger plucking techniques',
      'Knowledge of traditional liturgical scales and rhythmic meters',
      'Repertoire of at least 12 classical Ethiopian spiritual songs'
    ],
    requirements: [
      'Access to a 10-stringed Ethiopian Begena (available in our store)',
      'No prior musical experience required',
      'Patience for slow, meditative practice'
    ],
    schedule: [
      'Monday & Wednesday (Evenings): 6:00 PM - 8:00 PM',
      'Saturday Morning: 9:00 AM - 12:00 PM',
      'Flexible Online Video Access with weekly 1-on-1 feedback sessions'
    ],
    pricing: [
      { duration: 'Package 1 (3 Months)', price: 930, period: 'per month' },
      { duration: 'Package 2 (4 Months)', price: 780, period: 'per month' },
      { duration: 'Package 3 (6 Months)', price: 600, period: 'per month' }
    ],
    registrationFee: 200
  },
  {
    id: 'krar',
    isComingSoon: false,
    name: 'ክራር (Traditional Lyre)',
    description: 'Learn the dynamic and popular five or six-stringed bowl lyre of Ethiopia. Played either plucked (as an acoustic solo instrument) or strummed (electric/modern styles), the Krar is the heartbeat of secular Ethiopian secular folk music, storytelling, and social celebrations. You will explore multiple Qenets (Tizita, Ambassel, Bati, and Anchihoye).',
    shortDescription: 'The versatile 6-string bowl lyre played both acoustic and electric across folk and modern genres.',
    level: 'Beginner to Intermediate',
    duration: '3 to 6 Months',
    learningMode: ['In-Person', 'Online'],
    image: krarCourseImg,
    rating: 4.8,
    difficulty: 'Beginner',
    levels: ['Level 1: Acoustic Plucking & Core Scales', 'Level 2: Folk Rhythms & Strumming Styles'],
    curriculum: [
      {
        week: 'Month 1-2',
        title: 'The Core Scales & Tuning',
        topics: [
          'Krar structure and tuning procedures',
          'Plucking with the plectrum (Gort) vs fingerpicking',
          'Understanding Tizita and Bati Qenet modes',
          'Simple folk melodies'
        ]
      },
      {
        week: 'Month 3-4',
        title: 'Strumming Techniques & Rhythms',
        topics: [
          'Damping string resonances with left hand',
          'Up-and-down strumming rhythms',
          'Ambassel and Anchihoye scales',
          'Accompanying vocalists and lyric integration'
        ]
      }
    ],
    learningOutcomes: [
      'Mastery of both plucking and rapid-strumming (Mektet) techniques',
      'Ability to instantly tune Krar across four primary Ethiopian scales',
      'Accompaniment of traditional folk dances and poetry',
      'Understanding of modern amplified electric Krar configurations'
    ],
    requirements: [
      'A 6-stringed acoustic or electric Krar',
      'Enthusiasm for fast-paced rhythmic practice'
    ],
    schedule: [
      'Tuesday & Thursday (Evenings): 6:30 PM - 8:30 PM',
      'Sunday Afternoon: 2:00 PM - 5:00 PM'
    ],
    pricing: [
      { duration: 'Package 1 (3 Months)', price: 930, period: 'per month' },
      { duration: 'Package 2 (4 Months)', price: 780, period: 'per month' },
      { duration: 'Package 3 (6 Months)', price: 600, period: 'per month' }
    ],
    registrationFee: 200
  },
  {
    id: 'masenqo',
    isComingSoon: true,
    name: 'ማሲንቆ (Single-String Lute)',
    description: 'The single-stringed bowed lute of Ethiopia, played primarily by traditional minstrels (Azmaris). Bowed with horsehair, the Masenqo produces an incredibly rich, vocally expressive, and raw harmonic tone. It requires deep pitch recognition and hand-coordination. This course teaches accurate bowing, fingering, and comedic or storytelling accompaniment.',
    shortDescription: 'An expressive single-stringed bowed lute crafted from leather and horsehair, the soul of Azmari culture.',
    level: 'Intermediate to Advanced',
    duration: '6 Months',
    learningMode: ['In-Person'],
    image: masinqoCourseImg,
    rating: 4.95,
    difficulty: 'Intermediate',
    levels: ['Level 1: Bowing Foundations & Pitch Matching', 'Level 2: Microtonal Slides & Impromptu Accompanying'],
    curriculum: [
      {
        week: 'Month 1-3',
        title: 'Bowing Mechanics & Pure Tones',
        topics: [
          'Anatomy of the diamond-shaped Masenqo',
          'Rosin application and bow tensioning',
          'Generating a clean, resonant bowed tone',
          'Left-thumb sliding pitch positions'
        ]
      },
      {
        week: 'Month 4-6',
        title: 'Ornamentation & Cultural Improvisation',
        topics: [
          'Vibrato and microtonal slides (Silet)',
          'Syncing bowed rhythm with vocal inflections',
          'The art of Azmari poetic dialogue (Sem-enna-Worq)',
          'Live ensemble performance practice'
        ]
      }
    ],
    learningOutcomes: [
      'Ability to generate a warm, clear, scratch-free bowed note',
      'Expertise in Microtonal sliding scales without frets',
      'Competence in improvising comedic or historical song backings',
      'Sustainment of traditional bowing tempo for over 20 minutes'
    ],
    requirements: [
      'A traditional Ethiopian Masenqo (available for rent at the school)',
      'Highly recommended to have good relative pitch or ear training'
    ],
    schedule: [
      'Wednesday & Friday (Evenings): 6:00 PM - 8:00 PM',
      'Saturday Afternoon: 1:30 PM - 4:30 PM'
    ],
    pricing: [
      { duration: '6 Months (Complete)', price: 2400, period: 'total' },
      { duration: '4 Months (Accelerated)', price: 1800, period: 'total' },
      { duration: '3 Months (Intro)', price: 1400, period: 'total' }
    ],
    registrationFee: 200
  },
  {
    id: 'washint',
    isComingSoon: true,
    name: 'ዋሽንት (Bamboo Flute)',
    description: 'The traditional Ethiopian end-blown bamboo flute. With its distinctive vocal quality, the Washint features four or five finger holes and is used to tell pastoral stories, accompany spiritual liturgies, and evoke intense nostalgia (Tizita). Students will learn embouchure control, circular breathing basics, and rapid finger trills.',
    shortDescription: 'The end-blown traditional bamboo flute, producing airy, deeply emotional, and pastoral melodies.',
    level: 'Beginner to Intermediate',
    duration: '3 to 6 Months',
    learningMode: ['In-Person', 'Online'],
    image: washintCourseImg,
    rating: 4.7,
    difficulty: 'Beginner',
    levels: ['Level 1: Breath & embouchure', 'Level 2: Pentatonic Scales & Vibratos'],
    curriculum: [
      {
        week: 'Month 1-2',
        title: 'The Breath & First Notes',
        topics: [
          'Proper embouchure (lip and teeth angling over the rim)',
          'Air column control and producing low vs. high registers',
          'Playing the basic pentatonic scale steps',
          'Nostalgic Tizita melodies'
        ]
      },
      {
        week: 'Month 3-4',
        title: 'Ornaments & Rapid Trills',
        topics: [
          'Finger trills (Kinikin) and breath staccatos',
          'Bending pitches by half-covering holes',
          'Bati and Ambassel scales on the Washint',
          'Duets with Krar or Begena'
        ]
      }
    ],
    learningOutcomes: [
      'Consistent generation of a warm, breathy, beautiful flute tone',
      'Mastery of pentatonic scale transpositions using finger variations',
      'Understanding of pastoral storytelling through music phrasing',
      'Basic circular breathing capabilities'
    ],
    requirements: [
      'Traditional bamboo Washint (different sizes available)',
      'Healthy lung capacity and enthusiasm for breath control'
    ],
    schedule: [
      'Monday & Thursday (Evenings): 6:00 PM - 7:30 PM',
      'Saturday Mid-day: 11:30 AM - 1:30 PM'
    ],
    pricing: [
      { duration: '6 Months (Full)', price: 1200, period: 'total' },
      { duration: '4 Months (Accelerated)', price: 950, period: 'total' },
      { duration: '3 Months (Intro)', price: 700, period: 'total' }
    ],
    registrationFee: 200
  },
  {
    id: 'vocal',
    isComingSoon: true,
    name: 'ቮካል Traditional & Liturgical Vocals',
    description: 'Acquire the authentic vocal styling of Ethiopian orthodox liturgy, liturgical chant notation (Yaredic Zema), and classical folk singing. You will learn vocal projection, microtonal inflections, nasal resonances specific to East African singing, and master the traditional performance formats.',
    shortDescription: 'Master the ancient vocal techniques, Yaredic chant notations, and microtonal trills of Ethiopian heritage.',
    level: 'Beginner to Advanced',
    duration: '3, 4 to 6 Months',
    learningMode: ['In-Person', 'Online', 'Hybrid'],
    image: vocalCourseImg,
    rating: 4.9,
    difficulty: 'All Levels',
    levels: ['Level 1: Breathing & Traditional Scales', 'Level 2: Liturgical Chants & Microtonal Ornaments'],
    curriculum: [
      {
        week: 'Month 1-3',
        title: 'Voice Placement & Qenet Tuning',
        topics: [
          'Diaphragmatic breathing and posture',
          'Resonance matching in Tizita, Bati, and Ambassel modes',
          'Nasal resonance and larynx control',
          'Basic folk melodies'
        ]
      },
      {
        week: 'Month 4-6',
        title: 'St. Yared Hymnology (Zema)',
        topics: [
          'Introduction to the Ge\'ez script musical symbols (Meleket)',
          'The three modes of Yaredic Zema: Ge\'ez, Ezel, and Araray',
          'Choral call-and-response dynamics',
          'Advanced microtonal trilling (Zireg)'
        ]
      }
    ],
    learningOutcomes: [
      'Clean vocal intonation across all four primary Ethiopian Qenets',
      'Proficiency in interpreting traditional Yaredic chant notation',
      'Enhanced vocal stamina with healthy, tension-free traditional projection',
      'Ability to lead call-and-response liturgical configurations'
    ],
    requirements: [
      'No physical instrument required (your voice is the instrument)',
      'Willingness to learn and pronounce words in Ge\'ez and Amharic'
    ],
    schedule: [
      'Tuesday & Friday (Evenings): 6:00 PM - 8:00 PM',
      'Sunday Morning: 10:00 AM - 12:00 PM'
    ],
    pricing: [
      { duration: '6 Months (Complete)', price: 2400, period: 'total' },
      { duration: '4 Months (Accelerated)', price: 1800, period: 'total' },
      { duration: '3 Months (Standard)', price: 1400, period: 'total' }
    ],
    registrationFee: 200
  },
  {
    id: 'kebero',
    isComingSoon: true,
    name: 'ከበሮ (Traditional Percussion)',
    description: 'Learn the double-headed conical hand drum used extensively in Ethiopian orthodox ceremonies, secular weddings, and cultural folk ensembles. This hands-on course teaches proper posture, hand positioning, bass vs. treble slaps, complex cross-rhythms (e.g., 6/8 and 12/8 metrics), and tempo shifting.',
    shortDescription: 'Master the double-headed conical ceremonial drum, learning syncopations, liturgical, and secular rhythms.',
    level: 'Beginner to Intermediate',
    duration: '3 Months',
    learningMode: ['In-Person'],
    image: keberoImg,
    rating: 4.75,
    difficulty: 'Beginner',
    levels: ['Level 1: Hand Strikes & Metric Control', 'Level 2: Liturgical Accompaniment & Polyrhythms'],
    curriculum: [
      {
        week: 'Week 1-6',
        title: 'Basic Strokes & Tempo Holding',
        topics: [
          'Anatomy of the Kebero and proper shoulder strap support',
          'Bass stroke (middle) and Rim slap (treble) techniques',
          'Holding steady slow-tempo tempos',
          'Traditional church walking beats'
        ]
      },
      {
        week: 'Week 7-12',
        title: 'Polyrhythmic Syncopation',
        topics: [
          'Accelerating/decelerating rituals (Tiriz and Metit)',
          'Complex secular dance meters (Eskesta backbeats)',
          'Improvisational fills during chants',
          'Ensemble synchronization with Washint and Masenqo'
        ]
      }
    ],
    learningOutcomes: [
      'Perfect execution of high-slap and bass-boom hand tones',
      'Ability to hold steady speed during dynamic ritual accelerations',
      'Proficiency in at least 8 standard secular and 6 sacred drumming templates',
      'Coordinated physical drumming while walking or swaying'
    ],
    requirements: [
      'A medium or large traditional leather Kebero',
      'Physical endurance for standing and drumming sessions'
    ],
    schedule: [
      'Wednesday (Evenings): 6:30 PM - 8:30 PM',
      'Saturday Afternoon: 3:00 PM - 5:00 PM'
    ],
    pricing: [
      { duration: '3 Months (Full Course)', price: 1200, period: 'total' }
    ],
    registrationFee: 200
  }
];

export const TEACHERS_DATA: Teacher[] = [
  {
    id: 'abel',
    name: 'Bruk Tesfaye',
    instrument: 'Begena (Harp of David)',
    photo: abelBegenaPhoto,
    bio: 'Bruk Tesfaye is the founder of Liora Begena, established with a passion for Ethiopian spiritual music and a deep love for the traditional Begena. As a musician, teacher, and technology enthusiast, Bruk is committed to preserving Ethiopia’s musical heritage and making traditional instrument education accessible to the next generation. Through Liora Begena, he aims to create a welcoming learning environment where students can develop their musical skills, strengthen their connection to Ethiopian tradition, and discover the beauty of spiritual music. For Bruk, Begena is more than an instrument—it is a source of light, inspiration, and spiritual connection.',
    experience: 'Founder of Liora Begena & Traditional Instrument Educator',
    specialization: 'Musician, Teacher & Technology Enthusiast',
    coursesTaught: ['Begena (Harp of David) - Basic 1, 2, and Mastery'],
    reviews: [
      { studentName: 'Yared Tesfaye', rating: 5, comment: 'Learning from Bruk is a spiritual and inspiring journey. His patience in teaching Begena is incredible.' },
      { studentName: 'Kidist G/Yesus', rating: 5, comment: 'A true inspiration. The lessons are welcoming, clear, and beautifully structured.' }
    ],
    availableClasses: ['Saturday Morning Begena Cohort A', 'Monday Evening Advanced Masterclass']
  },
  {
    id: 'alex',
    name: 'Seyfu T.',
    instrument: 'Begena, Krar, Masinqo, Kebero & Vocals',
    photo: '',
    bio: 'Seyfu is a very good Krar player and a highly trained traditional vocalist. A graduate of Addis Ababa University, he excels at blending classical Ethiopian modes with engaging pedagogical frameworks. He makes the Krar highly accessible to beginners while pushing advanced students to master fast eskesta rhythms.',
    experience: '10 Years of Professional Concerts & Instruction',
    specialization: 'Folk Krar Strumming & Nasal Resonance Control',
    coursesTaught: ['Krar (Traditional Lyre)', 'Traditional & Liturgical Vocals'],
    reviews: [
      { studentName: 'Elias Melaku', rating: 5, comment: 'Seyfu\'s energy is infectious. He makes the most difficult strumming patterns feel easy!' }
    ],
    availableClasses: ['Tuesday & Thursday Evening Krar Foundations', 'Sunday Morning Traditional Vocal Choral']
  },
  {
    id: 'hayle',
    name: 'Abel Betsegaw',
    instrument: 'Masenqo, Begena, Krar & Washint',
    photo: '',
    bio: 'Abel is an acclaimed Masenqo player who grew up in Gondar studying under traditional village Azmaris. He has traveled extensively across Europe and North America showcasing the raw, bowed expressive qualities of the Masenqo. He is passionate about preservation and teaching the microtonal slides that give Masenqo its soul.',
    experience: '12 Years of International Performance & Research',
    specialization: 'Expert in Kirar and Washint, Improvisational Poetry',
    coursesTaught: ['Masenqo (Single-String Lute)'],
    reviews: [
      { studentName: 'Abenezer Hailu', rating: 5, comment: 'Teacher Abel teaches the ear first. My pitch recognition has improved immensely.' }
    ],
    availableClasses: ['Wednesday & Friday Bowing Techniques', 'Saturday Afternoon Masenqo Ensemble']
  },
  {
    id: 'hana',
    name: 'Hana Derese',
    instrument: 'Begena & Liturgical Vocals',
    photo: '',
    bio: 'Hana is a widely respected traditional vocalist and skilled Begena instructor with deep mastery in sacred hymnody and spiritual intonation. Her classes focus on breath control, vocal phrasing, and the meditative resonance of the 10-string Begena.',
    experience: '8 Years of Traditional Music Instruction & Choral Direction',
    specialization: 'Sacred Hymnody, Vocal Intonation & Begena Chants',
    coursesTaught: ['Traditional & Liturgical Vocals', 'Begena (Harp of David) - Basic 1 & 2'],
    reviews: [
      { studentName: 'Selamawit Tadesse', rating: 5, comment: 'Teacher Hana\'s vocal technique and patient Begena guidance transformed my confidence completely.' }
    ],
    availableClasses: ['Saturday Morning Vocal Hymnody', 'Wednesday Evening Begena Foundations']
  },
  {
    id: 'bruk',
    name: 'Bruk Tesfaye',
    instrument: 'Begena',
    photo: brukImg,
    bio: 'Bruk Tesfaye is the founder of Liora Begena, established with a passion for Ethiopian spiritual music and a deep love for the traditional Begena. As a musician, teacher, and technology enthusiast, Bruk is committed to preserving Ethiopia’s musical heritage and making traditional instrument education accessible to the next generation. Through Liora Begena, he aims to create a welcoming learning environment where students can develop their musical skills, strengthen their connection to Ethiopian tradition, and discover the beauty of spiritual music. For Bruk, Begena is more than an instrument—it is a source of light, inspiration, and spiritual connection.',
    experience: 'Founder of Liora Begena & Traditional Instrument Educator',
    specialization: 'Musician, Teacher & Technology Enthusiast',
    coursesTaught: ['Begena (Traditional Lyre)'],
    reviews: [
      { studentName: 'Tsion Berhe', rating: 5, comment: 'Getting my first clean sound took me a week, but Bruk\'s guidance kept me motivated. Now I play full songs!' }
    ],
    availableClasses: ['Monday & Thursday Evening Washint Air Control', 'Saturday Mid-day Flute Trills']
  },
  {
    id: 'merawi',
    name: 'Mezemer Merawi Wolde',
    instrument: 'Kebero & Sacred Liturgy',
    photo: keberoImg,
    bio: 'Merawi has served as a lead liturgical drummer (Kebero) in Addis Ababa for over 15 years. His rhythmic patterns are legendary, combining spiritual precision with infectious, uplifting tempos. He teaches both church liturgy and regional folk beats with structured discipline.',
    experience: '16 Years of Ecclesiastical & Folk Drumming',
    specialization: 'Liturgical Syncopation, Dynamic Tempos & Conical Drum Tuning',
    coursesTaught: ['Kebero (Traditional Percussion)'],
    reviews: [
      { studentName: 'Girma Assefa', rating: 5, comment: 'Excellent class. My hand posture and speed holding have completely changed.' }
    ],
    availableClasses: ['Wednesday Sacred Kebero beats', 'Saturday Conical Percussion Core']
  }
];

export const EVENTS_DATA: Event[] = [
  {
    id: 'spiritual-begena-night',
    title: 'The Sound of David\'s Harp: A Meditative Concert',
    date: 'August 15, 2026',
    time: '6:30 PM - 9:30 PM',
    location: 'Center Point Tower, first floor, Hawassa & Live Streamed',
    image: krarImg,
    shortDescription: 'Join Lique Mezemer Bruk and master students for an immersive evening of traditional Begena music and spiritual chants.',
    fullDescription: 'Immerse yourself in a serene candle-lit evening filled with the acoustic, buzzing resonance of the Begena, accompanied by soaring vocalists and bamboo flutes. This annual concert brings together masters and advanced students of the Liora Begena School to raise funds for student scholarships and cultural instrument preservation. Attendees will experience classical sacred chants (Mezmurs) in their authentic medieval formats, complete with translations projected in English and Amharic.',
    speakerOrPerformer: 'Deacon Bruk Tesfaye & Special Guest Vocalists',
    galleryImages: [begenaImg, vocalImg],
    isUpcoming: true,
    category: 'Concert'
  },
  {
    id: 'traditional-instrument-workshop',
    title: 'Tuning Rituals & Gut-String Tensioning Workshop',
    date: 'September 5, 2026',
    time: '2:00 PM - 6:00 PM',
    location: 'Center Point Tower, first floor, Hawassa & Google Meet',
    image: washintImg,
    shortDescription: 'A practical, hands-on workshop covering instrument maintenance, sheep-gut string tensioning, and wooden buzz setup.',
    fullDescription: 'Tuning traditional Ethiopian instruments like the Begena or Krar is more than a technical step—it is a meditative process requiring deep ear training. This weekend workshop, led by our senior instrument curators, teaches you how to tension sheep-gut strings, set up beeswax bridges for optimal buzzing (Birz), oil traditional woods, and calibrate Washint blowing holes. Perfect for active students, music educators, and instrument collectors.',
    speakerOrPerformer: 'Bereket Shimelis & Dawit Cherinet',
    galleryImages: [washintImg],
    isUpcoming: true,
    category: 'Workshop'
  },
  {
    id: 'meskel-liturgy-past',
    title: 'Meskel Chants & Kebero Syncopation Showcase',
    date: 'September 27, 2025',
    time: '10:00 AM - 1:00 PM',
    location: 'Center Point Tower Campus, Hawassa',
    image: keberoImg,
    shortDescription: 'A successful public rehearsal and masterclass demonstrating complex liturgical 6/8 hand drumming for the Meskel Holiday.',
    fullDescription: 'This community event gathered over 200 neighbors to witness our percussion and vocal cohorts demonstrate traditional call-and-response liturgy. Students displayed incredible hand alignment, stepping patterns, and dynamic tempo escalations under the direction of Mezemer Merawi Wolde.',
    speakerOrPerformer: 'Liturgical Drumming Cohorts & Merawi Wolde',
    galleryImages: [],
    isUpcoming: false,
    category: 'Liturgical'
  }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'premium-begena',
    name: 'Coming Soon',
    price: 0,
    availability: 'Coming Soon',
    image: '',
    category: 'Instruments',
    description: 'Sacred handcrafted instruments in preparation at our artisan workshop.'
  },
  {
    id: 'traditional-krar',
    name: 'Coming Soon',
    price: 0,
    availability: 'Coming Soon',
    image: '',
    category: 'Instruments',
    description: 'Sacred handcrafted instruments in preparation at our artisan workshop.'
  },
  {
    id: 'bamboo-washint',
    name: 'Coming Soon',
    price: 0,
    availability: 'Coming Soon',
    image: '',
    category: 'Instruments',
    description: 'Sacred handcrafted instruments in preparation at our artisan workshop.'
  },
  {
    id: 'begena-gut-strings',
    name: 'Sheep-Gut Begena String Replacement Set (10 Strings)',
    price: 1200,
    availability: 'Coming Soon',
    image: '',
    category: 'Strings',
    description: 'Ethically processed high-tensile sheep gut strings, dried and hand-twisted in traditional workshops. Provides the authentic deep buzzing low frequency unique to the Begena.'
  },
  {
    id: 'traditional-kebero-medium',
    name: 'Double-Headed Leather Kebero (Medium)',
    price: 4500,
    availability: 'Coming Soon',
    image: '',
    category: 'Instruments',
    description: 'A traditional conical wooden shell wrapped in sun-cured goat and cow hides, linked with durable leather laces. Complete with an adjustable woven cotton carrying shoulder strap.'
  }
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 'harp-of-david-history',
    title: 'The Harp of David: Ethiopian Begena through the Centuries',
    excerpt: 'Explore the royal, spiritual, and meditative history of the 10-stringed lyre from its biblical associations to its preservation in modern Ethiopian society.',
    content: 'The Begena represents one of the oldest stringed instrument traditions still actively practiced in the world today. According to historical Ethiopian church records and oral traditions, the instrument is spiritually tied to King David of Israel, believed to have been brought to Ethiopia during the reign of Menelik I. Unlike other traditional instruments played in festive social settings, the Begena has historically been reserved for meditation, biblical poetry recitation, and intimate spiritual prayer. Its deep, vibrating buzz is generated by the Birz system—the precise alignment of strings over a wide wooden bridge, padded with tiny bits of leather or beeswax. This article traces how the Begena traveled from imperial courts to modern neighborhood classrooms, surviving periods of political shifts and digital distractions through deliberate preservation efforts.',
    category: 'Begena History',
    author: 'Deacon Bruk Tesfaye',
    date: 'June 12, 2026',
    image: begenaImg
  },
  {
    id: 'five-core-qenets-modes',
    title: 'Understanding the Five Core Qenets (Pentatonic Modes)',
    excerpt: 'A basic guide for beginners to comprehend the unique intervals, emotional moods, and stories behind Tizita, Bati, Ambassel, and Anchihoye scales.',
    content: 'Unlike Western classical music built on twelve-tone scales, traditional Ethiopian music revolves around a beautiful system of pentatonic scales known as Qenets. Each Qenet represents not just a group of five notes, but an entire emotional universe. For instance, **Tizita** is the mode of deep nostalgia, memories, and bittersweet longing. **Bati** is bold, versatile, often used for upbeat narratives and heroic praise. **Ambassel** carries a narrative, rolling acoustic cadence ideal for historic chronicles and pastoral stories, while **Anchihoye** is intensely spiritual, often used in Orthodox liturgical hymns. This guide breaks down the step-by-step intervals of each Qenet on a Krar and Washint, helping new students train their ears to transition between these beautiful cultural scales effortlessly.',
    category: 'Ethiopian Music',
    author: 'Selamawit Dagne',
    date: 'July 2, 2026',
    image: krarImg
  },
  {
    id: 'begena-tuning-spiritual-act',
    title: 'Tuning the Begena: A Spiritual Act of Patience',
    excerpt: 'Why tuning a ten-stringed harp without a digital meter is the ultimate exercise in mindfulness, breath control, and sonic calibration.',
    content: 'To a beginner, spending forty minutes tuning a Begena before playing a single note can feel tedious. However, master teachers view tuning as an essential component of the musical experience. The Begena is tuned to a pentatonic scale, with five active playing strings and five sympathetic or muted strings. Calibrating the buzzing sound requires placing microscopic pieces of leather or soft beeswax between each string and the wooden bridge. If a string is tuned even slightly too tight, the buzz is choked; too loose, and it rattles aggressively. The process requires absolute silence, steady breathing, and an intimate relationship with the low-frequency hum. Tuning teaches students the patience and deep listening skills required to understand traditional Ethiopian musical heritage.',
    category: 'Practice Tips',
    author: 'Deacon Bruk Tesfaye',
    date: 'July 18, 2026',
    image: begenaImg
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    name: 'Tsige G/Kidan',
    course: 'Begena (Harp of David)',
    branchOrOnline: 'Online Student (Washington DC, USA)',
    text: 'Living in the diaspora, finding authentic traditional music instruction was nearly impossible. The Liora Begena School\'s online platform changed everything. The high-definition videos combined with weekly live Google Meet sessions with Lique Mezemer Bruk himself made me feel connected to my roots in a profound way.',
    rating: 5,
    avatar: ''
  },
  {
    id: '2',
    name: 'Yohannes Mengstu',
    course: 'Krar & Vocals',
    branchOrOnline: 'Hawassa Campus (In-Person)',
    text: 'The absolute rigor of the in-person classes at the Hawassa Campus is outstanding. We do not just learn to pluck strings; we learn the historical contexts, the poetry, and proper eskesta syncopation. Practicing alongside other young artists creates a rich sense of community.',
    rating: 5,
    avatar: ''
  },
  {
    id: '3',
    name: 'Kidist Hailu',
    course: 'Liturgical Vocals & Kebero',
    branchOrOnline: 'Hawassa Campus (In-Person)', 
    text: 'I joined as a complete beginner hoping to sing liturgical hymns. Within four months, thanks to Teacher Bruk and Teacher Abel Betsegaw, I can read Saint Yared\'s chant notation (Meleket) and keep rhythm on a heavy conical drum perfectly!',
    rating: 5,
    avatar: ''
  }
];

export const BRANCHES_DATA: Branch[] = [
  {
    id: 'hawassa',
    name: 'Hawassa Campus',
    location: 'Center Point Tower, first floor, Hawassa, Ethiopia',
    description: 'Our physical school campus located at Center Point Tower, offering sacred Begena and traditional instrument training in dedicated practice studios.',
    phone: '+251 912 67 4600',
    email: 'info@liorabegena.com',
    hours: 'Monday - Sunday: 8:00 AM - 7:30 PM',
    image: begenaCourseImg
  }
];

export const GALLERY_DATA: GalleryItem[] = [];

export {
  TRANSLATIONS,
  AMHARIC_DICTIONARY,
  tr,
  getLocalizedCourse,
  getLocalizedTeacher
} from './translations';


