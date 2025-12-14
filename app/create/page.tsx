"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function CreatePostPage() {
  const [caption, setCaption] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()

       try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: insertError } = await supabase.from("posts").insert({
          author_id: user.id,
        caption: caption.trim() || null,
        image_url: imageUrl,
      })

      if (insertError) throw insertError

       router.push("/feed")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container max-w-2xl mx-auto flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/feed">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold ml-4">Create Post</h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>New Post</CardTitle>
            <CardDescription>Share a moment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {imageUrl && (
                  <div className="relative aspect-square w-full max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
                    <img src={imageUrl || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write something..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={4}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading || !imageUrl}>
                {loading ? "Posting..." : "Share"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
