
export interface MatchItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  matchScore: number;
  type: 'operador' | 'afiliado';
}

export const mockMatchData: MatchItem[] = [
  {
    id: 'match1',
    name: 'Casino Royal Group',
    avatar: '/placeholder.svg',
    rating: 4.8,
    matchScore: 0.87,
    type: 'operador'
  },
  {
    id: 'match2',
    name: 'Elite Marketing Pro',
    avatar: '/placeholder.svg',
    rating: 4.6,
    matchScore: 0.82,
    type: 'afiliado'
  },
  {
    id: 'match3',
    name: 'Mega Slots Network',
    avatar: '/placeholder.svg',
    rating: 4.9,
    matchScore: 0.85,
    type: 'operador'
  }
];
