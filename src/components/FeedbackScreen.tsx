import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Package, Truck, User, MessageCircle, CheckCircle, Camera, Send, Heart, ThumbsUp, Award } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeedbackScreenProps {
  onBack: () => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  feedbackType: 'order' | 'restaurant' | 'delivery';
  orderData?: {
    id: string;
    restaurant: string;
    items: string[];
    total: number;
    deliveryTime: string;
    deliveryPerson: string;
    image: string;
  };
}

interface RatingCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  rating: number;
  color: string;
}

const quickTags = {
  order: [
    { id: 'fresh', label: 'Fresh & Hot', icon: '🔥' },
    { id: 'tasty', label: 'Delicious', icon: '😋' },
    { id: 'quantity', label: 'Good Quantity', icon: '📦' },
    { id: 'packaging', label: 'Well Packaged', icon: '📦' },
    { id: 'fast', label: 'Fast Delivery', icon: '⚡' },
    { id: 'value', label: 'Great Value', icon: '💰' },
  ],
  restaurant: [
    { id: 'quality', label: 'Quality Food', icon: '⭐' },
    { id: 'variety', label: 'Good Variety', icon: '🍽️' },
    { id: 'hygiene', label: 'Hygienic', icon: '🧼' },
    { id: 'service', label: 'Good Service', icon: '🙋' },
    { id: 'ambiance', label: 'Nice Ambiance', icon: '🏪' },
    { id: 'price', label: 'Fair Pricing', icon: '💸' },
  ],
  delivery: [
    { id: 'punctual', label: 'On Time', icon: '⏰' },
    { id: 'polite', label: 'Polite', icon: '😊' },
    { id: 'professional', label: 'Professional', icon: '👔' },
    { id: 'careful', label: 'Handled Carefully', icon: '🤲' },
    { id: 'contactless', label: 'Contactless', icon: '🚪' },
    { id: 'uniform', label: 'Proper Uniform', icon: '👕' },
  ]
};

export function FeedbackScreen({ onBack, onShowNotification, feedbackType, orderData }: FeedbackScreenProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<RatingCategory[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize category ratings based on feedback type
  React.useEffect(() => {
    let categories: RatingCategory[] = [];
    
    if (feedbackType === 'order') {
      categories = [
        { id: 'food', title: 'Food Quality', icon: Star, rating: 0, color: 'text-yellow-500' },
        { id: 'packaging', title: 'Packaging', icon: Package, rating: 0, color: 'text-blue-500' },
        { id: 'delivery', title: 'Delivery Time', icon: Clock, rating: 0, color: 'text-green-500' },
        { id: 'value', title: 'Value for Money', icon: Award, rating: 0, color: 'text-purple-500' },
      ];
    } else if (feedbackType === 'restaurant') {
      categories = [
        { id: 'food', title: 'Food Quality', icon: Star, rating: 0, color: 'text-yellow-500' },
        { id: 'service', title: 'Service', icon: User, rating: 0, color: 'text-blue-500' },
        { id: 'ambiance', title: 'Ambiance', icon: Heart, rating: 0, color: 'text-pink-500' },
        { id: 'value', title: 'Value for Money', icon: Award, rating: 0, color: 'text-green-500' },
      ];
    } else {
      categories = [
        { id: 'punctuality', title: 'Punctuality', icon: Clock, rating: 0, color: 'text-green-500' },
        { id: 'behavior', title: 'Behavior', icon: User, rating: 0, color: 'text-blue-500' },
        { id: 'professionalism', title: 'Professionalism', icon: Award, rating: 0, color: 'text-purple-500' },
        { id: 'care', title: 'Food Handling', icon: Package, rating: 0, color: 'text-orange-500' },
      ];
    }
    
    setCategoryRatings(categories);
  }, [feedbackType]);

  const handleCategoryRating = (categoryId: string, rating: number) => {
    setCategoryRatings(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, rating } : cat
    ));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (overallRating === 0) {
      onShowNotification('Please provide an overall rating', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const feedbackData = {
      type: feedbackType,
      overallRating,
      categoryRatings,
      selectedTags,
      comment,
      images,
      orderId: orderData?.id
    };

    console.log('Feedback submitted:', feedbackData);
    
    setIsSubmitting(false);
    onShowNotification('Thank you for your feedback! 🙏', 'success');
    onBack();
  };

  const getTitle = () => {
    switch (feedbackType) {
      case 'order': return 'Rate Your Order';
      case 'restaurant': return 'Rate Restaurant';
      case 'delivery': return 'Rate Delivery Partner';
      default: return 'Rate & Review';
    }
  };

  const getSubtitle = () => {
    switch (feedbackType) {
      case 'order': return 'How was your food experience?';
      case 'restaurant': return `How was your experience at ${orderData?.restaurant}?`;
      case 'delivery': return `How was your delivery experience with ${orderData?.deliveryPerson}?`;
      default: return 'Share your experience';
    }
  };

  const currentTags = quickTags[feedbackType] || [];

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
          <div>
            <h1 className="text-xl font-semibold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">{getSubtitle()}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Order Information */}
        {orderData && (
          <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="flex items-center space-x-3">
              <ImageWithFallback
                src={orderData.image}
                alt={orderData.restaurant}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{orderData.restaurant}</h3>
                <p className="text-sm text-muted-foreground">
                  Order #{orderData.id}
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                  <Clock size={12} />
                  <span>Delivered in {orderData.deliveryTime}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">${orderData.total}</div>
                <div className="text-xs text-muted-foreground">
                  {orderData.items.length} items
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Rating */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-soft text-center">
          <h2 className="text-lg font-semibold mb-2">Overall Rating</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Tap a star to rate your experience
          </p>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setOverallRating(star)}
                className={`p-2 rounded-full transition-all ${
                  star <= overallRating 
                    ? 'text-yellow-500 hover:text-yellow-600 scale-110' 
                    : 'text-muted-foreground hover:text-yellow-400'
                }`}
              >
                <Star size={32} className={star <= overallRating ? 'fill-current' : ''} />
              </button>
            ))}
          </div>
          
          {overallRating > 0 && (
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-yellow-500 font-medium">
                {overallRating} star{overallRating > 1 ? 's' : ''}
              </span>
              <span className="text-muted-foreground">
                {overallRating === 5 ? 'Excellent!' : 
                 overallRating === 4 ? 'Great!' : 
                 overallRating === 3 ? 'Good' : 
                 overallRating === 2 ? 'Fair' : 'Poor'}
              </span>
            </div>
          )}
        </div>

        {/* Category Ratings */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <h3 className="font-semibold mb-4">Rate Different Aspects</h3>
          <div className="space-y-4">
            {categoryRatings.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className={category.color} />
                    <span className="text-sm font-medium">{category.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleCategoryRating(category.id, star)}
                        className={`p-1 rounded transition-colors ${
                          star <= category.rating 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-muted-foreground hover:text-yellow-400'
                        }`}
                      >
                        <Star size={16} className={star <= category.rating ? 'fill-current' : ''} />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tags */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <h3 className="font-semibold mb-4">Quick Tags</h3>
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag.id)
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Written Review */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <h3 className="font-semibold mb-4">Write a Review (Optional)</h3>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience in detail..."
              className="w-full h-32 p-3 bg-input-background border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {comment.length}/500
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
          <h3 className="font-semibold mb-4">Add Photos (Optional)</h3>
          <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors">
            <div className="text-center">
              <Camera size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Upload photos of your {feedbackType === 'order' ? 'food' : 'experience'}
              </p>
              <button className="text-primary text-sm font-medium hover:text-primary/80">
                Choose Photos
              </button>
            </div>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <ThumbsUp size={20} className="text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Helpful Tips</h4>
              <p className="text-blue-700 text-sm">
                Your feedback helps us improve our service and helps other customers make better choices. 
                Be specific and honest about your experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={overallRating === 0 || isSubmitting}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-soft"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}