
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
}

const ProfileHeader = ({ profile, hasRevealed, onRevealContact }: ProfileHeaderProps) => {
  return (
    <div className="flex items-start gap-6 p-6 bg-white border border-gray-200 rounded-lg">
      <Avatar className="w-16 h-16">
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback className="bg-brand-primary text-white text-2xl">
          {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold text-brand-primary">
            {profile.name}
          </h1>
          
          <Button
            onClick={onRevealContact}
            disabled={hasRevealed}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              hasRevealed 
                ? 'bg-gray-500 text-white cursor-not-allowed hover:bg-gray-500' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {hasRevealed ? 'Contato já revelado' : 'Mostrar contato'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-sm font-medium capitalize">
            {profile.type}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="text-lg font-semibold text-gray-700">
            {profile.rating.toFixed(1)}
          </span>
          <span className="text-gray-500">avaliação</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
