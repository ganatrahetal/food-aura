import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, Clock, AlertCircle, CreditCard, Banknote, Smartphone, WalletCards, DollarSign, Calendar, MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RefundScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  orders: Order[];
  selectedOrderId?: string;
}

export function RefundScreen({ onBack, onShowNotification, orders, selectedOrderId }: RefundScreenProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    () => orders.find(order => order.id === selectedOrderId && order.status === 'cancelled' && order.refund) || 
         orders.find(order => order.status === 'cancelled' && order.refund) || 
         null
  );
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);

  // If no refund orders exist, show empty state
  const refundOrders = orders.filter(order => order.status === 'cancelled' && order.refund);
  
  if (refundOrders.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <RefreshCw size={40} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Refunds</h2>
          <p className="text-muted-foreground text-center mb-8">
            You don't have any refund requests at the moment
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

  const currentRefund = selectedOrder?.refund;
  if (!currentRefund) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Refund Not Found</h2>
          <p className="text-muted-foreground text-center mb-8">
            The selected order doesn't have refund information
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
      case 'completed':
        return 'text-success bg-success/10';
      case 'processing':
        return 'text-warning bg-warning/10';
      case 'failed':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success" />;
      case 'processing':
        return <Clock size={16} className="text-warning" />;
      case 'failed':
        return <AlertCircle size={16} className="text-destructive" />;
      default:
        return <RefreshCw size={16} className="text-muted-foreground" />;
    }
  };

  const getPaymentIcon = (method: string) => {
    if (method.toLowerCase().includes('visa') || method.toLowerCase().includes('mastercard')) {
      return <CreditCard size={18} className="text-blue-600" />;
    } else if (method.toLowerCase().includes('apple')) {
      return <Smartphone size={18} className="text-gray-800" />;
    } else if (method.toLowerCase().includes('google')) {
      return <WalletCards size={18} className="text-green-600" />;
    } else if (method.toLowerCase().includes('cash')) {
      return <Banknote size={18} className="text-emerald-600" />;
    }
    return <CreditCard size={18} className="text-gray-600" />;
  };

  const handleContactSupport = (method: 'phone' | 'email' | 'chat') => {
    switch (method) {
      case 'phone':
        onShowNotification('Redirecting to phone support...', 'info');
        break;
      case 'email':
        onShowNotification('Opening email client...', 'info');
        break;
      case 'chat':
        onShowNotification('Starting chat with support...', 'info');
        break;
    }
    setShowContactOptions(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDays = (estimatedDate: string) => {
    const now = new Date();
    const estimated = new Date(estimatedDate);
    const diffTime = estimated.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Refund Status</h1>
            <p className="text-sm text-muted-foreground">Order #{selectedOrder.id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="p-4 space-y-6">
          {/* Multiple Orders Selector */}
          {refundOrders.length > 1 && (
            <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
              <h3 className="font-semibold mb-3">Select Order</h3>
              <div className="space-y-2">
                {refundOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full p-3 border rounded-lg hover:bg-accent transition-colors text-left ${
                      selectedOrder?.id === order.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.restaurant.name}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.placedAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.refund?.amount.toFixed(2)}</p>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order.refund?.status || 'processing')}`}>
                          {getStatusIcon(order.refund?.status || 'processing')}
                          <span className="capitalize">{order.refund?.status}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Refund Status Overview */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Refund Overview</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${getStatusColor(currentRefund.status)}`}>
                {getStatusIcon(currentRefund.status)}
                <span className="capitalize font-medium">{currentRefund.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-accent/50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Refund Amount</span>
                </div>
                <p className="text-2xl font-bold text-primary">${currentRefund.amount.toFixed(2)}</p>
              </div>
              
              <div className="bg-accent/50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Estimated Time</span>
                </div>
                <p className="text-2xl font-bold">
                  {currentRefund.status === 'completed' ? 'Completed' : `${getEstimatedDays(currentRefund.estimatedCompletion)} days`}
                </p>
              </div>
            </div>
            
            {currentRefund.status === 'processing' && (
              <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-warning" />
                  <span className="text-sm text-warning font-medium">Processing</span>
                </div>
                <p className="text-sm text-warning mt-1">
                  Your refund is being processed and will be credited to your original payment method.
                </p>
              </div>
            )}
            
            {currentRefund.status === 'completed' && (
              <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-success" />
                  <span className="text-sm text-success font-medium">Refund Completed</span>
                </div>
                <p className="text-sm text-success mt-1">
                  Your refund has been successfully processed on {formatDate(currentRefund.completedAt || currentRefund.initiatedAt)}.
                </p>
              </div>
            )}
            
            {currentRefund.status === 'failed' && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} className="text-destructive" />
                  <span className="text-sm text-destructive font-medium">Refund Failed</span>
                </div>
                <p className="text-sm text-destructive mt-1">
                  There was an issue processing your refund. Please contact support for assistance.
                </p>
              </div>
            )}
          </div>

          {/* Refund Details */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <h3 className="font-semibold mb-4">Refund Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Refund ID</span>
                <span className="font-medium">{currentRefund.id}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Refund Method</span>
                <div className="flex items-center space-x-2">
                  {getPaymentIcon(currentRefund.method)}
                  <span className="font-medium">{currentRefund.method}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Initiated On</span>
                <span className="font-medium">{formatDate(currentRefund.initiatedAt)}</span>
              </div>
              
              {currentRefund.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed On</span>
                  <span className="font-medium">{formatDate(currentRefund.completedAt)}</span>
                </div>
              )}
              
              <div className="flex items-start justify-between">
                <span className="text-muted-foreground">Reason</span>
                <span className="font-medium text-right max-w-48">{currentRefund.reason}</span>
              </div>
            </div>
          </div>

          {/* Refund Timeline */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <h3 className="font-semibold mb-4">Refund Timeline</h3>
            
            <div className="relative">
              {currentRefund.timeline.map((update, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-primary' : 'bg-muted'
                    }`}></div>
                    {index < currentRefund.timeline.length - 1 && (
                      <div className="w-px h-8 bg-border mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{update.message}</p>
                    <p className="text-sm text-muted-foreground">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details (Collapsible) */}
          <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
            <button
              onClick={() => setShowOrderDetails(!showOrderDetails)}
              className="w-full p-4 text-left hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Order Details</h3>
                {showOrderDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            
            {showOrderDetails && (
              <div className="border-t border-border p-4 space-y-4">
                {/* Restaurant Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <ImageWithFallback
                    src={selectedOrder.restaurant.image}
                    alt={selectedOrder.restaurant.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{selectedOrder.restaurant.name}</h4>
                    <p className="text-sm text-muted-foreground">Order placed on {formatDate(selectedOrder.placedAt)}</p>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Contact our support team for assistance</p>
              </div>
              <button
                onClick={() => setShowContactOptions(!showContactOptions)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <MessageCircle size={16} />
                <span>Contact Support</span>
              </button>
            </div>
            
            {showContactOptions && (
              <div className="grid grid-cols-1 gap-3 mt-4">
                <button
                  onClick={() => handleContactSupport('phone')}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Phone size={18} className="text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Call Support</p>
                    <p className="text-sm text-muted-foreground">+1 (800) 123-4567</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleContactSupport('email')}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Mail size={18} className="text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@foodya.com</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleContactSupport('chat')}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <MessageCircle size={18} className="text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}