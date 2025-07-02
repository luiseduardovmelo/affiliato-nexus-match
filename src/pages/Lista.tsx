
import { useState, useEffect, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import ListingCard from '@/components/ListingCard';
import FilterDrawer, { FilterState } from '@/components/FilterDrawer';
import { mockOperadores, mockAfiliados, Listing } from '@/data/mockListings';

const Lista = () => {
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

  // Get current data based on active tab
  const currentData = activeTab === 'operadores' ? mockOperadores : mockAfiliados;

  // Filter and search data
  const filteredData = useMemo(() => {
    return currentData.filter((item: Listing) => {
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           item.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCountry = !filters.country || item.country === filters.country;
      const matchesLanguage = !filters.language || item.language === filters.language;
      const matchesRating = item.rating >= filters.minRating;

      // Filtros específicos para operadores
      if (activeTab === 'operadores') {
        const matchesCommissionModels = filters.commissionModels.length === 0 || 
          (item.commissionModels && filters.commissionModels.some(model => item.commissionModels?.includes(model)));
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
  }, [currentData, debouncedSearch, filters, activeTab]);

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
                className="shrink-0 relative px-4"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFilters.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-brand-accent text-white">
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
          {filteredData.length} {activeTab} encontrados
        </div>

        {/* Listings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleData.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
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
        {hasMore && (
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
