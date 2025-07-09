
import { useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Temporary types - will be replaced with Supabase types
type ComissionModel = 'CPA' | 'REV' | 'Hibrido';
type PaymentFrequency = 'semanal' | 'quinzenal' | 'mensal';
type PlatformType = 'Cassino' | 'Apostas Esportivas' | 'Poker' | 'Bingo' | 'Completa';
type TrafficType = string; // Will be properly typed later

interface ProfileEditFormProps {
  profileType: 'operador' | 'afiliado';
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isSaving?: boolean;
}

const ProfileEditForm = ({ profileType, onSave, onCancel, initialData, isSaving = false }: ProfileEditFormProps) => {
  console.log('📝 ProfileEditForm initialized with:', {
    profileType,
    initialData
  });

  const form = useForm({
    defaultValues: initialData || {}
  });

  // Update form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      console.log('🔄 ProfileEditForm: Resetting form with new data:', initialData);
      console.log('🔄 Current form values before reset:', form.getValues());
      form.reset(initialData);
      console.log('🔄 Form values after reset:', form.getValues());
    }
  }, [initialData, form]);

  const countries = ['Brasil', 'Portugal', 'Reino Unido', 'Espanha', 'Estados Unidos'];
  const languages = ['Português', 'Inglês', 'Espanhol'];
  const commissionModels: ComissionModel[] = ['CPA', 'REV', 'Hibrido'];
  const paymentFrequencies: PaymentFrequency[] = ['semanal', 'quinzenal', 'mensal'];
  const platformTypes: PlatformType[] = ['Cassino', 'Apostas Esportivas', 'Poker', 'Bingo', 'Completa'];
  
  const trafficTypes: TrafficType[] = [
    'SEO (blogs, sites de review, comparadores de odds)',
    'YouTube orgânico',
    'Google Ads',
    'Facebook Ads / Instagram Ads',
    'TikTok Ads',
    'DSPs (mídia programática)',
    'Push notifications',
    'Native ads (Taboola, Outbrain, etc.)',
    'Influenciadores (YouTube, Twitch, Kick)',
    'Grupos de Telegram',
    'Grupos de WhatsApp',
    'Canais de Discord',
    'E-mail marketing',
    'Pop-unders',
    'Redirects',
    'Cloaking',
    'Fake news pages',
    'Retargeting (via pixel ou DSP)',
    'Tráfego via apps (Android .apk ou app próprio)',
    'ASO (App Store Optimization)',
    'Fóruns de apostas / Reddit',
    'Tráfego direto (digitação de URL)',
    'SMS marketing',
    'Tráfego comprado de redes (revenda de tráfego de outros afiliados)'
  ];

  const handleFormSubmit = (data: any) => {
    console.log('📋 ProfileEditForm: Form submitted with data:', data);
    console.log('📋 Current form values:', form.getValues());
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 min-h-0 pb-0">
        <Tabs defaultValue="basic" className="w-full min-h-0">
          <TabsList className="grid w-full grid-cols-3 h-auto flex-shrink-0">
            <TabsTrigger value="basic" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Informações Básicas</span>
              <span className="sm:hidden">Básico</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Informações Comerciais</span>
              <span className="sm:hidden">Comercial</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm px-2 py-2">
              Contato
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o país" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idioma Principal</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            {profileType === 'operador' ? (
              <Card className="mb-0">
                <CardHeader>
                  <CardTitle>Informações do Operador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-6">
                  <FormField
                    control={form.control}
                    name="monthlyTrafficVolume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volume de Tráfego Mensal</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: 2.5M visitas/mês" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commissionModels"
                    render={() => (
                      <FormItem>
                        <FormLabel>Modelos de Comissionamento</FormLabel>
                        <div className="grid grid-cols-3 gap-4">
                          {commissionModels.map((model) => (
                            <FormField
                              key={model}
                              control={form.control}
                              name="commissionModels"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(model)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, model]);
                                        } else {
                                          field.onChange(current.filter((item: string) => item !== model));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {model}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periodicidade de Pagamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a periodicidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentFrequencies.map((freq) => (
                              <SelectItem key={freq} value={freq}>
                                {freq}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="platformType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Plataforma</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {platformTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="acceptsRetargeting"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Aceita Retargeting</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="installsPostback"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Instala Postback</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="whiteLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>White Label</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do white label" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-0">
                <CardHeader>
                  <CardTitle>Informações do Afiliado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-6">
                  <FormField
                    control={form.control}
                    name="chargedValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Cobrado</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: CPA $200 - REV 40%" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desiredCommissionMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Comissão Desejado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o método" />
                          </SelectTrigger>
                          <SelectContent>
                            {commissionModels.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="basicInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informações Básicas</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="Anos de experiência, público-alvo, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentOperators"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operadores Atuais (separados por vírgula)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="BetMaster Gaming, Lucky Casino Group" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="previousOperators"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operadores Anteriores (separados por vírgula)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Bet365, Betfair, Sportingbet" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trafficTypes"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tipos de Tráfego</FormLabel>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                          {trafficTypes.map((type) => (
                            <FormField
                              key={type}
                              control={form.control}
                              name="trafficTypes"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(type)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, type]);
                                        } else {
                                          field.onChange(current.filter((item: string) => item !== type));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-xs font-normal leading-tight">
                                    {type}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+55 11 99999-9999" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+55 11 3333-3333" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="@username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 justify-end mt-6 mb-0">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Perfil'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
