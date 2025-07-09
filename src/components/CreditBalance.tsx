import { Coins, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreditBalance, useAddDailyCredits } from '@/hooks/useCredits';

interface CreditBalanceProps {
  compact?: boolean;
}

const CreditBalance = ({ compact = false }: CreditBalanceProps) => {
  const { data: creditBalance, isLoading } = useCreditBalance();
  const addDailyCredits = useAddDailyCredits();

  const handleAddDailyCredits = () => {
    addDailyCredits.mutate();
  };

  // Verificar se pode adicionar créditos diários
  const canAddDailyCredits = () => {
    if (!creditBalance?.lastDailyRefresh) return true;
    
    const lastRefresh = new Date(creditBalance.lastDailyRefresh);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return lastRefresh < todayStart;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Coins className="h-4 w-4 text-yellow-500" />
        <span className="font-semibold text-sm">
          {creditBalance?.totalCredits || 0}
        </span>
        <Badge variant="secondary" className="text-xs">
          {creditBalance?.dailyCreditsRemaining || 0}/5 hoje
        </Badge>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Coins className="h-5 w-5 text-yellow-500" />
          Seus Créditos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-brand-primary mb-1">
            {creditBalance?.totalCredits || 0}
          </div>
          <p className="text-sm text-gray-600">créditos disponíveis</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Créditos diários:</span>
            <span className="text-sm font-medium">
              {creditBalance?.dailyCreditsRemaining || 0}/5
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((creditBalance?.dailyCreditsUsed || 0) / 5) * 100}%` 
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {creditBalance?.dailyCreditsUsed || 0} de 5 créditos usados hoje
          </p>
        </div>

        {canAddDailyCredits() && (
          <Button 
            onClick={handleAddDailyCredits}
            disabled={addDailyCredits.isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {addDailyCredits.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Adicionando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Receber Créditos Diários
              </>
            )}
          </Button>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Cada revelação de contato custa 1 crédito</p>
          <p>• Receba 5 créditos gratuitos por dia</p>
          <p>• Créditos não utilizados se acumulam</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditBalance;