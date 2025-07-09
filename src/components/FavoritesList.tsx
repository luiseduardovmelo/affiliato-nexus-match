import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { FavoriteUser } from '@/hooks/useFavorites';

interface FavoritesListProps {
  title: string;
  favorites: FavoriteUser[];
  isLoading: boolean;
  onRemoveFavorite: (userId: string) => void;
}

const FavoritesList = ({ title, favorites, isLoading, onRemoveFavorite }: FavoritesListProps) => {
  if (isLoading) {
    return (
      <Card className="border border-brand-accent/20 rounded-lg bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-brand-primary">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <Card className="border border-brand-accent/20 rounded-lg bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-brand-primary">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Nenhum favorito ainda</p>
            <p className="text-sm text-gray-400">
              Vá para a Lista e adicione parceiros aos seus favoritos
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-brand-accent/20 rounded-lg bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-brand-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Avatar className="w-12 h-12">
                <AvatarImage src={favorite.avatar} alt={favorite.name} />
                <AvatarFallback className="bg-brand-primary text-white">
                  {favorite.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to={`/profile/${favorite.id}`}
                    className="font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                  >
                    {favorite.name}
                  </Link>
                  <Badge 
                    variant="outline" 
                    className={favorite.role === 'affiliate' ? 'border-brand-success text-brand-success' : 'border-brand-accent text-brand-accent'}
                  >
                    {favorite.role === 'affiliate' ? 'Afiliado' : 'Operador'}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {favorite.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{favorite.country}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-brand-warning text-brand-warning" />
                    <span>{favorite.rating > 0 ? favorite.rating.toFixed(1) : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Link to={`/profile/${favorite.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Perfil
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemoveFavorite(favorite.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FavoritesList;