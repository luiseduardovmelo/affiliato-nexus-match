
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDraggablePosition } from '@/hooks/useDraggablePosition';

interface FloatingFilterButtonProps {
  activeFiltersCount: number;
  isDrawerOpen: boolean;
  onClick: () => void;
}

const FloatingFilterButton = ({ activeFiltersCount, isDrawerOpen, onClick }: FloatingFilterButtonProps) => {
  // Default position: bottom-right corner
  const defaultPosition = {
    x: typeof window !== 'undefined' ? window.innerWidth - 72 : 300, // 56px button + 16px margin
    y: typeof window !== 'undefined' ? window.innerHeight - 72 : 500
  };

  const { position, isDragging, handleMouseDown, handleTouchStart } = useDraggablePosition(
    'filter-button',
    defaultPosition
  );

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger onClick if we're not dragging
    if (!isDragging) {
      onClick();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          className={`
            fixed w-14 h-14 rounded-full bg-brand-accent hover:bg-brand-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-move z-50
            ${isDrawerOpen ? 'opacity-40' : 'opacity-100'}
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
        >
          <Filter className="h-6 w-6" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-brand-success border-2 border-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Filtros</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default FloatingFilterButton;
