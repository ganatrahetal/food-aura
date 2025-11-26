import React from 'react';
import { ArrowLeft, Heart, Shield, Users, Award, Globe, ChefHat, Star, Zap, Clock } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AboutFoodFlowScreenProps {
  onBack: () => void;
}

export function AboutFoodFlowScreen({ onBack }: AboutFoodFlowScreenProps) {
  const features = [
    {
      icon: Clock,
      title: 'Lightning Fast Delivery',
      description: 'Average delivery time of 30 minutes or less'
    },
    {
      icon: ChefHat,
      title: '2000+ Restaurants',
      description: 'Curated selection of top-rated local restaurants'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your data and payments are always protected'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Only the best restaurants make it to our platform'
    },
    {
      icon: Users,
      title: '1M+ Happy Customers',
      description: 'Join millions who trust FoodAura for their meals'
    },
    {
      icon: Globe,
      title: 'Nationwide Coverage',
      description: 'Available in 50+ cities across the United States'
    }
  ];

  const stats = [
    { number: '2M+', label: 'Orders Delivered' },
    { number: '2K+', label: 'Restaurant Partners' },
    { number: '50+', label: 'Cities Covered' },
    { number: '4.8★', label: 'Average Rating' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
    }
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
            <h1 className="text-xl font-semibold">About FoodAura</h1>
            <p className="text-sm text-muted-foreground">Learn more about our company</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-orange-500 to-red-500 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-4 -translate-x-4"></div>
          </div>
          
          <div className="relative z-10 p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">FoodAura</h2>
            <p className="text-white/90 text-lg mb-4">Delicious Food, Delivered Fast</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-sm">Version 1.0.0</p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="p-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <h3 className="text-xl font-semibold mb-4 text-center">Our Mission</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              At FoodAura, we believe that great food should be accessible to everyone. Our mission is to connect 
              food lovers with their favorite restaurants through a seamless, fast, and reliable delivery experience. 
              We're passionate about supporting local businesses while satisfying your cravings.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-4 text-center shadow-soft">
                <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="px-6 pb-6">
          <h3 className="text-xl font-semibold mb-4">Why Choose FoodAura?</h3>
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-card border border-border rounded-xl p-4 shadow-soft">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="px-6 pb-6">
          <h3 className="text-xl font-semibold mb-4">Meet Our Team</h3>
          <div className="space-y-4">
            {team.map((member, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-4 shadow-soft">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-900">Our Values</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Heart size={20} className="text-red-500" />
                <span className="text-blue-800">Customer satisfaction is our top priority</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-green-500" />
                <span className="text-blue-800">Supporting local restaurant communities</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap size={20} className="text-yellow-500" />
                <span className="text-blue-800">Innovation in food delivery technology</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield size={20} className="text-blue-500" />
                <span className="text-blue-800">Trust, safety, and reliability in every order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-6 pb-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  📧
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">hello@foodflow.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  📞
                </div>
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">+1 (800) FOODFLOW</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  🌐
                </div>
                <div>
                  <div className="font-medium">Website</div>
                  <div className="text-sm text-muted-foreground">www.foodflow.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="px-6 pb-8">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-blue-100 text-blue-600 p-4 rounded-xl hover:bg-blue-200 transition-colors">
                <div className="text-2xl mb-2">📘</div>
                <div className="text-sm font-medium">Facebook</div>
              </button>
              <button className="bg-pink-100 text-pink-600 p-4 rounded-xl hover:bg-pink-200 transition-colors">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-sm font-medium">Instagram</div>
              </button>
              <button className="bg-blue-50 text-blue-500 p-4 rounded-xl hover:bg-blue-100 transition-colors">
                <div className="text-2xl mb-2">🐦</div>
                <div className="text-sm font-medium">Twitter</div>
              </button>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="px-6 pb-8">
          <div className="bg-muted rounded-xl p-4">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>© 2024 FoodAura Inc. All rights reserved.</p>
              <div className="flex justify-center space-x-4">
                <button className="hover:text-primary transition-colors">Terms of Service</button>
                <span>•</span>
                <button className="hover:text-primary transition-colors">Privacy Policy</button>
                <span>•</span>
                <button className="hover:text-primary transition-colors">Cookies</button>
              </div>
              <p className="text-xs">Made with ❤️ for food lovers everywhere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}