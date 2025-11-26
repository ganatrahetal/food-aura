import React, { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Home, Briefcase, Heart, Edit2, Trash2, Star } from 'lucide-react';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault: boolean;
}

interface ManageAddressesProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function ManageAddresses({ onBack, onShowNotification }: ManageAddressesProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      label: 'Home',
      address: '123 Broadway Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      landmark: 'Near Central Park',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      label: 'Office',
      address: '456 5th Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10018',
      landmark: 'Empire State Building nearby',
      isDefault: false
    },
    {
      id: '3',
      type: 'other',
      label: 'Gym',
      address: '789 Madison Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10065',
      isDefault: false
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    onShowNotification('Default address updated', 'success');
  };

  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = addresses.find(addr => addr.id === addressId);
    if (addressToDelete?.isDefault && addresses.length > 1) {
      // Set another address as default if deleting the current default
      setAddresses(prev => {
        const filtered = prev.filter(addr => addr.id !== addressId);
        if (filtered.length > 0) {
          filtered[0].isDefault = true;
        }
        return filtered;
      });
    } else {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    }
    onShowNotification('Address deleted successfully', 'success');
  };

  const getAddressIcon = (type: Address['type']) => {
    switch (type) {
      case 'home': return <Home size={20} className="text-primary" />;
      case 'work': return <Briefcase size={20} className="text-blue-500" />;
      default: return <MapPin size={20} className="text-purple-500" />;
    }
  };

  if (showAddForm) {
    return (
      <AddNewAddress
        onBack={() => setShowAddForm(false)}
        onSave={(newAddress) => {
          const id = Date.now().toString();
          setAddresses(prev => [...prev, { ...newAddress, id }]);
          setShowAddForm(false);
          onShowNotification('Address added successfully', 'success');
        }}
      />
    );
  }

  if (editingAddress) {
    return (
      <AddNewAddress
        onBack={() => setEditingAddress(null)}
        initialData={editingAddress}
        onSave={(updatedAddress) => {
          setAddresses(prev => prev.map(addr => 
            addr.id === editingAddress.id ? { ...updatedAddress, id: editingAddress.id } : addr
          ));
          setEditingAddress(null);
          onShowNotification('Address updated successfully', 'success');
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Manage Addresses</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Add New Address Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/10 transition-colors"
        >
          <Plus size={20} className="text-primary" />
          <span className="text-primary font-medium">Add New Address</span>
        </button>

        {/* Address List */}
        <div className="space-y-3">
          {addresses.map((address, index) => (
            <div
              key={address.id}
              className="bg-card border border-border rounded-xl p-4 shadow-soft hover:shadow-card transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getAddressIcon(address.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{address.label}</h3>
                      {address.isDefault && (
                        <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                          <Star size={12} className="fill-current" />
                          <span>Default</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {address.address}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    {address.landmark && (
                      <p className="text-xs text-muted-foreground">
                        📍 {address.landmark}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingAddress(address)}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {!address.isDefault && (
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-primary text-sm font-medium hover:text-primary/80"
                  >
                    Set as Default
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AddNewAddressProps {
  onBack: () => void;
  onSave: (address: Omit<Address, 'id'>) => void;
  initialData?: Address;
}

function AddNewAddress({ onBack, onSave, initialData }: AddNewAddressProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'home' as Address['type'],
    label: initialData?.label || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    landmark: initialData?.landmark || '',
    isDefault: initialData?.isDefault || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const addressTypes = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'work', label: 'Work', icon: Briefcase },
    { value: 'other', label: 'Other', icon: Heart }
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">
            {initialData ? 'Edit Address' : 'Add New Address'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium mb-3">Address Type</label>
            <div className="grid grid-cols-3 gap-3">
              {addressTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value as Address['type'] }))}
                    className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                      formData.type === type.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-sm font-medium mb-2">Address Label *</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Home, Office, Gym"
              className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-2">Street Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Main Street"
              className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* City, State, Zip */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="New York"
                className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="NY"
                className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ZIP Code *</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
              placeholder="10001"
              className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-sm font-medium mb-2">Landmark (Optional)</label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
              placeholder="Near Central Park"
              className="w-full px-3 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="setDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="text-primary focus:ring-primary"
            />
            <label htmlFor="setDefault" className="text-sm">
              Set as default address
            </label>
          </div>
        </form>
      </div>

      {/* Save Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {initialData ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </div>
  );
}