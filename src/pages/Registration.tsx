
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import UserTypeSelection from '@/components/registration/UserTypeSelection';
import BasicDataForm from '@/components/registration/BasicDataForm';
import AfiliadoForm from '@/components/registration/AfiliadoForm';
import OperadorForm from '@/components/registration/OperadorForm';
import ConfirmationStep from '@/components/registration/ConfirmationStep';
import ProgressBar from '@/components/registration/ProgressBar';
import { RegistrationData, UserType, BasicUserData, AfiliadoData, OperadorData } from '@/types/registration';

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    userType: null as any,
    basicData: {
      email: '',
      password: '',
      confirmPassword: '', 
      displayName: '',
      country: '',
      profileDescription: '',
      phone: '',
      telegram: '',
      publicEmail: ''
    },
    specificData: {} as any,
    termsAccepted: false,
    newsletterOptIn: false,
    howDidYouHear: ''
  });

  const updateBasicData = (data: BasicUserData) => {
    setRegistrationData(prev => ({
      ...prev,
      basicData: data
    }));
  };

  const updateSpecificData = (data: AfiliadoData | OperadorData) => {
    setRegistrationData(prev => ({
      ...prev,
      specificData: data
    }));
  };

  const updateRegistrationData = (data: RegistrationData) => {
    setRegistrationData(data);
  };

  const handleUserTypeSelect = (type: UserType) => {
    setRegistrationData(prev => ({
      ...prev,
      userType: type,
      specificData: type === 'afiliado' ? {
        trafficSources: [],
        commissionModel: '' as any,
        workLanguages: [],
        monthlyTraffic: '',
        specialties: [],
        minimumCPM: 0,
        worksWithOthers: false,
        promotionChannels: [] // Inicializar canais de divulgação
      } : {
        monthlyVolume: '',
        commissionModels: [],
        paymentSchedule: '' as any,
        acceptedCountries: [],
        allowsRetargeting: false,
        offersPostback: false,
        hasWhiteLabel: false,
        minimumTraffic: 0,
        revenueShareRate: 0,
        cpaFirstDeposit: 0,
        cpaQualifiedLead: 0,
        segments: []
      }
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Here you would normally call your registration API
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao iGaming Connect. Redirecionando...",
      });

      // Redirect to main app after successful registration
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-primary mb-2">
            Cadastro iGaming Connect
          </h1>
          <p className="text-gray-600 text-lg">
            Crie sua conta e conecte-se com os melhores parceiros do mercado
          </p>
        </div>

        {currentStep > 1 && (
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        )}

        {currentStep === 1 && (
          <UserTypeSelection
            selectedType={registrationData.userType}
            onSelectType={handleUserTypeSelect}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <BasicDataForm
            data={registrationData.basicData}
            onUpdate={updateBasicData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && registrationData.userType === 'afiliado' && (
          <AfiliadoForm
            data={registrationData.specificData as AfiliadoData}
            onUpdate={updateSpecificData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && registrationData.userType === 'operador' && (
          <OperadorForm
            data={registrationData.specificData as OperadorData}
            onUpdate={updateSpecificData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 4 && (
          <ConfirmationStep
            data={registrationData}
            onUpdate={updateRegistrationData}
            onSubmit={handleSubmit}
            onBack={prevStep}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Registration;
