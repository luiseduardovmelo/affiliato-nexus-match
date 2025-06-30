
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Lista = () => {
  const partners = [
    {
      id: 1,
      name: "GlobalGaming Partners",
      type: "Operador",
      description: "Operador internacional com foco em mercados europeus e latino-americanos",
      specialties: ["Slots", "Live Casino", "Sports Betting"],
      rating: 4.8,
      verified: true
    },
    {
      id: 2,
      name: "AffiliateMax Network",
      type: "Afiliado",
      description: "Rede de afiliados especializada em tráfego de alta qualidade",
      specialties: ["SEO", "Social Media", "Content Marketing"],
      rating: 4.9,
      verified: true
    },
    {
      id: 3,
      name: "CasinoTech Solutions",
      type: "Operador",
      description: "Plataforma tecnológica para operadores de cassino online",
      specialties: ["White Label", "API Integration", "Payment Solutions"],
      rating: 4.7,
      verified: true
    },
    {
      id: 4,
      name: "Digital Marketing Pro",
      type: "Afiliado",
      description: "Especialistas em marketing digital para iGaming",
      specialties: ["PPC", "Affiliate Management", "Analytics"],
      rating: 4.6,
      verified: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand-primary mb-4">
          Explore Parceiros
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubra operadores e afiliados verificados prontos para estabelecer parcerias estratégicas
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="outline" className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white">
          Todos
        </Button>
        <Button variant="outline" className="border-brand-success text-brand-success hover:bg-brand-success hover:text-white">
          Operadores
        </Button>
        <Button variant="outline" className="border-brand-warning text-brand-warning hover:bg-brand-warning hover:text-white">
          Afiliados
        </Button>
      </div>

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-brand-accent">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-brand-primary">{partner.name}</CardTitle>
                    {partner.verified && (
                      <Badge className="bg-brand-success text-white">Verificado</Badge>
                    )}
                  </div>
                  <Badge 
                    variant={partner.type === 'Operador' ? 'default' : 'secondary'}
                    className={partner.type === 'Operador' ? 'bg-brand-accent text-white' : 'bg-brand-warning text-white'}
                  >
                    {partner.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-brand-warning">★</span>
                    <span className="font-semibold">{partner.rating}</span>
                  </div>
                </div>
              </div>
              <CardDescription className="text-gray-600">
                {partner.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-brand-primary mb-2">Especialidades:</h4>
                  <div className="flex flex-wrap gap-2">
                    {partner.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="border-gray-300">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-brand-success hover:bg-brand-accent text-white transition-colors duration-200"
                  >
                    Conectar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white"
                  >
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button 
          variant="outline" 
          size="lg"
          className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
        >
          Carregar Mais Parceiros
        </Button>
      </div>
    </div>
  );
};

export default Lista;
