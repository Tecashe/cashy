import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle, XCircle, Clock, Zap, Plug, Settings, ChevronRight,
  CreditCard, ShoppingBag, Calendar, Database, Mail, MessageSquare,
  Cloud, Lock, Sparkles, TrendingUp, Users, Package, FileText
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MCPIntegrationSetup() {
  const [integrations, setIntegrations] = useState([
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payments',
      icon: '💳',
      description: 'Accept payments and manage subscriptions',
      status: 'disconnected', // disconnected, connecting, connected
      features: ['Payment links', 'Checkout sessions', 'Refunds', 'Customer management'],
      isPopular: true,
      requiresSetup: true,
      capabilities: [
        'Create payment links',
        'Process refunds',
        'Check payment status',
        'Manage customer subscriptions',
      ],
    },
    {
      id: 'shopify',
      name: 'Shopify',
      category: 'ecommerce',
      icon: '🛍️',
      description: 'Sync products and orders from your store',
      status: 'disconnected',
      features: ['Product sync', 'Order management', 'Inventory tracking', 'Customer data'],
      isPopular: true,
      requiresSetup: true,
      capabilities: [
        'Search products',
        'Check inventory',
        'Create orders',
        'Sync customer data',
      ],
    },
    {
      id: 'google_calendar',
      name: 'Google Calendar',
      category: 'scheduling',
      icon: '📅',
      description: 'Schedule and manage appointments',
      status: 'connected',
      features: ['Event creation', 'Availability checking', 'Reminders', 'Meeting links'],
      isPopular: true,
      requiresSetup: true,
      capabilities: [
        'Check availability',
        'Book appointments',
        'Send reminders',
        'Reschedule meetings',
      ],
      connectedAt: '2025-01-15T10:30:00Z',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'crm',
      icon: '🎯',
      description: 'Sync contacts and track customer interactions',
      status: 'disconnected',
      features: ['Contact sync', 'Deal tracking', 'Activity logging', 'Lead scoring'],
      isPopular: true,
      requiresSetup: true,
      capabilities: [
        'Create contacts',
        'Update deals',
        'Log activities',
        'Score leads',
      ],
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'crm',
      icon: '☁️',
      description: 'Enterprise CRM integration',
      status: 'disconnected',
      features: ['Account management', 'Opportunity tracking', 'Case management'],
      isPopular: false,
      requiresSetup: true,
      capabilities: [
        'Manage accounts',
        'Track opportunities',
        'Create cases',
        'Update records',
      ],
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      category: 'communication',
      icon: '📧',
      description: 'Send transactional emails',
      status: 'disconnected',
      features: ['Email templates', 'Delivery tracking', 'Analytics'],
      isPopular: false,
      requiresSetup: true,
      capabilities: [
        'Send emails',
        'Track delivery',
        'Manage templates',
      ],
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'communication',
      icon: '💬',
      description: 'Send notifications to your team',
      status: 'disconnected',
      features: ['Channel messages', 'Direct messages', 'File sharing'],
      isPopular: true,
      requiresSetup: true,
      capabilities: [
        'Send notifications',
        'Create channels',
        'Share updates',
      ],
    },
    {
      id: 'postgres',
      name: 'PostgreSQL',
      category: 'database',
      icon: '🐘',
      description: 'Query your database directly',
      status: 'disconnected',
      features: ['Read access', 'Query execution', 'Data analysis'],
      isPopular: false,
      requiresSetup: true,
      capabilities: [
        'Query data',
        'Analyze records',
        'Generate reports',
      ],
    },
  ]);

  const [setupModal, setSetupModal] = useState<any>(null);
  const [credentials, setCredentials] = useState<any>({});

  const categories = {
    payments: { label: 'Payments', icon: CreditCard, color: 'text-green-500' },
    ecommerce: { label: 'E-commerce', icon: ShoppingBag, color: 'text-blue-500' },
    scheduling: { label: 'Scheduling', icon: Calendar, color: 'text-purple-500' },
    crm: { label: 'CRM', icon: Users, color: 'text-orange-500' },
    communication: { label: 'Communication', icon: MessageSquare, color: 'text-pink-500' },
    database: { label: 'Database', icon: Database, color: 'text-gray-500' },
  };

  const stats = {
    connected: integrations.filter(i => i.status === 'connected').length,
    total: integrations.length,
    popular: integrations.filter(i => i.isPopular).length,
  };

  const handleConnect = (integration: any) => {
    setSetupModal(integration);
    setCredentials({});
  };

  const handleDisconnect = (id: string) => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      setIntegrations(integrations.map(i => 
        i.id === id ? { ...i, status: 'disconnected', connectedAt: undefined } : i
      ));
    }
  };

  const handleSaveCredentials = async () => {
    setIntegrations(integrations.map(i =>
      i.id === setupModal.id
        ? { ...i, status: 'connected', connectedAt: new Date().toISOString() }
        : i
    ));
    setSetupModal(null);
  };

  const getSetupFields = (integrationId: string) => {
    const fields: any = {
      stripe: [
        { key: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'sk_test_...' },
        { key: 'publishableKey', label: 'Publishable Key', type: 'text', placeholder: 'pk_test_...' },
      ],
      shopify: [
        { key: 'storeUrl', label: 'Store URL', type: 'text', placeholder: 'your-store.myshopify.com' },
        { key: 'accessToken', label: 'Admin API Access Token', type: 'password', placeholder: 'shpat_...' },
      ],
      google_calendar: [
        { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Your Google Client ID' },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Your secret' },
      ],
      hubspot: [
        { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Your HubSpot API key' },
      ],
      salesforce: [
        { key: 'username', label: 'Username', type: 'text', placeholder: 'user@company.com' },
        { key: 'password', label: 'Password', type: 'password' },
        { key: 'securityToken', label: 'Security Token', type: 'password' },
      ],
      sendgrid: [
        { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'SG.xxx...' },
      ],
      slack: [
        { key: 'botToken', label: 'Bot Token', type: 'password', placeholder: 'xoxb-...' },
        { key: 'channelId', label: 'Default Channel ID', type: 'text', placeholder: 'C1234567890' },
      ],
      postgres: [
        { key: 'host', label: 'Host', type: 'text', placeholder: 'localhost' },
        { key: 'port', label: 'Port', type: 'number', placeholder: '5432' },
        { key: 'database', label: 'Database', type: 'text', placeholder: 'mydb' },
        { key: 'username', label: 'Username', type: 'text' },
        { key: 'password', label: 'Password', type: 'password' },
      ],
    };

    return fields[integrationId] || [];
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your business tools to give AI superpowers
        </p>
      </div>

      {/* Hero Banner */}
      <Card className="border-2 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 text-white overflow-hidden">
        <CardContent className="pt-6 relative">
          <div className="relative z-10 flex items-start gap-6">
            <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
              <Sparkles className="w-12 h-12" />
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold">Model Context Protocol (MCP)</h2>
              <p className="text-white/90 max-w-2xl">
                MCP lets your AI access any service in real-time. No complex workflows - just connect your tools and AI handles the rest.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="secondary" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-right">
                <div className="text-4xl font-bold">{stats.connected}/{stats.total}</div>
                <div className="text-sm text-white/80">Connected</div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Connections</p>
                <p className="text-3xl font-bold mt-1">{stats.connected}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Popular Integrations</p>
                <p className="text-3xl font-bold mt-1">{stats.popular}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Tools</p>
                <p className="text-3xl font-bold mt-1">
                  {integrations.filter(i => i.status === 'connected')
                    .reduce((sum, i) => sum + i.capabilities.length, 0)}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({integrations.length})</TabsTrigger>
          <TabsTrigger value="connected">Connected ({stats.connected})</TabsTrigger>
          <TabsTrigger value="popular">Popular ({stats.popular})</TabsTrigger>
          {Object.entries(categories).map(([key, cat]) => (
            <TabsTrigger key={key} value={key} className="gap-2">
              <cat.icon className={`w-4 h-4 ${cat.color}`} />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Integrations */}
        <TabsContent value="all" className="space-y-4 mt-6">
          {Object.entries(categories).map(([categoryKey, category]) => {
            const categoryIntegrations = integrations.filter(i => i.category === categoryKey);
            if (categoryIntegrations.length === 0) return null;

            return (
              <div key={categoryKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <h3 className="font-semibold text-lg">{category.label}</h3>
                  <Badge variant="secondary">{categoryIntegrations.length}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {categoryIntegrations.map(integration => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={handleConnect}
                      onDisconnect={handleDisconnect}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* Connected */}
        <TabsContent value="connected" className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {integrations
              .filter(i => i.status === 'connected')
              .map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              ))}
          </div>
        </TabsContent>

        {/* Popular */}
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {integrations
              .filter(i => i.isPopular)
              .map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              ))}
          </div>
        </TabsContent>

        {/* Category tabs */}
        {Object.keys(categories).map(categoryKey => (
          <TabsContent key={categoryKey} value={categoryKey} className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              {integrations
                .filter(i => i.category === categoryKey)
                .map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Setup Modal */}
      <Dialog open={!!setupModal} onOpenChange={(open) => !open && setSetupModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{setupModal?.icon}</span>
              <div>
                <DialogTitle>Connect {setupModal?.name}</DialogTitle>
                <DialogDescription>{setupModal?.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Setup Instructions */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Your credentials are encrypted
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      All API keys and credentials are encrypted at rest and in transit. We never access your data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credentials Form */}
            <div className="space-y-4">
              {setupModal && getSetupFields(setupModal.id).map((field: any) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={credentials[field.key] || ''}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      [field.key]: e.target.value
                    })}
                  />
                </div>
              ))}
            </div>

            {/* AI Capabilities Preview */}
            <div className="space-y-3">
              <Label className="text-base">AI will be able to:</Label>
              <div className="grid grid-cols-2 gap-2">
                {setupModal?.capabilities.map((cap: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg border">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSetupModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCredentials}>
              <Plug className="w-4 h-4 mr-2" />
              Connect Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Integration Card Component
function IntegrationCard({ integration, onConnect, onDisconnect }: any) {
  const isConnected = integration.status === 'connected';

  return (
    <Card className={`hover:shadow-lg transition-all ${
      isConnected ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/10' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{integration.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                {integration.isPopular && (
                  <Badge variant="secondary" className="text-xs">Popular</Badge>
                )}
              </div>
              <CardDescription className="text-xs mt-1">
                {integration.description}
              </CardDescription>
            </div>
          </div>
          {isConnected ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-gray-300" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {integration.features.slice(0, 3).map((feature: string) => (
            <Badge key={feature} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {integration.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{integration.features.length - 3} more
            </Badge>
          )}
        </div>

        {/* Connection Status */}
        {isConnected && integration.connectedAt && (
          <div className="text-xs text-muted-foreground">
            Connected {new Date(integration.connectedAt).toLocaleDateString()}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDisconnect(integration.id)}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button 
              className="w-full" 
              size="sm"
              onClick={() => onConnect(integration)}
            >
              <Plug className="w-3 h-3 mr-1" />
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}