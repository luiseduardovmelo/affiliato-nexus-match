
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2 } from 'lucide-react';
import { UserType } from '@/types/registration';

interface UserTypeSelectionProps {
  selectedType: UserType | null;
  onSelectType: (type: UserType) => void;
  onNext: () => void;
}

const UserTypeSelection = ({ selectedType, onSelectType, onNext }: UserTypeSelectionProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-primary mb-4">
          Como você atua no mercado iGaming?
        </h2>
        <p className="text-gray-600 text-lg">
          Escolha a opção que melhor descreve seu perfil
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
            selectedType === 'afiliado' 
              ? 'ring-2 ring-brand-success shadow-lg transform scale-105' 
              : 'hover:scale-105'
          }`}
          onClick={() => onSelectType('afiliado')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-brand-success" />
            </div>
            <CardTitle className="text-brand-primary text-2xl mb-3">
              Sou Afiliado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Promovo produtos e serviços de casas de apostas através do meu tráfego e audiência
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Redes sociais e influência</p>
              <p>• Sites e blogs especializados</p>
              <p>• Email marketing</p>
              <p>• Mídia paga</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
            selectedType === 'operador' 
              ? 'ring-2 ring-brand-accent shadow-lg transform scale-105' 
              : 'hover:scale-105'
          }`}
          onClick={() => onSelectType('operador')}
        >
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-brand-accent" />
            </div>
            <CardTitle className="text-brand-primary text-2xl mb-3">
              Sou Operador
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Opero uma casa de apostas e busco afiliados qualificados para expandir meu negócio
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Plataforma de apostas</p>
              <p>• Programas de afiliação</p>
              <p>• Gestão de parcerias</p>
              <p>• Comissões e pagamentos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedType && (
        <div className="text-center">
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-12 py-4 text-lg font-semibold"
          >
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserTypeSelection;
