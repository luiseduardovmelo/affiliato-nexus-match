
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OperadorData } from '@/types/registration';

interface OperadorFormProps {
  data: OperadorData;
  onUpdate: (data: OperadorData) => void;
  onNext: () => void;
  onBack: () => void;
}

const commissionModelOptions = [
  'Revenue Share (% da receita)',
  'CPA (valor fixo por lead)',
  'Híbrido (ambos)'
];

const countryOptions = [
  'Brasil',
  'América Latina',
  'Estados Unidos',
  'Europa',
  'Ásia',
  'Global'
];

const segmentOptions = [
  'Apostas Esportivas',
  'Casino Online',
  'Poker',
  'eSports',
  'Bingo',
  'Todos'
];

const OperadorForm = ({ data, onUpdate, onNext, onBack }: OperadorFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleArrayChange = (field: keyof OperadorData, value: string, checked: boolean) => {
    const currentArray = (data[field] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    onUpdate({ ...data, [field]: newArray });
  };

  const handleChange = (field: keyof OperadorData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.monthlyVolume) {
      newErrors.monthlyVolume = 'Selecione o volume mensal';
    }
    if (!data.commissionModels || data.commissionModels.length === 0) {
      newErrors.commissionModels = 'Selecione pelo menos um modelo de comissão';
    }
    if (!data.paymentSchedule) {
      newErrors.paymentSchedule = 'Selecione o cronograma de pagamento';
    }
    if (!data.acceptedCountries || data.acceptedCountries.length === 0) {
      newErrors.acceptedCountries = 'Selecione pelo menos um país/região';
    }
    if (!data.segments || data.segments.length === 0) {
      newErrors.segments = 'Selecione pelo menos um segmento';
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
          Dados do Operador
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">Volume Mensal da Casa *</Label>
            <Select value={data.monthlyVolume} onValueChange={(value) => handleChange('monthlyVolume', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="até-100k">Até R$ 100mil</SelectItem>
                <SelectItem value="100k-500k">R$ 100mil - R$ 500mil</SelectItem>
                <SelectItem value="500k-2mi">R$ 500mil - R$ 2 milhões</SelectItem>
                <SelectItem value="2mi-10mi">R$ 2 milhões - R$ 10 milhões</SelectItem>
                <SelectItem value="mais-10mi">Mais de R$ 10 milhões</SelectItem>
              </SelectContent>
            </Select>
            {errors.monthlyVolume && <p className="text-red-500 text-sm">{errors.monthlyVolume}</p>}
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Cronograma de Pagamento *</Label>
            <RadioGroup
              value={data.paymentSchedule}
              onValueChange={(value) => handleChange('paymentSchedule', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Semanal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="biweekly" id="biweekly" />
                <Label htmlFor="biweekly">Quinzenal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Mensal</Label>
              </div>
            </RadioGroup>
            {errors.paymentSchedule && <p className="text-red-500 text-sm">{errors.paymentSchedule}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Modelos de Comissão Oferecidos *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {commissionModelOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={(data.commissionModels || []).includes(option)}
                  onCheckedChange={(checked) => handleArrayChange('commissionModels', option, !!checked)}
                />
                <Label htmlFor={option} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
          {errors.commissionModels && <p className="text-red-500 text-sm">{errors.commissionModels}</p>}
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Países/Regiões Aceitas *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {countryOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={(data.acceptedCountries || []).includes(option)}
                  onCheckedChange={(checked) => handleArrayChange('acceptedCountries', option, !!checked)}
                />
                <Label htmlFor={option} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
          {errors.acceptedCountries && <p className="text-red-500 text-sm">{errors.acceptedCountries}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">Aceita Retargeting?</Label>
            <RadioGroup
              value={data.allowsRetargeting ? 'sim' : 'não'}
              onValueChange={(value) => handleChange('allowsRetargeting', value === 'sim')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="retargeting-sim" />
                <Label htmlFor="retargeting-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="não" id="retargeting-não" />
                <Label htmlFor="retargeting-não">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Oferece Postback?</Label>
            <RadioGroup
              value={data.offersPostback ? 'sim' : 'não'}
              onValueChange={(value) => handleChange('offersPostback', value === 'sim')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="postback-sim" />
                <Label htmlFor="postback-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="não" id="postback-não" />
                <Label htmlFor="postback-não">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Possui White Label?</Label>
            <RadioGroup
              value={data.hasWhiteLabel ? 'sim' : 'não'}
              onValueChange={(value) => handleChange('hasWhiteLabel', value === 'sim')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="whitelabel-sim" />
                <Label htmlFor="whitelabel-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="não" id="whitelabel-não" />
                <Label htmlFor="whitelabel-não">Não</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {data.hasWhiteLabel && (
          <div className="space-y-2">
            <Label htmlFor="whiteLabelDetails">Detalhes do White Label</Label>
            <Textarea
              id="whiteLabelDetails"
              value={data.whiteLabelDetails || ''}
              onChange={(e) => handleChange('whiteLabelDetails', e.target.value)}
              placeholder="Descreva as opções de white label oferecidas..."
              rows={3}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="minimumTraffic">Tráfego Mínimo Exigido (visitantes/mês)</Label>
          <Input
            id="minimumTraffic"
            type="number"
            value={data.minimumTraffic || ''}
            onChange={(e) => handleChange('minimumTraffic', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenueShare">Revenue Share (%)</Label>
            <Input
              id="revenueShare"
              type="number"
              value={data.revenueShareRate || ''}
              onChange={(e) => handleChange('revenueShareRate', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpaFirst">CPA - Primeiro Depósito (R$)</Label>
            <Input
              id="cpaFirst"
              type="number"
              value={data.cpaFirstDeposit || ''}
              onChange={(e) => handleChange('cpaFirstDeposit', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpaLead">CPA - Lead Qualificado (R$)</Label>
            <Input
              id="cpaLead"
              type="number"
              value={data.cpaQualifiedLead || ''}
              onChange={(e) => handleChange('cpaQualifiedLead', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Segmentos Oferecidos *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {segmentOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={(data.segments || []).includes(option)}
                  onCheckedChange={(checked) => handleArrayChange('segments', option, !!checked)}
                />
                <Label htmlFor={option} className="text-sm">{option}</Label>
              </div>
            ))}
          </div>
          {errors.segments && <p className="text-red-500 text-sm">{errors.segments}</p>}
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={handleSubmit} className="bg-brand-accent hover:bg-brand-accent/90">
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperadorForm;
