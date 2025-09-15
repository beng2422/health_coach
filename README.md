# Health Coach App

A comprehensive health and wellness tracking application built with Next.js, Supabase, and AI-powered coaching features.

## Features

- **Daily Health Tracking**: Log food intake, activities, and personal notes
- **AI-Powered Coaching**: Get personalized health insights and recommendations
- **Progress Dashboard**: Visualize your health journey with charts and analytics
- **Goal Setting**: Set and track health and wellness goals
- **Calendar Integration**: View your health data in a calendar format
- **Chat Interface**: Interactive AI coach for health guidance
- **Authentication**: Secure user authentication with Supabase Auth

## Tech Stack

- [Next.js 13](https://nextjs.org) with App Router
- [Supabase](https://supabase.com) for database and authentication
- [OpenAI](https://openai.com) for AI coaching features
- [Tailwind CSS](https://tailwindcss.com) for styling
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Chart.js](https://chartjs.org) for data visualization
- [TypeScript](https://typescriptlang.org) for type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- OpenAI API key

### Environment Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd health_coach
```

2. Copy the environment example file:
```bash
cp .env.example .env.local
```

3. Fill in your environment variables in `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### Database Setup

1. Install the Supabase CLI:
```bash
npm install -g supabase
```

2. Start the local Supabase stack:
```bash
supabase start
```

3. Run the database migrations:
```bash
supabase db reset
```

### Installation and Development

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── api/              # API routes
│   ├── components/       # App-specific components
│   └── pages/            # App pages
├── components/           # Reusable UI components
├── lib/                  # Utility functions and configurations
├── supabase/            # Database migrations and config
└── public/              # Static assets
```

## Key Features

### Daily Health Tracking
- Log daily food intake, activities, and personal notes
- AI analysis of your daily entries
- Nutrition information tracking

### AI Coaching
- Personalized health recommendations
- Interactive chat interface with AI coach
- Goal-based coaching and motivation

### Dashboard & Analytics
- Activity overview charts
- Task distribution visualization
- Progress tracking and statistics

### Calendar View
- Monthly view of health data
- Easy navigation through historical data

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Database and auth powered by [Supabase](https://supabase.com)
- AI features powered by [OpenAI](https://openai.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)