
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface SecurityBannerProps {
  type: 'info' | 'warning';
  message: string;
  visible: boolean;
}

export const SecurityBanner = ({ type, message, visible }: SecurityBannerProps) => {
  if (!visible) return null;

  return (
    <Alert className={`mb-4 ${type === 'warning' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
      {type === 'warning' ? (
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      ) : (
        <Shield className="h-4 w-4 text-green-600" />
      )}
      <AlertDescription className={type === 'warning' ? 'text-yellow-800' : 'text-green-800'}>
        {message}
      </AlertDescription>
    </Alert>
  );
};
