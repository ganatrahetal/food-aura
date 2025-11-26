import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, MapPin, Clock, Star, Shield, Camera, Paperclip, MoreVertical, CheckCheck, Check } from 'lucide-react';
import { Order } from '../App';

interface DeliveryPartnerChatScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  orders: Order[];
}

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isUser: boolean;
  isDelivered: boolean;
  isRead: boolean;
  type: 'text' | 'location' | 'image' | 'order_update';
}

const mockDeliveryPartner = {
  id: 'dp_001',
  name: 'Mike Johnson',
  phone: '+1 (555) 987-6543',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
  rating: 4.8,
  totalDeliveries: 1247,
  vehicle: 'Honda Civic',
  vehicleNumber: 'NYC-4567',
  isOnline: true,
  isTyping: false,
  eta: '8 mins'
};

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    message: 'Hi! I\'m Mike, your delivery partner. I have picked up your order from Joe\'s Pizza and I\'m on my way! 🍕',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isUser: false,
    isDelivered: true,
    isRead: true,
    type: 'text'
  },
  {
    id: '2',
    message: 'Great! Thank you for the update. How long will it take?',
    timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    isUser: true,
    isDelivered: true,
    isRead: true,
    type: 'text'
  },
  {
    id: '3',
    message: 'I should be there in about 8-10 minutes. There\'s a bit of traffic on Broadway but I\'m taking an alternate route.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    isUser: false,
    isDelivered: true,
    isRead: true,
    type: 'text'
  },
  {
    id: '4',
    message: 'Perfect! I\'ll be waiting downstairs.',
    timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    isUser: true,
    isDelivered: true,
    isRead: true,
    type: 'text'
  },
  {
    id: '5',
    message: 'I\'m about 2 minutes away from your location. Please come to the main entrance.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isUser: false,
    isDelivered: true,
    isRead: false,
    type: 'text'
  }
];

export function DeliveryPartnerChatScreen({ onBack, onShowNotification, orders }: DeliveryPartnerChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentOrder = orders.length > 0 ? orders[0] : null;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate partner typing
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setPartnerTyping(true);
        setTimeout(() => setPartnerTyping(false), 2000);
      }
    }, 10000);

    return () => clearInterval(typingInterval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isUser: true,
      isDelivered: false,
      isRead: false,
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, isDelivered: true }
            : msg
        )
      );
    }, 1000);

    // Simulate partner response
    setTimeout(() => {
      const responses = [
        "Got it! Thanks for letting me know.",
        "I'll be there shortly!",
        "Thanks for the update! See you soon.",
        "Perfect, I'm on my way!",
        "Understood. I'll contact you when I arrive."
      ];
      
      const partnerResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        isUser: false,
        isDelivered: true,
        isRead: false,
        type: 'text'
      };

      setMessages(prev => [...prev, partnerResponse]);
      setIsTyping(false);
    }, 3000);
  };

  const handleCallPartner = () => {
    onShowNotification(`Calling ${mockDeliveryPartner.name}...`, 'info');
    // In a real app, this would initiate a phone call
    setTimeout(() => {
      window.open(`tel:${mockDeliveryPartner.phone}`);
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const quickReplies = [
    "I'm here",
    "5 more minutes",
    "At the main entrance",
    "Thank you!"
  ];

  return (
    <div className="flex flex-col h-full bg-background max-w-md mx-auto">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft">
        <div className="flex items-center space-x-3">
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
              <h3 className="font-semibold">{mockDeliveryPartner.name}</h3>
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
            <div className="flex items-center space-x-1 text-xs text-success">
              <Clock size={12} />
              <span>ETA: {mockDeliveryPartner.eta}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCallPartner}
              className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
            >
              <Phone size={18} />
            </button>
            <button className="p-2 bg-muted rounded-lg hover:bg-accent transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-3 p-3 bg-accent/50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Phone size={14} className="text-primary" />
            <span className="font-medium">Contact Number:</span>
            <span className="text-primary font-mono">{mockDeliveryPartner.phone}</span>
          </div>
        </div>
      </div>

      {/* Order Information */}
      {currentOrder && (
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Order #{currentOrder.id}</h4>
              <p className="text-sm text-muted-foreground">
                {currentOrder.restaurant.name} • ${currentOrder.total.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium capitalize ${
                currentOrder.status === 'delivered' ? 'text-success' :
                currentOrder.status === 'cancelled' ? 'text-destructive' :
                'text-primary'
              }`}>
                {currentOrder.status}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-soft p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl relative ${
                message.isUser
                  ? 'bg-primary text-primary-foreground ml-8'
                  : 'bg-card border border-border mr-8'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.message}</p>
              <div className={`flex items-center justify-end space-x-1 mt-2 ${
                message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                <span className="text-xs">{formatTime(message.timestamp)}</span>
                {message.isUser && (
                  <div className="ml-1">
                    {message.isRead ? (
                      <CheckCheck size={12} className="text-success" />
                    ) : message.isDelivered ? (
                      <CheckCheck size={12} />
                    ) : (
                      <Check size={12} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {partnerTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-card border border-border mr-8">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-muted-foreground">Mike is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 border-t border-border bg-card">
        <div className="flex space-x-2 overflow-x-auto scrollbar-soft pb-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => {
                setNewMessage(reply);
                setTimeout(() => handleSendMessage(), 100);
              }}
              className="flex-shrink-0 px-3 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:bg-accent/80 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
            <Paperclip size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors">
            <Camera size={20} />
          </button>
          <div className="flex-1 flex items-center space-x-2 bg-input-background rounded-lg px-3 py-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}