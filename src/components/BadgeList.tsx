
interface BadgeListProps {
  badges: string[];
}

const BadgeList = ({ badges }: BadgeListProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-brand-primary mb-4">Badges</h2>
      
      <div className="flex flex-wrap gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: '#F9C846' }}
            >
              {badge.slice(0, 3).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600 text-center">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeList;
