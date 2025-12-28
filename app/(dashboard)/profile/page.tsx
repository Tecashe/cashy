import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2, Sparkles, BookOpen, Settings, Key, CheckCircle,
  Package, Calendar, CreditCard, Users, Save, AlertCircle
} from 'lucide-react';

export default function BusinessProfileManager() {
  const [profile, setProfile] = useState({
    businessName: 'FitLife Coaching',
    businessDescription: 'I help busy professionals achieve their fitness goals through personalized coaching...',
    businessType: 'coach',
    industry: 'Health & Wellness',
    
    aiTone: 'professional',
    aiPersonality: '',
    aiInstructions: 'Always be encouraging. Keep responses under 3 sentences.',
    
    enableProducts: false,
    enableBooking: true,
    enablePayments: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Call API to update profile
      await fetch('/api/business/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your business information and AI settings
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
          size="lg"
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>

      {/* Status Banner */}
      <Card className="border-2 border-green/20 bg-green/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Profile Active</h3>
              <p className="text-sm text-muted-foreground">
                Your AI assistant is live and using this business information to help customers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">
            <Building2 className="w-4 h-4 mr-2" />
            Business Info
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BookOpen className="w-4 h-4 mr-2" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="features">
            <Settings className="w-4 h-4 mr-2" />
            Features
          </TabsTrigger>
        </TabsList>

        {/* BUSINESS INFO TAB */}
        <TabsContent value="business" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                This information helps AI understand and represent your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <select
                    id="businessType"
                    value={profile.businessType}
                    onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-background"
                  >
                    <option value="coach">Coach / Consultant</option>
                    <option value="ecommerce">E-commerce Store</option>
                    <option value="services">Service Provider</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description *</Label>
                <Textarea
                  id="businessDescription"
                  value={profile.businessDescription}
                  onChange={(e) => setProfile({ ...profile, businessDescription: e.target.value })}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Describe what you do, who you serve, and what makes you unique
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How customers can reach you outside Instagram
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="contact@business.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://yourbusiness.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI SETTINGS TAB */}
        <TabsContent value="ai" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Personality</CardTitle>
              <CardDescription>
                Define how your AI assistant communicates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiTone">Conversation Tone</Label>
                <select
                  id="aiTone"
                  value={profile.aiTone}
                  onChange={(e) => setProfile({ ...profile, aiTone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="empathetic">Empathetic</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiInstructions">Custom Instructions</Label>
                <Textarea
                  id="aiInstructions"
                  value={profile.aiInstructions}
                  onChange={(e) => setProfile({ ...profile, aiInstructions: e.target.value })}
                  placeholder="e.g., Always use emojis, keep responses under 3 sentences, be encouraging..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  These instructions will be included in every AI conversation
                </p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Example Instructions
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Keep all responses under 50 words</li>
                  <li>Always ask a follow-up question</li>
                  <li>Use emojis sparingly (1-2 per message)</li>
                  <li>Never mention competitor brands</li>
                  <li>Always offer to book a call if they seem interested</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Manage your AI provider settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Key className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Managed AI</p>
                    <p className="text-sm text-muted-foreground">
                      Using platform API key
                    </p>
                  </div>
                </div>
                <Badge className="bg-green text-white">Active</Badge>
              </div>

              <Button variant="outline" className="w-full">
                Switch to Bring Your Own Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KNOWLEDGE BASE TAB */}
        <TabsContent value="knowledge" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>FAQs & Common Questions</CardTitle>
              <CardDescription>
                Questions customers frequently ask
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Q: What are your hours?&#10;A: Monday-Friday, 9am-5pm EST&#10;&#10;Q: Do you offer refunds?&#10;A: Yes, 30-day money-back guarantee"
                rows={10}
              />
              <p className="text-xs text-muted-foreground mt-2">
                AI will reference these when answering customer questions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Policies</CardTitle>
              <CardDescription>
                Important policies AI should know about
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., We require 24-hour notice for cancellations. Late cancellations are charged 50%..."
                rows={6}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents & Resources</CardTitle>
              <CardDescription>
                Upload PDFs, docs, or other reference materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium mb-1">No documents uploaded</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload PDFs, Word docs, or text files
                </p>
                <Button>Upload Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FEATURES TAB */}
        <TabsContent value="features" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Enabled Features</CardTitle>
              <CardDescription>
                Control what AI can do for your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:border-primary/50">
                  <input
                    type="checkbox"
                    checked={profile.enableProducts}
                    onChange={(e) => setProfile({ ...profile, enableProducts: e.target.checked })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4" />
                      <span className="font-semibold">Product Catalog</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI can browse products, check inventory, and recommend items
                    </p>
                    {profile.enableProducts && (
                      <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                        Manage Products →
                      </Button>
                    )}
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:border-primary/50">
                  <input
                    type="checkbox"
                    checked={profile.enableBooking}
                    onChange={(e) => setProfile({ ...profile, enableBooking: e.target.checked })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">Appointment Booking</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI can check availability and schedule appointments
                    </p>
                    {profile.enableBooking && (
                      <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                        Connect Calendar →
                      </Button>
                    )}
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:border-primary/50">
                  <input
                    type="checkbox"
                    checked={profile.enablePayments}
                    onChange={(e) => setProfile({ ...profile, enablePayments: e.target.checked })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold">Payment Processing</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI can generate secure payment links via Stripe
                    </p>
                    {profile.enablePayments && (
                      <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                        Connect Stripe →
                      </Button>
                    )}
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}