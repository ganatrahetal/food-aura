import React, { useState } from 'react';
import { ArrowLeft, Bell, BellOff, Smartphone, Mail, Volume2, VolumeX } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'orders' | 'promotions' | 'account' | 'app';
}

interface NotificationSettingsProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function NotificationSettings({ onBack, onShowNotification }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    // Orders
    {
      id: 'order-placed',
      title: 'Order Confirmation',
      description: 'When your order is placed successfully',
      enabled: true,
      category: 'orders'
    },
    {
      id: 'order-preparing',
      title: 'Order Being Prepared',
      description: 'When restaurant starts preparing your order',
      enabled: true,
      category: 'orders'
    },
    {
      id: 'order-ready',
      title: 'Order Ready',
      description: 'When your order is ready for pickup/delivery',
      enabled: true,
      category: 'orders'
    },
    {
      id: 'order-delivered',
      title: 'Order Delivered',
      description: 'When your order has been delivered',
      enabled: true,
      category: 'orders'
    },
    {
      id: 'order-cancelled',
      title: 'Order Cancelled',
      description: 'When your order is cancelled',
      enabled: true,
      category: 'orders'
    },
    
    // Promotions
    {
      id: 'new-offers',
      title: 'New Offers & Deals',
      description: 'Special discounts and promotional offers',
      enabled: true,
      category: 'promotions'
    },
    {
      id: 'restaurant-offers',
      title: 'Restaurant Promotions',
      description: 'Exclusive deals from your favorite restaurants',
      enabled: false,
      category: 'promotions'
    },
    {
      id: 'seasonal-offers',
      title: 'Seasonal Campaigns',
      description: 'Holiday and seasonal special offers',
      enabled: true,
      category: 'promotions'
    },
    
    // Account
    {
      id: 'login-alerts',
      title: 'Login Alerts',
      description: 'When someone logs into your account',
      enabled: true,
      category: 'account'
    },
    {
      id: 'password-changed',
      title: 'Password Changes',
      description: 'When your password is changed',
      enabled: true,
      category: 'account'
    },
    {
      id: 'payment-alerts',
      title: 'Payment Alerts',
      description: 'Payment confirmations and failures',
      enabled: true,
      category: 'account'
    },
    
    // App
    {
      id: 'app-updates',
      title: 'App Updates',
      description: 'New features and app improvements',
      enabled: false,
      category: 'app'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Notices',
      description: 'Scheduled maintenance and downtime',
      enabled: true,
      category: 'app'
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true
  });

  const toggleNotification = (id: string) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
    onShowNotification('Notification setting updated', 'success');
  };

  const toggleGlobalSetting = (key: keyof typeof globalSettings) => {
    setGlobalSettings(prev => ({ ...prev, [key]: !prev[key] }));
    onShowNotification('Global setting updated', 'success');
  };

  const getSettingsByCategory = (category: string) => 
    settings.filter(setting => setting.category === category);

  const categories = [
    { key: 'orders', title: 'Order Updates', icon: '📦', description: 'Notifications about your order status' },
    { key: 'promotions', title: 'Offers & Deals', icon: '🎉', description: 'Promotional offers and discounts' },
    { key: 'account', title: 'Account Security', icon: '🔒', description: 'Security and account-related alerts' },
    { key: 'app', title: 'App Updates', icon: '📱', description: 'App features and maintenance notices' }
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Notification Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Global Settings */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <h2 className="font-semibold mb-4 flex items-center space-x-2">
            <Bell size={20} className="text-primary" />
            <span>Global Settings</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone size={20} className="text-muted-foreground" />
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive notifications on your device</div>
                </div>
              </div>
              <button
                onClick={() => toggleGlobalSetting('pushNotifications')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  globalSettings.pushNotifications ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  globalSettings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-muted-foreground" />
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                </div>
              </div>
              <button
                onClick={() => toggleGlobalSetting('emailNotifications')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  globalSettings.emailNotifications ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  globalSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {globalSettings.soundEnabled ? (
                  <Volume2 size={20} className="text-muted-foreground" />
                ) : (
                  <VolumeX size={20} className="text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium">Sound</div>
                  <div className="text-sm text-muted-foreground">Play sound for notifications</div>
                </div>
              </div>
              <button
                onClick={() => toggleGlobalSetting('soundEnabled')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  globalSettings.soundEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  globalSettings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone size={20} className="text-muted-foreground" />
                <div>
                  <div className="font-medium">Vibration</div>
                  <div className="text-sm text-muted-foreground">Vibrate for notifications</div>
                </div>
              </div>
              <button
                onClick={() => toggleGlobalSetting('vibrationEnabled')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  globalSettings.vibrationEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  globalSettings.vibrationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Category Settings */}
        {categories.map((category, categoryIndex) => (
          <div key={category.key} className="bg-card border border-border rounded-xl p-4 shadow-soft animate-fade-in" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <h3 className="font-semibold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {getSettingsByCategory(category.key).map((setting, index) => (
                <div key={setting.id} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{setting.title}</div>
                    <div className="text-xs text-muted-foreground">{setting.description}</div>
                  </div>
                  <button
                    onClick={() => toggleNotification(setting.id)}
                    className={`w-10 h-5 rounded-full transition-colors ml-3 ${
                      setting.enabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quiet Hours */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <BellOff size={20} className="text-primary" />
            <span>Quiet Hours</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Quiet Hours</div>
                <div className="text-sm text-muted-foreground">Mute non-urgent notifications during specified hours</div>
              </div>
              <button
                className="w-12 h-6 rounded-full bg-muted transition-colors"
              >
                <div className="w-5 h-5 bg-white rounded-full translate-x-0.5 transition-transform"></div>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 opacity-50">
              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <input
                  type="time"
                  value="22:00"
                  disabled
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <input
                  type="time"
                  value="08:00"
                  disabled
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reset Settings */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <h3 className="font-semibold mb-2">Reset Notifications</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Reset all notification settings to default values
          </p>
          <button className="text-destructive font-medium hover:text-destructive/80 transition-colors">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}