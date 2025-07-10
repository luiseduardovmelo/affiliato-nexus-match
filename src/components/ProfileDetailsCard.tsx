
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Languages, Phone, MessageCircle, Mail, Building, Users, Calendar, DollarSign, Globe, Settings, Zap } from 'lucide-react';

interface ProfileDetailsCardProps {
  profile: {
    // Dados básicos
    name: string;
    type: string;
    email?: string;
    phone?: string;
    telegram?: string;
    language?: string;
    country?: string;
    description?: string;
    memberSince?: string;
    
    // Dados específicos do operador
    monthlyVolume?: string;
    paymentSchedule?: string;
    acceptedCountries?: string[];
    platformType?: string;
    acceptsRetargeting?: boolean;
    installsPostback?: boolean;
    whiteLabel?: string;
    commissionModels?: string[];
    
    // Dados específicos do afiliado  
    commissionModel?: string;
    workLanguages?: string[];
    chargedValue?: string;
    basicInfo?: string;
    currentOperators?: string; // Changed from string[] to string
    previousOperators?: string; // Changed from string[] to string
    specialties?: string[];
  };
  loading: boolean;
}

const ProfileDetailsCard = ({ profile, loading }: ProfileDetailsCardProps) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded animate-pulse" />
                <div className="h-4 bg-gray-300 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const isOperator = profile.type === 'operador';

  return (
    <div className="space-y-6">
      {/* Sobre */}
      {profile.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Sobre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{profile.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-accent" />
                <span className="text-gray-600">{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-accent" />
                <span className="text-gray-600">{profile.phone}</span>
              </div>
            )}
            {profile.telegram && (
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-brand-accent" />
                <span className="text-gray-600">{profile.telegram}</span>
              </div>
            )}
            {profile.language && (
              <div className="flex items-center gap-3">
                <Languages className="w-4 h-4 text-brand-accent" />
                <span className="text-gray-600">{profile.language}</span>
              </div>
            )}
            {profile.country && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <span className="text-gray-600">{profile.country}</span>
              </div>
            )}
            {profile.memberSince && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-brand-accent" />
                <span className="text-gray-600">
                  Membro desde {new Date(profile.memberSince).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Especialidades */}
      {profile.specialties && profile.specialties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Especialidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="border-brand-accent/30">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações Comerciais - Operador */}
      {isOperator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informações Comerciais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.monthlyVolume && profile.monthlyVolume !== 'Não informado' && (
                <div>
                  <p className="text-sm font-medium text-brand-primary">Volume Mensal</p>
                  <p className="text-gray-600">{profile.monthlyVolume}</p>
                </div>
              )}
              {profile.paymentSchedule && profile.paymentSchedule !== 'Não informado' && (
                <div>
                  <p className="text-sm font-medium text-brand-primary">Frequência de Pagamento</p>
                  <p className="text-gray-600">{profile.paymentSchedule}</p>
                </div>
              )}
              {profile.platformType && profile.platformType !== 'Não informado' && (
                <div>
                  <p className="text-sm font-medium text-brand-primary">Tipo de Plataforma</p>
                  <p className="text-gray-600">{profile.platformType}</p>
                </div>
              )}
              {profile.whiteLabel && profile.whiteLabel !== 'Não informado' && (
                <div>
                  <p className="text-sm font-medium text-brand-primary">White Label</p>
                  <p className="text-gray-600">{profile.whiteLabel}</p>
                </div>
              )}
            </div>

            {profile.commissionModels && profile.commissionModels.length > 0 && (
              <div>
                <p className="text-sm font-medium text-brand-primary mb-2">Modelos de Comissão</p>
                <div className="flex flex-wrap gap-2">
                  {profile.commissionModels.map((model, index) => (
                    <Badge key={index} className="bg-brand-success text-white">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.acceptedCountries && profile.acceptedCountries.length > 0 && (
              <div>
                <p className="text-sm font-medium text-brand-primary mb-2">Países Aceitos</p>
                <div className="flex flex-wrap gap-2">
                  {profile.acceptedCountries.map((country, index) => (
                    <Badge key={index} variant="outline">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-accent" />
                <span className="text-sm">
                  Retargeting: {profile.acceptsRetargeting ? 'Aceita' : 'Não aceita'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-accent" />
                <span className="text-sm">
                  Postback: {profile.installsPostback ? 'Instala' : 'Não instala'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações Comerciais - Afiliado */}
      {!isOperator && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Informações Comerciais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.commissionModel && profile.commissionModel !== 'Não informado' && (
                <div>
                  <p className="text-sm font-medium text-brand-primary">Modelo de Comissão Preferido</p>
                  <p className="text-gray-600">{profile.commissionModel}</p>
                </div>
              )}
              {profile.chargedValue && profile.chargedValue !== 'Não informado' && (
                <div>
                  <p className="text-sm font-medium text-brand-primary">Valor Cobrado</p>
                  <p className="text-gray-600">{profile.chargedValue}</p>
                </div>
              )}
            </div>

            {profile.workLanguages && profile.workLanguages.length > 0 && (
              <div>
                <p className="text-sm font-medium text-brand-primary mb-2">Idiomas de Trabalho</p>
                <div className="flex flex-wrap gap-2">
                  {profile.workLanguages.map((language, index) => (
                    <Badge key={index} className="bg-brand-accent text-white">
                      <Languages className="w-3 h-3 mr-1" />
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.basicInfo && profile.basicInfo !== 'Não informado' && (
              <div>
                <p className="text-sm font-medium text-brand-primary">Informações Básicas</p>
                <p className="text-gray-600">{profile.basicInfo}</p>
              </div>
            )}

            {profile.currentOperators && profile.currentOperators !== 'Nenhum' && (
              <div>
                <p className="text-sm font-medium text-brand-primary">Operadores Atuais</p>
                <p className="text-gray-600">{profile.currentOperators}</p>
              </div>
            )}

            {profile.previousOperators && profile.previousOperators !== 'Nenhum' && (
              <div>
                <p className="text-sm font-medium text-brand-primary">Operadores Anteriores</p>
                <p className="text-gray-600">{profile.previousOperators}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileDetailsCard;
