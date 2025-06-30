
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  profile: {
    name: string;
    avatar: string;
    rating: number;
    type: 'operador' | 'afiliado';
  };
}

const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-6 p-6 bg-white border border-gray-200 rounded-lg">
      <Avatar className="w-20 h-20">
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback className="bg-brand-primary text-white text-2xl">
          {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-brand-primary mb-2">
          {profile.name}
        </h1>
        
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
