
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export interface FilterState {
  country: string;
  language: string;
  minRating: number;
}

interface FilterDrawerProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const FilterDrawer = ({ filters, onFiltersChange, onClearFilters }: FilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const countries = ['Todos', 'Brasil', 'Portugal', 'Reino Unido', 'Espanha', 'Estados Unidos'];
  const languages = ['Todos', 'Português', 'Inglês', 'Espanhol'];

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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.country) count++;
    if (filters.language) count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-brand-accent">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Country Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">País</label>
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
            <label className="text-sm font-medium mb-2 block">Idioma</label>
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
            <label className="text-sm font-medium mb-2 block">
              Rating Mínimo: {filters.minRating.toFixed(1)}
            </label>
            <Slider
              value={[filters.minRating]}
              onValueChange={handleRatingChange}
              max={5}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Clear Filters */}
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="w-full"
            disabled={activeFiltersCount === 0}
          >
            Limpar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
