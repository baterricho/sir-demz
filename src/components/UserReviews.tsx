import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Phone, Star, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Page } from '../App';
import { toast } from 'sonner@2.0.3';

interface UserReviewsProps {
  onNavigate: (page: Page) => void;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  notHelpful: number;
}

export function UserReviews({ onNavigate }: UserReviewsProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Sarah M.',
      rating: 5,
      comment: 'Excellent platform! I reported a broken streetlight and it was fixed within 3 days. The tracking system kept me updated throughout the process. Highly recommend for community issues.',
      date: '2025-01-10',
      helpful: 12,
      notHelpful: 1
    },
    {
      id: '2',
      userName: 'Mike D.',
      rating: 4,
      comment: 'Very user-friendly interface. The SOS feature gives me peace of mind when walking alone at night. Response times are good, though could be faster for non-emergency issues.',
      date: '2025-01-08',
      helpful: 8,
      notHelpful: 0
    },
    {
      id: '3',
      userName: 'Jennifer L.',
      rating: 5,
      comment: 'This app has transformed how our community handles issues. The confidential reporting option is great for sensitive matters. Staff is professional and responsive.',
      date: '2025-01-05',
      helpful: 15,
      notHelpful: 2
    },
    {
      id: '4',
      userName: 'Robert K.',
      rating: 4,
      comment: 'Good concept and execution. I appreciate being able to track my reports. The emergency contacts feature is very helpful. Would like to see more category options.',
      date: '2025-01-03',
      helpful: 6,
      notHelpful: 1
    },
    {
      id: '5',
      userName: 'Lisa T.',
      rating: 5,
      comment: 'Outstanding service! Used it to report a water leak and received immediate attention. The timeline feature helped me understand the resolution process. Thank you!',
      date: '2024-12-28',
      helpful: 10,
      notHelpful: 0
    }
  ]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newReview: Review = {
      id: Date.now().toString(),
      userName: reviewerName || 'Anonymous',
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      notHelpful: 0
    };

    setReviews(prev => [newReview, ...prev]);
    setRating(0);
    setComment('');
    setReviewerName('');
    setIsSubmitting(false);
    
    toast.success('Thank you for your review!');
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
            disabled={!interactive}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">Community Call</h1>
            </div>
            <Button variant="ghost" onClick={() => onNavigate('login')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Reviews</h2>
          <p className="text-gray-600">See what our community members are saying about Community Call</p>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Overall Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">{getAverageRating()}</div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(parseFloat(getAverageRating())), false, 'w-6 h-6')}
                </div>
                <p className="text-gray-600">Based on {reviews.length} reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-6">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ 
                          width: `${reviews.length > 0 ? (distribution[rating as keyof typeof distribution] / reviews.length) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {distribution[rating as keyof typeof distribution]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Review Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>Help other community members by sharing your experience with Community Call</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Name (Optional)</label>
                  <Input
                    placeholder="Enter your name or leave blank for anonymous"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Rating *</label>
                  <div className="flex items-center gap-2">
                    {renderStars(rating, true, 'w-8 h-8')}
                    <span className="text-sm text-gray-600 ml-2">
                      {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your Review *</label>
                <Textarea
                  placeholder="Share your experience with Community Call..."
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Community Reviews</h3>
          
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-800">{review.userName}</h4>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating, false, 'w-4 h-4')}
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Was this helpful?</span>
                  <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{review.notHelpful}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <button onClick={() => onNavigate('terms')} className="hover:text-blue-500">
              Terms & Conditions
            </button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-blue-500">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('reviews')} className="hover:text-blue-500">
              User Reviews
            </button>
          </div>
          <div className="text-center mt-2 text-xs text-gray-500">
            © 2025 Community Call
          </div>
        </div>
      </footer>
    </div>
  );
}