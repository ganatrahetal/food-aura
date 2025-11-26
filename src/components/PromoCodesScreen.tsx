import React, { useState } from 'react';
import { ArrowLeft, Copy, Clock, Star, Gift, Percent, CheckCircle, X } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: number;
  expiresAt: string;
  isExpired: boolean;
  isUsed: boolean;
  category: 'delivery' | 'discount' | 'cashback' | 'new_user';
  termsAndConditions: string[];
}

interface PromoCodesScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  onApplyPromoCode?: (code: string) => void;
}

const promoCodes: PromoCode[] = [
  {
    id: '1',
    code: 'FREEDEL25',
    title: 'Free Delivery',
    description: 'Get free delivery on orders above $25',
    discount: 'Free Delivery',
    minOrder: 25,
    expiresAt: '2024-12-31',
    isExpired: false,
    isUsed: false,
    category: 'delivery',
    termsAndConditions: [
      'Valid on orders above $25',
      'Cannot be combined with other offers',
      'Valid till midnight'
    ]
  },
  {
    id: '2',
    code: 'WELCOME50',
    title: 'New User Special',
    description: 'Get 50% off up to $20 on your first order',
    discount: '50% OFF',
    minOrder: 15,
    expiresAt: '2024-12-31',
    isExpired: false,
    isUsed: false,
    category: 'new_user',
    termsAndConditions: [
      'Valid for new users only',
      'Maximum discount $20',
      'Minimum order $15'
    ]
  },
  {
    id: '3',
    code: 'LUNCH40',
    title: 'Lunch Special',
    description: '40% off on all lunch combos between 11 AM - 3 PM',
    discount: '40% OFF',
    minOrder: 12,
    expiresAt: '2024-12-31',
    isExpired: false,
    isUsed: false,
    category: 'discount',
    termsAndConditions: [
      'Valid only between 11 AM - 3 PM',
      'Applicable on lunch combos only',
      'Cannot be combined with other offers'
    ]
  },
  {
    id: '4',
    code: 'WEEKEND21',
    title: 'Weekend Feast',
    description: 'Buy 2 Get 1 Free on all family meals',
    discount: 'BOGO',
    minOrder: 30,
    expiresAt: '2024-12-31',
    isExpired: false,
    isUsed: false,
    category: 'discount',
    termsAndConditions: [
      'Valid on weekends only',
      'Applicable on family meals',
      'Free item will be of equal or lesser value'
    ]
  },
  {
    id: '5',
    code: 'CASHBACK20',
    title: 'Cashback Offer',
    description: 'Get 20% cashback up to $10 on digital payments',
    discount: '20% Cashback',
    minOrder: 20,
    expiresAt: '2024-12-31',
    isExpired: false,
    isUsed: false,
    category: 'cashback',
    termsAndConditions: [
      'Valid on digital payments only',
      'Maximum cashback $10',
      'Cashback credited within 24 hours'
    ]
  },
  {
    id: '6',
    code: 'PIZZA30',
    title: 'Pizza Lover',
    description: '30% off on all pizzas from select restaurants',
    discount: '30% OFF',
    minOrder: 18,
    expiresAt: '2024-11-30',
    isExpired: true,
    isUsed: false,
    category: 'discount',
    termsAndConditions: [
      'Valid on pizzas only',
      'Select restaurants only',
      'Cannot be combined with other offers'
    ]
  },
  {
    id: '7',
    code: 'SAVE15',
    title: 'Save More',
    description: 'Flat $15 off on orders above $60',
    discount: '$15 OFF',
    minOrder: 60,
    expiresAt: '2024-12-31',
    isExpired: false,
    isUsed: true,
    category: 'discount',
    termsAndConditions: [
      'Valid on orders above $60',
      'One time use only',
      'Cannot be combined with other offers'
    ]
  }
];

export function PromoCodesScreen({ onBack, onShowNotification, onApplyPromoCode }: PromoCodesScreenProps) {
  const [filter, setFilter] = useState<'all' | 'available' | 'expired' | 'used'>('all');
  const [selectedCode, setSelectedCode] = useState<PromoCode | null>(null);

  const filteredCodes = promoCodes.filter(code => {
    if (filter === 'available') return !code.isExpired && !code.isUsed;
    if (filter === 'expired') return code.isExpired;
    if (filter === 'used') return code.isUsed;
    return true;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    onShowNotification(`Code ${code} copied!`, 'success');
  };

  const handleApplyCode = (code: PromoCode) => {
    if (code.isExpired) {
      onShowNotification('This promo code has expired', 'error');
      return;
    }
    if (code.isUsed) {
      onShowNotification('This promo code has already been used', 'error');
      return;
    }
    
    if (onApplyPromoCode) {
      onApplyPromoCode(code.code);
    }
    onShowNotification(`Promo code ${code.code} applied!`, 'success');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'delivery': return 'bg-green-100 text-green-600';
      case 'discount': return 'bg-orange-100 text-orange-600';
      case 'cashback': return 'bg-purple-100 text-purple-600';
      case 'new_user': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'delivery': return 'Free Delivery';
      case 'discount': return 'Discount';
      case 'cashback': return 'Cashback';
      case 'new_user': return 'New User';
      default: return category;
    }
  };

  const filters = [
    { key: 'all', label: 'All Codes', count: promoCodes.length },
    { key: 'available', label: 'Available', count: promoCodes.filter(c => !c.isExpired && !c.isUsed).length },
    { key: 'expired', label: 'Expired', count: promoCodes.filter(c => c.isExpired).length },
    { key: 'used', label: 'Used', count: promoCodes.filter(c => c.isUsed).length }
  ];

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
            <h1 className="text-xl font-semibold">Promo Codes</h1>
            <p className="text-sm text-muted-foreground">Choose from available offers</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters with visible scrollbar */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-visible">
          {filters.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex items-center space-x-2 flex-shrink-0 ${
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Gift size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No promo codes found</h3>
            <p className="text-muted-foreground">Try changing the filter to see more codes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCodes.map((code, index) => (
              <div
                key={code.id}
                className={`bg-card border rounded-2xl p-6 shadow-soft hover:shadow-card transition-all animate-fade-in ${
                  code.isExpired ? 'opacity-60' : code.isUsed ? 'opacity-75' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(code.category)}`}>
                        {getCategoryLabel(code.category)}
                      </div>
                      {code.isExpired && (
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                          Expired
                        </div>
                      )}
                      {code.isUsed && (
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Used
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{code.title}</h3>
                    <p className="text-muted-foreground text-sm">{code.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-1">{code.discount}</div>
                    <div className="text-xs text-muted-foreground">Min ${code.minOrder}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-dashed border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-lg font-bold text-primary">{code.code}</div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>Expires {code.expiresAt}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode(code.code)}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCode(code)}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    View Terms
                  </button>
                  <button
                    onClick={() => handleApplyCode(code)}
                    disabled={code.isExpired || code.isUsed}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      code.isExpired || code.isUsed 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {code.isExpired ? 'Expired' : code.isUsed ? 'Used' : 'Apply Code'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile-Optimized Terms Modal */}
      {selectedCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-2xl shadow-elevated max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Terms & Conditions</h3>
              <button
                onClick={() => setSelectedCode(null)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="mb-4">
                <div className="font-semibold text-primary">{selectedCode.code}</div>
                <div className="text-sm text-muted-foreground">{selectedCode.title}</div>
              </div>
              
              <div className="space-y-3">
                {selectedCode.termsAndConditions.map((term, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground flex-1">{term}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => {
                  handleApplyCode(selectedCode);
                  setSelectedCode(null);
                }}
                disabled={selectedCode.isExpired || selectedCode.isUsed}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedCode.isExpired || selectedCode.isUsed 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {selectedCode.isExpired ? 'Code Expired' : selectedCode.isUsed ? 'Code Used' : 'Apply This Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}