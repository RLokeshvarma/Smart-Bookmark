"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import BookmarkList from "@/components/BookmarkList"

export default function DashboardClient() {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  // 🔹 Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/")
        return
      }

      setUser(data.user)
      setLoading(false)
    }

    getUser()
  }, [])

  // 🔥 Logout sync
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAddBookmark = async (e: any) => {
    e.preventDefault()
    if (!title || !url) return

    const { error } = await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id },
    ])

    if (!error) {
      setTitle("")
      setUrl("")
      setShowAddModal(false)
    }
  }

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains("dark")) {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  if (loading || !user) {
    return <div className="p-10">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#1E1E1E] transition">

      {/* NAVBAR */}
      <div className="flex items-center bg-white dark:bg-[#2A2A2A] border-b border-gray-200 dark:border-gray-700 px-10 py-3">

        {/* Left 25% */}
        <div className="w-1/4">
          <h1 className="text-xl font-bold text-[#FF6B01]">
            SmartBookmark
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            Organize your digital world
          </p>
        </div>

        {/* Right 75% */}
        <div className="w-3/4 flex justify-between items-center">

          {/* Search */}
          <div className="relative w-[550px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              placeholder="Search bookmarks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg 
              border border-gray-300 
              dark:border-gray-600 
              bg-white dark:bg-[#3A3A3A] 
              text-gray-800 dark:text-white 
              placeholder-gray-400 dark:placeholder-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#FF6B01]/40"
            />
          </div>

          <div className="flex items-center gap-5">

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-1.5 text-sm rounded-lg bg-orange-100 text-[#FF6B01] hover:bg-orange-200 transition"
            >
              + Add Bookmark
            </button>

            <div className="relative">
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition"
              >
                👤
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#2A2A2A] 
                border border-gray-200 dark:border-gray-600 
                rounded-lg shadow-lg">

                  <button
                    onClick={toggleTheme}
                    className="w-full text-left px-4 py-2 text-sm 
                    text-gray-700 dark:text-white 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Toggle Dark Mode
                  </button>

                  <button
                    onClick={async () => {
                      await supabase.auth.signOut()
                      router.push("/")
                    }}
                    className="w-full text-left px-4 py-2 text-sm 
                    text-gray-700 dark:text-white 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex">

        {/* SIDEBAR */}
        <div className="w-1/4 bg-white dark:bg-[#2A2A2A] border-r border-gray-200 dark:border-gray-700 min-h-screen p-8">
          <h2 className="font-semibold mb-6 text-lg text-[#353535] dark:text-white">
            Bookmarks
          </h2>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p className="cursor-pointer hover:text-[#FF6B01] transition">
              All Bookmarks
            </p>
            <p className="cursor-pointer hover:text-[#FF6B01] transition">
              Recent
            </p>
            <p className="cursor-pointer hover:text-[#FF6B01] transition">
              Favorites
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-10">
          <BookmarkList user={user} search={search} />
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white dark:bg-[#2A2A2A] p-8 rounded-xl w-[450px] shadow-xl">
            <h2 className="text-lg font-semibold mb-6 dark:text-white">
              Add Bookmark
            </h2>

            <form onSubmit={handleAddBookmark} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#3A3A3A] p-2 rounded-lg dark:text-white"
              />

              <input
                type="text"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#3A3A3A] p-2 rounded-lg dark:text-white"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B01] text-white rounded-lg hover:opacity-90 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
