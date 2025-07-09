
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
// Temporary types - will be replaced with Supabase types
interface TopItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  position: number;
}

interface PodiumCardProps {
  title: string;
  data: TopItem[];
  linkType: 'operadores' | 'afiliados';
}

const PodiumCard = ({ title, data, linkType }: PodiumCardProps) => {
  const getMedalColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-brand-warning text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-amber-600 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <Card className="border border-brand-accent/20 rounded-lg bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-brand-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => (
          <Link
            key={item.id}
            to={`/profile/${item.id}`}
            className="block p-4 rounded-lg border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              {/* Medal */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getMedalColor(item.position)}`}>
                {item.position}
              </div>
              
              {/* Avatar */}
              <Avatar className="w-12 h-12">
                <AvatarImage src={item.avatar} alt={item.name} />
                <AvatarFallback className="bg-brand-primary text-white">
                  {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              {/* Name and Rating */}
              <div className="flex-1">
                <h3 className="font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-brand-warning text-brand-warning" />
                  <span className="text-sm font-medium text-gray-700">
                    {item.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Ver todos link - only visible on md and up */}
        <div className="hidden md:block pt-4 border-t border-gray-100">
          <Link
            to={`/lista?tipo=${linkType}`}
            className="text-brand-accent hover:text-brand-primary transition-colors font-medium"
          >
            Ver todos →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PodiumCard;
