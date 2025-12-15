# Yazzil - Instagram Automation Platform

A powerful Instagram DM automation and content creation platform built with Next.js 16, featuring AI-powered content generation, visual automation builders, and real-time messaging.

## Features

### Core Automation
- Visual automation builder with trigger and action configuration
- Multiple trigger types: DM received, keywords, first message, story replies, comments, mentions
- Action types: Send messages, add tags, delays, webhooks, conditional branching
- Variable substitution for personalized messages ({name}, {username})
- Automation testing and analytics

### Messaging & Inbox
- Real-time conversation management with polling
- Message search and filtering
- Quick reply templates
- Conversation tagging and organization
- Broadcast messaging to multiple users

### AI Content Generation
- AI-powered caption generation with customizable tone and length
- Smart hashtag suggestions (popular, medium, and niche mix)
- Image generation support (ready for fal.ai, DALL-E, or Gemini integration)
- Content calendar for scheduling posts

### Analytics
- Message activity tracking
- Automation performance metrics
- Conversation analytics
- Growth tracking

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: Clerk
- **AI**: Vercel AI SDK v5 (OpenAI GPT-4o-mini)
- **Styling**: Tailwind CSS v4 with glassmorphism effects
- **UI Components**: Radix UI (shadcn/ui)
- **Real-time**: Polling (5s conversations, 3s messages)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database
- Clerk account for authentication
- Instagram Business/Creator account
- Facebook Developer account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd yazzil
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your credentials:
\`\`\`env
# Database
DATABASE_URL=your_neon_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Instagram API
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_random_token

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

4. Set up the database:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Instagram API Setup

Follow the detailed guide in [INSTAGRAM_API_SETUP.md](./INSTAGRAM_API_SETUP.md) to:
- Create a Facebook app
- Configure Instagram API permissions
- Set up webhooks for real-time notifications
- Submit your app for review

## Project Structure

\`\`\`
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Main dashboard pages
│   │   ├── dashboard/       # Overview page
│   │   ├── inbox/          # Message management
│   │   ├── automations/    # Automation builder
│   │   ├── content/        # Content creation hub
│   │   ├── analytics/      # Analytics dashboard
│   │   └── settings/       # App settings
│   ├── actions/            # Server actions
│   └── api/                # API routes
├── components/             # React components
├── lib/                   # Utility functions
│   ├── automation-engine.ts  # Automation execution
│   ├── instagram-api.ts      # Instagram API client
│   └── analytics-tracker.ts  # Analytics tracking
├── prisma/                # Database schema
└── hooks/                 # Custom React hooks
\`\`\`

## Key Features Implementation

### Automation Engine

The automation engine (`lib/automation-engine.ts`) processes triggers and executes actions:

\`\`\`typescript
// Example: Process incoming message
await processAutomationTriggers({
  messageContent: "Hello",
  senderId: "user_id",
  conversationId: "conv_id",
  messageType: "DM",
  isFirstMessage: true
})
\`\`\`

### Instagram API Client

The Instagram API client (`lib/instagram-api.ts`) handles all Instagram interactions:

\`\`\`typescript
const api = new InstagramAPI({ accessToken, instagramId })

// Send a message
await api.sendMessage(recipientId, "Hello!")

// Reply to a comment
await api.replyToComment(commentId, "Thanks!")

// Publish a photo
await api.publishPhoto(imageUrl, caption)
\`\`\`

### Real-time Updates

Polling hooks (`hooks/use-polling.ts`) provide real-time data:

\`\`\`typescript
usePolling(fetchConversations, {
  interval: 5000,  // 5 seconds
  enabled: true,
  onSuccess: (data) => setConversations(data)
})
\`\`\`

### AI Content Generation

AI-powered content generation using Vercel AI SDK:

\`\`\`typescript
const { text } = await generateText({
  model: "openai/gpt-4o-mini",
  prompt: `Generate Instagram captions about "${topic}"...`,
  maxOutputTokens: 500
})
\`\`\`

## Database Schema

Key models:
- **User** - User accounts (Clerk integration)
- **InstagramAccount** - Connected Instagram accounts
- **Automation** - Automation workflows
- **AutomationTrigger** - Trigger conditions
- **AutomationAction** - Actions to execute
- **Conversation** - Instagram conversations
- **Message** - Individual messages
- **Tag** - Conversation tags
- **ContentPost** - Scheduled content
- **Analytics** - Usage metrics

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to update:
- `NEXT_PUBLIC_APP_URL` to your production URL
- `DATABASE_URL` to your production database
- Instagram webhook callback URL in Facebook app settings

## API Routes

### Authentication
- `GET /api/auth/instagram/connect` - Initiate Instagram OAuth
- `GET /api/auth/instagram/callback` - OAuth callback handler

### Automations
- `GET /api/automations` - List all automations
- `POST /api/automations/[id]/test` - Test an automation

### Messages
- `GET /api/messages` - Get messages for a conversation
- `POST /api/messages/send` - Send a message

### Content
- `POST /api/content/generate-caption` - Generate AI captions
- `POST /api/content/generate-hashtags` - Generate hashtags
- `POST /api/content/generate-image` - Generate images
- `POST /api/content/schedule` - Schedule a post

### Instagram
- `GET /api/instagram/webhooks` - Webhook verification
- `POST /api/instagram/webhooks` - Webhook handler
- `POST /api/instagram/sync-profile` - Sync Instagram profile

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@yazzil.app or join our Discord community.

## Roadmap

- [ ] WebSocket support for true real-time updates
- [ ] Drag-and-drop visual automation builder
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] Multi-account management
- [ ] Template library for automations
- [ ] A/B testing for messages
- [ ] Integration marketplace

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- Inspired by ManyChat and other automation platforms
