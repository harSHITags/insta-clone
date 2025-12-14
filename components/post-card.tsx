"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
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
    commentsCount: number
    isLiked: boolean
  }
  currentUserId: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked)
  const [likes, setLikes] = useState(post.likesCount)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleLike = async () => {
    if (loading) return
    setLoading(true)

    const supabase = createClient()

    try {
      if (liked) {
        await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", currentUserId)
        setLiked(false)
        setLikes((prev) => prev - 1)
      } else {
        await supabase.from("likes").insert({ post_id: post.id, user_id: currentUserId })
        setLiked(true)
        setLikes((prev) => prev + 1)
      }
      router.refresh()
    } catch (err) {
      console.error("Like failed:", err)
    } finally {
      setLoading(false)
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleLike} disabled={loading}>
              <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/post/${post.id}`}>
                <MessageCircle className="h-6 w-6" />
              </Link>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>

        <p className="text-sm font-semibold">{likes} likes</p>

        {post.caption && (
          <p className="text-sm">
            <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
              {post.author.username}
            </Link>{" "}
            {post.caption}
          </p>
        )}

        {post.commentsCount > 0 && (
          <Link href={`/post/${post.id}`} className="text-sm text-muted-foreground hover:underline">
            View all {post.commentsCount} comments
          </Link>
        )}

        <p className="text-xs text-muted-foreground uppercase">
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </p>
      </div>
    </Card>
  )
}
