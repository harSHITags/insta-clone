"use client"

import { Button } from "@/components/ui/button"
import { Home, Search, PlusSquare, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/client"

export function Header({ userId }: { userId: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/feed" className="text-2xl font-bold">
          Instagram
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant={isActive("/feed") ? "default" : "ghost"} size="icon" asChild>
            <Link href="/feed">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant={isActive("/explore") ? "default" : "ghost"} size="icon" asChild>
            <Link href="/explore">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant={isActive("/create") ? "default" : "ghost"} size="icon" asChild>
            <Link href="/create">
              <PlusSquare className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant={isActive(`/profile/${userId}`) ? "default" : "ghost"} size="icon" asChild>
            <Link href={`/profile/${userId}`}>
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  )
}
