import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, BlogPost, Order, User, CartItem, OrderStatus, BlogComment } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BLOG_POSTS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  calculateReadTime
} from '../services/store';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation & Views
  currentView: 'home' | 'shop' | 'product_detail' | 'blog_list' | 'blog_reader' | 'admin' | 'account';
  setCurrentView: (view: 'home' | 'shop' | 'product_detail' | 'blog_list' | 'blog_reader' | 'admin' | 'account') => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  selectedBlogSlug: string | null;
  setSelectedBlogSlug: (slug: string | null) => void;
  navigateToProduct: (slug: string) => void;
  navigateToBlog: (slug: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;

  // Blog Posts
  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id' | 'viewsCount' | 'likesCount' | 'comments' | 'readTimeMinutes'>) => BlogPost;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  getBlogBySlug: (slug: string) => BlogPost | undefined;
  likeBlogPost: (id: string) => void;
  addBlogComment: (postId: string, comment: Omit<BlogComment, 'id' | 'createdAt'>) => void;
  incrementBlogViews: (id: string) => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  promoDiscount: number;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;

  // Auth & User
  currentUser: User | null;
  loginAs: (role: 'admin' | 'customer') => void;
  loginWithEmail: (email: string, name?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdmin: boolean;

  // Notification Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'atelier_products_v1',
  BLOGS: 'atelier_blogs_v1',
  ORDERS: 'atelier_orders_v1',
  CART: 'atelier_cart_v1',
  USER: 'atelier_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // View State
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product_detail' | 'blog_list' | 'blog_reader' | 'admin' | 'account'>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  // Cart & Checkout Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // 1. Initialize Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // 2. Initialize Blog Posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOGS);
      return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
    } catch {
      return INITIAL_BLOG_POSTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogPosts));
    } catch (e) {
      console.error(e);
    }
  }, [blogPosts]);

  // 3. Initialize Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // 4. Initialize Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // 5. Initialize Auth User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Start with admin for easy exploration
    } catch {
      return INITIAL_USERS[0];
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Navigation Helpers
  const navigateToProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBlog = (slug: string) => {
    setSelectedBlogSlug(slug);
    setCurrentView('blog_reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product Actions
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: 'prod_' + Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.title}" created successfully!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug || p.id === slug);
  };

  // Blog Actions
  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'viewsCount' | 'likesCount' | 'comments' | 'readTimeMinutes'>): BlogPost => {
    const readTimeMinutes = calculateReadTime(postData.content);
    const newPost: BlogPost = {
      ...postData,
      id: 'blog_' + Date.now(),
      viewsCount: 1,
      likesCount: 0,
      comments: [],
      readTimeMinutes,
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    showToast(`Journal post "${newPost.title}" published!`, 'success');
    return newPost;
  };

  const updateBlogPost = (id: string, updated: Partial<BlogPost>) => {
    setBlogPosts((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const content = updated.content !== undefined ? updated.content : b.content;
          const readTimeMinutes = calculateReadTime(content);
          return {
            ...b,
            ...updated,
            readTimeMinutes,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );
    showToast('Journal post saved!', 'success');
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((b) => b.id !== id));
    showToast('Journal post deleted', 'info');
  };

  const getBlogBySlug = (slug: string) => {
    const normalized = slug.startsWith('/') ? slug : `/blogs/${slug}`;
    return blogPosts.find((b) => b.slug === normalized || b.slug === slug || b.id === slug);
  };

  const likeBlogPost = (id: string) => {
    setBlogPosts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, likesCount: b.likesCount + 1 } : b))
    );
    showToast('Thank you for liking this article!', 'success');
  };

  const addBlogComment = (postId: string, commentData: Omit<BlogComment, 'id' | 'createdAt'>) => {
    const newComment: BlogComment = {
      ...commentData,
      id: 'comm_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setBlogPosts((prev) =>
      prev.map((b) =>
        b.id === postId
          ? { ...b, comments: [newComment, ...b.comments] }
          : b
      )
    );
    showToast('Comment posted successfully!', 'success');
  };

  const incrementBlogViews = (id: string) => {
    setBlogPosts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, viewsCount: b.viewsCount + 1 } : b))
    );
  };

  // Cart Actions
  const addToCart = (product: Product, quantity: number = 1, variant?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === variant
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, quantity, selectedVariant: variant }];
      }
    });
    showToast(`Added ${quantity} × ${product.title} to bag`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from bag', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoDiscount(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ATELIER15' || normalized === 'SLOW15') {
      setAppliedPromo(normalized);
      setPromoDiscount(15);
      showToast('15% discount code applied!', 'success');
      return true;
    } else if (normalized === 'WELCOME10') {
      setAppliedPromo(normalized);
      setPromoDiscount(10);
      showToast('10% discount code applied!', 'success');
      return true;
    }
    showToast('Invalid or expired discount code', 'error');
    return false;
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartTotal = Math.max(
    0,
    cartSubtotal * (1 - promoDiscount / 100)
  );
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Orders Actions
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const orderNumber = `ATL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: 'ord_' + Date.now(),
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    // Deduct inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const orderItem = newOrder.items.find((item) => item.product.id === prod.id);
        if (orderItem) {
          return {
            ...prod,
            inventory: Math.max(0, prod.inventory - orderItem.quantity),
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status updated to ${status}`, 'success');
  };

  // Auth / Role Actions
  const loginAs = (role: 'admin' | 'customer') => {
    const user = role === 'admin' ? INITIAL_USERS[0] : INITIAL_USERS[1];
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`Signed in as ${user.name} (${role})`, 'success');
  };

  const loginWithEmail = (email: string, name?: string) => {
    const isAdminEmail = email.toLowerCase().includes('admin') || email.toLowerCase().includes('atelier');
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name || email.split('@')[0],
      email,
      role: isAdminEmail ? 'admin' : 'customer',
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(email)}`,
      bio: 'Atelier community member',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${newUser.name}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    if (currentView === 'admin') {
      setCurrentView('home');
    }
    showToast('Signed out successfully', 'info');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductSlug,
        setSelectedProductSlug,
        selectedBlogSlug,
        setSelectedBlogSlug,
        navigateToProduct,
        navigateToBlog,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,

        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        getBlogBySlug,
        likeBlogPost,
        addBlogComment,
        incrementBlogViews,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        promoDiscount,
        appliedPromo,
        applyPromoCode,

        orders,
        createOrder,
        updateOrderStatus,
        lastOrder,
        setLastOrder,

        currentUser,
        loginAs,
        loginWithEmail,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdmin,

        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
