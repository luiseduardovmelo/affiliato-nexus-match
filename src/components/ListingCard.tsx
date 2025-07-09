import { Star, Users, CreditCard, Calendar, Target, CheckCircle, XCircle, Heart, Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
// Temporary types - will be replaced with Supabase types
type Listing = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  country: string;
  language: string;
  description: string;
  type: 'operador' | 'afiliado';
  monthlyTrafficVolume?: string;
  commissionModels?: string[];
  paymentFrequency?: string;
  acceptsRetargeting?: boolean;
  installsPostback?: boolean;
  chargedValue?: string;
  desiredCommissionMethod?: string;
  promotionChannels?: string[];
  currentOperators?: string[];
  previousOperators?: string[];
  basicInfo?: string;
  whiteLabel?: string;
  specialties: string[];
  platformType?: string;
  trafficTypes?: string[];
};
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { useRevealState } from '@/hooks/useRevealState';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const { data: isFavorite = false } = useIsFavorite(listing.id);
  const toggleFavorite = useToggleFavorite();
  const { hasRevealed } = useRevealState(listing.id, listing.name);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite.mutate({ targetId: listing.id, isCurrentlyFavorite: isFavorite });
  };

  // Função para obter ícone do canal
  const getChannelIcon = (channel: string) => {
    const channelLower = channel.toLowerCase();
    if (channelLower.includes('youtube')) return <Youtube className="w-3 h-3" />;
    if (channelLower.includes('instagram')) return <Instagram className="w-3 h-3" />;
    if (channelLower.includes('facebook')) return <Facebook className="w-3 h-3" />;
    if (channelLower.includes('twitter') || channelLower.includes('x')) return <Twitter className="w-3 h-3" />;
    return null;
  };

  // Determine card styling based on revealed contact status
  const cardClassName = hasRevealed 
    ? "bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-brand-primary/20 hover:shadow-lg transition-all duration-200"
    : "bg-white border border-gray-200 hover:shadow-lg transition-all duration-200";

  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={listing.avatar} alt={listing.name} />
            <AvatarFallback className="bg-brand-primary text-white">
              {listing.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg text-brand-primary">{listing.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavoriteClick}
                  className="p-1 h-8 w-8 hover:bg-red-50"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      isFavorite 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-500'
                    }`} 
                  />
                </Button>
                <div className="flex items-center gap-1">
                  <Star className={`w-4 h-4 ${listing.rating > 0 ? 'fill-brand-warning text-brand-warning' : 'text-gray-300'}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {listing.rating > 0 ? listing.rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            {hasRevealed && (
              <div className="mb-2">
                <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary text-xs">
                  Contato Revelado
                </Badge>
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {listing.country}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {listing.language}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {listing.description}
            </p>

            {/* Informações específicas por tipo */}
            {listing.type === 'operador' && (
              <div className="space-y-2 mb-3">
                {listing.monthlyTrafficVolume && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users className="w-3 h-3" />
                    <span>{listing.monthlyTrafficVolume}</span>
                  </div>
                )}
                {listing.commissionModels && Array.isArray(listing.commissionModels) && listing.commissionModels.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CreditCard className="w-3 h-3" />
                    <span>{listing.commissionModels.join(', ')}</span>
                  </div>
                )}
                {listing.paymentFrequency && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>Pagamento {listing.paymentFrequency}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {listing.acceptsRetargeting !== undefined && (
                    <div className="flex items-center gap-1 text-xs">
                      {listing.acceptsRetargeting ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-gray-600">Retargeting</span>
                    </div>
                  )}
                  {listing.installsPostback !== undefined && (
                    <div className="flex items-center gap-1 text-xs">
                      {listing.installsPostback ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-gray-600">Postback</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {listing.type === 'afiliado' && (
              <div className="space-y-2 mb-3">
                {listing.chargedValue && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CreditCard className="w-3 h-3" />
                    <span>{listing.chargedValue}</span>
                  </div>
                )}
                {listing.desiredCommissionMethod && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Target className="w-3 h-3" />
                    <span>Prefere {listing.desiredCommissionMethod}</span>
                  </div>
                )}
                {listing.promotionChannels && Array.isArray(listing.promotionChannels) && listing.promotionChannels.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-700">Canais:</span>
                    <div className="flex flex-wrap gap-1">
                      {listing.promotionChannels.slice(0, 4).map((channel, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {getChannelIcon(channel)}
                          <span>{channel}</span>
                        </div>
                      ))}
                      {listing.promotionChannels.length > 4 && (
                        <span className="text-xs text-gray-500">+{listing.promotionChannels.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
                {listing.currentOperators && Array.isArray(listing.currentOperators) && listing.currentOperators.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Trabalhando com:</span> {listing.currentOperators.slice(0, 2).join(', ')}
                    {listing.currentOperators.length > 2 && ' +outros'}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 mb-3">
              {listing.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Button 
          asChild
          variant="outline" 
          className={`w-full transition-colors ${
            hasRevealed
              ? 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'
              : 'border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white'
          }`}
        >
          <Link to={`/profile/${listing.id}`}>
            Ver Perfil
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
