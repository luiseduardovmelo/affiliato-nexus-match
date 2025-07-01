
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Eye, EyeOff } from 'lucide-react';
import { BasicUserData } from '@/types/registration';

interface BasicDataFormProps {
  data: BasicUserData;
  onUpdate: (data: BasicUserData) => void;
  onNext: () => void;
  onBack: () => void;
}

const countries = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
];

const BasicDataForm = ({ data, onUpdate, onNext, onBack }: BasicDataFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof BasicUserData, value: string) => {
    onUpdate({ ...data, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Email inválido';

    if (!data.password) newErrors.password = 'Senha é obrigatória';
    else if (data.password.length < 8) newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      newErrors.password = 'Senha deve conter maiúscula, minúscula e número';
    }

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!data.displayName) newErrors.displayName = 'Nome de exibição é obrigatório';
    if (!data.country) newErrors.country = 'País é obrigatório';
    if (!data.phone) newErrors.phone = 'Telefone é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-brand-primary text-center">
          Dados Básicos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Nome de Exibição *</Label>
            <Input
              id="displayName"
              value={data.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              className={errors.displayName ? 'border-red-500' : ''}
            />
            {errors.displayName && <p className="text-red-500 text-sm">{errors.displayName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Senha *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={data.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País *</Label>
          <Select value={data.country} onValueChange={(value) => handleChange('country', value)}>
            <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione seu país" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileDescription">Descrição do Perfil</Label>
          <Textarea
            id="profileDescription"
            value={data.profileDescription}
            onChange={(e) => handleChange('profileDescription', e.target.value)}
            placeholder="Conte um pouco sobre você e sua experiência..."
            maxLength={500}
            rows={4}
          />
          <p className="text-sm text-gray-500">
            {data.profileDescription.length}/500 caracteres
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone/WhatsApp *</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+55 11 99999-9999"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              value={data.telegram || ''}
              onChange={(e) => handleChange('telegram', e.target.value)}
              placeholder="@seuusuario"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="publicEmail">Email Público</Label>
          <Input
            id="publicEmail"
            type="email"
            value={data.publicEmail || ''}
            onChange={(e) => handleChange('publicEmail', e.target.value)}
            placeholder="Se diferente do email de login"
          />
        </div>

        <div className="space-y-2">
          <Label>Logo/Avatar</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Clique para fazer upload ou arraste uma imagem
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG até 2MB
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={handleSubmit} className="bg-brand-primary hover:bg-brand-primary/90">
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicDataForm;
