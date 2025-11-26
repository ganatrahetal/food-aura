import React, { useState } from 'react';
import { ArrowLeft, Heart, Search, Star, Clock, MapPin, Filter, SlidersHorizontal } from 'lucide-react';
import { Restaurant } from '../../App';

interface FavoritesScreenProps {
  onBack: () => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
  favoriteRestaurants: string[];
  onToggleFavorite: (restaurantId: string, restaurantName: string) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

// Sample restaurants to show when user has no favorites
const sampleRestaurants: Restaurant[] = [
  {
    id: 'sample_1',
    name: 'Mario\'s Italian Kitchen',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Italian',
    rating: 4.6,
    reviewCount: 1247,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minOrder: 15,
    isOpen: true,
    distance: 0.8,
    offers: ['20% off on orders above $25'],
    tags: ['Popular', 'Authentic']
  },
  {
    id: 'sample_2',
    name: 'Tokyo Sushi House',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Japanese',
    rating: 4.8,
    reviewCount: 892,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    minOrder: 20,
    isOpen: true,
    distance: 1.2,
    offers: ['Free delivery on orders above $30'],
    tags: ['Premium', 'Fresh']
  },
  {
    id: 'sample_3',
    name: 'Burger Haven',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'American',
    rating: 4.4,
    reviewCount: 2156,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minOrder: 12,
    isOpen: true,
    distance: 0.5,
    offers: ['Buy 2 Get 1 Free on selected items'],
    tags: ['Fast Food', 'Bestseller']
  },
  {
    id: 'sample_4',
    name: 'Spice Garden Indian',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Indian',
    rating: 4.7,
    reviewCount: 743,
    deliveryTime: '35-45 min',
    deliveryFee: 2.49,
    minOrder: 18,
    isOpen: true,
    distance: 1.5,
    offers: ['15% off on first order'],
    tags: ['Spicy', 'Vegetarian Options']
  },
  {
    id: 'sample_5',
    name: 'Mediterranean Delights',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Mediterranean',
    rating: 4.5,
    reviewCount: 567,
    deliveryTime: '20-30 min',
    deliveryFee: 3.49,
    minOrder: 16,
    isOpen: true,
    distance: 0.9,
    offers: ['Free appetizer with orders above $35'],
    tags: ['Healthy', 'Fresh']
  },
  {
    id: 'sample_6',
    name: 'Dragon Palace Chinese',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Chinese',
    rating: 4.3,
    reviewCount: 1089,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minOrder: 14,
    isOpen: true,
    distance: 1.1,
    offers: ['10% off on orders above $20'],
    tags: ['Authentic', 'Family Pack']
  }
];

const allRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Joe\'s Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Italian',
    rating: 4.5,
    reviewCount: 234,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    minOrder: 15,
    isOpen: true,
    distance: 0.5,
    offers: ['Free delivery on orders above $25'],
    tags: ['Popular']
  },
  {
    id: '2',
    name: 'Shake Shack',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'American',
    rating: 4.6,
    reviewCount: 567,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minOrder: 12,
    isOpen: true,
    distance: 0.3,
    offers: ['20% off on orders above $30'],
    tags: ['Fast Food']
  },
  {
    id: '3',
    name: 'Nobu',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    cuisine: 'Japanese',
    rating: 4.8,
    reviewCount: 892,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    minOrder: 25,
    isOpen: true,
    distance: 1.2,
    offers: ['Premium dining experience'],
    tags: ['Premium']
  },
  ...sampleRestaurants
];

export function FavoritesScreen({ 
  onBack, 
  onRestaurantClick, 
  favoriteRestaurants, 
  onToggleFavorite, 
  onShowNotification 
}: FavoritesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'delivery_time' | 'distance'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Get favorite restaurants or show sample restaurants
  const favoriteRestaurantList = favoriteRestaurants.length > 0 
    ? allRestaurants.filter(restaurant => favoriteRestaurants.includes(restaurant.id))
    : sampleRestaurants;

  // Filter restaurants based on search query
  const filteredRestaurants = favoriteRestaurantList.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'delivery_time':
        return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
      case 'distance':
        return a.distance - b.distance;
      default:
        return 0;
    }
  });

  const handleRestaurantClick = (restaurant: Restaurant) => {
    onRestaurantClick(restaurant);
  };

  const handleToggleFavorite = (restaurant: Restaurant) => {
    onToggleFavorite(restaurant.id, restaurant.name);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto scrollbar-soft">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary via-orange-500 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 animate-float"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-4 -translate-x-4 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-white fill-current" />
              </div>
              <h1 className="text-2xl font-bold mb-2">My Favorites</h1>
              <p className="text-white/90">
                {favoriteRestaurants.length > 0 
                  ? `${favoriteRestaurants.length} favorite restaurants`
                  : 'Discover restaurants you might love'
                }
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorites..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sort By and Filter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'delivery_time' | 'distance')}
                className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="rating">Rating</option>
                <option value="delivery_time">Delivery Time</option>
                <option value="distance">Distance</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg text-sm hover:bg-accent transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </button>
          </div>

          {/* No Favorites Message */}
          {favoriteRestaurants.length === 0 && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="text-center">
                <Heart size={40} className="text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No favorites yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start exploring and add restaurants to your favorites by tapping the heart icon
                </p>
                <p className="text-sm text-primary font-medium">
                  Here are some popular restaurants you might enjoy:
                </p>
              </div>
            </div>
          )}

          {/* Restaurant List */}
          <div className="space-y-4">
            {sortedRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-card rounded-xl overflow-hidden shadow-card border border-border hover:shadow-float transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="relative h-48">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => handleToggleFavorite(restaurant)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      size={20}
                      className={`transition-colors ${
                        favoriteRestaurants.includes(restaurant.id)
                          ? 'text-red-500 fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-lg mb-1">{restaurant.name}</h3>
                    <p className="text-white/90 text-sm">{restaurant.cuisine}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="font-medium">{restaurant.rating}</span>
                        <span className="text-sm text-muted-foreground">({restaurant.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{restaurant.distance} km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-muted-foreground">
                      <span>Min order: ${restaurant.minOrder}</span>
                      <span className="mx-2">•</span>
                      <span>Delivery: ${restaurant.deliveryFee}</span>
                    </div>
                    <div className={`text-sm font-medium ${
                      restaurant.isOpen ? 'text-success' : 'text-destructive'
                    }`}>
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </div>
                  </div>
                  
                  {restaurant.offers && restaurant.offers.length > 0 && (
                    <div className="mb-3">
                      <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                        {restaurant.offers[0]}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {restaurant.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleRestaurantClick(restaurant)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {sortedRestaurants.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <Search size={40} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No restaurants found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords or browse all restaurants
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}