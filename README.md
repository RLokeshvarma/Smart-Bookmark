# Smart Bookmark

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/RLokeshvarma/Smart-Bookmark)

Smart Bookmark is a modern, full-stack bookmark management application. It allows users to securely save, search, and manage their links through a clean, responsive interface. Built with the Next.js App Router, Supabase, and Tailwind CSS, it offers a fast, real-time experience.

## Live Demo

A live version of the application is deployed on Vercel:

**[https://smart-bookmark-app-abs.vercel.app/](https://smart-bookmark-app-abs.vercel.app/)**

## Features

-   **Secure Authentication**: Simple and secure login using Google OAuth, managed by Supabase Auth.
-   **Full CRUD Functionality**: Create, read, and delete your bookmarks with ease.
-   **Real-time Updates**: The bookmark list updates in real-time as you add or remove items.
-   **Live Search**: Instantly filter your bookmarks by title.
-   **Dark/Light Mode**: A theme toggle for user preference, with settings saved to local storage.
-   **User-Scoped Data**: Bookmarks are private to each user, enforced by Supabase's Row Level Security (RLS).
-   **Responsive Design**: A seamless experience across desktop, tablet, and mobile devices.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Backend & Database**: [Supabase](https://supabase.io/) (PostgreSQL)
-   **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or a compatible package manager
-   A Supabase account ([Sign up for free](https://supabase.com/))

### 1. Set Up Your Supabase Project

1.  Go to the [Supabase Dashboard](https://app.supabase.com) and create a new project.
2.  Navigate to the **SQL Editor** and run the following query to create the `bookmarks` table:

    ```sql
    CREATE TABLE bookmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```

3.  Enable **Row Level Security (RLS)** on the `bookmarks` table.
4.  In the SQL Editor, create policies to ensure users can only access their own data:

    ```sql
    -- Allow users to view their own bookmarks
    CREATE POLICY "Enable read access for authenticated users"
    ON public.bookmarks FOR SELECT
    USING (auth.uid() = user_id);

    -- Allow users to insert their own bookmarks
    CREATE POLICY "Enable insert for authenticated users"
    ON public.bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    -- Allow users to delete their own bookmarks
    CREATE POLICY "Enable delete for users based on user_id"
    ON public.bookmarks FOR DELETE
    USING (auth.uid() = user_id);
    ```

5.  Navigate to **Authentication** > **Providers** and enable the **Google** provider.
6.  Go to **Project Settings** > **API** and copy your `Project URL` and `anon (public)` API key.

### 2. Local Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/rlokeshvarma/smart-bookmark.git
    cd smart-bookmark
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the root of the project and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Folder Structure

The project follows the standard Next.js App Router structure with a few key areas:

```
.
├── app/
│   ├── (auth)/                # Authentication related pages (login, callback)
│   ├── dashboard/             # Protected dashboard route and client component
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing/Login page
├── components/
│   ├── BookmarkForm.tsx       # Component for adding new bookmarks
│   ├── BookmarkList.tsx       # Component to display and manage bookmarks
│   ├── LoginButton.tsx        # Google OAuth login button
│   └── ThemeToggle.tsx        # Dark/Light mode toggle
├── lib/
│   ├── supabaseClient.ts      # Supabase client-side helper
│   └── supabaseServer.ts      # Supabase server-side helper
└── middleware.ts              # Protects the /dashboard route (can be expanded)
```

## Future Improvements

-   **Categorization**: Add tags or categories to organize bookmarks.
-   **Favorites**: Allow users to mark bookmarks as favorites for quick access.
--   **Edit Functionality**: Implement the ability to edit a bookmark's title and URL.
-   **Drag & Drop**: Introduce drag-and-drop reordering for bookmarks.
-   **Shared Collections**: Allow users to create and share public collections of bookmarks.
