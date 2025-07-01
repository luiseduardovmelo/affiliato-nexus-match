
import { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface RatingSystemProps {
  profileId: string;
  currentRating?: number;
  totalRatings?: number;
  userHasRated?: boolean;
}

const RatingSystem = ({ profileId, currentRating = 0, totalRatings = 0, userHasRated = false }: RatingSystemProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma avaliação.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simular envio da avaliação
    setTimeout(() => {
      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi registrada com sucesso.",
      });
      setShowForm(false);
      setSelectedRating(0);
      setComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = interactive 
        ? starValue <= (hoverRating || selectedRating)
        : starValue <= rating;

      return (
        <Star
          key={index}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            isFilled 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-400'
          }`}
          onClick={interactive ? () => handleStarClick(starValue) : undefined}
          onMouseEnter={interactive ? () => handleStarHover(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        />
      );
    });
  };

  if (userHasRated && !showForm) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {renderStars(currentRating)}
            </div>
            <span className="text-lg font-semibold">{currentRating.toFixed(1)}</span>
            <span className="text-gray-500">({totalRatings} avaliações)</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">Você já avaliou este perfil.</p>
          <Button 
            variant="outline" 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Atualizar avaliação
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Avaliação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(currentRating)}
          </div>
          <span className="text-lg font-semibold">{currentRating.toFixed(1)}</span>
          <span className="text-gray-500">({totalRatings} avaliações)</span>
        </div>

        {!showForm ? (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-brand-primary hover:bg-brand-accent text-white"
          >
            Avaliar perfil
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sua avaliação:</label>
              <div className="flex items-center gap-1 mb-4">
                {renderStars(selectedRating, true)}
                {selectedRating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {selectedRating} de 5 estrelas
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Comentário (opcional):
              </label>
              <Textarea
                placeholder="Compartilhe sua experiência com este perfil..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-brand-success hover:bg-brand-accent text-white"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setSelectedRating(0);
                  setComment('');
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingSystem;
