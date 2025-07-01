
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '@/components/LoginModal';
import PodiumCard from '@/components/PodiumCard';
import MatchPerfectSection from '@/components/MatchPerfectSection';
import { mockTopOperadores, mockTopAfiliados } from '@/data/mockTop';

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Simulating authenticated user - in real app this would come from auth context
  const isAuthenticated = false; // Changed to false to show login page

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCreateAccount = () => {
    navigate('/registration');
  };

  // If user is not authenticated, show the landing page
  if (!isAuthenticated) {
    return (
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-brand-primary mb-6">
              iGaming Connect
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              A plataforma definitiva para conectar <span className="text-brand-accent font-semibold">Operadores</span> e <span className="text-brand-success font-semibold">Afiliados</span> no universo iGaming
            </p>
            
            {/* Login Button - Principal CTA */}
            <div className="mb-8">
              <Button onClick={openLoginModal} size="lg" className="bg-brand-success hover:bg-brand-accent text-white px-12 py-4 text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                Fazer Login
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-brand-primary mb-4">
                Por que escolher iGaming Connect?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Facilitamos conexões estratégicas no mercado iGaming com tecnologia de ponta
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white p-4">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-8 h-8 text-brand-success" />
                  </div>
                  <CardTitle className="text-brand-primary text-xl mb-3">
                    Matchmaking Inteligente
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    Algoritmo avançado para conectar operadores e afiliados compatíveis baseado em critérios específicos e histórico de performance
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white p-4">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-8 h-8 text-brand-accent" />
                  </div>
                  <CardTitle className="text-brand-primary text-xl mb-3">
                    Rede Global
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    Acesso a uma rede mundial de parceiros verificados e confiáveis em mais de 50 países ao redor do mundo
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white p-4">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-brand-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-brand-warning" />
                  </div>
                  <CardTitle className="text-brand-primary text-xl mb-3">
                    Segurança Total
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    Plataforma segura com verificação rigorosa de todos os membros e criptografia de ponta a ponta
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-brand-primary to-brand-accent text-white py-16 rounded-2xl">
          <div className="text-center max-w-3xl mx-auto px-8">
            <h2 className="text-3xl font-bold mb-6">
              Pronto para expandir sua rede?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de profissionais que já estão conectados através da nossa plataforma
            </p>
            <Button onClick={handleCreateAccount} size="lg" className="bg-brand-success hover:bg-white hover:text-brand-primary text-white px-8 py-3 text-lg transition-all duration-200 transform hover:scale-105">
              Criar Conta Gratuita
            </Button>
          </div>
        </section>

        {/* Login Modal */}
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      </div>
    );
  }

  // Authenticated user home page with podiums
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-primary mb-4">
            Bem-vindo ao iGaming Connect
          </h1>
          <p className="text-xl text-gray-600">
            Descubra os melhores parceiros da nossa plataforma
          </p>
        </section>

        {/* Podiums Section */}
        <section className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PodiumCard
              title="Top Operadores"
              data={mockTopOperadores}
              linkType="operadores"
            />
            <PodiumCard
              title="Top Afiliados"
              data={mockTopAfiliados}
              linkType="afiliados"
            />
          </div>
        </section>

        {/* Match Perfeito Section */}
        <MatchPerfectSection />
      </div>
    </div>
  );
};

export default Home;
