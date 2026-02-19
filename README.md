# 🔖 Smart Bookmark App

A full-stack bookmark management app built with **Next.js**, **Supabase**, and **Tailwind CSS**. Users can log in with Google, save personal bookmarks, search through them, and toggle dark mode.

🔗 **Live Demo:** [https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)

---

## 🚀 Tech Stack

- **Next.js 16** (App Router)
- **Supabase** — Auth (Google OAuth), PostgreSQL, Row Level Security
- **Tailwind CSS**
- **Vercel** (Deployment)

---

## ✨ Features

- Google OAuth login & protected routes
- Add / Delete personal bookmarks
- Search & filter bookmarks
- Dark / Light mode toggle
- Per-user data isolation via Supabase RLS

---

## 🗄️ Database Schema

```sql
CREATE TABLE bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);
```

Row Level Security is enabled — users can only access their own bookmarks (`auth.uid() = user_id`).

---

## 🛠️ Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/smart-bookmark-app.git
cd smart-bookmark-app

# 2. Install dependencies
npm install

# 3. Add environment variables — create a .env.local file:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. Run the dev server
npm run dev
```

Visit **http://localhost:3000**

---

## 📁 Project Structure

```
app/
├── auth/callback/route.ts       # OAuth callback
├── dashboard/
│   ├── page.tsx                 # Protected dashboard
│   └── DashboardClient.tsx      # Bookmark UI logic
└── page.tsx                     # Login page

components/
├── BookmarkForm.tsx
├── BookmarkList.tsx
├── LoginButton.tsx
└── ThemeToggle.tsx

lib/
├── supabaseClient.ts
└── supabaseServer.ts
```

---

## 🚀 Deployment

Deployed on **Vercel**. Add the two environment variables in the Vercel dashboard and update your Supabase project's **Site URL** and **Redirect URL** to your Vercel deployment URL.
