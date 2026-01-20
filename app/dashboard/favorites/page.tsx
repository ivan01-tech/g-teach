"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  // In a real app, this would fetch favorites from Firebase
  const favorites: unknown[] = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Favorite Tutors</h1>
        <p className="text-muted-foreground">Tutors you&apos;ve saved for later</p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">No favorites yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Save your favorite tutors to quickly find them later. Click the heart icon on any tutor profile.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/tutors">Browse Tutors</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tutor cards would go here */}
        </div>
      )}
    </div>
  )
}
