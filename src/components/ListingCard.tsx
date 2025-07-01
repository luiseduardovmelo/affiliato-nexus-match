
import { Star, Users, CreditCard, Calendar, Target, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Listing } from '@/data/mockListings';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
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
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-brand-warning text-brand-warning" />
                <span className="text-sm font-medium text-gray-700">
                  {listing.rating.toFixed(1)}
                </span>
              </div>
            </div>
            
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
                {listing.commissionModels && listing.commissionModels.length > 0 && (
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
                {listing.currentOperators && listing.currentOperators.length > 0 && (
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
          className="w-full border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white"
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
