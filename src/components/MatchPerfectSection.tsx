
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
// Temporary types - will be replaced with Supabase types
interface MatchItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  matchScore: number;
}

// Temporary empty array - will be replaced with Supabase data
const mockMatchData: MatchItem[] = [];

const MatchPerfectSection = () => {
  const validMatches = mockMatchData.filter(match => match.matchScore >= 0.8);

  // Temporarily return null since we have no data
  if (validMatches.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-brand-primary mb-8 text-center">
          Match Perfeito para você
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {validMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface MatchCardProps {
  match: MatchItem;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const matchPercentage = Math.round(match.matchScore * 100);

  return (
    <Card className="bg-white border border-brand-accent/15 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={match.avatar} alt={match.name} />
            <AvatarFallback className="bg-brand-primary text-white">
              {match.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-brand-primary mb-1">
              {match.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-brand-warning text-brand-warning" />
              <span className="text-sm font-medium text-gray-700">
                {match.rating.toFixed(1)}
              </span>
            </div>

            {match.matchScore >= 0.8 && (
              <Badge className="bg-brand-success text-white hover:bg-brand-success/80 text-xs font-medium">
                {matchPercentage}% de match
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Link to={`/profile/${match.id}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors"
            >
              Ver perfil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchPerfectSection;
