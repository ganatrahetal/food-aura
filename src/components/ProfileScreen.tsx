import React, { useState } from 'react';
import { ArrowLeft, User, Settings, MapPin, CreditCard, Bell, Shield, HelpCircle, LogOut, ChevronRight, Star, Package, Heart, Sparkles, Phone, Mail, Camera, Edit, Truck, RotateCcw, MessageSquare, Info } from 'lucide-react';
import { User as UserType, Order, CartItem } from '../App';
import { EditProfile } from './settings/EditProfile';
import { ManageAddresses } from './settings/ManageAddresses';
import { PaymentMethods } from './settings/PaymentMethods';
import { NotificationSettings } from './settings/NotificationSettings';
import { PrivacySecurityScreen } from './settings/PrivacySecurityScreen';
import { OrdersScreen } from './settings/OrdersScreen';
import { AboutFoodYahScreen } from './settings/AboutFoodYahScreen';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileScreenProps {
  user: UserType | null;
  onLogout: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  onTrackOrder: () => void;
  onRestaurantClick: (restaurant: any) => void;
  onReorder: (items: CartItem[]) => void;
  onProfileUpdate: (updatedUser: UserType) => void;
  orders: Order[];
  onOpenFavorites: () => void;
  onOpenHelpSupport: () => void;
  favoriteRestaurants: string[];
}

type SettingsScreen = 'main' | 'edit_profile' | 'addresses' | 'payment' | 'notifications' | 'privacy' | 'orders' | 'about';

// Social Media Icons as SVG Components
const FacebookIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path 
      fill="currentColor" 
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path 
      fill="currentColor" 
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const TwitterIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path 
      fill="currentColor" 
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    />
  </svg>
);

export function ProfileScreen({ 
  user, 
  onLogout, 
  onShowNotification, 
  onTrackOrder, 
  onRestaurantClick, 
  onReorder, 
  onProfileUpdate, 
  orders,
  onOpenFavorites,
  onOpenHelpSupport,
  favoriteRestaurants
}: ProfileScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<SettingsScreen>('main');
  const [showImagePicker, setShowImagePicker] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <User size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to FoodYah</h2>
            <p className="text-muted-foreground">Please login to access your profile</p>
          </div>
        </div>
      </div>
    );
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll create a local URL for demo purposes
      const imageUrl = URL.createObjectURL(file);
      const updatedUser = { ...user, avatar: imageUrl };
      onProfileUpdate(updatedUser);
      onShowNotification('Profile photo updated successfully! 📸', 'success');
      setShowImagePicker(false);
    }
  };

  const handleSocialMediaClick = (platform: string) => {
    onShowNotification(`Opening ${platform}...`, 'info');
  };

  if (currentScreen === 'edit_profile') {
    return (
      <EditProfile
        user={user}
        onBack={() => setCurrentScreen('main')}
        onProfileUpdate={onProfileUpdate}
        onShowNotification={onShowNotification}
      />
    );
  }

  if (currentScreen === 'addresses') {
    return (
      <ManageAddresses
        onBack={() => setCurrentScreen('main')}
        onShowNotification={onShowNotification}
      />
    );
  }

  if (currentScreen === 'payment') {
    return (
      <PaymentMethods
        onBack={() => setCurrentScreen('main')}
        onShowNotification={onShowNotification}
      />
    );
  }

  if (currentScreen === 'notifications') {
    return (
      <NotificationSettings
        onBack={() => setCurrentScreen('main')}
        onShowNotification={onShowNotification}
      />
    );
  }

  if (currentScreen === 'privacy') {
    return (
      <PrivacySecurityScreen
        onBack={() => setCurrentScreen('main')}
        onShowNotification={onShowNotification}
      />
    );
  }

  if (currentScreen === 'orders') {
    return (
      <OrdersScreen
        onBack={() => setCurrentScreen('main')}
        onShowNotification={onShowNotification}
        onTrackOrder={onTrackOrder}
        onRestaurantClick={onRestaurantClick}
        onReorder={onReorder}
        onRateOrder={(orderId) => onShowNotification('Rating feature coming soon!', 'info')}
        orders={orders}
      />
    );
  }

  if (currentScreen === 'about') {
    return (
      <AboutFoodYahScreen
        onBack={() => setCurrentScreen('main')}
        onShowNotification={onShowNotification}
      />
    );
  }

  const menuItems = [
    {
      icon: Heart,
      title: 'My Favorites',
      subtitle: 'View your favorite restaurants',
      onClick: onOpenFavorites,
      color: 'text-red-500'
    },
    {
      icon: Package,
      title: 'My Orders',
      subtitle: 'View order history and reorder',
      onClick: () => setCurrentScreen('orders'),
      color: 'text-blue-500'
    },
    {
      icon: Edit,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onClick: () => setCurrentScreen('edit_profile'),
      color: 'text-green-500'
    },
    {
      icon: MapPin,
      title: 'Manage Addresses',
      subtitle: 'Add or edit delivery addresses',
      onClick: () => setCurrentScreen('addresses'),
      color: 'text-purple-500'
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onClick: () => setCurrentScreen('payment'),
      color: 'text-indigo-500'
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Control your notification preferences',
      onClick: () => setCurrentScreen('notifications'),
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      onClick: () => setCurrentScreen('privacy'),
      color: 'text-orange-500'
    },
    {
      icon: Info,
      title: 'About FoodAura',
      subtitle: 'Learn more about our app',
      onClick: () => setCurrentScreen('about'),
      color: 'text-teal-500'
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help or contact support',
      onClick: onOpenHelpSupport,
      color: 'text-pink-500'
    }
  ];

  const recentOrders = orders.slice(0, 3);
  const joinDate = new Date(user.joinDate);
  const memberSince = joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const favoritesCount = favoriteRestaurants.length;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-primary via-orange-500 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 animate-float"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-4 -translate-x-4 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 border-2 border-white/30">
                    {user.avatar ? (
                      <ImageWithFallback
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={32} className="text-white/70" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowImagePicker(true)}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <Camera size={14} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail size={14} className="text-white/80" />
                    <span className="text-white/90 text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone size={14} className="text-white/80" />
                    <span className="text-white/90 text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Sparkles size={14} className="text-white/80" />
                    <span className="text-white/90 text-xs">Member since {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex items-center justify-around">
              <button
                onClick={() => handleSocialMediaClick('Facebook')}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FacebookIcon size={24} className="text-white" />
                </div>
                <span className="text-sm text-muted-foreground">Facebook</span>
              </button>
              
              <button
                onClick={() => handleSocialMediaClick('Instagram')}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <InstagramIcon size={24} className="text-white" />
                </div>
                <span className="text-sm text-muted-foreground">Instagram</span>
              </button>
              
              <button
                onClick={() => handleSocialMediaClick('Twitter')}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TwitterIcon size={24} className="text-white" />
                </div>
                <span className="text-sm text-muted-foreground">Twitter</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-primary" />
                </div>
                <div>
                  <span className="text-2xl font-bold">{orders.length}</span>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Heart size={20} className="text-red-500" />
                </div>
                <div>
                  <span className="text-2xl font-bold">{favoritesCount}</span>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="bg-card rounded-2xl p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Orders</h3>
                <button
                  onClick={() => setCurrentScreen('orders')}
                  className="text-primary hover:underline text-sm"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">#{order.id}</p>
                        <p className="text-xs text-muted-foreground">{order.restaurant.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${order.total.toFixed(2)}</p>
                      <p className={`text-xs capitalize ${
                        order.status === 'delivered' ? 'text-success' :
                        order.status === 'cancelled' ? 'text-destructive' :
                        'text-primary'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full bg-card rounded-xl p-4 border border-border hover:bg-accent transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full bg-destructive/10 text-destructive rounded-xl p-4 border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center space-x-2 group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated w-full max-w-sm animate-scale-in">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Update Profile Photo</h3>
              <p className="text-muted-foreground mb-6">Choose a new profile photo</p>
              
              <div className="space-y-3">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="w-full bg-primary text-primary-foreground rounded-lg p-3 text-center hover:bg-primary/90 transition-colors cursor-pointer">
                    Choose Photo
                  </div>
                </label>
                
                <button
                  onClick={() => setShowImagePicker(false)}
                  className="w-full bg-muted text-muted-foreground rounded-lg p-3 hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}