
export type UserType = 'afiliado' | 'operador';

export interface BasicUserData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  country: string;
  logo?: File;
  profileDescription: string;
  phone: string;
  telegram?: string;
  publicEmail?: string;
}

export interface AfiliadoData {
  trafficSources: string[];
  commissionModel: 'revenue-share' | 'cpa' | 'hybrid';
  workLanguages: string[];
  otherLanguages?: string;
  monthlyTraffic: string;
  specialties: string[];
  minimumCPM: number;
  worksWithOthers: boolean;
  otherOperatorsDetails?: string;
}

export interface OperadorData {
  monthlyVolume: string;
  commissionModels: string[];
  paymentSchedule: 'weekly' | 'biweekly' | 'monthly';
  acceptedCountries: string[];
  allowsRetargeting: boolean;
  offersPostback: boolean;
  hasWhiteLabel: boolean;
  whiteLabelDetails?: string;
  minimumTraffic: number;
  revenueShareRate: number;
  cpaFirstDeposit: number;
  cpaQualifiedLead: number;
  segments: string[];
}

export interface RegistrationData {
  userType: UserType;
  basicData: BasicUserData;
  specificData: AfiliadoData | OperadorData;
  termsAccepted: boolean;
  newsletterOptIn: boolean;
  howDidYouHear: string;
}
