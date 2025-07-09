import { Filter, X, Youtube, Globe, Search, Facebook, Instagram, Zap, Mail, Smartphone, Users, MessageCircle, Radio, Eye, MousePointer, AlertTriangle, Newspaper, Target, AppWindow, Star, MessageSquare, Globe2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
// Temporary types - will be replaced with Supabase types
type ComissionModel = 'CPA' | 'REV' | 'Hibrido';
type PaymentFrequency = 'semanal' | 'quinzenal' | 'mensal';
type PlatformType = 'Cassino' | 'Apostas Esportivas' | 'Poker' | 'Bingo' | 'Completa';
type TrafficType = string; // Will be properly typed later

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
  promotionChannels: string[]; // Nova propriedade
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
  
  const trafficTypes: { name: TrafficType; icon: any; color: string }[] = [
    { name: 'SEO (blogs, sites de review, comparadores de odds)', icon: Search, color: 'text-green-600' },
    { name: 'YouTube orgânico', icon: Youtube, color: 'text-red-600' },
    { name: 'Google Ads', icon: Search, color: 'text-blue-600' },
    { name: 'Facebook Ads / Instagram Ads', icon: Facebook, color: 'text-blue-500' },
    { name: 'TikTok Ads', icon: Smartphone, color: 'text-pink-600' },
    { name: 'DSPs (mídia programática)', icon: Target, color: 'text-purple-600' },
    { name: 'Push notifications', icon: Zap, color: 'text-orange-600' },
    { name: 'Native ads (Taboola, Outbrain, etc.)', icon: Globe, color: 'text-indigo-600' },
    { name: 'Influenciadores (YouTube, Twitch, Kick)', icon: Users, color: 'text-red-500' },
    { name: 'Grupos de Telegram', icon: MessageCircle, color: 'text-blue-400' },
    { name: 'Grupos de WhatsApp', icon: MessageSquare, color: 'text-green-500' },
    { name: 'Canais de Discord', icon: MessageCircle, color: 'text-indigo-500' },
    { name: 'E-mail marketing', icon: Mail, color: 'text-gray-600' },
    { name: 'Pop-unders', icon: Eye, color: 'text-yellow-600' },
    { name: 'Redirects', icon: MousePointer, color: 'text-orange-500' },
    { name: 'Cloaking', icon: Eye, color: 'text-gray-500' },
    { name: 'Fake news pages', icon: AlertTriangle, color: 'text-red-700' },
    { name: 'Retargeting (via pixel ou DSP)', icon: Target, color: 'text-purple-500' },
    { name: 'Tráfego via apps (Android .apk ou app próprio)', icon: AppWindow, color: 'text-green-600' },
    { name: 'ASO (App Store Optimization)', icon: Star, color: 'text-blue-700' },
    { name: 'Fóruns de apostas / Reddit', icon: MessageSquare, color: 'text-orange-600' },
    { name: 'Tráfego direto (digitação de URL)', icon: Globe2, color: 'text-gray-700' },
    { name: 'SMS marketing', icon: Smartphone, color: 'text-green-700' },
    { name: 'Tráfego comprado de redes (revenda de tráfego de outros afiliados)', icon: Briefcase, color: 'text-purple-700' }
  ];

  const promotionChannels = [
    'YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter/X', 'Twitch', 'Kick', 
    'Discord', 'Telegram', 'WhatsApp', 'Website/Blog', 'Podcast', 'Newsletter', 'Outros'
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

  const handlePromotionChannelChange = (channel: string, checked: boolean) => {
    const newChannels = checked 
      ? [...(filters.promotionChannels || []), channel]
      : (filters.promotionChannels || []).filter(c => c !== channel);
    
    onFiltersChange({
      ...filters,
      promotionChannels: newChannels
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
    if (filters.promotionChannels && filters.promotionChannels.length > 0) count++;
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

              {/* Promotion Channels */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Canais de Divulgação</Label>
                <div className="grid grid-cols-2 gap-2">
                  {promotionChannels.map((channel) => (
                    <div key={channel} className="flex items-center space-x-2">
                      <Checkbox
                        id={`channel-${channel}`}
                        checked={(filters.promotionChannels || []).includes(channel)}
                        onCheckedChange={(checked) => handlePromotionChannelChange(channel, checked as boolean)}
                      />
                      <Label htmlFor={`channel-${channel}`} className="text-xs">{channel}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Types - Visual */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Tipos de Tráfego</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {trafficTypes.map(({ name, icon: Icon, color }) => (
                    <div key={name} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={`traffic-${name}`}
                        checked={filters.trafficTypes.includes(name)}
                        onCheckedChange={(checked) => handleTrafficTypeChange(name, checked as boolean)}
                      />
                      <Icon className={`w-4 h-4 ${color}`} />
                      <Label htmlFor={`traffic-${name}`} className="text-xs leading-tight flex-1">{name}</Label>
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
            Limpar Filtros ({getActiveFiltersCount()})
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
