import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { PostCard } from "@/components/post-card"
import { CreatePostButton } from "@/components/create-post-button"
import { Header } from "@/components/header"

export default async function FeedPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles!posts_author_id_fkey(id, username, full_name, avatar_url),
      likes(count),
      comments(count)
    `)
    .order("created_at", { ascending: false })

  const { data: userLikes } = await supabase.from("likes").select("post_id").eq("user_id", user.id)

  const likedPostIds = new Set(userLikes?.map((like) => like.post_id) || [])

  const formattedPosts =
    posts?.map((post) => ({
      ...post,
      author: post.profiles,
      likesCount: post.likes?.[0]?.count || 0,
      commentsCount: post.comments?.[0]?.count || 0,
      isLiked: likedPostIds.has(post.id),
    })) || []

  return (
    <div className="min-h-screen bg-background">
      <Header userId={user.id} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {formattedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Start sharing!</p>
            </div>
          ) : (
            formattedPosts.map((post) => <PostCard key={post.id} post={post} currentUserId={user.id} />)
          )}
        </div>
      </main>
      <CreatePostButton />
    </div>
  )
}
