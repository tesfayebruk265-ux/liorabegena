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
import alexImg from '../assets/images/alex.jpg';
import hayleImg from '../assets/images/hayle.jpg';
import brukImg from '../assets/images/bruk.jpg';
import newBegenaPhoto from '../assets/images/New_begena.jpg';
import begenatogetherPhoto from '../assets/images/begenatogether.jpg';
import keberoPlayingImg from '../assets/images/kebero_playing.jpg';
import begenaPlayingImg from '../assets/images/begena_playing.jpg';
const img10 = new URL('../assets/images/(10).jpg', import.meta.url).href;
const img15 = new URL('../assets/images/(15).jpg', import.meta.url).href;
const img22 = new URL('../assets/images/(22).jpg', import.meta.url).href;
const img8 = new URL('../assets/images/(8).jpg', import.meta.url).href;
const store2 = new URL('../assets/images/store (2).jpg', import.meta.url).href;
const store4 = new URL('../assets/images/store (4).jpg', import.meta.url).href;
const store3 = new URL('../assets/images/store (3).jpg', import.meta.url).href;

export const ABEL_BEGENA_PHOTO = abelBegenaPhoto;

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

export const COURSES_DATA: Course[] = [
  {
    id: 'begena',
    name: 'በገና (Harp of David)',
    description: 'Master the spiritual, ten-stringed large lyre of Ethiopia. Often referred to as the Harp of David, the Begena has been played for centuries as a meditative, prayerful, and sacred instrument. This program leads you from fundamental finger positions and tuning rituals to classical sacred chants and advanced vibrato techniques.',
    shortDescription: 'The sacred ten-stringed harp of Ethiopia, played for deep meditation and spiritual chants.',
    level: 'Beginner to Advanced',
    duration: '3 to 9 Months',
    learningMode: ['In-Person', 'Online', 'Hybrid'],
    image: begenaCourseImg,
    rating: 4.9,
    difficulty: 'All Levels',
    levels: ['Basic 1: Foundation & Tuning', 'Basic 2: Rhythmic Chants & Intermediate Mezmur', 'Basic 3: Advanced Ornamentation & Master Classes'],
    curriculum: [
      {
        week: 'Month 1-3 (Basic 1)',
        title: 'Foundation, Tuning & Posture',
        topics: [
          'History and sacred origins of the Begena',
          'Tuning theory (understanding the acoustic buzz of the Birz system)',
          'Proper sitting posture and left-hand placement',
          'Basic open strings exercises and rhythmic timing'
        ]
      },
      {
        week: 'Month 4-6 (Basic 2)',
        title: 'Intermediate Melodic Sequences',
        topics: [
          'Mastering finger plucking combinations (1st, 3rd, and 5th fingers)',
          'Tuning in traditional Qenet modes (Tizita and Bati)',
          'Beginning traditional Mezmur accompaniment',
          'Performance breathing and vocal synchronization'
        ]
      },
      {
        week: 'Month 7-9 (Basic 3)',
        title: 'Mastery & Liturgical Chants',
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
      { duration: '9 Months (Complete)', price: 1200, period: 'total' },
      { duration: '6 Months (Intermediate)', price: 1500, period: 'total' },
      { duration: '3 Months (Intensive)', price: 2800, period: 'per month' }
    ],
    registrationFee: 500
  },
  {
    id: 'krar',
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
      { duration: '9 Months', price: 1200, period: 'total' },
      { duration: '6 Months', price: 1500, period: 'total' },
      { duration: '3 Months', price: 2800, period: 'per month' }
    ],
    registrationFee: 500
  },
  {
    id: 'masenqo',
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
      { duration: '3 Months (Intro)', price: 1400, period: 'total' }
    ],
    registrationFee: 500
  },
  {
    id: 'washint',
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
      { duration: '3 Months (Intro)', price: 700, period: 'total' }
    ],
    registrationFee: 500
  },
  {
    id: 'vocal',
    name: 'ቮካል Traditional & Liturgical Vocals',
    description: 'Acquire the authentic vocal styling of Ethiopian orthodox liturgy, liturgical chant notation (Yaredic Zema), and classical folk singing. You will learn vocal projection, microtonal inflections, nasal resonances specific to East African singing, and master the traditional performance formats.',
    shortDescription: 'Master the ancient vocal techniques, Yaredic chant notations, and microtonal trills of Ethiopian heritage.',
    level: 'Beginner to Advanced',
    duration: '6 to 12 Months',
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
      { duration: '12 Months (Master)', price: 3000, period: 'total' },
      { duration: '6 Months (Standard)', price: 1600, period: 'total' }
    ],
    registrationFee: 500
  },
  {
    id: 'kebero',
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
    registrationFee: 500
  }
];

export const TEACHERS_DATA: Teacher[] = [
  {
    id: 'abel',
    name: 'Zemari Deacon Abel Tesfaye',
    instrument: 'Begena (Harp of David)',
    photo: abelBegenaPhoto,
    bio: 'Abel is a widely respected master of the Begena with over 20 years of dedication. Honored with the ecclesiastical title of Lique Mezemer, he has taught hundreds of students globally. He founded the Abel Begena School to ensure the ancient, meditative vibrations of the Harp of David are passed systematically to the digital generation without losing their spiritual depth.',
    experience: '22 Years of Teaching & Performance',
    specialization: 'Traditional Liturgical Begena & Ancient Tuning Systems',
    coursesTaught: ['Begena (Harp of David) - Basic 1, 2, and Mastery'],
    reviews: [
      { studentName: 'Yared Tesfaye', rating: 5, comment: 'Learning from Lique Mezemer Abel is a spiritual journey. His patience in teaching tuning is incredible.' },
      { studentName: 'Kidist G/Yesus', rating: 5, comment: 'A true master. The lessons are clear, deep, and beautifully structured.' }
    ],
    availableClasses: ['Saturday Morning Begena Cohort A', 'Monday Evening Advanced Masterclass']
  },
  {
    id: 'alex',
    name: 'Alex T',
    instrument: 'Begena, Krar, Masinqo, Kebero & Vocals',
    photo: alexImg,
    bio: 'Alex is a very good Krar player and a highly trained traditional vocalist. A graduate of Addis Ababa University ,He excels at blending classical Ethiopian modes with engaging pedagogical frameworks. He makes the Krar highly accessible to beginners while pushing advanced students to master fast eskesta rhythms.',
    experience: '10 Years of Professional Concerts & Instruction',
    specialization: 'Folk Krar Strumming & Nasal Resonance Control',
    coursesTaught: ['Krar (Traditional Lyre)', 'Traditional & Liturgical Vocals'],
    reviews: [
      { studentName: 'Elias Melaku', rating: 5, comment: 'Alex\'s energy is infectious. He makes the most difficult strumming patterns feel easy!' }
    ],
    availableClasses: ['Tuesday & Thursday Evening Krar Foundations', 'Sunday Morning Traditional Vocal Choral']
  },
  {
    id: 'hayle',
    name: 'Hayle Melekot',
    instrument: 'Masenqo, Begena, Krar & Washint',
    photo: hayleImg,
    bio: 'Hayle is an acclaimed Masenqo player who grew up in Gondar studying under traditional village Azmaris. He has traveled extensively across Europe and North America showcasing the raw, bowed expressive qualities of the Masenqo. He is passionate about preservation and teaching the microtonal slides that give Masenqo its soul.',
    experience: '12 Years of International Performance & Research',
    specialization: 'Expert in Kirar and Washint, Improvisational Poetry',
    coursesTaught: ['Masenqo (Single-String Lute)'],
    reviews: [
      { studentName: 'Abenezer Hailu', rating: 5, comment: 'Teacher Hayle teaches the ear first. My pitch recognition has improved immensely.' }
    ],
    availableClasses: ['Wednesday & Friday Bowing Techniques', 'Saturday Afternoon Masenqo Ensemble']
  },
  {
    id: 'bruk',
    name: 'Bruk Tesfaye',
    instrument: 'Begena',
    photo: brukImg,
    bio: 'Bruk is a master Begena player with over a decade of experience performing and teaching the traditional Ethiopian string instrument. His classes focus on the intricate techniques and emotional expression that define the Begena\'s unique sound.',
    experience: '4 Years in Traditional Begena Performance & Instruction',
    specialization: 'Begena Technique & Expressive Performance',
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
    location: 'Abel Begena HQ - Piazza Branch Auditorium & Live Streamed',
    image: krarImg,
    shortDescription: 'Join Lique Mezemer Abel and master students for an immersive evening of traditional Begena music and spiritual chants.',
    fullDescription: 'Immerse yourself in a serene candle-lit evening filled with the acoustic, buzzing resonance of the Begena, accompanied by soaring vocalists and bamboo flutes. This annual concert brings together masters and advanced students of the Abel Begena School to raise funds for student scholarships and cultural instrument preservation. Attendees will experience classical sacred chants (Mezmurs) in their authentic medieval formats, complete with translations projected in English and Amharic.',
    speakerOrPerformer: 'Zemari Deacon Abel Tesfaye & Special Guest Vocalists',
    galleryImages: [begenaImg, vocalImg],
    isUpcoming: true,
    category: 'Concert'
  },
  {
    id: 'traditional-instrument-workshop',
    title: 'Tuning Rituals & Gut-String Tensioning Workshop',
    date: 'September 5, 2026',
    time: '2:00 PM - 6:00 PM',
    location: 'Abel Begena School - Megenagna Branch & Google Meet',
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
    location: 'Abel Begena School - Lebu Annex Outdoor Grounds',
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
    name: 'Abel Signature 1-String Mesenko',
    price: 3500,
    availability: 'In Stock',
    image: store2,
    category: 'Instruments',
    description: 'Expertly handcrafted from matured olive wood and stretched ox-hide. Features precision-calibrated cedar pegs, sheep-gut strings, and adjustable beeswax buzzing bridges. Individually tested by Lique Mezemer Abel.'
  },
  {
    id: 'traditional-krar',
    name: 'Special Shape 10-string Begena',
    price: 21000,
    availability: 'In Stock',
    image: store4,
    category: 'Instruments',
    description: 'Beautiful acoustic krar made from selected Ethiopian rosewood. Offers a clear, brilliant tone with high resonance. Comes with a handcrafted wooden plectrum (Gort) and protective carrier bag.'
  },
  {
    id: 'bamboo-washint',
    name: '10-string Normal Begena',
    price: 8500,
    availability: 'In Stock',
    image: store3,
    category: 'Accessories',
    description: 'Naturally aged highland bamboo, fire-treated and custom cut. Features four clean finger holes and comfortable embouchure rim, ideal for mastering Tizita and Bati modes.'
  },
  {
    id: 'begena-gut-strings',
    name: 'Sheep-Gut Begena String Replacement Set (10 Strings)',
    price: 1200,
    availability: 'In Stock',
    image: begenaImg,
    category: 'Strings',
    description: 'Ethically processed high-tensile sheep gut strings, dried and hand-twisted in traditional workshops. Provides the authentic deep buzzing low frequency unique to the Begena.'
  },
  {
    id: 'traditional-kebero-medium',
    name: 'Double-Headed Leather Kebero (Medium)',
    price: 4500,
    availability: 'Low Stock',
    image: keberoImg,
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
    author: 'Zemari Deacon Abel Tesfaye',
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
    author: 'Zemari Deacon Abel Tesfaye',
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
    text: 'Living in the diaspora, finding authentic traditional music instruction was nearly impossible. The Abel Begena School\'s online platform changed everything. The high-definition videos combined with weekly live Google Meet sessions with Lique Mezemer Abel himself made me feel connected to my roots in a profound way.',
    rating: 5,
    avatar: ''
  },
  {
    id: '2',
    name: 'Yohannes Mengstu',
    course: 'Krar & Vocals',
    branchOrOnline: 'Piazza HQ Branch (In-Person)',
    text: 'The absolute rigor of the in-person classes at the Piazza HQ is outstanding. We do not just learn to pluck strings; we learn the historical contexts, the poetry, and proper eskesta syncopation. Practicing alongside other young artists creates a rich sense of community.',
    rating: 5,
    avatar: ''
  },
  {
    id: '3',
    name: 'Kidist Hailu',
    course: 'Liturgical Vocals & Kebero',
    branchOrOnline: 'Megenagna Branch (In-Person)', 
    text: 'I joined as a complete beginner hoping to sing liturgical hymns. Within four months, thanks to Teacher Abel and Teacher Hayle, I can read Saint Yared\'s chant notation (Meleket) and keep rhythm on a heavy conical drum perfectly!',
    rating: 5,
    avatar: ''
  }
];

export const BRANCHES_DATA: Branch[] = [
  {
    id: 'piazza',
    name: 'Piazza Branch',
    location: 'Piazza (Ramet Tabor Building 4th Floor), Addis Ababa',
    description: 'Our first branch, nested in the historical heart of Addis Ababa. This site focuses on the spiritual masterclasses of the Begena, instrument workshop, and historical archives.',
    phone: '+251 912 67 4600',
    email: 'abelbegena@gmail.com',
    hours: 'Monday - Sunday: 8:00 AM - 7:30 PM',
    image: krarImg
  },
  {
    id: 'megenagna',
    name: 'Megenagna Branch',
    location: 'Megenagna (City Mole, 7th Floor), Addis Ababa',
    description: 'This site focuses on the spiritual masterclasses of the Begena, instrument workshop, and historical archives.',
    phone: '+251 912 67 4600',
    email: 'abelbegena@gmail.com',
    hours: 'Monday - Sunday: 8:00 AM - 7:30 PM',
    image: washintImg
  },
  {
    id: 'lebu',
    name: 'Lebu Branch',
    location: 'Lebu (Desta Mini Mole 7th Floor), Addis Ababa',
    description: 'This site focuses on the spiritual masterclasses of the Begena, instrument workshop, and historical archives.',
    phone: '+251 912 67 4600',
    email: 'abelbegena@gmail.com',
    hours: 'Monday - Sunday: 8:00 AM - 7:30 PM',
    image: keberoImg
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  // SECTION 1: BEGENA (IMG1 - IMG5)
  { id: 'g1', imgNum: 10, category: 'Krar', url: img10, title: 'Krar Craftsmanship', description: 'Inspecting traditional bowl lyre frames and sheepskin soundheads.' },
  { id: 'g2', imgNum: 15, category: 'Masenqo', url: img15, title: 'Masenqo Solo Performance', description: 'Live demonstration of traditional bowed Ethiopian classical tunes.' },
  { id: 'g3', imgNum: 22, category: 'Students', url: img22, title: 'Youth Music Cohort', description: 'Young learners discovering traditional Ethiopian music heritage.' },
  { id: 'g4', imgNum: 8, category: 'Krar', url: img8, title: 'Krar Tuning & Qenet Scales', description: 'Tuning in traditional Tizita, Ambassel, and Bati pentatonic modes.' },
  { id: 'g5', imgNum: 5, category: 'Begena', url: getImgAsset(5, begenaImg), title: 'Begena Solo Recital', description: 'Advanced scholar performing classic St. Yared spiritual hymns.' },

  // SECTION 2: KRAR (IMG6 - IMG10)
  { id: 'g6', imgNum: 6, category: 'Krar', url: getImgAsset(6, krarImg), title: 'Plucking the Acoustic Krar', description: 'Advanced student practicing rapid individual finger picking on six strings.' },
  { id: 'g7', imgNum: 7, category: 'Krar', url: getImgAsset(7, krarImg), title: 'Electric Krar Rehearsal', description: 'Modern amplified Krar performance with traditional scale modulation.' },
  { id: 'g8', imgNum: 8, category: 'Krar', url: getImgAsset(8, krarImg), title: 'Krar Tuning & Qenet Scales', description: 'Tuning in traditional Tizita, Ambassel, and Bati pentatonic modes.' },
  { id: 'g9', imgNum: 9, category: 'Krar', url: getImgAsset(9, krarImg), title: 'Group Krar Ensemble', description: 'Students performing folk storytelling melodies together.' },
  { id: 'g10', imgNum: 10, category: 'Krar', url: getImgAsset(10, krarImg), title: 'Krar Craftsmanship', description: 'Inspecting traditional bowl lyre frames and sheepskin soundheads.' },

  // SECTION 3: MASENQO (IMG11 - IMG15)
  { id: 'g11', imgNum: 11, category: 'Masenqo', url: getImgAsset(11, masinqoImg), title: 'Masenqo Bowing Technique', description: 'Teacher Bereket guiding a student through proper horsehair bow tensioning.' },
  { id: 'g12', imgNum: 12, category: 'Masenqo', url: getImgAsset(12, masinqoImg), title: 'Single-String Harmony', description: 'Expressive microtonal slides and single-string vocal accompaniment.' },
  { id: 'g13', imgNum: 13, category: 'Masenqo', url: getImgAsset(13, masinqoImg), title: 'Azmari Tradition Masterclass', description: 'Exploring traditional minstrel storytelling and poetic improvisation.' },
  { id: 'g14', imgNum: 14, category: 'Masenqo', url: getImgAsset(14, masinqoImg), title: 'Masenqo Rosin Application', description: 'Preparing the horsehair bow for pure harmonic resonance.' },
  { id: 'g15', imgNum: 15, category: 'Masenqo', url: getImgAsset(15, masinqoImg), title: 'Masenqo Solo Performance', description: 'Live demonstration of traditional bowed Ethiopian classical tunes.' },

  // SECTION 4: WASHINT (IMG16 - IMG20)
  { id: 'g16', imgNum: 16, category: 'Washint', url: getImgAsset(16, washintImg), title: 'Highland Bamboo Washint', description: 'Finely selected four-hole highland bamboo Washints resting in our workshop.' },
  { id: 'g17', imgNum: 17, category: 'Washint', url: getImgAsset(17, washintImg), title: 'Washint Breath Control', description: 'Students practicing embouchure and breath control for microtonal flutes.' },
  { id: 'g18', imgNum: 18, category: 'Washint', url: getImgAsset(18, washintImg), title: 'Wind Instrument Ensemble', description: 'Combining Washint melodies with acoustic string accompaniment.' },
  { id: 'g19', imgNum: 19, category: 'Washint', url: getImgAsset(19, washintImg), title: 'Traditional Flute Tuning', description: 'Acoustic hole pitch calibration by master craftsman.' },
  { id: 'g20', imgNum: 20, category: 'Washint', url: getImgAsset(20, washintImg), title: 'Washint Pastoral Songs', description: 'Performing ancient shepherd and pastoral melodies.' },

  // SECTION 5: STUDENTS (IMG21 - IMG25)
  { id: 'g21', imgNum: 21, category: 'Students', url: getImgAsset(21, vocalImg), title: 'Vocal Choir Rehearsal', description: 'Liturgical vocal cohort chanting Saint Yaredic hymn structures.' },
  { id: 'g22', imgNum: 22, category: 'Students', url: getImgAsset(22, alexImg), title: 'Youth Music Cohort', description: 'Young learners discovering traditional Ethiopian music heritage.' },
  { id: 'g23', imgNum: 23, category: 'Students', url: getImgAsset(23, begenatogetherPhoto), title: 'Group Practice Studio', description: 'Collaborative practice session in our soundproof Megenagna branch.' },
  { id: 'g24', imgNum: 24, category: 'Students', url: getImgAsset(24, brukImg), title: 'Online Student Showcase', description: 'Diaspora students participating in live digital feedback sessions.' },
  { id: 'g25', imgNum: 25, category: 'Students', url: getImgAsset(25, hayleImg), title: 'Student Peer Mentorship', description: 'Senior students assisting beginners with string placement.' },

  // SECTION 6: EVENTS (IMG26 - IMG30)
  { id: 'g26', imgNum: 26, category: 'Events', url: getImgAsset(26, keberoImg), title: 'Community Drums Gathering', description: 'Group drumming circles in the beautiful outdoor Lebu courtyard.' },
  { id: 'g27', imgNum: 27, category: 'Events', url: getImgAsset(27, keberoPlayingImg), title: 'Orthodox Candlelit Vigil', description: 'Candlelit worship during an Orthodox holiday celebration with Begena music.' },
  { id: 'g28', imgNum: 28, category: 'Events', url: getImgAsset(28, keberoPlayingImg), title: 'Church Candle Procession', description: 'Faithful moving with candles during an Orthodox holiday evening.' },
  { id: 'g29', imgNum: 29, category: 'Events', url: getImgAsset(29, keberoImg), title: 'Cultural Heritage Workshop', description: 'Annual symposium on traditional instrument preservation.' },
  { id: 'g30', imgNum: 30, category: 'Events', url: getImgAsset(30, keberoPlayingImg), title: 'Open-Air Recital', description: 'Outdoor evening concert bringing community together through song.' },

  // SECTION 7: GRADUATION (IMG31 - IMG35)
  { id: 'g31', imgNum: 31, category: 'Graduation', url: getImgAsset(31, abelBegenaPhoto), title: 'Annual Graduation Concert', description: 'Graduating cohort receiving verified QR certificates of achievement.' },
  { id: 'g32', imgNum: 32, category: 'Graduation', url: getImgAsset(32, abelBegenaPhoto), title: 'Certificate Award Ceremony', description: 'Zemari Deacon Abel Tesfaye presenting master diplomas to scholars.' },
  { id: 'g33', imgNum: 33, category: 'Graduation', url: getImgAsset(33, abelBegenaPhoto), title: 'Graduates Solo Showcase', description: 'Final practical recital performed before church elders and faculty.' },
  { id: 'g34', imgNum: 34, category: 'Graduation', url: getImgAsset(34, abelBegenaPhoto), title: 'Alumni Gathering', description: 'Past graduates returning to share their musical journeys with new cohorts.' },
  { id: 'g35', imgNum: 35, category: 'Graduation', url: getImgAsset(35, abelBegenaPhoto), title: 'Honorary Distinction Awards', description: 'Recognizing outstanding academic and spiritual dedication.' },

  // SECTION 8: TEACHERS (IMG36 - IMG40)
  { id: 'g36', imgNum: 36, category: 'Teachers', url: getImgAsset(36, abelBegenaPhoto), title: 'Zemari Deacon Abel Tesfaye', description: 'Founder and master Begena practitioner guiding faculty.' },
  { id: 'g37', imgNum: 37, category: 'Teachers', url: getImgAsset(37, alexImg), title: 'Teacher Alexander Worku', description: 'Lead Krar & String arrangement specialist conducting class.' },
  { id: 'g38', imgNum: 38, category: 'Teachers', url: getImgAsset(38, hayleImg), title: 'Teacher Hayle Maryam', description: 'Master Masenqo instructor demonstrating pitch slides.' },
  { id: 'g39', imgNum: 39, category: 'Teachers', url: getImgAsset(39, brukImg), title: 'Teacher Bruk Tesfaye', description: 'Washint & Wind ensemble curator in discussion with scholars.' },
  { id: 'g40', imgNum: 40, category: 'Teachers', url: getImgAsset(40, abelBegenaPhoto), title: 'Faculty Masterclass', description: 'Instructors collaborating on new traditional syllabus materials.' }
];

export const TRANSLATIONS = {
  en: {
    brandName: 'ABEL BEGENA SCHOOL',
    tagline: 'Traditional Ethiopian Music School',
    location: 'Addis Ababa, Ethiopia',
    nav: {
      home: 'Home',
      about: 'About',
      aboutAbel: 'About Abel',
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
      students: '1000+ Active Learners',
      branches: '3 Addis Ababa Branches',
      teachers: '15+ Master Instructors',
      programs: '6+ Traditional Instruments'
    },
    intro: {
      title: 'Keeping Ethiopian Traditional Begena Heritage Alive.',
      body1: 'Founded on centuries of acoustic artistry, the Abel Begena School is dedicated to the systematic protection, study, and elevation of Ethiopian sacred and secular Begena traditions.',
      body2: 'We provide structured pathways for beginners and advanced scholars alike, translating the ancient microtones, sacred notation, and deep techniques into clear educational models.',
      cta: 'Learn More Our Story'
    },
    founder: {
      title: 'MEET OUR FOUNDER',
      name: 'Zemari Deacon Abel Tesfaye',
      role: 'Founder of Abel Begena School',
      bio: '“Our mission is not just to teach notes, but to preserve the spiritual posture and centuries of ancestral wisdom vibrating within each gut string.”',
      cta: 'Meet Abel'
    },
    instruments: {
      title: 'Find Your Instrument.',
      subtitle: 'Select from our traditional programs, each led by master practitioners.',
      viewAll: 'View All Courses'
    },
    howItWorksSection: {
      title: 'How Your Journey Unfolds',
      step1Title: 'Choose Your Course',
      step1Desc: 'Select from our traditional string, wind, or percussion programs.',
      step2Title: 'Create Your Account',
      step2Desc: 'Setup your safe student profile to access digital sheets and logs.',
      step3Title: 'Choose Your Learning Mode',
      step3Desc: 'Attend Piazza, Megenagna, Lebu branches or log in from abroad.',
      step4Title: 'Coordinate Schedule',
      step4Desc: 'Select morning, evening, or weekend cohorts that suit your lifestyle.',
      step5Title: 'Begin Your Journey',
      step5Desc: 'Uncover the sound of ancestors and graduate with standard certificates.'
    }
  },
  am: {
    brandName: 'አቤል በገና ትምህርት ቤት',
    tagline: 'የኢትዮጵያ ታላቅ የበገና ትምህርት ቤት',
    location: 'አዲስ አበባ ፣ ኢትዮጵያ',
    nav: {
      home: 'ዋና ገጽ',
      about: 'ስለ እኛ',
      aboutAbel: 'ስለ አቤል',
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
      students: 'ከ 1000+ በላይ ተማሪዎች',
      branches: '3 የአዲስ አበባ ቅርንጫፎች',
      teachers: '15+ አንጋፋ አስተማሪዎች',
      programs: '6+ የዜማ መሳሪያዎች ስልጠና'
    },
    intro: {
      title: 'አባቶቻችን ያስረከቡንን የኢትዮጵያን የበገና ቅርስ ከ ትውልድ ወደ ትውልድ ማስተላለፍ።',
      body1: 'ለዘመናት በቆዩ የበገና ጥበቦች ላይ የተመሰረተው የአቤል በገና ትምህርት ቤት የኢትዮጵያን መንፈሳዊ የዜማ እሴቶችን በዘመናዊ የጥናት መንገድ ለማስተማር የተቋቋመ ነው።',
      body2: 'ለጀማሪዎችም ሆነ ለላቁ ተማሪዎች በጥንቃቄ የተዘጋጁ መማሪያ መንገዶችን በማቅረብ ጥንታዊ የዜማ ስልቶችን እና የ ቅዱስ ያሬድ የዜማ ምልክቶችን በቀላሉ ያስተምራል።',
      cta: 'ስለ እኛ ታሪክ የበለጠ ይረዱ'
    },
    founder: {
      title: 'መስራቹን ያግኙ',
      name: 'ሊቀ መዘምራን ዲ/ን አቤል ተስፋዬ',
      role: 'የአቤል በገና ትምህርት ቤት መስራች',
      bio: '“ተልዕኳችን ዜማን ማስተማር ብቻ ሳይሆን፣ በእያንዳንዱ የአውታር ክር ውስጥ የሚርገበገበውን መንፈሳዊ አቋምና የዘመናት የአባቶቻችንን ጥበብ መጠበቅ ጭምር ነው።”',
      cta: 'አቤልን ያግኙ'
    },
    instruments: {
      title: 'የሚፈልጉትን መሣሪያ ይምረጡ።',
      subtitle: 'በአንጋፋ ባለሙያዎች ከሚመሩት ጥንታዊ የቤተክርስቲያናችን የዜማ እቃዎች መካከል ይምረጡ።',
      viewAll: 'ሁሉንም ትምህርቶች ይመልከቱ'
    },
    howItWorksSection: {
      title: 'የመማር ጉዞዎ እንዴት ይከናወናል',
      step1Title: 'ትምህርቱን ይምረጡ',
      step1Desc: 'ከበገና፣ ክራር፣ ማሲንቆ፣ ዋሽንት ወይም ከበሮ መርሃ ግብሮች ይምረጡ።',
      step2Title: 'መለያዎን ይፍጠሩ',
      step2Desc: 'የትምህርት ቁሳቁሶችን ለማግኘት የግል ተማሪ መለያዎን ያዘጋጁ።',
      step3Title: 'የመማሪያ መንገድ ይምረጡ',
      step3Desc: 'በፒያሳ፣ መገናኛ ወይም ለቡ ቅርንጫፎች በአካል ወይም በኢንተርኔት ይማሩ።',
      step4Title: 'ሰዓትዎን ያስተካክሉ',
      step4Desc: 'ከእርስዎ የዕለት ተዕለት ኑሮ ጋር የሚስማሙ የመማሪያ ሰዓቶችን ይምረጡ።',
      step5Title: 'ጉዞዎን ይጀምሩ',
      step5Desc: 'የአባቶችን ድምጽ ያግኙ እና ህጋዊ ምስክር ወረቀት ይቀበሉ።'
    }
  }
};

