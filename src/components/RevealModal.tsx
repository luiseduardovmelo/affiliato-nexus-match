
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface RevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contact: {
    email: string;
    telegram: string;
  };
}

const RevealModal = ({ isOpen, onClose, onConfirm, contact }: RevealModalProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showMasked, setShowMasked] = useState(false);

  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        setShowMasked(true);
      }, 60000); // 60 segundos

      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    return `${username.slice(0, 2)}***@${domain}`;
  };

  const maskTelegram = (telegram: string) => {
    return `${telegram.slice(0, 3)}***`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-t-4 border-t-brand-accent max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brand-primary text-xl">
            {isConfirmed ? 'Informações de Contato' : 'Revelar contato?'}
          </DialogTitle>
        </DialogHeader>

        {!isConfirmed ? (
          <div className="py-4">
            <p className="text-gray-600 text-center">
              Isto consumirá <span className="font-semibold text-brand-primary">1 crédito</span> do seu saldo.
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              Você possui 5 créditos disponíveis.
            </p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="flex-1 select-all font-mono text-sm">
                  {showMasked ? maskEmail(contact.email) : contact.email}
                </span>
                {!showMasked && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(contact.email)}
                    className="p-1 h-6 w-6"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telegram
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="flex-1 select-all font-mono text-sm">
                  {showMasked ? maskTelegram(contact.telegram) : contact.telegram}
                </span>
                {!showMasked && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(contact.telegram)}
                    className="p-1 h-6 w-6"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {showMasked && (
              <p className="text-sm text-gray-500 text-center">
                As informações foram mascaradas por segurança.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          {!isConfirmed ? (
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleConfirm} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                Confirmar
              </Button>
            </div>
          ) : (
            <Button onClick={onClose} className="w-full">
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RevealModal;
