
import { useState, useEffect } from 'react';

export interface ProfileData {
  name: string;
  type: string;
  isVerified: boolean;
  avatar: string;
  specialties: string[];
  location: string;
  description: string;
}

export interface KPIData {
  label: string;
  value: string;
  color: string;
}

export interface ActivityData {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  color: string;
}

export const useProfileData = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile({
        name: "João Developer",
        type: "Operador Premium",
        isVerified: true,
        avatar: "",
        specialties: ["Slots", "Live Casino", "Sports Betting"],
        location: "Brasil, São Paulo",
        description: "Operador experiente no mercado iGaming com mais de 8 anos de experiência. Especializado em desenvolvimento de plataformas de cassino online e estabelecimento de parcerias estratégicas com afiliados de alto desempenho."
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { profile, loading };
};

export const useKPIData = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKpis([
        { label: "Conexões Ativas", value: "47", color: "#3ECD6D" },
        { label: "Parcerias", value: "12", color: "#1F7AFF" },
        { label: "Rating Médio", value: "4.9", color: "#F9C846" }
      ]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { kpis, loading };
};

export const useActivities = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActivities([
        {
          id: "1",
          title: "Nova conexão estabelecida",
          description: "Conectado com AffiliateMax Network",
          timestamp: "2h atrás",
          color: "#3ECD6D"
        },
        {
          id: "2",
          title: "Perfil atualizado",
          description: "Adicionadas novas especialidades",
          timestamp: "1 dia atrás",
          color: "#1F7AFF"
        },
        {
          id: "3",
          title: "Avaliação recebida",
          description: "5 estrelas de Digital Marketing Pro",
          timestamp: "3 dias atrás",
          color: "#F9C846"
        }
      ]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { activities, loading };
};
