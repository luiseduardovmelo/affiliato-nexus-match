// Utility functions for handling contact information security

export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return '***@***.com';
  const [username, domain] = email.split('@');
  if (username.length <= 2) return `${username}***@${domain}`;
  return `${username.substring(0, 2)}***@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone) return '+** ** ****-****';
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 8) return '+** ** ****-****';
  return `+** ** ****-${cleanPhone.slice(-4)}`;
};

export const maskTelegram = (telegram: string): string => {
  if (!telegram) return '@username';
  if (telegram.startsWith('@')) {
    const username = telegram.slice(1);
    if (username.length <= 3) return `@${username}***`;
    return `@${username.substring(0, 3)}***`;
  }
  return '@username***';
};

export const maskContactData = (contactData: {
  email?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  telefone?: string;
}) => ({
  email: maskEmail(contactData.email || ''),
  phone: maskPhone(contactData.phone || ''),
  telegram: maskTelegram(contactData.telegram || ''),
  whatsapp: maskPhone(contactData.whatsapp || ''),
  telefone: maskPhone(contactData.telefone || ''),
});