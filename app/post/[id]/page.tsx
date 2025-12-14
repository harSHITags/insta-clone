import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { PostDetailCard } from "@/components/post-detail-card"
import { CommentsList } from "@/components/comments-list"
import { CommentForm } from "@/components/comment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch post with author and counts
  const { data: post } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles!posts_author_id_fkey(id, username, full_name, avatar_url),
      likes(count)
    `,
    )
    .eq("id", id)
    .single()

  if (!post) {
    redirect("/feed")
  }

  // Check if user liked the post
  const { data: userLike } = await supabase.from("likes").select("id").eq("post_id", id).eq("user_id", user.id).single()

  // Fetch comments with author profiles
  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles!comments_author_id_fkey(id, username, avatar_url)
    `,
    )
    .eq("post_id", id)
    .order("created_at", { ascending: true })

  const formattedPost = {
    ...post,
    author: post.profiles,
    likesCount: post.likes?.[0]?.count || 0,
    isLiked: !!userLike,
  }

  const formattedComments =
    comments?.map((comment) => ({
      ...comment,
      author: comment.profiles,
    })) || []

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container max-w-2xl mx-auto flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/feed">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold ml-4">Post</h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <PostDetailCard post={formattedPost} currentUserId={user.id} />
          <CommentsList comments={formattedComments} currentUserId={user.id} />
          <CommentForm postId={id} />
        </div>
      </main>
    </div>
  )
}
