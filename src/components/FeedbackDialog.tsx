import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { supabase } from '@/lib/supabase';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  const { user } = useAuth();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user?.id,
          feedback_type: feedbackType,
          message: message.trim(),
          rating: rating > 0 ? rating : null
        });

      if (error) throw error;

      toast({
        title: t('feedback.success'),
        description: '💛'
      });
      
      setMessage('');
      setRating(0);
      setFeedbackType('suggestion');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: t('feedback.error'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            {t('feedback.title')}
          </DialogTitle>
          <DialogDescription>
            {t('feedback.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Feedback Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('feedback.type')}</Label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestion">{t('feedback.typeSuggestion')}</SelectItem>
                <SelectItem value="bug">{t('feedback.typeBug')}</SelectItem>
                <SelectItem value="feature">{t('feedback.typeFeature')}</SelectItem>
                <SelectItem value="other">{t('feedback.typeOther')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('feedback.rating')}</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('feedback.message')}</Label>
            <Textarea
              placeholder={t('feedback.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] rounded-lg resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isSubmitting}
            className="w-full rounded-full bg-amber-600 hover:bg-amber-700 text-white py-5"
          >
            <Send className="w-4 h-4 mr-2" />
            {t('feedback.submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
