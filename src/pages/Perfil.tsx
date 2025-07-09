
import ProfileHero from '@/components/ProfileHero';
import ProfileCardLeft from '@/components/ProfileCardLeft';
import ProfileDetailsCard from '@/components/ProfileDetailsCard';
import ActivityTimeline from '@/components/ActivityTimeline';
import ProfileEditForm from '@/components/ProfileEditForm';
import ErrorBoundary from '@/components/ErrorBoundary';
import CreditBalance from '@/components/CreditBalance';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { createUserProfile } from '@/hooks/useRegistration';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const PerfilContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Para forçar re-render
  const { currentUser, isLoading, isAuthenticated, hasProfile } = useCurrentUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  console.log('🏠 Perfil render with refreshKey:', refreshKey);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-brand-primary mb-2">Faça login para ver seu perfil</h1>
        <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página</p>
        <Button onClick={() => navigate('/home')}>
          Fazer Login
        </Button>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-brand-primary mb-2">Complete seu perfil</h1>
        <p className="text-gray-600 mb-4">Você precisa completar seu cadastro para ver seu perfil</p>
        <Button onClick={() => navigate('/registration')}>
          Completar Cadastro
        </Button>
      </div>
    );
  }

  console.log('🔍 Current user data for profile:', {
    currentUser,
    hasProfile,
    isOperator: currentUser?.isOperator,
    isAffiliate: currentUser?.isAffiliate,
    specificData: currentUser?.specificData,
    profile: currentUser?.profile
  });

  const profile = {
    name: currentUser?.displayName || 'Usuário',
    type: currentUser?.isOperator ? 'Operador' : 'Afiliado',
    isVerified: true,
    avatar: '/placeholder.svg',
    specialties: currentUser?.isOperator 
      ? (currentUser?.specificData?.commission_models || []).slice(0, 5)
      : (currentUser?.specificData?.traffic_sources || []).slice(0, 5),
    location: `${currentUser?.country || 'Brasil'}`,
    description: currentUser?.specificData?.description || 'Nenhuma descrição adicionada.',
    // Informações adicionais para mostrar mais detalhes
    email: currentUser?.email,
    phone: currentUser?.profile?.users?.phone,
    telegram: currentUser?.profile?.users?.telegram,
    language: currentUser?.profile?.users?.language,
    role: currentUser?.role,
    memberSince: currentUser?.profile?.users?.created_at,
    // Dados específicos baseados no tipo
    ...(currentUser?.isOperator ? {
      monthlyVolume: currentUser?.specificData?.monthly_volume || 'Não informado',
      paymentSchedule: currentUser?.specificData?.payment_schedule || 'Não informado',
      acceptedCountries: currentUser?.specificData?.accepted_countries || [],
      platformType: currentUser?.specificData?.platform_type || 'Não informado',
      acceptsRetargeting: currentUser?.specificData?.accepts_retargeting || false,
      installsPostback: currentUser?.specificData?.installs_postback || false,
      whiteLabel: currentUser?.specificData?.white_label || 'Não informado'
    } : {
      commissionModel: currentUser?.specificData?.commission_model || 'Não informado',
      workLanguages: currentUser?.specificData?.work_languages || [],
      chargedValue: currentUser?.specificData?.charged_value || 'Não informado',
      basicInfo: currentUser?.specificData?.basic_info || 'Não informado',
      currentOperators: currentUser?.specificData?.current_operators || 'Nenhum',
      previousOperators: currentUser?.specificData?.previous_operators || 'Nenhum'
    })
  };

  console.log('📋 Profile object built:', profile);

  const kpis = [
    { label: "Conexões Ativas", value: "0", color: "#3ECD6D" },
    { label: "Projetos Ativos", value: "0", color: "#1F7AFF" },
    { label: "Taxa de Sucesso", value: "0%", color: "#F9C846" }
  ];

  const activities = [];

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (data: any) => {
    if (!currentUser?.id) {
      console.error('❌ No current user ID found');
      return;
    }
    
    setIsSaving(true);
    try {
      console.log('💾 Starting profile save process...');
      console.log('📋 Form data received:', data);
      console.log('👤 Current user:', currentUser);
      console.log('🔍 Language from form:', data.language);
      console.log('🔍 Telegram from form:', data.contact?.telegram);
      
      // Determinar o tipo de usuário baseado no perfil atual
      const userType = currentUser.isOperator ? 'operador' : 'afiliado';
      console.log('🏷️ User type determined:', userType);
      
      // Preparar dados básicos do usuário
      const basicData = {
        displayName: data.name || currentUser.displayName,
        country: data.country || data.location || currentUser.country,
        phone: data.contact?.telefone || data.contact?.whatsapp || data.phone || currentUser.profile?.users?.phone || '',
        language: data.language && ['Português', 'Inglês', 'Espanhol'].includes(data.language) 
          ? data.language 
          : 'Português',
        telegram: data.contact?.telegram || '',
        description: data.description || '',
      };
      console.log('📝 Basic data prepared:', basicData);
      console.log('🔍 Language in basicData:', basicData.language);
      console.log('🔍 Telegram in basicData:', basicData.telegram);
      
      // Preparar dados específicos baseado no tipo
      const specificData = userType === 'operador' ? {
        description: data.description || '',
        monthlyVolume: data.monthlyTrafficVolume || data.monthlyVolume || '',
        commissionModels: data.commissionModels || [],
        paymentSchedule: data.paymentFrequency || data.paymentSchedule || 'mensal',
        acceptedCountries: data.acceptedCountries || [],
        platformType: data.platformType || '',
        acceptsRetargeting: data.acceptsRetargeting || false,
        installsPostback: data.installsPostback || false,
        whiteLabel: data.whiteLabel || '',
      } : {
        description: data.description || '',
        trafficSources: data.trafficTypes || data.trafficSources || [],
        commissionModel: data.desiredCommissionMethod || data.commissionModel || 'CPA',
        workLanguages: data.workLanguages || [],
        chargedValue: data.chargedValue || '',
        basicInfo: data.basicInfo || '',
        currentOperators: typeof data.currentOperators === 'string' ? data.currentOperators : (data.currentOperators || []).join(', '),
        previousOperators: typeof data.previousOperators === 'string' ? data.previousOperators : (data.previousOperators || []).join(', '),
      };
      console.log('🎯 Specific data prepared:', specificData);
      
      // Salvar usando a função do hook de registro
      console.log('💿 Calling createUserProfile...');
      const result = await createUserProfile(
        currentUser.id,
        userType as any,
        basicData,
        specificData
      );
      
      console.log('📊 Save result:', result);
      
      if (result.success) {
        console.log('✅ Profile saved successfully');
        
        // Invalidar cache do React Query para forçar refetch dos dados
        console.log('🔄 Invalidating React Query cache...');
        
        // Invalidar todas as queries relacionadas ao usuário
        await queryClient.invalidateQueries({ queryKey: ['user', currentUser.id, 'operator'] });
        await queryClient.invalidateQueries({ queryKey: ['user', currentUser.id, 'affiliate'] });
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        
        // Aguardar um momento para garantir que o cache foi limpo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Forçar refetch dos dados atualizados
        await queryClient.refetchQueries({ queryKey: ['user', currentUser.id, 'operator'] });
        await queryClient.refetchQueries({ queryKey: ['user', currentUser.id, 'affiliate'] });
        
        // Forçar re-render do componente
        setRefreshKey(prev => prev + 1);
        
        console.log('✨ Profile data cache invalidated and refetched');
        
        // Só agora sair do modo de edição e mostrar sucesso
        setIsEditing(false);
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso.",
        });
      } else {
        console.error('❌ Save failed:', result.error);
        throw new Error(result.error || 'Falha ao salvar perfil');
      }
    } catch (error) {
      console.error('❌ Error in handleSaveProfile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-0">
          <h1 className="text-2xl font-bold text-brand-primary mb-6">Editar Meu Perfil</h1>
          
          <ProfileEditForm
            profileType={currentUser?.isOperator ? 'operador' : 'afiliado'}
            isSaving={isSaving}
            initialData={{
              // Dados básicos
              name: currentUser?.displayName || '',
              email: currentUser?.email || '',
              phone: currentUser?.profile?.users?.phone || '',
              country: currentUser?.country || '',
              language: currentUser?.profile?.users?.language || 'Português',
              description: currentUser?.specificData?.description || '',
              
              // Dados de contato
              contact: {
                email: currentUser?.email || '',
                whatsapp: currentUser?.profile?.users?.phone || '',
                telefone: currentUser?.profile?.users?.phone || '',
                telegram: currentUser?.profile?.users?.telegram || ''
              },
              
              // Dados específicos do afiliado
              ...(currentUser?.isAffiliate ? {
                trafficTypes: currentUser?.specificData?.traffic_sources || [],
                desiredCommissionMethod: currentUser?.specificData?.commission_model || 'CPA',
                workLanguages: currentUser?.specificData?.work_languages || [],
                chargedValue: currentUser?.specificData?.charged_value || '',
                basicInfo: currentUser?.specificData?.basic_info || '',
                currentOperators: currentUser?.specificData?.current_operators || '',
                previousOperators: currentUser?.specificData?.previous_operators || '',
              } : {}),
              
              // Dados específicos do operador
              ...(currentUser?.isOperator ? {
                monthlyTrafficVolume: currentUser?.specificData?.monthly_volume || '',
                commissionModels: currentUser?.specificData?.commission_models || [],
                paymentFrequency: currentUser?.specificData?.payment_schedule || 'mensal',
                acceptedCountries: currentUser?.specificData?.accepted_countries || [],
                platformType: currentUser?.specificData?.platform_type || '',
                acceptsRetargeting: currentUser?.specificData?.accepts_retargeting || false,
                installsPostback: currentUser?.specificData?.installs_postback || false,
                whiteLabel: currentUser?.specificData?.white_label || '',
              } : {}),
            }}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          
        </div>

        {/* Hero Section */}
        <ProfileHero 
          profile={profile} 
          kpis={kpis} 
          loading={false}
          onEdit={handleEditProfile}
        />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ProfileCardLeft profile={profile} loading={false} />
            <CreditBalance />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProfileDetailsCard profile={profile} loading={false} />
            
            <ActivityTimeline activities={activities} loading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Perfil = () => {
  return (
    <ErrorBoundary>
      <PerfilContent />
    </ErrorBoundary>
  );
};

export default Perfil;
