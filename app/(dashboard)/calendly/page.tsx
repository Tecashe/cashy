import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, CheckCircle, XCircle, ExternalLink, RefreshCw,
  Clock, Users, Link2, Zap, AlertCircle
} from 'lucide-react';

export default function CalendlyIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/integrations/calendly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          calendlyUrl,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setEventTypes(data.eventTypes || []);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/integrations/calendly', {
        method: 'DELETE',
      });
      
      setIsConnected(false);
      setEventTypes([]);
      setApiKey('');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendly Integration</h1>
          <p className="text-muted-foreground mt-1">
            Let AI schedule appointments automatically
          </p>
        </div>
        {isConnected && (
          <Badge className="gap-2 bg-green text-white">
            <CheckCircle className="w-4 h-4" />
            Connected
          </Badge>
        )}
      </div>

      {/* How it Works */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary rounded-lg">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">How AI Booking Works</h3>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Customer asks to book an appointment in Instagram DMs</li>
                <li>AI checks your Calendly availability in real-time</li>
                <li>AI suggests available time slots</li>
                <li>Customer confirms, AI books the meeting</li>
                <li>Both parties receive confirmation + calendar invite</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isConnected ? (
        /* Setup Form */
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Calendly Account</CardTitle>
            <CardDescription>
              We'll need your API key and scheduling link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  1
                </div>
                <h3 className="font-semibold">Get Your Calendly API Key</h3>
              </div>
              
              <Card className="bg-muted/50 border-0">
                <CardContent className="pt-6 space-y-3">
                  <p className="text-sm">
                    1. Go to{' '}
                    <a 
                      href="https://calendly.com/integrations/api_webhooks" 
                      target="_blank"
                      className="text-primary underline inline-flex items-center gap-1"
                    >
                      Calendly API & Webhooks
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                  <p className="text-sm">2. Click "Generate New Token"</p>
                  <p className="text-sm">3. Copy your Personal Access Token</p>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="apiKey">Calendly API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiJ9..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  2
                </div>
                <h3 className="font-semibold">Your Calendly Scheduling Link</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calendlyUrl">Scheduling Link *</Label>
                <Input
                  id="calendlyUrl"
                  placeholder="https://calendly.com/your-username"
                  value={calendlyUrl}
                  onChange={(e) => setCalendlyUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This is your main Calendly profile URL
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <Button
              onClick={handleConnect}
              disabled={!apiKey || !calendlyUrl || isConnecting}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect Calendly
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Connected State */
        <div className="space-y-6">
          {/* Connection Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green" />
                Connected Successfully
              </CardTitle>
              <CardDescription>
                AI can now access your calendar and schedule appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Calendly URL</Label>
                  <p className="text-sm font-mono truncate">{calendlyUrl}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green rounded-full" />
                    <span className="text-sm">Active</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="w-full"
              >
                Disconnect Calendly
              </Button>
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card>
            <CardHeader>
              <CardTitle>Your Event Types</CardTitle>
              <CardDescription>
                AI can book any of these meeting types
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventTypes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No event types found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventTypes.map((event: any) => (
                    <div
                      key={event.uri}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{event.name}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.duration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={event.active ? "default" : "secondary"}>
                        {event.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Booking Settings */}
          <Card>
            <CardHeader>
              <CardTitle>AI Booking Settings</CardTitle>
              <CardDescription>
                Customize how AI handles scheduling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Event Type</Label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                >
                  <option value="">Auto-detect from conversation</option>
                  {eventTypes.map((event: any) => (
                    <option key={event.uri} value={event.uri}>
                      {event.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  AI will suggest this event type if customer doesn't specify
                </p>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border">
                <input type="checkbox" id="autoConfirm" className="mt-1" defaultChecked />
                <div className="flex-1">
                  <label htmlFor="autoConfirm" className="font-medium text-sm cursor-pointer">
                    Auto-confirm bookings
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI books immediately after customer confirms time. Otherwise, creates a pending booking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border">
                <input type="checkbox" id="sendReminders" className="mt-1" defaultChecked />
                <div className="flex-1">
                  <label htmlFor="sendReminders" className="font-medium text-sm cursor-pointer">
                    Send reminders via DM
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI sends a reminder message 24 hours before the appointment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Integration */}
          <Card className="border-2 border-blue-500/20 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                    Test Your Integration
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Send a test message to your Instagram DMs: "I'd like to book a call"
                  </p>
                  <Button variant="outline" size="sm">
                    Send Test Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}