import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/feed")
  } else {
    redirect("/auth/login")
  }
}
