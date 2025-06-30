
import { useState, useEffect, useCallback } from 'react';

export interface Position {
  x: number;
  y: number;
}

export const useDraggablePosition = (key: string, defaultPosition: Position) => {
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; startX: number; startY: number } | null>(null);

  // Load position from localStorage on mount (desktop only)
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
      const saved = localStorage.getItem(`draggable-${key}`);
      if (saved) {
        try {
          const parsedPosition = JSON.parse(saved);
          setPosition(parsedPosition);
        } catch (e) {
          console.error('Failed to parse saved position:', e);
        }
      }
    }
  }, [key]);

  // Save position to localStorage (desktop only)
  const savePosition = useCallback((newPosition: Position) => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
      localStorage.setItem(`draggable-${key}`, JSON.stringify(newPosition));
    }
  }, [key]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      startX: position.x,
      startY: position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newPosition = {
      x: dragStart.startX + deltaX,
      y: dragStart.startY + deltaY
    };

    // Constrain to viewport
    const buttonSize = 56;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    newPosition.x = Math.max(8, Math.min(viewportWidth - buttonSize - 8, newPosition.x));
    newPosition.y = Math.max(8, Math.min(viewportHeight - buttonSize - 8, newPosition.y));

    setPosition(newPosition);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setDragStart(null);
    
    // Save final position
    savePosition(position);
  }, [isDragging, position, savePosition]);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
      startX: position.x,
      startY: position.y
    });
  }, [position]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !dragStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    
    const newPosition = {
      x: dragStart.startX + deltaX,
      y: dragStart.startY + deltaY
    };

    // Constrain to viewport
    const buttonSize = 56;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    newPosition.x = Math.max(8, Math.min(viewportWidth - buttonSize - 8, newPosition.x));
    newPosition.y = Math.max(8, Math.min(viewportHeight - buttonSize - 8, newPosition.y));

    setPosition(newPosition);
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setDragStart(null);
    
    // Don't save position on mobile
  }, [isDragging]);

  // Attach global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart
  };
};
