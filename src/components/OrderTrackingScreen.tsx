import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, MessageCircle, Clock, Package, Truck, CheckCircle, X, AlertTriangle, Star, RefreshCw, DollarSign } from 'lucide-react';
import { Order } from '../App';

interface OrderTrackingScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  onOpenFullMap: () => void;
  onOpenDeliveryChat: () => void;
  onOpenRefund?: (orderId: string) => void;
  orders: Order[];
  onUpdateOrder?: (updatedOrder: Order) => void;
  onShowConfirmation?: (config: {
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'warning' | 'danger' | 'info' | 'success';
    confirmText?: string;
    cancelText?: string;
  }) => void;
}

const mockDeliveryPartner = {
  name: 'Mike Johnson',
  phone: '+1 (555) 987-6543',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  rating: 4.8,
  vehicle: 'Honda Civic',
  vehicleNumber: 'NYC-4567',
  eta: '12 mins',
  totalDeliveries: 1247,
  isOnline: true
};

export function OrderTrackingScreen({ onBack, onShowNotification, onOpenFullMap, onOpenDeliveryChat, onOpenRefund, orders, onUpdateOrder, onShowConfirmation }: OrderTrackingScreenProps) {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [canCancel, setCanCancel] = useState(false);

  const currentOrder = orders[selectedOrderIndex];

  // Calculate time remaining for cancellation (1 minute = 60 seconds)
  useEffect(() => {
    if (!currentOrder) return;

    const orderTime = new Date(currentOrder.placedAt).getTime();
    const now = new Date().getTime();
    const elapsed = (now - orderTime) / 1000; // seconds elapsed
    const remaining = 60 - elapsed; // 60 seconds = 1 minute

    if (remaining > 0 && currentOrder.status === 'placed') {
      setCanCancel(true);
      setTimeRemaining(Math.ceil(remaining));

      const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const newElapsed = (currentTime - orderTime) / 1000;
        const newRemaining = 60 - newElapsed;

        if (newRemaining <= 0) {
          setCanCancel(false);
          setTimeRemaining(null);
          clearInterval(timer);
        } else {
          setTimeRemaining(Math.ceil(newRemaining));
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCanCancel(false);
      setTimeRemaining(null);
    }
  }, [currentOrder]);

  const handleCancelOrder = () => {
    if (!currentOrder || !canCancel) return;

    const confirmCancelOrder = () => {
      // Create refund data for the cancelled order
      const refundData = {
        id: `RF${Date.now().toString().slice(-6)}`,
        amount: currentOrder.total,
        status: 'processing' as const,
        method: currentOrder.paymentMethod,
        initiatedAt: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
        reason: 'Order cancelled by customer',
        timeline: [
          {
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Refund initiated',
            status: 'processing'
          },
          {
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order cancelled by customer',
            status: 'cancelled'
          }
        ]
      };

      // Update the order with cancelled status and refund data
      const updatedOrder: Order = {
        ...currentOrder,
        status: 'cancelled',
        refund: refundData,
        trackingUpdates: [
          {
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            message: 'Order cancelled and refund initiated',
            status: 'cancelled'
          },
          ...currentOrder.trackingUpdates
        ]
      };

      // Update the order in the parent component
      if (onUpdateOrder) {
        onUpdateOrder(updatedOrder);
      }

      onShowNotification(`Order #${currentOrder.id} cancelled. Refund of ${currentOrder.total.toFixed(2)} is being processed.`, 'success');
      
      // Navigate to refund screen after a short delay
      setTimeout(() => {
        if (onOpenRefund) {
          onOpenRefund(currentOrder.id);
        }
      }, 1500);
    };

    // Use soft UI confirmation dialog instead of window.confirm
    if (onShowConfirmation) {
      onShowConfirmation({
        title: 'Cancel Order',
        message: `Are you sure you want to cancel order #${currentOrder.id}? This will initiate a refund process and cannot be undone.`,
        type: 'warning',
        confirmText: 'Cancel Order',
        cancelText: 'Keep Order',
        onConfirm: confirmCancelOrder
      });
    } else {
      // Fallback to direct confirmation if onShowConfirmation is not available
      confirmCancelOrder();
    }
  };

  const handleContactDeliveryPartner = () => {
    onShowNotification(`Calling ${mockDeliveryPartner.name}...`, 'info');
    setTimeout(() => {
      window.open(`tel:${mockDeliveryPartner.phone}`);
    }, 1000);
  };

  const handleChatWithDeliveryPartner = () => {
    onOpenDeliveryChat();
  };

  if (!currentOrder) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Package size={40} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
          <p className="text-muted-foreground text-center mb-8">
            You don't have any orders to track at the moment
          </p>
          <button
            onClick={onBack}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'text-blue-600';
      case 'confirmed': return 'text-yellow-600';
      case 'preparing': return 'text-orange-600';
      case 'ready': return 'text-purple-600';
      case 'picked_up': return 'text-indigo-600';
      case 'delivered': return 'text-success';
      case 'cancelled': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed': return <Clock size={20} />;
      case 'confirmed': return <CheckCircle size={20} />;
      case 'preparing': return <Package size={20} />;
      case 'ready': return <Package size={20} />;
      case 'picked_up': return <Truck size={20} />;
      case 'delivered': return <CheckCircle size={20} />;
      case 'cancelled': return <X size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="p-4 space-y-6">
          {/* Order Selection */}
          {orders.length > 1 && (
            <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
              <h3 className="font-semibold mb-3">Select Order to Track</h3>
              <div className="space-y-2">
                {orders.slice(0, 3).map((order, index) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderIndex(index)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedOrderIndex === index
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Order #{order.id}</span>
                        <div className="text-sm text-muted-foreground">{order.restaurant.name}</div>
                      </div>
                      <div className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cancel Order Section */}
          {canCancel && timeRemaining && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={20} className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800">Cancel Order</h3>
                  <p className="text-sm text-yellow-600">
                    You can cancel this order within {formatTimeRemaining(timeRemaining)}
                  </p>
                </div>
                <button
                  onClick={handleCancelOrder}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Order Status */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Order #{currentOrder.id}</h3>
              <div className={`flex items-center space-x-2 ${getStatusColor(currentOrder.status)}`}>
                {getStatusIcon(currentOrder.status)}
                <span className="font-medium">
                  {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-medium">
                  {new Date(currentOrder.estimatedDelivery).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-medium">${currentOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Live Tracking Map */}
          <div className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border">
            <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck size={24} className="text-primary-foreground" />
                  </div>
                  <p className="text-sm font-medium">Live Tracking</p>
                  <p className="text-xs text-muted-foreground">Your order is on the way</p>
                </div>
              </div>
              <button
                onClick={onOpenFullMap}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors"
              >
                Full Map
              </button>
            </div>
          </div>

          {/* Delivery Partner */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <h3 className="font-semibold mb-3">Delivery Partner</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <img
                  src={mockDeliveryPartner.avatar}
                  alt={mockDeliveryPartner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {mockDeliveryPartner.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{mockDeliveryPartner.name}</h4>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Star size={12} className="fill-current text-yellow-500" />
                    <span>{mockDeliveryPartner.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <span>{mockDeliveryPartner.vehicle}</span>
                  <span>•</span>
                  <span>{mockDeliveryPartner.vehicleNumber}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockDeliveryPartner.totalDeliveries} deliveries completed
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-primary">
                  ETA: {mockDeliveryPartner.eta}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-accent/50 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Phone size={14} className="text-primary" />
                <span className="font-medium">Contact Number:</span>
                <span className="text-primary font-mono">{mockDeliveryPartner.phone}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleContactDeliveryPartner}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
              >
                <Phone size={18} />
                <span>Call</span>
              </button>
              <button
                onClick={handleChatWithDeliveryPartner}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <MessageCircle size={18} />
                <span>Chat</span>
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <h3 className="font-semibold mb-3">Delivery Address</h3>
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-primary mt-1" />
              <div>
                <p className="text-sm">{currentOrder.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Refund Status for Cancelled Orders */}
          {currentOrder.status === 'cancelled' && currentOrder.refund && (
            <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Refund Status</h3>
                <button
                  onClick={() => onOpenRefund && onOpenRefund(currentOrder.id)}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  View Details
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Refund Amount</span>
                  <span className="font-medium text-primary">${currentOrder.refund.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    currentOrder.refund.status === 'completed' ? 'text-success bg-success/10' :
                    currentOrder.refund.status === 'processing' ? 'text-warning bg-warning/10' :
                    'text-destructive bg-destructive/10'
                  }`}>
                    {currentOrder.refund.status === 'completed' ? <CheckCircle size={12} /> :
                     currentOrder.refund.status === 'processing' ? <RefreshCw size={12} /> :
                     <X size={12} />}
                    <span className="capitalize">{currentOrder.refund.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Refund Method</span>
                  <span className="font-medium">{currentOrder.refund.method}</span>
                </div>
                
                {currentOrder.refund.status === 'processing' && (
                  <div className="mt-3 p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-warning" />
                      <span className="text-sm text-warning font-medium">Processing Refund</span>
                    </div>
                    <p className="text-xs text-warning mt-1">
                      Your refund will be processed within 3-5 business days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <h3 className="font-semibold mb-3">Order Timeline</h3>
            <div className="space-y-4">
              {currentOrder.trackingUpdates.map((update, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    update.status === 'cancelled' ? 'bg-destructive/10' : 'bg-primary/10'
                  }`}>
                    {update.status === 'cancelled' ? 
                      <X size={16} className="text-destructive" /> :
                      <CheckCircle size={16} className="text-primary" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{update.message}</p>
                    <p className="text-xs text-muted-foreground">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}