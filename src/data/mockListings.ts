
export interface Listing {
  id: string;
  name: string;
  type: 'operador' | 'afiliado';
  rating: number;
  country: string;
  language: string;
  avatar: string;
  description: string;
  specialties: string[];
}

export const mockOperadores: Listing[] = [
  {
    id: 'op1',
    name: 'BetMaster Gaming',
    type: 'operador',
    rating: 4.8,
    country: 'Brasil',
    language: 'Português',
    avatar: '/placeholder.svg',
    description: 'Operador líder em jogos online com foco no mercado brasileiro',
    specialties: ['Slots', 'Live Casino', 'Sports Betting']
  },
  {
    id: 'op2',
    name: 'Lucky Casino Group',
    type: 'operador',
    rating: 4.6,
    country: 'Portugal',
    language: 'Português',
    avatar: '/placeholder.svg',
    description: 'Grupo de cassinos com presença internacional',
    specialties: ['Casino', 'Poker', 'Bingo']
  },
  {
    id: 'op3',
    name: 'Golden Bet Ltd',
    type: 'operador',
    rating: 4.4,
    country: 'Reino Unido',
    language: 'Inglês',
    avatar: '/placeholder.svg',
    description: 'Operador tradicional com foco em apostas esportivas',
    specialties: ['Sports Betting', 'Virtual Sports']
  },
  {
    id: 'op4',
    name: 'Mega Win Casino',
    type: 'operador',
    rating: 4.2,
    country: 'Espanha',
    language: 'Espanhol',
    avatar: '/placeholder.svg',
    description: 'Cassino online com grande variedade de jogos',
    specialties: ['Slots', 'Jackpots', 'Live Games']
  },
  {
    id: 'op5',
    name: 'Royal Gaming',
    type: 'operador',
    rating: 4.7,
    country: 'Brasil',
    language: 'Português',
    avatar: '/placeholder.svg',
    description: 'Operador premium com foco em experiência VIP',
    specialties: ['VIP Gaming', 'High Stakes', 'Exclusive Games']
  }
];

export const mockAfiliados: Listing[] = [
  {
    id: 'af1',
    name: 'SuperAffiliate Pro',
    type: 'afiliado',
    rating: 4.9,
    country: 'Brasil',
    language: 'Português',
    avatar: '/placeholder.svg',
    description: 'Rede de afiliados especializada em tráfego de alta qualidade',
    specialties: ['SEO', 'Social Media', 'Content Marketing']
  },
  {
    id: 'af2',
    name: 'Marketing Kings',
    type: 'afiliado',
    rating: 4.7,
    country: 'Estados Unidos',
    language: 'Inglês',
    avatar: '/placeholder.svg',
    description: 'Especialistas em marketing digital para iGaming',
    specialties: ['PPC', 'Facebook Ads', 'Google Ads']
  },
  {
    id: 'af3',
    name: 'Traffic Masters',
    type: 'afiliado',
    rating: 4.5,
    country: 'Reino Unido',
    language: 'Inglês',
    avatar: '/placeholder.svg',
    description: 'Geração de tráfego qualificado para operadores',
    specialties: ['Affiliate Management', 'Analytics', 'Conversion Optimization']
  },
  {
    id: 'af4',
    name: 'Digital Boost',
    type: 'afiliado',
    rating: 4.3,
    country: 'Portugal',
    language: 'Português',
    avatar: '/placeholder.svg',
    description: 'Agência de marketing digital focada em iGaming',
    specialties: ['Email Marketing', 'Influencer Marketing', 'Brand Building']
  },
  {
    id: 'af5',
    name: 'Growth Partners',
    type: 'afiliado',
    rating: 4.6,
    country: 'Espanha',
    language: 'Espanhol',
    avatar: '/placeholder.svg',
    description: 'Parceiros de crescimento para operadores de jogos',
    specialties: ['Performance Marketing', 'CRO', 'Data Analytics']
  }
];
