# Golf Platform

Full-stack Next.js app with Supabase auth + RBAC.

## Features
- Email/password auth
- Auto profile creation
- Role-based access (user/admin)
- Admin panel: view/promote/demote users
- Protected routes
- Row Level Security

## Setup
1. Copy `.env.example` to `.env.local`
2. Set Supabase URL + Anon key
3. `npm install`
4. `npm run dev`
5. http://localhost:3000

## Admin
- First login creates admin role
- /admin - manage users
