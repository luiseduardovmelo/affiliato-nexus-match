
export type ComissionModel = 'CPA' | 'REV' | 'Hibrido';
export type PaymentFrequency = 'semanal' | 'quinzenal' | 'mensal';
export type PlatformType = 'Cassino' | 'Apostas Esportivas' | 'Poker' | 'Bingo' | 'Completa';
export type TrafficType = 
  | 'SEO (blogs, sites de review, comparadores de odds)'
  | 'YouTube orgânico'
  | 'Google Ads'
  | 'Facebook Ads / Instagram Ads'
  | 'TikTok Ads'
  | 'DSPs (mídia programática)'
  | 'Push notifications'
  | 'Native ads (Taboola, Outbrain, etc.)'
  | 'Influenciadores (YouTube, Twitch, Kick)'
  | 'Grupos de Telegram'
  | 'Grupos de WhatsApp'
  | 'Canais de Discord'
  | 'E-mail marketing'
  | 'Pop-unders'
  | 'Redirects'
  | 'Cloaking'
  | 'Fake news pages'
  | 'Retargeting (via pixel ou DSP)'
  | 'Tráfego via apps (Android .apk ou app próprio)'
  | 'ASO (App Store Optimization)'
  | 'Fóruns de apostas / Reddit'
  | 'Tráfego direto (digitação de URL)'
  | 'SMS marketing'
  | 'Tráfego comprado de redes (revenda de tráfego de outros afiliados)';

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
  
  // Informações específicas dos operadores
  monthlyTrafficVolume?: string;
  commissionModels?: ComissionModel[];
  paymentFrequency?: PaymentFrequency;
  platformType?: PlatformType;
  acceptsRetargeting?: boolean;
  installsPostback?: boolean;
  whiteLabel?: string;
  
  // Informações específicas dos afiliados
  chargedValue?: string;
  desiredCommissionMethod?: ComissionModel;
  basicInfo?: string;
  previousOperators?: string[];
  currentOperators?: string[];
  trafficTypes?: TrafficType[];
  promotionChannels?: string[]; // Nova propriedade
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
    specialties: ['Slots', 'Live Casino', 'Sports Betting'],
    monthlyTrafficVolume: '2.5M visitas/mês',
    commissionModels: ['CPA', 'REV'],
    paymentFrequency: 'quinzenal',
    platformType: 'Completa',
    acceptsRetargeting: true,
    installsPostback: true,
    whiteLabel: 'BetMaster White'
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
    specialties: ['Casino', 'Poker', 'Bingo'],
    monthlyTrafficVolume: '1.8M visitas/mês',
    commissionModels: ['REV', 'Hibrido'],
    paymentFrequency: 'mensal',
    platformType: 'Cassino',
    acceptsRetargeting: true,
    installsPostback: false,
    whiteLabel: 'Lucky White Label'
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
    specialties: ['Sports Betting', 'Virtual Sports'],
    monthlyTrafficVolume: '3.2M visitas/mês',
    commissionModels: ['CPA'],
    paymentFrequency: 'semanal',
    platformType: 'Apostas Esportivas',
    acceptsRetargeting: false,
    installsPostback: true,
    whiteLabel: 'Golden Sports Platform'
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
    specialties: ['Slots', 'Jackpots', 'Live Games'],
    monthlyTrafficVolume: '1.2M visitas/mês',
    commissionModels: ['REV'],
    paymentFrequency: 'quinzenal',
    platformType: 'Cassino',
    acceptsRetargeting: true,
    installsPostback: true,
    whiteLabel: 'MegaWin Platform'
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
    specialties: ['VIP Gaming', 'High Stakes', 'Exclusive Games'],
    monthlyTrafficVolume: '800K visitas/mês',
    commissionModels: ['Hibrido'],
    paymentFrequency: 'mensal',
    platformType: 'Completa',
    acceptsRetargeting: true,
    installsPostback: true,
    whiteLabel: 'Royal Premium Suite'
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
    specialties: ['SEO', 'Social Media', 'Content Marketing'],
    chargedValue: 'CPA $200 - REV 40%',
    desiredCommissionMethod: 'REV',
    basicInfo: '5 anos de experiência no mercado iGaming brasileiro, foco em público adulto 25-45 anos',
    previousOperators: ['Bet365', 'Betfair', 'Sportingbet'],
    currentOperators: ['BetMaster Gaming', 'Lucky Casino Group'],
    trafficTypes: ['SEO (blogs, sites de review, comparadores de odds)', 'Google Ads', 'YouTube orgânico'],
    promotionChannels: ['YouTube', 'Instagram', 'Website/Blog', 'Newsletter']
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
    specialties: ['PPC', 'Facebook Ads', 'Google Ads'],
    chargedValue: 'CPA $150 - REV 35%',
    desiredCommissionMethod: 'CPA',
    basicInfo: '7 anos no mercado, especializado em tráfego pago internacional',
    previousOperators: ['DraftKings', 'FanDuel', 'BetMGM'],
    currentOperators: ['Golden Bet Ltd'],
    trafficTypes: ['Google Ads', 'Facebook Ads / Instagram Ads', 'Native ads (Taboola, Outbrain, etc.)'],
    promotionChannels: ['Facebook', 'Instagram', 'Twitter/X', 'Website/Blog']
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
    specialties: ['Affiliate Management', 'Analytics', 'Conversion Optimization'],
    chargedValue: 'REV 45%',
    desiredCommissionMethod: 'REV',
    basicInfo: '3 anos focado no mercado europeu, especialista em otimização de conversão',
    previousOperators: ['William Hill', 'Ladbrokes'],
    currentOperators: ['Mega Win Casino', 'Royal Gaming'],
    trafficTypes: ['Push notifications', 'E-mail marketing', 'Retargeting (via pixel ou DSP)'],
    promotionChannels: ['Newsletter', 'Website/Blog', 'Telegram']
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
    specialties: ['Email Marketing', 'Influencer Marketing', 'Brand Building'],
    chargedValue: 'CPA $180 - REV 38%',
    desiredCommissionMethod: 'Hibrido',
    basicInfo: '4 anos no mercado lusófono, parceria com influenciadores locais',
    previousOperators: ['Betclic', 'Betway'],
    currentOperators: ['BetMaster Gaming'],
    trafficTypes: ['Influenciadores (YouTube, Twitch, Kick)', 'TikTok Ads', 'Grupos de Telegram'],
    promotionChannels: ['YouTube', 'TikTok', 'Instagram', 'Twitch', 'Telegram']
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
    specialties: ['Performance Marketing', 'CRO', 'Data Analytics'],
    chargedValue: 'REV 42%',
    desiredCommissionMethod: 'REV',
    basicInfo: '6 anos especializados no mercado hispânico, foco em dados e performance',
    previousOperators: ['Codere', 'Luckia'],
    currentOperators: ['Lucky Casino Group', 'Mega Win Casino'],
    trafficTypes: ['DSPs (mídia programática)', 'SMS marketing', 'Fóruns de apostas / Reddit'],
    promotionChannels: ['Website/Blog', 'Newsletter', 'Discord', 'Podcast']
  }
];
