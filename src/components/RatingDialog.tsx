import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  onSubmit: (rating: number, feedback?: string) => void;
}

export default function RatingDialog({ isOpen, onClose, bookTitle, onSubmit }: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback.trim() || undefined);
      setRating(0);
      setFeedback('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">¿Qué tal esta recomendación?</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{bookTitle}</span>
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Labels */}
          <p className="text-center text-sm text-muted-foreground">
            {rating === 0 && 'Selecciona una calificación'}
            {rating === 1 && '😞 No me gustó'}
            {rating === 2 && '😕 No fue lo que esperaba'}
            {rating === 3 && '😐 Está bien'}
            {rating === 4 && '😊 Me gustó mucho'}
            {rating === 5 && '🤩 ¡Recomendación perfecta!'}
          </p>

          {/* Optional Feedback */}
          {rating > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Comentario (opcional)
              </label>
              <Textarea
                placeholder="¿Qué te pareció esta recomendación?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {feedback.length}/200
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1"
            >
              Enviar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
