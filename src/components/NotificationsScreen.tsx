import React, { useState } from 'react';
import { ArrowLeft, Bell, Clock, Gift, AlertCircle, CheckCircle, Star, ShoppingBag, Settings } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AppNotification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'rating';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionText?: string;
  actionUrl?: string;
  image?: string;
  orderNumber?: string;
  restaurantData?: {
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
  };
  orderData?: {
    id: string;
    restaurant: string;
    items: string[];
    total: number;
    deliveryTime: string;
    deliveryPerson: string;
    image: string;
  };
}

interface NotificationsScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  onOpenFeedback?: (type: 'order' | 'restaurant' | 'delivery', orderData?: any) => void;
  onRestaurantClick?: (restaurant: any) => void;
}

export function NotificationsScreen({ onBack, onShowNotification, onOpenFeedback, onRestaurantClick }: NotificationsScreenProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders' | 'promotions'>('all');
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Delivered! 🎉',
      message: 'Your order from Joe\'s Pizza has been delivered. Enjoy your meal!',
      time: '2 minutes ago',
      isRead: false,
      actionText: 'Rate Order',
      orderNumber: '#FF1234',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center',
      orderData: {
        id: 'FF1234',
        restaurant: 'Joe\'s Pizza',
        items: ['Margherita Pizza', 'Garlic Bread', 'Coke'],
        total: 24.99,
        deliveryTime: '25 min',
        deliveryPerson: 'Mike Johnson',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center'
      }
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Flash Sale Alert! ⚡',
      message: '50% off on all burgers at Shake Shack. Valid for next 2 hours only!',
      time: '15 minutes ago',
      isRead: false,
      actionText: 'Order Now',
      image: 'https://images.unsplash.com/photo-1552566068-dffbfed5bc52?w=400&h=300&fit=crop&crop=center',
      restaurantData: {
        id: '2',
        name: 'Shake Shack',
        image: 'https://images.unsplash.com/photo-1552566068-dffbfed5bc52?w=400&h=300&fit=crop&crop=center',
        cuisine: 'Burgers, American',
        rating: 4.3,
        reviewCount: 3200,
        deliveryTime: '15-25 min',
        deliveryFee: 1.99,
        minOrder: 12,
        isOpen: true,
        distance: 0.8,
        offers: ['Buy 1 Get 1 Free ShackBurger', '$5 off on orders above $25'],
        tags: ['Fast Food', 'American Classic', 'Premium']
      }
    },
    {
      id: '3',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order from Sweetgreen is being prepared. Estimated delivery: 25 mins',
      time: '1 hour ago',
      isRead: true,
      orderNumber: '#FF1235',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: '4',
      type: 'rating',
      title: 'Rate Your Recent Order',
      message: 'How was your experience with The Halal Guys? Your feedback helps us improve.',
      time: '3 hours ago',
      isRead: true,
      actionText: 'Rate Now',
      image: 'https://images.unsplash.com/photo-1555939594-58e4c06a1ec5?w=400&h=300&fit=crop&crop=center',
      orderData: {
        id: 'FF1236',
        restaurant: 'The Halal Guys',
        items: ['Chicken Platter', 'Falafel', 'Baklava'],
        total: 18.50,
        deliveryTime: '30 min',
        deliveryPerson: 'Sarah Wilson',
        image: 'https://images.unsplash.com/photo-1555939594-58e4c06a1ec5?w=400&h=300&fit=crop&crop=center'
      }
    },
    {
      id: '5',
      type: 'promotion',
      title: 'Weekend Special! 🎊',
      message: 'Free delivery on all orders above $25. Use code WEEKEND25',
      time: '5 hours ago',
      isRead: true,
      actionText: 'Browse Menu',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: '6',
      type: 'system',
      title: 'Payment Method Added',
      message: 'Your new Visa card ending in 1234 has been successfully added to your account.',
      time: '1 day ago',
      isRead: true
    },
    {
      id: '7',
      type: 'order',
      title: 'Order Cancelled',
      message: 'Your order from Nobu has been cancelled. Refund will be processed in 3-5 business days.',
      time: '2 days ago',
      isRead: true,
      orderNumber: '#FF1237',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: '8',
      type: 'promotion',
      title: 'New Restaurant Alert! 🍕',
      message: 'Tony\'s Authentic Italian is now available in your area. Get 30% off your first order!',
      time: '3 days ago',
      isRead: true,
      actionText: 'Explore Menu',
      image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop&crop=center',
      restaurantData: {
        id: '9',
        name: 'Tony\'s Authentic Italian',
        image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop&crop=center',
        cuisine: 'Italian, Family Dining',
        rating: 4.6,
        reviewCount: 890,
        deliveryTime: '35-50 min',
        deliveryFee: 3.99,
        minOrder: 20,
        isOpen: true,
        distance: 2.1,
        offers: ['30% off your first order', 'Free breadsticks with pasta'],
        tags: ['New', 'Italian', 'Authentic']
      }
    }
  ]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    onShowNotification('All notifications marked as read', 'success');
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    onShowNotification('Notification deleted', 'info');
  };

  const handleNotificationAction = (notification: AppNotification) => {
    markAsRead(notification.id);
    
    if (notification.actionText === 'Rate Order' || notification.actionText === 'Rate Now') {
      if (onOpenFeedback && notification.orderData) {
        onOpenFeedback('order', notification.orderData);
      } else {
        onShowNotification('Opening rating page...', 'info');
      }
    } else if (notification.actionText === 'Explore Menu' && notification.restaurantData) {
      // Redirect to restaurant page
      if (onRestaurantClick) {
        onRestaurantClick(notification.restaurantData);
        onShowNotification(`Opening ${notification.restaurantData.name}...`, 'info');
      } else {
        onShowNotification('Opening restaurant menu...', 'info');
      }
    } else if (notification.actionText === 'Order Now' && notification.restaurantData) {
      // Redirect to restaurant page for ordering
      if (onRestaurantClick) {
        onRestaurantClick(notification.restaurantData);
        onShowNotification(`Opening ${notification.restaurantData.name} for ordering...`, 'info');
      } else {
        onShowNotification('Opening restaurant for ordering...', 'info');
      }
    } else if (notification.actionText) {
      onShowNotification(`Opening ${notification.actionText.toLowerCase()}...`, 'info');
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'orders') return notif.type === 'order';
    if (filter === 'promotions') return notif.type === 'promotion';
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order': return <ShoppingBag size={20} className="text-primary" />;
      case 'promotion': return <Gift size={20} className="text-success" />;
      case 'rating': return <Star size={20} className="text-yellow-500" />;
      case 'system': return <Settings size={20} className="text-blue-500" />;
      default: return <Bell size={20} className="text-muted-foreground" />;
    }
  };

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'orders', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
    { key: 'promotions', label: 'Offers', count: notifications.filter(n => n.type === 'promotion').length }
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with Back Button */}
      <div className="bg-card border-b border-border p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-primary text-sm font-medium hover:text-primary/80"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-soft">
          {filters.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex items-center space-x-2 ${
                filter === filterOption.key
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <span>{filterOption.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                filter === filterOption.key 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {filterOption.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === 'unread' ? "You're all caught up!" : "No notifications to show"}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`bg-card border rounded-xl p-4 shadow-soft hover:shadow-card transition-all animate-fade-in ${
                  !notification.isRead ? 'border-primary/20 bg-primary/5' : 'border-border'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex space-x-3">
                  {notification.image ? (
                    <div className="relative flex-shrink-0">
                      <ImageWithFallback
                        src={notification.image}
                        alt="Notification"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock size={12} />
                              <span>{notification.time}</span>
                            </div>
                            {notification.orderNumber && (
                              <span className="bg-muted px-2 py-1 rounded-full">
                                {notification.orderNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-muted-foreground hover:text-destructive p-1 ml-2 flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                    
                    {notification.actionText && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <button
                          onClick={() => handleNotificationAction(notification)}
                          className={`text-sm font-medium transition-colors ${
                            notification.actionText === 'Rate Order' || notification.actionText === 'Rate Now'
                              ? 'text-yellow-600 hover:text-yellow-700 flex items-center space-x-1'
                              : notification.actionText === 'Explore Menu' || notification.actionText === 'Order Now'
                              ? 'text-primary hover:text-primary/80 flex items-center space-x-1'
                              : 'text-primary hover:text-primary/80'
                          }`}
                        >
                          {(notification.actionText === 'Rate Order' || notification.actionText === 'Rate Now') && (
                            <Star size={14} />
                          )}
                          {(notification.actionText === 'Explore Menu' || notification.actionText === 'Order Now') && (
                            <ShoppingBag size={14} />
                          )}
                          <span>{notification.actionText}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Footer */}
      <div className="bg-card border-t border-border p-4">
        <button className="w-full flex items-center justify-center space-x-2 p-3 bg-secondary rounded-lg hover:bg-accent transition-colors">
          <Settings size={16} />
          <span className="text-sm font-medium">Notification Settings</span>
        </button>
      </div>
    </div>
  );
}