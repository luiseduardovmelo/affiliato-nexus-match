
import { Star } from 'lucide-react';
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
