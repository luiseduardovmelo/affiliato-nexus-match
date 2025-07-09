
import { useState, useEffect } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useReviewStats, useSubmitReview } from '@/hooks/useReviews';

interface RatingSystemProps {
  profileId: string;
}

const RatingSystem = ({ profileId }: RatingSystemProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const { data: reviewStats, isLoading } = useReviewStats(profileId);
  const submitReview = useSubmitReview();

  // Carregar dados da avaliação existente do usuário
  useEffect(() => {
    if (reviewStats?.userReview) {
      setSelectedRating(reviewStats.userReview.rating);
      setComment(reviewStats.userReview.comment || '');
    }
  }, [reviewStats]);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      return;
    }

    try {
      await submitReview.mutateAsync({
        targetId: profileId,
        rating: selectedRating,
        comment: comment.trim() || undefined,
      });
      
      // Limpar apenas se for uma nova avaliação
      if (!reviewStats?.userHasRated) {
        setSelectedRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
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
          className={`w-6 h-6 transition-all duration-200 ${
            interactive 
              ? 'cursor-pointer hover:scale-110' 
              : 'cursor-default'
          } ${
            isFilled 
              ? 'fill-yellow-400 text-yellow-400' 
              : interactive 
                ? 'text-gray-300 hover:text-yellow-200' 
                : 'text-gray-300'
          }`}
          onClick={interactive ? () => handleStarClick(starValue) : undefined}
          onMouseEnter={interactive ? () => handleStarHover(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        />
      );
    });
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Avaliação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="w-6 h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentRating = reviewStats?.averageRating || 0;
  const totalRatings = reviewStats?.totalReviews || 0;
  const userHasRated = reviewStats?.userHasRated || false;

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
          {totalRatings > 0 ? (
            <>
              <span className="text-lg font-semibold">{currentRating.toFixed(1)}</span>
              <span className="text-gray-500">({totalRatings} avaliações)</span>
            </>
          ) : (
            <span className="text-gray-500">Nenhuma avaliação ainda</span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {userHasRated ? 'Sua avaliação atual:' : 'Sua avaliação:'}
              {!userHasRated && (
                <span className="text-xs text-gray-500 font-normal ml-2">
                  (clique nas estrelas para avaliar)
                </span>
              )}
            </label>
            <div className="flex items-center gap-1 mb-4">
              {renderStars(selectedRating || hoverRating, true)}
              {(selectedRating > 0 || hoverRating > 0) && (
                <span className="ml-2 text-sm text-gray-600">
                  {selectedRating || hoverRating} de 5 estrelas
                </span>
              )}
            </div>
          </div>

          {selectedRating > 0 && (
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
          )}

          {selectedRating > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={submitReview.isPending}
                className="bg-brand-success hover:bg-brand-accent text-white"
              >
                {submitReview.isPending ? 'Enviando...' : userHasRated ? 'Atualizar avaliação' : 'Enviar avaliação'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (userHasRated && reviewStats?.userReview) {
                    // Voltar para a avaliação original
                    setSelectedRating(reviewStats.userReview.rating);
                    setComment(reviewStats.userReview.comment || '');
                  } else {
                    // Limpar tudo
                    setSelectedRating(0);
                    setComment('');
                  }
                }}
                disabled={submitReview.isPending}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingSystem;
