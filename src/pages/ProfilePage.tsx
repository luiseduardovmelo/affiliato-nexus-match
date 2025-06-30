
import { useParams } from 'react-router-dom';
import { mockOperadores, mockAfiliados } from '@/data/mockListings';
import ProfileHeader from '@/components/ProfileHeader';
import BadgeList from '@/components/BadgeList';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import RevealModal from '@/components/RevealModal';
import { useState } from 'react';

const ProfilePage = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactRevealed, setIsContactRevealed] = useState(false);
  
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
      email: 'contato@exemplo.com',
      telegram: '@exemplo_usuario'
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProfileHeader profile={profileData} />
        
        <div className="mt-8">
          <BadgeList badges={profileData.badges} />
        </div>

        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="about">
              <AccordionTrigger className="text-lg font-semibold text-brand-primary">
                Sobre
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-brand-primary mb-2">País</h4>
                    <p className="text-gray-600">{profileData.country}</p>
                  </div>
                  
                  {profileData.type === 'operador' ? (
                    <div>
                      <h4 className="font-medium text-brand-primary mb-2">Payout</h4>
                      <p className="text-gray-600">{profileData.payout}</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium text-brand-primary mb-2">Tráfego</h4>
                      <p className="text-gray-600">{profileData.traffic}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-brand-primary mb-2">Idiomas</h4>
                    <p className="text-gray-600">{profileData.languages.join(', ')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-brand-primary mb-2">Descrição</h4>
                    <p className="text-gray-600 leading-relaxed">{profileData.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-brand-primary mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={isContactRevealed}
            className={`px-8 py-3 text-white font-medium rounded-lg transition-colors ${
              isContactRevealed 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isContactRevealed ? 'Contato já revelado' : 'Mostrar contato'}
          </Button>
        </div>

        <RevealModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            setIsContactRevealed(true);
            setIsModalOpen(false);
          }}
          contact={profileData.contact}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
