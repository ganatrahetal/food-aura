import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, User as UserIcon, Mail, Phone, Calendar, Save, X } from 'lucide-react';
import { User } from '../../App';

interface EditProfileProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: User) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function EditProfile({ user, onBack, onSave, onShowNotification }: EditProfileProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onShowNotification('Please select a valid image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onShowNotification('Image size should be less than 5MB', 'error');
      return;
    }

    setIsUploading(true);

    // Convert file to base64 URL for preview and storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData(prev => ({
          ...prev,
          avatar: result
        }));
        onShowNotification('Profile photo updated successfully!', 'success');
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      onShowNotification('Failed to upload image. Please try again.', 'error');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      avatar: ''
    }));
    onShowNotification('Profile photo removed', 'info');
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      onShowNotification('Name is required', 'error');
      return;
    }

    if (!formData.email.trim()) {
      onShowNotification('Email is required', 'error');
      return;
    }

    if (!formData.phone.trim()) {
      onShowNotification('Phone number is required', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      onShowNotification('Please enter a valid email address', 'error');
      return;
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      onShowNotification('Please enter a valid phone number', 'error');
      return;
    }

    // Create updated user object
    const updatedUser: User = {
      ...user,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      avatar: formData.avatar
    };

    onSave(updatedUser);
    onBack();
  };

  const hasChanges = () => {
    return (
      formData.name !== user.name ||
      formData.email !== user.email ||
      formData.phone !== user.phone ||
      formData.avatar !== (user.avatar || '')
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Edit Profile</h1>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </div>
          </div>
          {hasChanges() && (
            <button
              onClick={handleSave}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-soft">
        {/* Profile Photo Section */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Photo Display */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-border overflow-hidden bg-muted flex items-center justify-center">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setFormData(prev => ({ ...prev, avatar: '' }));
                      onShowNotification('Failed to load image', 'error');
                    }}
                  />
                ) : (
                  <UserIcon size={48} className="text-muted-foreground" />
                )}
              </div>
              
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-soft hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Camera size={20} />
                )}
              </button>
              
              {/* Remove Button */}
              {formData.avatar && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-soft hover:bg-destructive/90 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Upload Instructions */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Click the camera icon to upload a new photo
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <UserIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Join Date (Read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2">Member Since</label>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={new Date(user.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Security Note */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">Account Security</h3>
          <p className="text-blue-700 text-sm mb-3">
            Want to update your password or enable two-factor authentication?
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Go to Security Settings
          </button>
        </div>

        {/* Save Button (Mobile) */}
        {hasChanges() && (
          <div className="sticky bottom-4 pt-4">
            <button
              onClick={handleSave}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 shadow-soft"
            >
              <Save size={20} />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}