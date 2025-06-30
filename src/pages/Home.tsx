
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginModal from '@/components/LoginModal';

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

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
            <Button 
              onClick={openLoginModal}
              size="lg" 
              className="bg-brand-success hover:bg-brand-accent text-white px-12 py-4 text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Fazer Login
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-brand-accent hover:bg-brand-primary text-white px-8 py-3 text-lg transition-all duration-200"
            >
              Começar Agora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white px-8 py-3 text-lg transition-all duration-200"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-primary mb-4">
            Por que escolher iGaming Connect?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Facilitamos conexões estratégicas no mercado iGaming com tecnologia de ponta
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-brand-success">
            <CardHeader>
              <div className="w-12 h-12 bg-brand-success/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-brand-success rounded-full"></div>
              </div>
              <CardTitle className="text-brand-primary">Matchmaking Inteligente</CardTitle>
              <CardDescription>
                Algoritmo avançado para conectar operadores e afiliados compatíveis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-brand-accent">
            <CardHeader>
              <div className="w-12 h-12 bg-brand-accent/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-brand-accent rounded-full"></div>
              </div>
              <CardTitle className="text-brand-primary">Rede Global</CardTitle>
              <CardDescription>
                Acesso a uma rede mundial de parceiros verificados e confiáveis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-brand-warning">
            <CardHeader>
              <div className="w-12 h-12 bg-brand-warning/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-brand-warning rounded-full"></div>
              </div>
              <CardTitle className="text-brand-primary">Segurança Total</CardTitle>
              <CardDescription>
                Plataforma segura com verificação rigorosa de todos os membros
              </CardDescription>
            </CardHeader>
          </Card>
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
          <Button 
            onClick={openLoginModal}
            size="lg" 
            className="bg-brand-success hover:bg-white hover:text-brand-primary text-white px-8 py-3 text-lg transition-all duration-200 transform hover:scale-105"
          >
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default Home;
