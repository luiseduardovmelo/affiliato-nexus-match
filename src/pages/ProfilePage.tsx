import React from 'react';
import { useParams } from 'react-router-dom';
import { ProfileHero } from '@/components/ProfileHero';
import { ProfileDetailsCard } from '@/components/ProfileDetailsCard';
import { ContactCard } from '@/components/ContactCard';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { AboutCard } from '@/components/AboutCard';
import { RevealModal } from '@/components/RevealModal';
import { useUserById } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRevealState } from '@/hooks/useRevealState';
import type { UserProfile, OperatorProfile, AffiliateProfile, isOperatorProfile, isAffiliateProfile } from '@/types/profile';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useCurrentUser();
  
  const {
    isModalOpen,
    setIsModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleRevealContact,
    isLoadingReveal,
    revealError,
    credits,
  } = useRevealState(id || '', currentUser?.id || '');

  // Try to fetch as operator first, then as affiliate
  const { data: operatorData, isLoading: operatorLoading, error: operatorError } = useUserById(id || '', 'operator');
  const { data: affiliateData, isLoading: affiliateLoading, error: affiliateError } = useUserById(id || '', 'affiliate');
  
  const isLoading = operatorLoading || affiliateLoading;
  const userData = operatorData || affiliateData;

  // Type-safe property access for operator data
  const getOperatorProperty = <K extends keyof OperatorProfile['operator_specs']>(
    data: any, 
    key: K
  ): OperatorProfile['operator_specs'][K] | undefined => {
    if (!data || !isOperatorProfile(data as UserProfile)) return undefined;
    return (data as OperatorProfile).operator_specs?.[key];
  };

  // Type-safe property access for affiliate data  
  const getAffiliateProperty = <K extends keyof AffiliateProfile['affiliate_specs']>(
    data: any,
    key: K
  ): AffiliateProfile['affiliate_specs'][K] | undefined => {
    if (!data || !isAffiliateProfile(data as UserProfile)) return undefined;
    return (data as AffiliateProfile).affiliate_specs?.[key];
  };

  const profile = userData ? {
    id: userData.users.id,
    name: userData.users.display_name,
    avatar: userData.users.logo_url || "/placeholder.svg",
    rating: userData.users.rating_cached || 0,
    totalReviews: userData.users.total_reviews || 0,
    country: userData.users.country,
    description: userData.users.description || `${operatorData ? 'Operador' : 'Afiliado'} verificado`,
    type: operatorData ? 'operador' : 'afiliado',
    specialties: operatorData 
      ? (getOperatorProperty(operatorData, 'commission_models') || []).slice(0, 3)
      : (getAffiliateProperty(affiliateData, 'traffic_sources') || []).slice(0, 3),
    // Operator specific fields - using type-safe getters
    monthlyTrafficVolume: getOperatorProperty(operatorData, 'monthly_volume'),
    commissionModels: getOperatorProperty(operatorData, 'commission_models') || [],
    paymentFrequency: getOperatorProperty(operatorData, 'payment_schedule'),
    acceptsRetargeting: getOperatorProperty(operatorData, 'accepts_retargeting'),
    installsPostback: getOperatorProperty(operatorData, 'installs_postback'),
    platformType: getOperatorProperty(operatorData, 'platform_type'),
    whiteLabel: getOperatorProperty(operatorData, 'white_label'),
    // Affiliate specific fields - using type-safe getters
    chargedValue: getAffiliateProperty(affiliateData, 'charged_value'),
    desiredCommissionMethod: getAffiliateProperty(affiliateData, 'commission_model'),
    trafficTypes: getAffiliateProperty(affiliateData, 'traffic_sources') || [],
    basicInfo: getAffiliateProperty(affiliateData, 'basic_info'),
    currentOperators: (() => {
      const current = getAffiliateProperty(affiliateData, 'current_operators');
      if (!current) return [];
      return typeof current === 'string' 
        ? current.split(',').map(op => op.trim()).filter(op => op.length > 0)
        : Array.isArray(current) ? current : [];
    })(),
    previousOperators: (() => {
      const previous = getAffiliateProperty(affiliateData, 'previous_operators');
      if (!previous) return [];
      return typeof previous === 'string'
        ? previous.split(',').map(op => op.trim()).filter(op => op.length > 0)
        : Array.isArray(previous) ? previous : [];
    })(),
  } : null;
  
  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (operatorError || affiliateError) {
    return <div>Error loading profile.</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="profile-page">
      <ProfileHero
        name={profile.name}
        avatar={profile.avatar}
        rating={profile.rating}
        totalReviews={profile.totalReviews}
        country={profile.country}
        description={profile.description}
        type={profile.type}
        specialties={profile.specialties}
      />

      <div className="container mx-auto mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProfileDetailsCard profile={profile} />
          <AboutCard description={profile.description} />
          <ActivityTimeline />
        </div>

        <div>
          <ContactCard
            userId={profile.id}
            credits={credits}
            onRevealContact={handleOpenModal}
          />
        </div>
      </div>

      <RevealModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReveal={handleRevealContact}
        isLoading={isLoadingReveal}
        error={revealError}
        credits={credits}
      />
    </div>
  );
};

export default ProfilePage;
