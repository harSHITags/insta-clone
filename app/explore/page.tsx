import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { Header } from "@/components/header"
import { UserCard } from "@/components/user-card"

export default async function ExplorePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all profiles except current user
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", user.id)
    .order("created_at", { ascending: false })

  // Get user's following list
  const { data: following } = await supabase.from("follows").select("following_id").eq("follower_id", user.id)

  const followingIds = new Set(following?.map((f) => f.following_id) || [])

  const usersWithFollowStatus =
    profiles?.map((profile) => ({
      ...profile,
      isFollowing: followingIds.has(profile.id),
    })) || []

  return (
    <div className="min-h-screen bg-background">
      <Header userId={user.id} />
      <main className="container max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Discover People</h2>
        <div className="grid gap-4">
          {usersWithFollowStatus.map((profile) => (
            <UserCard key={profile.id} user={profile} currentUserId={user.id} />
          ))}
          {usersWithFollowStatus.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users to explore yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
