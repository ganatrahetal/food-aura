import React, { useState } from 'react';
import { Star, Clock, MapPin, Truck, ChevronRight, Gift, Zap, Heart, Home, Sparkles, Sun, Moon } from 'lucide-react';
import { Restaurant, Location } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeScreenProps {
  onRestaurantClick: (restaurant: Restaurant) => void;
  currentLocation: Location;
  onShowPromoModal: () => void;
  onTrackOrder: () => void;
  favoriteRestaurants: string[];
  onToggleFavorite: (restaurantId: string, restaurantName: string) => void;
}

const mockRestaurants: Restaurant[] = [
  // Pizza Restaurants
  {
    id: '1',
    name: 'Joe\'s Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Pizza, Italian-American',
    rating: 4.5,
    reviewCount: 2850,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    minOrder: 15,
    isOpen: true,
    distance: 0.8,
    offers: ['50% off up to $15'],
    tags: ['pizza', 'italian']
  },
  {
    id: '11',
    name: 'Tony\'s Pizzeria',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Pizza, Italian',
    rating: 4.3,
    reviewCount: 1890,
    deliveryTime: '25-35 min',
    deliveryFee: 3.49,
    minOrder: 20,
    isOpen: true,
    distance: 1.2,
    offers: ['Buy 2 get 1 free'],
    tags: ['pizza', 'italian']
  },
  {
    id: '12',
    name: 'Brooklyn Pizza Co.',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'New York Style Pizza',
    rating: 4.6,
    reviewCount: 3100,
    deliveryTime: '15-25 min',
    deliveryFee: 2.49,
    minOrder: 12,
    isOpen: true,
    distance: 0.9,
    offers: ['Free delivery over $25'],
    tags: ['pizza', 'italian']
  },

  // Burger Restaurants
  {
    id: '2',
    name: 'Shake Shack',
    image: 'https://images.unsplash.com/photo-1552566068-dffbfed5bc52?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Burgers, American',
    rating: 4.3,
    reviewCount: 3200,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minOrder: 12,
    isOpen: true,
    distance: 1.3,
    offers: ['Buy 1 Get 1 Free'],
    tags: ['burgers', 'american']
  },
  {
    id: '13',
    name: 'Five Guys',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Burgers, Fries',
    rating: 4.4,
    reviewCount: 2750,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    minOrder: 15,
    isOpen: true,
    distance: 1.5,
    offers: ['Free fries with burger'],
    tags: ['burgers', 'american']
  },
  {
    id: '14',
    name: 'The Burger Joint',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Gourmet Burgers',
    rating: 4.7,
    reviewCount: 1950,
    deliveryTime: '25-35 min',
    deliveryFee: 3.99,
    minOrder: 18,
    isOpen: true,
    distance: 2.1,
    offers: ['20% off premium burgers'],
    tags: ['burgers', 'american']
  },

  // Japanese/Sushi Restaurants
  {
    id: '3',
    name: 'Nobu',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Japanese, Sushi',
    rating: 4.8,
    reviewCount: 1650,
    deliveryTime: '45-60 min',
    deliveryFee: 4.99,
    minOrder: 35,
    isOpen: true,
    distance: 3.7,
    offers: ['20% off premium sushi'],
    tags: ['japanese', 'sushi']
  },
  {
    id: '15',
    name: 'Sushi Zen',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Sushi, Japanese',
    rating: 4.5,
    reviewCount: 1420,
    deliveryTime: '30-45 min',
    deliveryFee: 3.49,
    minOrder: 25,
    isOpen: true,
    distance: 2.3,
    offers: ['Free miso soup'],
    tags: ['japanese', 'sushi']
  },
  {
    id: '16',
    name: 'Tokyo Express',
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Japanese, Ramen',
    rating: 4.2,
    reviewCount: 2100,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    minOrder: 15,
    isOpen: true,
    distance: 1.8,
    offers: ['Half price ramen'],
    tags: ['japanese', 'sushi']
  },

  // Mexican Restaurants
  {
    id: '5',
    name: 'Chipotle',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Mexican, Burritos',
    rating: 4.2,
    reviewCount: 4100,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minOrder: 8,
    isOpen: true,
    distance: 1.4,
    offers: ['Free guac with any bowl'],
    tags: ['mexican', 'burritos']
  },
  {
    id: '17',
    name: 'Taco Bell',
    image: 'https://images.unsplash.com/photo-1565299585323-38174c24468d?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Mexican, Tacos',
    rating: 4.0,
    reviewCount: 3850,
    deliveryTime: '10-20 min',
    deliveryFee: 1.49,
    minOrder: 8,
    isOpen: true,
    distance: 1.1,
    offers: ['$5 cravings box'],
    tags: ['mexican', 'tacos']
  },
  {
    id: '18',
    name: 'Qdoba',
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Mexican, Bowls',
    rating: 4.3,
    reviewCount: 2650,
    deliveryTime: '20-30 min',
    deliveryFee: 2.49,
    minOrder: 10,
    isOpen: true,
    distance: 1.6,
    offers: ['Free chips & queso'],
    tags: ['mexican', 'bowls']
  },

  // Healthy/Salads Restaurants
  {
    id: '4',
    name: 'Sweetgreen',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Healthy, Salads',
    rating: 4.4,
    reviewCount: 2200,
    deliveryTime: '20-30 min',
    deliveryFee: 2.49,
    minOrder: 10,
    isOpen: true,
    distance: 1.1,
    offers: ['Free protein add-on'],
    tags: ['healthy', 'salads']
  },
  {
    id: '19',
    name: 'Just Salad',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Salads, Healthy',
    rating: 4.1,
    reviewCount: 1890,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minOrder: 12,
    isOpen: true,
    distance: 0.9,
    offers: ['Buy 2 salads get 1 free'],
    tags: ['healthy', 'salads']
  },
  {
    id: '20',
    name: 'Chop\'t',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Salads, Bowls',
    rating: 4.3,
    reviewCount: 1650,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    minOrder: 15,
    isOpen: true,
    distance: 1.3,
    offers: ['Free dressing upgrade'],
    tags: ['healthy', 'salads']
  },

  // Chinese Restaurants
  {
    id: '21',
    name: 'Panda Express',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Chinese, Fast Food',
    rating: 4.0,
    reviewCount: 3500,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minOrder: 10,
    isOpen: true,
    distance: 1.2,
    offers: ['Free spring roll'],
    tags: ['chinese', 'asian']
  },
  {
    id: '22',
    name: 'Golden Dragon',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Chinese, Authentic',
    rating: 4.5,
    reviewCount: 1980,
    deliveryTime: '30-40 min',
    deliveryFee: 3.49,
    minOrder: 20,
    isOpen: true,
    distance: 2.2,
    offers: ['20% off orders over $30'],
    tags: ['chinese', 'asian']
  },
  {
    id: '23',
    name: 'Szechuan House',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Szechuan, Spicy',
    rating: 4.6,
    reviewCount: 1560,
    deliveryTime: '35-45 min',
    deliveryFee: 4.99,
    minOrder: 25,
    isOpen: true,
    distance: 2.8,
    offers: ['Free hot tea'],
    tags: ['chinese', 'spicy']
  },

  // Coffee Restaurants
  {
    id: '24',
    name: 'Starbucks',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Coffee, Pastries',
    rating: 4.2,
    reviewCount: 5200,
    deliveryTime: '10-20 min',
    deliveryFee: 1.49,
    minOrder: 5,
    isOpen: true,
    distance: 0.6,
    offers: ['Free size upgrade'],
    tags: ['coffee', 'breakfast']
  },
  {
    id: '25',
    name: 'Blue Bottle Coffee',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Specialty Coffee',
    rating: 4.5,
    reviewCount: 1420,
    deliveryTime: '15-25 min',
    deliveryFee: 2.99,
    minOrder: 8,
    isOpen: true,
    distance: 1.4,
    offers: ['Free pastry with coffee'],
    tags: ['coffee', 'artisan']
  },
  {
    id: '26',
    name: 'Local Coffee Co.',
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247cd?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Coffee, Breakfast',
    rating: 4.4,
    reviewCount: 890,
    deliveryTime: '10-20 min',
    deliveryFee: 1.99,
    minOrder: 6,
    isOpen: true,
    distance: 0.8,
    offers: ['Buy 2 get 1 free'],
    tags: ['coffee', 'breakfast']
  },

  // Dessert Restaurants
  {
    id: '27',
    name: 'Magnolia Bakery',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Desserts, Bakery',
    rating: 4.7,
    reviewCount: 2100,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    minOrder: 15,
    isOpen: true,
    distance: 1.5,
    offers: ['Free cupcake with order'],
    tags: ['desserts', 'bakery']
  },
  {
    id: '28',
    name: 'Ben & Jerry\'s',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Ice Cream, Desserts',
    rating: 4.6,
    reviewCount: 3200,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minOrder: 10,
    isOpen: true,
    distance: 1.2,
    offers: ['Buy 2 pints get 1 free'],
    tags: ['desserts', 'ice cream']
  },
  {
    id: '29',
    name: 'Serendipity 3',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Desserts, Sundaes',
    rating: 4.5,
    reviewCount: 1750,
    deliveryTime: '25-35 min',
    deliveryFee: 3.99,
    minOrder: 20,
    isOpen: true,
    distance: 2.0,
    offers: ['Free toppings upgrade'],
    tags: ['desserts', 'sundaes']
  }
];

const specialOffers = [
  {
    id: 'pizza-50',
    title: '50% Off Pizza',
    description: 'Get 50% off on all pizza orders',
    discount: '50% OFF',
    category: 'pizza',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'burger-bogo',
    title: 'BOGO Burgers',
    description: 'Buy 1 Get 1 Free on all burgers',
    discount: 'BOGO',
    category: 'burgers',
    color: 'from-yellow-500 to-red-500'
  },
  {
    id: 'healthy-free',
    title: 'Free Delivery',
    description: 'Free delivery on healthy food orders',
    discount: 'FREE',
    category: 'healthy',
    color: 'from-green-500 to-teal-500'
  }
];

// Mock location data for restaurants
const restaurantLocations = {
  '1': 'Manhattan, NY',
  '2': 'Times Square, NY',
  '3': 'Upper East Side, NY',
  '4': 'SoHo, NY',
  '5': 'Brooklyn, NY',
  '11': 'Little Italy, NY',
  '12': 'Brooklyn Heights, NY',
  '13': 'Midtown, NY',
  '14': 'Greenwich Village, NY',
  '15': 'Chelsea, NY',
  '16': 'East Village, NY',
  '17': 'Financial District, NY',
  '18': 'Hell\'s Kitchen, NY',
  '19': 'Tribeca, NY',
  '20': 'Union Square, NY',
  '21': 'Chinatown, NY',
  '22': 'Lower East Side, NY',
  '23': 'Flushing, NY',
  '24': 'Columbus Circle, NY',
  '25': 'Williamsburg, NY',
  '26': 'Park Slope, NY',
  '27': 'Upper West Side, NY',
  '28': 'West Village, NY',
  '29': 'Flatiron, NY'
};

export function HomeScreen({ onRestaurantClick, currentLocation, onShowPromoModal, onTrackOrder, favoriteRestaurants, onToggleFavorite }: HomeScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showOrderStatusBanner, setShowOrderStatusBanner] = useState(true);

  const handleOfferClick = (offer: any) => {
    // Filter restaurants based on offer category
    const filteredRestaurants = mockRestaurants.filter(restaurant => {
      if (offer.category === 'all') return true;
      return restaurant.tags?.includes(offer.category);
    });

    // Show the first restaurant that matches the category
    if (filteredRestaurants.length > 0) {
      onRestaurantClick(filteredRestaurants[0]);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, restaurant: Restaurant) => {
    e.stopPropagation(); // Prevent restaurant card click
    onToggleFavorite(restaurant.id, restaurant.name);
  };

  const foodCategories = [
    { name: 'Pizza', icon: '🍕', filter: 'pizza' },
    { name: 'Burgers', icon: '🍔', filter: 'burgers' },
    { name: 'Sushi', icon: '🍣', filter: 'japanese' },
    { name: 'Mexican', icon: '🌮', filter: 'mexican' },
    { name: 'Chinese', icon: '🥡', filter: 'chinese' },
    { name: 'Healthy', icon: '🥗', filter: 'healthy' },
    { name: 'Desserts', icon: '🍰', filter: 'desserts' },
    { name: 'Coffee', icon: '☕', filter: 'coffee' }
  ];

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    if (selectedFilter === 'all') return true;
    return restaurant.tags?.includes(selectedFilter);
  });

  // Get current time for dynamic greeting
  const currentHour = new Date().getHours();
  const getGreetingTime = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getTimeIcon = () => {
    if (currentHour < 12) return Sun;
    if (currentHour < 18) return Sun;
    return Moon;
  };

  const TimeIcon = getTimeIcon();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        {/* Enhanced Hero Section */}
        <div className="bg-gradient-to-br from-primary via-orange-500 to-red-500 relative overflow-hidden -mx-4">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-8 translate-x-8 animate-float"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-4 -translate-x-4 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-white/20 rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-white/20 rounded-full animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
          </div>
          
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
          
          <div className="relative z-10 px-6 pb-6">
            <div className="text-center text-white">
              {/* Dynamic greeting with time-based icon */}
              <div className="flex items-center justify-center space-x-2 mb-3 pt-4">
                <TimeIcon size={20} className="text-yellow-300 animate-pulse-soft" />
                <h1 className="text-xl font-bold pt-4">
                  {getGreetingTime()}! 👋
                </h1>
              </div>
              
              {/* Main question with enhanced styling */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2 text-white leading-tight">
                  What would you like to
                </h2>
                <h2 className="text-2xl font-bold mb-3 text-yellow-300 leading-tight">
                  eat today?
                </h2>
                
                {/* Food emojis with animation */}
                <div className="flex justify-center space-x-2 mb-4">
                  {['🍕', '🍔', '🍜', '🥗', '🍰'].map((emoji, index) => (
                    <span 
                      key={index} 
                      className="text-xl animate-bounce-in"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Compact delivery location */}
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-elevated mx-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Home size={16} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-white/80 font-medium">Delivering to</span>
                      <Sparkles size={10} className="text-yellow-300 animate-pulse-soft" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-base font-bold text-white">{currentLocation.name}</span>
                      <ChevronRight size={12} className="text-white/60" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-white/80">
                    <Zap size={12} className="text-yellow-300" />
                    <span>20-30 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Banner */}
        {showOrderStatusBanner && (
          <div className="bg-gradient-to-r from-green-500 to-teal-500 mx-4 mt-4 p-4 rounded-2xl text-white animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Your order is on the way!</h3>
                  <p className="text-sm text-white/90">Track your order from Joe's Pizza</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onTrackOrder}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  Track
                </button>
                <button
                  onClick={() => setShowOrderStatusBanner(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Special Offers */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Special Offers</h2>
            <button
              onClick={onShowPromoModal}
              className="text-primary hover:underline text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto scrollbar-soft pb-2">
            {specialOffers.map((offer) => (
              <button
                key={offer.id}
                onClick={() => handleOfferClick(offer)}
                className="flex-shrink-0 w-80 bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all active:scale-95"
              >
                <div className={`bg-gradient-to-r ${offer.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                        {offer.discount}
                      </span>
                      <Gift size={20} />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
                    <p className="text-sm text-white/90">{offer.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* What's on your mind? */}
        <div className="px-4 pb-6">
          <h2 className="text-xl font-bold mb-4">What's on your mind?</h2>
          <div className="grid grid-cols-4 gap-4">
            {foodCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedFilter(category.filter)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                  selectedFilter === category.filter
                    ? 'bg-primary text-primary-foreground shadow-card scale-105'
                    : 'bg-card hover:bg-accent shadow-soft'
                }`}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Reset */}
        {selectedFilter !== 'all' && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setSelectedFilter('all')}
              className="text-primary hover:underline text-sm"
            >
              ← Back to all restaurants
            </button>
          </div>
        )}

        {/* Restaurants */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {selectedFilter === 'all' ? 'Recommended for you' : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Restaurants`}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredRestaurants.length} restaurants
            </span>
          </div>
          
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => onRestaurantClick(restaurant)}
                className="w-full bg-card rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-card active:scale-[0.98] transition-all duration-200"
              >
                <div className="p-4">
                  <div className="flex space-x-4">
                    {/* Restaurant Image */}
                    <div className="relative flex-shrink-0">
                      <ImageWithFallback
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      {!restaurant.isOpen && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Closed</span>
                        </div>
                      )}
                      {restaurant.offers && restaurant.offers.length > 0 && (
                        <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
                          OFFER
                        </div>
                      )}
                    </div>
                    
                    {/* Restaurant Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-left truncate">{restaurant.name}</h3>
                          <p className="text-muted-foreground text-sm text-left">{restaurant.cuisine}</p>
                        </div>
                        <div 
                          onClick={(e) => handleFavoriteClick(e, restaurant)}
                          className="ml-2 p-1 hover:bg-accent rounded-full transition-colors cursor-pointer"
                        >
                          <Heart 
                            size={16} 
                            className={`transition-all duration-200 ${
                              favoriteRestaurants.includes(restaurant.id)
                                ? 'text-red-500 fill-red-500' 
                                : 'text-muted-foreground hover:text-red-500'
                            }`}
                          />
                        </div>
                      </div>
                      
                      {/* Rating and Reviews */}
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-full">
                          <Star size={12} className="fill-current" />
                          <span className="text-xs font-medium">{restaurant.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({restaurant.reviewCount.toLocaleString()})
                        </span>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center space-x-1 mb-2">
                        <MapPin size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {restaurantLocations[restaurant.id]}
                        </span>
                      </div>
                      
                      {/* Delivery Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Clock size={12} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{restaurant.deliveryTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Truck size={12} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {restaurant.distance} km
                            </span>
                          </div>
                        </div>
                        
                        {restaurant.deliveryFee === 0 ? (
                          <span className="text-xs text-success font-medium">Free delivery</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            ${restaurant.deliveryFee.toFixed(2)} delivery
                          </span>
                        )}
                      </div>
                      
                      {/* Offers */}
                      {restaurant.offers && restaurant.offers.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="flex items-center space-x-1">
                            <Gift size={12} className="text-primary" />
                            <span className="text-xs text-primary font-medium">
                              {restaurant.offers[0]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}