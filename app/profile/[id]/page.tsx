import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ProfilePosts } from "@/components/profile-posts"
import { FollowButton } from "@/components/follow-button"
import Link from "next/link"

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (!profile) redirect("/feed")

  const { data: posts } = await supabase
    .from("posts")
    .select("id, image_url, likes(count), comments(count)")
    .eq("author_id", id)
    .order("created_at", { ascending: false })

  const { count: followers } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", id)

  const { count: following } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", id)

  const { data: followData } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", id)
    .single()

  const isOwnProfile = user.id === id
  const isFollowing = !!followData

  const formattedPosts =
    posts?.map((post) => ({
      ...post,
      likesCount: post.likes?.[0]?.count || 0,
      commentsCount: post.comments?.[0]?.count || 0,
    })) || []

  return (
    <div className="min-h-screen bg-background">
      <Header userId={user.id} />
      <main className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-4xl">{profile.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                <h1 className="text-2xl font-semibold">{profile.username}</h1>
                {isOwnProfile ? (
                  <Button variant="outline" asChild>
                    <Link href="/settings/profile">Edit Profile</Link>
                  </Button>
                ) : (
                  <FollowButton profileId={id} currentUserId={user.id} initialIsFollowing={isFollowing} />
                )}
              </div>

              <div className="flex gap-8 justify-center md:justify-start mb-4">
                <div>
                  <span className="font-semibold">{formattedPosts.length}</span> posts
                </div>
                <div>
                  <span className="font-semibold">{followers || 0}</span> followers
                </div>
                <div>
                  <span className="font-semibold">{following || 0}</span> following
                </div>
              </div>

              {profile.full_name && <p className="font-semibold mb-1">{profile.full_name}</p>}
              {profile.bio && <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>}
            </div>
          </div>

          <div className="border-t pt-6">
            <ProfilePosts posts={formattedPosts} />
          </div>
        </div>
      </main>
    </div>
  )
}
