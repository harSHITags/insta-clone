"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"

interface FollowButtonProps {
  profileId: string
  currentUserId: string
  initialIsFollowing: boolean
}

export function FollowButton({ profileId, currentUserId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleFollow = async () => {
    if (isLoading) return
    setIsLoading(true)

    const supabase = createClient()

    try {
      if (isFollowing) {
        await supabase.from("follows").delete().eq("follower_id", currentUserId).eq("following_id", profileId)
        setIsFollowing(false)
      } else {
        await supabase.from("follows").insert({
          follower_id: currentUserId,
          following_id: profileId,
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
    <Button variant={isFollowing ? "outline" : "default"} onClick={handleFollow} disabled={isLoading}>
      {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  )
}
