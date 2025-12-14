"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface PostDetailCardProps {
  post: {
    id: string
    caption: string | null
    image_url: string
    created_at: string
    author: {
      id: string
      username: string
      full_name: string | null
      avatar_url: string | null
    }
    likesCount: number
    isLiked: boolean
  }
  currentUserId: string
}

export function PostDetailCard({ post, currentUserId }: PostDetailCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    if (isLoading) return
    setIsLoading(true)

    const supabase = createClient()

    try {
      if (isLiked) {
        await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", currentUserId)
        setIsLiked(false)
        setLikesCount((prev) => Math.max(0, prev - 1))
      } else {
        await supabase.from("likes").insert({ post_id: post.id, user_id: currentUserId })
        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
      router.refresh()
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar_url || undefined} />
          <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <Link href={`/profile/${post.author.id}`} className="font-semibold text-sm hover:underline">
          {post.author.username}
        </Link>
      </div>

      <div className="relative aspect-square w-full bg-muted">
        <img
          src={post.image_url || "/placeholder.svg"}
          alt={post.caption || "Post"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike} disabled={isLoading}>
            <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        <p className="text-sm font-semibold">{likesCount} likes</p>

        {post.caption && (
          <p className="text-sm">
            <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
              {post.author.username}
            </Link>{" "}
            {post.caption}
          </p>
        )}

        <p className="text-xs text-muted-foreground uppercase">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </p>
      </div>
    </Card>
  )
}
