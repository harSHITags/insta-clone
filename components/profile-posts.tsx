import Link from "next/link"
import { Heart, MessageCircle } from "lucide-react"

interface ProfilePostsProps {
  posts: Array<{
    id: string
    image_url: string
    likesCount: number
    commentsCount: number
  }>
}

export function ProfilePosts({ posts }: ProfilePostsProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`} className="relative aspect-square group">
          <img
            src={post.image_url || "/placeholder.svg"}
            alt="Post"
            className="h-full w-full object-cover rounded-sm"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <Heart className="h-6 w-6 fill-white" />
              <span className="font-semibold">{post.likesCount}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <MessageCircle className="h-6 w-6 fill-white" />
              <span className="font-semibold">{post.commentsCount}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
