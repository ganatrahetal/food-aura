import React, { useState } from 'react';
import { ArrowLeft, Clock, Star, Package, CheckCircle, Truck, MapPin, Phone, MessageCircle, RotateCcw, Receipt, Gift, X, RefreshCw, DollarSign } from 'lucide-react';
import { Order } from '../../App';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface OrdersScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  onTrackOrder: () => void;
  onRateOrder?: (orderId: string) => void;
  onReorder: (items: any[]) => void;
  orders?: Order[];
}

const mockOrders: Order[] = [
  {
    id: 'FF123456',
    items: [
      {
        id: '1',
        name: 'Margherita Pizza',
        price: 18.99,
        quantity: 1,
        restaurantId: '1',
        restaurantName: 'Joe\'s Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
      },
      {
        id: '2',
        name: 'Garlic Bread',
        price: 4.99,
        quantity: 1,
        restaurantId: '1',
        restaurantName: 'Joe\'s Pizza',
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
      }
    ],
    restaurant: {
      id: '1',
      name: 'Joe\'s Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      phone: '+1 (555) 123-4567'
    },
    total: 29.97,
    subtotal: 23.98,
    deliveryFee: 2.99,
    tax: 2.10,
    status: 'delivered',
    placedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    deliveryAddress: '123 Broadway Street, New York, NY 10001',
    paymentMethod: 'Credit Card ending in 1234',
    trackingUpdates: [
      {
        time: '2:30 PM',
        message: 'Order delivered successfully',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'FF123455',
    items: [
      {
        id: '3',
        name: 'ShackBurger',
        price: 12.99,
        quantity: 2,
        restaurantId: '2',
        restaurantName: 'Shake Shack',
        image: 'https://images.unsplash.com/photo-1552566068-dffbfed5bc52?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
      }
    ],
    restaurant: {
      id: '2',
      name: 'Shake Shack',
      image: 'https://images.unsplash.com/photo-1552566068-dffbfed5bc52?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      phone: '+1 (555) 987-6543'
    },
    total: 28.47,
    subtotal: 25.98,
    deliveryFee: 1.99,
    tax: 2.27,
    status: 'preparing',
    placedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    deliveryAddress: '123 Broadway Street, New York, NY 10001',
    paymentMethod: 'Apple Pay',
    giftMessage: 'Happy Birthday! Enjoy your favorite burger! 🎉',
    trackingUpdates: [
      {
        time: '3:00 PM',
        message: 'Restaurant is preparing your order',
        status: 'preparing'
      }
    ]
  },
  {
    id: 'FF123454',
    items: [
      {
        id: '4',
        name: 'Chicken Caesar Salad',
        price: 11.99,
        quantity: 1,
        restaurantId: '3',
        restaurantName: 'Fresh Garden',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
      },
      {
        id: '5',
        name: 'Iced Tea',
        price: 2.99,
        quantity: 1,
        restaurantId: '3',
        restaurantName: 'Fresh Garden',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center&auto=format&q=80'
      }
    ],
    restaurant: {
      id: '3',
      name: 'Fresh Garden',
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
      phone: '+1 (555) 456-7890'
    },
    total: 19.23,
    subtotal: 14.98,
    deliveryFee: 2.99,
    tax: 1.26,
    status: 'cancelled',
    placedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    deliveryAddress: '123 Broadway Street, New York, NY 10001',
    paymentMethod: 'Paid by Visa ending 5678',
    trackingUpdates: [
      {
        time: '11:15 AM',
        message: 'Order cancelled and refund initiated',
        status: 'cancelled'
      },
      {
        time: '11:10 AM',
        message: 'Order placed successfully',
        status: 'placed'
      }
    ],
    refund: {
      id: 'RF123454',
      amount: 19.23,
      status: 'processing',
      method: 'Visa Card ending 5678',
      initiatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      reason: 'Order cancelled by customer',
      timeline: [
        {
          time: new Date(Date.now() - 4 * 60 * 60 * 1000 + 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          message: 'Refund initiated',
          status: 'processing'
        },
        {
          time: new Date(Date.now() - 4 * 60 * 60 * 1000 + 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          message: 'Order cancelled by customer',
          status: 'cancelled'
        }
      ]
    }
  }
];

export function OrdersScreen({ 
  onBack, 
  onShowNotification, 
  onTrackOrder, 
  onRateOrder, 
  onReorder, 
  orders = [] 
}: OrdersScreenProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');

  // Combine passed orders with mock orders for demo
  const allOrders = [...orders, ...mockOrders];

  const filteredOrders = allOrders.filter(order => {
    if (filter === 'active') {
      return ['placed', 'confirmed', 'preparing', 'ready', 'picked_up'].includes(order.status);
    }
    if (filter === 'delivered') {
      return order.status === 'delivered';
    }
    if (filter === 'cancelled') {
      return order.status === 'cancelled';
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return <Clock className="text-orange-500" size={16} />;
      case 'preparing':
        return <Package className="text-blue-500" size={16} />;
      case 'ready':
      case 'picked_up':
        return <Truck className="text-purple-500" size={16} />;
      case 'delivered':
        return <CheckCircle className="text-success" size={16} />;
      case 'cancelled':
        return <X className="text-destructive" size={16} />;
      default:
        return <Clock className="text-muted-foreground" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'placed': return 'Order Placed';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Pickup';
      case 'picked_up': return 'On the Way';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return 'text-orange-500 bg-orange-50';
      case 'preparing':
        return 'text-blue-500 bg-blue-50';
      case 'ready':
      case 'picked_up':
        return 'text-purple-500 bg-purple-50';
      case 'delivered':
        return 'text-success bg-success/10';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const handleReorder = (order: Order) => {
    onReorder(order.items);
    onShowNotification(`${order.items.length} items added to cart from ${order.restaurant.name}`, 'success');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Your Orders</h1>
            <p className="text-sm text-muted-foreground">{filteredOrders.length} orders</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'delivered', label: 'Delivered' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Receipt size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground text-center">
              {filter === 'active' 
                ? 'You don\'t have any active orders right now'
                : filter === 'delivered'
                ? 'No delivered orders yet'
                : filter === 'cancelled'
                ? 'No cancelled orders found'
                : 'Your order history will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(order.placedAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <ImageWithFallback
                      src={order.restaurant.image}
                      alt={order.restaurant.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{order.restaurant.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Gift Message */}
                  {order.giftMessage && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <Gift size={16} className="text-pink-500" />
                        <span className="text-sm font-medium text-pink-700">Gift Message</span>
                      </div>
                      <p className="text-sm text-pink-600 italic">"{order.giftMessage}"</p>
                    </div>
                  )}

                  {/* Refund Information for Cancelled Orders */}
                  {order.status === 'cancelled' && order.refund && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} className="text-orange-500" />
                          <span className="text-sm font-medium text-orange-700">Refund Status</span>
                        </div>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          order.refund.status === 'completed' ? 'text-success bg-success/10' :
                          order.refund.status === 'processing' ? 'text-warning bg-warning/10' :
                          'text-destructive bg-destructive/10'
                        }`}>
                          {order.refund.status === 'completed' ? <CheckCircle size={12} /> :
                           order.refund.status === 'processing' ? <RefreshCw size={12} /> :
                           <X size={12} />}
                          <span className="capitalize">{order.refund.status}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-orange-600">Refund Amount: ${order.refund.amount.toFixed(2)}</span>
                        <span className="text-xs text-orange-500">{order.refund.method}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-4 bg-accent/30">
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{item.quantity}x {item.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        <span className="text-sm text-muted-foreground">
                          +{order.items.length - 2} more items
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-3">
                    {order.status === 'delivered' ? (
                      <>
                        <button
                          onClick={() => handleReorder(order)}
                          className="flex items-center justify-center space-x-2 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <RotateCcw size={16} />
                          <span>Reorder</span>
                        </button>
                        <button
                          onClick={() => onRateOrder ? onRateOrder(order.id) : onShowNotification('Rating feature coming soon!', 'info')}
                          className="flex items-center justify-center space-x-2 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                        >
                          <Star size={16} />
                          <span>Rate Order</span>
                        </button>
                      </>
                    ) : order.status === 'cancelled' ? (
                      <>
                        <button
                          onClick={() => handleReorder(order)}
                          className="flex items-center justify-center space-x-2 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          <RotateCcw size={16} />
                          <span>Reorder</span>
                        </button>
                        <button
                          onClick={() => onShowNotification('Opening refund details...', 'info')}
                          className="flex items-center justify-center space-x-2 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                        >
                          <DollarSign size={16} />
                          <span>View Refund</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={['placed', 'confirmed', 'preparing', 'ready', 'picked_up'].includes(order.status) ? onTrackOrder : undefined}
                          disabled={!['placed', 'confirmed', 'preparing', 'ready', 'picked_up'].includes(order.status)}
                          className={`flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
                            ['placed', 'confirmed', 'preparing', 'ready', 'picked_up'].includes(order.status)
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                          }`}
                        >
                          <MapPin size={16} />
                          <span>Track Order</span>
                        </button>
                        <button
                          onClick={() => onShowNotification('Contacting restaurant...', 'info')}
                          className="flex items-center justify-center space-x-2 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
                        >
                          <Phone size={16} />
                          <span>Call Restaurant</span>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Additional Actions */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <button 
                        onClick={() => onShowNotification('Order details opened', 'info')}
                        className="text-primary hover:underline"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => onShowNotification('Opening help...', 'info')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Need Help?
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}