import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, MessageCircle, Clock, Star, Home, CheckCircle, Package } from 'lucide-react';
import { Order } from '../App';

interface FullMapViewScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  onGoHome?: () => void;
  onOpenDeliveryChat: () => void;
  orders: Order[];
}

const mockDeliveryPartner = {
  name: 'Mike Johnson',
  phone: '+1 (555) 987-6543',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  rating: 4.8,
  vehicle: 'Honda Civic',
  vehicleNumber: 'NYC-4567',
  distanceRemaining: 1.2, // in kilometers
  estimatedTime: '8 mins',
  isMoving: true
};

export function FullMapViewScreen({ onBack, onShowNotification, onGoHome, onOpenDeliveryChat, orders }: FullMapViewScreenProps) {
  const [deliveryProgress, setDeliveryProgress] = useState(69);
  const [currentTime, setCurrentTime] = useState(new Date());

  const currentOrder = orders.length > 0 ? orders[0] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate delivery progress
    const progressTimer = setInterval(() => {
      setDeliveryProgress(prev => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 1;
      });
    }, 5000);

    return () => clearInterval(progressTimer);
  }, []);

  const handleCallPartner = () => {
    onShowNotification(`Calling ${mockDeliveryPartner.name}...`, 'info');
    setTimeout(() => {
      window.open(`tel:${mockDeliveryPartner.phone}`);
    }, 1000);
  };

  const handleChatWithPartner = () => {
    onOpenDeliveryChat();
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    }
  };

  if (!currentOrder) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Active Orders</h2>
            <p className="text-muted-foreground">You don't have any orders to track at the moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Live Tracking</h1>
          <button
            onClick={handleGoHome}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Home size={20} />
          </button>
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-card border-b border-border p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Order #{currentOrder.id}</p>
          <h2 className="text-lg font-semibold">{currentOrder.restaurant.name}</h2>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Clock size={16} className="text-primary" />
            <span className="text-sm">ETA: {mockDeliveryPartner.estimatedTime}</span>
            <span className="text-sm text-muted-foreground">• {new Date(currentOrder.estimatedDelivery).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        {/* Progress Bar */}
        <div className="bg-card p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Delivery Progress</span>
            <span className="text-sm text-primary font-semibold">{Math.round(deliveryProgress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-primary to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${deliveryProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span>{mockDeliveryPartner.distanceRemaining} km remaining</span>
          </div>
        </div>

        {/* Map Area */}
        <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-soft">
                <MapPin size={32} className="text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-1">Live Location Tracking</h3>
              <p className="text-sm text-muted-foreground">Your delivery partner is on the way</p>
            </div>
          </div>

          {/* Mock location points */}
          <div className="absolute top-4 left-4 w-4 h-4 bg-orange-500 rounded-full animate-bounce-in"></div>
          <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-success rounded-full animate-bounce-in" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-6 left-1/2 w-4 h-4 bg-blue-500 rounded-full animate-bounce-in" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Delivery Partner Info */}
        <div className="bg-card p-4 border-b border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <img
                src={mockDeliveryPartner.avatar}
                alt={mockDeliveryPartner.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{mockDeliveryPartner.name}</h4>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Star size={12} className="fill-current text-yellow-500" />
                  <span>{mockDeliveryPartner.rating}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{mockDeliveryPartner.vehicle}</span>
                <span>•</span>
                <span>{mockDeliveryPartner.vehicleNumber}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-primary">
                {mockDeliveryPartner.distanceRemaining} km
              </div>
              <div className="text-xs text-muted-foreground">away</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCallPartner}
              className="flex-1 flex items-center justify-center space-x-2 py-3 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
            >
              <Phone size={18} />
              <span>Call</span>
            </button>
            <button
              onClick={handleChatWithPartner}
              className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <MessageCircle size={18} />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-card p-4">
          <h3 className="font-semibold mb-4">Order Updates</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center mt-1">
                <CheckCircle size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Order picked up from restaurant</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
                <p className="text-xs text-success">Real-time delivery tracking</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                <CheckCircle size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Order confirmed and being prepared</p>
                <p className="text-xs text-muted-foreground">8 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center mt-1">
                <CheckCircle size={14} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Order placed successfully</p>
                <p className="text-xs text-muted-foreground">12 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}