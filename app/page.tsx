import { createClient } from "@/lib/supabaseServer"
import { redirect } from "next/navigation"
import LoginButton from "@/components/LoginButton"

export default async function Home() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
  <main className="relative min-h-screen flex items-center justify-center">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src="https://images.pexels.com/photos/2693529/pexels-photo-2693529.jpeg"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>

    {/* App Name */}
    <div className="absolute top-6 left-8 text-[#FF6B01] text-3xl font-bold">
      Smart Bookmark App
    </div>

    {/* Login Card */}
    <div className="relative z-10 bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl text-center w-96 border border-white/20">
      <h1 className="text-white text-2xl font-semibold mb-6">
        Welcome Back
      </h1>

      <LoginButton />
    </div>
  </main>
)
}