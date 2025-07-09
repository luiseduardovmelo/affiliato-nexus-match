
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import ListingCard from '@/components/ListingCard';
import FilterDrawer, { FilterState } from '@/components/FilterDrawer';
import ErrorBoundary from '@/components/ErrorBoundary';
// Temporary types - will be replaced with Supabase types
type Listing = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  country: string;
  language: string;
  description: string;
  type: 'operador' | 'afiliado';
  monthlyTrafficVolume?: string;
  commissionModels?: string[];
  paymentFrequency?: string;
  acceptsRetargeting?: boolean;
  installsPostback?: boolean;
  chargedValue?: string;
  desiredCommissionMethod?: string;
  promotionChannels?: string[];
  currentOperators?: string[];
  previousOperators?: string[];
  basicInfo?: string;
  whiteLabel?: string;
  specialties: string[];
  platformType?: string;
  trafficTypes?: string[];
};

// Temporary empty arrays - will be replaced with Supabase data
const mockOperadores: Listing[] = [];
const mockAfiliados: Listing[] = [];

const Lista = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'operadores' | 'afiliados'>('operadores');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    country: '',
    language: '',
    minRating: 0,
    monthlyTrafficVolume: '',
    commissionModels: [],
    paymentFrequency: '',
    platformType: '',
    acceptsRetargeting: null,
    installsPostback: null,
    chargedValue: '',
    desiredCommissionMethod: '',
    trafficTypes: [],
    currentOperators: [],
    promotionChannels: []
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Get current data based on active tab from database
  const userRole = activeTab === 'operadores' ? 'operator' : 'affiliate';
  const { data: currentData = [], isLoading, error } = useUsers(userRole);
  
  // Get all ratings for the current users
  const { data: allRatings = new Map() } = useQuery({
    queryKey: ['allRatings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('target_id, rating');
      
      if (error) {
        console.error('Error fetching ratings:', error);
        return [];
      }
      
      // Group ratings by target_id and calculate averages
      const ratingsMap = new Map();
      data.forEach(review => {
        if (!ratingsMap.has(review.target_id)) {
          ratingsMap.set(review.target_id, []);
        }
        ratingsMap.get(review.target_id).push(review.rating);
      });
      
      // Calculate averages
      const averages = new Map();
      ratingsMap.forEach((ratings, targetId) => {
        const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        averages.set(targetId, average);
      });
      
      return averages;
    },
    enabled: currentData.length > 0,
  });
  
  // Convert database data to listing format
  const listingData = useMemo(() => {
    if (!currentData) return [];
    
    return currentData.map((item: any) => ({
      id: item.user_id,
      name: item.users?.display_name || item.users?.email || 'Usuário',
      avatar: '/placeholder.svg',
      rating: (allRatings instanceof Map) ? (allRatings.get(item.user_id) || 0) : 0,
      country: item.users?.country || 'Brasil',
      language: item.users?.language || 'Português',
      description: item.description || `${activeTab === 'operadores' ? 'Operador' : 'Afiliado'} verificado`,
      type: activeTab === 'operadores' ? 'operador' : 'afiliado',
      specialties: activeTab === 'operadores' 
        ? (Array.isArray(item.commission_models) ? item.commission_models : []).slice(0, 3)
        : (Array.isArray(item.traffic_sources) ? item.traffic_sources : []).slice(0, 3),
      // Operator specific fields
      monthlyTrafficVolume: item.monthly_volume,
      commissionModels: item.commission_models ? 
        (Array.isArray(item.commission_models) ? item.commission_models : []) : [],
      paymentFrequency: item.payment_schedule,
      acceptsRetargeting: item.accepts_retargeting,
      installsPostback: item.installs_postback,
      platformType: item.platform_type,
      whiteLabel: item.white_label,
      // Affiliate specific fields
      chargedValue: item.charged_value,
      desiredCommissionMethod: item.commission_model,
      promotionChannels: item.promotion_channels ? 
        (typeof item.promotion_channels === 'string' ? item.promotion_channels.split(',').map(ch => ch.trim()).filter(ch => ch.length > 0) : item.promotion_channels) : [],
      currentOperators: item.current_operators ? 
        (typeof item.current_operators === 'string' ? item.current_operators.split(',').map(op => op.trim()).filter(op => op.length > 0) : item.current_operators) : [],
      previousOperators: item.previous_operators ? 
        (typeof item.previous_operators === 'string' ? item.previous_operators.split(',').map(op => op.trim()).filter(op => op.length > 0) : item.previous_operators) : [],
      basicInfo: item.basic_info,
      trafficTypes: item.traffic_sources ? 
        (Array.isArray(item.traffic_sources) ? item.traffic_sources : []) : [],
    }));
  }, [currentData, activeTab, allRatings]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return listingData.filter((item: Listing) => {
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           item.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCountry = !filters.country || item.country === filters.country;
      const matchesLanguage = !filters.language || item.language === filters.language;
      const matchesRating = item.rating >= filters.minRating;

      // Filtros específicos para operadores
      if (activeTab === 'operadores') {
        const matchesCommissionModels = filters.commissionModels.length === 0 || 
          (Array.isArray(item.commissionModels) && item.commissionModels.length > 0 && 
           filters.commissionModels.some(model => {
             const normalizedModel = model.toLowerCase();
             return item.commissionModels.some(itemModel => {
               const normalizedItemModel = itemModel.toLowerCase();
               // Exact match
               if (normalizedItemModel === normalizedModel) return true;
               // Partial match
               if (normalizedItemModel.includes(normalizedModel) || normalizedModel.includes(normalizedItemModel)) return true;
               // Special cases for common variations
               if (normalizedModel === 'rev' && (normalizedItemModel.includes('revshare') || normalizedItemModel.includes('revenue'))) return true;
               if (normalizedModel === 'cpa' && normalizedItemModel.includes('cost per action')) return true;
               if (normalizedModel === 'hibrido' && (normalizedItemModel.includes('hybrid') || normalizedItemModel.includes('híbrido'))) return true;
               return false;
             });
           }));
        
        
        const matchesPaymentFreq = !filters.paymentFrequency || item.paymentFrequency === filters.paymentFrequency;
        const matchesPlatformType = !filters.platformType || item.platformType === filters.platformType;
        const matchesRetargeting = filters.acceptsRetargeting === null || item.acceptsRetargeting === filters.acceptsRetargeting;
        const matchesPostback = filters.installsPostback === null || item.installsPostback === filters.installsPostback;

        return matchesSearch && matchesCountry && matchesLanguage && matchesRating && 
               matchesCommissionModels && matchesPaymentFreq && matchesPlatformType && 
               matchesRetargeting && matchesPostback;
      }

      // Filtros específicos para afiliados
      if (activeTab === 'afiliados') {
        const matchesDesiredCommission = !filters.desiredCommissionMethod || item.desiredCommissionMethod === filters.desiredCommissionMethod;
        const matchesTrafficTypes = filters.trafficTypes.length === 0 || 
          (item.trafficTypes && filters.trafficTypes.some(type => item.trafficTypes?.includes(type)));

        return matchesSearch && matchesCountry && matchesLanguage && matchesRating && 
               matchesDesiredCommission && matchesTrafficTypes;
      }

      return matchesSearch && matchesCountry && matchesLanguage && matchesRating;
    });
  }, [listingData, debouncedSearch, filters, activeTab]);

  // Visible data with pagination
  const visibleData = filteredData.slice(0, visibleCount);
  const hasMore = visibleCount < filteredData.length;

  const handleTabChange = (value: string) => {
    if (value === 'operadores' || value === 'afiliados') {
      setActiveTab(value);
      setVisibleCount(6); // Reset pagination
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleClearFilters = () => {
    setFilters({
      country: '',
      language: '',
      minRating: 0,
      monthlyTrafficVolume: '',
      commissionModels: [],
      paymentFrequency: '',
      platformType: '',
      acceptsRetargeting: null,
      installsPostback: null,
      chargedValue: '',
      desiredCommissionMethod: '',
      trafficTypes: [],
      currentOperators: [],
      promotionChannels: []
    });
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    if (filters.country) activeFilters.push({ key: 'country', label: filters.country });
    if (filters.language) activeFilters.push({ key: 'language', label: filters.language });
    if (filters.minRating > 0) activeFilters.push({ key: 'minRating', label: `Rating ≥ ${filters.minRating.toFixed(1)}` });
    if (filters.commissionModels.length > 0) activeFilters.push({ key: 'commissionModels', label: `Comissão: ${filters.commissionModels.join(', ')}` });
    if (filters.paymentFrequency) activeFilters.push({ key: 'paymentFrequency', label: `Pagamento: ${filters.paymentFrequency}` });
    if (filters.platformType) activeFilters.push({ key: 'platformType', label: `Plataforma: ${filters.platformType}` });
    if (filters.acceptsRetargeting !== null) activeFilters.push({ key: 'acceptsRetargeting', label: `Retargeting: ${filters.acceptsRetargeting ? 'Sim' : 'Não'}` });
    if (filters.installsPostback !== null) activeFilters.push({ key: 'installsPostback', label: `Postback: ${filters.installsPostback ? 'Sim' : 'Não'}` });
    if (filters.desiredCommissionMethod) activeFilters.push({ key: 'desiredCommissionMethod', label: `Método: ${filters.desiredCommissionMethod}` });
    if (filters.trafficTypes.length > 0) activeFilters.push({ key: 'trafficTypes', label: `Tráfego: ${filters.trafficTypes.length} tipos` });
    return activeFilters;
  };

  const removeFilter = (filterKey: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: filterKey === 'minRating' ? 0 : 
                   filterKey === 'acceptsRetargeting' || filterKey === 'installsPostback' ? null :
                   filterKey === 'commissionModels' || filterKey === 'trafficTypes' || filterKey === 'currentOperators' ? [] :
                   ''
    }));
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand-primary mb-4">
            Explore Parceiros
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra operadores e afiliados verificados prontos para estabelecer parcerias estratégicas
          </p>
        </div>

        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Toggle Group */}
            <ToggleGroup 
              type="single" 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="bg-gray-100 rounded-lg p-1"
            >
              <ToggleGroupItem 
                value="operadores" 
                className="data-[state=on]:bg-brand-primary data-[state=on]:text-white"
              >
                Operadores
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="afiliados"
                className="data-[state=on]:bg-brand-primary data-[state=on]:text-white"
              >
                Afiliados
              </ToggleGroupItem>
            </ToggleGroup>

            {/* Search and Filter */}
            <div className="flex gap-2 flex-1 sm:w-auto sm:max-w-96">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="shrink-0 relative px-4 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {activeFilters.length > 0 && (
                  <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-brand-accent text-white flex items-center justify-center">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="pl-3 pr-1 py-1 bg-brand-accent/10 text-brand-accent border-brand-accent/20"
              >
                {filter.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-brand-accent/20"
                  onClick={() => removeFilter(filter.key)}
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {isLoading ? 'Carregando...' : `${filteredData.length} ${activeTab} encontrados`}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">
              Erro ao carregar dados: {error.message}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        )}

        {/* Listings Grid */}
        {!isLoading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleData.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Nenhum resultado encontrado
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Load More */}
        {!isLoading && !error && hasMore && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoadMore}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              Carregar Mais
            </Button>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        activeTab={activeTab}
      />
    </div>
  );
};

export default Lista;
