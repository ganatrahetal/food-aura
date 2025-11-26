import React, { useState, useEffect } from 'react';
import { ChefHat, ArrowRight } from 'lucide-react';

interface BrandIntroScreenProps {
  onComplete: () => void;
}

export function BrandIntroScreen({ onComplete }: BrandIntroScreenProps) {
  const [showLogo, setShowLogo] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLogo(true), 500);
    const timer2 = setTimeout(() => setShowName(true), 1200);
    const timer3 = setTimeout(() => setShowTagline(true), 1800);
    const timer4 = setTimeout(() => setShowButton(true), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleGetStarted = () => {
    onComplete();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary via-orange-500 to-red-500 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 left-16 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center px-8">
        {/* Animated Logo */}
        <div className={`mb-8 transition-all duration-1000 ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl animate-pulse-soft">
            <ChefHat size={64} className="text-white drop-shadow-lg" />
          </div>
        </div>

        {/* App Name */}
        <div className={`mb-4 transition-all duration-1000 delay-300 ${showName ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl font-bold mb-2 drop-shadow-2xl">
            Food<span className="text-yellow-300">Aura</span>
          </h1>
        </div>

        {/* Tagline */}
        <div className={`mb-12 transition-all duration-1000 delay-500 ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xl text-white/90 drop-shadow-lg">
            Delicious Food, Delivered Fast
          </p>
          <p className="text-lg text-white/80 mt-2 drop-shadow-lg">
            🍕 🍔 🍜 🥗 🍰
          </p>
        </div>

        {/* Get Started Button */}
        <div className={`transition-all duration-1000 delay-700 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={handleGetStarted}
            className="bg-white/20 backdrop-blur-sm text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 flex items-center space-x-3 mx-auto"
          >
            <span>Get Started</span>
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Version Info */}
        <div className={`mt-16 transition-all duration-1000 delay-1000 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/60 text-sm">
            Version 1.0.0 • Made with ❤️ for food lovers
          </p>
        </div>
      </div>

      {/* Floating Food Emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-8 text-4xl animate-float" style={{ animationDelay: '0s' }}>🍕</div>
        <div className="absolute top-1/3 right-12 text-3xl animate-float" style={{ animationDelay: '1s' }}>🍔</div>
        <div className="absolute bottom-1/3 left-16 text-3xl animate-float" style={{ animationDelay: '2s' }}>🍜</div>
        <div className="absolute bottom-1/4 right-8 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🥗</div>
        <div className="absolute top-1/2 right-1/4 text-2xl animate-float" style={{ animationDelay: '1.5s' }}>🍰</div>
      </div>
    </div>
  );
}