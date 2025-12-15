# Instagram API Setup Guide

This guide will help you set up Instagram API integration for your automation platform.

## Prerequisites

1. A Facebook Developer account
2. A Facebook Page connected to your Instagram Business or Creator account
3. Your Instagram account must be a Business or Creator account (not personal)

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Select "Business" as the app type
4. Fill in app details:
   - App Name: "Your App Name"
   - Contact Email: your-email@example.com

## Step 2: Configure Instagram Basic Display

1. In your app dashboard, go to "Add Product"
2. Find "Instagram" and click "Set Up"
3. Go to "Instagram Basic Display" → "Settings"
4. Configure OAuth Redirect URIs:
   - Add: `https://yourdomain.com/api/auth/instagram/callback`
   - Add: `http://localhost:3000/api/auth/instagram/callback` (for development)

## Step 3: Add Required Permissions

Your app needs these Instagram permissions:

- **instagram_basic** - Access to basic profile info
- **instagram_manage_messages** - Send and receive direct messages
- **instagram_manage_comments** - Read and respond to comments
- **instagram_content_publish** - Create and publish posts
- **pages_show_list** - List Facebook pages
- **pages_read_engagement** - Read page engagement data

## Step 4: Get Your Credentials

1. In your app dashboard, go to "Settings" → "Basic"
2. Copy your:
   - **App ID** (Client ID)
   - **App Secret** (Client Secret)

## Step 5: Configure Environment Variables

Add these to your `.env.local` file:

\`\`\`env
# Instagram API Credentials
INSTAGRAM_CLIENT_ID=your_app_id_here
INSTAGRAM_CLIENT_SECRET=your_app_secret_here

# Your app URL (for OAuth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your production URL

# Webhook verification token (generate a random string)
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_random_verification_token_here

# Database connection (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url_here
\`\`\`

## Step 6: Set Up Webhooks (Optional but Recommended)

Webhooks allow real-time message and comment notifications:

1. In your app dashboard, go to "Instagram" → "Configuration"
2. Add a webhook:
   - Callback URL: `https://yourdomain.com/api/instagram/webhooks`
   - Verify Token: (use the same token from your env file)
3. Subscribe to these fields:
   - `messages` - For DM notifications
   - `comments` - For comment notifications
   - `story_insights` - For story reply notifications

## Step 7: Submit Your App for Review

For production use, you need to submit your app for review:

1. Go to "App Review" → "Permissions and Features"
2. Request these permissions:
   - instagram_manage_messages
   - instagram_manage_comments
   - instagram_content_publish
3. Provide screencast demonstrations showing how you use each permission
4. Wait for Facebook to approve (typically 1-2 weeks)

## Step 8: Test Your Integration

1. Run your app: `npm run dev`
2. Navigate to Settings in your dashboard
3. Click "Connect Instagram Account"
4. Complete the OAuth flow
5. Your Instagram account should now be connected!

## Token Management

- **Short-lived tokens** last 1 hour
- **Long-lived tokens** last 60 days
- The app automatically exchanges for long-lived tokens
- Tokens should be refreshed every 60 days using `InstagramAPI.refreshAccessToken()`

## API Rate Limits

Instagram API has rate limits:

- **Messages**: 200 calls per hour per user
- **Comments**: 200 calls per hour per user
- **Content Publishing**: 25 posts per day per user

The app handles rate limits automatically with exponential backoff.

## Troubleshooting

### "Invalid OAuth access token"
- Token may have expired - reconnect Instagram account
- Check that INSTAGRAM_CLIENT_SECRET is correct

### "Insufficient permissions"
- Make sure you've requested all required permissions
- Check that your app is approved for production use

### Webhooks not working
- Verify your webhook URL is publicly accessible (use ngrok for local testing)
- Check that INSTAGRAM_WEBHOOK_VERIFY_TOKEN matches in both app and code
- Ensure webhook subscriptions are enabled for your page

### Messages not sending
- Verify the Instagram account is a Business or Creator account
- Check that you have instagram_manage_messages permission
- The recipient must have messaged your account first (24-hour window rule)

## Development vs Production

### Development Mode
- Use test users created in Facebook App Dashboard
- Webhooks won't work without a public URL (use ngrok)
- Rate limits are more restrictive

### Production Mode
- Must submit app for review and get approved
- All permissions must be granted
- Webhooks work with your production domain
- Full rate limits apply

## Security Best Practices

1. **Never commit credentials** - Use environment variables
2. **Rotate secrets regularly** - Change CLIENT_SECRET periodically
3. **Validate webhook signatures** - Verify requests are from Instagram
4. **Use HTTPS** - Always use secure connections in production
5. **Refresh tokens** - Set up automatic token refresh before expiry

## Additional Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Messenger Platform Webhooks](https://developers.facebook.com/docs/messenger-platform/webhooks)
- [Instagram API Rate Limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)
- [App Review Guidelines](https://developers.facebook.com/docs/app-review)

## Support

If you encounter issues:

1. Check the [Instagram API Status](https://developers.facebook.com/status/)
2. Review error logs in your application
3. Consult [Facebook Developer Community](https://developers.facebook.com/community/)
