"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export function CreatePostButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button size="lg" className="rounded-full h-14 w-14 shadow-lg" asChild>
        <Link href="/create">
          <PlusCircle className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  )
}
