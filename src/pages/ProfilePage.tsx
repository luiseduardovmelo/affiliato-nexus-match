
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { mockOperadores, mockAfiliados } from '@/data/mockListings';
import ProfileHeader from '@/components/ProfileHeader';
import BadgeList from '@/components/BadgeList';
import AboutSection from '@/components/AboutSection';
import ProfileDetailSection from '@/components/ProfileDetailSection';
import ContactCard from '@/components/ContactCard';
import RevealModal from '@/components/RevealModal';
import ProfileEditForm from '@/components/ProfileEditForm';
import { Button } from '@/components/ui/button';
import { useRevealState } from '@/hooks/useRevealState';
import { useState } from 'react';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { hasRevealed, revealContact } = useRevealState(id || '');
  
  // Buscar o perfil nos dados mock
  const allListings = [...mockOperadores, ...mockAfiliados];
  const profile = allListings.find(listing => listing.id === id);
  
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-brand-primary">Perfil não encontrado</h1>
      </div>
    );
  }

  // Mock de dados adicionais do perfil
  const profileData = {
    ...profile,
    badges: ['Verificado', 'Premium', 'Top Rated'],
    payout: profile.type === 'operador' ? 'RevShare 35%' : 'CPA $150',
    traffic: profile.type === 'afiliado' ? '50k visitas/mês' : undefined,
    languages: [profile.language, 'Inglês'],
    contact: {
      email: "royal@casino.com",
      whatsapp: "+356 9911-2233", 
      telefone: "+356 2200-3300",
      telegram: "@royalgaming"
    }
  };

  const handleGoBack = () => {
    navigate('/lista');
  };

  const handleRevealContact = () => {
    setIsModalOpen(true);
  };

  const handleConfirmReveal = () => {
    revealContact();
    setIsModalOpen(false);
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
          <Button
            variant="outline"
            onClick={handleEditProfile}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar Perfil
          </Button>
        </div>

        {/* Header do Perfil */}
        <ProfileHeader 
          profile={profileData} 
          hasRevealed={hasRevealed}
          onRevealContact={handleRevealContact}
        />
        
        {/* Contact Card (se revelado) */}
        {hasRevealed && (
          <ContactCard contact={profileData.contact} />
        )}
        
        {/* Badges */}
        <div className="mt-8">
          <BadgeList badges={profileData.badges} />
        </div>

        {/* Seção de Detalhes */}
        <div className="mt-8">
          <ProfileDetailSection profile={profileData} hasRevealed={hasRevealed} />
        </div>

        {/* Seção Sobre (sempre aberta) */}
        <div className="mt-8">
          <AboutSection profile={profileData} />
        </div>

        {/* Modal de Revelação */}
        <RevealModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmReveal}
          contact={profileData.contact}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
