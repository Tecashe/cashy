// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import {
//   CheckCircle, ArrowRight, ArrowLeft, Sparkles, Building2, Target,
//   Zap, Key, ShoppingBag, Calendar, Users, Package, BookOpen, Rocket
// } from 'lucide-react';

// export default function OnboardingWizard() {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     // Step 1: Business Type
//     businessType: '',
    
//     // Step 2: Business Info
//     businessName: '',
//     businessDescription: '',
//     industry: '',
    
//     // Step 3: What to Automate
//     enableProducts: false,
//     enableBooking: false,
//     enableLeadQual: false,
//     enableSupport: false,
    
//     // Step 4: AI Setup
//     aiProvider: 'managed', // 'managed' or 'byok'
//     anthropicApiKey: '',
//     aiTone: 'professional',
//     aiPersonality: '',
    
//     // Step 5: Quick Knowledge
//     faqs: '',
//     policies: '',
//   });

//   const totalSteps = 5;
//   const progress = (step / totalSteps) * 100;

//   const businessTypes = [
//     {
//       id: 'coach',
//       icon: Users,
//       label: 'Coach / Consultant',
//       description: 'Fitness, life, business coaching',
//       features: ['Booking', 'Discovery calls', 'Follow-ups'],
//     },
//     {
//       id: 'ecommerce',
//       icon: ShoppingBag,
//       label: 'E-commerce Store',
//       description: 'Sell products online',
//       features: ['Product catalog', 'Payments', 'Order tracking'],
//     },
//     {
//       id: 'services',
//       icon: Package,
//       label: 'Service Provider',
//       description: 'Freelancer, agency, contractor',
//       features: ['Quote requests', 'Scheduling', 'Project inquiries'],
//     },
//     {
//       id: 'other',
//       icon: Building2,
//       label: 'Other Business',
//       description: 'Custom setup',
//       features: ['Flexible', 'Customizable', 'All features'],
//     },
//   ];

//   const handleNext = () => {
//     if (step < totalSteps) setStep(step + 1);
//   };

//   const handleBack = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const handleSubmit = async () => {
//     // Save to database
//     console.log('Submitting onboarding data:', formData);
    
//     // TODO: Call API to save business profile
//     // await fetch('/api/onboarding', { method: 'POST', body: JSON.stringify(formData) });
    
//     // Redirect to dashboard
//     window.location.href = '/dashboard';
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2 mb-4">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Sparkles className="w-6 h-6 text-primary" />
//             </div>
//             <h1 className="text-2xl font-bold">Welcome to AI Automation</h1>
//           </div>
//           <p className="text-muted-foreground">
//             Let's set up your business in 5 quick steps
//           </p>
//         </div>

//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-muted-foreground">
//               Step {step} of {totalSteps}
//             </span>
//             <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
//           </div>
//           <Progress value={progress} className="h-2" />
//         </div>

//         {/* Step Content */}
//         <Card className="border-2">
//           <CardContent className="pt-6 min-h-[500px] flex flex-col">
//             {/* STEP 1: Business Type */}
//             {step === 1 && (
//               <div className="space-y-6 flex-1">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">What type of business are you?</h2>
//                   <p className="text-muted-foreground">
//                     We'll customize your experience based on your business type
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   {businessTypes.map((type) => {
//                     const Icon = type.icon;
//                     const isSelected = formData.businessType === type.id;
                    
//                     return (
//                       <button
//                         key={type.id}
//                         onClick={() => setFormData({ ...formData, businessType: type.id })}
//                         className={`
//                           p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02]
//                           ${isSelected 
//                             ? 'border-primary bg-primary/5' 
//                             : 'border-border hover:border-primary/50'
//                           }
//                         `}
//                       >
//                         <div className="flex items-start gap-3 mb-3">
//                           <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
//                             <Icon className="w-5 h-5" />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-semibold mb-1">{type.label}</h3>
//                             <p className="text-sm text-muted-foreground">{type.description}</p>
//                           </div>
//                           {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {type.features.map((feature) => (
//                             <Badge key={feature} variant="secondary" className="text-xs">
//                               {feature}
//                             </Badge>
//                           ))}
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: Business Info */}
//             {step === 2 && (
//               <div className="space-y-6 flex-1">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
//                   <p className="text-muted-foreground">
//                     This helps AI understand your brand and communicate effectively
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName">Business Name *</Label>
//                     <Input
//                       id="businessName"
//                       placeholder="e.g., FitLife Coaching"
//                       value={formData.businessName}
//                       onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessDescription">What do you do? *</Label>
//                     <Textarea
//                       id="businessDescription"
//                       placeholder="e.g., I help busy professionals achieve their fitness goals through personalized coaching and accountability..."
//                       value={formData.businessDescription}
//                       onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
//                       rows={4}
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       AI will use this to understand your services and answer customer questions
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="industry">Industry (Optional)</Label>
//                     <Input
//                       id="industry"
//                       placeholder="e.g., Health & Wellness"
//                       value={formData.industry}
//                       onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 3: Features to Enable */}
//             {step === 3 && (
//               <div className="space-y-6 flex-1">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">What should AI help you with?</h2>
//                   <p className="text-muted-foreground">
//                     Select all that apply - you can change these later
//                   </p>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
//                     <Checkbox
//                       checked={formData.enableProducts}
//                       onCheckedChange={(checked) => 
//                         setFormData({ ...formData, enableProducts: checked as boolean })
//                       }
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <ShoppingBag className="w-4 h-4" />
//                         <span className="font-semibold">Sell Products</span>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         AI browses catalog, recommends products, and processes payments
//                       </p>
//                     </div>
//                   </label>

//                   <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
//                     <Checkbox
//                       checked={formData.enableBooking}
//                       onCheckedChange={(checked) => 
//                         setFormData({ ...formData, enableBooking: checked as boolean })
//                       }
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <Calendar className="w-4 h-4" />
//                         <span className="font-semibold">Book Appointments</span>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         AI checks availability and schedules meetings automatically
//                       </p>
//                     </div>
//                   </label>

//                   <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
//                     <Checkbox
//                       checked={formData.enableLeadQual}
//                       onCheckedChange={(checked) => 
//                         setFormData({ ...formData, enableLeadQual: checked as boolean })
//                       }
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <Target className="w-4 h-4" />
//                         <span className="font-semibold">Qualify Leads</span>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         AI asks qualifying questions and updates your CRM
//                       </p>
//                     </div>
//                   </label>

//                   <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
//                     <Checkbox
//                       checked={formData.enableSupport}
//                       onCheckedChange={(checked) => 
//                         setFormData({ ...formData, enableSupport: checked as boolean })
//                       }
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <Users className="w-4 h-4" />
//                         <span className="font-semibold">Customer Support</span>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         AI answers FAQs and creates support tickets when needed
//                       </p>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             )}

//             {/* STEP 4: AI Setup */}
//             {step === 4 && (
//               <div className="space-y-6 flex-1">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">Choose your AI setup</h2>
//                   <p className="text-muted-foreground">
//                     How would you like to power your AI assistant?
//                   </p>
//                 </div>

//                 <RadioGroup
//                   value={formData.aiProvider}
//                   onValueChange={(value) => setFormData({ ...formData, aiProvider: value })}
//                   className="space-y-3"
//                 >
//                   <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
//                     <RadioGroupItem value="managed" id="managed" />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Zap className="w-5 h-5 text-primary" />
//                         <span className="font-semibold text-lg">Managed AI (Recommended)</span>
//                         <Badge className="bg-green text-white">PRO</Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-3">
//                         We handle everything - just focus on your business
//                       </p>
//                       <div className="space-y-1 text-sm">
//                         <div className="flex items-center gap-2 text-muted-foreground">
//                           <CheckCircle className="w-4 h-4 text-green" />
//                           <span>No API key needed</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-muted-foreground">
//                           <CheckCircle className="w-4 h-4 text-green" />
//                           <span>Unlimited conversations</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-muted-foreground">
//                           <CheckCircle className="w-4 h-4 text-green" />
//                           <span>Priority support</span>
//                         </div>
//                       </div>
//                       <div className="mt-3 p-3 bg-muted rounded-lg">
//                         <p className="text-sm font-medium">$49/month + $0.01 per message</p>
//                       </div>
//                     </div>
//                   </label>

//                   <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
//                     <RadioGroupItem value="byok" id="byok" />
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Key className="w-5 h-5" />
//                         <span className="font-semibold text-lg">Bring Your Own Key</span>
//                         <Badge variant="secondary">FREE</Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-3">
//                         Use your own Anthropic API key - great for testing
//                       </p>
//                       <div className="space-y-1 text-sm">
//                         <div className="flex items-center gap-2 text-muted-foreground">
//                           <CheckCircle className="w-4 h-4" />
//                           <span>Free platform access</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-muted-foreground">
//                           <CheckCircle className="w-4 h-4" />
//                           <span>You control costs (~$3/1000 messages)</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-muted-foreground">
//                           <CheckCircle className="w-4 h-4" />
//                           <span>All features included</span>
//                         </div>
//                       </div>
//                     </div>
//                   </label>
//                 </RadioGroup>

//                 {formData.aiProvider === 'byok' && (
//                   <div className="space-y-4 animate-fade-in">
//                     <div className="space-y-2">
//                       <Label htmlFor="apiKey">Anthropic API Key *</Label>
//                       <Input
//                         id="apiKey"
//                         type="password"
//                         placeholder="sk-ant-api03-..."
//                         value={formData.anthropicApiKey}
//                         onChange={(e) => setFormData({ ...formData, anthropicApiKey: e.target.value })}
//                       />
//                       <p className="text-xs text-muted-foreground">
//                         Get your API key from{' '}
//                         <a href="https://console.anthropic.com" target="_blank" className="text-primary underline">
//                           console.anthropic.com
//                         </a>
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-4 pt-4 border-t">
//                   <div className="space-y-2">
//                     <Label htmlFor="aiTone">AI Personality</Label>
//                     <select
//                       id="aiTone"
//                       value={formData.aiTone}
//                       onChange={(e) => setFormData({ ...formData, aiTone: e.target.value })}
//                       className="w-full px-3 py-2 rounded-lg border bg-background"
//                     >
//                       <option value="professional">Professional</option>
//                       <option value="friendly">Friendly</option>
//                       <option value="casual">Casual</option>
//                       <option value="enthusiastic">Enthusiastic</option>
//                     </select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="aiPersonality">Custom Instructions (Optional)</Label>
//                     <Textarea
//                       id="aiPersonality"
//                       placeholder="e.g., Always use emojis, keep responses under 3 sentences, never use jargon..."
//                       value={formData.aiPersonality}
//                       onChange={(e) => setFormData({ ...formData, aiPersonality: e.target.value })}
//                       rows={3}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* STEP 5: Quick Knowledge */}
//             {step === 5 && (
//               <div className="space-y-6 flex-1">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">Add some quick knowledge</h2>
//                   <p className="text-muted-foreground">
//                     Help AI answer common questions (you can add more later)
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="faqs">Common Questions & Answers</Label>
//                     <Textarea
//                       id="faqs"
//                       placeholder="Q: What are your hours?&#10;A: Monday-Friday, 9am-5pm EST&#10;&#10;Q: Do you offer refunds?&#10;A: Yes, 30-day money-back guarantee"
//                       value={formData.faqs}
//                       onChange={(e) => setFormData({ ...formData, faqs: e.target.value })}
//                       rows={6}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="policies">Important Policies</Label>
//                     <Textarea
//                       id="policies"
//                       placeholder="e.g., We require 24-hour notice for cancellations. Late cancellations are charged 50%..."
//                       value={formData.policies}
//                       onChange={(e) => setFormData({ ...formData, policies: e.target.value })}
//                       rows={4}
//                     />
//                   </div>

//                   <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
//                     <CardContent className="pt-6">
//                       <div className="flex gap-3">
//                         <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
//                         <div className="text-sm">
//                           <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
//                             Pro tip: Keep it conversational
//                           </p>
//                           <p className="text-blue-700 dark:text-blue-300">
//                             Write how you'd naturally talk to a customer. AI will understand and use this context.
//                           </p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             )}

//             {/* Navigation */}
//             <div className="flex justify-between pt-6 border-t mt-6">
//               <Button
//                 variant="outline"
//                 onClick={handleBack}
//                 disabled={step === 1}
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Back
//               </Button>

//               {step < totalSteps ? (
//                 <Button
//                   onClick={handleNext}
//                   disabled={
//                     (step === 1 && !formData.businessType) ||
//                     (step === 2 && (!formData.businessName || !formData.businessDescription)) ||
//                     (step === 4 && formData.aiProvider === 'byok' && !formData.anthropicApiKey)
//                   }
//                 >
//                   Next
//                   <ArrowRight className="w-4 h-4 ml-2" />
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={handleSubmit}
//                   className="gap-2"
//                   size="lg"
//                 >
//                   <Rocket className="w-4 h-4" />
//                   Complete Setup
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Skip Option */}
//         {step < totalSteps && (
//           <div className="text-center mt-4">
//             <Button variant="ghost" size="sm" onClick={() => setStep(totalSteps)}>
//               Skip to the end →
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle, ArrowRight, ArrowLeft, Sparkles, Building2, Target,
  Zap, Key, ShoppingBag, Calendar, Users, Package, BookOpen, Rocket
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    businessDescription: '',
    industry: '',
    enableProducts: false,
    enableBooking: false,
    enableLeadQual: false,
    enableSupport: false,
    aiProvider: 'managed',
    anthropicApiKey: '',
    aiTone: 'professional',
    aiPersonality: '',
    faqs: '',
    policies: '',
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const businessTypes = [
    {
      id: 'coach',
      icon: Users,
      label: 'Coach / Consultant',
      description: 'Fitness, life, business coaching',
      features: ['Booking', 'Discovery calls', 'Follow-ups'],
    },
    {
      id: 'ecommerce',
      icon: ShoppingBag,
      label: 'E-commerce Store',
      description: 'Sell products online',
      features: ['Product catalog', 'Payments', 'Order tracking'],
    },
    {
      id: 'services',
      icon: Package,
      label: 'Service Provider',
      description: 'Freelancer, agency, contractor',
      features: ['Quote requests', 'Scheduling', 'Project inquiries'],
    },
    {
      id: 'other',
      icon: Building2,
      label: 'Other Business',
      description: 'Custom setup',
      features: ['Flexible', 'Customizable', 'All features'],
    },
  ];

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Onboarding failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!formData.businessType;
    if (step === 2) return formData.businessName && formData.businessDescription;
    if (step === 4 && formData.aiProvider === 'byok') return !!formData.anthropicApiKey;
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Welcome to AI Automation</h1>
          </div>
          <p className="text-muted-foreground">
            Let's set up your business in 5 quick steps
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <Card className="border-2">
          <CardContent className="pt-6 min-h-[500px] flex flex-col">
            {/* Step 1: Business Type */}
            {step === 1 && (
              <div className="space-y-6 flex-1">
                <div>
                  <h2 className="text-2xl font-bold mb-2">What type of business are you?</h2>
                  <p className="text-muted-foreground">
                    We'll customize your experience based on your business type
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {businessTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.businessType === type.id;
                    
                    return (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, businessType: type.id })}
                        className={`
                          p-6 rounded-xl border-2 text-left transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{type.label}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {type.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {step === 2 && (
              <div className="space-y-6 flex-1">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
                  <p className="text-muted-foreground">
                    This helps AI understand your brand and communicate effectively
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="e.g., FitLife Coaching"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">What do you do?</Label>
                    <Textarea
                      id="businessDescription"
                      placeholder="Describe your business, services, and what makes you unique..."
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry (Optional)</Label>
                    <Input
                      id="industry"
                      placeholder="e.g., Health & Wellness"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Features */}
            {step === 3 && (
              <div className="space-y-6 flex-1">
                <div>
                  <h2 className="text-2xl font-bold mb-2">What should AI help you with?</h2>
                  <p className="text-muted-foreground">
                    Select all that apply - you can change these later
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50">
                    <Checkbox
                      checked={formData.enableProducts}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, enableProducts: checked as boolean })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="font-semibold">Sell Products</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        AI browses catalog, recommends products, and processes payments
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50">
                    <Checkbox
                      checked={formData.enableBooking}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, enableBooking: checked as boolean })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">Book Appointments</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        AI checks availability and schedules meetings automatically
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50">
                    <Checkbox
                      checked={formData.enableLeadQual}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, enableLeadQual: checked as boolean })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4" />
                        <span className="font-semibold">Qualify Leads</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        AI asks qualifying questions and updates your CRM
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50">
                    <Checkbox
                      checked={formData.enableSupport}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, enableSupport: checked as boolean })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">Customer Support</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        AI answers FAQs and creates support tickets when needed
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: AI Setup */}
            {step === 4 && (
              <div className="space-y-6 flex-1">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Choose your AI setup</h2>
                  <p className="text-muted-foreground">
                    How would you like to power your AI assistant?
                  </p>
                </div>

                <RadioGroup
                  value={formData.aiProvider}
                  onValueChange={(value) => setFormData({ ...formData, aiProvider: value })}
                  className="space-y-3"
                >
                  <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50">
                    <RadioGroupItem value="managed" id="managed" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-lg">Managed AI</span>
                        <Badge className="bg-green text-white">Recommended</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        We handle everything - just focus on your business
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green" />
                          <span>No API key needed</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green" />
                          <span>Unlimited conversations</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green" />
                          <span>Priority support</span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">$49/month + $0.01 per message</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50">
                    <RadioGroupItem value="byok" id="byok" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-5 h-5" />
                        <span className="font-semibold text-lg">Bring Your Own Key</span>
                        <Badge variant="secondary">FREE</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Use your own Anthropic API key - great for testing
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4" />
                          <span>Free platform access</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4" />
                          <span>You control costs (~$3/1000 messages)</span>
                        </div>
                      </div>
                    </div>
                  </label>
                </RadioGroup>

                {formData.aiProvider === 'byok' && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="apiKey">Anthropic API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-ant-api03-..."
                      value={formData.anthropicApiKey}
                      onChange={(e) => setFormData({ ...formData, anthropicApiKey: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your API key from console.anthropic.com
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Knowledge */}
            {step === 5 && (
              <div className="space-y-6 flex-1">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Add some quick knowledge</h2>
                  <p className="text-muted-foreground">
                    Help AI answer common questions (you can add more later)
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="faqs">Common Questions & Answers</Label>
                    <Textarea
                      id="faqs"
                      placeholder="Q: What are your hours?&#10;A: Monday-Friday, 9am-5pm EST"
                      value={formData.faqs}
                      onChange={(e) => setFormData({ ...formData, faqs: e.target.value })}
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policies">Important Policies</Label>
                    <Textarea
                      id="policies"
                      placeholder="e.g., We require 24-hour notice for cancellations..."
                      value={formData.policies}
                      onChange={(e) => setFormData({ ...formData, policies: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}