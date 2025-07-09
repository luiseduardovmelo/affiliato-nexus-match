import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { RegistrationData, UserType } from '@/types/registration';

interface UseRegistrationResult {
  isLoading: boolean;
  register: (data: RegistrationData) => Promise<{ success: boolean; error?: string }>;
}

export const useRegistration = (): UseRegistrationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const register = async (data: RegistrationData) => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting registration process...', { email: data.basicData.email, userType: data.userType });
      
      // Step 1: Create user in Supabase Auth
      console.log('📧 Creating user in Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.basicData.email,
        password: data.basicData.password,
        options: {
          data: {
            display_name: data.basicData.displayName,
            country: data.basicData.country,
            role: data.userType,
          }
        }
      });

      if (authError) {
        console.error('❌ Auth error:', authError);
        throw authError;
      }

      const userId = authData.user?.id;
      console.log('✅ Auth user created:', { userId, email: authData.user?.email });
      if (!userId) throw new Error('Usuário não foi criado corretamente');

      // Step 2: Create user profile in users table
      console.log('👤 Creating user profile in users table...');
      const userInsertData = {
        id: userId,
        email: data.basicData.email,
        display_name: data.basicData.displayName,
        country: data.basicData.country,
        role: data.userType,
        status: 'active' as const,
        password_hash: 'managed_by_supabase_auth', // Required field in schema
        phone: data.basicData.phone || '' // Required field in database
      };
      
      console.log('📋 User insert data:', userInsertData);
      
      const { error: userError } = await supabase
        .from('users')
        .insert(userInsertData);

      if (userError) {
        console.error('❌ User table error details:', {
          message: userError.message,
          details: userError.details,
          hint: userError.hint,
          code: userError.code,
          full_error: userError
        });
        throw userError;
      }
      console.log('✅ User profile created successfully');

      // Step 3: Create specific profile based on user type
      if (data.userType === 'afiliado') {
        console.log('💼 Creating affiliate profile...', { specificData: data.specificData });
        const { error: affiliateError } = await supabase
          .from('affiliate_specs')
          .insert({
            user_id: userId,
            traffic_sources: (data.specificData as any).trafficSources || [],
            commission_model: (data.specificData as any).commissionModel || 'CPA',
            work_languages: (data.specificData as any).workLanguages || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (affiliateError) {
          console.error('❌ Affiliate profile error:', affiliateError);
          throw affiliateError;
        }
        console.log('✅ Affiliate profile created successfully');
      } else if (data.userType === 'operador') {
        console.log('🏢 Creating operator profile...', { specificData: data.specificData });
        const { error: operatorError } = await supabase
          .from('operator_specs')
          .insert({
            user_id: userId,
            monthly_volume: (data.specificData as any).monthlyVolume || '',
            commission_models: (data.specificData as any).commissionModels || [],
            payment_schedule: (data.specificData as any).paymentSchedule || 'monthly',
            accepted_countries: (data.specificData as any).acceptedCountries || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (operatorError) {
          console.error('❌ Operator profile error:', operatorError);
          throw operatorError;
        }
        console.log('✅ Operator profile created successfully');
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao iGaming Connect. Redirecionando...",
      });

      // Redirect to main app after successful registration
      setTimeout(() => {
        navigate('/');
      }, 1500);

      return { success: true };

    } catch (error: any) {
      console.error('❌ Registration error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        full_error: error
      });
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
        errorMessage = 'Este email já está registrado.';
      } else if (error.message?.includes('invalid email')) {
        errorMessage = 'Email inválido.';
      } else if (error.message?.includes('weak password')) {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
      } else if (error.message?.includes('duplicate key') || error.code === '23505') {
        errorMessage = 'Este usuário já existe no sistema.';
      } else if (error.message?.includes('violates')) {
        errorMessage = 'Erro de validação de dados. Verifique os campos obrigatórios.';
      }

      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    register
  };
};

// Helper function to create a complete user profile
export const createUserProfile = async (
  userId: string, 
  userType: UserType, 
  basicData: any, 
  specificData: any
) => {
  try {
    console.log('🔧 createUserProfile called with:', { userId, userType, basicData, specificData });
    
    // Update user profile with additional data
    console.log('📝 Updating users table...');
    const userUpdateData = {
      display_name: basicData.displayName,
      country: basicData.country,
      phone: basicData.phone,
      language: basicData.language,
      telegram: basicData.telegram,
      description: basicData.description || '',
      updated_at: new Date().toISOString()
    };
    console.log('📋 User update data:', userUpdateData);
    
    const { error: updateError } = await supabase
      .from('users')
      .update(userUpdateData)
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Users table update error:', updateError);
      throw updateError;
    }
    console.log('✅ Users table updated successfully');

    // Create or update specific profile
    if (userType === 'afiliado') {
      console.log('💼 Updating affiliate_specs table...');
      const affiliateUpdateData = {
        user_id: userId,
        description: specificData.description || '',
        traffic_sources: specificData.trafficSources || [],
        commission_model: specificData.commissionModel || 'CPA',
        work_languages: specificData.workLanguages || [],
        charged_value: specificData.chargedValue || '',
        basic_info: specificData.basicInfo || '',
        current_operators: specificData.currentOperators || '',
        previous_operators: specificData.previousOperators || '',
        updated_at: new Date().toISOString()
      };
      console.log('📋 Affiliate update data:', affiliateUpdateData);
      
      const { error: affiliateError } = await supabase
        .from('affiliate_specs')
        .upsert(affiliateUpdateData);

      if (affiliateError) {
        console.error('❌ Affiliate specs update error:', affiliateError);
        throw affiliateError;
      }
      console.log('✅ Affiliate specs updated successfully');
    } else if (userType === 'operador') {
      console.log('🏢 Updating operator_specs table...');
      const operatorUpdateData = {
        user_id: userId,
        description: specificData.description || '',
        monthly_volume: specificData.monthlyVolume || '',
        commission_models: specificData.commissionModels || [],
        payment_schedule: specificData.paymentSchedule || 'monthly',
        accepted_countries: specificData.acceptedCountries || [],
        platform_type: specificData.platformType || '',
        accepts_retargeting: specificData.acceptsRetargeting || false,
        installs_postback: specificData.installsPostback || false,
        white_label: specificData.whiteLabel || '',
        updated_at: new Date().toISOString()
      };
      console.log('📋 Operator update data:', operatorUpdateData);
      
      const { error: operatorError } = await supabase
        .from('operator_specs')
        .upsert(operatorUpdateData);

      if (operatorError) {
        console.error('❌ Operator specs update error:', operatorError);
        throw operatorError;
      }
      console.log('✅ Operator specs updated successfully');
    }

    console.log('🎉 Profile update completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Profile creation error:', error);
    return { success: false, error: error.message || error };
  }
};