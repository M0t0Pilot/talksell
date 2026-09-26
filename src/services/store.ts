import { Product, BlogPost, Order, User, CartItem, BlogComment } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Eleanor Vance',
    email: 'admin@atelier.studio',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Founding editor and design curator at Atelier. Passionate about slow manufacturing, tactile materials, and sustainable craft.',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'user_customer',
    name: 'Clara Henderson',
    email: 'clara.h@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Architect and coffee enthusiast based in Kyoto & Portland.',
    createdAt: '2026-02-01T14:30:00Z',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Kuro Sand Ceramic Dripper & Server',
    slug: 'kuro-sand-ceramic-dripper',
    subtitle: 'Hand-thrown stoneware with micro-grooved extraction cone',
    description: 'A precision-crafted pour-over set thrown in small batches in Shigaraki, Japan. Features internal spiral fluting that optimizes water flow for clean, balanced clarity.',
    longDescription: `Each Kuro Sand Dripper is wheel-thrown by master artisans using iron-rich Shigaraki clay. The exterior features a tactile, unglazed raw sand texture that retains heat during brewing, while the interior is sealed with a smooth food-safe matte feldspar glaze.

Compatible with standard V60-02 paper filters. Includes the 550ml thermal server and matching heat-resistant bamboo coaster.`,
    price: 88.00,
    compareAtPrice: 105.00,
    category: 'Coffee & Tea',
    inventory: 18,
    sku: 'AT-DRIP-001',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
    ],
    tags: ['Artisanal', 'Ceramics', 'Coffee', 'Shigaraki', 'Bestseller'],
    rating: 4.9,
    reviewCount: 34,
    featured: true,
    materials: 'Shigaraki iron clay, natural feldspar matte glaze',
    dimensions: 'Dripper: 11.5cm × 9.5cm | Server: 550ml capacity',
    origin: 'Shigaraki, Japan'
  },
  {
    id: 'prod_2',
    title: 'Heritage Full-Grain Leather Field Journal',
    slug: 'heritage-leather-field-journal',
    subtitle: 'Vegetable-tanned Tuscan leather with refillable cotton rag paper',
    description: 'Hand-stitched leather journal with solid brass stud closure and 192 pages of heavyweight 120gsm fountain-pen friendly archival paper.',
    longDescription: `Constructed from 4oz vegetable-tanned leather sourced from a heritage tannery in Tuscany. Cut and saddle-stitched by hand with waxed linen thread. The leather will develop a deep, luminous amber patina over years of dedicated note-taking and travel.

Refillable modular inner binding accommodates standard A5 notebooks or our custom dotted grid inserts.`,
    price: 64.00,
    category: 'Stationery',
    inventory: 25,
    sku: 'AT-JRNL-002',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop&q=80'
    ],
    tags: ['Leather', 'Stationery', 'Refillable', 'Handmade'],
    rating: 5.0,
    reviewCount: 48,
    featured: true,
    materials: 'Italian vegetable-tanned leather, waxed Irish linen thread, solid brass',
    dimensions: '15.5cm × 22cm (fits A5 refills)',
    origin: 'Florence, Italy'
  },
  {
    id: 'prod_3',
    title: 'Washed Belgian Linen Studio Apron',
    slug: 'washed-belgian-linen-studio-apron',
    subtitle: 'Cross-back ergonomic design in forest sage with double tool pockets',
    description: 'A breathable, pre-softened 100% Belgian flax linen apron. Designed with a cross-back strap system that distributes weight evenly across shoulders.',
    longDescription: `Tailored for ceramicists, bakers, woodworkers, and home chefs. The heavyweight 280gsm linen is stone-washed for immediate softness and remarkable durability. Features dual reinforced utility pockets and a chest pocket tailored for pencils, thermometer, or tasting spoon.`,
    price: 76.00,
    compareAtPrice: 90.00,
    category: 'Home & Living',
    inventory: 14,
    sku: 'AT-APRN-003',
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80'
    ],
    tags: ['Linen', 'Studio', 'Textiles', 'Kitchen'],
    rating: 4.8,
    reviewCount: 22,
    featured: true,
    materials: '100% Belgian flax linen, reinforced bar-tack stitching',
    dimensions: 'Length: 92cm | Universal adjustable cross-back fit',
    origin: 'Ghent, Belgium'
  },
  {
    id: 'prod_4',
    title: 'Solid Black Walnut Desk Caddy & Pen Tray',
    slug: 'solid-black-walnut-desk-caddy',
    subtitle: 'Sculptural carved organizer with natural beeswax oil finish',
    description: 'Milled from a single block of sustainably harvested American black walnut. Features precision-sculpted resting grooves for pens, cards, and daily instruments.',
    longDescription: `Precision CNC-carved and hand-sanded to 400-grit before being sealed with three coats of food-grade organic walnut oil and local beeswax. A weighted, grounding addition to any focused writing desk or studio space.`,
    price: 52.00,
    category: 'Workspace',
    inventory: 30,
    sku: 'AT-DESK-004',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
    ],
    tags: ['Woodwork', 'Workspace', 'Walnut', 'Minimalist'],
    rating: 4.9,
    reviewCount: 19,
    featured: false,
    materials: 'Solid American Black Walnut, natural beeswax oil',
    dimensions: '24cm × 9cm × 2.2cm',
    origin: 'Oregon, USA'
  },
  {
    id: 'prod_5',
    title: 'Hand-Blown Amber Borosilicate Tumbler Set',
    slug: 'amber-borosilicate-tumbler-set',
    subtitle: 'Pair of lightweight thermal tumblers with fluted optical ridges',
    description: 'Set of two hand-blown thermal tumblers crafted from heat-resistant amber borosilicate glass. Suitable for piping hot espresso or iced tonic.',
    longDescription: `Melted and shaped by hand over open flame, these delicate yet shatter-resistant glasses catch morning light with subtle vertical optics. Dishwasher safe and resistant to thermal shock from -20°C to 150°C.`,
    price: 44.00,
    category: 'Home & Living',
    inventory: 40,
    sku: 'AT-GLAS-005',
    images: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80'
    ],
    tags: ['Glassware', 'Handmade', 'Amber', 'Tableware'],
    rating: 4.7,
    reviewCount: 15,
    featured: false,
    materials: 'Lab-grade amber borosilicate glass',
    dimensions: '320ml capacity per glass | 8.5cm height',
    origin: 'Prague, Czech Republic'
  },
  {
    id: 'prod_6',
    title: 'Kyoto Hinoki Cypress & Cedar Botanical Candle',
    slug: 'hinoki-cypress-botanical-candle',
    subtitle: '100% natural soy and rapeseed wax with crackling wood wick',
    description: 'Hand-poured into a reusable matte charcoal ceramic vessel. Scented with pure essential oils of Japanese Hinoki cypress, smoked cedarwood, and vetiver.',
    longDescription: `Evoking the quiet meditative stillness of a morning walk through temple gardens in Arashiyama. Clean burning with zero synthetic phthalates or parabens. 55-hour burn time with a gentle, soothing wood wick crackle.`,
    price: 38.00,
    category: 'Home & Living',
    inventory: 50,
    sku: 'AT-CNDL-006',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80'
    ],
    tags: ['Aromatherapy', 'Candle', 'Hinoki', 'Soy Wax'],
    rating: 4.9,
    reviewCount: 61,
    featured: true,
    materials: 'Soy wax, Hinoki & Cedar essential oils, ceramic vessel, wood wick',
    dimensions: '280g / 9.8 oz | 55-hour burn time',
    origin: 'Kyoto, Japan'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog_1',
    title: 'The Art of Slow Craftsmanship in a Hyper-Digital Age',
    slug: '/blogs/-art-of-slow-craftsmanship',
    excerpt: 'Why tactile rituals, natural materials, and intentional objects hold timeless grounding power in our increasingly screen-centric lives.',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    content: `# The Art of Slow Craftsmanship in a Hyper-Digital Age

In a world governed by infinite feeds, automated micro-interactions, and frictionless consumption, there is a quiet rebellion taking place on desks, kitchen tables, and workshops worldwide.

It is the deliberate return to **tactile physical objects** made by human hands with natural, honest materials.

> *"We do not merely use well-crafted objects; we converse with the hands that shaped them across time and distance."*

---

## Why the Physical Still Matters

When you hold a wheel-thrown ceramic cup, your fingertips register subtle variations: the slight texture of unglazed iron clay, the cool thermal conductivity of stone, the precise curvature calibrated to cradle your palm.

1. **Sensory Anchoring**: Physical textures break cognitive fatigue caused by smooth glass screens.
2. **Longevity Over Obsoleteness**: Unlike digital hardware with a 3-year lifecycle, a full-grain leather notebook or cast iron kettle improves with each passing decade.
3. **Intentional Pacing**: Pouring hot water in concentric circles through a ceramic dripper forces a 4-minute pause that cannot be accelerated.

---

### The Anatomy of Honest Materials

| Material | Provenance | Aging Characteristic |
| :--- | :--- | :--- |
| **Shigaraki Clay** | Shiga Prefecture, Japan | Develops warm tea-stain luster |
| **Vegetable Tanned Leather** | Tuscany, Italy | Deepens into rich amber patina |
| **Flax Linen** | Flanders, Belgium | Softens progressively with every wash |
| **American Walnut** | Appalachian Basin | Mellows into warm golden-brown hues |

---

## Setting Up an Intentional Morning Ritual

To incorporate mindful craft into your daily routine, consider these three principles:

\`\`\`markdown
1. Dedicate a single surface free of notification-bearing devices.
2. Select one daily instrument that brings physical delight (a pen, a dripper, a tea bowl).
3. Allow 10 uninterrupted minutes to observe the process rather than rushing the outcome.
\`\`\`

Craft is not nostalgia. It is an active assertion of human presence in a digital century.`,
    author: {
      name: 'Eleanor Vance',
      role: 'Founding Editor & Curator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    tags: ['Philosophy', 'Craftsmanship', 'Design', 'Slow Living'],
    category: 'Essays',
    publishedAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
    isPublished: true,
    readTimeMinutes: 4,
    seoTitle: 'The Art of Slow Craftsmanship — Atelier Journal',
    seoDescription: 'Explore why intentional physical objects and slow craft matter in an automated digital age.',
    viewsCount: 1420,
    likesCount: 128,
    featured: true,
    linkedProductIds: ['prod_1', 'prod_2'],
    comments: [
      {
        id: 'comm_1',
        authorName: 'Marcus Thorne',
        authorEmail: 'marcus@studio.design',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'This essay captures precisely why I traded my digital notes for an A5 leather notebook two years ago. The tactile weight completely changes how thoughts crystallize.',
        createdAt: '2026-03-14T14:22:00Z'
      },
      {
        id: 'comm_2',
        authorName: 'Aoi Tanaka',
        authorEmail: 'aoi.t@kyoto.jp',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'The comparison table of materials is spot on. Shigaraki clay holds heat like nothing else during morning brewing.',
        createdAt: '2026-03-15T08:45:00Z'
      }
    ]
  },
  {
    id: 'blog_2',
    title: 'A Minimalist Guide to Studio Workspace Design',
    slug: '/blogs/-minimalist-workspace-setup',
    excerpt: 'How thoughtful lighting, warm timber, and zero-distraction spatial math cultivate deep focus and creative flow.',
    coverImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    content: `# A Minimalist Guide to Studio Workspace Design

A workspace is not just a surface where work happens; it is an optical lens that focuses or scatters your cognitive energy.

When designing our studio spaces, we follow three foundational rules derived from Japanese architecture and Scandinavian functionalism.

---

## 1. The Single Horizon Rule

Keep horizontal surfaces 80% clear of loose items. Group required tools onto a single solid timber tray or caddy.

- **Primary tools within reach**: Fountain pen, brass ruler, paper block.
- **Secondary tools stowed**: Cables, external hard drives, extra stationery.
- **Visual noise eliminated**: Zero visible branding stickers or blinking LED lights.

---

## 2. Natural Kelvin Lighting Hierarchy

Lighting directly regulates circadian rhythm and mental vigilance:

- **Morning (5000K)**: Diffused cool natural light adjacent to a window.
- **Afternoon (3500K)**: Soft ambient studio illumination.
- **Evening Focus (2700K)**: Warm incandescent task spotlight directed exclusively at working papers.

---

## 3. The 3-Item Desk Formula

\`\`\`
Desk Anchor = [1 Solid Wood Caddy] + [1 Tactile Journal] + [1 Plant or Natural Object]
\`\`\`

By limiting the visual field to natural grain, deep paper, and honest materials, the mind settles immediately into deep work without friction.`,
    author: {
      name: 'Eleanor Vance',
      role: 'Founding Editor & Curator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    tags: ['Workspace', 'Architecture', 'Minimalism', 'Productivity'],
    category: 'Guides',
    publishedAt: '2026-02-28T11:15:00Z',
    updatedAt: '2026-02-28T11:15:00Z',
    isPublished: true,
    readTimeMinutes: 3,
    seoTitle: 'Minimalist Workspace Setup Guide — Atelier Studio',
    seoDescription: 'Practical architectural rules for setting up a calm, focused, and distraction-free studio workspace.',
    viewsCount: 980,
    likesCount: 84,
    featured: false,
    linkedProductIds: ['prod_4', 'prod_2'],
    comments: []
  },
  {
    id: 'blog_3',
    title: 'Brewing the Perfect Pour-Over: Ratio, Water & Temperature',
    slug: '/blogs/-brewing-the-perfect-pour-over',
    excerpt: 'An exacting masterclass on extraction yield, grind uniformity, and spiral pouring techniques for sweet, floral cups.',
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
    content: `# Brewing the Perfect Pour-Over: Ratio, Water & Temperature

Pour-over brewing is the intersection of fluid dynamics and sensory meditation. Here is the exact recipe we use daily at the Atelier tasting bench.

---

## Standard Parameters

- **Dose**: 20.0g whole bean coffee (Medium-coarse grind, ~700 microns)
- **Water**: 320g filtered water at 93°C (200°F)
- **Ratio**: 1:16
- **Total Brew Time**: 3 minutes 15 seconds

---

## Step-by-Step Pouring Protocol

1. **Pre-wet & Rinse**: Rinse the paper filter with hot water to eliminate paper taste and pre-heat the ceramic cone. Discard rinse water.
2. **The Bloom (0:00 - 0:45)**: Pour 60g of water in steady concentric circles. Let the grinds release CO2 for 45 seconds.
3. **First Main Pour (0:45 - 1:30)**: Gently pour up to 180g water, maintaining a steady 4g/sec flow rate.
4. **Final Pour (1:30 - 2:15)**: Pour continuously to 320g, finishing with a gentle swirl of the dripper to ensure a flat coffee bed.
5. **Drawdown (2:15 - 3:15)**: Allow clean gravity filtration to finish.

> *"The secret is not speed, but consistent thermal mass and uniform particle saturation."*`,
    author: {
      name: 'Clara Henderson',
      role: 'Guest Contributor & Barista',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    tags: ['Coffee', 'Brewing', 'Ritual', 'Technique'],
    category: 'Rituals',
    publishedAt: '2026-02-14T08:00:00Z',
    updatedAt: '2026-02-14T08:00:00Z',
    isPublished: true,
    readTimeMinutes: 3,
    seoTitle: 'Mastering the Pour-Over Coffee Ratio — Atelier Journal',
    seoDescription: 'A complete step-by-step masterclass on pour-over coffee ratios, water chemistry, and bloom timing.',
    viewsCount: 2150,
    likesCount: 196,
    featured: false,
    linkedProductIds: ['prod_1'],
    comments: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1084',
    orderNumber: 'ATL-1084',
    customer: {
      name: 'Julian Hayes',
      email: 'julian.h@designworks.io',
      address: '742 Evergreen Terrace, Apt 4B',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States',
      phone: '+1 (206) 555-0192'
    },
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[1], quantity: 1 }
    ],
    subtotal: 152.00,
    tax: 12.16,
    shipping: 0.00,
    discount: 0.00,
    total: 164.16,
    status: 'delivered',
    stripePaymentIntentId: 'pi_3MtwL2LkdIwHu7ix04gVb9Zy',
    cardBrand: 'visa',
    cardLast4: '4242',
    createdAt: '2026-03-20T16:45:00Z',
    receiptUrl: 'https://stripe.com/receipt/sim_atl_1084'
  },
  {
    id: 'ord_1085',
    orderNumber: 'ATL-1085',
    customer: {
      name: 'Clara Henderson',
      email: 'clara.h@example.com',
      address: '1480 NW 12th Ave',
      city: 'Portland',
      state: 'OR',
      postalCode: '97209',
      country: 'United States',
      phone: '+1 (503) 555-4421'
    },
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 2 }
    ],
    subtotal: 152.00,
    tax: 0.00,
    shipping: 0.00,
    discount: 15.00,
    total: 137.00,
    status: 'processing',
    stripePaymentIntentId: 'pi_3MtwO4LkdIwHu7ix19jKp2Qr',
    cardBrand: 'mastercard',
    cardLast4: '5555',
    createdAt: '2026-03-25T11:20:00Z',
    receiptUrl: 'https://stripe.com/receipt/sim_atl_1085'
  }
];

// Helper to calculate reading time from markdown
export function calculateReadTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Helper to generate SEO slug
export function generateSlug(title: string): string {
  const clean = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `/blogs/-${clean}`;
}
