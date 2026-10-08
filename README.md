# ARTech Labs

ARTech Labs is building digital experiences, software solutions, production support, and digital products. This repository contains the ARTech Labs website.

## Stack

- React + TypeScript
- TanStack Start and Vite
- Tailwind CSS
- Supabase for contact inquiry submissions

## Local development

1. Install dependencies with Bun: `bun install`
2. Copy `.env.example` to `.env.local`.
3. Set the Supabase project URL and publishable key in `.env.local`.
4. Start the development server: `bun run dev`

Build for production with `bun run build`.

## Supabase contact inquiries

The contact form submits to `public.contact_inquiries`. The schema migration is in `supabase/migrations/202610090001_create_contact_inquiries.sql`.

Row-level security is enabled. The public role can insert validated inquiries only; public reads and updates are not granted.

## Deployment environment

Configure these environment variables in the deployment provider:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Use a Supabase **publishable** key in the browser. Never put a Supabase service-role or secret key in client-side code.

## Project showcase

The Work section component remains in the codebase but is temporarily commented out on the homepage until ARTech Labs has real projects to showcase.
