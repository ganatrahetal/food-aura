import React from 'react';
import { ArrowLeft, ChefHat, Star, Users, MapPin, Award, Heart, Shield, Clock, Zap } from 'lucide-react';

interface AboutFoodYahScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function AboutFoodYahScreen({ onBack, onShowNotification }: AboutFoodYahScreenProps) {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Passionate about connecting people with great food',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b96a8c75?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Building the future of food delivery technology',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Operations',
      bio: 'Ensuring smooth operations and happy customers',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
    }
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
    { icon: MapPin, value: '25+', label: 'Cities Served' },
    { icon: Award, value: '1000+', label: 'Restaurant Partners' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make is centered around our customers\' happiness and satisfaction.'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'We work only with the best restaurants and maintain the highest food safety standards.'
    },
    {
      icon: Clock,
      title: 'Fast & Reliable',
      description: 'Quick delivery without compromising on quality. Your time is valuable to us.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly improving our technology to provide the best food delivery experience.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 shadow-soft z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">About FoodAura</h1>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* App Info */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">
            Food<span className="text-primary">Aura</span>
          </h2>
          <p className="text-muted-foreground">
            Delicious Food, Delivered Fast
          </p>
          <div className="bg-accent/50 px-4 py-2 rounded-full inline-block">
            <span className="text-primary font-medium">Version 2.1.0</span>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-card rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Our Mission</h3>
          <p className="text-muted-foreground leading-relaxed">
            At FoodAura, we believe that great food should be accessible to everyone. Our mission is to connect food lovers with their favorite restaurants while providing a seamless, fast, and reliable delivery experience.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-4 text-center">
              <stat.icon size={24} className="text-primary mx-auto mb-2" />
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Values */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Our Values</h3>
          <div className="grid gap-4">
            {values.map((value, index) => (
              <div key={index} className="bg-card rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <value.icon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Meet Our Team</h3>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-card rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-accent">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="text-sm text-muted-foreground mt-1">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-card rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Company Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Founded</span>
              <span>2020</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Headquarters</span>
              <span>San Francisco, CA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employees</span>
              <span>500+</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact</span>
              <span>hello@foodyah.com</span>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="bg-card rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Our Story</h3>
          <p className="text-muted-foreground leading-relaxed">
            FoodAura started as a simple idea: what if ordering food could be as easy as a few taps on your phone? Founded in 2020 by a group of food enthusiasts and tech experts, we've grown from a small startup to a trusted platform serving millions of customers across the country.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We're committed to supporting local restaurants, creating jobs for delivery partners, and bringing communities together through the universal language of great food.
          </p>
        </div>

        {/* Legal */}
        <div className="bg-card rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Legal</h3>
          <div className="space-y-2 text-sm">
            <button className="text-primary hover:underline">
              Terms of Service
            </button>
            <br />
            <button className="text-primary hover:underline">
              Privacy Policy
            </button>
            <br />
            <button className="text-primary hover:underline">
              Cookie Policy
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground py-4">
          © 2024 FoodAura Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}