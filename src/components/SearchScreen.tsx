import React, { useState, useEffect } from 'react';
import { Search, Mic, Star, Clock, MapPin, Truck, Gift, Heart, X } from 'lucide-react';
import { Restaurant } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SearchScreenProps {
  onRestaurantClick: (restaurant: Restaurant) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
  favoriteRestaurants: string[];
  onToggleFavorite: (restaurantId: string, restaurantName: string) => void;
}

const allRestaurants: Restaurant[] = [
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
  }
];

const restaurantLocations = {
  '1': 'Manhattan, NY',
  '2': 'Times Square, NY',
  '3': 'Upper East Side, NY',
  '4': 'SoHo, NY',
  '5': 'Brooklyn, NY'
};

const popularCategories = [
  { name: 'Pizza', icon: '🍕', searchTerm: 'pizza' },
  { name: 'Burgers', icon: '🍔', searchTerm: 'burger' },
  { name: 'Sushi', icon: '🍣', searchTerm: 'sushi' },
  { name: 'Mexican', icon: '🌮', searchTerm: 'mexican' },
  { name: 'Chinese', icon: '🥡', searchTerm: 'chinese' },
  { name: 'Healthy', icon: '🥗', searchTerm: 'healthy' }
];

const recentSearches = [
  'Joe\'s Pizza',
  'Sushi near me',
  'Healthy food',
  'Mexican restaurant'
];

export function SearchScreen({ 
  onRestaurantClick, 
  searchQuery, 
  onSearchChange, 
  onBack,
  favoriteRestaurants,
  onToggleFavorite
}: SearchScreenProps) {
  const [isListening, setIsListening] = useState(false);

  // Filter restaurants based on search query
  const filteredRestaurants = allRestaurants.filter(restaurant => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query) ||
      restaurant.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Voice search is not supported in this browser');
    }
  };

  const handleCategoryClick = (searchTerm: string) => {
    onSearchChange(searchTerm);
  };

  const handleRecentSearchClick = (search: string) => {
    onSearchChange(search);
  };

  const handleFavoriteClick = (e: React.MouseEvent, restaurant: Restaurant) => {
    e.stopPropagation();
    onToggleFavorite(restaurant.id, restaurant.name);
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    // Scroll to top when opening restaurant
    onRestaurantClick(restaurant);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const getPlaceholder = () => {
    return 'Search for restaurants or cuisines...';
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="p-4 space-y-6">
          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded-full transition-colors"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={handleVoiceSearch}
                disabled={isListening}
                className={`p-3 rounded-xl border transition-colors ${
                  isListening 
                    ? 'bg-primary text-primary-foreground border-primary animate-pulse' 
                    : 'bg-card border-border hover:bg-accent'
                }`}
              >
                <Mic size={20} />
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchQuery.trim() && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Search Results</h3>
                <span className="text-sm text-muted-foreground">
                  {filteredRestaurants.length} restaurants found
                </span>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No restaurants found</h3>
                  <p className="text-muted-foreground text-sm">
                    Try searching for different cuisines or restaurant names
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRestaurants.map((restaurant) => (
                    <button
                      key={restaurant.id}
                      onClick={() => handleRestaurantClick(restaurant)}
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
                              <button 
                                onClick={(e) => handleFavoriteClick(e, restaurant)}
                                className="ml-2 p-1 hover:bg-accent rounded-full transition-colors"
                              >
                                <Heart 
                                  size={16} 
                                  className={`transition-all duration-200 ${
                                    favoriteRestaurants.includes(restaurant.id)
                                      ? 'text-red-500 fill-red-500' 
                                      : 'text-muted-foreground hover:text-red-500'
                                  }`}
                                />
                              </button>
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
              )}
            </div>
          )}

          {/* Popular Categories - Only show when no search query */}
          {!searchQuery.trim() && (
            <div className="space-y-4">
              <h3 className="font-semibold">Popular Categories</h3>
              <div className="grid grid-cols-3 gap-4">
                {popularCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.searchTerm)}
                    className="flex flex-col items-center p-4 bg-card border border-border rounded-xl hover:bg-accent transition-colors"
                  >
                    <span className="text-2xl mb-2">{category.icon}</span>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches - Only show when no search query */}
          {!searchQuery.trim() && (
            <div className="space-y-4">
              <h3 className="font-semibold">Recent Searches</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center space-x-3 p-3 bg-card border border-border rounded-xl hover:bg-accent transition-colors text-left"
                  >
                    <Search size={16} className="text-muted-foreground" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}