export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  inventory: number;
  sku: string;
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  materials?: string;
  dimensions?: string;
  origin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface BlogComment {
  id: string;
  authorName: string;
  authorEmail: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string; // e.g. /blogs/-art-of-slow-crafting
  excerpt: string;
  content: string; // Markdown
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  category: string;
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  readTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  viewsCount: number;
  likesCount: number;
  featured?: boolean;
  comments: BlogComment[];
  linkedProductIds?: string[];
}

export type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderCustomer {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  stripePaymentIntentId: string;
  cardBrand: string;
  cardLast4: string;
  createdAt: string;
  receiptUrl?: string;
}

export interface SiteNotification {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}
