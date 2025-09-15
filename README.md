# LaunchKit AI

An AI-powered platform that creates complete business launch strategies in minutes. Users fill out an intake form about their business idea and receive a comprehensive kit including business case, content strategy, and actionable next steps.

## Features

- **Intake Form**: Comprehensive form capturing idea details, target audience, goals, and constraints
- **AI Generation**: Business case and content strategy generated using OpenAI
- **Dual Pricing**: £37 one-time payment or £1/day × 37 days subscription
- **Teaser Content**: Blurred previews of locked content
- **PDF Downloads**: Exportable business documents
- **Regeneration**: Up to 3 regenerations per output section
- **Templates Library**: Placeholder for future template offerings

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (both one-time and subscription)
- **AI**: OpenAI GPT for content generation
- **PDF Generation**: jsPDF + html2canvas
- **Validation**: Zod schemas
- **Forms**: React Hook Form

## Setup Instructions

### 1. Environment Variables

Copy `env.example` to `.env.local` and fill in your credentials:

```bash
cp env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `OPENAI_API_KEY` - OpenAI API key

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL from `database/schema.sql` in your Supabase SQL editor
3. This creates all necessary tables with Row Level Security enabled

### 3. Stripe Setup

1. Create Stripe products:
   - One-time payment: £37
   - Subscription: £1/day for 37 days
2. Set up webhook endpoint pointing to `/api/webhooks/stripe`
3. Select these webhook events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`

### 4. Run Development Server

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── start/             # Intake form page
│   ├── kit/[id]/preview/  # Kit preview and payment
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── IntakeForm.tsx     # Main intake form
├── lib/                   # Utilities and configurations
│   ├── schemas.ts         # Zod validation schemas
│   ├── database.types.ts  # TypeScript database types
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Utility functions
database/
└── schema.sql            # Database schema and policies
```

## Current Status

✅ **Completed:**
- Project setup with Next.js, TypeScript, Tailwind
- Comprehensive Zod validation schemas
- Complete database schema with RLS
- Intake form with all required fields
- Teaser pages with blurred content previews
- Payment page UI (placeholder for Stripe integration)

🚧 **In Progress:**
- Authentication system
- Stripe payment integration
- OpenAI content generation
- PDF generation and downloads
- Regeneration system with 3-attempt cap
- User dashboard

## Next Steps

1. **Add Authentication**: Implement email/password auth with Supabase Auth
2. **Configure Stripe**: Set up actual payment processing
3. **AI Integration**: Build OpenAI prompts for business case and content strategy generation
4. **PDF Generation**: Create downloadable reports
5. **Dashboard**: Build user portal for managing kits and accessing content

## Contributing

This is a commercial project. Please ensure all development follows the business requirements and maintains the premium user experience.

## License

All rights reserved. This is proprietary software for LaunchKit AI.
