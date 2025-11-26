import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, X, ShoppingBag, CreditCard, Gift, MapPin, Clock, Truck, Percent, Tag, Send, Edit3, Eye, ChevronRight, MapPinIcon, Smartphone, Banknote, WalletCards, CheckCircle, Shield, Lock } from 'lucide-react';
import { CartItem, Location } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartScreenProps {
  cartItems: CartItem[];
  updateQuantity: (itemId: string, quantity: number, customizations?: string[]) => void;
  clearCart: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  currentLocation: Location;
  onBack: () => void;
  onTrackOrder: () => void;
  onPlaceOrder: (orderData: { paymentMethod: string; giftMessage?: string }) => void;
  onLocationChange?: (location: Location) => void;
}

const availablePromoCodes = [
  {
    code: 'WELCOME10',
    title: 'Welcome Offer',
    description: '10% off on your order',
    discount: 10,
    minOrder: 15,
    type: 'percentage' as const,
    validUntil: '2024-12-31',
    terms: 'Valid for new users only'
  },
  {
    code: 'SAVE15',
    title: 'Save Big',
    description: '15% off orders above $25',
    discount: 15,
    minOrder: 25,
    type: 'percentage' as const,
    validUntil: '2024-12-31',
    terms: 'Valid on all restaurants'
  },
  {
    code: 'FIRSTORDER',
    title: 'First Order Special',
    description: '20% off your first order',
    discount: 20,
    minOrder: 10,
    type: 'percentage' as const,
    validUntil: '2024-12-31',
    terms: 'One-time use only'
  },
  {
    code: 'STUDENT',
    title: 'Student Discount',
    description: '5% off for students',
    discount: 5,
    minOrder: 5,
    type: 'percentage' as const,
    validUntil: '2024-12-31',
    terms: 'Valid student ID required'
  },
  {
    code: 'FREEDELIVERY',
    title: 'Free Delivery',
    description: 'Free delivery on any order',
    discount: 2.99,
    minOrder: 0,
    type: 'fixed' as const,
    validUntil: '2024-12-31',
    terms: 'Delivery fee waived'
  }
];

// Available addresses for user selection
const availableAddresses: Location[] = [
  {
    id: 'home',
    name: 'Home',
    address: '123 Broadway Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  {
    id: 'work',
    name: 'Work',
    address: '456 Madison Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10022'
  },
  {
    id: 'friends',
    name: 'Friend\'s Place',
    address: '789 Fifth Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10128'
  }
];

// Payment methods without initial paid status
const paymentMethods = [
  {
    id: 'visa_card_123',
    type: 'Visa Card',
    display: 'Visa ending 1234',
    lastFour: '1234',
    cardType: 'Visa',
    icon: CreditCard,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    requiresOTP: true
  },
  {
    id: 'mastercard_456',
    type: 'Mastercard',
    display: 'Mastercard ending 4567',
    lastFour: '4567',
    cardType: 'Mastercard',
    icon: CreditCard,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    requiresOTP: true
  },
  {
    id: 'apple_pay',
    type: 'Apple Pay',
    display: 'Apple Pay',
    icon: Smartphone,
    iconColor: 'text-gray-800',
    bgColor: 'bg-gray-50',
    requiresOTP: true
  },
  {
    id: 'google_pay',
    type: 'Google Pay',
    display: 'Google Pay',
    icon: WalletCards,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    requiresOTP: true
  },
  {
    id: 'cash',
    type: 'Cash on Delivery',
    display: 'Cash on Delivery',
    icon: Banknote,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    requiresOTP: false
  }
];

export function CartScreen({ 
  cartItems, 
  updateQuantity, 
  clearCart, 
  onShowNotification, 
  currentLocation, 
  onBack, 
  onTrackOrder,
  onPlaceOrder,
  onLocationChange
}: CartScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState('visa_card_123');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<typeof availablePromoCodes[0] | null>(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [isGiftMessageSaved, setIsGiftMessageSaved] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Payment flow states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOTP] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [otpError, setOtpError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 30 ? 0 : 2.99;
  const tax = subtotal * 0.0875; // 8.75% tax
  
  // Calculate discount based on applied promo code
  let discountAmount = 0;
  if (appliedPromoCode) {
    if (subtotal >= appliedPromoCode.minOrder) {
      if (appliedPromoCode.type === 'percentage') {
        discountAmount = subtotal * (appliedPromoCode.discount / 100);
      } else {
        discountAmount = appliedPromoCode.discount;
      }
    }
  }

  const finalDeliveryFee = appliedPromoCode?.code === 'FREEDELIVERY' ? 0 : deliveryFee;
  const total = subtotal + finalDeliveryFee + tax - discountAmount;

  // Get selected payment method details
  const selectedPayment = paymentMethods.find(pm => pm.id === paymentMethod);

  const handleApplyPromoCode = (code: string) => {
    const promo = availablePromoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    
    if (promo) {
      if (subtotal >= promo.minOrder) {
        setAppliedPromoCode(promo);
        setPromoCode(code);
        onShowNotification(`Promo code ${code} applied! ${promo.description}`, 'success');
      } else {
        onShowNotification(`Minimum order of $${promo.minOrder} required for this promo code`, 'error');
      }
    } else {
      onShowNotification('Invalid promo code', 'error');
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
    setPromoCode('');
    onShowNotification('Promo code removed', 'info');
  };

  const handlePromoCodeSelect = (selectedPromo: typeof availablePromoCodes[0]) => {
    if (subtotal >= selectedPromo.minOrder) {
      setAppliedPromoCode(selectedPromo);
      setPromoCode(selectedPromo.code);
      setShowPromoModal(false);
      onShowNotification(`${selectedPromo.title} applied! ${selectedPromo.description}`, 'success');
    } else {
      onShowNotification(`Minimum order of $${selectedPromo.minOrder} required for this offer`, 'error');
    }
  };

  const handleAddressSelect = (address: Location) => {
    if (onLocationChange) {
      onLocationChange(address);
    }
    setShowAddressModal(false);
    onShowNotification(`Delivery address changed to ${address.name}`, 'success');
  };

  const handleSaveGiftMessage = () => {
    if (!giftMessage.trim()) {
      onShowNotification('Please enter a gift message', 'error');
      return;
    }
    setIsGiftMessageSaved(true);
    onShowNotification('Gift message saved! 🎁', 'success');
  };

  const handleEditGiftMessage = () => {
    setIsGiftMessageSaved(false);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      onShowNotification('Your cart is empty', 'error');
      return;
    }

    if (isGiftOrder && !giftMessage.trim()) {
      onShowNotification('Please enter a gift message for your gift order', 'error');
      return;
    }

    // If payment method requires OTP, show OTP modal
    if (selectedPayment?.requiresOTP) {
      setShowOTPModal(true);
      return;
    }

    // For Cash on Delivery, proceed directly
    proceedWithOrder();
  };

  const handleOTPVerification = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter OTP');
      return;
    }

    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }

    setIsVerifyingOTP(true);
    setOtpError('');

    // Simulate OTP verification
    setTimeout(() => {
      if (otp === '123456') {
        setIsVerifyingOTP(false);
        setShowOTPModal(false);
        setShowPaymentSuccess(true);
        
        // Show payment success for 2 seconds, then place order
        setTimeout(() => {
          setShowPaymentSuccess(false);
          proceedWithOrder();
        }, 2000);
      } else {
        setIsVerifyingOTP(false);
        setOtpError('Invalid OTP. Please try again.');
      }
    }, 2000);
  };

  const proceedWithOrder = () => {
    setIsPlacingOrder(true);
    
    // Simulate order processing
    setTimeout(() => {
      const paymentDisplay = selectedPayment?.requiresOTP 
        ? `Paid by ${selectedPayment.display}` 
        : selectedPayment?.display || paymentMethod;
        
      onPlaceOrder({
        paymentMethod: paymentDisplay,
        giftMessage: isGiftOrder ? giftMessage : undefined
      });
      setIsPlacingOrder(false);
    }, 1000);
  };

  const handleResendOTP = () => {
    setOTP('');
    setOtpError('');
    onShowNotification('OTP resent successfully', 'success');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground text-center mb-8">
            Add some delicious items to your cart and they'll appear here
          </p>
          <button
            onClick={onBack}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  const restaurantName = cartItems[0]?.restaurantName || 'Restaurant';

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="p-4 space-y-6">
          {/* Restaurant Header */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{restaurantName}</h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>25-35 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck size={14} />
                    <span>${finalDeliveryFee === 0 ? 'Free' : finalDeliveryFee.toFixed(2)} delivery</span>
                  </div>
                </div>
              </div>
              <button
                onClick={clearCart}
                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Your Order</h3>
            </div>
            <div className="divide-y divide-border">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${JSON.stringify(item.customizations)}`} className="p-4">
                  <div className="flex items-start space-x-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      {item.customizations && item.customizations.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.customizations.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-muted rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.customizations)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-medium w-16 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Code */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center space-x-2 mb-3">
              <Percent size={20} className="text-primary" />
              <h3 className="font-semibold">Promo Code</h3>
            </div>
            
            {appliedPromoCode ? (
              <div className="space-y-3">
                <div className="p-3 bg-success/10 text-success rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Tag size={16} />
                        <span className="font-medium">{appliedPromoCode.title}</span>
                      </div>
                      <p className="text-sm mt-1">{appliedPromoCode.description}</p>
                    </div>
                    <button
                      onClick={handleRemovePromoCode}
                      className="p-1 hover:bg-success/20 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowPromoModal(true)}
                  className="w-full flex items-center justify-center space-x-2 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Eye size={16} />
                  <span>View Other Promo Codes</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => handleApplyPromoCode(promoCode)}
                    disabled={!promoCode.trim()}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
                <button
                  onClick={() => setShowPromoModal(true)}
                  className="w-full flex items-center justify-center space-x-2 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Eye size={16} />
                  <span>View Promo Codes</span>
                </button>
              </div>
            )}
          </div>

          {/* Gift Message */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Gift size={20} className="text-primary" />
                <h3 className="font-semibold">Gift Order</h3>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isGiftOrder}
                  onChange={(e) => {
                    setIsGiftOrder(e.target.checked);
                    if (!e.target.checked) {
                      setGiftMessage('');
                      setIsGiftMessageSaved(false);
                    }
                  }}
                  className="w-4 h-4 text-primary bg-input-background border-border rounded focus:ring-primary"
                />
                <span className="text-sm">This is a gift</span>
              </label>
            </div>
            
            {isGiftOrder && (
              <div className="space-y-3">
                {!isGiftMessageSaved ? (
                  <>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Enter your gift message here..."
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-none"
                      maxLength={200}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {giftMessage.length}/200 characters
                      </span>
                      <button
                        onClick={handleSaveGiftMessage}
                        disabled={!giftMessage.trim()}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Send size={16} />
                        <span>Save Message</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-30 -translate-y-8 translate-x-8"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full opacity-20 translate-y-4 -translate-x-4"></div>
                    
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                            <Gift size={16} className="text-white" />
                          </div>
                          <span className="font-semibold text-pink-700">Gift Message</span>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-pink-200/50">
                          <p className="text-pink-800 italic leading-relaxed">
                            &ldquo;{giftMessage}&rdquo;
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleEditGiftMessage}
                        className="ml-3 p-2 hover:bg-pink-100 rounded-lg transition-colors text-pink-600 group"
                        title="Edit message"
                      >
                        <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delivery Address - Changeable */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MapPin size={20} className="text-primary" />
                <h3 className="font-semibold">Delivery Address</h3>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="flex items-center space-x-1 text-primary hover:bg-primary/10 px-3 py-1 rounded-lg transition-colors"
              >
                <Edit3 size={14} />
                <span className="text-sm">Change</span>
              </button>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                <MapPinIcon size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{currentLocation.name}</p>
                <p className="text-sm text-muted-foreground">{currentLocation.address}</p>
                <p className="text-sm text-muted-foreground">{currentLocation.city}, {currentLocation.state} {currentLocation.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Payment Method - Without Initial Paid Status */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard size={20} className="text-primary" />
              <h3 className="font-semibold">Payment Method</h3>
            </div>
            
            {/* Payment Options */}
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <label key={method.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <div className={`w-10 h-10 ${method.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon size={18} className={method.iconColor} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{method.type}</span>
                        {method.requiresOTP && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            Secure
                          </span>
                        )}
                        {!method.requiresOTP && (
                          <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                            COD
                          </span>
                        )}
                      </div>
                      {method.lastFour && (
                        <p className="text-sm text-muted-foreground">
                          {method.cardType} ending in {method.lastFour}
                        </p>
                      )}
                      {method.id === 'cash' && (
                        <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                      )}
                      {method.id === 'apple_pay' && (
                        <p className="text-sm text-muted-foreground">Touch ID or Face ID required</p>
                      )}
                      {method.id === 'google_pay' && (
                        <p className="text-sm text-muted-foreground">Secure payment via Google</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-2xl p-4 shadow-soft border border-border">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={finalDeliveryFee === 0 ? 'text-success' : ''}>
                  ${finalDeliveryFee === 0 ? '0.00' : finalDeliveryFee.toFixed(2)}
                  {appliedPromoCode?.code === 'FREEDELIVERY' && (
                    <span className="text-xs text-success ml-1">(Free)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount ({appliedPromoCode?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="bg-card border-t border-border p-4">
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <span>Pay ${total.toFixed(2)}</span>
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated w-full max-w-md animate-scale-in">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verify Payment</h3>
                <p className="text-muted-foreground">
                  Enter the 6-digit OTP sent to your registered mobile number
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOTP(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setOtpError('');
                    }}
                    placeholder="123456"
                    className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  {otpError && (
                    <p className="text-destructive text-sm mt-1">{otpError}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowOTPModal(false)}
                    className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOTPVerification}
                    disabled={isVerifyingOTP || !otp.trim()}
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isVerifyingOTP ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Verify & Pay</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={handleResendOTP}
                    className="text-primary hover:underline text-sm"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated w-full max-w-md animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-success">Payment Successful!</h3>
              <p className="text-muted-foreground mb-4">
                Your payment of ${total.toFixed(2)} has been processed successfully
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                <span>Processing your order...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promo Codes Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated w-full max-w-md animate-scale-in max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Available Promo Codes</h3>
                <button
                  onClick={() => setShowPromoModal(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-soft">
              {availablePromoCodes.map((promo) => (
                <button
                  key={promo.code}
                  onClick={() => handlePromoCodeSelect(promo)}
                  disabled={subtotal < promo.minOrder}
                  className="w-full p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{promo.title}</span>
                    <span className="text-sm text-primary font-bold">{promo.code}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{promo.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Min order: ${promo.minOrder}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Valid until: {promo.validUntil}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated w-full max-w-md animate-scale-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Select Delivery Address</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {availableAddresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleAddressSelect(address)}
                  className={`w-full p-4 border rounded-lg hover:bg-accent transition-colors text-left ${
                    currentLocation.id === address.id ? 'border-primary bg-primary/10' : 'border-border'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPinIcon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm text-muted-foreground">{address.address}</p>
                      <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zipCode}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}