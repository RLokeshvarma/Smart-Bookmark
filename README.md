# Smart Bookmark App

A full-stack bookmark manager built with **Next.js**, **Supabase**, and **Tailwind CSS**. Users sign in with Google and manage their own private bookmarks.

**Live Demo:** [https://smart-bookmark-app-abs.vercel.app/](https://smart-bookmark-app-abs.vercel.app/)  

---

## Problem, Why & How

People save important links in random places — WhatsApp messages, sticky notes, open browser tabs — and lose them. This app gives every user a **clean, private, searchable space** to save and revisit bookmarks, with the guarantee that no one else can ever see their data.

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

### 1. After Google Login, App Redirected Back to Homepage

I clicked login, went through Google's screen, and ended up right back on the landing page. No error, no dashboard — just a loop.

After digging in, the issue was that I had no `/auth/callback` route at all. Supabase OAuth works by redirecting back to your app with a `code` in the URL — and that code needs to be exchanged for a session. Without the callback route, there was nowhere to do that exchange, so the session was never created.

**Fix:** Created `/app/auth/callback/route.ts` that receives the code and calls `supabase.auth.exchangeCodeForSession()`, then redirects to `/dashboard`.


### 2. Middleware Threw "Module Not Found" Error

The app crashed immediately on startup with `Cannot find module '@supabase/auth-helpers-nextjs'`. I had followed an older tutorial that used this package for protecting routes in middleware.

Turns out `auth-helpers-nextjs` is deprecated and no longer works with the Next.js App Router's new middleware pattern.

**Fix:** Switched to `@supabase/ssr` and used `createServerClient()` with the correct cookie handlers. This is the officially supported approach for App Router.

### 3. Dashboard Loaded But Showed a Blank Page

Once auth was working, hitting `/dashboard` just showed a white screen — no error in the browser, nothing in the terminal either.

The problem was a broken default export on `page.tsx`. Next.js App Router silently fails to render a page if the default export isn't a valid React component — it doesn't throw, it just renders nothing.

**Fix:** Corrected the default export and cleaned up the component structure. Lesson learned: always double-check exports when App Router pages go blank without errors.

### 4. Supabase Realtime WebSocket Kept Timing Out

The assignment required bookmarks to sync across tabs in real-time. I set up Supabase Realtime subscriptions, but the connection kept showing `TIMED_OUT` in the logs and never actually fired any events.

The root cause was that WebSocket connections were being blocked in my local environment. I spent time debugging the Supabase config before realising the issue wasn't in my code at all.

**Fix:** Replaced Realtime with a polling fallback — fetch on mount, apply optimistic updates on user actions, and re-fetch on tab focus. Not as elegant as WebSockets, but completely stable and reliable across all environments.


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
