
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users, ShoppingBag, Package, Calendar, Sparkles, Search,
  CheckCircle, Clock, MessageSquare, Zap, TrendingUp
} from 'lucide-react';

export default function TemplateLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 'coach-welcome',
      name: 'Welcome & Book Discovery Call',
      category: 'coach',
      icon: Users,
      description: 'Greet new leads and help them schedule a free discovery call',
      triggers: ['First message'],
      actions: ['AI Response', 'Book Appointment'],
      popular: true,
      config: {
        trigger: { type: 'FIRST_MESSAGE' },
        actions: [{
          type: 'AI_RESPONSE',
          config: {
            enableBooking: true,
            systemPrompt: 'Warmly welcome the person. Introduce yourself as the AI assistant. Ask about their goals and offer to book a free discovery call to discuss how you can help them.',
          }
        }]
      }
    },
    {
      id: 'coach-follow-up',
      name: 'Post-Session Follow-Up',
      category: 'coach',
      icon: MessageSquare,
      description: 'Automatic follow-up 24 hours after a coaching session',
      triggers: ['After appointment'],
      actions: ['Delay', 'Send Message'],
      popular: false,
      config: {
        trigger: { type: 'APPOINTMENT_COMPLETED' },
        actions: [
          { type: 'DELAY', config: { delayHours: 24 } },
          { type: 'SEND_MESSAGE', config: {
            message: 'Hey {first_name}! 👋 How are you feeling after yesterday\'s session? Any questions come up? I\'m here to help!'
          }}
        ]
      }
    },
    {
      id: 'ecom-product-rec',
      name: 'Product Recommendations',
      category: 'ecommerce',
      icon: ShoppingBag,
      description: 'AI browses catalog and recommends products based on customer needs',
      triggers: ['DM received'],
      actions: ['AI Response', 'Product Carousel'],
      popular: true,
      config: {
        trigger: { type: 'DM_RECEIVED' },
        actions: [{
          type: 'AI_RESPONSE',
          config: {
            enableCommerce: true,
            enableProductCatalog: true,
            systemPrompt: 'Help customers find products. Ask about their preferences, budget, and needs. Show relevant products using the catalog.',
          }
        }]
      }
    },
    {
      id: 'ecom-cart-abandon',
      name: 'Cart Abandonment Recovery',
      category: 'ecommerce',
      icon: TrendingUp,
      description: 'Follow up when customer doesn\'t complete checkout',
      triggers: ['Cart abandoned'],
      actions: ['Delay', 'AI Response', 'Payment Link'],
      popular: true,
      config: {
        trigger: { type: 'CART_ABANDONED' },
        actions: [
          { type: 'DELAY', config: { delayHours: 2 } },
          { type: 'AI_RESPONSE', config: {
            systemPrompt: 'Gently remind them about items in cart. Offer help if they have questions. Make checkout easy with payment link.',
            enablePayments: true,
          }}
        ]
      }
    },
    {
      id: 'ecom-order-confirm',
      name: 'Order Confirmation',
      category: 'ecommerce',
      icon: CheckCircle,
      description: 'Send order details and tracking info after purchase',
      triggers: ['Order placed'],
      actions: ['Send Message', 'Add Tag'],
      popular: false,
      config: {
        trigger: { type: 'ORDER_PLACED' },
        actions: [
          { type: 'SEND_MESSAGE', config: {
            message: '🎉 Order confirmed! Order #{order_id}\n\nWe\'ll send tracking info soon. Questions? Just reply here!'
          }},
          { type: 'ADD_TAG', config: { tag: 'customer' }}
        ]
      }
    },
    {
      id: 'service-quote',
      name: 'Service Quote Request',
      category: 'services',
      icon: Package,
      description: 'Collect project details and provide instant quote',
      triggers: ['Keyword: quote', 'Keyword: price'],
      actions: ['AI Response', 'Add Tag'],
      popular: true,
      config: {
        trigger: { type: 'KEYWORD', conditions: { keywords: ['quote', 'price', 'cost'] }},
        actions: [{
          type: 'AI_RESPONSE',
          config: {
            systemPrompt: 'Ask about project scope, timeline, and budget. Gather enough details to provide an accurate quote. If pricing is straightforward, provide an estimate.',
          }
        }]
      }
    },
    {
      id: 'service-consultation',
      name: 'Free Consultation Booking',
      category: 'services',
      icon: Calendar,
      description: 'Schedule free consultation calls with prospects',
      triggers: ['Keyword: consultation', 'First message'],
      actions: ['AI Response', 'Book Appointment'],
      popular: true,
      config: {
        trigger: { type: 'KEYWORD', conditions: { keywords: ['consult', 'call', 'meeting'] }},
        actions: [{
          type: 'AI_RESPONSE',
          config: {
            enableBooking: true,
            systemPrompt: 'Offer a free 30-minute consultation to discuss their project. Check calendar availability and book a time that works for them.',
          }
        }]
      }
    },
    {
      id: 'universal-support',
      name: 'Smart Customer Support',
      category: 'all',
      icon: Sparkles,
      description: 'AI answers FAQs and creates tickets for complex issues',
      triggers: ['DM received'],
      actions: ['AI Response', 'Create Ticket'],
      popular: true,
      config: {
        trigger: { type: 'DM_RECEIVED' },
        actions: [{
          type: 'AI_RESPONSE',
          config: {
            useKnowledgeBase: true,
            autoHandoff: true,
            systemPrompt: 'Answer customer questions using the knowledge base. If you can\'t help or they seem frustrated, create a support ticket and let them know someone will follow up.',
          }
        }]
      }
    },
    {
      id: 'universal-story-reply',
      name: 'Story Reply Engagement',
      category: 'all',
      icon: Zap,
      description: 'Automatically engage with story replies',
      triggers: ['Story reply'],
      actions: ['AI Response'],
      popular: false,
      config: {
        trigger: { type: 'STORY_REPLY' },
        actions: [{
          type: 'AI_RESPONSE',
          config: {
            systemPrompt: 'Respond warmly to their story reply. Start a conversation and see if you can help them or answer questions.',
          }
        }]
      }
    },
  ];

  const categories = [
    { id: 'all', label: 'All Templates', icon: Sparkles },
    { id: 'coach', label: 'Coaching', icon: Users },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag },
    { id: 'services', label: 'Services', icon: Package },
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory || t.category === 'all';
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = async (template: any) => {
    // TODO: Create automation from template
    console.log('Using template:', template);
    
    const response = await fetch('/api/automations/from-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: template.id, config: template.config }),
    });
    
    if (response.ok) {
      window.location.href = '/dashboard/automations';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automation Templates</h1>
        <p className="text-muted-foreground mt-1">
          Start with proven automation workflows for your industry
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className="gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </Button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  {template.popular && (
                    <Badge className="bg-yellow text-black">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Triggers */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">TRIGGERS</p>
                  <div className="flex flex-wrap gap-1">
                    {template.triggers.map((trigger, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">ACTIONS</p>
                  <div className="flex flex-wrap gap-1">
                    {template.actions.map((action, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Use Button */}
                <Button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full"
                  variant="outline"
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your search</p>
        </div>
      )}
    </div>
  );
}