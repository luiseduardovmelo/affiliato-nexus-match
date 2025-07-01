import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ComissionModel, PaymentFrequency, PlatformType, TrafficType } from '@/data/mockListings';

export interface FilterState {
  country: string;
  language: string;
  minRating: number;
  
  // Filtros específicos para operadores
  monthlyTrafficVolume: string;
  commissionModels: ComissionModel[];
  paymentFrequency: PaymentFrequency | '';
  platformType: PlatformType | '';
  acceptsRetargeting: boolean | null;
  installsPostback: boolean | null;
  
  // Filtros específicos para afiliados
  chargedValue: string;
  desiredCommissionMethod: ComissionModel | '';
  trafficTypes: TrafficType[];
  currentOperators: string[];
}

interface FilterDrawerProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  activeTab: 'operadores' | 'afiliados';
}

const FilterDrawer = ({ filters, onFiltersChange, onClearFilters, isOpen = false, onOpenChange, activeTab }: FilterDrawerProps) => {
  const countries = ['Todos', 'Brasil', 'Portugal', 'Reino Unido', 'Espanha', 'Estados Unidos'];
  const languages = ['Todos', 'Português', 'Inglês', 'Espanhol'];
  const commissionModels: ComissionModel[] = ['CPA', 'REV', 'Hibrido'];
  const paymentFrequencies: PaymentFrequency[] = ['semanal', 'quinzenal', 'mensal'];
  const platformTypes: PlatformType[] = ['Cassino', 'Apostas Esportivas', 'Poker', 'Bingo', 'Completa'];
  
  const trafficTypes: TrafficType[] = [
    'SEO (blogs, sites de review, comparadores de odds)',
    'YouTube orgânico',
    'Google Ads',
    'Facebook Ads / Instagram Ads',
    'TikTok Ads',
    'DSPs (mídia programática)',
    'Push notifications',
    'Native ads (Taboola, Outbrain, etc.)',
    'Influenciadores (YouTube, Twitch, Kick)',
    'Grupos de Telegram',
    'Grupos de WhatsApp',
    'Canais de Discord',
    'E-mail marketing',
    'Pop-unders',
    'Redirects',
    'Cloaking',
    'Fake news pages',
    'Retargeting (via pixel ou DSP)',
    'Tráfego via apps (Android .apk ou app próprio)',
    'ASO (App Store Optimization)',
    'Fóruns de apostas / Reddit',
    'Tráfego direto (digitação de URL)',
    'SMS marketing',
    'Tráfego comprado de redes (revenda de tráfego de outros afiliados)'
  ];

  const handleCountryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      country: value === 'Todos' ? '' : value
    });
  };

  const handleLanguageChange = (value: string) => {
    onFiltersChange({
      ...filters,
      language: value === 'Todos' ? '' : value
    });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minRating: value[0]
    });
  };

  const handleCommissionModelChange = (model: ComissionModel, checked: boolean) => {
    const newModels = checked 
      ? [...filters.commissionModels, model]
      : filters.commissionModels.filter(m => m !== model);
    
    onFiltersChange({
      ...filters,
      commissionModels: newModels
    });
  };

  const handleTrafficTypeChange = (trafficType: TrafficType, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.trafficTypes, trafficType]
      : filters.trafficTypes.filter(t => t !== trafficType);
    
    onFiltersChange({
      ...filters,
      trafficTypes: newTypes
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.country) count++;
    if (filters.language) count++;
    if (filters.minRating > 0) count++;
    if (filters.monthlyTrafficVolume) count++;
    if (filters.commissionModels.length > 0) count++;
    if (filters.paymentFrequency) count++;
    if (filters.platformType) count++;
    if (filters.acceptsRetargeting !== null) count++;
    if (filters.installsPostback !== null) count++;
    if (filters.chargedValue) count++;
    if (filters.desiredCommissionMethod) count++;
    if (filters.trafficTypes.length > 0) count++;
    return count;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros - {activeTab === 'operadores' ? 'Operadores' : 'Afiliados'}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Filtros Gerais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">Filtros Gerais</h3>
            
            {/* Country Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">País</Label>
              <Select value={filters.country || 'Todos'} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Idioma</Label>
              <Select value={filters.language || 'Todos'} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Rating Mínimo: {filters.minRating.toFixed(1)}
              </Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={handleRatingChange}
                max={5}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Filtros específicos para Operadores */}
          {activeTab === 'operadores' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">Filtros de Operadores</h3>
              
              {/* Commission Models */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Modelos de Comissionamento</Label>
                <div className="space-y-2">
                  {commissionModels.map((model) => (
                    <div key={model} className="flex items-center space-x-2">
                      <Checkbox
                        id={`commission-${model}`}
                        checked={filters.commissionModels.includes(model)}
                        onCheckedChange={(checked) => handleCommissionModelChange(model, checked as boolean)}
                      />
                      <Label htmlFor={`commission-${model}`} className="text-sm">{model}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Frequency */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Periodicidade de Pagamento</Label>
                <Select value={filters.paymentFrequency || 'Todos'} onValueChange={(value) => 
                  onFiltersChange({...filters, paymentFrequency: value === 'Todos' ? '' : value as PaymentFrequency})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a periodicidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    {paymentFrequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Type */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Tipo de Plataforma</Label>
                <Select value={filters.platformType || 'Todos'} onValueChange={(value) => 
                  onFiltersChange({...filters, platformType: value === 'Todos' ? '' : value as PlatformType})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    {platformTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Accepts Retargeting */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Aceita Retargeting?</Label>
                <RadioGroup 
                  value={filters.acceptsRetargeting === null ? 'todos' : filters.acceptsRetargeting.toString()}
                  onValueChange={(value) => 
                    onFiltersChange({
                      ...filters, 
                      acceptsRetargeting: value === 'todos' ? null : value === 'true'
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="todos" id="retargeting-todos" />
                    <Label htmlFor="retargeting-todos">Todos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="retargeting-sim" />
                    <Label htmlFor="retargeting-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="retargeting-nao" />
                    <Label htmlFor="retargeting-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Installs Postback */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Instala Postback?</Label>
                <RadioGroup 
                  value={filters.installsPostback === null ? 'todos' : filters.installsPostback.toString()}
                  onValueChange={(value) => 
                    onFiltersChange({
                      ...filters, 
                      installsPostback: value === 'todos' ? null : value === 'true'
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="todos" id="postback-todos" />
                    <Label htmlFor="postback-todos">Todos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="postback-sim" />
                    <Label htmlFor="postback-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="postback-nao" />
                    <Label htmlFor="postback-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Filtros específicos para Afiliados */}
          {activeTab === 'afiliados' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">Filtros de Afiliados</h3>
              
              {/* Desired Commission Method */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Método de Comissão Desejado</Label>
                <Select value={filters.desiredCommissionMethod || 'Todos'} onValueChange={(value) => 
                  onFiltersChange({...filters, desiredCommissionMethod: value === 'Todos' ? '' : value as ComissionModel})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    {commissionModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Traffic Types */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Tipos de Tráfego</Label>
                <div className="space-y-2">
                  {trafficTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`traffic-${type}`}
                        checked={filters.trafficTypes.includes(type)}
                        onCheckedChange={(checked) => handleTrafficTypeChange(type, checked as boolean)}
                      />
                      <Label htmlFor={`traffic-${type}`} className="text-xs leading-tight">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Clear Filters */}
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="w-full"
            disabled={getActiveFiltersCount() === 0}
          >
            Limpar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
