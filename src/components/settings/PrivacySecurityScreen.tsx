import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Smartphone, Key, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface PrivacySecurityScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function PrivacySecurityScreen({ onBack, onShowNotification }: PrivacySecurityScreenProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [orderHistory, setOrderHistory] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    onShowNotification(
      `Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`,
      'success'
    );
  };

  const handleBiometricToggle = () => {
    setBiometricEnabled(!biometricEnabled);
    onShowNotification(
      `Biometric login ${!biometricEnabled ? 'enabled' : 'disabled'}`,
      'success'
    );
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      onShowNotification('Please fill in all password fields', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      onShowNotification('New passwords do not match', 'error');
      return;
    }
    
    if (newPassword.length < 8) {
      onShowNotification('Password must be at least 8 characters long', 'error');
      return;
    }
    
    // Simulate password change
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowNotification('Password updated successfully!', 'success');
  };

  const handleDataDownload = () => {
    onShowNotification('Your data export will be emailed to you within 24 hours', 'info');
  };

  const handleAccountDeactivation = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action can be reversed within 30 days.')) {
      onShowNotification('Account deactivation request submitted', 'info');
    }
  };

  const handleAccountDeletion = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      onShowNotification('Account deletion request submitted. You will receive an email with next steps.', 'info');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-soft sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Privacy & Security</h1>
            <p className="text-sm text-muted-foreground">Manage your account security</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Account Security */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Account Security</h3>
              <p className="text-sm text-muted-foreground">Protect your account with advanced security features</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center space-x-3">
                <Key size={20} className="text-primary" />
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">Add extra security to your account</div>
                </div>
              </div>
              <button
                onClick={handleTwoFactorToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone size={20} className="text-primary" />
                <div>
                  <div className="font-medium">Biometric Login</div>
                  <div className="text-sm text-muted-foreground">Use fingerprint or face recognition</div>
                </div>
              </div>
              <button
                onClick={handleBiometricToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  biometricEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
              <Lock size={20} className="text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Change Password</h3>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Confirm new password"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Privacy Settings</h3>
              <p className="text-sm text-muted-foreground">Control your data and privacy preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div>
                <div className="font-medium">Location Tracking</div>
                <div className="text-sm text-muted-foreground">Allow location access for delivery</div>
              </div>
              <button
                onClick={() => setLocationTracking(!locationTracking)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  locationTracking ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    locationTracking ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div>
                <div className="font-medium">Marketing Emails</div>
                <div className="text-sm text-muted-foreground">Receive promotional emails</div>
              </div>
              <button
                onClick={() => setMarketingEmails(!marketingEmails)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  marketingEmails ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    marketingEmails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div>
                <div className="font-medium">Order History Visibility</div>
                <div className="text-sm text-muted-foreground">Show order history in recommendations</div>
              </div>
              <button
                onClick={() => setOrderHistory(!orderHistory)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  orderHistory ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    orderHistory ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Info size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Data Management</h3>
              <p className="text-sm text-muted-foreground">Manage your personal data</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDataDownload}
              className="w-full p-3 bg-accent rounded-lg hover:bg-muted transition-colors text-left"
            >
              <div className="font-medium">Download My Data</div>
              <div className="text-sm text-muted-foreground">Get a copy of your account data</div>
            </button>

            <button className="w-full p-3 bg-accent rounded-lg hover:bg-muted transition-colors text-left">
              <div className="font-medium">Data Usage Policy</div>
              <div className="text-sm text-muted-foreground">Learn how we use your data</div>
            </button>

            <button className="w-full p-3 bg-accent rounded-lg hover:bg-muted transition-colors text-left">
              <div className="font-medium">Cookie Preferences</div>
              <div className="text-sm text-muted-foreground">Manage cookie settings</div>
            </button>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-card border border-destructive/20 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">Irreversible account actions</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAccountDeactivation}
              className="w-full p-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-left"
            >
              <div className="font-medium">Deactivate Account</div>
              <div className="text-sm opacity-80">Temporarily disable your account (reversible within 30 days)</div>
            </button>

            <button
              onClick={handleAccountDeletion}
              className="w-full p-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-left"
            >
              <div className="font-medium">Delete Account</div>
              <div className="text-sm opacity-80">Permanently delete your account and all data (irreversible)</div>
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle size={20} className="text-blue-600" />
            <h3 className="font-semibold text-blue-900">Security Tips</h3>
          </div>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Use a strong, unique password for your account</p>
            <p>• Enable two-factor authentication for extra security</p>
            <p>• Keep your app updated to the latest version</p>
            <p>• Don't share your login credentials with anyone</p>
            <p>• Log out from shared or public devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}