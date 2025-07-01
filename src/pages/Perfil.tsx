
import ProfileHero from '@/components/ProfileHero';
import ProfileCardLeft from '@/components/ProfileCardLeft';
import AboutCard from '@/components/AboutCard';
import ActivityTimeline from '@/components/ActivityTimeline';
import ProfileEditForm from '@/components/ProfileEditForm';
import { useProfileData, useKPIData, useActivities } from '@/hooks/useProfileData';
import { useState } from 'react';

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    profile,
    loading: profileLoading
  } = useProfileData();
  const {
    kpis,
    loading: kpisLoading
  } = useKPIData();
  const {
    activities,
    loading: activitiesLoading
  } = useActivities();

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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-2xl font-bold text-brand-primary mb-6">Editar Meu Perfil</h1>
          
          <ProfileEditForm
            profileType="operador" // ou "afiliado" baseado no usuário logado
            initialData={profile}
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
          profile={profile || {
            name: '',
            type: '',
            isVerified: false,
            avatar: ''
          }} 
          kpis={kpis} 
          loading={profileLoading || kpisLoading}
          onEdit={handleEditProfile}
        />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          {/* Left Column */}
          <ProfileCardLeft profile={profile || {
            specialties: [],
            location: ''
          }} loading={profileLoading} />

          {/* Right Column */}
          <div className="space-y-6">
            <AboutCard description={profile?.description || ''} loading={profileLoading} />
            
            <ActivityTimeline activities={activities} loading={activitiesLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
