
import { ActivityData } from '@/hooks/useProfileData';

interface ActivityTimelineProps {
  activities: ActivityData[];
  loading: boolean;
}

const ActivityTimeline = ({ activities, loading }: ActivityTimelineProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-brand-accent/15 rounded-xl p-6">
        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse mt-1" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 bg-gray-300 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-300 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-accent/15 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-brand-primary mb-6">Atividade Recente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in"
          >
            <div 
              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: activity.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 mb-1">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600">
                {activity.description}
              </p>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
