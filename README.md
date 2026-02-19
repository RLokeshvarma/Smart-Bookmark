# Smart Bookmark App

A full-stack bookmark manager built with **Next.js**, **Supabase**, and **Tailwind CSS**. Users sign in with Google and manage their own private bookmarks.

**Live Demo:** [https://smart-bookmark-app-abs.vercel.app/](https://smart-bookmark-app-abs.vercel.app/)  

---

## Problem, Why & How

People lose important links across chat messages, tabs, and notes. This app gives every user a **private, searchable space** to save bookmarks — isolated from other users at the database level.

### Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | Modern routing, server + client components, middleware support |
| **Backend** | Supabase (PostgreSQL) | Managed database, no custom backend needed |
| **Authentication** | Supabase Auth + Google OAuth | Secure OAuth flow, session handling out of the box |
| **Real-time** | Supabase Realtime (Polling fallback) | Cross-tab sync without building a WebSocket server |
| **Styling** | Tailwind CSS | Utility-first, fast to write and maintain |
| **Deployment** | Vercel | Zero-config, native Next.js support |

### How It Works

```
┌─────────────┐     Login      ┌──────────────────┐
│    User     │ ─────────────► │  Supabase Auth   │
│  (Browser)  │                │  (Google OAuth)  │
└─────────────┘                └────────┬─────────┘
                                        │ Session stored
                                        │ in Cookies
                                        ▼
                               ┌──────────────────┐
                               │  Next.js App     │
                               │  /dashboard      │
                               └────────┬─────────┘
                                        │ Fetch bookmarks
                                        ▼
                               ┌──────────────────┐
                               │  PostgreSQL DB   │
                               │  (bookmarks      │
                               │   table)         │
                               └────────┬─────────┘
                                        │ RLS enforced
                                        ▼
                               ┌──────────────────┐
                               │ auth.uid()       │
                               │  = user_id       │
                               │ (only your data) │
                               └────────┬─────────┘
                                        │ Filtered data
                                        ▼
                               ┌──────────────────┐
                               │  React State     │
                               │  → UI Rendered   │
                               └──────────────────┘
```

### Auth Flow

```
  User clicks "Login with Google"
              │
              ▼
  ┌───────────────────────┐
  │   Supabase initiates  │
  │     OAuth request     │
  └───────────┬───────────┘
              │
              ▼
  ┌───────────────────────┐
  │  Google Login Screen  │
  │  (user authenticates) │
  └───────────┬───────────┘
              │ redirects with code
              ▼
  ┌───────────────────────┐
  │   /auth/callback      │
  │  exchanges code for   │
  │      session          │
  └───────────┬───────────┘
              │ session saved in cookies
              ▼
  ┌───────────────────────┐
  │  Middleware validates │
  │  session on every     │
  │  /dashboard request   │
  └───────────┬───────────┘
              │
       ┌──────┴──────┐
       ▼             ▼
    Logged in     Not logged in
  → /dashboard   → redirect to /
```

---

## Features

- Google OAuth login & protected routes
- Add / Delete bookmarks (Title + URL)
- Search & filter bookmarks
- Real-time-like sync across tabs (polling fallback)
- Dark / Light mode toggle
- Per-user data isolation via Supabase RLS

---

## Database Schema

```sql
CREATE TABLE bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);
-- RLS Policy: auth.uid() = user_id
```

---

## Project Structure

```
app/
├── auth/callback/route.ts      # OAuth callback & session exchange
├── dashboard/
│   ├── page.tsx                # Server component — auth check
│   └── DashboardClient.tsx     # Client component — bookmark logic
└── page.tsx                    # Landing / login page

components/
├── BookmarkForm.tsx            # Add bookmark modal
├── BookmarkList.tsx            # Bookmark card grid
├── LoginButton.tsx             # Google OAuth trigger
└── ThemeToggle.tsx             # Dark/light switch

lib/
├── supabaseClient.ts           # Browser Supabase client
└── supabaseServer.ts           # Server Supabase client

middleware.ts                   # Protects /dashboard route
```

---

## Problems & Solutions

**1. OAuth redirecting to homepage** — Missing `/auth/callback` route. Fixed by implementing the callback handler to exchange the code for a session.

**2. Middleware package not found** — `@supabase/auth-helpers-nextjs` is deprecated. Migrated to `@supabase/ssr` with `createServerClient()`.

**3. Dashboard rendering blank** — Incorrect default component export. Fixed the export and folder structure to match App Router conventions.

**4. Realtime WebSocket timing out** — WebSockets were blocked in the local environment. Replaced with a polling fallback — stable, no WebSocket dependency.


---

## Local Setup

Clone from github
```bash
git clone https://github.com/your-username/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Run your project
```bash
npm run dev
```

---

## Deployment

1. Push to GitHub → Import on [Vercel](https://vercel.com)
2. Add both env variables in Vercel dashboard
3. In Supabase → update **Site URL** and **Redirect URL** to your Vercel URL
