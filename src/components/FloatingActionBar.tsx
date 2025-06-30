
import { Button } from '@/components/ui/button';
import { Edit, Settings } from 'lucide-react';

const FloatingActionBar = () => {
  return (
    <div className="fixed bottom-6 right-6 hidden md:flex gap-3 z-50">
      <Button 
        size="lg"
        className="bg-brand-success hover:bg-brand-accent text-white shadow-lg rounded-full px-6 transition-all duration-200 hover:shadow-xl"
      >
        <Edit className="w-4 h-4 mr-2" />
        Editar Perfil
      </Button>
      <Button 
        size="lg"
        variant="outline" 
        className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white shadow-lg rounded-full px-6 transition-all duration-200 hover:shadow-xl"
      >
        <Settings className="w-4 h-4 mr-2" />
        Configurações
      </Button>
    </div>
  );
};

export default FloatingActionBar;
