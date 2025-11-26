import React, { useState } from 'react';
import { ArrowLeft, Plus, CreditCard, Shield, Star, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple' | 'google';
  name: string;
  details: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  icon: string;
}

interface PaymentMethodsProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function PaymentMethods({ onBack, onShowNotification }: PaymentMethodsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa Card',
      details: '**** **** **** 1234',
      lastFour: '1234',
      expiryDate: '12/25',
      isDefault: true,
      icon: '💳'
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      details: 'john.doe@gmail.com',
      isDefault: false,
      icon: '💙'
    },
    {
      id: '3',
      type: 'apple',
      name: 'Apple Pay',
      details: 'Touch ID',
      isDefault: false,
      icon: '🍎'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
    onShowNotification('Default payment method updated', 'success');
  };

  const handleDeleteMethod = (methodId: string) => {
    const methodToDelete = paymentMethods.find(method => method.id === methodId);
    if (methodToDelete?.isDefault && paymentMethods.length > 1) {
      setPaymentMethods(prev => {
        const filtered = prev.filter(method => method.id !== methodId);
        if (filtered.length > 0) {
          filtered[0].isDefault = true;
        }
        return filtered;
      });
    } else {
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    }
    onShowNotification('Payment method deleted successfully', 'success');
  };

  if (showAddForm) {
    return (
      <AddPaymentMethod
        onBack={() => setShowAddForm(false)}
        onSave={(newMethod) => {
          const id = Date.now().toString();
          setPaymentMethods(prev => [...prev, { ...newMethod, id }]);
          setShowAddForm(false);
          onShowNotification('Payment method added successfully', 'success');
        }}
      />
    );
  }

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
          <h1 className="text-xl font-semibold">Payment Methods</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Security Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Shield className="text-primary mt-1" size={20} />
            <div>
              <h3 className="font-medium text-primary mb-1">Secure Payments</h3>
              <p className="text-sm text-primary/80">
                Your payment information is encrypted and secure. We never store your full card details.
              </p>
            </div>
          </div>
        </div>

        {/* Add New Payment Method */}
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/10 transition-colors"
        >
          <Plus size={20} className="text-primary" />
          <span className="text-primary font-medium">Add New Payment Method</span>
        </button>

        {/* Payment Methods List */}
        <div className="space-y-3">
          <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
            Your Payment Methods
          </h3>
          {paymentMethods.map((method, index) => (
            <div
              key={method.id}
              className="bg-card border border-border rounded-xl p-4 shadow-soft hover:shadow-card transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{method.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{method.name}</h3>
                      {method.isDefault && (
                        <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          <Star size={12} className="fill-current" />
                          <span>Default</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{method.details}</p>
                    {method.expiryDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires {method.expiryDate}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {method.type === 'card' && (
                    <button
                      onClick={() => setEditingMethod(method)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {!method.isDefault && (
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-primary text-sm font-medium hover:text-primary/80"
                  >
                    Set as Default
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment Security Info */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <h3 className="font-medium">Payment Security</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>PCI DSS compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Fraud protection enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddPaymentMethodProps {
  onBack: () => void;
  onSave: (method: Omit<PaymentMethod, 'id'>) => void;
}

function AddPaymentMethod({ onBack, onSave }: AddPaymentMethodProps) {
  const [selectedType, setSelectedType] = useState<'card' | 'paypal' | 'apple'>('card');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedType === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard) {
        alert('Please fill in all card details');
        return;
      }
      
      const lastFour = formData.cardNumber.slice(-4);
      onSave({
        type: 'card',
        name: `**** **** **** ${lastFour}`,
        details: `**** **** **** ${lastFour}`,
        lastFour,
        expiryDate: formData.expiryDate,
        isDefault: formData.isDefault,
        icon: '💳'
      });
    } else if (selectedType === 'paypal') {
      onSave({
        type: 'paypal',
        name: 'PayPal',
        details: 'john.doe@gmail.com',
        isDefault: formData.isDefault,
        icon: '💙'
      });
    } else if (selectedType === 'apple') {
      onSave({
        type: 'apple',
        name: 'Apple Pay',
        details: 'Touch ID',
        isDefault: formData.isDefault,
        icon: '🍎'
      });
    }
  };

  const paymentTypes = [
    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { value: 'paypal', label: 'PayPal', icon: '💙' },
    { value: 'apple', label: 'Apple Pay', icon: '🍎' }
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
          <h1 className="text-xl font-semibold">Add Payment Method</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Payment Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Payment Method Type</label>
            <div className="space-y-3">
              {paymentTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value as any)}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    selectedType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-medium">{type.label}</span>
                  <div className="flex-1"></div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedType === type.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedType === type.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details Form */}
          {selectedType === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <div className="relative">
                  <input
                    type={showCardNumber ? 'text' : 'password'}
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-3 pr-10 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    maxLength={19}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCardNumber(!showCardNumber)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCardNumber ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    placeholder="MM/YY"
                    className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="password"
                    value={formData.cvv}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name on Card</label>
                <input
                  type="text"
                  value={formData.nameOnCard}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameOnCard: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* Digital Payment Info */}
          {(selectedType === 'paypal' || selectedType === 'apple') && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                {selectedType === 'paypal' 
                  ? 'You will be redirected to PayPal to complete the setup.'
                  : 'Apple Pay will be configured using your device settings.'
                }
              </p>
            </div>
          )}

          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="setDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="text-primary focus:ring-primary"
            />
            <label htmlFor="setDefault" className="text-sm">
              Set as default payment method
            </label>
          </div>
        </form>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Add Payment Method
        </button>
      </div>
    </div>
  );
}