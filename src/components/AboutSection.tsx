
interface AboutSectionProps {
  profile: {
    country: string;
    type: 'operador' | 'afiliado';
    payout?: string;
    traffic?: string;
    languages: string[];
    description: string;
    specialties: string[];
  };
}

const AboutSection = ({ profile }: AboutSectionProps) => {
  return (
    <div className="bg-white border border-brand-accent/20 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-brand-primary mb-6">Sobre</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium text-brand-primary mb-2">País</h4>
          <p className="text-gray-600">{profile.country}</p>
        </div>
        
        {profile.type === 'operador' ? (
          <div>
            <h4 className="font-medium text-brand-primary mb-2">Payout</h4>
            <p className="text-gray-600">{profile.payout}</p>
          </div>
        ) : (
          <div>
            <h4 className="font-medium text-brand-primary mb-2">Tráfego</h4>
            <p className="text-gray-600">{profile.traffic}</p>
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-brand-primary mb-2">Idiomas</h4>
          <p className="text-gray-600">{profile.languages.join(', ')}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-brand-primary mb-2">Especialidades</h4>
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-brand-primary mb-2">Descrição</h4>
        <p className="text-gray-600 leading-relaxed">{profile.description}</p>
      </div>
    </div>
  );
};

export default AboutSection;
