import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ContactData {
  email: string;
  whatsapp: string;
  telefone: string;
  telegram: string;
}
interface ContactCardProps {
  contact: ContactData;
}
const ContactCard = ({
  contact
}: ContactCardProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const handleEmailClick = () => {
    window.open(`mailto:${contact.email}`, '_blank');
  };
  const handlePhoneClick = () => {
    window.open(`tel:${contact.telefone}`, '_blank');
  };
  const handleWhatsAppClick = () => {
    const cleanNumber = contact.whatsapp.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };
  const handleTelegramClick = () => {
    const username = contact.telegram.replace('@', '');
    window.open(`https://t.me/${username}`, '_blank');
  };
  return <div className="bg-white border border-brand-primary/15 rounded-lg p-6 mt-4">
      <h3 className="text-lg font-semibold text-brand-primary mb-4">Informações de Contato</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-brand-primary" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="flex items-center gap-2">
              <span className="select-all font-mono text-sm text-gray-800 flex-1">{contact.email}</span>
              
              <Button size="sm" variant="ghost" onClick={handleEmailClick} className="p-1 h-6 w-6 text-brand-primary hover:text-brand-accent" title="Enviar e-mail">
                <Mail className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-brand-primary" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <div className="flex items-center gap-2">
              <span className="select-all font-mono text-sm text-gray-800 flex-1">{contact.whatsapp}</span>
              
              <Button size="sm" variant="ghost" onClick={handleWhatsAppClick} className="p-1 h-6 w-6 text-green-600 hover:text-green-700" title="Abrir WhatsApp">
                💬
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-brand-primary" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <div className="flex items-center gap-2">
              <span className="select-all font-mono text-sm text-gray-800 flex-1">{contact.telefone}</span>
              
              <Button size="sm" variant="ghost" onClick={handlePhoneClick} className="p-1 h-6 w-6 text-blue-600 hover:text-blue-700" title="Fazer ligação">
                <Phone className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-brand-primary" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
            <div className="flex items-center gap-2">
              <span className="select-all font-mono text-sm text-gray-800 flex-1">{contact.telegram}</span>
              
              <Button size="sm" variant="ghost" onClick={handleTelegramClick} className="p-1 h-6 w-6 text-blue-500 hover:text-blue-600" title="Abrir Telegram">
                <MessageCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ContactCard;