"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProfilePage() {
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        setUsername(profile.username || "")
        setFullName(profile.full_name || "")
        setBio(profile.bio || "")
        setAvatarUrl(profile.avatar_url || "")
      }
    }

    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          full_name: fullName.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        })
        .eq("id", userId)

      if (updateError) throw updateError

      router.push(`/profile/${userId}`)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container max-w-2xl mx-auto flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/profile/${userId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold ml-4">Edit Profile</h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input id="avatarUrl" type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
