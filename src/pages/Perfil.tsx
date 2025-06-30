
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Perfil = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand-primary mb-4">
          Meu Perfil
        </h1>
        <p className="text-gray-600">
          Gerencie suas informações e conecte-se com parceiros ideais
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card className="border-l-4 border-brand-success">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-accent to-brand-success rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">JD</span>
              </div>
              <CardTitle className="text-brand-primary">João Developer</CardTitle>
              <CardDescription>Operador Premium</CardDescription>
              <Badge className="bg-brand-success text-white w-fit mx-auto">Verificado</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-primary mb-2">Especialidades</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Slots</Badge>
                  <Badge variant="outline">Live Casino</Badge>
                  <Badge variant="outline">Sports Betting</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-brand-primary mb-2">Localização</h4>
                <p className="text-gray-600">Brasil, São Paulo</p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-primary mb-2">Rating</h4>
                <div className="flex items-center gap-1">
                  <span className="text-brand-warning">★★★★★</span>
                  <span className="font-semibold">4.9</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="border-l-4 border-brand-accent">
            <CardHeader>
              <CardTitle className="text-brand-primary">Sobre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Operador experiente no mercado iGaming com mais de 8 anos de experiência. 
                Especializado em desenvolvimento de plataformas de cassino online e 
                estabelecimento de parcerias estratégicas com afiliados de alto desempenho.
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-l-4 border-brand-warning">
            <CardHeader>
              <CardTitle className="text-brand-primary">Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Nova conexão estabelecida</p>
                    <p className="text-sm text-gray-600">Conectado com AffiliateMax Network</p>
                  </div>
                  <span className="text-sm text-gray-500">2h atrás</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-brand-accent rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Perfil atualizado</p>
                    <p className="text-sm text-gray-600">Adicionadas novas especialidades</p>
                  </div>
                  <span className="text-sm text-gray-500">1 dia atrás</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-brand-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">Avaliação recebida</p>
                    <p className="text-sm text-gray-600">5 estrelas de Digital Marketing Pro</p>
                  </div>
                  <span className="text-sm text-gray-500">3 dias atrás</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center border-l-4 border-brand-success">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-brand-success mb-2">47</div>
                <p className="text-sm text-gray-600">Conexões Ativas</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-l-4 border-brand-accent">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-brand-accent mb-2">12</div>
                <p className="text-sm text-gray-600">Parcerias Estabelecidas</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-l-4 border-brand-warning">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-brand-warning mb-2">4.9</div>
                <p className="text-sm text-gray-600">Rating Médio</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button className="bg-brand-success hover:bg-brand-accent text-white transition-colors duration-200">
              Editar Perfil
            </Button>
            <Button variant="outline" className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white">
              Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
