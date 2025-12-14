"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CommentFormProps {
  postId: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isLoading) return

    setIsLoading(true)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        author_id: user.id,
        content: content.trim(),
      })

      if (error) throw error

      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-4">
      <Input
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !content.trim()}>
        {isLoading ? "Posting..." : "Post"}
      </Button>
    </form>
  )
}
