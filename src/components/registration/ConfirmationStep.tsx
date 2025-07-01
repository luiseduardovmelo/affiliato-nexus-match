
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RegistrationData } from '@/types/registration';
import { CheckCircle } from 'lucide-react';

interface ConfirmationStepProps {
  data: RegistrationData;
  onUpdate: (data: RegistrationData) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const howDidYouHearOptions = [
  'Google/Busca Online',
  'Redes Sociais',
  'Indicação de Amigo/Colega',
  'Eventos do Setor',
  'Newsletter/Email Marketing',
  'Anúncio Online',
  'Outros'
];

const ConfirmationStep = ({ data, onUpdate, onSubmit, onBack, isLoading }: ConfirmationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof RegistrationData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.termsAccepted) {
      newErrors.terms = 'Você deve aceitar os termos e condições';
    }
    if (!data.howDidYouHear) {
      newErrors.howDidYouHear = 'Por favor, nos conte como nos conheceu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-brand-primary text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-brand-success" />
            Quase Pronto!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Resumo do seu cadastro:</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Tipo:</strong> {data.userType === 'afiliado' ? 'Afiliado' : 'Operador'}</p>
              <p><strong>Nome:</strong> {data.basicData.displayName}</p>
              <p><strong>Email:</strong> {data.basicData.email}</p>
              <p><strong>País:</strong> {data.basicData.country}</p>
              <p><strong>Telefone:</strong> {data.basicData.phone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="howDidYouHear" className="text-base font-semibold">
              Como nos conheceu? *
            </Label>
            <Select 
              value={data.howDidYouHear} 
              onValueChange={(value) => handleChange('howDidYouHear', value)}
            >
              <SelectTrigger className={errors.howDidYouHear ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {howDidYouHearOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.howDidYouHear && <p className="text-red-500 text-sm">{errors.howDidYouHear}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="newsletter"
                checked={data.newsletterOptIn}
                onCheckedChange={(checked) => handleChange('newsletterOptIn', !!checked)}
              />
              <Label htmlFor="newsletter" className="text-sm leading-5">
                Quero receber novidades, dicas e oportunidades por email
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={data.termsAccepted}
                onCheckedChange={(checked) => handleChange('termsAccepted', !!checked)}
                className={errors.terms ? 'border-red-500' : ''}
              />
              <Label htmlFor="terms" className="text-sm leading-5">
                Li e aceito os{' '}
                <a href="#" className="text-brand-primary hover:underline">
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a href="#" className="text-brand-primary hover:underline">
                  Política de Privacidade
                </a>{' '}
                *
              </Label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onBack} disabled={isLoading}>
              Voltar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-brand-success hover:bg-brand-success/90 px-8"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationStep;
