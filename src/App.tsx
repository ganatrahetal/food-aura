import React, { useState, useEffect } from 'react';
import { NavigationBar } from './components/NavigationBar';
import { HomeScreen } from './components/HomeScreen';
import { RestaurantScreen } from './components/RestaurantScreen';
import { CartScreen } from './components/CartScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SearchScreen } from './components/SearchScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { OrderTrackingScreen } from './components/OrderTrackingScreen';
import { PromoCodesScreen } from './components/PromoCodesScreen';
import { FullMapViewScreen } from './components/FullMapViewScreen';
import { DeliveryPartnerChatScreen } from './components/DeliveryPartnerChatScreen';
import { FavoritesScreen } from './components/settings/FavoritesScreen';
import { HelpSupportScreen } from './components/settings/HelpSupportScreen';
import { RefundScreen } from './components/RefundScreen';
import { SplashScreen } from './components/SplashScreen';
import { BrandIntroScreen } from './components/BrandIntroScreen';
import { LoginScreen } from './components/LoginScreen';
import { RestaurantOwnerApp } from './components/RestaurantOwnerApp';
import { ConfirmationDialog } from './components/ui/confirmation-dialog';
import { Home, Search, ShoppingCart, User, Sparkles, ArrowLeft } from 'lucide-react';

export type Screen = 'home' | 'search' | 'cart' | 'profile' | 'restaurant' | 'notifications' | 'feedback' | 'order_tracking' | 'promo_codes' | 'full_map' | 'favorites' | 'help_support' | 'delivery_chat' | 'refund';
export type AppState = 'splash' | 'brand_intro' | 'login' | 'app';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  image: string;
  customizations?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  distance: number;
  offers?: string[];
  tags?: string[];
  phone?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  rating?: number;
  preparationTime?: string;
  calories?: number;
  spiceLevel?: 'mild' | 'medium' | 'spicy';
}

export interface Order {
  id: string;
  items: CartItem[];
  restaurant: {
    id: string;
    name: string;
    image: string;
    phone?: string;
  };
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  placedAt: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  paymentMethod: string;
  giftMessage?: string;
  trackingUpdates: {
    time: string;
    message: string;
    status: string;
  }[];
  refund?: {
    id: string;
    amount: number;
    status: 'processing' | 'completed' | 'failed';
    method: string;
    initiatedAt: string;
    completedAt?: string;
    estimatedCompletion: string;
    reason: string;
    timeline: {
      time: string;
      message: string;
      status: string;
    }[];
  };
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate: string;
  userType?: 'end_user' | 'restaurant' | 'admin' | 'delivery';
}

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  type?: 'warning' | 'danger' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
}

// Default cart items to show when user first opens the app
const defaultCartItems: CartItem[] = [
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    price: 14.99,
    quantity: 1,
    restaurantId: '1',
    restaurantName: 'Joe\'s Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    customizations: ['Extra cheese', 'Thin crust']
  },
  {
    id: 'chicken-burger',
    name: 'Grilled Chicken Burger',
    price: 12.49,
    quantity: 2,
    restaurantId: '2',
    restaurantName: 'Shake Shack',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    customizations: ['No pickles', 'Extra sauce']
  },
  {
    id: 'california-roll',
    name: 'California Roll (8 pcs)',
    price: 8.99,
    quantity: 1,
    restaurantId: '3',
    restaurantName: 'Nobu',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
  }
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [feedbackData, setFeedbackData] = useState<{
    type: 'order' | 'restaurant' | 'delivery';
    orderData?: any;
  } | null>(null);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    id: 'home',
    name: 'Home',
    address: '123 Broadway Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  });
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Check for existing user session on app start
  useEffect(() => {
    // Don't check for saved user during splash, let it complete first
    if (appState === 'splash') return;
    
    const savedUser = localStorage.getItem('foodyahUser');
    if (savedUser && appState !== 'app') {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setAppState('app');
        setCurrentScreen('home'); // Always redirect to home
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
        localStorage.removeItem('foodyahUser');
      }
    }
  }, [appState]);

  // Load cart from localStorage or set default items (only for end users)
  useEffect(() => {
    if (user?.userType === 'end_user' || !user?.userType) {
      const savedCart = localStorage.getItem('foodyahCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          // Only use saved cart if it has items, otherwise use default
          setCartItems(parsedCart.length > 0 ? parsedCart : defaultCartItems);
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
          setCartItems(defaultCartItems);
        }
      } else {
        // First time user - set default cart items
        setCartItems(defaultCartItems);
      }
    } else {
      // Non-end users don't have carts
      setCartItems([]);
    }
  }, [user]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('foodyahOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to load orders from localStorage:', error);
      }
    } else {
      // Add a sample cancelled order with refund for demo purposes
      const sampleCancelledOrder: Order = {
        id: 'FY000001',
        items: [
          {
            id: 'demo-burger',
            name: 'Classic Burger',
            price: 12.99,
            quantity: 1,
            restaurantId: 'demo-restaurant',
            restaurantName: 'Demo Burger House',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
          }
        ],
        restaurant: {
          id: 'demo-restaurant',
          name: 'Demo Burger House',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
          phone: '+1 (555) 123-4567'
        },
        total: 18.12,
        subtotal: 12.99,
        deliveryFee: 2.99,
        tax: 2.14,
        status: 'cancelled',
        placedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        deliveryAddress: '123 Broadway Street, New York, NY 10001',
        paymentMethod: 'Paid by Visa ending 1234',
        trackingUpdates: [
          {
            time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order cancelled and refund initiated',
            status: 'cancelled'
          },
          {
            time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order placed successfully',
            status: 'placed'
          }
        ],
        refund: {
          id: 'RF000001',
          amount: 18.12,
          status: 'completed',
          method: 'Visa Card ending 1234',
          initiatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
          completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // completed yesterday
          estimatedCompletion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          reason: 'Order cancelled by customer',
          timeline: [
            {
              time: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              message: 'Refund completed successfully',
              status: 'completed'
            },
            {
              time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              message: 'Refund approved and processing',
              status: 'processing'
            },
            {
              time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              message: 'Refund initiated',
              status: 'processing'
            }
          ]
        }
      };
      setOrders([sampleCancelledOrder]);
    }
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('foodyahFavorites');
    if (savedFavorites) {
      try {
        setFavoriteRestaurants(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to load favorites from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage (only for end users)
  useEffect(() => {
    if (user?.userType === 'end_user' || !user?.userType) {
      localStorage.setItem('foodyahCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('foodyahOrders', JSON.stringify(orders));
  }, [orders]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('foodyahFavorites', JSON.stringify(favoriteRestaurants));
  }, [favoriteRestaurants]);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('foodyahUser', JSON.stringify(user));
    }
  }, [user]);

  const showConfirmation = (config: Omit<ConfirmationState, 'isOpen'>) => {
    setConfirmation({
      ...config,
      isOpen: true
    });
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleSplashComplete = () => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('foodyahUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setAppState('app');
        setCurrentScreen('home');
      } catch (error) {
        localStorage.removeItem('foodyahUser');
        setAppState('brand_intro');
      }
    } else {
      setAppState('brand_intro');
    }
  };

  const handleBrandIntroComplete = () => {
    setAppState('login');
  };

  const handleLoginSuccess = (userData: any) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar: userData.avatar,
      joinDate: new Date().toISOString(),
      userType: userData.userType || 'end_user'
    };
    setUser(newUser);
    setAppState('app');
    setCurrentScreen('home'); // Always redirect to home page
    showNotification(`Welcome back, ${userData.name.split(' ')[0]}! 🎉`, 'success');
  };

  const handleLogout = () => {
    showConfirmation({
      title: 'Logout',
      message: 'Are you sure you want to logout? You will need to sign in again to access your account.',
      type: 'warning',
      confirmText: 'Logout',
      onConfirm: () => {
        setUser(null);
        setCartItems([]);
        setOrders([]);
        setFavoriteRestaurants([]);
        localStorage.removeItem('foodyahUser');
        localStorage.removeItem('foodyahCart');
        localStorage.removeItem('foodyahOrders');
        localStorage.removeItem('foodyahFavorites');
        setAppState('brand_intro');
        setCurrentScreen('home');
        showNotification('Logged out successfully', 'info');
      }
    });
  };

  // Handle profile update from EditProfile
  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    showNotification('Profile updated successfully!', 'success');
  };

  // Handle favorites toggle
  const toggleFavorite = (restaurantId: string, restaurantName: string) => {
    setFavoriteRestaurants(prev => {
      const isFavorited = prev.includes(restaurantId);
      if (isFavorited) {
        showNotification(`${restaurantName} removed from favorites`, 'info');
        return prev.filter(id => id !== restaurantId);
      } else {
        showNotification(`${restaurantName} added to favorites! ❤️`, 'success');
        return [...prev, restaurantId];
      }
    });
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const addToCart = (restaurant: Restaurant, menuItem: MenuItem, customizations?: string[]) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === menuItem.id && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );
      
      if (existingItem) {
        showNotification(`${menuItem.name} quantity updated in cart`, 'success');
        return prev.map(item =>
          item.id === menuItem.id && 
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        showNotification(`${menuItem.name} added to cart`, 'success');
        return [...prev, {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          image: menuItem.image,
          customizations
        }];
      }
    });
  };

  // Handle order placement
  const handlePlaceOrder = (orderData: {
    paymentMethod: string;
    giftMessage?: string;
  }) => {
    if (cartItems.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }

    const restaurant = {
      id: cartItems[0].restaurantId,
      name: cartItems[0].restaurantName,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      phone: '+1 (555) 123-4567'
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.0875; // 8.75% tax
    const total = subtotal + deliveryFee + tax;

    const newOrder: Order = {
      id: `FY${Date.now().toString().slice(-6)}`,
      items: [...cartItems],
      restaurant,
      total,
      subtotal,
      deliveryFee,
      tax,
      status: 'placed',
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      deliveryAddress: `${currentLocation.address}, ${currentLocation.city}, ${currentLocation.state} ${currentLocation.zipCode}`,
      paymentMethod: orderData.paymentMethod,
      giftMessage: orderData.giftMessage,
      trackingUpdates: [{
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        message: 'Order placed successfully',
        status: 'placed'
      }]
    };

    // Add order to orders list
    setOrders(prev => [newOrder, ...prev]);

    // Automatically clear cart after successful order placement
    setCartItems([]);

    // Show success notification
    showNotification(`Order #${newOrder.id} placed successfully! 🎉`, 'success', 4000);

    // Navigate to order tracking
    setCurrentScreen('order_tracking');
  };

  // Handle order updates (for cancellation and refunds)
  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  // Handle reorder functionality
  const handleReorder = (items: CartItem[]) => {
    const currentRestaurantId = cartItems.length > 0 ? cartItems[0].restaurantId : null;
    const newRestaurantId = items.length > 0 ? items[0].restaurantId : null;
    
    if (currentRestaurantId && newRestaurantId && currentRestaurantId !== newRestaurantId) {
      showConfirmation({
        title: 'Clear Cart?',
        message: 'Your cart contains items from a different restaurant. Clear cart and add new items?',
        type: 'warning',
        confirmText: 'Clear & Add',
        onConfirm: () => {
          setCartItems(items);
        }
      });
    } else {
      // Add items to existing cart or create new cart
      setCartItems(prev => {
        const updatedCart = [...prev];
        
        items.forEach(newItem => {
          const existingItemIndex = updatedCart.findIndex(item => 
            item.id === newItem.id && 
            JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations) &&
            item.restaurantId === newItem.restaurantId
          );
          
          if (existingItemIndex >= 0) {
            updatedCart[existingItemIndex].quantity += newItem.quantity;
          } else {
            updatedCart.push(newItem);
          }
        });
        
        return updatedCart;
      });
      
      showNotification('Items added to cart successfully!', 'success');
    }
  };

  const updateCartQuantity = (itemId: string, quantity: number, customizations?: string[]) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => 
        !(item.id === itemId && JSON.stringify(item.customizations) === JSON.stringify(customizations))
      ));
      showNotification('Item removed from cart', 'info');
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === itemId && JSON.stringify(item.customizations) === JSON.stringify(customizations)
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    showConfirmation({
      title: 'Clear Cart',
      message: 'Are you sure you want to remove all items from your cart?',
      type: 'warning',
      confirmText: 'Clear Cart',
      onConfirm: () => {
        setCartItems([]);
        showNotification('Cart cleared', 'info');
      }
    });
  };

  const openRestaurant = (restaurant: Restaurant) => {
    setPreviousScreen(currentScreen);
    setSelectedRestaurant(restaurant);
    setCurrentScreen('restaurant');
    // Scroll to top when opening restaurant
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const navigateToScreen = (screen: Screen) => {
    setPreviousScreen(currentScreen);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsLoading(false);
    }, 150);
  };

  const goBack = () => {
    if (currentScreen === 'restaurant') {
      setCurrentScreen(previousScreen);
    } else if (currentScreen === 'notifications') {
      setCurrentScreen('home');
    } else if (currentScreen === 'feedback') {
      setCurrentScreen('notifications');
    } else if (currentScreen === 'order_tracking') {
      setCurrentScreen('profile');
    } else if (currentScreen === 'full_map') {
      setCurrentScreen('order_tracking');
    } else if (currentScreen === 'delivery_chat') {
      setCurrentScreen('order_tracking');
    } else if (currentScreen === 'refund') {
      setCurrentScreen('order_tracking');
    } else if (currentScreen === 'promo_codes') {
      setCurrentScreen('home');
    } else if (currentScreen === 'favorites') {
      setCurrentScreen(previousScreen);
    } else if (currentScreen === 'help_support') {
      setCurrentScreen(previousScreen);
    } else if (currentScreen === 'search') {
      // FIXED: Go back to the actual previous screen instead of always home
      setCurrentScreen(previousScreen);
      setSearchQuery('');
    } else if (currentScreen === 'cart') {
      setCurrentScreen(previousScreen);
    } else if (currentScreen === 'profile') {
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleLocationChange = (location: Location) => {
    setCurrentLocation(location);
    showNotification(`Location changed to ${location.name}`, 'success');
  };

  const handleSearchFocus = () => {
    if (currentScreen !== 'search') {
      setPreviousScreen(currentScreen);
      setCurrentScreen('search');
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && currentScreen !== 'search') {
      setPreviousScreen(currentScreen);
      setCurrentScreen('search');
    }
  };

  const handleNotificationClick = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('notifications');
  };

  const handleOpenFeedback = (type: 'order' | 'restaurant' | 'delivery', orderData?: any) => {
    setFeedbackData({ type, orderData });
    setCurrentScreen('feedback');
  };

  const handleShowPromoModal = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('promo_codes');
  };

  const handleTrackOrder = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('order_tracking');
  };

  const handleOpenFullMap = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('full_map');
  };

  const handleOpenDeliveryChat = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('delivery_chat');
  };

  const handleApplyPromoCode = (code: string) => {
    showNotification(`Promo code ${code} applied to your cart!`, 'success');
  };

  const handleOpenFavorites = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('favorites');
  };

  const handleOpenHelpSupport = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('help_support');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  const handleOpenRefund = (orderId?: string) => {
    setPreviousScreen(currentScreen);
    setSelectedOrderForRefund(orderId || null);
    setCurrentScreen('refund');
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Splash Screen
  if (appState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Brand Introduction Screen
  if (appState === 'brand_intro') {
    return <BrandIntroScreen onComplete={handleBrandIntroComplete} />;
  }

  // Login Screen
  if (appState === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Restaurant Owner Application
  if (appState === 'app' && user?.userType === 'restaurant') {
    return (
      <div className="relative">
        {/* Confirmation Dialog - Now rendered for restaurant owners too */}
        <ConfirmationDialog
          isOpen={confirmation.isOpen}
          onClose={hideConfirmation}
          onConfirm={confirmation.onConfirm}
          title={confirmation.title}
          message={confirmation.message}
          type={confirmation.type}
          confirmText={confirmation.confirmText}
          cancelText={confirmation.cancelText}
        />

        {/* Notifications - Now rendered for restaurant owners too */}
        <div className="fixed top-28 left-10 right-10 z-50 space-y-2 max-w-md mx-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 rounded-lg shadow-card animate-slide-up ${
                notification.type === 'success' ? 'bg-success text-success-foreground' :
                notification.type === 'error' ? 'bg-destructive text-destructive-foreground' :
                'bg-card text-card-foreground border border-border'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles size={16} />
                <span className="text-sm">{notification.message}</span>
              </div>
            </div>
          ))}
        </div>

        <RestaurantOwnerApp 
          user={user} 
          onLogout={handleLogout} 
          onShowNotification={showNotification}
        />
      </div>
    );
  }

  // Show coming soon message for admin and delivery users
  if (appState === 'app' && (user?.userType === 'admin' || user?.userType === 'delivery')) {
    return (
      <div className="h-screen bg-background flex flex-col max-w-md mx-auto mx-6 p-4 pt-6 relative">
        {/* Confirmation Dialog - Also for admin/delivery users */}
        <ConfirmationDialog
          isOpen={confirmation.isOpen}
          onClose={hideConfirmation}
          onConfirm={confirmation.onConfirm}
          title={confirmation.title}
          message={confirmation.message}
          type={confirmation.type}
          confirmText={confirmation.confirmText}
          cancelText={confirmation.cancelText}
        />

        {/* Notifications - Also for admin/delivery users */}
        <div className="fixed top-28 left-10 right-10 z-50 space-y-2 max-w-md mx-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 rounded-lg shadow-card animate-slide-up ${
                notification.type === 'success' ? 'bg-success text-success-foreground' :
                notification.type === 'error' ? 'bg-destructive text-destructive-foreground' :
                'bg-card text-card-foreground border border-border'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles size={16} />
                <span className="text-sm">{notification.message}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-primary" size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Coming Soon!</h1>
            <p className="text-muted-foreground mb-8">
              The {user?.userType === 'admin' ? 'Admin' : 'Delivery Partner'} application is under development. 
              Stay tuned for updates!
            </p>
            <button
              onClick={handleLogout}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full bg-background">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'home':
        return <HomeScreen 
          onRestaurantClick={openRestaurant} 
          currentLocation={currentLocation} 
          onShowPromoModal={handleShowPromoModal} 
          onTrackOrder={handleTrackOrder}
          favoriteRestaurants={favoriteRestaurants}
          onToggleFavorite={toggleFavorite}
        />;
      case 'search':
        return <SearchScreen 
          onRestaurantClick={openRestaurant} 
          searchQuery={searchQuery} 
          onSearchChange={handleSearchChange} 
          onBack={goBack}
          favoriteRestaurants={favoriteRestaurants}
          onToggleFavorite={toggleFavorite}
        />;
      case 'cart':
        return <CartScreen 
          cartItems={cartItems} 
          updateQuantity={updateCartQuantity}
          clearCart={clearCart}
          onShowNotification={showNotification}
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
          onBack={goBack}
          onTrackOrder={handleTrackOrder}
          onPlaceOrder={handlePlaceOrder}
        />;
      case 'profile':
        return <ProfileScreen 
          user={user} 
          onLogout={handleLogout} 
          onShowNotification={showNotification} 
          onTrackOrder={handleTrackOrder}
          onRestaurantClick={openRestaurant}
          onReorder={handleReorder}
          onProfileUpdate={handleProfileUpdate}
          orders={orders}
          onOpenFavorites={handleOpenFavorites}
          onOpenHelpSupport={handleOpenHelpSupport}
          favoriteRestaurants={favoriteRestaurants}
        />;
      case 'favorites':
        return <FavoritesScreen
          onBack={goBack}
          onRestaurantClick={openRestaurant}
          favoriteRestaurants={favoriteRestaurants}
          onToggleFavorite={toggleFavorite}
          onShowNotification={showNotification}
        />;
      case 'help_support':
        return <HelpSupportScreen
          onBack={goBack}
          onShowNotification={showNotification}
        />;
      case 'refund':
        return <RefundScreen
          onBack={goBack}
          onShowNotification={showNotification}
          orders={orders}
          selectedOrderId={selectedOrderForRefund || undefined}
        />;
      case 'notifications':
        return <NotificationsScreen 
          onBack={goBack} 
          onShowNotification={showNotification}
          onOpenFeedback={handleOpenFeedback}
          onRestaurantClick={openRestaurant}
        />;
      case 'feedback':
        return feedbackData ? (
          <FeedbackScreen
            onBack={goBack}
            onShowNotification={showNotification}
            feedbackType={feedbackData.type}
            orderData={feedbackData.orderData}
          />
        ) : <NotificationsScreen onBack={goBack} onShowNotification={showNotification} onOpenFeedback={handleOpenFeedback} onRestaurantClick={openRestaurant} />;
      case 'order_tracking':
        return <OrderTrackingScreen 
          onBack={goBack} 
          onShowNotification={showNotification} 
          onOpenFullMap={handleOpenFullMap}
          onOpenDeliveryChat={handleOpenDeliveryChat}
          onOpenRefund={handleOpenRefund}
          orders={orders}
          onUpdateOrder={handleUpdateOrder}
          onShowConfirmation={showConfirmation}
        />;
      case 'delivery_chat':
        return <DeliveryPartnerChatScreen
          onBack={goBack}
          onShowNotification={showNotification}
          orders={orders}
        />;
      case 'full_map':
        return <FullMapViewScreen 
          onBack={goBack} 
          onShowNotification={showNotification}
          onGoHome={handleGoHome}
          onOpenDeliveryChat={handleOpenDeliveryChat}
          orders={orders}
        />;
      case 'promo_codes':
        return <PromoCodesScreen onBack={goBack} onShowNotification={showNotification} onApplyPromoCode={handleApplyPromoCode} />;
      case 'restaurant':
        return selectedRestaurant ? (
          <RestaurantScreen
            restaurant={selectedRestaurant}
            onAddToCart={addToCart}
            onBack={goBack}
            cartItems={cartItems}
          />
        ) : <HomeScreen 
          onRestaurantClick={openRestaurant} 
          currentLocation={currentLocation} 
          onShowPromoModal={handleShowPromoModal} 
          onTrackOrder={handleTrackOrder}
          favoriteRestaurants={favoriteRestaurants}
          onToggleFavorite={toggleFavorite}
        />;
      default:
        return <HomeScreen 
          onRestaurantClick={openRestaurant} 
          currentLocation={currentLocation} 
          onShowPromoModal={handleShowPromoModal} 
          onTrackOrder={handleTrackOrder}
          favoriteRestaurants={favoriteRestaurants}
          onToggleFavorite={toggleFavorite}
        />;
    }
  };

  const showBackButton = ['search', 'cart', 'notifications', 'feedback', 'order_tracking', 'promo_codes', 'full_map', 'favorites', 'help_support', 'delivery_chat', 'refund'].includes(currentScreen);

  return (
    <div className="h-screen bg-background flex flex-col max-w-md mx-auto mx-6 p-4 pt-6 relative">
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        type={confirmation.type}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
      />

      {/* Notifications */}
      <div className="fixed top-28 left-10 right-10 z-50 space-y-2 max-w-md mx-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-card animate-slide-up ${
              notification.type === 'success' ? 'bg-success text-success-foreground' :
              notification.type === 'error' ? 'bg-destructive text-destructive-foreground' :
              'bg-card text-card-foreground border border-border'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles size={16} />
              <span className="text-sm">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button Header for specific screens */}
      {showBackButton && (
        <div className="bg-card border-b border-border p-4 shadow-soft sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <button
              onClick={goBack}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">
              {currentScreen === 'search' ? 'Search' :
               currentScreen === 'cart' ? 'Your Cart' :
               currentScreen === 'notifications' ? 'Notifications' :
               currentScreen === 'feedback' ? 'Feedback' :
               currentScreen === 'order_tracking' ? 'Track Order' :
               currentScreen === 'full_map' ? 'Live Tracking' :
               currentScreen === 'delivery_chat' ? 'Chat with Delivery Partner' :
               currentScreen === 'promo_codes' ? 'Promo Codes' :
               currentScreen === 'favorites' ? 'My Favorites' :
               currentScreen === 'help_support' ? 'Help & Support' :
               currentScreen === 'refund' ? 'Refund Status' :
               'Back'}
            </h1>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      {currentScreen !== 'restaurant' && currentScreen !== 'feedback' && !showBackButton && (
        <NavigationBar
          user={user}
          currentLocation={currentLocation}
          currentScreen={currentScreen}
          onLocationChange={handleLocationChange}
          onSearchFocus={handleSearchFocus}
          onNotificationClick={handleNotificationClick}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="animate-fade-in">
          {renderScreen()}
        </div>
      </div>

      {/* Bottom Navigation - Improved spacing and layout */}
      {!['feedback', 'delivery_chat'].includes(currentScreen) && (
        <div className="sticky bottom-0 bg-card border-t border-border shadow-float z-30">
          <div className="flex items-center justify-between py-4 px-8">
            <button
              onClick={() => navigateToScreen('home')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                currentScreen === 'home' 
                  ? 'text-primary bg-accent shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Home size={22} />
              <span className="text-xs mt-1 font-medium">Home</span>
            </button>

            <button
              onClick={() => navigateToScreen('search')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                currentScreen === 'search' 
                  ? 'text-primary bg-accent shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Search size={22} />
              <span className="text-xs mt-1 font-medium">Search</span>
            </button>

            <button
              onClick={() => navigateToScreen('cart')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 relative ${
                currentScreen === 'cart' 
                  ? 'text-primary bg-accent shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
                  {cartItemsCount}
                </div>
              )}
              <span className="text-xs mt-1 font-medium">Cart</span>
              {cartTotal > 0 && (
                <span className="text-xs text-primary font-medium">
                  ${cartTotal.toFixed(2)}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateToScreen('profile')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                currentScreen === 'profile' 
                  ? 'text-primary bg-accent shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <User size={22} />
              <span className="text-xs mt-1 font-medium">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}