import React, { useState } from 'react';
import { Search, Bell, MapPin, ChevronDown, Home, Plus, X } from 'lucide-react';
import { User, Location } from '../App';

interface NavigationBarProps {
  user: User | null;
  currentLocation: Location;
  currentScreen: string;
  onLocationChange: (location: Location) => void;
  onSearchFocus: () => void;
  onNotificationClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const predefinedLocations: Location[] = [
  {
    id: 'home',
    name: 'Home',
    address: '123 Broadway Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  {
    id: 'work',
    name: 'Work',
    address: '456 Wall Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10005'
  },
  {
    id: 'gym',
    name: 'Gym',
    address: '789 5th Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10022'
  },
  {
    id: 'university',
    name: 'University',
    address: '101 Washington Square E',
    city: 'New York',
    state: 'NY',
    zipCode: '10003'
  }
];

export function NavigationBar({ 
  user, 
  currentLocation, 
  currentScreen, 
  onLocationChange, 
  onSearchFocus, 
  onNotificationClick,
  searchQuery,
  onSearchChange
}: NavigationBarProps) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleLocationSelect = (location: Location) => {
    onLocationChange(location);
    setShowLocationDropdown(false);
  };

  const handleAddNewAddress = () => {
    setShowLocationDropdown(false);
    setShowAddAddressModal(true);
  };

  const handleSaveNewAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      alert('Please fill in all fields');
      return;
    }

    const newLocation: Location = {
      id: Date.now().toString(),
      name: newAddress.name,
      address: newAddress.address,
      city: newAddress.city,
      state: newAddress.state,
      zipCode: newAddress.zipCode
    };

    // Add to predefined locations (in real app, this would be saved to user profile)
    predefinedLocations.push(newLocation);
    
    // Set as current location
    onLocationChange(newLocation);
    
    // Reset form and close modal
    setNewAddress({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    });
    setShowAddAddressModal(false);
  };

  const getSearchPlaceholder = () => {
    switch (currentScreen) {
      case 'home':
        return 'Search for food, restaurants...';
      case 'search':
        return 'What are you craving?';
      case 'restaurants':
        return 'Search restaurants...';
      default:
        return 'Search FoodFlow...';
    }
  };

  return (
    <div className="bg-card border-b border-border shadow-soft sticky top-0 z-40">
      <div className="p-4 rounded-tl-[12px] rounded-tr-[44px] rounded-bl-[0px] rounded-br-[0px]">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Location Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center space-x-2 text-left hover:bg-accent rounded-lg px-3 py-2 transition-colors"
            >
              <Home size={16} className="text-primary" />
              <div>
                <div className="font-medium text-sm">{currentLocation.name}</div>
                <div className="text-xs text-muted-foreground truncate max-w-32">
                  {currentLocation.address}
                </div>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>

            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-elevated z-50">
                <div className="p-3">
                  <h3 className="font-semibold mb-3">Select Location</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-soft">
                    {predefinedLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`w-full p-3 rounded-lg border text-left transition-all hover:bg-accent ${
                          currentLocation.id === location.id 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} className="text-primary" />
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {location.address}, {location.city}, {location.state} {location.zipCode}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Add New Address Button */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <button
                      onClick={handleAddNewAddress}
                      className="w-full p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus size={16} />
                      <span className="font-medium">Add New Address</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile and Notifications */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onNotificationClick}
              className="p-2 hover:bg-accent rounded-lg transition-colors relative"
            >
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
            </button>
            
            {/* Profile Photo */}
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden bg-primary/10 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary font-medium text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            placeholder={getSearchPlaceholder()}
            className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
        </div>
      </div>

      {/* Add New Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevated w-full max-w-md animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Add New Address</h3>
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address Name</label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Home, Work, Gym"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main Street"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="New York"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="NY"
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="10001"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewAddress}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}