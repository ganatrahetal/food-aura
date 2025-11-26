import React, { useEffect, useState } from 'react';
import { Utensils, Star, Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 500);
    const timer2 = setTimeout(() => setAnimationStep(2), 1200);
    const timer3 = setTimeout(() => setAnimationStep(3), 1800);
    const timer4 = setTimeout(() => onComplete(), 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating food icons */}
        <div className="absolute top-20 left-10 text-white/10 animate-pulse-soft">
          <Utensils size={40} />
        </div>
        <div className="absolute top-40 right-16 text-white/10 animate-pulse-soft" style={{ animationDelay: '1s' }}>
          <Star size={32} />
        </div>
        <div className="absolute bottom-60 left-20 text-white/10 animate-pulse-soft" style={{ animationDelay: '0.5s' }}>
          <Heart size={36} />
        </div>
        <div className="absolute bottom-40 right-12 text-white/10 animate-pulse-soft" style={{ animationDelay: '1.5s' }}>
          <Utensils size={28} />
        </div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo and icon container */}
        <div className={`mb-8 transition-all duration-1000 ${
          animationStep >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}>
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 bg-white/20 rounded-full blur-md animate-pulse-soft"></div>
            
            {/* Main logo container */}
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <div className={`transition-all duration-700 ${
                animationStep >= 2 ? 'rotate-0' : 'rotate-180'
              }`}>
                <Utensils size={48} className="text-orange-500" />
              </div>
            </div>
            
            {/* Floating accent elements around logo */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce-in" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-400 rounded-full animate-bounce-in" style={{ animationDelay: '2.2s' }}></div>
          </div>
        </div>

        {/* App name and branding */}
        <div className={`text-center transition-all duration-1000 ${
          animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Main app name */}
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Food<span className="text-yellow-300">Aura</span>
          </h1>
          
          {/* Tagline */}
          <p className="text-white/90 text-xl mb-2 font-medium">
            Delicious Food, Delivered Fast
          </p>
          
          {/* Subtitle */}
          <p className="text-white/75 text-base px-4">
            Your favorite restaurants at your fingertips
          </p>
        </div>

        {/* Loading indicator */}
        <div className={`mt-16 transition-all duration-500 ${
          animationStep >= 3 ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex justify-center text-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce-in"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce-in" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce-in" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-white/80 text-sm">Loading your culinary adventure...</p>
        </div>
      </div>

      {/* Bottom branding */}
      <div className={`absolute bottom-8 left-0 right-0 text-center transition-all duration-1000 ${
        animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
          <span>Powered by</span>
          <span className="font-semibold text-white/80">FoodYah Technologies</span>
        </div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
}