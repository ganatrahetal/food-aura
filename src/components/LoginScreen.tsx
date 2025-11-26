import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Phone, Mail, Lock, ChevronDown, RefreshCw, CheckCircle, ChefHat, User, Store, Shield, Truck, X, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
  onBack?: () => void;
}

type UserType = 'end_user' | 'restaurant' | 'admin' | 'delivery';
type LoginMethod = 'userType' | 'choice' | 'phone' | 'email' | 'forgot';
type Step = 'login' | 'otp' | 'newPassword';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+98', country: 'Iran', flag: '🇮🇷' },
  { code: '+964', country: 'Iraq', flag: '🇮🇶' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
  { code: '+972', country: 'Israel', flag: '🇮🇱' },
  { code: '+30', country: 'Greece', flag: '🇬🇷' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
  { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
  { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
  { code: '+385', country: 'Croatia', flag: '🇭🇷' },
  { code: '+36', country: 'Hungary', flag: '🇭🇺' },
  { code: '+40', country: 'Romania', flag: '🇷🇴' },
  { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
];

// Google Logo Component
const GoogleLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export function LoginScreen({ onLoginSuccess, onBack }: LoginScreenProps) {
  const [userType, setUserType] = useState<UserType>('end_user');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('userType');
  const [step, setStep] = useState<Step>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonUserType, setComingSoonUserType] = useState<string>('');

  const userTypes = [
    {
      id: 'end_user',
      label: 'End User',
      description: 'Order food and enjoy delivery',
      icon: User,
      color: 'text-blue-400'
    },
    {
      id: 'restaurant',
      label: 'Restaurant Owner',
      description: 'Manage your restaurant and menu',
      icon: Store,
      color: 'text-orange-400'
    },
    {
      id: 'admin',
      label: 'Admin',
      description: 'Manage app information and settings',
      icon: Shield,
      color: 'text-purple-400'
    },
    {
      id: 'delivery',
      label: 'Delivery Partner',
      description: 'Deliver orders to customers',
      icon: Truck,
      color: 'text-green-400'
    }
  ];

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const startResendTimer = () => {
    setCanResendOtp(false);
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResendOtp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('otp');
    setOtpSent(true);
    setIsLoading(false);
    startResendTimer();
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtp(['', '', '', '', '', '']);
    setIsLoading(false);
    startResendTimer();
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (loginMethod === 'forgot') {
      setStep('newPassword');
    } else {
      // Check user type before login
      if (userType === 'end_user' || userType === 'restaurant') {
        // Login success for end user and restaurant owner - proceed to app
        onLoginSuccess({
          name: 'John Doe',
          email: email || `${phoneNumber}@example.com`,
          phone: phoneNumber || '+1 (555) 123-4567',
          avatar: null,
          userType: userType
        });
      } else {
        // For admin and delivery user types, show soft UI modal
        const selectedUserType = userTypes.find(ut => ut.id === userType);
        setComingSoonUserType(selectedUserType?.label || 'Application');
        setShowComingSoonModal(true);
      }
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      // Show soft UI modal for password mismatch
      setComingSoonUserType('Error');
      setShowComingSoonModal(true);
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (userType === 'end_user' || userType === 'restaurant') {
      onLoginSuccess({
        name: 'John Doe',
        email: email,
        phone: phoneNumber,
        avatar: null,
        userType: userType
      });
    } else {
      // For admin and delivery user types, show soft UI modal
      const selectedUserType = userTypes.find(ut => ut.id === userType);
      setComingSoonUserType(selectedUserType?.label || 'Application');
      setShowComingSoonModal(true);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (userType === 'end_user' || userType === 'restaurant') {
      onLoginSuccess({
        name: userType === 'restaurant' ? 'Restaurant Manager' : 'John Doe',
        email: userType === 'restaurant' ? 'manager@restaurant.com' : 'john.doe@gmail.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        userType: userType
      });
    } else {
      // For admin and delivery user types, show soft UI modal
      const selectedUserType = userTypes.find(ut => ut.id === userType);
      setComingSoonUserType(selectedUserType?.label || 'Application');
      setShowComingSoonModal(true);
    }
    setIsLoading(false);
  };

  const handleEmailLogin = async () => {
    if (userType === 'end_user' || userType === 'restaurant') {
      onLoginSuccess({
        name: userType === 'restaurant' ? 'Restaurant Manager' : 'John Doe',
        email: email,
        phone: '+1 (555) 123-4567',
        avatar: null,
        userType: userType
      });
    } else {
      // For admin and delivery user types, show soft UI modal
      const selectedUserType = userTypes.find(ut => ut.id === userType);
      setComingSoonUserType(selectedUserType?.label || 'Application');
      setShowComingSoonModal(true);
    }
  };

  const renderUserTypeSelection = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-3xl p-8 shadow-elevated">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
            <ChefHat size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Food<span className="text-yellow-300">Aura</span>
          </h1>
          <p className="text-white/80 text-lg mb-2">Delicious Food, Delivered Fast</p>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2 text-white">Select User Type</h3>
          <p className="text-white/80">Choose your account type to continue</p>
        </div>

        <div className="space-y-4 mb-8">
          {userTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <label key={type.id} className="block cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value={type.id}
                  checked={userType === type.id}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="sr-only"
                />
                <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  userType === type.id
                    ? 'border-white/50 bg-white/25 shadow-card'
                    : 'border-white/20 bg-white/10 hover:bg-white/15'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      userType === type.id ? 'bg-white/25' : 'bg-white/15'
                    }`}>
                      <IconComponent size={24} className={type.color} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-semibold text-lg">{type.label}</h4>
                      <p className="text-white/70 text-sm">{type.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      userType === type.id
                        ? 'border-white bg-white'
                        : 'border-white/40'
                    }`}>
                      {userType === type.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <button
          onClick={() => setLoginMethod('choice')}
          className="w-full py-4 bg-white/25 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/35 transition-all duration-200 border border-white/35 shadow-soft hover:shadow-card active:scale-98"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderChoiceScreen = () => (
    <div className="w-full max-w-md mx-auto">
      {/* Main Login Card */}
      <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-3xl p-8 shadow-elevated">
        {/* Logo in Main Card */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
            <ChefHat size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Food<span className="text-yellow-300">Aura</span>
          </h1>
          <p className="text-white/80 text-lg mb-2">Delicious Food, Delivered Fast</p>
          <p className="text-white/70 text-base">Welcome Back!</p>
        </div>

        {/* Show selected user type */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
            {React.createElement(userTypes.find(ut => ut.id === userType)?.icon || User, {
              size: 16,
              className: userTypes.find(ut => ut.id === userType)?.color || 'text-white'
            })}
            <span className="text-white/80 text-sm">
              {userTypes.find(ut => ut.id === userType)?.label}
            </span>
          </div>
          {userType !== 'end_user' && userType !== 'restaurant' && (
            <p className="text-yellow-300 text-sm mt-2">
              ⚠️ This application is coming soon
            </p>
          )}
          <p className="text-white/80 mt-4">Sign in to continue your culinary journey</p>
        </div>

        <div className="space-y-4">
          {/* Google Login with Original Logo */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50 text-white shadow-soft hover:shadow-card active:scale-98"
          >
            <GoogleLogo className="w-5 h-5" />
            <span className="font-medium">Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/25"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70">Or continue with</span>
            </div>
          </div>

          {/* Phone Login */}
          <button
            onClick={() => setLoginMethod('phone')}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white/25 backdrop-blur-sm text-white rounded-xl hover:bg-white/35 transition-all duration-200 border border-white/35 shadow-soft hover:shadow-card active:scale-98"
          >
            <Phone size={20} />
            <span className="font-medium">Continue with Phone</span>
          </button>

          {/* Email Login */}
          <button
            onClick={() => setLoginMethod('email')}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 shadow-soft hover:shadow-card active:scale-98"
          >
            <Mail size={20} />
            <span className="font-medium">Continue with Email</span>
          </button>

          <div className="text-center pt-4">
            <button
              onClick={() => setLoginMethod('forgot')}
              className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhoneLogin = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-3xl p-8 shadow-elevated">
        {/* Logo in Phone Login Card */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
            <ChefHat size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">
            Food<span className="text-yellow-300">Aura</span>
          </h2>
        </div>

        {step === 'login' && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2 text-white">Enter your phone number</h3>
              <p className="text-white/80">We'll send you a verification code</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-white">Phone Number</label>
                <div className="flex space-x-3">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center space-x-2 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all duration-200 min-w-[110px] shadow-soft"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm font-medium">{selectedCountry.code}</span>
                      <ChevronDown size={14} className={`transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-elevated z-[60] overflow-hidden">
                        <div className="p-4 border-b border-white/30">
                          <h3 className="text-sm font-semibold text-gray-800">Select Country</h3>
                        </div>
                        <div className="h-72 overflow-y-auto scrollbar-soft">
                          {countryCodes.map((country, index) => (
                            <button
                              key={`${country.code}-${country.country}-${index}`}
                              onClick={() => handleCountrySelect(country)}
                              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left ${
                                selectedCountry.code === country.code && selectedCountry.country === country.country
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'text-gray-700'
                              }`}
                            >
                              <span className="text-xl flex-shrink-0">{country.flag}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{country.country}</div>
                                <div className="text-xs text-gray-500">{country.code}</div>
                              </div>
                              {selectedCountry.code === country.code && selectedCountry.country === country.country && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Number Input */}
                  <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="123 456 7890"
                      className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 text-white placeholder-white/60 shadow-soft transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={!phoneNumber || isLoading}
                className="w-full py-4 bg-white/25 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/35 disabled:opacity-50 transition-all duration-200 border border-white/35 shadow-soft hover:shadow-card active:scale-98"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2 text-white">Enter verification code</h3>
              <p className="text-white/80 mb-4">
                We sent a 6-digit code to {selectedCountry.code} {phoneNumber}
              </p>
              {otpSent && (
                <div className="flex items-center justify-center space-x-2 text-green-400 text-sm bg-green-400/10 backdrop-blur-sm rounded-lg py-2 px-4 border border-green-400/30">
                  <CheckCircle size={16} />
                  <span>OTP sent successfully! (Demo: Use any 6 digits)</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 text-white shadow-soft transition-all duration-200"
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otp.some(digit => !digit) || isLoading}
                className="w-full py-4 bg-white/25 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/35 disabled:opacity-50 transition-all duration-200 border border-white/35 shadow-soft hover:shadow-card active:scale-98"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <div className="text-center space-y-3">
                <p className="text-white/60 text-sm">Didn't receive the code?</p>
                <button
                  onClick={handleResendOtp}
                  disabled={!canResendOtp || isLoading}
                  className="flex items-center justify-center space-x-2 text-white/80 hover:text-white text-sm disabled:opacity-50 mx-auto transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  <span>
                    {canResendOtp ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderEmailLogin = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-3xl p-8 shadow-elevated">
        {/* Logo in Email Login Card */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
            <ChefHat size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">
            Food<span className="text-yellow-300">Aura</span>
          </h2>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-bold mb-2 text-white">Sign in with email</h3>
          <p className="text-white/80">Enter your email and password</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 text-white placeholder-white/60 shadow-soft transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 text-white placeholder-white/60 shadow-soft transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleEmailLogin}
            disabled={!email || !password || isLoading}
            className="w-full py-4 bg-white/25 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/35 disabled:opacity-50 transition-all duration-200 border border-white/35 shadow-soft hover:shadow-card active:scale-98"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/15 backdrop-blur-lg border border-white/25 rounded-3xl p-8 shadow-elevated">
        {/* Logo in Forgot Password Card */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-soft">
            <ChefHat size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1 text-white">
            Food<span className="text-yellow-300">Aura</span>
          </h2>
        </div>

        {step === 'login' && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2 text-white">Reset your password</h3>
              <p className="text-white/80">Enter your email or phone to receive a reset code</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-white">Email or Phone</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com or +1 (555) 123-4567"
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 text-white placeholder-white/60 shadow-soft transition-all duration-200"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={!email || isLoading}
                className="w-full py-4 bg-white/25 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/35 disabled:opacity-50 transition-all duration-200 border border-white/35 shadow-soft hover:shadow-card active:scale-98"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Reset Code'
                )}
              </button>
            </div>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2 text-white">Enter reset code</h3>
              <p className="text-white/80 mb-4">
                We sent a 6-digit code to {email}
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-400 text-sm bg-green-400/10 backdrop-blur-sm rounded-lg py-2 px-4 border border-green-400/30">
                <CheckCircle size={16} />
                <span>Reset code sent! (Demo: Use any 6 digits)</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 text-white shadow-soft transition-all duration-200"
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otp.some(digit => !digit) || isLoading}
                className="w-full py-4 bg-white/25 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/35 disabled:opacity-50 transition-all duration-200 border border-white/35 shadow-soft hover:shadow-card active:scale-98"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Code'
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={!canResendOtp || isLoading}
                  className="flex items-center justify-center space-x-2 text-white/80 hover:text-white text-sm disabled:opacity-50 mx-auto transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  <span>
                    {canResendOtp ? 'Resend Code' : `Resend in ${resendTimer}s`}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'newPassword' && (
          <>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2 text-white">Create new password</h3>
              <p className="text-white/80">Choose a strong password for your account</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-white">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-12 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 text-white placeholder-white/60 shadow-soft transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-white">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-12 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/25 text-white placeholder-white/60 shadow-soft transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={!newPassword || !confirmPassword || isLoading}
                className="w-full py-4 bg-white/25 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/35 disabled:opacity-50 transition-all duration-200 border border-white/35 shadow-soft hover:shadow-card active:scale-98"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderComingSoonModal = () => {
    if (!showComingSoonModal) return null;

    const isPasswordError = comingSoonUserType === 'Error';

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowComingSoonModal(false)}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-sm mx-auto animate-scale-in">
          <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-elevated">
            {/* Close button */}
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-600" />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isPasswordError ? 'bg-red-100' : 'bg-orange-100'
              }`}>
                {isPasswordError ? (
                  <AlertCircle size={28} className="text-red-500" />
                ) : (
                  <Store size={28} className="text-orange-500" />
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isPasswordError ? 'Password Mismatch' : `${comingSoonUserType} Coming Soon!`}
              </h3>

              {/* Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {isPasswordError 
                  ? 'The passwords you entered do not match. Please try again.'
                  : `We're working hard to bring you the ${comingSoonUserType.toLowerCase()} application. Stay tuned for updates!`
                }
              </p>

              {/* OK Button */}
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-soft"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-orange-500 to-red-500 flex flex-col relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      {loginMethod !== 'userType' && (
        <div className="flex items-center p-4 relative z-10">
          <button
            onClick={() => {
              if (step === 'otp' || step === 'newPassword') {
                setStep('login');
                setOtp(['', '', '', '', '', '']);
              } else if (loginMethod !== 'choice') {
                setLoginMethod('choice');
                setStep('login');
              } else {
                setLoginMethod('userType');
              }
            }}
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 text-white shadow-soft"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full animate-fade-in">
          {loginMethod === 'userType' && renderUserTypeSelection()}
          {loginMethod === 'choice' && renderChoiceScreen()}
          {loginMethod === 'phone' && renderPhoneLogin()}
          {loginMethod === 'email' && renderEmailLogin()}
          {loginMethod === 'forgot' && renderForgotPassword()}
        </div>
      </div>

      {/* Coming Soon Modal */}
      {renderComingSoonModal()}

      {/* Footer */}
      <div className="relative z-10 p-6 text-center">
        <p className="text-white/60 text-sm">
          By continuing, you agree to our{' '}
          <button className="text-white/80 hover:text-white underline underline-offset-2 transition-colors">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-white/80 hover:text-white underline underline-offset-2 transition-colors">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}