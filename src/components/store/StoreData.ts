import {
  StoreProductExtended,
  StoreOrder,
  StoreReturnRequest,
  StoreCoupon,
  StoreBundle,
  SupplierRecord,
  ProductReview,
  ProductQuestion
} from '../../types';

const STORE_IMAGE_1 = new URL('../../assets/images/store (1).jpg', import.meta.url).href;
const STORE_IMAGE_2 = new URL('../../assets/images/store (2).jpg', import.meta.url).href;
const STORE_IMAGE_3 = new URL('../../assets/images/store (3).jpg', import.meta.url).href;
const STORE_IMAGE_4 = new URL('../../assets/images/store (4).jpg', import.meta.url).href;
const STORE_IMAGE_5 = new URL('../../assets/images/store (5).jpg', import.meta.url).href;

export const SAMPLE_STORE_PRODUCTS: StoreProductExtended[] = [
  {
    id: 'prod-beg-1',
    name: 'Handcrafted 10-String Sacred Begena Instrument',
    category: 'Begena',
    instrumentType: 'Begena',
    brand: 'Abel Begena Master Workshop',
    description: 'Masterfully carved traditional 10-string Begena (Harp of David) crafted from aged Wanza hardwood with an authentic parchment soundboard skin and hand-twisted ox-gut strings. Produces deep, resonant acoustic vibrations suitable for liturgical mezmur and spiritual meditation.',
    priceETB: 18500,
    costETB: 12000,
    sku: 'AB-BEG-MST-01',
    barcode: '600101928301',
    condition: 'New',
    stockQuantity: 7,
    branchStock: [
      { branchId: 'b-piazza', branchName: 'Piazza Branch', quantity: 3 },
      { branchId: 'b-megenagna', branchName: 'Megenagna Branch', quantity: 2 },
      { branchId: 'b-lebu', branchName: 'Lebu Branch', quantity: 1 },
      { branchId: 'b-warehouse', branchName: 'Online Warehouse', quantity: 1 }
    ],
    images: [
      STORE_IMAGE_1,
      STORE_IMAGE_2,
      STORE_IMAGE_3
    ],
    variants: [
      { id: 'v-beg-1', sku: 'AB-BEG-MST-01-FULL', variantName: 'Full Size (110cm) - Aged Wanza Wood', priceETB: 18500, stockQuantity: 5 },
      { id: 'v-beg-2', sku: 'AB-BEG-MST-01-COMP', variantName: 'Compact Travel Size (95cm)', priceETB: 16500, stockQuantity: 2 }
    ],
    specifications: {
      'Wood Material': 'Aged Wanza (Cordia africana)',
      'Soundboard': 'Natural Parchment Leather Membrane',
      'String Count': '10 Traditional Ox-gut Strings',
      'Pillars & Crossbar': 'Solid Hand-Polished Hardwood',
      'Tuning Pegs': 'Traditional Friction Pegs with Tuning Key',
      'Origin': 'Addis Ababa Workshop, Ethiopia'
    },
    status: 'Active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    recommendedForCourses: ['Begena - Level 1', 'Begena - Advanced Level'],
    rating: 4.9,
    reviewCount: 18
  },
  {
    id: 'prod-beg-str-1',
    name: 'Master Ox-Gut String Set for 10-String Begena',
    category: 'Strings',
    instrumentType: 'Begena',
    brand: 'Abel Begena Genuine Strings',
    description: 'Authentic 10-piece ox-gut string set prepared following centuries-old Ethiopian traditional curing techniques. Formulated for warm, low-frequency resonance and exceptional tensile strength.',
    priceETB: 450,
    costETB: 180,
    sku: 'AB-STR-BEG-10',
    barcode: '600101928302',
    condition: 'New',
    stockQuantity: 45,
    branchStock: [
      { branchId: 'b-piazza', branchName: 'Piazza Branch', quantity: 20 },
      { branchId: 'b-megenagna', branchName: 'Megenagna Branch', quantity: 15 },
      { branchId: 'b-lebu', branchName: 'Lebu Branch', quantity: 10 }
    ],
    images: [
      STORE_IMAGE_2,
      STORE_IMAGE_4
    ],
    variants: [
      { id: 'v-str-1', sku: 'AB-STR-BEG-10-MED', variantName: 'Medium Gauge (Standard Tuning)', priceETB: 450, stockQuantity: 30 },
      { id: 'v-str-2', sku: 'AB-STR-BEG-10-HEAVY', variantName: 'Heavy Gauge (Deep Resonance)', priceETB: 480, stockQuantity: 15 }
    ],
    specifications: {
      'Material': '100% Cured Ox-Gut',
      'Quantity': '10 Individual Strings',
      'Compatibility': 'All standard 10-string Begena harps',
      'Packaging': 'Moisture-sealed protective pouch'
    },
    status: 'Active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    recommendedForCourses: ['Begena - Level 1', 'Begena - Level 2', 'Begena - Advanced Level'],
    rating: 4.8,
    reviewCount: 32
  },
  {
    id: 'prod-krr-1',
    name: 'Acoustic 6-String Traditional Krar Instrument',
    category: 'Krar',
    instrumentType: 'Krar',
    brand: 'Abel Begena Crafts',
    description: 'Elegant 6-string acoustic Kirar/Krar crafted with seasoned wood bowl, goat-hide resonator soundboard, and high-tension nylon strings. Perfect for both traditional pentatonic mezmur and modern Ethiopian melody playing.',
    priceETB: 6200,
    costETB: 3800,
    sku: 'AB-KRR-STD-06',
    barcode: '600101928303',
    condition: 'New',
    stockQuantity: 12,
    branchStock: [
      { branchId: 'b-piazza', branchName: 'Piazza Branch', quantity: 5 },
      { branchId: 'b-megenagna', branchName: 'Megenagna Branch', quantity: 4 },
      { branchId: 'b-lebu', branchName: 'Lebu Branch', quantity: 3 }
    ],
    images: [
      STORE_IMAGE_3,
      STORE_IMAGE_1
    ],
    variants: [
      { id: 'v-krr-1', sku: 'AB-KRR-STD-06-NYLON', variantName: 'Acoustic Nylon Strings', priceETB: 6200, stockQuantity: 8 },
      { id: 'v-krr-2', sku: 'AB-KRR-STD-06-ELEC', variantName: 'Electric Pickup Integrated Krar', priceETB: 8900, stockQuantity: 4 }
    ],
    specifications: {
      'Bowl Material': 'Seasoned Kerero Hardwood Bowl',
      'Soundboard': 'Natural Cured Goat Skin',
      'String Count': '6 High-Tension Strings',
      'Dimensions': '65cm x 40cm x 15cm',
      'Origin': 'Addis Ababa, Ethiopia'
    },
    status: 'Active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    recommendedForCourses: ['Kirar - Level 1', 'Kirar - Intermediate Level'],
    rating: 4.7,
    reviewCount: 14
  },
  {
    id: 'prod-krr-str-1',
    name: 'High-Tension Nylon String Set for 6-String Krar',
    category: 'Strings',
    instrumentType: 'Krar',
    brand: 'Abel Begena Genuine Strings',
    description: 'Precision-manufactured high-tension nylon strings designed specifically for 6-string acoustic and electric Krars.',
    priceETB: 280,
    costETB: 110,
    sku: 'AB-STR-KRR-06',
    barcode: '600101928304',
    condition: 'New',
    stockQuantity: 60,
    branchStock: [
      { branchId: 'b-piazza', branchName: 'Piazza Branch', quantity: 25 },
      { branchId: 'b-megenagna', branchName: 'Megenagna Branch', quantity: 20 },
      { branchId: 'b-lebu', branchName: 'Lebu Branch', quantity: 15 }
    ],
    images: [
      STORE_IMAGE_4
    ],
    specifications: {
      'Material': 'High-Density Clear Nylon',
      'Quantity': '6 Strings per Pack',
      'Tuning': 'Traditional Ethiopian Tizita / Bati / Anchihoye'
    },
    status: 'Active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    recommendedForCourses: ['Kirar - Level 1', 'Kirar - Intermediate Level'],
    rating: 4.9,
    reviewCount: 22
  },
  {
    id: 'prod-acc-bag-1',
    name: 'Heavy-Duty Padded Begena Gig Bag Carrying Case',
    category: 'Accessories',
    instrumentType: 'Begena',
    brand: 'Abel Begena Accessories',
    description: 'Water-resistant nylon gig bag with 15mm high-density foam padding, dual shoulder straps, reinforced handle, and large zippered pouch for mezmur scorebooks and spare strings.',
    priceETB: 1850,
    costETB: 950,
    sku: 'AB-ACC-BAG-BEG',
    barcode: '600101928305',
    condition: 'New',
    stockQuantity: 18,
    branchStock: [
      { branchId: 'b-piazza', branchName: 'Piazza Branch', quantity: 8 },
      { branchId: 'b-megenagna', branchName: 'Megenagna Branch', quantity: 6 },
      { branchId: 'b-lebu', branchName: 'Lebu Branch', quantity: 4 }
    ],
    images: [
      STORE_IMAGE_5
    ],
    specifications: {
      'Exterior Material': '600D Weatherproof Nylon',
      'Padding': '15mm High-Density EPE Foam',
      'Carrying Options': 'Backpack Straps & Side Handle',
      'Pocket': 'Fits A4 Scorebooks & Accessories'
    },
    status: 'Active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    recommendedForCourses: ['Begena - Level 1', 'Begena - Advanced Level'],
    rating: 4.6,
    reviewCount: 9
  },
  {
    id: 'prod-bk-1',
    name: 'Comprehensive Begena Notation & Mezmur Study Guide Book',
    category: 'Learning Materials',
    instrumentType: 'Begena',
    brand: 'Abel Begena Academy Press',
    description: 'The definitive textbook authored by Founder Abel Begena covering traditional notation system, sacred scales (Tizita, Bati, Ambassel, Anchihoye), tuning theory, and 45 transcribed classic Ethiopian Orthodox mezmurs.',
    priceETB: 750,
    costETB: 300,
    sku: 'AB-PUB-BK-01',
    barcode: '600101928306',
    condition: 'New',
    stockQuantity: 35,
    branchStock: [
      { branchId: 'b-piazza', branchName: 'Piazza Branch', quantity: 15 },
      { branchId: 'b-megenagna', branchName: 'Megenagna Branch', quantity: 12 },
      { branchId: 'b-lebu', branchName: 'Lebu Branch', quantity: 8 }
    ],
    images: [
      STORE_IMAGE_1
    ],
    specifications: {
      'Pages': '180 Pages (Amharic & English Annotations)',
      'Publisher': 'Abel Begena School Press',
      'Format': 'Hardcover Deluxe Edition'
    },
    status: 'Active',
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    recommendedForCourses: ['Begena - Level 1', 'Begena - Level 2'],
    rating: 5.0,
    reviewCount: 41
  },
  {
    id: 'prod-mas-1',
    name: 'Handmade Single-String Masenqo Instrument with Bow',
    category: 'Masenqo',
    instrumentType: 'Masenqo',
    brand: 'Abel Begena Artisans',
    description: 'Authentic Ethiopian single-string bowed lute with square diamond wooden resonator box, horsehair string, and ergonomic curved horsehair bow.',
    priceETB: 5400,
    costETB: 3200,
    sku: 'AB-MAS-STD-01',
    barcode: '600101928307',
    condition: 'New',
    stockQuantity: 6,
    branchStock: [
      { branchId: 'b-piazza', branchName: 'Piazza Branch', quantity: 2 },
      { branchId: 'b-megenagna', branchName: 'Megenagna Branch', quantity: 2 },
      { branchId: 'b-lebu', branchName: 'Lebu Branch', quantity: 2 }
    ],
    images: [
      STORE_IMAGE_3
    ],
    specifications: {
      'Resonator Box': 'Goat Skin Membrane over Wooden Frame',
      'String': 'Natural Black Horsehair Bundle',
      'Bow Included': 'Hand-carved Wooden Bow with Horsehair'
    },
    status: 'Active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    recommendedForCourses: ['Masenqo - Level 1'],
    rating: 4.8,
    reviewCount: 6
  }
];

export const SAMPLE_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-beg-1',
    userName: 'Anonymous Alumni',
    userRole: 'School Graduate',
    rating: 5,
    comment: 'The acoustic resonance of this Wanza wood Begena is extraordinary. The ox-gut strings came properly tuned and calibrated.',
    date: '2026-07-10',
    isVerifiedPurchase: true,
    status: 'Approved'
  }
];

export const SAMPLE_QUESTIONS: ProductQuestion[] = [
  {
    id: 'q-1',
    productId: 'prod-beg-1',
    askedBy: 'Mewael Girma',
    question: 'Is this 10-string Begena suitable for a complete beginner in Level 1?',
    date: '2026-07-02',
    answer: 'Yes! This instrument is specifically tuned and set up by our master instructors for students entering Begena Level 1.',
    answeredBy: 'Abel Begena (Founder)',
    answeredDate: '2026-07-03'
  }
];

export const SAMPLE_STORE_ORDERS: StoreOrder[] = [];

export const SAMPLE_COUPONS: StoreCoupon[] = [
  {
    id: 'c-101',
    code: 'BEGENA10',
    discountType: 'Percentage',
    discountValue: 10,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 100,
    timesUsed: 14,
    minOrderETB: 500,
    status: 'Active'
  },
  {
    id: 'c-102',
    code: 'WELCOME500',
    discountType: 'Fixed ETB',
    discountValue: 500,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 50,
    timesUsed: 9,
    minOrderETB: 5000,
    status: 'Active'
  }
];

export const SAMPLE_BUNDLES: StoreBundle[] = [
  {
    id: 'bun-1',
    title: 'Begena Master Starter Bundle',
    description: 'Includes Handcrafted 10-String Begena, Heavy-Duty Gig Bag, Extra Ox-Gut String Set, and Official Textbook.',
    includedProducts: [
      { productId: 'prod-beg-1', productName: 'Handcrafted 10-String Begena', quantity: 1 },
      { productId: 'prod-beg-str-1', productName: 'Master Ox-Gut String Set', quantity: 1 },
      { productId: 'prod-acc-bag-1', productName: 'Begena Gig Bag', quantity: 1 },
      { productId: 'prod-bk-1', productName: 'Begena Notation Textbook', quantity: 1 }
    ],
    individualTotalETB: 21550,
    bundlePriceETB: 18900,
    savingsETB: 2650,
    imageUrl: STORE_IMAGE_5,
    status: 'Active'
  }
];

export const SAMPLE_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'sup-1',
    supplierName: 'Debre Libanos Traditional Instrument Guild',
    contactPerson: 'Ato Worku Teklu',
    phone: '+251 911 889 900',
    email: 'worku@debrelibanosguild.et',
    address: 'Debre Libanos Artisan District',
    suppliedCategories: ['Begena', 'Krar', 'Masenqo'],
    status: 'Active'
  },
  {
    id: 'sup-2',
    supplierName: 'Addis Gut & Nylon Strings Factory',
    contactPerson: 'W/ro Roman Girmay',
    phone: '+251 912 776 655',
    email: 'roman@addisstrings.com',
    address: 'Bole Sub-City, Addis Ababa',
    suppliedCategories: ['Strings', 'Accessories'],
    status: 'Active'
  }
];

export const SAMPLE_RETURNS: StoreReturnRequest[] = [
  {
    id: 'ret-101',
    orderId: 'ord-100',
    orderNumber: 'ABS-2026-000099',
    customerName: 'Selam Kebede',
    customerPhone: '+251 911 554 433',
    productId: 'prod-beg-str-1',
    productName: 'Master Ox-Gut String Set',
    reason: 'Wrong String Gauge Ordered',
    description: 'Ordered Medium Gauge by mistake instead of Heavy Gauge.',
    photoUrls: [STORE_IMAGE_4],
    requestDate: '2026-07-18',
    status: 'Requested',
    refundType: 'Store Credit'
  }
];

