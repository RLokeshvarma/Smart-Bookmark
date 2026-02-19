# Smart Bookmark App

SmartBookmark is a modern full-stack bookmark management application built using **Next.js App Router, Supabase,** and **Tailwind CSS**.
It allows users to securely log in with Google, manage bookmarks, and experience a fully responsive SaaS-style UI.

---

## Live Demo

Deployed on Vercel -> https://smart-bookmark-app-abs.vercel.app/

---

## Project Requirements


---

## Tech Stack

- **Frontend**  Next.js 16(App Router)
- **Backend**  Supabase
- **Database**  PostgreSQL (Supabase)
- **Auth**  Supabase Google Auth
- **Styling**  Tailwind CSS
- **Deployment**  Vercel
- **Version Control**  GitHub
---

## Architecture Overview

```txt
User (Browser)
      ↓
Next.js Frontend (App Router)
      ↓
Supabase Auth (Google OAuth)
      ↓
Supabase Database (PostgreSQL)
      ↓
Row Level Security (auth.uid() = user_id)
      ↓
Filtered Data Returned
      ↓
React State Updates UI
      ↓
Bookmark Cards Rendered
```

---

## Folder Structure

```txt
app/
 ├── page.tsx
 ├── dashboard/
 │     ├── page.tsx
 │     └── DashboardClient.tsx
components/
 ├──  BookmarkList.tsx
 ├──  BookmarkForm.tsx
 ├──  LoginButton.tsx
 └──  ThemeToggle.tsx
lib/
 └── supabaseClient.ts
middleware.ts
```

---

## Challenges Faced & Solutions


---

## Future Improvements

- Bookmark categories
- Favorites feature
- Drag & drop reordering
- Shareable public bookmark collections

---

## What this Project Demonstrates

- Full-stack architecture knowledge
- Secure authentication handling
- Database design with RLS
- Responsive UI development
- Production deployment workflow
- Debugging and problem-solving skills

---

