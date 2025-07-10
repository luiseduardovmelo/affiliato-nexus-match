
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCredits } from './useCredits';
import { canRevealContact, type UserRole } from '@/utils/accessControl';

export const useRevealContact = (
  profileId: string, 
  currentUserId: string,
  currentUserRole?: UserRole,
  targetUserRole?: UserRole
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingReveal, setIsLoadingReveal] = useState(false);
  const [revealError, setRevealError] = useState<string | null>(null);
  const { credits, refreshCredits } = useCredits(currentUserId);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setRevealError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRevealError(null);
  };

  const handleRevealContact = async () => {
    if (!currentUserId || !profileId) {
      setRevealError('User not authenticated');
      return;
    }

    // Check role-based access control
    const accessCheck = canRevealContact(currentUserRole, targetUserRole, currentUserId, profileId);
    if (!accessCheck.allowed) {
      setRevealError(accessCheck.reason || 'Access denied');
      return;
    }

    if (credits < 1) {
      setRevealError('Insufficient credits');
      return;
    }

    setIsLoadingReveal(true);
    setRevealError(null);

    try {
      // Check if already revealed
      const { data: existingReveal } = await supabase
        .from('reveal_logs')
        .select('id')
        .eq('revealer_id', currentUserId)
        .eq('target_id', profileId)
        .maybeSingle();

      if (existingReveal) {
        setRevealError('Contact already revealed');
        setIsLoadingReveal(false);
        return;
      }

      // Create reveal log
      const { error: revealError } = await supabase
        .from('reveal_logs')
        .insert({
          revealer_id: currentUserId,
          target_id: profileId,
          cost_credits: 1
        });

      if (revealError) throw revealError;

      // Deduct credits
      const { error: creditError } = await supabase
        .from('credits')
        .insert({
          user_id: currentUserId,
          type: 'reveal',
          delta: -1,
          balance_after: credits - 1,
          description: `Contact reveal for user ${profileId}`
        });

      if (creditError) throw creditError;

      // Refresh credits
      await refreshCredits();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error revealing contact:', error);
      setRevealError('Failed to reveal contact');
    } finally {
      setIsLoadingReveal(false);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleRevealContact,
    isLoadingReveal,
    revealError,
    credits: credits || 0
  };
};
