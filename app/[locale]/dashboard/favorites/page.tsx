"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useFavorites } from "@/hooks/use-favorites"
import { TutorCard } from "@/components/tutors/tutor-card"

export default function FavoritesPage() {
  const {
    favoriteTutors,
    commentedTutors,
    loading,
    refreshFavoritesDashboard
  } = useFavorites()

  useEffect(() => {
    refreshFavoritesDashboard()
  }, [refreshFavoritesDashboard])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes Favoris & Interactions</h1>
        <p className="text-muted-foreground">Gérez vos tuteurs préférés et retrouvez ceux que vous avez commentés.</p>
      </div>

      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favoris
          </TabsTrigger>
          <TabsTrigger value="commented" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Profils commentés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="mt-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : favoriteTutors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Sans favoris pour le moment</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Enregistrez vos tuteurs préférés pour les retrouver rapidement plus tard.
                  Cliquez sur l'icône de cœur sur n'importe quel profil de tuteur.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/tutors">Parcourir les tuteurs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteTutors.map((tutor) => (
                <TutorCard key={tutor.uid} tutor={tutor} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="commented" className="mt-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : commentedTutors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Pas de commentaires</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Les tuteurs sur lesquels vous avez laissé un avis apparaîtront ici.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/tutors">Parcourir les tuteurs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {commentedTutors.map((tutor) => (
                <TutorCard key={tutor.uid} tutor={tutor} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
