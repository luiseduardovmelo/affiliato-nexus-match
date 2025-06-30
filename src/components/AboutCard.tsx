
interface AboutCardProps {
  description: string;
  loading: boolean;
}

const AboutCard = ({ description, loading }: AboutCardProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-brand-accent/15 rounded-xl p-6">
        <div className="h-6 w-16 bg-gray-300 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-accent/15 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-brand-primary mb-4">Sobre</h3>
      <p className="text-gray-600 leading-relaxed text-justify">
        {description}
      </p>
    </div>
  );
};

export default AboutCard;
