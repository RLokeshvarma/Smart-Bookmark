"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabaseClient"

type Props = {
  user: any
  search: string
}

export default function BookmarkList({ user, search }: Props) {
  const supabase = createClient()
  const [bookmarks, setBookmarks] = useState<any[]>([])

  const fetchBookmarks = async () => {
    if (!user) return

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  useEffect(() => {
    fetchBookmarks()

    const interval = setInterval(fetchBookmarks, 2000)
    return () => clearInterval(interval)
  }, [user])

  const handleDelete = async (id: string) => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  const filtered = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  if (filtered.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-20">
        No bookmarks found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {filtered.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-white dark:bg-[#2A2A2A] p-5 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
        >
          <h3 className="font-semibold text-lg md:text-xl mb-2 dark:text-white">
            {bookmark.title}
          </h3>

          <a
            href={bookmark.url}
            target="_blank"
            className="text-[#FF6B01] text-sm break-all hover:underline"
          >
            {bookmark.url}
          </a>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="px-3 py-1 text-sm bg-black text-white dark:bg-gray-700 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
