import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronRight, Phone, Mail, MessageCircle, Clock, Book, FileText, Shield, CreditCard, Truck, Star, AlertCircle, ExternalLink } from 'lucide-react';

interface HelpSupportScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const faqData = [
  {
    id: 1,
    category: 'Orders & Delivery',
    icon: Truck,
    questions: [
      {
        question: 'How do I track my order?',
        answer: 'You can track your order in real-time by going to "My Orders" in your profile or by clicking the "Track Order" button on your order confirmation. You\'ll see live updates about your order status, estimated delivery time, and delivery partner location.'
      },
      {
        question: 'What should I do if my order is late?',
        answer: 'If your order is running late, first check the tracking page for updates. Weather conditions and restaurant preparation time can affect delivery. If your order is significantly delayed, contact our support team and we\'ll help resolve the issue or provide compensation.'
      },
      {
        question: 'Can I modify my order after placing it?',
        answer: 'Orders can only be modified within 2 minutes of placement. After that, the restaurant begins preparation and changes aren\'t possible. If you need to make changes, contact support immediately and we\'ll try to help.'
      },
      {
        question: 'How do I cancel my order?',
        answer: 'You can cancel your order within 1 minute of placement using the "Cancel Order" button in order tracking. After this window, cancellation depends on the restaurant\'s policy. Contact support for assistance with cancellations.'
      },
      {
        question: 'What are the delivery charges?',
        answer: 'Delivery charges vary by restaurant and distance. Most restaurants charge $1.99-$4.99 for delivery. Some restaurants offer free delivery on orders above a certain amount. You\'ll see the exact delivery charge before confirming your order.'
      }
    ]
  },
  {
    id: 2,
    category: 'Payments & Billing',
    icon: CreditCard,
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, Apple Pay, Google Pay, and cash on delivery. You can save multiple payment methods in your profile for quick checkout.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and security measures to protect your payment information. We never store your full card details and all transactions are processed through secure, PCI-compliant payment gateways.'
      },
      {
        question: 'How do refunds work?',
        answer: 'Refunds are processed back to your original payment method within 3-5 business days. For cash orders, refunds are credited to your FoodFlow wallet. You can request refunds through the app or by contacting support.'
      },
      {
        question: 'Why was my payment declined?',
        answer: 'Payment declines can happen due to insufficient funds, expired cards, or bank security measures. Try using a different payment method or contact your bank. If the issue persists, our support team can help troubleshoot.'
      }
    ]
  },
  {
    id: 3,
    category: 'Account & Profile',
    icon: Star,
    questions: [
      {
        question: 'How do I update my profile information?',
        answer: 'Go to your Profile and tap "Edit Profile" to update your name, email, phone number, and profile photo. Changes are saved automatically and synced across all your devices.'
      },
      {
        question: 'How do I change my delivery address?',
        answer: 'You can manage your addresses in Profile > Manage Addresses. Add new addresses, edit existing ones, or set a default address. You can also change your delivery address during checkout.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'To delete your account, go to Profile > Privacy & Security > Delete Account. This action is permanent and will remove all your data, order history, and saved preferences. Contact support if you need assistance.'
      },
      {
        question: 'Why am I not receiving notifications?',
        answer: 'Check your notification settings in Profile > Notifications. Make sure notifications are enabled for your device and that FoodFlow has permission to send notifications. You can customize which notifications you receive.'
      }
    ]
  },
  {
    id: 4,
    category: 'Food & Restaurants',
    icon: Book,
    questions: [
      {
        question: 'How do I find restaurants near me?',
        answer: 'The app automatically shows restaurants that deliver to your location. You can use the search function to find specific cuisines or restaurants, and apply filters to narrow down your options by rating, delivery time, or price range.'
      },
      {
        question: 'Are the food images accurate?',
        answer: 'We work with restaurants to ensure food images are as accurate as possible. However, actual presentation may vary. If you\'re significantly unsatisfied with how your food looks compared to the image, contact support for assistance.'
      },
      {
        question: 'How do I report a food quality issue?',
        answer: 'If you\'re unsatisfied with your food quality, you can rate and review your order in the app. For serious issues, contact support immediately. We\'ll work with the restaurant to resolve the issue and may offer a refund or credit.'
      },
      {
        question: 'Can I request special dietary accommodations?',
        answer: 'Many restaurants accommodate dietary restrictions and allergies. Check the restaurant\'s menu for dietary icons (vegetarian, vegan, gluten-free) and use the special instructions field when ordering. Contact the restaurant directly for specific questions.'
      }
    ]
  }
];

const contactOptions = [
  {
    icon: Phone,
    title: 'Call Support',
    subtitle: 'Get instant help from our team',
    action: 'Call: 1-800-FOODFLOW',
    available: '24/7',
    color: 'text-green-600'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    subtitle: 'Chat with our support agents',
    action: 'Start Chat',
    available: 'Available now',
    color: 'text-blue-600'
  },
  {
    icon: Mail,
    title: 'Email Support',
    subtitle: 'Send us a detailed message',
    action: 'support@foodflow.com',
    available: 'Response in 2-4 hours',
    color: 'text-purple-600'
  }
];

const quickLinks = [
  {
    icon: FileText,
    title: 'Terms of Service',
    subtitle: 'Read our terms and conditions'
  },
  {
    icon: Shield,
    title: 'Privacy Policy',
    subtitle: 'How we protect your data'
  },
  {
    icon: Book,
    title: 'Community Guidelines',
    subtitle: 'Rules for reviews and conduct'
  },
  {
    icon: AlertCircle,
    title: 'Report an Issue',
    subtitle: 'Report bugs or technical problems'
  }
];

export function HelpSupportScreen({ onBack, onShowNotification }: HelpSupportScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqData.filter(category => 
    category.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.questions.some(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleContactAction = (action: string) => {
    if (action.includes('Call:')) {
      onShowNotification('Opening phone dialer...', 'info');
    } else if (action === 'Start Chat') {
      onShowNotification('Starting live chat...', 'info');
    } else if (action.includes('@')) {
      onShowNotification('Opening email client...', 'info');
    }
  };

  const handleQuickLink = (title: string) => {
    onShowNotification(`Opening ${title}...`, 'info');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary via-orange-500 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 animate-float"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-4 -translate-x-4 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10 text-center">
              <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
              <p className="text-white/90">We're here to help you 24/7</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Contact Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Contact Support</h2>
            <div className="grid gap-3">
              {contactOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleContactAction(option.action)}
                  className="bg-card rounded-xl p-4 border border-border hover:bg-accent transition-colors flex items-center space-x-4"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-accent`}>
                    <option.icon size={24} className={option.color} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                    <p className="text-sm text-primary font-medium">{option.action}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{option.available}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
            
            {filteredFAQs.map((category) => (
              <div key={category.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <category.icon size={20} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{category.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.questions.length} questions
                      </p>
                    </div>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform ${selectedCategory === category.id ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {selectedCategory === category.id && (
                  <div className="border-t border-border">
                    {category.questions.map((faq, index) => (
                      <div key={index} className="border-b border-border last:border-b-0">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                          className="w-full p-4 text-left hover:bg-accent transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium">{faq.question}</span>
                          <ChevronRight 
                            size={16} 
                            className={`transition-transform ${expandedFAQ === index ? 'rotate-90' : ''}`}
                          />
                        </button>
                        
                        {expandedFAQ === index && (
                          <div className="px-4 pb-4">
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <Search size={40} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">Try searching with different keywords</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Quick Links</h2>
            <div className="grid gap-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLink(link.title)}
                  className="bg-card rounded-xl p-4 border border-border hover:bg-accent transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <link.icon size={20} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.subtitle}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* App Version */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="text-center">
              <h3 className="font-semibold mb-2">FoodFlow App</h3>
              <p className="text-sm text-muted-foreground">Version 2.4.1</p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: December 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}