import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingBag, 
  Menu, 
  Store, 
  Truck, 
  BarChart3, 
  Settings, 
  Bell,
  Plus,
  Search,
  Filter,
  Clock,
  Star,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Activity,
  X,
  Camera,
  Upload,
  Save,
  ArrowLeft,
  LogOut,
  Zap,
  Award,
  Target,
  ChefHat,
  Timer,
  Sparkles,
  HelpCircle,
  Mail,
  MessageCircle,
  FileText,
  Shield,
  Book,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { User, Order, MenuItem, Restaurant, CartItem } from '../App';

type RestaurantScreen = 'dashboard' | 'orders' | 'menu' | 'profile' | 'delivery' | 'analytics' | 'settings' | 'add_item' | 'edit_item';

interface RestaurantOrder extends Order {
  customerName: string;
  customerPhone: string;
  preparationTime: number;
  deliveryPartner?: {
    id: string;
    name: string;
    phone: string;
    location: string;
    eta: string;
  };
}

interface RestaurantStats {
  todayOrders: number;
  todayRevenue: number;
  avgRating: number;
  completionRate: number;
  pendingOrders: number;
  preparingOrders: number;
}

interface RestaurantOwnerAppProps {
  user: User;
  onLogout: () => void;
  onShowNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface NewMenuItem {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  newCategory?: string;
  isVeg: boolean;
  isPopular: boolean;
  isNew: boolean;
  preparationTime: string;
  calories?: string;
  spiceLevel: 'mild' | 'medium' | 'spicy';
}

interface OperatingHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

interface OperationalSettings {
  avgPrepTime: number;
  deliveryRadius: number;
  maxOrdersPerHour: number;
}

interface DeliveryPartner {
  id: string;
  name: string;
  rating: number;
  deliveries: number;
  distance: string;
  isAvailable: boolean;
}

const defaultNewItem: NewMenuItem = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  image: '',
  category: '',
  newCategory: '',
  isVeg: true,
  isPopular: false,
  isNew: true,
  preparationTime: '',
  calories: '',
  spiceLevel: 'mild'
};

const defaultOperatingHours: OperatingHours = {
  Monday: { open: '09:00', close: '22:00', isOpen: true },
  Tuesday: { open: '09:00', close: '22:00', isOpen: true },
  Wednesday: { open: '09:00', close: '22:00', isOpen: true },
  Thursday: { open: '09:00', close: '22:00', isOpen: true },
  Friday: { open: '09:00', close: '23:00', isOpen: true },
  Saturday: { open: '10:00', close: '23:00', isOpen: true },
  Sunday: { open: '10:00', close: '21:00', isOpen: true }
};

const defaultOperationalSettings: OperationalSettings = {
  avgPrepTime: 20,
  deliveryRadius: 5,
  maxOrdersPerHour: 15
};

export function RestaurantOwnerApp({ user, onLogout, onShowNotification }: RestaurantOwnerAppProps) {
  const [currentScreen, setCurrentScreen] = useState<RestaurantScreen>('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<RestaurantScreen[]>(['dashboard']);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('All');
  const [selectedAnalyticsPeriod, setSelectedAnalyticsPeriod] = useState<string>('Today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<NewMenuItem>(defaultNewItem);
  const [operatingHours, setOperatingHours] = useState<OperatingHours>(defaultOperatingHours);
  const [operationalSettings, setOperationalSettings] = useState<OperationalSettings>(defaultOperationalSettings);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    autoAcceptOrders: false
  });
  const [restaurant, setRestaurant] = useState<Restaurant>({
    id: '1',
    name: 'The Gourmet Kitchen',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'American',
    rating: 4.6,
    reviewCount: 324,
    deliveryTime: '25-35',
    deliveryFee: 2.99,
    minOrder: 15,
    isOpen: true,
    distance: 0.8,
    offers: ['Free delivery on orders over $30'],
    tags: ['Popular', 'Fast Delivery'],
    phone: '+1 (555) 987-6543'
  });
  const [stats, setStats] = useState<RestaurantStats>({
    todayOrders: 28,
    todayRevenue: 847.50,
    avgRating: 4.6,
    completionRate: 94,
    pendingOrders: 5,
    preparingOrders: 3
  });

  // Available categories
  const categories = ['Burgers', 'Pasta', 'Salads', 'Drinks', 'Desserts', 'Pizza', 'Appetizers', 'Soups'];

  // Define main navigation screens (these don't need back buttons)
  const mainScreens: RestaurantScreen[] = ['dashboard', 'orders', 'menu', 'delivery', 'analytics', 'settings'];

  // Sample data
  useEffect(() => {
    // Sample orders with more variety for better testing
    const sampleOrders: RestaurantOrder[] = [
      {
        id: 'FY001234',
        customerName: 'John Smith',
        customerPhone: '+1 (555) 123-4567',
        preparationTime: 15,
        items: [
          {
            id: 'burger-1',
            name: 'Classic Cheeseburger',
            price: 12.99,
            quantity: 2,
            restaurantId: '1',
            restaurantName: 'The Gourmet Kitchen',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
          }
        ],
        restaurant: {
          id: '1',
          name: 'The Gourmet Kitchen',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
          phone: '+1 (555) 987-6543'
        },
        total: 28.97,
        subtotal: 25.98,
        deliveryFee: 2.99,
        tax: 0,
        status: 'placed',
        placedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
        deliveryAddress: '123 Main St, New York, NY 10001',
        paymentMethod: 'Paid by Visa ending 1234',
        trackingUpdates: [{
          time: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          message: 'Order received',
          status: 'placed'
        }]
      },
      {
        id: 'FY001235',
        customerName: 'Sarah Davis',
        customerPhone: '+1 (555) 234-5678',
        preparationTime: 20,
        items: [
          {
            id: 'pasta-1',
            name: 'Chicken Alfredo',
            price: 16.99,
            quantity: 1,
            restaurantId: '1',
            restaurantName: 'The Gourmet Kitchen',
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d30e?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
          }
        ],
        restaurant: {
          id: '1',
          name: 'The Gourmet Kitchen',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
          phone: '+1 (555) 987-6543'
        },
        total: 22.23,
        subtotal: 16.99,
        deliveryFee: 2.99,
        tax: 2.25,
        status: 'preparing',
        placedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        deliveryAddress: '456 Oak Ave, New York, NY 10002',
        paymentMethod: 'Cash on Delivery',
        trackingUpdates: [
          {
            time: new Date(Date.now() - 10 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order confirmed and being prepared',
            status: 'preparing'
          },
          {
            time: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order received',
            status: 'placed'
          }
        ]
      },
      {
        id: 'FY001236',
        customerName: 'Mike Wilson',
        customerPhone: '+1 (555) 345-6789',
        preparationTime: 25,
        items: [
          {
            id: 'pizza-1',
            name: 'Margherita Pizza',
            price: 14.99,
            quantity: 1,
            restaurantId: '1',
            restaurantName: 'The Gourmet Kitchen',
            image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
          }
        ],
        restaurant: {
          id: '1',
          name: 'The Gourmet Kitchen',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
          phone: '+1 (555) 987-6543'
        },
        total: 20.23,
        subtotal: 14.99,
        deliveryFee: 2.99,
        tax: 2.25,
        status: 'ready',
        placedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        deliveryAddress: '789 Pine St, New York, NY 10003',
        paymentMethod: 'Paid by Mastercard ending 5678',
        trackingUpdates: [
          {
            time: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order is ready for pickup',
            status: 'ready'
          },
          {
            time: new Date(Date.now() - 20 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Kitchen is preparing your order',
            status: 'preparing'
          }
        ]
      },
      {
        id: 'FY001237',
        customerName: 'Lisa Chen',
        customerPhone: '+1 (555) 456-7890',
        preparationTime: 18,
        items: [
          {
            id: 'salad-1',
            name: 'Caesar Salad',
            price: 9.99,
            quantity: 2,
            restaurantId: '1',
            restaurantName: 'The Gourmet Kitchen',
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
          }
        ],
        restaurant: {
          id: '1',
          name: 'The Gourmet Kitchen',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
          phone: '+1 (555) 987-6543'
        },
        total: 24.97,
        subtotal: 19.98,
        deliveryFee: 2.99,
        tax: 2.00,
        status: 'delivered',
        placedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        deliveryAddress: '321 Elm St, New York, NY 10004',
        paymentMethod: 'Paid by Apple Pay',
        trackingUpdates: [
          {
            time: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order delivered successfully',
            status: 'delivered'
          },
          {
            time: new Date(Date.now() - 45 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order out for delivery',
            status: 'picked_up'
          }
        ],
        deliveryPartner: {
          id: 'dp2',
          name: 'Sarah Wilson',
          phone: '+1 (555) 888-9999',
          location: 'delivered',
          eta: 'completed'
        }
      }
    ];

    // Sample menu items
    const sampleMenuItems: MenuItem[] = [
      {
        id: 'burger-1',
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        category: 'Burgers',
        isVeg: false,
        isPopular: true,
        rating: 4.8,
        preparationTime: '12-15 mins'
      },
      {
        id: 'pasta-1',
        name: 'Chicken Alfredo',
        description: 'Creamy alfredo sauce with grilled chicken and fettuccine pasta',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d30e?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        category: 'Pasta',
        isVeg: false,
        isPopular: true,
        rating: 4.6,
        preparationTime: '15-20 mins'
      },
      {
        id: 'salad-1',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        category: 'Salads',
        isVeg: true,
        rating: 4.4,
        preparationTime: '5-8 mins'
      },
      {
        id: 'pizza-1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, basil, and tomato sauce on crispy crust',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        category: 'Pizza',
        isVeg: true,
        isPopular: true,
        rating: 4.7,
        preparationTime: '18-22 mins'
      },
      {
        id: 'drink-1',
        name: 'Fresh Lemonade',
        description: 'Refreshing homemade lemonade with fresh lemons and mint',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1523371683702-30ab9bbaf7d2?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
        category: 'Drinks',
        isVeg: true,
        rating: 4.3,
        preparationTime: '2-3 mins'
      }
    ];

    // Sample delivery partners
    const sampleDeliveryPartners: DeliveryPartner[] = [
      { id: '1', name: 'Mike Johnson', rating: 4.8, deliveries: 234, distance: '0.5 km', isAvailable: true },
      { id: '2', name: 'Sarah Wilson', rating: 4.9, deliveries: 189, distance: '0.8 km', isAvailable: false }, // Assigned to delivered order
      { id: '3', name: 'David Chen', rating: 4.7, deliveries: 156, distance: '1.2 km', isAvailable: true },
      { id: '4', name: 'Emma Rodriguez', rating: 4.6, deliveries: 98, distance: '0.7 km', isAvailable: true }
    ];

    setOrders(sampleOrders);
    setMenuItems(sampleMenuItems);
    setDeliveryPartners(sampleDeliveryPartners);
  }, []);

  // Navigation helper functions
  const navigateToScreen = (screen: RestaurantScreen) => {
    // Don't add to history if we're already on this screen
    if (currentScreen === screen) return;
    
    // Add current screen to history before navigating
    setNavigationHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    // Special handling for certain screens
    if (currentScreen === 'add_item' || currentScreen === 'edit_item') {
      setCurrentScreen('menu');
      setEditingItem(null);
      setNewItem(defaultNewItem);
      // Don't update navigation history for these special cases
      return;
    }

    // Use navigation history if available
    if (navigationHistory.length > 1) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      // Fallback to dashboard if no history
      setCurrentScreen('dashboard');
      setNavigationHistory(['dashboard']);
    }
  };

  // Check if current screen needs a back button
  const showBackButton = !mainScreens.includes(currentScreen);

  const handleUpdateOrderStatus = (orderId: string, status: RestaurantOrder['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status };
        
        // Add tracking update
        const statusMessages = {
          confirmed: 'Order confirmed and being prepared',
          preparing: 'Kitchen is preparing your order',
          ready: 'Order is ready for pickup',
          picked_up: 'Order picked up by delivery partner',
          delivered: 'Order delivered successfully'
        };
        
        if (statusMessages[status]) {
          updatedOrder.trackingUpdates = [
            {
              time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              message: statusMessages[status],
              status
            },
            ...order.trackingUpdates
          ];
        }
        
        return updatedOrder;
      }
      return order;
    }));
    
    onShowNotification(`Order ${orderId} status updated to ${status}`, 'success');
  };

  const handleUpdateOperatingHours = (day: string, field: 'open' | 'close' | 'isOpen', value: string | boolean) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveOperatingHours = () => {
    // In a real app, this would save to backend
    onShowNotification('Operating hours updated successfully!', 'success');
  };

  const handleUpdateOperationalSettings = (field: keyof OperationalSettings, value: number) => {
    setOperationalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveOperationalSettings = () => {
    // In a real app, this would save to backend
    onShowNotification('Operational settings updated successfully!', 'success');
  };

  const handleToggleNotificationSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    onShowNotification(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${notificationSettings[setting] ? 'disabled' : 'enabled'}`, 'info');
  };

  const handleToggleRestaurantStatus = () => {
    setRestaurant(prev => ({ ...prev, isOpen: !prev.isOpen }));
    onShowNotification(
      `Restaurant is now ${!restaurant.isOpen ? 'online and accepting orders' : 'offline'}`, 
      !restaurant.isOpen ? 'success' : 'info'
    );
  };

  const handleAssignDeliveryPartner = (partnerId: string, orderId?: string) => {
    const partner = deliveryPartners.find(p => p.id === partnerId);
    if (!partner) {
      onShowNotification('Delivery partner not found', 'error');
      return;
    }

    if (!partner.isAvailable) {
      onShowNotification(`${partner.name} is currently busy with another delivery`, 'error');
      return;
    }

    // Find a ready order to assign, or use the specific order if provided
    let targetOrder;
    if (orderId) {
      targetOrder = orders.find(o => o.id === orderId);
    } else {
      targetOrder = orders.find(o => o.status === 'ready' && !o.deliveryPartner);
    }

    if (!targetOrder) {
      onShowNotification('No orders ready for pickup', 'info');
      return;
    }

    // Update the order with delivery partner info
    setOrders(prev => prev.map(order => {
      if (order.id === targetOrder.id) {
        return {
          ...order,
          deliveryPartner: {
            id: partnerId,
            name: partner.name,
            phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
            location: partner.distance,
            eta: '10-15 mins'
          }
        };
      }
      return order;
    }));
    
    // Mark delivery partner as unavailable
    setDeliveryPartners(prev => prev.map(p => 
      p.id === partnerId ? { ...p, isAvailable: false } : p
    ));
    
    onShowNotification(`${partner.name} assigned to order ${targetOrder.id}`, 'success');
  };

  const handleAddMenuItem = () => {
    // Validate required fields
    if (!newItem.name.trim()) {
      onShowNotification('Please enter item name', 'error');
      return;
    }
    if (!newItem.description.trim()) {
      onShowNotification('Please enter item description', 'error');
      return;
    }
    if (!newItem.price || parseFloat(newItem.price) <= 0) {
      onShowNotification('Please enter valid price', 'error');
      return;
    }
    if (!newItem.category && !newItem.newCategory) {
      onShowNotification('Please select or enter a category', 'error');
      return;
    }
    if (!newItem.preparationTime.trim()) {
      onShowNotification('Please enter preparation time', 'error');
      return;
    }

    const category = newItem.newCategory?.trim() || newItem.category;
    
    const menuItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: parseFloat(newItem.price),
      originalPrice: newItem.originalPrice ? parseFloat(newItem.originalPrice) : undefined,
      image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      category,
      isVeg: newItem.isVeg,
      isPopular: newItem.isPopular,
      isNew: newItem.isNew,
      preparationTime: newItem.preparationTime.trim(),
      calories: newItem.calories ? parseInt(newItem.calories) : undefined,
      spiceLevel: newItem.spiceLevel,
      rating: 0
    };

    setMenuItems(prev => [...prev, menuItem]);
    setNewItem(defaultNewItem);
    setCurrentScreen('menu');
    onShowNotification(`${menuItem.name} added to menu successfully!`, 'success');
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      originalPrice: item.originalPrice?.toString() || '',
      image: item.image,
      category: item.category,
      newCategory: '',
      isVeg: item.isVeg,
      isPopular: item.isPopular || false,
      isNew: item.isNew || false,
      preparationTime: item.preparationTime || '',
      calories: item.calories?.toString() || '',
      spiceLevel: item.spiceLevel || 'mild'
    });
    navigateToScreen('edit_item');
  };

  const handleUpdateMenuItem = () => {
    if (!editingItem) return;

    // Validate required fields
    if (!newItem.name.trim()) {
      onShowNotification('Please enter item name', 'error');
      return;
    }
    if (!newItem.description.trim()) {
      onShowNotification('Please enter item description', 'error');
      return;
    }
    if (!newItem.price || parseFloat(newItem.price) <= 0) {
      onShowNotification('Please enter valid price', 'error');
      return;
    }

    const category = newItem.newCategory?.trim() || newItem.category;
    
    const updatedItem: MenuItem = {
      ...editingItem,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: parseFloat(newItem.price),
      originalPrice: newItem.originalPrice ? parseFloat(newItem.originalPrice) : undefined,
      image: newItem.image || editingItem.image,
      category,
      isVeg: newItem.isVeg,
      isPopular: newItem.isPopular,
      isNew: newItem.isNew,
      preparationTime: newItem.preparationTime.trim(),
      calories: newItem.calories ? parseInt(newItem.calories) : undefined,
      spiceLevel: newItem.spiceLevel
    };

    setMenuItems(prev => prev.map(item => 
      item.id === editingItem.id ? updatedItem : item
    ));
    setEditingItem(null);
    setNewItem(defaultNewItem);
    setCurrentScreen('menu');
    onShowNotification(`${updatedItem.name} updated successfully!`, 'success');
  };

  const handleDeleteMenuItem = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
      setMenuItems(prev => prev.filter(i => i.id !== itemId));
      onShowNotification(`${item.name} removed from menu`, 'info');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server and get back a URL
      // For demo purposes, we'll use a placeholder
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
      onShowNotification('Image uploaded successfully!', 'success');
    }
  };

  const handleSaveRestaurantProfile = () => {
    // In a real app, this would save to backend
    onShowNotification('Restaurant profile updated successfully!', 'success');
  };

  const handleContactAction = (action: string) => {
    if (action.includes('Call:')) {
      onShowNotification('Opening phone dialer...', 'info');
    } else if (action === 'Start Chat') {
      onShowNotification('Starting live chat...', 'info');
    } else if (action.includes('@')) {
      onShowNotification('Opening email client...', 'info');
    }
  };

  const handleQuickLink = (title: string) => {
    onShowNotification(`Opening ${title}...`, 'info');
  };

  // Filter menu items based on category and search
  const filteredMenuItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (selectedOrderStatus === 'All') return true;
    return order.status.toLowerCase() === selectedOrderStatus.toLowerCase();
  });

  // Get all unique categories from menu items
  const allCategories = ['All', ...Array.from(new Set([...categories, ...menuItems.map(item => item.category)]))];

  const renderDashboard = () => {
    // Get current time for dynamic greeting
    const currentHour = new Date().getHours();
    const getGreetingTime = () => {
      if (currentHour < 12) return 'Good morning';
      if (currentHour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    const getTimeIcon = () => {
      if (currentHour < 12) return '☀️';
      if (currentHour < 18) return '☀️';
      return '🌙';
    };

    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 overflow-y-auto scrollbar-soft">
          <div className="space-y-6 px-4 pb-6">
            {/* Enhanced Hero Section - Exact Match to End User Design */}
            <div className="bg-gradient-to-br from-primary via-orange-500 to-red-500 relative overflow-hidden -mx-4">
              {/* Animated background elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-8 translate-x-8 animate-float"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-4 -translate-x-4 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-white/20 rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-white/20 rounded-full animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
              </div>
              
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              
              <div className="relative z-10 px-6 pb-6">
                <div className="text-center text-white">
                  {/* Dynamic greeting with time-based icon - Exact match to end user */}
                  <div className="flex items-center justify-center space-x-2 mb-3 pt-4">
                    <span className="text-xl animate-pulse-soft">{getTimeIcon()}</span>
                    <h1 className="text-xl font-bold pt-4">
                      {getGreetingTime()}! 👋
                    </h1>
                  </div>
                  
                  {/* Main question with enhanced styling - Exact match to end user */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2 text-white leading-tight">
                      What would you like to
                    </h2>
                    <h2 className="text-2xl font-bold mb-3 text-yellow-300 leading-tight">
                      cook today?
                    </h2>
                    
                    {/* Food emojis with animation - Exact match to end user */}
                    <div className="flex justify-center space-x-2 mb-4">
                      {['🍕', '🍔', '🍜', '🥗', '🍰'].map((emoji, index) => (
                        <span 
                          key={index} 
                          className="text-xl animate-bounce-in"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Restaurant status card - Exact match to end user design */}
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-elevated">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Home size={16} className="text-white" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-white/80 font-medium">Restaurant Status</span>
                          <Sparkles size={10} className="text-yellow-300 animate-pulse-soft" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-base font-bold text-white">{restaurant.name}</span>
                          <ChevronRight size={12} className="text-white/60" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-white/80">
                        <Zap size={12} className="text-yellow-300" />
                        <span>{restaurant.isOpen ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid with Soft UI Design */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group bg-gradient-to-br from-card to-accent/20 p-4 rounded-2xl border border-border shadow-card hover:shadow-float transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <ShoppingBag className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.todayOrders}</p>
                    <p className="text-sm text-muted-foreground">Today's Orders</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full w-3/4 animate-pulse-soft"></div>
                  </div>
                  <span className="text-xs text-success font-semibold bg-success/10 px-2 py-1 rounded-full">+12%</span>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-card to-success/5 p-4 rounded-2xl border border-border shadow-card hover:shadow-float transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <DollarSign className="text-success" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">${stats.todayRevenue}</p>
                    <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full w-4/5 animate-pulse-soft"></div>
                  </div>
                  <span className="text-xs text-success font-semibold bg-success/10 px-2 py-1 rounded-full">+8%</span>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-card to-warning/5 p-4 rounded-2xl border border-border shadow-card hover:shadow-float transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning/20 to-warning/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <Star className="text-warning" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.avgRating}</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.floor(stats.avgRating) ? 'text-warning fill-warning animate-pulse-soft' : 'text-muted-foreground'}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2 bg-muted/50 px-2 py-1 rounded-full">{restaurant.reviewCount} reviews</span>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-card to-primary/5 p-4 rounded-2xl border border-border shadow-card hover:shadow-float transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <Target className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.completionRate}%</p>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full animate-pulse-soft" 
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-success font-semibold bg-success/10 px-2 py-1 rounded-full">Excellent</span>
                </div>
              </div>
            </div>

            {/* Active Orders Section */}
            <div className="bg-gradient-to-br from-card to-accent/10 p-5 rounded-2xl border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-soft">
                    <Activity className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Active Orders</h3>
                    <p className="text-sm text-muted-foreground">Live orders needing attention</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-gradient-to-r from-warning/15 to-warning/5 px-3 py-2 rounded-xl border border-warning/20 shadow-soft">
                    <span className="text-warning text-sm font-semibold">
                      {orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length} Pending
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-primary/15 to-primary/5 px-3 py-2 rounded-xl border border-primary/20 shadow-soft">
                    <span className="text-primary text-sm font-semibold">
                      {orders.filter(o => o.status === 'preparing').length} Preparing
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {orders.filter(order => ['placed', 'confirmed', 'preparing', 'ready'].includes(order.status)).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                      <ShoppingBag className="text-muted-foreground" size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">All caught up! 🎉</h3>
                    <p className="text-muted-foreground text-sm">No active orders at the moment</p>
                    <div className="mt-3 bg-gradient-to-r from-success/10 to-success/5 px-3 py-2 rounded-xl inline-block">
                      <span className="text-success text-sm font-medium">Perfect time to prepare for rush hours!</span>
                    </div>
                  </div>
                ) : (
                  orders.filter(order => ['placed', 'confirmed', 'preparing', 'ready'].includes(order.status)).slice(0, 3).map((order) => (
                    <div key={order.id} className="group p-4 bg-gradient-to-r from-muted/20 to-transparent rounded-xl border border-border hover:shadow-card transition-all duration-300 hover:scale-[1.01]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                            <span className="text-primary font-bold text-sm">#{order.id.slice(-4)}</span>
                          </div>
                          <div>
                            <p className="font-bold">{order.customerName}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'placed' ? 'bg-warning/15 text-warning border border-warning/20' :
                                order.status === 'preparing' ? 'bg-primary/15 text-primary border border-primary/20' :
                                order.status === 'ready' ? 'bg-success/15 text-success border border-success/20' :
                                'bg-info/15 text-info border border-info/20'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <div className="flex items-center space-x-1 text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                                <Timer size={10} />
                                <span className="text-xs">{order.preparationTime}m</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">${order.total.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-2 mb-2">
                        <p className="text-xs text-muted-foreground">
                          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                            <Phone size={10} />
                            <span className="text-xs">Call</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                            <MessageSquare size={10} />
                            <span className="text-xs">Chat</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          <span>{new Date(order.placedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="bg-gradient-to-br from-card to-accent/10 p-5 rounded-2xl border border-border shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-soft">
                  <Zap className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Quick Actions</h3>
                  <p className="text-sm text-muted-foreground">Fast access to common tasks</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigateToScreen('add_item')}
                  className="group p-4 bg-gradient-to-br from-primary/15 to-primary/5 text-primary rounded-xl flex flex-col items-center space-y-2 hover:from-primary/25 hover:to-primary/10 transition-all duration-300 hover:scale-[1.02] border border-primary/20 shadow-soft"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <Plus size={18} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Add Menu Item</p>
                    <p className="text-xs text-primary/80">Create new dish</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigateToScreen('orders')}
                  className="group p-4 bg-gradient-to-br from-success/15 to-success/5 text-success rounded-xl flex flex-col items-center space-y-2 hover:from-success/25 hover:to-success/10 transition-all duration-300 hover:scale-[1.02] border border-success/20 shadow-soft"
                >
                  <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <Eye size={18} className="text-success" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">View All Orders</p>
                    <p className="text-xs text-success/80">Manage orders</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigateToScreen('profile')}
                  className="group p-4 bg-gradient-to-br from-warning/15 to-warning/5 text-warning rounded-xl flex flex-col items-center space-y-2 hover:from-warning/25 hover:to-warning/10 transition-all duration-300 hover:scale-[1.02] border border-warning/20 shadow-soft"
                >
                  <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <Store size={18} className="text-warning" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Edit Restaurant</p>
                    <p className="text-xs text-warning/80">Update profile</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => navigateToScreen('analytics')}
                  className="group p-4 bg-gradient-to-br from-muted/50 to-muted/30 text-foreground rounded-xl flex flex-col items-center space-y-2 hover:from-muted/70 hover:to-muted/50 transition-all duration-300 hover:scale-[1.02] border border-border shadow-soft"
                >
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-soft">
                    <BarChart3 size={18} className="text-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">View Analytics</p>
                    <p className="text-xs text-muted-foreground">Check insights</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Performance Insights Section */}
            <div className="bg-gradient-to-br from-card via-accent/5 to-primary/5 p-5 rounded-2xl border border-border shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-soft">
                  <Award className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Performance Insights</h3>
                  <p className="text-sm text-muted-foreground">Your restaurant is performing excellently today! 🚀</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="group text-center p-3 bg-gradient-to-br from-card/80 to-success/5 rounded-xl border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
                  <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-success" size={16} />
                  </div>
                  <p className="text-lg font-bold text-success">+15%</p>
                  <p className="text-xs text-muted-foreground">Orders vs Yesterday</p>
                </div>
                
                <div className="group text-center p-3 bg-gradient-to-br from-card/80 to-primary/5 rounded-xl border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Users className="text-primary" size={16} />
                  </div>
                  <p className="text-lg font-bold text-primary">89%</p>
                  <p className="text-xs text-muted-foreground">Customer Satisfaction</p>
                </div>
                
                <div className="group text-center p-3 bg-gradient-to-br from-card/80 to-warning/5 rounded-xl border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 hover:scale-[1.02]">
                  <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                    <Clock className="text-warning" size={16} />
                  </div>
                  <p className="text-lg font-bold text-warning">18m</p>
                  <p className="text-xs text-muted-foreground">Avg Prep Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onShowNotification('Order filters applied', 'info')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Filter size={16} />
          </button>
          <button 
            onClick={() => onShowNotification('Search orders by ID or customer name', 'info')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Order Status Filter */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-soft">
        {['All', 'Placed', 'Preparing', 'Ready', 'Delivered'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setSelectedOrderStatus(status);
              onShowNotification(`Showing ${status.toLowerCase()} orders`, 'info');
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              status === selectedOrderStatus 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-muted-foreground" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No {selectedOrderStatus.toLowerCase()} orders</h3>
            <p className="text-muted-foreground">
              {selectedOrderStatus === 'All' ? 'No orders found' : `No ${selectedOrderStatus.toLowerCase()} orders to display`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-card p-4 rounded-xl border border-border shadow-soft">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold">#{order.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'placed' ? 'bg-warning/10 text-warning' :
                      order.status === 'preparing' ? 'bg-primary/10 text-primary' :
                      order.status === 'ready' ? 'bg-success/10 text-success' :
                      order.status === 'delivered' ? 'bg-muted text-muted-foreground' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName} • {new Date(order.placedAt).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{order.preparationTime} mins</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Customer Info */}
              <div className="flex items-center justify-between mb-4 p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users size={14} />
                  <span className="text-sm">{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={14} />
                  <span className="text-sm">{order.customerPhone}</span>
                </div>
              </div>

              {/* Delivery Info */}
              {order.deliveryPartner && (
                <div className="flex items-center justify-between mb-4 p-2 bg-primary/5 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Truck size={14} />
                    <span className="text-sm">{order.deliveryPartner.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin size={12} />
                    <span>{order.deliveryPartner.location}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {order.status === 'placed' && (
                  <>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                      className="flex-1 bg-success text-success-foreground py-2 px-3 rounded-lg text-sm font-medium hover:bg-success/90 transition-colors"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                      className="flex-1 bg-destructive text-destructive-foreground py-2 px-3 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                    className="flex-1 bg-primary text-primary-foreground py-2 px-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                    className="flex-1 bg-warning text-warning-foreground py-2 px-3 rounded-lg text-sm font-medium hover:bg-warning/90 transition-colors"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(order.id, 'picked_up')}
                    className="flex-1 bg-success text-success-foreground py-2 px-3 rounded-lg text-sm font-medium hover:bg-success/90 transition-colors"
                  >
                    Picked Up
                  </button>
                )}
                <button 
                  onClick={() => onShowNotification(`Opening chat with ${order.customerName}`, 'info')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <button 
          onClick={() => navigateToScreen('add_item')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-soft">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              onShowNotification(`Showing ${category.toLowerCase()} items`, 'info');
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              category === selectedCategory 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category} {category !== 'All' && `(${menuItems.filter(item => item.category === category).length})`}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-4">
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Menu className="text-muted-foreground" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first menu item'}
            </p>
            <button 
              onClick={() => navigateToScreen('add_item')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add Menu Item
            </button>
          </div>
        ) : (
          filteredMenuItems.map((item) => (
            <div key={item.id} className="bg-card p-4 rounded-xl border border-border shadow-soft">
              <div className="flex space-x-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.isPopular && (
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">Popular</span>
                        )}
                        {item.isNew && (
                          <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs">New</span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${item.price}
                        {item.originalPrice && (
                          <span className="text-muted-foreground line-through ml-2 text-sm">
                            ${item.originalPrice}
                          </span>
                        )}
                      </p>
                      {item.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="text-warning" size={12} />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-success' : 'bg-destructive'}`}></span>
                        <span className="text-xs">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                      </div>
                      {item.preparationTime && (
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span className="text-xs">{item.preparationTime}</span>
                        </div>
                      )}
                      {item.spiceLevel && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.spiceLevel === 'mild' ? 'bg-success/10 text-success' :
                          item.spiceLevel === 'medium' ? 'bg-warning/10 text-warning' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {item.spiceLevel} spice
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditMenuItem(item)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAddEditItem = () => (
    <div className="p-4 space-y-6">
      {/* Image Upload */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Item Photo</h3>
        <div className="space-y-3">
          {newItem.image ? (
            <div className="relative">
              <img 
                src={newItem.image} 
                alt="Item preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => setNewItem(prev => ({ ...prev, image: '' }))}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="mx-auto mb-4 text-muted-foreground" size={32} />
              <p className="text-muted-foreground mb-4">Upload an image for your menu item</p>
              <label className="bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors inline-flex items-center space-x-2">
                <Upload size={16} />
                <span>Choose Image</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Item Name *</label>
            <input 
              type="text" 
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Classic Cheeseburger"
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description *</label>
            <textarea 
              rows={3}
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your menu item..."
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Price * ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Original Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={newItem.originalPrice}
                onChange={(e) => setNewItem(prev => ({ ...prev, originalPrice: e.target.value }))}
                placeholder="0.00"
                className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category & Details */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Category & Details</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Category *</label>
            <select 
              value={newItem.category}
              onChange={(e) => setNewItem(prev => ({ 
                ...prev, 
                category: e.target.value,
                newCategory: e.target.value === 'new' ? prev.newCategory : ''
              }))}
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="new">+ Add New Category</option>
            </select>
          </div>
          {newItem.category === 'new' && (
            <div>
              <label className="text-sm font-medium mb-1 block">New Category Name</label>
              <input 
                type="text" 
                value={newItem.newCategory}
                onChange={(e) => setNewItem(prev => ({ ...prev, newCategory: e.target.value }))}
                placeholder="Enter new category name"
                className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Preparation Time *</label>
              <input 
                type="text" 
                value={newItem.preparationTime}
                onChange={(e) => setNewItem(prev => ({ ...prev, preparationTime: e.target.value }))}
                placeholder="e.g. 15-20 mins"
                className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Calories</label>
              <input 
                type="number" 
                value={newItem.calories}
                onChange={(e) => setNewItem(prev => ({ ...prev, calories: e.target.value }))}
                placeholder="e.g. 350"
                className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Spice Level</label>
            <div className="flex space-x-2">
              {(['mild', 'medium', 'spicy'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setNewItem(prev => ({ ...prev, spiceLevel: level }))}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    newItem.spiceLevel === level
                      ? level === 'mild' ? 'bg-success text-success-foreground' :
                        level === 'medium' ? 'bg-warning text-warning-foreground' :
                        'bg-destructive text-destructive-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Options</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Vegetarian</p>
              <p className="text-sm text-muted-foreground">Mark this item as vegetarian</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={newItem.isVeg}
                onChange={(e) => setNewItem(prev => ({ ...prev, isVeg: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Popular Item</p>
              <p className="text-sm text-muted-foreground">Show as popular on menu</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={newItem.isPopular}
                onChange={(e) => setNewItem(prev => ({ ...prev, isPopular: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Item</p>
              <p className="text-sm text-muted-foreground">Mark as new addition to menu</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={newItem.isNew}
                onChange={(e) => setNewItem(prev => ({ ...prev, isNew: e.target.checked }))}
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex space-x-3">
        <button 
          onClick={goBack}
          className="flex-1 bg-muted text-muted-foreground py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={editingItem ? handleUpdateMenuItem : handleAddMenuItem}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
        >
          <Save size={16} />
          <span>{editingItem ? 'Update Item' : 'Add to Menu'}</span>
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 space-y-6">
      {/* Restaurant Image */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Restaurant Photo</h3>
        <div className="relative">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <button 
            onClick={() => onShowNotification('Image upload functionality would open here', 'info')}
            className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Restaurant Name</label>
            <input 
              type="text" 
              value={restaurant.name}
              onChange={(e) => setRestaurant(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Cuisine Type</label>
            <input 
              type="text" 
              value={restaurant.cuisine}
              onChange={(e) => setRestaurant(prev => ({ ...prev, cuisine: e.target.value }))}
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Delivery Time</label>
              <input 
                type="text" 
                value={restaurant.deliveryTime}
                onChange={(e) => setRestaurant(prev => ({ ...prev, deliveryTime: e.target.value }))}
                className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Minimum Order ($)</label>
              <input 
                type="number" 
                value={restaurant.minOrder}
                onChange={(e) => setRestaurant(prev => ({ ...prev, minOrder: parseFloat(e.target.value) || 0 }))}
                className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center space-x-2">
            <Clock size={16} className="text-primary" />
            <span>Operating Hours</span>
          </h3>
          <button
            onClick={handleSaveOperatingHours}
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center space-x-1"
          >
            <Save size={14} />
            <span>Save</span>
          </button>
        </div>
        <div className="space-y-3">
          {Object.entries(operatingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={hours.isOpen}
                      onChange={(e) => handleUpdateOperatingHours(day, 'isOpen', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="text-sm font-medium w-20">{day}</span>
                </div>
              </div>
              
              {hours.isOpen ? (
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
                    <input 
                      type="time" 
                      value={hours.open}
                      onChange={(e) => handleUpdateOperatingHours(day, 'open', e.target.value)}
                      className="pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
                    <input 
                      type="time" 
                      value={hours.close}
                      onChange={(e) => handleUpdateOperatingHours(day, 'close', e.target.value)}
                      className="pl-9 pr-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground font-medium">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Phone Number</label>
            <input 
              type="tel" 
              value={restaurant.phone || ''}
              onChange={(e) => setRestaurant(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Address</label>
            <textarea 
              rows={3}
              placeholder="Enter your restaurant address..."
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button 
        onClick={handleSaveRestaurantProfile}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );

  const renderDelivery = () => (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Delivery Partners</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {deliveryPartners.filter(p => p.isAvailable).length} Available
          </span>
          <div className="w-2 h-2 bg-success rounded-full"></div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Active Deliveries</h3>
        <div className="space-y-3">
          {orders.filter(order => ['ready', 'picked_up'].includes(order.status)).map((order) => (
            <div key={order.id} className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">#{order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'ready' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {order.status === 'ready' ? 'Ready for Pickup' : 'Out for Delivery'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">${order.total.toFixed(2)}</span>
              </div>
              {order.deliveryPartner && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Truck className="text-primary" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.deliveryPartner.name}</p>
                      <p className="text-xs text-muted-foreground">{order.deliveryPartner.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onShowNotification(`Calling ${order.deliveryPartner?.name}`, 'info')}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Phone size={14} />
                    </button>
                    <button 
                      onClick={() => onShowNotification(`Opening chat with ${order.deliveryPartner?.name}`, 'info')}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {orders.filter(order => ['ready', 'picked_up'].includes(order.status)).length === 0 && (
            <div className="text-center py-6">
              <Truck className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-muted-foreground">No active deliveries at the moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Available Partners */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Available Partners</h3>
        <div className="space-y-3">
          {deliveryPartners.map((partner) => (
            <div key={partner.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  partner.isAvailable ? 'bg-success/10' : 'bg-muted'
                }`}>
                  <Truck className={partner.isAvailable ? 'text-success' : 'text-muted-foreground'} size={16} />
                </div>
                <div>
                  <p className="font-medium">{partner.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="text-warning" size={10} />
                      <span>{partner.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{partner.deliveries} deliveries</span>
                    <span>•</span>
                    <span>{partner.distance} away</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onShowNotification(`Calling ${partner.name}`, 'info')}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <Phone size={14} />
                </button>
                <button 
                  onClick={() => handleAssignDeliveryPartner(partner.id)}
                  disabled={!partner.isAvailable}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    partner.isAvailable 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {partner.isAvailable ? 'Assign' : 'Busy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-4 space-y-6">
      {/* Time Period Selector */}
      <div className="flex space-x-2 overflow-x-auto scrollbar-soft">
        {['Today', 'This Week', 'This Month', 'This Year'].map((period) => (
          <button
            key={period}
            onClick={() => {
              setSelectedAnalyticsPeriod(period);
              onShowNotification(`Analytics updated for ${period.toLowerCase()}`, 'info');
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              period === selectedAnalyticsPeriod 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Revenue Overview - {selectedAnalyticsPeriod}</h3>
        <div className="h-48 bg-muted/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="text-muted-foreground mx-auto mb-2" size={32} />
            <p className="text-sm text-muted-foreground">Revenue chart for {selectedAnalyticsPeriod.toLowerCase()}</p>
            <p className="text-xs text-muted-foreground mt-1">Interactive charts would be displayed here</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="text-primary" size={16} />
            <span className="text-sm font-medium">Order Volume</span>
          </div>
          <p className="text-2xl font-bold">
            {selectedAnalyticsPeriod === 'Today' ? '142' :
             selectedAnalyticsPeriod === 'This Week' ? '987' :
             selectedAnalyticsPeriod === 'This Month' ? '4,234' : '52,891'}
          </p>
          <p className="text-xs text-success">+12% from last {selectedAnalyticsPeriod.toLowerCase()}</p>
        </div>

        <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="text-success" size={16} />
            <span className="text-sm font-medium">Avg Order Value</span>
          </div>
          <p className="text-2xl font-bold">
            ${selectedAnalyticsPeriod === 'Today' ? '24.50' :
              selectedAnalyticsPeriod === 'This Week' ? '26.80' :
              selectedAnalyticsPeriod === 'This Month' ? '28.90' : '31.20'}
          </p>
          <p className="text-xs text-success">+8% from last {selectedAnalyticsPeriod.toLowerCase()}</p>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Popular Menu Items - {selectedAnalyticsPeriod}</h3>
        <div className="space-y-3">
          {menuItems.slice(0, 3).map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAnalyticsPeriod === 'Today' ? Math.floor(Math.random() * 50) + 20 :
                     selectedAnalyticsPeriod === 'This Week' ? Math.floor(Math.random() * 200) + 100 :
                     selectedAnalyticsPeriod === 'This Month' ? Math.floor(Math.random() * 800) + 400 :
                     Math.floor(Math.random() * 5000) + 2000} orders
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${selectedAnalyticsPeriod === 'Today' ? (Math.random() * 500 + 200).toFixed(0) :
                    selectedAnalyticsPeriod === 'This Week' ? (Math.random() * 2000 + 1000).toFixed(0) :
                    selectedAnalyticsPeriod === 'This Month' ? (Math.random() * 10000 + 5000).toFixed(0) :
                    (Math.random() * 50000 + 25000).toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground">revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Customer Insights - {selectedAnalyticsPeriod}</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-success">
              {selectedAnalyticsPeriod === 'Today' ? '324' :
               selectedAnalyticsPeriod === 'This Week' ? '1,287' :
               selectedAnalyticsPeriod === 'This Month' ? '5,643' : '28,901'}
            </p>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">4.6</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">89%</p>
            <p className="text-xs text-muted-foreground">Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-4 space-y-4">
      {/* Account Settings */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-3">Account Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Restaurant Status</p>
              <p className="text-sm text-muted-foreground">Toggle your restaurant online/offline</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={restaurant.isOpen}
                onChange={handleToggleRestaurantStatus}
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Order Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationSettings.orderNotifications}
                onChange={() => handleToggleNotificationSetting('orderNotifications')}
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Accept Orders</p>
              <p className="text-sm text-muted-foreground">Automatically accept orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationSettings.autoAcceptOrders}
                onChange={() => handleToggleNotificationSetting('autoAcceptOrders')}
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Operational Settings */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Operational Settings</h3>
          <button
            onClick={handleSaveOperationalSettings}
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center space-x-1"
          >
            <Save size={14} />
            <span>Save</span>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Average Preparation Time</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={operationalSettings.avgPrepTime}
                onChange={(e) => handleUpdateOperationalSettings('avgPrepTime', parseInt(e.target.value) || 0)}
                className="flex-1 p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Delivery Radius</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={operationalSettings.deliveryRadius}
                onChange={(e) => handleUpdateOperationalSettings('deliveryRadius', parseInt(e.target.value) || 0)}
                className="flex-1 p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              />
              <span className="text-sm text-muted-foreground">km</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Maximum Orders per Hour</label>
            <input 
              type="number" 
              value={operationalSettings.maxOrdersPerHour}
              onChange={(e) => handleUpdateOperationalSettings('maxOrdersPerHour', parseInt(e.target.value) || 0)}
              className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Support & Help */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-soft">
        <h3 className="font-semibold mb-4">Support & Help</h3>
        
        {/* Contact Support */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-sm text-muted-foreground">Contact Support</h4>
          <div className="grid gap-3">
            <button
              onClick={() => handleContactAction('Call: 1-800-FOODFLOW')}
              className="bg-accent/50 rounded-lg p-3 border border-border hover:bg-accent transition-colors flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-card">
                <Phone size={20} className="text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <h5 className="font-medium text-sm">Call Support</h5>
                <p className="text-xs text-muted-foreground">Get instant help from our team</p>
                <p className="text-xs text-primary font-medium">Call: 1-800-FOODFLOW</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Clock size={10} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">24/7</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleContactAction('Start Chat')}
              className="bg-accent/50 rounded-lg p-3 border border-border hover:bg-accent transition-colors flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-card">
                <MessageCircle size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h5 className="font-medium text-sm">Live Chat</h5>
                <p className="text-xs text-muted-foreground">Chat with our support agents</p>
                <p className="text-xs text-primary font-medium">Start Chat</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Clock size={10} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Available now</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleContactAction('support@foodflow.com')}
              className="bg-accent/50 rounded-lg p-3 border border-border hover:bg-accent transition-colors flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-card">
                <Mail size={20} className="text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h5 className="font-medium text-sm">Email Support</h5>
                <p className="text-xs text-muted-foreground">Send us a detailed message</p>
                <p className="text-xs text-primary font-medium">support@foodflow.com</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <Clock size={10} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Response in 2-4 hours</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Quick Links</h4>
          <div className="grid gap-2">
            <button
              onClick={() => handleQuickLink('Terms of Service')}
              className="bg-accent/30 rounded-lg p-3 border border-border hover:bg-accent/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <FileText size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <h5 className="font-medium text-sm">Terms of Service</h5>
                  <p className="text-xs text-muted-foreground">Read our terms and conditions</p>
                </div>
              </div>
              <ExternalLink size={14} className="text-muted-foreground" />
            </button>

            <button
              onClick={() => handleQuickLink('Privacy Policy')}
              className="bg-accent/30 rounded-lg p-3 border border-border hover:bg-accent/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <h5 className="font-medium text-sm">Privacy Policy</h5>
                  <p className="text-xs text-muted-foreground">How we protect your data</p>
                </div>
              </div>
              <ExternalLink size={14} className="text-muted-foreground" />
            </button>

            <button
              onClick={() => handleQuickLink('Community Guidelines')}
              className="bg-accent/30 rounded-lg p-3 border border-border hover:bg-accent/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Book size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <h5 className="font-medium text-sm">Community Guidelines</h5>
                  <p className="text-xs text-muted-foreground">Rules for reviews and conduct</p>
                </div>
              </div>
              <ExternalLink size={14} className="text-muted-foreground" />
            </button>

            <button
              onClick={() => handleQuickLink('Report an Issue')}
              className="bg-accent/30 rounded-lg p-3 border border-border hover:bg-accent/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <AlertCircle size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <h5 className="font-medium text-sm">Report an Issue</h5>
                  <p className="text-xs text-muted-foreground">Report bugs or technical problems</p>
                </div>
              </div>
              <ExternalLink size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full bg-destructive text-destructive-foreground py-3 rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center space-x-2"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return renderDashboard();
      case 'orders':
        return renderOrders();
      case 'menu':
        return renderMenu();
      case 'add_item':
      case 'edit_item':
        return renderAddEditItem();
      case 'profile':
        return renderProfile();
      case 'delivery':
        return renderDelivery();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  // Get screen title for back button header
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'add_item':
        return 'Add New Menu Item';
      case 'edit_item':
        return 'Edit Menu Item';
      case 'profile':
        return 'Restaurant Profile';
      case 'analytics':
        return 'Analytics';
      default:
        return 'Back';
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header with Back Button for sub-screens */}
      {showBackButton ? (
        <div className="bg-card border-b border-border p-4 shadow-soft sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <button
              onClick={goBack}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">
              {getScreenTitle()}
            </h1>
          </div>
        </div>
      ) : (
        /* Normal Header for main screens */
        <div className="bg-card border-b border-border p-4 shadow-soft sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Store className="text-primary-foreground" size={16} />
              </div>
              <div>
                <h1 className="font-semibold">{restaurant.name}</h1>
                <p className="text-xs text-muted-foreground">Restaurant Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onShowNotification('You have 3 new notifications', 'info')}
                className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              >
                <Bell size={16} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  3
                </div>
              </button>
              <div className={`w-2 h-2 rounded-full ${restaurant.isOpen ? 'bg-success' : 'bg-destructive'}`}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="animate-fade-in">
          {renderScreen()}
        </div>
      </div>

      {/* Bottom Navigation - Only show on main screens */}
      {!showBackButton && (
        <div className="bg-card border-t border-border shadow-float">
          <div className="flex items-center justify-around py-2 px-4">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                currentScreen === 'dashboard' 
                  ? 'text-primary bg-accent scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Home size={18} />
              <span className="text-xs mt-1">Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentScreen('orders')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 relative ${
                currentScreen === 'orders' 
                  ? 'text-primary bg-accent scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <ShoppingBag size={18} />
              {orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length > 0 && (
                <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center animate-bounce-in">
                  {orders.filter(o => ['placed', 'confirmed'].includes(o.status)).length}
                </div>
              )}
              <span className="text-xs mt-1">Orders</span>
            </button>

            <button
              onClick={() => setCurrentScreen('menu')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                currentScreen === 'menu' 
                  ? 'text-primary bg-accent scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Menu size={18} />
              <span className="text-xs mt-1">Menu</span>
            </button>

            <button
              onClick={() => setCurrentScreen('analytics')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                currentScreen === 'analytics' 
                  ? 'text-primary bg-accent scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <BarChart3 size={18} />
              <span className="text-xs mt-1">Analytics</span>
            </button>

            <button
              onClick={() => setCurrentScreen('delivery')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                currentScreen === 'delivery' 
                  ? 'text-primary bg-accent scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Truck size={18} />
              <span className="text-xs mt-1">Delivery</span>
            </button>

            <button
              onClick={() => setCurrentScreen('settings')}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                currentScreen === 'settings' 
                  ? 'text-primary bg-accent scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Settings size={18} />
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}