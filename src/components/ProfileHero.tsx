import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { KPIData } from '@/hooks/useProfileData';

interface ProfileHeroProps {
  profile: {
    name: string;
    type: string;
    isVerified: boolean;
    avatar: string;
  };
  kpis: KPIData[];
  loading: boolean;
  onEdit?: () => void;
}

const ProfileHero = ({ profile, kpis, loading, onEdit }: ProfileHeroProps) => {
  if (loading) {
    return (
      <div className="relative mb-8">
        <div className="h-32 bg-gradient-to-r from-brand-primary to-brand-accent rounded-t-xl animate-pulse" />
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center -mt-12 mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white shadow-lg animate-pulse" />
            <div className="mt-4 space-y-2">
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mx-auto" />
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-22 h-22 bg-gray-300 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-8 bg-white border border-brand-accent/15 rounded-xl shadow-sm overflow-hidden">
      {/* Hero Cover */}
      <div className="h-32 bg-gradient-to-r from-brand-primary to-brand-accent relative">
        {/* Edit Button - Desktop positioning */}
        <div className="hidden md:block absolute top-4 right-4">
          <Button 
            className="w-40 bg-brand-success hover:bg-brand-accent text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={onEdit}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar perfil
          </Button>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col items-center -mt-12 mb-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-brand-accent to-brand-success rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10">
            <span className="text-white font-bold text-2xl">
              {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          
          {/* Name & Type */}
          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold text-brand-primary mb-2">
              {profile.name}
            </h1>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-600">{profile.type}</span>
              {profile.isVerified && (
                <Badge className="bg-brand-success text-white">
                  Verificado
                </Badge>
              )}
            </div>
            
            {/* Edit Button - Mobile positioning */}
            <div className="md:hidden mt-3">
              <Button 
                className="w-48 bg-brand-success hover:bg-brand-accent text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={onEdit}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar perfil
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Badges */}
        <div className="flex justify-center gap-4 overflow-x-auto pb-2">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-22 h-22 rounded-full bg-white border-2 border-gray-100 shadow-md flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: kpi.color + '20' }}
            >
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: kpi.color }}
              >
                {kpi.value}
              </div>
              <div className="text-xs text-gray-600 text-center leading-none">
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
