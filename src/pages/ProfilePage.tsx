
import React from 'react';
import { useParams } from 'react-router-dom';
import ProfileHero from '@/components/ProfileHero';
import ProfileDetailsCard from '@/components/ProfileDetailsCard';
import ContactCard from '@/components/ContactCard';
import ActivityTimeline from '@/components/ActivityTimeline';
import AboutCard from '@/components/AboutCard';
import RevealModal from '@/components/RevealModal';
import { useUserById } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRevealContact } from '@/hooks/useRevealContact';
import { isOperatorProfile, isAffiliateProfile, type UserProfile, type OperatorProfile, type AffiliateProfile } from '@/types/profile';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useCurrentUser();
  
  const {
    isModalOpen,
    setIsModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleRevealContact,
    isLoadingReveal,
    revealError,
    credits,
  } = useRevealContact(id || '', currentUser?.id || '');

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
    if (!data || !data.users || data.users.role !== 'operador') return undefined;
    return data.operator_specs?.[key];
  };

  // Type-safe property access for affiliate data  
  const getAffiliateProperty = <K extends keyof AffiliateProfile['affiliate_specs']>(
    data: any,
    key: K
  ): AffiliateProfile['affiliate_specs'][K] | undefined => {
    if (!data || !data.users || data.users.role !== 'afiliado') return undefined;
    return data.affiliate_specs?.[key];
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
    isVerified: userData.users.status === 'active',
    specialties: operatorData 
      ? (getOperatorProperty(operatorData, 'commission_models') || []).slice(0, 3)
      : (getAffiliateProperty(affiliateData, 'traffic_sources') || []).slice(0, 3),
    // Contact info
    email: userData.users.email,
    phone: userData.users.phone,
    telegram: userData.users.telegram,
    language: userData.users.language,
    memberSince: userData.users.created_at,
    // Operator specific fields - using type-safe getters
    monthlyVolume: getOperatorProperty(operatorData, 'monthly_volume'),
    commissionModels: getOperatorProperty(operatorData, 'commission_models') || [],
    paymentSchedule: getOperatorProperty(operatorData, 'payment_schedule'),
    acceptsRetargeting: getOperatorProperty(operatorData, 'accepts_retargeting'),
    installsPostback: getOperatorProperty(operatorData, 'installs_postback'),
    platformType: getOperatorProperty(operatorData, 'platform_type'),
    whiteLabel: getOperatorProperty(operatorData, 'white_label'),
    acceptedCountries: getOperatorProperty(operatorData, 'accepted_countries') || [],
    // Affiliate specific fields - using type-safe getters
    chargedValue: getAffiliateProperty(affiliateData, 'charged_value'),
    commissionModel: getAffiliateProperty(affiliateData, 'commission_model'),
    trafficSources: getAffiliateProperty(affiliateData, 'traffic_sources') || [],
    basicInfo: getAffiliateProperty(affiliateData, 'basic_info'),
    workLanguages: getAffiliateProperty(affiliateData, 'work_languages') || [],
    currentOperators: (() => {
      const current = getAffiliateProperty(affiliateData, 'current_operators');
      if (!current) return '';
      return typeof current === 'string' 
        ? current
        : Array.isArray(current) ? current.join(', ') : '';
    })(),
    previousOperators: (() => {
      const previous = getAffiliateProperty(affiliateData, 'previous_operators');
      if (!previous) return '';
      return typeof previous === 'string'
        ? previous
        : Array.isArray(previous) ? previous.join(', ') : '';
    })(),
  } : null;

  // Mock KPI data - in a real app this would come from the API
  const kpis = [
    { label: 'Rating', value: profile?.rating?.toFixed(1) || '0.0', color: '#10b981' },
    { label: 'Reviews', value: profile?.totalReviews?.toString() || '0', color: '#3b82f6' },
    { label: 'Active', value: profile?.isVerified ? 'Yes' : 'No', color: profile?.isVerified ? '#10b981' : '#ef4444' },
  ];

  // Mock activity data
  const activities = [
    { id: '1', title: 'Profile Updated', description: 'Updated profile information', timestamp: '2 hours ago', color: '#10b981' },
    { id: '2', title: 'New Review', description: 'Received a 5-star review', timestamp: '1 day ago', color: '#3b82f6' },
    { id: '3', title: 'Contact Revealed', description: 'Contact information was accessed', timestamp: '3 days ago', color: '#f59e0b' },
  ];
  
  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (operatorError || affiliateError) {
    return <div>Error loading profile.</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  // Mock contact data - in a real app this would come from the revealed contact info
  const contactData = {
    email: userData?.users?.email || 'contact@example.com',
    telegram: userData?.users?.telegram || '@username',
    whatsapp: userData?.users?.phone || '+55 11 99999-9999',
    telefone: userData?.users?.phone || '+55 11 99999-9999'
  };

  return (
    <div className="profile-page">
      <ProfileHero
        profile={profile}
        kpis={kpis}
        loading={false}
      />

      <div className="container mx-auto mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProfileDetailsCard profile={profile} loading={false} />
          <AboutCard description={profile.description} loading={false} />
          <ActivityTimeline activities={activities} loading={false} />
        </div>

        <div>
          <ContactCard contact={contactData} />
        </div>
      </div>

      <RevealModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleRevealContact}
        contact={contactData}
      />
    </div>
  );
};

export default ProfilePage;
