// Demo data only. Replace with real catalog data via the admin panel or the backend.
// Every record here matches the entity shapes in README.md ("Data architecture").
const VIEWS = ['front', 'side', 'lifestyle', 'detail', 'grain', 'dims'];
const imgs = () => VIEWS.map((view) => ({ kind: 'art', view }));
const D0 = '2026-08-01T09:00:00.000Z';

export const categories = [
  { id: 'cat_living', name: 'Living Room', slug: 'living-room', status: 'active', image: { kind: 'art', view: 'lifestyle', shape: 'sofa3' },
    tagline: 'Furniture that makes your living space feel like home.',
    description: 'Sofas, coffee tables, TV units and lounge chairs in solid teak, made for evenings with family and conversations that run long.',
    subcategories: ['Sofas', 'Coffee Tables', 'TV Units', 'Lounge Chairs'] },
  { id: 'cat_bed', name: 'Bedroom', slug: 'bedroom', status: 'active', image: { kind: 'art', view: 'lifestyle', shape: 'bed' },
    tagline: 'Rest on wood that ages beautifully.',
    description: 'Beds, bedside tables, wardrobes and dressing tables with warm teak grain and clean, calm lines.',
    subcategories: ['Beds', 'Bedside Tables', 'Wardrobes', 'Dressing Tables'] },
  { id: 'cat_dining', name: 'Dining', slug: 'dining', status: 'active', image: { kind: 'art', view: 'lifestyle', shape: 'dtable' },
    tagline: 'A table worth gathering around.',
    description: 'Dining tables, chairs, benches and cabinets built for family meals and festival tables.',
    subcategories: ['Dining Tables', 'Dining Chairs', 'Benches', 'Cabinets'] },
  { id: 'cat_office', name: 'Office', slug: 'office', status: 'active', image: { kind: 'art', view: 'lifestyle', shape: 'desk' },
    tagline: 'Work in a room that feels considered.',
    description: 'Desks, chairs, bookshelves and storage that bring the calm of natural wood to your workday.',
    subcategories: ['Office Tables', 'Chairs', 'Bookshelves', 'Storage'] },
  { id: 'cat_decor', name: 'Decor', slug: 'decor', status: 'active', image: { kind: 'art', view: 'lifestyle', shape: 'lamp' },
    tagline: 'Small pieces. Real character.',
    description: 'Wooden art, side tables, lamps and accessories that finish a room.',
    subcategories: ['Wooden Art', 'Side Tables', 'Lamps', 'Accessories'] },
];

const base = (o) => ({
  material: 'Teak Wood', finish: 'Natural Teak', color: 'Natural Teak', minStock: 3, reserved: 0,
  featured: false, newArrival: false, bestSeller: false, status: 'published', images: imgs(),
  createdAt: D0, updatedAt: D0, ...o,
});
const dim = (width, depth, height) => ({ width, depth, height, unit: 'cm' });

export const products = [
  // Living room
  base({ id: 'p_lounge', name: 'Heritage Teak Lounge Chair', slug: 'heritage-teak-lounge-chair', sku: 'HGF-LR-001', categoryId: 'cat_living', subcategory: 'Lounge Chairs', shape: 'lounge',
    price: 24999, originalPrice: 29999, dimensions: dim(76, 82, 84), weight: '14 kg', stock: 12, featured: true, bestSeller: true, color: 'Natural Teak', style: 'Contemporary Indian',
    shortDescription: 'A deep-seat lounge chair with a solid teak frame and sloped arms.',
    description: 'The Heritage Lounge Chair pairs a solid teak frame with a deep, supportive seat. The arms slope gently so a book, a cup of filter coffee or a slow afternoon rests easily. Joinery is visible by design, so the grain and the craft stay in view.' }),
  base({ id: 'p_sofa3', name: 'Grove 3-Seater Teak Sofa', slug: 'grove-3-seater-teak-sofa', sku: 'HGF-LR-002', categoryId: 'cat_living', subcategory: 'Sofas', shape: 'sofa3',
    price: 68999, originalPrice: 79999, dimensions: dim(210, 90, 82), weight: '62 kg', stock: 6, featured: true, bestSeller: true, style: 'Contemporary Indian', finish: 'Natural Teak, matte',
    shortDescription: 'Solid teak frame, deep cushions and open wooden arms.',
    description: 'A three-seater built around a solid teak frame with open wooden arms. The seat cushions are generous and the back sits at a relaxed angle, so it works for both quiet evenings and full family gatherings.' }),
  base({ id: 'p_sofa2', name: 'Malabar 2-Seater Teak Sofa', slug: 'malabar-2-seater-teak-sofa', sku: 'HGF-LR-003', categoryId: 'cat_living', subcategory: 'Sofas', shape: 'sofa2',
    price: 46999, originalPrice: 52999, dimensions: dim(155, 85, 80), weight: '44 kg', stock: 9, newArrival: true, color: 'Honey Teak',
    shortDescription: 'A compact sofa for smaller living rooms and reading corners.',
    description: 'A compact two-seater that keeps the character of a full sofa in a smaller footprint. Solid teak arms and legs frame a soft, supportive seat.' }),
  base({ id: 'p_coffee', name: 'Kaveri Teak Coffee Table', slug: 'kaveri-teak-coffee-table', sku: 'HGF-LR-004', categoryId: 'cat_living', subcategory: 'Coffee Tables', shape: 'coffee',
    price: 15999, originalPrice: 18999, dimensions: dim(110, 60, 42), weight: '22 kg', stock: 14, featured: true, bestSeller: true,
    shortDescription: 'A low solid-top table with tapered legs and a lower shelf.',
    description: 'A generous solid teak top on tapered legs, with a lower shelf for books and magazines. The edge is softly eased so it is comfortable to live with.' }),
  base({ id: 'p_nested', name: 'Nilgiri Nesting Tables (Set of 2)', slug: 'nilgiri-nesting-tables-set-of-2', sku: 'HGF-LR-005', categoryId: 'cat_living', subcategory: 'Coffee Tables', shape: 'nested',
    price: 12499, originalPrice: 0, dimensions: dim(60, 40, 45), weight: '12 kg', stock: 20, newArrival: true,
    shortDescription: 'Two tables that stack together or spread out when guests arrive.',
    description: 'Two matching tables that tuck into one another to save space and separate when you need surface area.' }),
  base({ id: 'p_tv', name: 'Podhigai Teak TV Unit', slug: 'podhigai-teak-tv-unit', sku: 'HGF-LR-006', categoryId: 'cat_living', subcategory: 'TV Units', shape: 'tv',
    price: 32999, originalPrice: 38999, dimensions: dim(180, 42, 55), weight: '48 kg', stock: 5, featured: true, color: 'Rich Teak',
    shortDescription: 'A low media unit with closed storage and open shelving.',
    description: 'A long, low media console with two closed cabinets and an open centre bay for devices. Cable openings are cut into the back panel.' }),
  base({ id: 'p_arm', name: 'Arcadia Teak Armchair', slug: 'arcadia-teak-armchair', sku: 'HGF-LR-007', categoryId: 'cat_living', subcategory: 'Lounge Chairs', shape: 'armchair',
    price: 19999, originalPrice: 22999, dimensions: dim(68, 72, 80), weight: '11 kg', stock: 2, minStock: 3,
    shortDescription: 'An upright armchair with a curved teak back.',
    description: 'An upright armchair with a gently curved back rail and a cushioned seat. It suits reading corners and bedroom seating.' }),
  // Bedroom
  base({ id: 'p_bedk', name: 'Chettinad Teak King Bed', slug: 'chettinad-teak-king-bed', sku: 'HGF-BR-001', categoryId: 'cat_bed', subcategory: 'Beds', shape: 'bed',
    price: 84999, originalPrice: 96999, dimensions: dim(190, 215, 110), weight: '96 kg', stock: 4, featured: true, bestSeller: true, color: 'Rich Teak',
    shortDescription: 'A king bed with a tall panelled headboard in solid teak.',
    description: 'A king-size bed with a tall, panelled headboard that lets the grain lead the room. The frame is solid teak, with slats to support your mattress (sold separately).' }),
  base({ id: 'p_bedq', name: 'Aria Teak Queen Bed', slug: 'aria-teak-queen-bed', sku: 'HGF-BR-002', categoryId: 'cat_bed', subcategory: 'Beds', shape: 'bed',
    price: 61999, originalPrice: 69999, dimensions: dim(165, 210, 100), weight: '78 kg', stock: 7, newArrival: true,
    shortDescription: 'A queen bed with a slim headboard and clean lines.',
    description: 'A queen bed that keeps things simple: a slim, slightly raked headboard, a solid frame and clean lines. Mattress sold separately.' }),
  base({ id: 'p_bedside', name: 'Vanam Bedside Table', slug: 'vanam-bedside-table', sku: 'HGF-BR-003', categoryId: 'cat_bed', subcategory: 'Bedside Tables', shape: 'bedside',
    price: 8999, originalPrice: 10499, dimensions: dim(50, 40, 55), weight: '9 kg', stock: 18, bestSeller: true,
    shortDescription: 'One drawer, one open shelf, a solid teak top.',
    description: 'A bedside table with a single drawer and an open shelf below. The top is solid teak and sits at a comfortable height for most beds.' }),
  base({ id: 'p_ward', name: 'Teak 3-Door Wardrobe', slug: 'teak-3-door-wardrobe', sku: 'HGF-BR-004', categoryId: 'cat_bed', subcategory: 'Wardrobes', shape: 'wardrobe',
    price: 74999, originalPrice: 84999, dimensions: dim(180, 55, 210), weight: '120 kg', stock: 3, minStock: 2,
    shortDescription: 'Three panelled doors, hanging rail and internal shelving.',
    description: 'A full-height wardrobe with three panelled doors. Inside: a hanging rail, fixed shelves and a drawer bank.' }),
  base({ id: 'p_dress', name: 'Mylapore Dressing Table', slug: 'mylapore-dressing-table', sku: 'HGF-BR-005', categoryId: 'cat_bed', subcategory: 'Dressing Tables', shape: 'dresser',
    price: 27999, originalPrice: 31999, dimensions: dim(110, 45, 150), weight: '38 kg', stock: 6,
    shortDescription: 'A dressing table with a framed mirror and two drawers.',
    description: 'A dressing table with a framed mirror, two drawers and open storage for everyday essentials.' }),
  // Dining
  base({ id: 'p_dtable', name: 'Thamirabarani 6-Seater Dining Table', slug: 'thamirabarani-6-seater-dining-table', sku: 'HGF-DN-001', categoryId: 'cat_dining', subcategory: 'Dining Tables', shape: 'dtable',
    price: 58999, originalPrice: 66999, dimensions: dim(180, 90, 76), weight: '68 kg', stock: 5, featured: true, bestSeller: true,
    shortDescription: 'A solid teak top seating six, on sturdy trestle legs.',
    description: 'A solid teak top on trestle-style legs, sized to seat six with elbow room. Built for daily meals and long festival tables.' }),
  base({ id: 'p_dchair', name: 'Palar Dining Chair (Set of 2)', slug: 'palar-dining-chair-set-of-2', sku: 'HGF-DN-002', categoryId: 'cat_dining', subcategory: 'Dining Chairs', shape: 'dchair',
    price: 13999, originalPrice: 15999, dimensions: dim(45, 50, 88), weight: '10 kg', stock: 24, featured: true, color: 'Honey Teak',
    shortDescription: 'Slatted-back chairs with a contoured teak seat. Sold as a pair.',
    description: 'Slatted-back dining chairs with a contoured seat. Sold as a set of two.' }),
  base({ id: 'p_bench', name: 'Courtyard Teak Bench', slug: 'courtyard-teak-bench', sku: 'HGF-DN-003', categoryId: 'cat_dining', subcategory: 'Benches', shape: 'bench',
    price: 11499, originalPrice: 0, dimensions: dim(120, 38, 45), weight: '15 kg', stock: 0,
    shortDescription: 'A slim bench for dining tables, entryways or bed ends.',
    description: 'A slim solid teak bench that works at a dining table, in an entryway or at the foot of a bed.' }),
  base({ id: 'p_crock', name: 'Vaigai Crockery Cabinet', slug: 'vaigai-crockery-cabinet', sku: 'HGF-DN-004', categoryId: 'cat_dining', subcategory: 'Cabinets', shape: 'cabinet',
    price: 42999, originalPrice: 48999, dimensions: dim(120, 40, 180), weight: '75 kg', stock: 4, newArrival: true,
    shortDescription: 'Glass-fronted display above, closed storage below.',
    description: 'A crockery cabinet with a glass-fronted display upper and closed storage below.' }),
  // Office
  base({ id: 'p_desk', name: 'Studio Teak Work Desk', slug: 'studio-teak-work-desk', sku: 'HGF-OF-001', categoryId: 'cat_office', subcategory: 'Office Tables', shape: 'desk',
    price: 21999, originalPrice: 25999, dimensions: dim(140, 65, 75), weight: '30 kg', stock: 11, featured: true, bestSeller: true,
    shortDescription: 'A clean work desk with a single drawer and cable slot.',
    description: 'A clean, uncluttered work desk with a wide solid top, one drawer and a cable slot for a laptop or monitor.' }),
  base({ id: 'p_exec', name: 'Executive Teak Desk', slug: 'executive-teak-desk', sku: 'HGF-OF-002', categoryId: 'cat_office', subcategory: 'Office Tables', shape: 'desk',
    price: 38999, originalPrice: 44999, dimensions: dim(180, 80, 76), weight: '70 kg', stock: 3, minStock: 2, color: 'Rich Teak',
    shortDescription: 'A broad desk with pedestal drawers on both sides.',
    description: 'A broad executive desk with pedestal drawers on both sides and a large working surface.' }),
  base({ id: 'p_ochair', name: 'Ergo Teak-Frame Office Chair', slug: 'ergo-teak-frame-office-chair', sku: 'HGF-OF-003', categoryId: 'cat_office', subcategory: 'Chairs', shape: 'ochair',
    price: 14999, originalPrice: 0, dimensions: dim(60, 60, 95), weight: '9 kg', stock: 15, newArrival: true, material: 'Teak Wood, Fabric',
    shortDescription: 'A padded chair on a teak frame, made for long hours.',
    description: 'A padded office chair with a teak frame and cushioned seat and back.' }),
  base({ id: 'p_shelf', name: 'Scholar Teak Bookshelf', slug: 'scholar-teak-bookshelf', sku: 'HGF-OF-004', categoryId: 'cat_office', subcategory: 'Bookshelves', shape: 'bookshelf',
    price: 26999, originalPrice: 30999, dimensions: dim(90, 32, 190), weight: '46 kg', stock: 8, featured: true,
    shortDescription: 'Five open shelves with a solid back panel.',
    description: 'A tall bookshelf with five open shelves and a solid back panel. Shelf positions are fixed for strength.' }),
  base({ id: 'p_storage', name: 'Ledger Storage Cabinet', slug: 'ledger-storage-cabinet', sku: 'HGF-OF-005', categoryId: 'cat_office', subcategory: 'Storage', shape: 'storage',
    price: 18999, originalPrice: 21999, dimensions: dim(90, 40, 100), weight: '34 kg', stock: 10,
    shortDescription: 'A two-door cabinet for files, stationery and supplies.',
    description: 'A two-door storage cabinet with adjustable interior shelves, sized for files and stationery.' }),
  // Decor
  base({ id: 'p_art', name: 'Grain Wall Panel', slug: 'grain-wall-panel', sku: 'HGF-DC-001', categoryId: 'cat_decor', subcategory: 'Wooden Art', shape: 'art',
    price: 7999, originalPrice: 9499, dimensions: dim(90, 3, 60), weight: '5 kg', stock: 16, newArrival: true,
    shortDescription: 'A wall panel that shows off the teak grain.',
    description: 'A wall panel of joined teak strips, finished to bring out the grain.' }),
  base({ id: 'p_side', name: 'Trivia Teak Side Table', slug: 'trivia-teak-side-table', sku: 'HGF-DC-002', categoryId: 'cat_decor', subcategory: 'Side Tables', shape: 'side',
    price: 6999, originalPrice: 7999, dimensions: dim(45, 45, 50), weight: '6 kg', stock: 30, bestSeller: true,
    shortDescription: 'A small round-top table for lamps, books and tea.',
    description: 'A round-top side table on three splayed legs. It sits beside a sofa or bed without crowding it.' }),
  base({ id: 'p_lamp', name: 'Ashoka Teak Table Lamp', slug: 'ashoka-teak-table-lamp', sku: 'HGF-DC-003', categoryId: 'cat_decor', subcategory: 'Lamps', shape: 'lamp',
    price: 4999, originalPrice: 0, dimensions: dim(28, 28, 52), weight: '2 kg', stock: 22, material: 'Teak Wood, Fabric shade',
    shortDescription: 'A turned teak base with a linen-look shade.',
    description: 'A table lamp with a turned teak base and a fabric shade that softens the light.' }),
  base({ id: 'p_tray', name: 'Serving Tray Set', slug: 'serving-tray-set', sku: 'HGF-DC-004', categoryId: 'cat_decor', subcategory: 'Accessories', shape: 'tray',
    price: 2499, originalPrice: 2999, dimensions: dim(45, 30, 5), weight: '1.2 kg', stock: 40,
    shortDescription: 'Two teak trays with cut-out handles.',
    description: 'Two nesting teak trays with cut-out handles, for serving and for styling a table.' }),
];

export const collections = [
  { id: 'col_signature', slug: 'signature', name: 'Signature Teak Collection', productIds: ['p_sofa3', 'p_lounge', 'p_dtable', 'p_bedk', 'p_coffee', 'p_desk', 'p_shelf', 'p_tv'], status: 'active' },
  { id: 'col_premium', slug: 'premium', name: 'Premium Collection', productIds: ['p_bedk', 'p_ward', 'p_sofa3', 'p_dtable', 'p_crock', 'p_exec', 'p_bedq'], status: 'active' },
];

export const offers = [
  { id: 'off_festive', name: 'Festive Living Room Offer', description: '10% off every living room piece.', type: 'category', discountKind: 'percent', discount: 10, categoryId: 'cat_living', products: [], startDate: '2026-09-15', endDate: '2026-10-31', status: 'active', placement: 'limited' },
  { id: 'off_new', name: 'New Collection Launch', description: '5% off our newest pieces.', type: 'product', discountKind: 'percent', discount: 5, products: ['p_sofa2', 'p_bedq', 'p_crock', 'p_art', 'p_ochair', 'p_nested'], startDate: '2026-09-01', endDate: '2026-12-31', status: 'active', placement: 'new' },
  { id: 'off_clear', name: 'Season Clearance', description: '₹1,000 off selected pieces while stock lasts.', type: 'product', discountKind: 'flat', discount: 1000, products: ['p_arm', 'p_dress', 'p_storage', 'p_side'], startDate: '', endDate: '', status: 'active', placement: 'clearance' },
  { id: 'off_bundle', name: 'Dining Set Bundle', description: 'Buy the dining table with chairs and take 8% off both.', type: 'bundle', discountKind: 'percent', discount: 8, products: ['p_dtable', 'p_dchair'], startDate: '', endDate: '', status: 'active', placement: 'bundle' },
];

export const coupons = [
  { id: 'cp_1', code: 'WELCOME5', type: 'percent', value: 5, minimumOrder: 15000, maximumDiscount: 5000, usageLimit: 500, usedCount: 0, startDate: '2026-09-01', endDate: '2026-12-31', status: 'active' },
  { id: 'cp_2', code: 'TEAK2000', type: 'flat', value: 2000, minimumOrder: 30000, maximumDiscount: 0, usageLimit: 100, usedCount: 0, startDate: '', endDate: '', status: 'active' },
];

export const banners = [
  { id: 'bn_1', title: 'Furniture, made to order', text: 'Ask us about custom sizes and finishes on WhatsApp.', ctaLabel: 'Chat with us', href: 'whatsapp', image: '', placement: 'home-mid', status: 'active' },
];

export const testimonials = [
  { id: 't_1', name: 'Sample Customer', location: 'Tirunelveli', rating: 5, review: 'Sample review text. Replace this with a genuine customer review from the admin panel.', product: 'Grove 3-Seater Teak Sofa', sample: true, status: 'active' },
  { id: 't_2', name: 'Sample Customer', location: 'Madurai', rating: 5, review: 'Sample review text. Replace this with a genuine customer review from the admin panel.', product: 'Thamirabarani 6-Seater Dining Table', sample: true, status: 'active' },
  { id: 't_3', name: 'Sample Customer', location: 'Chennai', rating: 4, review: 'Sample review text. Replace this with a genuine customer review from the admin panel.', product: 'Chettinad Teak King Bed', sample: true, status: 'active' },
];

export const faqs = [
  { id: 'f_1', q: 'What materials are used?', a: 'Our furniture is made from teak wood. Each product page lists its exact material and finish, so you can see what you are buying.', order: 1 },
  { id: 'f_2', q: 'How do I care for teak furniture?', a: 'Dust with a soft dry cloth and wipe spills quickly. Use coasters and mats under hot or wet items, and keep pieces out of prolonged direct sun and standing water. Avoid harsh chemical cleaners.', order: 2 },
  { id: 'f_3', q: 'How can I track my order?', a: 'Open Orders from the menu, choose your order and follow the timeline from Order Placed to Delivered.', order: 3 },
  { id: 'f_4', q: 'What payment methods are available?', a: 'The methods we currently accept are shown at checkout. Unavailable methods are marked as such.', order: 4 },
  { id: 'f_5', q: 'How do I cancel an order?', a: 'Call or WhatsApp us on 9087000717 with your order ID. Whether an order can be cancelled depends on how far it has progressed.', order: 5 },
  { id: 'f_6', q: 'How do I request a return?', a: 'The return terms for each product appear on its product page. To start a request, contact us with your order ID.', order: 6 },
  { id: 'f_7', q: 'How long does delivery take?', a: 'Delivery time depends on the product and your location. Check your PIN code on any product page for an estimate once delivery estimates are enabled, or contact us.', order: 7 },
  { id: 'f_8', q: 'Can I contact customer support?', a: 'Yes. Call or WhatsApp 9087000717, or send a message from the Contact page.', order: 8 },
];

export const settings = {
  store: { name: 'Hi Grove Furnitures', tagline: 'Premium Teak Wood Furniture', phone: '9087000717', email: '', address: 'Tirunelveli – 627451, Tamil Nadu' },
  shipping: { charge: 999, freeThreshold: 25000, regions: ['Tamil Nadu'] },
  tax: { rate: 18, inclusive: true, label: 'GST' },
  payment: {
    cod: { label: 'Cash on Delivery', enabled: true },
    upi: { label: 'UPI', enabled: false },
    card: { label: 'Card', enabled: false },
    netbanking: { label: 'Net Banking', enabled: false },
  },
  notifications: { orderEmail: true, lowStock: true, contactMessages: true },
  social: { instagram: '', facebook: '', youtube: '', whatsapp: '919087000717' },
  policies: {
    returns: '', warranty: '', delivery: '',
    care: 'Dust with a soft dry cloth. Wipe spills promptly. Use coasters and mats. Keep away from prolonged direct sunlight and standing water. Avoid harsh chemical cleaners.',
  },
};

export const home = {
  heroHeading: 'CRAFTED FROM WOOD.\nDESIGNED FOR LIFE.',
  heroText: 'Discover timeless furniture crafted to bring warmth, character and elegance into your home.',
  ctaLabel: 'SHOP COLLECTION', ctaHref: '/shop', cta2Label: 'EXPLORE CRAFTSMANSHIP', cta2Href: '/about#craft',
  heroMedia: '', featuredCollection: 'signature', showOffers: true, showTestimonials: true,
};

export const users = [
  { id: 'u_demo', name: 'Guest Customer', email: '', phone: '', role: 'customer', status: 'active', addresses: [], notifications: { orders: true, offers: false }, createdAt: '2026-09-01T00:00:00.000Z' },
  ...['Arun Kumar|Tirunelveli', 'Meenakshi S|Madurai', 'Karthik R|Chennai', 'Divya P|Coimbatore', 'Suresh B|Nagercoil', 'Lakshmi N|Tenkasi', 'Vignesh M|Thoothukudi', 'Priya T|Trichy'].map((s, i) => {
    const [name, city] = s.split('|');
    return { id: `u_${i + 1}`, name, email: `demo${i + 1}@example.com`, phone: `90000000${10 + i}`, role: 'customer', status: 'active', demo: true,
      addresses: [{ id: `a_${i + 1}`, label: 'Home', line1: `${12 + i}, Sample Street`, area: 'Demo Nagar', city, district: city, state: 'Tamil Nadu', pin: '627001' }],
      createdAt: `2026-0${1 + (i % 8)}-10T00:00:00.000Z` };
  }),
];

const rnd = (seed) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const R = rnd(42);
const STAT = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

export function buildOrders() {
  const out = [];
  const now = new Date('2026-09-27T12:00:00Z').getTime();
  const custs = users.filter((u) => u.demo);
  for (let i = 0; i < 46; i++) {
    const daysAgo = Math.floor(Math.pow(R(), 1.35) * 360);
    const n = 1 + Math.floor(R() * 2.4);
    const picks = [...new Set(Array.from({ length: n }, () => products[Math.floor(R() * products.length)]))];
    const items = picks.map((p) => ({ productId: p.id, name: p.name, sku: p.sku, price: p.price, qty: 1 + (R() > 0.8 ? 1 : 0), image: p.images[0] }));
    const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);
    const shipping = subtotal >= 25000 ? 0 : 999;
    const discount = R() > 0.7 ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal - discount + shipping;
    const u = custs[Math.floor(R() * custs.length)];
    const status = daysAgo > 20 ? (R() > 0.06 ? 'Delivered' : 'Cancelled') : STAT[Math.floor(R() * 7)];
    out.push({
      id: `HGF-${100200 + i}`, userId: u.id, customerName: u.name, items, subtotal, discount, shipping,
      tax: Math.round(((total - shipping) * 18) / 118), total, paymentMethod: 'cod',
      paymentStatus: status === 'Delivered' ? 'Paid' : status === 'Cancelled' ? 'Void' : 'Pending',
      orderStatus: status, shippingAddress: { name: u.name, phone: u.phone, ...u.addresses[0] },
      createdAt: new Date(now - daysAgo * 86400000 - Math.floor(R() * 40000000)).toISOString(), notes: '', demo: true,
      timeline: [{ status: 'Pending', at: new Date(now - daysAgo * 86400000).toISOString() }],
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const reviews = (() => {
  const names = [['Sample Customer', 'Tirunelveli'], ['Sample Customer', 'Madurai'], ['Sample Customer', 'Chennai']];
  const lines = ['Sample review: solid build and a warm finish.', 'Sample review: looks better in the room than in the photos.', 'Sample review: comfortable and well made.'];
  const ids = ['p_lounge', 'p_sofa3', 'p_coffee', 'p_dtable', 'p_bedk', 'p_desk', 'p_bedside', 'p_dchair', 'p_shelf', 'p_side', 'p_tv', 'p_ward'];
  return ids.flatMap((pid, i) => [0, 1].map((k) => ({
    id: `rv_${i}_${k}`, productId: pid, userId: null, customer: names[(i + k) % 3][0], location: names[(i + k) % 3][1],
    rating: (i + k) % 5 === 0 ? 4 : 5, review: lines[(i + k) % 3], status: 'approved', featured: false, sample: true,
    createdAt: new Date(Date.UTC(2026, 6, 1 + i * 2 + k)).toISOString(),
  })));
})();

export const messages = [
  { id: 'm_1', name: 'Sample Enquiry', phone: '9000000000', email: 'sample@example.com', subject: 'Custom size dining table', message: 'Sample message. Real enquiries from the Contact page will appear here.', status: 'New', createdAt: '2026-09-25T10:00:00.000Z' },
];

export const SEED = { categories, products, collections, offers, coupons, banners, testimonials, faqs, users, reviews, messages };
export const SINGLES = { settings, home };
export const ORDER_STATUSES = STAT;
