
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Settings, MapPin } from 'lucide-react';

interface ProfileCardLeftProps {
  profile: {
    specialties: string[];
    location: string;
  };
  loading: boolean;
}

const ProfileCardLeft = ({ profile, loading }: ProfileCardLeftProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-brand-accent/15 rounded-xl p-6 h-fit">
        <div className="space-y-6">
          <div>
            <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-3" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-20 bg-gray-300 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
          <div>
            <div className="h-6 w-24 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-5 w-40 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-300 rounded animate-pulse" />
            <div className="h-10 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-accent/15 rounded-xl p-6 h-fit">
      <div className="space-y-6">
        {/* Especialidades */}
        <div>
          <h4 className="font-semibold text-brand-primary mb-3">Especialidades</h4>
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty, index) => (
              <Badge key={index} variant="outline" className="border-brand-accent/30">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        {/* Localização */}
        <div>
          <h4 className="font-semibold text-brand-primary mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Localização
          </h4>
          <p className="text-gray-600">{profile.location}</p>
        </div>

        {/* Links Rápidos - apenas no mobile */}
        <div className="space-y-3 md:hidden">
          <Button 
            className="w-full bg-brand-success hover:bg-brand-accent text-white justify-start"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white justify-start"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardLeft;
