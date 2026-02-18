"use client"

import { createClient } from "@/lib/supabaseClient"
import { FcGoogle } from "react-icons/fc"

export default function LoginButton() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }
  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 bg-[#FF6B01] text-white px-4 py-2 rounded-lg hover:bg-gray-100 hover:text-black transition w-full"
    >
      <FcGoogle size={20} />
      Login with Google
    </button>
  )
}
