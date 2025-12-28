// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Brain, Book, Users, Zap, AlertTriangle, MessageSquare, Settings, Plus, X } from 'lucide-react';

// export default function AdvancedAIConfig() {
//   const [config, setConfig] = useState({
//     // Basic Settings
//     model: 'claude-sonnet-4-5',
//     tone: 'professional',
//     language: 'auto',
//     maxTokens: 500,
//     temperature: 0.7,
    
//     // Personality
//     systemPrompt: '',
//     customInstructions: '',
//     exampleConversations: [],
    
//     // Knowledge Base
//     useKnowledgeBase: true,
//     knowledgeBaseDocs: [],
//     searchMode: 'semantic',
    
//     // Behavior
//     autoHandoff: true,
//     handoffTriggers: ['frustrated', 'angry', 'wants_human'],
//     maxTurns: 10,
//     confidenceThreshold: 0.7,
    
//     // Safety
//     contentFiltering: true,
//     sensitiveTopics: ['pricing', 'refunds', 'legal'],
//     requireApproval: false,
    
//     // Memory
//     useConversationHistory: true,
//     historyDepth: 20,
//     rememberUserPreferences: true,
    
//     // Functions
//     enabledFunctions: [],
    
//     // Response Style
//     useEmojis: true,
//     responseLength: 'medium',
//     includeQuestions: true,
//     personalizeResponses: true,
//   });

//   const [newExample, setNewExample] = useState({ user: '', assistant: '' });
//   const [newDocument, setNewDocument] = useState('');

//   const TONES = [
//     { value: 'professional', label: 'Professional', icon: '💼' },
//     { value: 'friendly', label: 'Friendly', icon: '😊' },
//     { value: 'casual', label: 'Casual', icon: '👋' },
//     { value: 'enthusiastic', label: 'Enthusiastic', icon: '🎉' },
//     { value: 'empathetic', label: 'Empathetic', icon: '❤️' },
//     { value: 'humorous', label: 'Humorous', icon: '😄' },
//   ];

//   const AVAILABLE_FUNCTIONS = [
//     { id: 'book_appointment', name: 'Book Appointment', description: 'Let AI schedule appointments' },
//     { id: 'check_order', name: 'Check Order Status', description: 'Query order information' },
//     { id: 'product_search', name: 'Product Search', description: 'Find products in catalog' },
//     { id: 'faq_lookup', name: 'FAQ Lookup', description: 'Search knowledge base' },
//     { id: 'create_ticket', name: 'Create Support Ticket', description: 'Log issues automatically' },
//   ];

//   const addExample = () => {
//     if (newExample.user && newExample.assistant) {
//       setConfig({
//         ...config,
//         exampleConversations: [...config.exampleConversations, { ...newExample, id: Date.now() }]
//       });
//       setNewExample({ user: '', assistant: '' });
//     }
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">AI Response Configuration</h2>
//           <p className="text-muted-foreground mt-1">
//             Create a highly customized AI assistant for your Instagram automation
//           </p>
//         </div>
//         <Badge variant="secondary" className="px-3 py-1">
//           <Brain className="w-4 h-4 mr-2" />
//           Claude Sonnet 4.5
//         </Badge>
//       </div>

//       <Tabs defaultValue="personality" className="w-full">
//         <TabsList className="grid w-full grid-cols-6">
//           <TabsTrigger value="personality">
//             <MessageSquare className="w-4 h-4 mr-2" />
//             Personality
//           </TabsTrigger>
//           <TabsTrigger value="knowledge">
//             <Book className="w-4 h-4 mr-2" />
//             Knowledge
//           </TabsTrigger>
//           <TabsTrigger value="behavior">
//             <Users className="w-4 h-4 mr-2" />
//             Behavior
//           </TabsTrigger>
//           <TabsTrigger value="functions">
//             <Zap className="w-4 h-4 mr-2" />
//             Functions
//           </TabsTrigger>
//           <TabsTrigger value="safety">
//             <AlertTriangle className="w-4 h-4 mr-2" />
//             Safety
//           </TabsTrigger>
//           <TabsTrigger value="advanced">
//             <Settings className="w-4 h-4 mr-2" />
//             Advanced
//           </TabsTrigger>
//         </TabsList>

//         {/* PERSONALITY TAB */}
//         <TabsContent value="personality" className="space-y-4 mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>AI Personality & Tone</CardTitle>
//               <CardDescription>
//                 Define how your AI should communicate with customers
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-2">
//                 <Label>Conversation Tone</Label>
//                 <div className="grid grid-cols-3 gap-3">
//                   {TONES.map((tone) => (
//                     <Button
//                       key={tone.value}
//                       variant={config.tone === tone.value ? "default" : "outline"}
//                       onClick={() => setConfig({ ...config, tone: tone.value })}
//                       className="justify-start"
//                     >
//                       <span className="mr-2">{tone.icon}</span>
//                       {tone.label}
//                     </Button>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>System Prompt</Label>
//                 <Textarea
//                   placeholder="You are a helpful customer service assistant for [Your Brand]. You are knowledgeable, patient, and always aim to solve customer problems efficiently..."
//                   value={config.systemPrompt}
//                   onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
//                   rows={6}
//                   className="font-mono text-sm"
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   This is the core instruction that defines your AI's role and behavior
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label>Custom Instructions</Label>
//                 <Textarea
//                   placeholder="- Always greet users warmly&#10;- Keep responses under 3 sentences when possible&#10;- Use emojis sparingly&#10;- Ask clarifying questions when uncertain&#10;- Always end with a helpful next step"
//                   value={config.customInstructions}
//                   onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
//                   rows={8}
//                 />
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <Label>Example Conversations (Few-Shot Learning)</Label>
//                   <Badge variant="secondary">
//                     {config.exampleConversations.length} examples
//                   </Badge>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Teach your AI by example. Show it how you want it to respond in specific scenarios.
//                 </p>
                
//                 {config.exampleConversations.map((example) => (
//                   <Card key={example.id} className="relative">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="absolute top-2 right-2"
//                       onClick={() => setConfig({
//                         ...config,
//                         exampleConversations: config.exampleConversations.filter(e => e.id !== example.id)
//                       })}
//                     >
//                       <X className="w-4 h-4" />
//                     </Button>
//                     <CardContent className="pt-6 space-y-3">
//                       <div>
//                         <Label className="text-xs text-muted-foreground">Customer:</Label>
//                         <p className="mt-1 text-sm">{example.user}</p>
//                       </div>
//                       <div>
//                         <Label className="text-xs text-muted-foreground">AI Response:</Label>
//                         <p className="mt-1 text-sm">{example.assistant}</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}

//                 <Card className="border-dashed">
//                   <CardContent className="pt-6 space-y-3">
//                     <Input
//                       placeholder="Customer message..."
//                       value={newExample.user}
//                       onChange={(e) => setNewExample({ ...newExample, user: e.target.value })}
//                     />
//                     <Textarea
//                       placeholder="How AI should respond..."
//                       value={newExample.assistant}
//                       onChange={(e) => setNewExample({ ...newExample, assistant: e.target.value })}
//                       rows={3}
//                     />
//                     <Button onClick={addExample} variant="outline" className="w-full">
//                       <Plus className="w-4 h-4 mr-2" />
//                       Add Example
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* KNOWLEDGE TAB */}
//         <TabsContent value="knowledge" className="space-y-4 mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Knowledge Base</CardTitle>
//               <CardDescription>
//                 Upload documents and information for AI to reference
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label>Enable Knowledge Base</Label>
//                   <p className="text-sm text-muted-foreground">
//                     Let AI search your documents and FAQs
//                   </p>
//                 </div>
//                 <Switch
//                   checked={config.useKnowledgeBase}
//                   onCheckedChange={(checked) => setConfig({ ...config, useKnowledgeBase: checked })}
//                 />
//               </div>

//               {config.useKnowledgeBase && (
//                 <>
//                   <div className="space-y-2">
//                     <Label>Search Mode</Label>
//                     <Select
//                       value={config.searchMode}
//                       onValueChange={(value) => setConfig({ ...config, searchMode: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="semantic">Semantic Search (Recommended)</SelectItem>
//                         <SelectItem value="keyword">Keyword Search</SelectItem>
//                         <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <p className="text-xs text-muted-foreground">
//                       Semantic search understands meaning, not just exact words
//                     </p>
//                   </div>

//                   <div className="space-y-3">
//                     <Label>Knowledge Documents</Label>
//                     <div className="rounded-lg border border-dashed p-8 text-center space-y-3">
//                       <Book className="w-12 h-12 mx-auto text-muted-foreground" />
//                       <div className="space-y-1">
//                         <p className="text-sm font-medium">Upload your documents</p>
//                         <p className="text-xs text-muted-foreground">
//                           PDF, TXT, DOC, or paste text directly
//                         </p>
//                       </div>
//                       <Button variant="outline">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Add Document
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="rounded-lg bg-muted p-4 space-y-2">
//                     <p className="text-sm font-medium">💡 Pro Tips:</p>
//                     <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
//                       <li>Include product catalogs, pricing sheets, and FAQs</li>
//                       <li>Add company policies and return procedures</li>
//                       <li>Upload conversation guidelines and brand voice docs</li>
//                       <li>Keep documents focused and well-organized</li>
//                     </ul>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* BEHAVIOR TAB */}
//         <TabsContent value="behavior" className="space-y-4 mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>AI Behavior & Handoff Rules</CardTitle>
//               <CardDescription>
//                 Control when and how AI handles conversations
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Max Conversation Turns</Label>
//                   <Input
//                     type="number"
//                     value={config.maxTurns}
//                     onChange={(e) => setConfig({ ...config, maxTurns: parseInt(e.target.value) })}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Auto-handoff after this many back-and-forth messages
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Response Length</Label>
//                   <Select
//                     value={config.responseLength}
//                     onValueChange={(value) => setConfig({ ...config, responseLength: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="concise">Concise (1-2 sentences)</SelectItem>
//                       <SelectItem value="medium">Medium (2-4 sentences)</SelectItem>
//                       <SelectItem value="detailed">Detailed (4+ sentences)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label>Auto Handoff to Human</Label>
//                   <p className="text-sm text-muted-foreground">
//                     Transfer complex cases automatically
//                   </p>
//                 </div>
//                 <Switch
//                   checked={config.autoHandoff}
//                   onCheckedChange={(checked) => setConfig({ ...config, autoHandoff: checked })}
//                 />
//               </div>

//               {config.autoHandoff && (
//                 <div className="space-y-2">
//                   <Label>Handoff Triggers</Label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {['frustrated', 'angry', 'wants_human', 'complex_issue', 'refund_request', 'complaint'].map((trigger) => (
//                       <div key={trigger} className="flex items-center space-x-2 rounded-lg border p-3">
//                         <input
//                           type="checkbox"
//                           id={trigger}
//                           checked={config.handoffTriggers.includes(trigger)}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setConfig({
//                                 ...config,
//                                 handoffTriggers: [...config.handoffTriggers, trigger]
//                               });
//                             } else {
//                               setConfig({
//                                 ...config,
//                                 handoffTriggers: config.handoffTriggers.filter(t => t !== trigger)
//                               });
//                             }
//                           }}
//                           className="rounded border-gray-300"
//                         />
//                         <label htmlFor={trigger} className="text-sm capitalize cursor-pointer">
//                           {trigger.replace('_', ' ')}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 <div className="flex items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <Label>Use Conversation History</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Remember previous messages in conversation
//                     </p>
//                   </div>
//                   <Switch
//                     checked={config.useConversationHistory}
//                     onCheckedChange={(checked) => setConfig({ ...config, useConversationHistory: checked })}
//                   />
//                 </div>

//                 <div className="flex items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <Label>Remember User Preferences</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Learn from past interactions with each user
//                     </p>
//                   </div>
//                   <Switch
//                     checked={config.rememberUserPreferences}
//                     onCheckedChange={(checked) => setConfig({ ...config, rememberUserPreferences: checked })}
//                   />
//                 </div>

//                 <div className="flex items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <Label>Ask Follow-up Questions</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Engage users with relevant questions
//                     </p>
//                   </div>
//                   <Switch
//                     checked={config.includeQuestions}
//                     onCheckedChange={(checked) => setConfig({ ...config, includeQuestions: checked })}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* FUNCTIONS TAB */}
//         <TabsContent value="functions" className="space-y-4 mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>AI Functions (Tool Use)</CardTitle>
//               <CardDescription>
//                 Let AI take actions beyond just chatting
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <p className="text-sm text-muted-foreground">
//                 Enable functions to let AI perform tasks like booking appointments, checking orders, or searching your product catalog.
//               </p>

//               <div className="space-y-2">
//                 {AVAILABLE_FUNCTIONS.map((func) => (
//                   <div key={func.id} className="flex items-start space-x-3 rounded-lg border p-4">
//                     <input
//                       type="checkbox"
//                       id={func.id}
//                       checked={config.enabledFunctions.includes(func.id)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setConfig({
//                             ...config,
//                             enabledFunctions: [...config.enabledFunctions, func.id]
//                           });
//                         } else {
//                           setConfig({
//                             ...config,
//                             enabledFunctions: config.enabledFunctions.filter(f => f !== func.id)
//                           });
//                         }
//                       }}
//                       className="mt-1 rounded border-gray-300"
//                     />
//                     <div className="flex-1">
//                       <label htmlFor={func.id} className="font-medium text-sm cursor-pointer">
//                         {func.name}
//                       </label>
//                       <p className="text-xs text-muted-foreground mt-1">{func.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {config.enabledFunctions.length > 0 && (
//                 <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4">
//                   <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                     ⚡ {config.enabledFunctions.length} function{config.enabledFunctions.length !== 1 ? 's' : ''} enabled
//                   </p>
//                   <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
//                     AI can now automatically use these tools when needed
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* SAFETY TAB */}
//         <TabsContent value="safety" className="space-y-4 mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Safety & Moderation</CardTitle>
//               <CardDescription>
//                 Protect your brand and customers
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label>Content Filtering</Label>
//                   <p className="text-sm text-muted-foreground">
//                     Block inappropriate or harmful content
//                   </p>
//                 </div>
//                 <Switch
//                   checked={config.contentFiltering}
//                   onCheckedChange={(checked) => setConfig({ ...config, contentFiltering: checked })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Sensitive Topics (Require Human Review)</Label>
//                 <Textarea
//                   placeholder="pricing&#10;refunds&#10;legal issues&#10;medical advice&#10;returns"
//                   value={config.sensitiveTopics.join('\n')}
//                   onChange={(e) => setConfig({
//                     ...config,
//                     sensitiveTopics: e.target.value.split('\n').filter(Boolean)
//                   })}
//                   rows={6}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   AI will flag conversations about these topics for human review
//                 </p>
//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label>Require Approval Before Sending</Label>
//                   <p className="text-sm text-muted-foreground">
//                     Review all AI responses before they're sent
//                   </p>
//                 </div>
//                 <Switch
//                   checked={config.requireApproval}
//                   onCheckedChange={(checked) => setConfig({ ...config, requireApproval: checked })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Confidence Threshold</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   max="1"
//                   step="0.1"
//                   value={config.confidenceThreshold}
//                   onChange={(e) => setConfig({ ...config, confidenceThreshold: parseFloat(e.target.value) })}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   If AI confidence is below this level, escalate to human (0.0 - 1.0)
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* ADVANCED TAB */}
//         <TabsContent value="advanced" className="space-y-4 mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Advanced Settings</CardTitle>
//               <CardDescription>
//                 Fine-tune AI behavior for power users
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Model</Label>
//                   <Select
//                     value={config.model}
//                     onValueChange={(value) => setConfig({ ...config, model: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="claude-sonnet-4-5">Claude Sonnet 4.5 (Recommended)</SelectItem>
//                       <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
//                       <SelectItem value="claude-haiku-4-5">Claude Haiku 4.5 (Faster)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Response Language</Label>
//                   <Select
//                     value={config.language}
//                     onValueChange={(value) => setConfig({ ...config, language: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="auto">Auto-detect</SelectItem>
//                       <SelectItem value="en">English</SelectItem>
//                       <SelectItem value="es">Spanish</SelectItem>
//                       <SelectItem value="fr">French</SelectItem>
//                       <SelectItem value="de">German</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Max Response Tokens</Label>
//                 <Input
//                   type="number"
//                   value={config.maxTokens}
//                   onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Longer responses = higher cost. ~0.75 words per token
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label>Temperature (Creativity)</Label>
//                 <Input
//                   type="number"
//                   min="0"
//                   max="1"
//                   step="0.1"
//                   value={config.temperature}
//                   onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   0 = focused and deterministic, 1 = creative and varied
//                 </p>
//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label>Use Emojis</Label>
//                   <p className="text-sm text-muted-foreground">
//                     Add emojis to responses for friendlier tone
//                   </p>
//                 </div>
//                 <Switch
//                   checked={config.useEmojis}
//                   onCheckedChange={(checked) => setConfig({ ...config, useEmojis: checked })}
//                 />
//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label>Personalize Responses</Label>
//                   <p className="text-sm text-muted-foreground">
//                     Use customer name and past interaction data
//                   </p>
//                 </div>
//                 <Switch
//                   checked={config.personalizeResponses}
//                   onCheckedChange={(checked) => setConfig({ ...config, personalizeResponses: checked })}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <div className="flex justify-end gap-3 pt-6 border-t">
//         <Button variant="outline">Test Configuration</Button>
//         <Button>Save AI Configuration</Button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Book, Users, Zap, AlertTriangle, MessageSquare, Settings, Plus, X, 
  ShoppingCart, CreditCard, Calendar, Database, Plug, Sparkles, TrendingUp,
  CheckCircle, Lock, Globe
} from 'lucide-react';

export default function RevolutionaryAIConfig() {
  const [config, setConfig] = useState({
    // Core AI
    model: 'claude-sonnet-4-5',
    tone: 'professional',
    systemPrompt: '',
    customInstructions: '',
    
    // Commerce Features 🔥
    enableCommerce: true,
    enablePayments: true,
    enableAppointments: true,
    enableProductCatalog: true,
    
    // MCP Integrations 🚀
    mcpEnabled: true,
    connectedServices: ['stripe', 'shopify', 'google_calendar'],
    
    // Security
    requirePaymentConfirmation: true,
    maxOrderValue: 500000, // $5000 in cents
    
    // Behavior
    autoHandoff: true,
    maxTurns: 15,
    confidenceThreshold: 0.7,
  });

  const [integrations, setIntegrations] = useState([
    { id: 'stripe', name: 'Stripe', icon: '💳', connected: false, category: 'payment' },
    { id: 'shopify', name: 'Shopify', icon: '🛍️', connected: false, category: 'commerce' },
    { id: 'google_calendar', name: 'Google Calendar', icon: '📅', connected: false, category: 'scheduling' },
    { id: 'hubspot', name: 'HubSpot', icon: '🎯', connected: false, category: 'crm' },
    { id: 'salesforce', name: 'Salesforce', icon: '☁️', connected: false, category: 'crm' },
    { id: 'postgres', name: 'PostgreSQL', icon: '🐘', connected: false, category: 'database' },
    { id: 'slack', name: 'Slack', icon: '💬', connected: false, category: 'notification' },
    { id: 'sendgrid', name: 'SendGrid', icon: '📧', connected: false, category: 'email' },
  ]);

  const CAPABILITIES = [
    { 
      id: 'commerce',
      title: 'AI Commerce',
      icon: ShoppingCart,
      description: 'Let AI browse, recommend, and sell products conversationally',
      features: ['Product search', 'Recommendations', 'Inventory check', 'Cart management']
    },
    {
      id: 'payments',
      title: 'Smart Payments',
      icon: CreditCard,
      description: 'Process secure payments directly in Instagram DMs',
      features: ['Payment links', 'Order tracking', 'Refund handling', 'Receipt generation']
    },
    {
      id: 'scheduling',
      title: 'Booking & Calendar',
      icon: Calendar,
      description: 'AI books appointments and manages your calendar',
      features: ['Availability checking', 'Auto-booking', 'Reminders', 'Rescheduling']
    },
    {
      id: 'crm',
      title: 'CRM Sync',
      icon: Database,
      description: 'Automatically update customer records in your CRM',
      features: ['Profile updates', 'Lead scoring', 'Tag management', 'Activity logging']
    },
  ];

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(int => int.id === id ? { ...int, connected: !int.connected } : int)
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">AI-Powered Commerce</h2>
              <p className="text-white/90">The future of Instagram automation</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-white/80">Automated</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Available</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">∞</div>
              <div className="text-sm text-white/80">Conversations</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">5s</div>
              <div className="text-sm text-white/80">Response Time</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
      </div>

      {/* Capabilities Overview */}
      <div className="grid md:grid-cols-2 gap-4">
        {CAPABILITIES.map((cap) => (
          <Card key={cap.id} className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <cap.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{cap.title}</CardTitle>
                  <CardDescription className="text-xs">{cap.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cap.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="integrations">
            <Plug className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="commerce">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Commerce
          </TabsTrigger>
          <TabsTrigger value="personality">
            <MessageSquare className="w-4 h-4 mr-2" />
            Personality
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Settings className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* INTEGRATIONS TAB - The Game Changer */}
        <TabsContent value="integrations" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>MCP Integrations</CardTitle>
                  <CardDescription>
                    Connect your business tools to give AI superpowers 🚀
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="gap-2">
                  <Globe className="w-4 h-4" />
                  {integrations.filter(i => i.connected).length} connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['payment', 'commerce', 'scheduling', 'crm', 'database', 'notification'].map((category) => {
                  const categoryIntegrations = integrations.filter(i => i.category === category);
                  if (categoryIntegrations.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {categoryIntegrations.map((integration) => (
                          <div
                            key={integration.id}
                            className={`
                              relative p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${integration.connected 
                                ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                                : 'border-border hover:border-primary/50'}
                            `}
                            onClick={() => toggleIntegration(integration.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{integration.icon}</span>
                                <div>
                                  <div className="font-medium">{integration.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {integration.connected ? 'Connected' : 'Click to connect'}
                                  </div>
                                </div>
                              </div>
                              {integration.connected && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                  <div className="flex gap-3">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        What happens when you connect these?
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• AI can process payments and create orders automatically</li>
                        <li>• Calendar syncs in real-time for appointment booking</li>
                        <li>• Customer data updates across all your tools</li>
                        <li>• Full conversation context for every interaction</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMMERCE TAB */}
        <TabsContent value="commerce" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Commerce Settings</CardTitle>
              <CardDescription>
                Configure how AI handles products, orders, and payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Enable AI Commerce</Label>
                    <p className="text-sm text-muted-foreground">
                      Let AI browse catalog, recommend products, and manage carts
                    </p>
                  </div>
                  <Switch
                    checked={config.enableCommerce}
                    onCheckedChange={(checked) => setConfig({ ...config, enableCommerce: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Process Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate secure payment links via Stripe
                    </p>
                  </div>
                  <Switch
                    checked={config.enablePayments}
                    onCheckedChange={(checked) => setConfig({ ...config, enablePayments: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Book Appointments</Label>
                    <p className="text-sm text-muted-foreground">
                      AI checks availability and schedules meetings
                    </p>
                  </div>
                  <Switch
                    checked={config.enableAppointments}
                    onCheckedChange={(checked) => setConfig({ ...config, enableAppointments: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">Product Catalog Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Search and display products from your inventory
                    </p>
                  </div>
                  <Switch
                    checked={config.enableProductCatalog}
                    onCheckedChange={(checked) => setConfig({ ...config, enableProductCatalog: checked })}
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                <div className="flex gap-3">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-amber-900 dark:text-amber-100 text-sm">
                      Pro Tip: Start with products
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Enable product catalog first, then payments. This lets customers browse before buying.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PERSONALITY TAB */}
        <TabsContent value="personality" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Personality</CardTitle>
              <CardDescription>
                Define how your AI talks to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea
                  placeholder="You are a helpful sales assistant for [Your Brand]. You help customers find products, answer questions, and complete purchases..."
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Custom Instructions</Label>
                <Textarea
                  placeholder="- Always suggest related products&#10;- Ask about budget before showing expensive items&#10;- Offer payment plans for orders over $200&#10;- Keep responses under 3 sentences"
                  value={config.customInstructions}
                  onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Limits</CardTitle>
              <CardDescription>
                Protect your business and customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Require Payment Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    AI must ask "Confirm payment?" before processing
                  </p>
                </div>
                <Switch
                  checked={config.requirePaymentConfirmation}
                  onCheckedChange={(checked) => setConfig({ ...config, requirePaymentConfirmation: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Maximum Order Value</Label>
                <div className="flex gap-2 items-center">
                  <span className="text-2xl">$</span>
                  <Input
                    type="number"
                    value={config.maxOrderValue / 100}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      maxOrderValue: parseFloat(e.target.value) * 100 
                    })}
                    className="max-w-[200px]"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Orders above this amount require manual approval
                </p>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-red-900 dark:text-red-100 text-sm">
                      All payments are PCI-DSS compliant
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      We never store credit card details. All transactions go through Stripe.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value="advanced" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>AI Model</Label>
                  <Select
                    value={config.model}
                    onValueChange={(value) => setConfig({ ...config, model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-sonnet-4-5">Claude Sonnet 4.5 (Best)</SelectItem>
                      <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
                      <SelectItem value="claude-haiku-4-5">Claude Haiku 4.5 (Faster)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Conversation Turns</Label>
                  <Input
                    type="number"
                    value={config.maxTurns}
                    onChange={(e) => setConfig({ ...config, maxTurns: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline">Test AI</Button>
        <Button size="lg">Save Configuration</Button>
      </div>
    </div>
  );
}