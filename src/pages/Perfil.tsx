
import ProfileHero from '@/components/ProfileHero';
import ProfileCardLeft from '@/components/ProfileCardLeft';
import AboutCard from '@/components/AboutCard';
import ActivityTimeline from '@/components/ActivityTimeline';
import FloatingActionBar from '@/components/FloatingActionBar';
import { useProfileData, useKPIData, useActivities } from '@/hooks/useProfileData';

const Perfil = () => {
  const { profile, loading: profileLoading } = useProfileData();
  const { kpis, loading: kpisLoading } = useKPIData();
  const { activities, loading: activitiesLoading } = useActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-primary mb-4">
            Meu Perfil
          </h1>
          <p className="text-gray-600">
            Gerencie suas informações e conecte-se com parceiros ideais
          </p>
        </div>

        {/* Hero Section */}
        <ProfileHero 
          profile={profile || { name: '', type: '', isVerified: false, avatar: '' }}
          kpis={kpis}
          loading={profileLoading || kpisLoading}
        />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          {/* Left Column */}
          <ProfileCardLeft 
            profile={profile || { specialties: [], location: '' }}
            loading={profileLoading}
          />

          {/* Right Column */}
          <div className="space-y-6">
            <AboutCard 
              description={profile?.description || ''}
              loading={profileLoading}
            />
            
            <ActivityTimeline 
              activities={activities}
              loading={activitiesLoading}
            />
          </div>
        </div>

        {/* Floating Action Bar */}
        <FloatingActionBar />
      </div>
    </div>
  );
};

export default Perfil;
