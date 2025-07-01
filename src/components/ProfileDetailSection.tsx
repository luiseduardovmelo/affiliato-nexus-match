
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, CreditCard, Calendar, Target, CheckCircle, XCircle, Globe, Phone, Mail, MessageCircle } from 'lucide-react';

interface ProfileDetailSectionProps {
  profile: {
    type: 'operador' | 'afiliado';
    country: string;
    language: string;
    
    // Operador específico
    monthlyTrafficVolume?: string;
    commissionModels?: string[];
    paymentFrequency?: string;
    platformType?: string;
    acceptsRetargeting?: boolean;
    installsPostback?: boolean;
    whiteLabel?: string;
    
    // Afiliado específico
    chargedValue?: string;
    desiredCommissionMethod?: string;
    basicInfo?: string;
    currentOperators?: string[];
    previousOperators?: string[];
    trafficTypes?: string[];
    
    // Contato
    contact?: {
      email?: string;
      whatsapp?: string;
      telefone?: string;
      telegram?: string;
    };
  };
  hasRevealed: boolean;
}

const ProfileDetailSection = ({ profile, hasRevealed }: ProfileDetailSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="font-medium">País:</span>
            <span>{profile.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Idioma:</span>
            <span>{profile.language}</span>
          </div>
        </CardContent>
      </Card>

      {/* Informações Comerciais - Operador */}
      {profile.type === 'operador' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Informações Comerciais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.monthlyTrafficVolume && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Volume de Tráfego:</span>
                <span>{profile.monthlyTrafficVolume}</span>
              </div>
            )}
            
            {profile.commissionModels && profile.commissionModels.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Modelos de Comissionamento:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.commissionModels.map((model, index) => (
                    <Badge key={index} variant="secondary">{model}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profile.paymentFrequency && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Pagamento:</span>
                <span className="capitalize">{profile.paymentFrequency}</span>
              </div>
            )}
            
            {profile.platformType && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Plataforma:</span>
                <Badge variant="outline">{profile.platformType}</Badge>
              </div>
            )}
            
            <div className="flex gap-4">
              {profile.acceptsRetargeting !== undefined && (
                <div className="flex items-center gap-2">
                  {profile.acceptsRetargeting ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Retargeting</span>
                </div>
              )}
              
              {profile.installsPostback !== undefined && (
                <div className="flex items-center gap-2">
                  {profile.installsPostback ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Postback</span>
                </div>
              )}
            </div>
            
            {profile.whiteLabel && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="font-medium">White Label:</span>
                <span>{profile.whiteLabel}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informações Comerciais - Afiliado */}
      {profile.type === 'afiliado' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Informações Comerciais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.chargedValue && (
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Valor Cobrado:</span>
                <span>{profile.chargedValue}</span>
              </div>
            )}
            
            {profile.desiredCommissionMethod && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Comissão Preferida:</span>
                <Badge variant="secondary">{profile.desiredCommissionMethod}</Badge>
              </div>
            )}
            
            {profile.basicInfo && (
              <div>
                <span className="font-medium block mb-2">Informações Básicas:</span>
                <p className="text-gray-600 text-sm leading-relaxed">{profile.basicInfo}</p>
              </div>
            )}
            
            {profile.currentOperators && profile.currentOperators.length > 0 && (
              <div>
                <span className="font-medium block mb-2">Operadores Atuais:</span>
                <div className="flex flex-wrap gap-2">
                  {profile.currentOperators.map((operator, index) => (
                    <Badge key={index} variant="outline">{operator}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profile.previousOperators && profile.previousOperators.length > 0 && (
              <div>
                <span className="font-medium block mb-2">Operadores Anteriores:</span>
                <div className="flex flex-wrap gap-2">
                  {profile.previousOperators.map((operator, index) => (
                    <Badge key={index} variant="secondary">{operator}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profile.trafficTypes && profile.trafficTypes.length > 0 && (
              <div>
                <span className="font-medium block mb-2">Tipos de Tráfego:</span>
                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                  {profile.trafficTypes.map((type, index) => (
                    <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informações de Contato */}
      {hasRevealed && profile.contact && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Email:</span>
                <a href={`mailto:${profile.contact.email}`} className="text-blue-600 hover:underline">
                  {profile.contact.email}
                </a>
              </div>
            )}
            
            {profile.contact.whatsapp && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span className="font-medium">WhatsApp:</span>
                <a href={`https://wa.me/${profile.contact.whatsapp.replace(/\D/g, '')}`} className="text-green-600 hover:underline">
                  {profile.contact.whatsapp}
                </a>
              </div>
            )}
            
            {profile.contact.telefone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Telefone:</span>
                <a href={`tel:${profile.contact.telefone}`} className="text-blue-600 hover:underline">
                  {profile.contact.telefone}
                </a>
              </div>
            )}
            
            {profile.contact.telegram && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Telegram:</span>
                <a href={`https://t.me/${profile.contact.telegram.replace('@', '')}`} className="text-blue-600 hover:underline">
                  {profile.contact.telegram}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileDetailSection;
