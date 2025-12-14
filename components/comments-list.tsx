import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    username: string
    avatar_url: string | null
  }
}

export function CommentsList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.avatar_url || undefined} />
            <AvatarFallback>{comment.author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <Link href={`/profile/${comment.author.id}`} className="font-semibold hover:underline">
                {comment.author.username}
              </Link>{" "}
              {comment.content}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
