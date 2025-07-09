
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserById } from '@/hooks/useUsers';
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
import ProfileHeader from '@/components/ProfileHeader';
import AboutSection from '@/components/AboutSection';
import ProfileDetailSection from '@/components/ProfileDetailSection';
import ContactCard from '@/components/ContactCard';
import ProfileEditForm from '@/components/ProfileEditForm';
import RatingSystem from '@/components/RatingSystem';
import { Button } from '@/components/ui/button';
import { useRevealState } from '@/hooks/useRevealState';
import { useReviewStats } from '@/hooks/useReviews';
import { useState } from 'react';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { data: reviewStats } = useReviewStats(id || '');
  
  // Determine if this is the user's own profile
  const isOwnProfile = user?.id === id;
  
  // Try to get user data from database
  const { data: operatorData, isLoading: isLoadingOperator } = useUserById(id || '', 'operator');
  const { data: affiliateData, isLoading: isLoadingAffiliate } = useUserById(id || '', 'affiliate');
  
  const isLoading = isLoadingOperator || isLoadingAffiliate;
  const userData = operatorData || affiliateData;
  
  // Use reveal state with proper user data
  const { hasRevealed, revealContact, isRevealing } = useRevealState(
    id || '', 
    userData?.users?.display_name || userData?.users?.email || 'Usuário'
  );
  
  // If no data found in database, fall back to mock data temporarily
  const allListings = [...mockOperadores, ...mockAfiliados];
  const mockProfile = allListings.find(listing => listing.id === id);
  
  const profile = userData ? {
    id: userData.user_id,
    name: userData.users?.display_name || userData.users?.email || 'Usuário',
    avatar: '/placeholder.svg',
    rating: reviewStats?.averageRating || 0,
    country: userData.users?.country || 'Brasil',
    language: userData.users?.language || 'Português',
    description: userData.description || `${operatorData ? 'Operador' : 'Afiliado'} verificado`,
    type: operatorData ? 'operador' : 'afiliado',
    specialties: operatorData 
      ? (Array.isArray(operatorData.commission_models) ? operatorData.commission_models : []).slice(0, 3)
      : (Array.isArray(affiliateData?.traffic_sources) ? affiliateData.traffic_sources : []).slice(0, 3),
    // Operator specific fields
    monthlyTrafficVolume: operatorData?.monthly_volume,
    commissionModels: Array.isArray(operatorData?.commission_models) ? operatorData.commission_models : [],
    paymentFrequency: operatorData?.payment_schedule,
    acceptsRetargeting: operatorData?.accepts_retargeting,
    installsPostback: operatorData?.installs_postback,
    platformType: operatorData?.platform_type,
    whiteLabel: operatorData?.white_label,
    // Affiliate specific fields
    chargedValue: affiliateData?.charged_value,
    desiredCommissionMethod: affiliateData?.commission_model,
    trafficTypes: Array.isArray(affiliateData?.traffic_sources) ? affiliateData.traffic_sources : [],
    basicInfo: affiliateData?.basic_info,
    currentOperators: affiliateData?.current_operators ? 
      (typeof affiliateData.current_operators === 'string' ? affiliateData.current_operators.split(',').map(op => op.trim()).filter(op => op.length > 0) : affiliateData.current_operators) : [],
    previousOperators: affiliateData?.previous_operators ? 
      (typeof affiliateData.previous_operators === 'string' ? affiliateData.previous_operators.split(',').map(op => op.trim()).filter(op => op.length > 0) : affiliateData.previous_operators) : [],
  } : mockProfile;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-brand-primary">Perfil não encontrado</h1>
        <p className="text-gray-600 mt-2">
          {isOwnProfile ? 'Complete seu cadastro para ver seu perfil' : 'Este usuário não foi encontrado'}
        </p>
      </div>
    );
  }

  // Dados reais do perfil do usuário
  const profileData = {
    ...profile,
    payout: profile.type === 'operador' ? 'RevShare 35%' : 'CPA $150',
    traffic: profile.type === 'afiliado' ? '50k visitas/mês' : undefined,
    languages: [profile.language],
    contact: {
      email: userData?.users?.email || 'email@nao-disponivel.com',
      whatsapp: userData?.users?.phone || 'Não informado', 
      telefone: userData?.users?.phone || 'Não informado',
      telegram: userData?.users?.telegram || 'Não informado'
    }
  };

  const handleGoBack = () => {
    navigate('/lista');
  };

  const handleRevealContact = () => {
    revealContact();
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (data: any) => {
    console.log('Saving profile data:', data);
    // Aqui você salvaria os dados do perfil
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            onClick={handleCancelEdit}
            className="mb-6 flex items-center gap-2 text-brand-primary hover:text-brand-accent"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <h1 className="text-2xl font-bold text-brand-primary mb-6">Editar Perfil</h1>
          
          <ProfileEditForm
            profileType={profileData.type}
            initialData={profileData}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Botão Voltar */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-brand-primary hover:text-brand-accent"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          {/* Botão de Editar - apenas se for o próprio perfil */}
          {isOwnProfile && (
            <Button
              variant="outline"
              onClick={handleEditProfile}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar Perfil
            </Button>
          )}
        </div>

        {/* Header do Perfil */}
        <ProfileHeader 
          profile={profileData} 
          hasRevealed={hasRevealed}
          onRevealContact={handleRevealContact}
          isRevealing={isRevealing}
        />
        
        {/* Contact Card (se revelado) */}
        {hasRevealed && (
          <ContactCard contact={profileData.contact} />
        )}
        
        {/* Sistema de Avaliação */}
        <RatingSystem 
          profileId={profile.id}
        />

        {/* Seção de Detalhes */}
        <div className="mt-8">
          <ProfileDetailSection profile={profileData} hasRevealed={hasRevealed} />
        </div>

        {/* Seção Sobre (sempre aberta) */}
        <div className="mt-8">
          <AboutSection profile={profileData} />
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
