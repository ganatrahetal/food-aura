import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, Minus, Heart, Share2, Clock, MapPin, Phone, Info, Filter, Search, ChevronRight, Award, TrendingUp, Leaf, RotateCcw, ShoppingBag, Car } from 'lucide-react';
import { Restaurant, MenuItem, CartItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RestaurantScreenProps {
  restaurant: Restaurant;
  onAddToCart: (restaurant: Restaurant, menuItem: MenuItem, customizations?: string[]) => void;
  onBack: () => void;
  cartItems: CartItem[];
}

const mockMenuItems: MenuItem[] = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella cheese, basil leaves, olive oil drizzle',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=225&fit=crop',
    category: 'Pizza',
    isVeg: true,
    isPopular: true,
    rating: 4.5,
    preparationTime: '15-20 min',
    calories: 280,
    spiceLevel: 'mild'
  },
  {
    id: 'item2',
    name: 'Pepperoni Supreme',
    description: 'Premium pepperoni, mozzarella cheese, tomato sauce, oregano',
    price: 15.99,
    originalPrice: 18.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=225&fit=crop',
    category: 'Pizza',
    isVeg: false,
    isPopular: true,
    rating: 4.7,
    preparationTime: '18-22 min',
    calories: 320,
    spiceLevel: 'medium'
  },
  {
    id: 'item3',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, caesar dressing',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=225&fit=crop',
    category: 'Salads',
    isVeg: true,
    rating: 4.3,
    preparationTime: '10-12 min',
    calories: 180,
    spiceLevel: 'mild'
  },
  {
    id: 'item4',
    name: 'Buffalo Wings',
    description: 'Spicy buffalo wings served with ranch dressing and celery sticks',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&h=225&fit=crop',
    category: 'Appetizers',
    isVeg: false,
    isNew: true,
    rating: 4.4,
    preparationTime: '12-15 min',
    calories: 240,
    spiceLevel: 'spicy'
  },
  {
    id: 'item5',
    name: 'Garlic Bread',
    description: 'Toasted artisan bread with garlic butter, herbs, and parmesan',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1619985002783-7453b85b88be?w=300&h=225&fit=crop',
    category: 'Sides',
    isVeg: true,
    rating: 4.2,
    preparationTime: '8-10 min',
    calories: 150,
    spiceLevel: 'mild'
  },
  {
    id: 'item6',
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with vanilla ice cream and chocolate sauce',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=225&fit=crop',
    category: 'Desserts',
    isVeg: true,
    rating: 4.6,
    preparationTime: '5-8 min',
    calories: 380,
    spiceLevel: 'mild'
  }
];

const reviews = [
  {
    id: '1',
    user: 'Sarah M.',
    rating: 5,
    comment: 'Amazing pizza! Fresh ingredients and perfect crust. Highly recommend!',
    date: '2 days ago',
    helpful: 12
  },
  {
    id: '2',
    user: 'John D.',
    rating: 4,
    comment: 'Great food and fast delivery. The garlic bread was exceptional.',
    date: '1 week ago',
    helpful: 8
  },
  {
    id: '3',
    user: 'Emily R.',
    rating: 5,
    comment: 'Best pizza in town! The Margherita is my favorite.',
    date: '2 weeks ago',
    helpful: 15
  }
];

export function RestaurantScreen({ restaurant, onAddToCart, onBack, cartItems }: RestaurantScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const categories = ['All', ...Array.from(new Set(mockMenuItems.map(item => item.category)))];
  
  const filteredItems = mockMenuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVegFilter = vegFilter === 'all' || 
                            (vegFilter === 'veg' && item.isVeg) ||
                            (vegFilter === 'non-veg' && !item.isVeg);
    return matchesCategory && matchesSearch && matchesVegFilter;
  });

  const getItemQuantityInCart = (itemId: string) => {
    return cartItems.find(item => item.id === itemId)?.quantity || 0;
  };

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    onAddToCart(restaurant, menuItem);
  };

  const handleReorder = () => {
    // Add reorder functionality
    console.log('Reordering from', restaurant.name);
  };

  const handleRate = () => {
    // Add rating functionality
    console.log('Rating', restaurant.name);
  };

  const handleBrowseRestaurants = () => {
    // Navigate back to browse more restaurants
    onBack();
  };

  const getSpiceLevelColor = (level: string) => {
    switch (level) {
      case 'mild': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'spicy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSpiceLevelIcon = (level: string) => {
    switch (level) {
      case 'mild': return '🟢';
      case 'medium': return '🟡';
      case 'spicy': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="relative">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex space-x-2">
            <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <Heart size={20} />
            </button>
            <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
        
        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
              <p className="text-white/90 mb-2">{restaurant.cuisine}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-white/80">({restaurant.reviewCount})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Car size={16} />
                  <span>{restaurant.distance} mi</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              restaurant.isOpen 
                ? 'bg-success/20 text-success border border-success/30' 
                : 'bg-destructive/20 text-destructive border border-destructive/30'
            }`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm">
              <Info size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">Min ${restaurant.minOrder}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Car size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">Delivery ${restaurant.deliveryFee}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Phone size={16} className="text-muted-foreground" />
              <span className="text-primary">Contact</span>
            </div>
          </div>
          <button 
            onClick={() => setShowReviews(!showReviews)}
            className="flex items-center space-x-1 text-primary text-sm font-medium"
          >
            <Award size={16} />
            <span>Reviews</span>
            <ChevronRight size={16} className={`transition-transform ${showReviews ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-3">
          <button
            onClick={handleReorder}
            className="flex-1 flex items-center justify-center space-x-2 bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-accent transition-colors"
          >
            <RotateCcw size={16} />
            <span className="text-sm font-medium">Reorder</span>
          </button>
          <button
            onClick={handleRate}
            className="flex-1 flex items-center justify-center space-x-2 bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-accent transition-colors"
          >
            <Star size={16} />
            <span className="text-sm font-medium">Rate</span>
          </button>
          <button
            onClick={handleBrowseRestaurants}
            className="flex-1 flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag size={16} />
            <span className="text-sm font-medium">Browse</span>
          </button>
        </div>

        {/* Offers */}
        {restaurant.offers && restaurant.offers.length > 0 && (
          <div className="space-y-2 mb-3">
            {restaurant.offers.map((offer, index) => (
              <div key={index} className="flex items-center space-x-2 bg-accent rounded-lg p-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-xs">%</span>
                </div>
                <span className="text-sm font-medium text-accent-foreground">{offer}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Section */}
        {showReviews && (
          <div className="border-t border-border pt-4 space-y-3 animate-slide-up">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {review.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{review.user}</div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-sm">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <button className="flex items-center space-x-1 hover:text-primary">
                    <span>👍</span>
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex space-x-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="p-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
            <Filter size={16} className="text-accent-foreground" />
          </button>
        </div>

        {/* Veg/Non-Veg Toggle */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm font-medium">Filter:</span>
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              onClick={() => setVegFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                vegFilter === 'all' ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 ${
                vegFilter === 'veg' ? 'bg-green-500 text-white' : 'text-secondary-foreground'
              }`}
            >
              <div className="w-3 h-3 border-2 border-green-500 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              </div>
              <span>Veg</span>
            </button>
            <button
              onClick={() => setVegFilter('non-veg')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 ${
                vegFilter === 'non-veg' ? 'bg-red-500 text-white' : 'text-secondary-foreground'
              }`}
            >
              <div className="w-3 h-3 border-2 border-red-500 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              </div>
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter options
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setVegFilter('all');
                  setSelectedCategory('All');
                }}
                className="text-primary font-medium hover:text-primary/80"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-card border border-border rounded-xl p-4 shadow-soft hover:shadow-card transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${
                          item.isVeg ? 'border-2 border-green-500' : 'border-2 border-red-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            item.isVeg ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <h4 className="font-semibold">{item.name}</h4>
                      </div>
                      <button
                        onClick={() => toggleLike(item.id)}
                        className={`p-1 rounded-full transition-colors ${
                          likedItems.has(item.id) 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-muted-foreground hover:text-red-500'
                        }`}
                      >
                        <Heart size={16} className={likedItems.has(item.id) ? 'fill-current' : ''} />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center space-x-2 mb-2">
                      {item.isPopular && (
                        <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          <TrendingUp size={12} />
                          <span>Popular</span>
                        </div>
                      )}
                      {item.isNew && (
                        <div className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
                          New
                        </div>
                      )}
                      {item.isVeg && (
                        <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                          <Leaf size={12} />
                          <span>Veg</span>
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                    
                    {/* Item Details */}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                      {item.rating && (
                        <div className="flex items-center space-x-1">
                          <Star size={12} className="text-yellow-500 fill-current" />
                          <span>{item.rating}</span>
                        </div>
                      )}
                      {item.preparationTime && (
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{item.preparationTime}</span>
                        </div>
                      )}
                      {item.calories && (
                        <div>
                          <span>{item.calories} cal</span>
                        </div>
                      )}
                      {item.spiceLevel && (
                        <div className={`flex items-center space-x-1 ${getSpiceLevelColor(item.spiceLevel)}`}>
                          <span>{getSpiceLevelIcon(item.spiceLevel)}</span>
                          <span className="capitalize">{item.spiceLevel}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-semibold">${item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <div className="relative">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg shadow-soft"
                      />
                      {item.originalPrice && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Save ${(item.originalPrice - item.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                    
                    {getItemQuantityInCart(item.id) > 0 ? (
                      <div className="flex items-center bg-primary rounded-lg">
                        <button
                          onClick={() => {/* Handle decrease */}}
                          className="p-2 text-primary-foreground hover:bg-primary/80 rounded-l-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-2 text-primary-foreground font-medium min-w-[40px] text-center">
                          {getItemQuantityInCart(item.id)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-2 text-primary-foreground hover:bg-primary/80 rounded-r-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 hover:bg-primary/90 transition-colors shadow-soft"
                      >
                        <Plus size={14} />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}