"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

interface UserCardProps {
  user: {
    id: string
    username: string
    full_name: string | null
    bio: string | null
    avatar_url: string | null
    isFollowing: boolean
  }
  currentUserId: string
}

export function UserCard({ user, currentUserId }: UserCardProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleFollow = async () => {
    if (isLoading) return
    setIsLoading(true)

    const supabase = createClient()

    try {
      if (isFollowing) {
        await supabase.from("follows").delete().eq("follower_id", currentUserId).eq("following_id", user.id)
        setIsFollowing(false)
      } else {
        await supabase.from("follows").insert({
          follower_id: currentUserId,
          following_id: user.id,
        })
        setIsFollowing(true)
      }
      router.refresh()
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${user.id}`} className="font-semibold hover:underline block">
              {user.username}
            </Link>
            {user.full_name && <p className="text-sm text-muted-foreground">{user.full_name}</p>}
            {user.bio && <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>}
          </div>
        </div>
        <Button variant={isFollowing ? "outline" : "default"} onClick={handleFollow} disabled={isLoading}>
          {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
        </Button>
      </CardContent>
    </Card>
  )
}
