
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  profile: {
    name: string;
    avatar: string;
    rating: number;
    type: 'operador' | 'afiliado';
  };
  hasRevealed: boolean;
  onRevealContact: () => void;
  isRevealing?: boolean;
}

const ProfileHeader = ({ profile, hasRevealed, onRevealContact, isRevealing = false }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-white border border-gray-200 rounded-lg">
      <Avatar className="w-16 h-16 flex-shrink-0">
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback className="bg-brand-primary text-white text-2xl">
          {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary break-words">
            {profile.name}
          </h1>
          
          <Button
            onClick={onRevealContact}
            disabled={hasRevealed || isRevealing}
            className={`px-4 sm:px-6 py-2 font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              hasRevealed 
                ? 'bg-gray-500 text-white cursor-not-allowed hover:bg-gray-500' 
                : isRevealing
                ? 'bg-yellow-500 text-white cursor-not-allowed hover:bg-yellow-500'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {hasRevealed ? 'Contato revelado' : isRevealing ? 'Revelando...' : 'Mostrar contato'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-sm font-medium capitalize">
            {profile.type}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star className={`w-5 h-5 ${profile.rating > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          <span className="text-lg font-semibold text-gray-700">
            {profile.rating > 0 ? profile.rating.toFixed(1) : 'N/A'}
          </span>
          <span className="text-gray-500">
            {profile.rating > 0 ? 'avaliação' : 'sem avaliações'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
