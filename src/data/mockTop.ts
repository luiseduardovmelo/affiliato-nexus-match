
export interface TopItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  position: number;
}

export const mockTopOperadores: TopItem[] = [
  {
    id: 'op1',
    name: 'BetMaster Gaming',
    avatar: '/placeholder.svg',
    rating: 4.8,
    position: 1
  },
  {
    id: 'op2', 
    name: 'Lucky Casino Group',
    avatar: '/placeholder.svg',
    rating: 4.6,
    position: 2
  },
  {
    id: 'op3',
    name: 'Golden Bet Ltd',
    avatar: '/placeholder.svg',
    rating: 4.4,
    position: 3
  }
];

export const mockTopAfiliados: TopItem[] = [
  {
    id: 'af1',
    name: 'SuperAffiliate Pro',
    avatar: '/placeholder.svg',
    rating: 4.9,
    position: 1
  },
  {
    id: 'af2',
    name: 'Marketing Kings',
    avatar: '/placeholder.svg',
    rating: 4.7,
    position: 2
  },
  {
    id: 'af3',
    name: 'Traffic Masters',
    avatar: '/placeholder.svg',
    rating: 4.5,
    position: 3
  }
];
