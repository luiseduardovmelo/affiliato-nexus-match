import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AfiliadoData } from '@/types/registration';

interface AfiliadoFormProps {
  data: AfiliadoData;
  onUpdate: (data: AfiliadoData) => void;
  onNext: () => void;
  onBack: () => void;
}

const trafficSourceOptions = [
  'Redes Sociais (Instagram, TikTok, YouTube)',
  'Email Marketing',
  'Site/Blog Próprio',
  'Influencer Marketing',
  'Mídia Paga (Google Ads, Facebook Ads)',
  'Orgânico/SEO',
  'Outros'
];

const promotionChannelOptions = [
  'YouTube',
  'Instagram',
  'TikTok',
  'Facebook',
  'Twitter/X',
  'Twitch',
  'Kick',
  'Discord',
  'Telegram',
  'WhatsApp',
  'Website/Blog',
  'Podcast',
  'Newsletter',
  'Outros'
];

const languageOptions = [
  'Português',
  'Inglês',
  'Espanhol'
];

const specialtyOptions = [
  'Esportes',
  'Casino',
  'Poker',
  'eSports',
  'Todos os segmentos'
];

const AfiliadoForm = ({ data, onUpdate, onNext, onBack }: AfiliadoFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleArrayChange = (field: keyof AfiliadoData, value: string, checked: boolean) => {
    const currentArray = (data[field] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    onUpdate({ ...data, [field]: newArray });
  };

  const handleChange = (field: keyof AfiliadoData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.trafficSources || data.trafficSources.length === 0) {
      newErrors.trafficSources = 'Selecione pelo menos uma fonte de tráfego';
    }
    if (!data.commissionModel) {
      newErrors.commissionModel = 'Selecione um modelo de comissão';
    }
    if (!data.workLanguages || data.workLanguages.length === 0) {
      newErrors.workLanguages = 'Selecione pelo menos um idioma';
    }
    if (!data.monthlyTraffic) {
      newErrors.monthlyTraffic = 'Selecione o volume de tráfego mensal';
    }
    if (!data.specialties || data.specialties.length === 0) {
      newErrors.specialties = 'Selecione pelo menos uma especialidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-brand-primary text-center">
          Dados do Afiliado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Fontes de Tráfego *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trafficSourceOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={(data.trafficSources || []).includes(option)}
                  onCheckedChange={(checked) => handleArrayChange('trafficSources', option, !!checked)}
                />
                <Label htmlFor={option} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
          {errors.trafficSources && <p className="text-red-500 text-sm">{errors.trafficSources}</p>}
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Canais de Divulgação</Label>
          <p className="text-sm text-gray-600">Selecione os canais onde você promove seus conteúdos</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {promotionChannelOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`channel-${option}`}
                  checked={(data.promotionChannels || []).includes(option)}
                  onCheckedChange={(checked) => handleArrayChange('promotionChannels', option, !!checked)}
                />
                <Label htmlFor={`channel-${option}`} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Modelo de Comissão Preferido *</Label>
          <RadioGroup
            value={data.commissionModel}
            onValueChange={(value) => handleChange('commissionModel', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="revenue-share" id="revenue-share" />
              <Label htmlFor="revenue-share">Revenue Share (% da receita)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cpa" id="cpa" />
              <Label htmlFor="cpa">CPA (valor fixo por lead)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <Label htmlFor="hybrid">Híbrido (ambos)</Label>
            </div>
          </RadioGroup>
          {errors.commissionModel && <p className="text-red-500 text-sm">{errors.commissionModel}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">Idiomas de Trabalho *</Label>
            <div className="space-y-3">
              {languageOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={(data.workLanguages || []).includes(option)}
                    onCheckedChange={(checked) => handleArrayChange('workLanguages', option, !!checked)}
                  />
                  <Label htmlFor={option} className="text-sm">{option}</Label>
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="otherLanguages">Outros idiomas:</Label>
                <Input
                  id="otherLanguages"
                  value={data.otherLanguages || ''}
                  onChange={(e) => handleChange('otherLanguages', e.target.value)}
                  placeholder="Ex: Francês, Alemão..."
                />
              </div>
            </div>
            {errors.workLanguages && <p className="text-red-500 text-sm">{errors.workLanguages}</p>}
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Volume de Tráfego Mensal *</Label>
            <Select value={data.monthlyTraffic} onValueChange={(value) => handleChange('monthlyTraffic', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="até-1000">Até 1.000 visitantes</SelectItem>
                <SelectItem value="1001-5000">1.001 - 5.000 visitantes</SelectItem>
                <SelectItem value="5001-25000">5.001 - 25.000 visitantes</SelectItem>
                <SelectItem value="25001-100000">25.001 - 100.000 visitantes</SelectItem>
                <SelectItem value="mais-100000">Mais de 100.000 visitantes</SelectItem>
              </SelectContent>
            </Select>
            {errors.monthlyTraffic && <p className="text-red-500 text-sm">{errors.monthlyTraffic}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Especialidades/Nichos *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specialtyOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={(data.specialties || []).includes(option)}
                  onCheckedChange={(checked) => handleArrayChange('specialties', option, !!checked)}
                />
                <Label htmlFor={option} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
          {errors.specialties && <p className="text-red-500 text-sm">{errors.specialties}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minimumCPM">CPM Mínimo Desejado (R$)</Label>
            <Input
              id="minimumCPM"
              type="number"
              value={data.minimumCPM || ''}
              onChange={(e) => handleChange('minimumCPM', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Já trabalha com outros operadores?</Label>
            <RadioGroup
              value={data.worksWithOthers ? 'sim' : 'não'}
              onValueChange={(value) => handleChange('worksWithOthers', value === 'sim')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="works-sim" />
                <Label htmlFor="works-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="não" id="works-não" />
                <Label htmlFor="works-não">Não</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {data.worksWithOthers && (
          <div className="space-y-2">
            <Label htmlFor="otherOperators">Quais operadores?</Label>
            <Textarea
              id="otherOperators"
              value={data.otherOperatorsDetails || ''}
              onChange={(e) => handleChange('otherOperatorsDetails', e.target.value)}
              placeholder="Liste os operadores com quem já trabalha..."
              rows={3}
            />
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={handleSubmit} className="bg-brand-success hover:bg-brand-success/90">
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AfiliadoForm;
