"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { chatService } from "@/lib/services/chat-service"
import { ConversationList } from "@/components/chat/conversation-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { EmptyChat } from "@/components/chat/empty-chat"
import type { Conversation, Message } from "@/lib/types"
import { Loader2, AlertCircle } from "lucide-react"
import Loading from "./loading"
import { useAuth } from "@/hooks/use-auth"
import { useAppSelector } from "@/hooks/redux-store-hooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function MessagesContent() {
  const { user, userProfile } = useAuth()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileShowChat, setMobileShowChat] = useState(false)

  // Initialize with tutor param if present
  const tutorId = searchParams.get("tutor")

  useEffect(() => {
    if (!user) return

    // Subscribe to conversations
    const unsubscribe = chatService.subscribeToConversations(user.uid, (convs) => {
      setConversations(convs)
      setLoading(false)

      // Auto-select first conversation or the one matching tutorId
      if (convs.length > 0 && !selectedConversation) {
        if (tutorId) {
          const tutorConv = convs.find((c) => c.participants.includes(tutorId))
          if (tutorConv) {
            setSelectedConversation(tutorConv)
            setMobileShowChat(true)
          }
        }
      }
    })

    return () => unsubscribe()
  }, [user, tutorId, selectedConversation])

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([])
      return
    }

    // Subscribe to messages
    const unsubscribe = chatService.subscribeToMessages(selectedConversation.id, (msgs) => {
      setMessages(msgs)
    })

    // Mark as read
    if (user) {
      chatService.markAsRead(selectedConversation.id, user.uid)
    }

    return () => unsubscribe()
  }, [selectedConversation, user])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMobileShowChat(true)
  }

  const handleBackToList = () => {
    setMobileShowChat(false)
  }

  const handleSendMessage = async (text: string) => {
    if (!selectedConversation || !user || !userProfile) return

    await chatService.sendMessage(
      selectedConversation.id,
      user.uid,
      userProfile.displayName,
      text,
      userProfile.photoURL
    )
  }

  const getOtherParticipant = (conversation: Conversation): { id: string, name: string, photo: string } => {
    const otherId = conversation.participants.find((p) => p !== user?.uid) || ""
    return {
      id: otherId,
      name: conversation.participantNames[otherId] || "Unknown",
      photo: conversation.participantPhotos[otherId] || "",
    }
  }

  const { allMatchings: matchings } = useAppSelector((state) => state.matching)

  // Find matching for selected conversation
  const selectedMatching = selectedConversation ? matchings.find(m =>
    (m.learnerId === user?.uid && m.tutorId === getOtherParticipant(selectedConversation).id) ||
    (m.tutorId === user?.uid && m.learnerId === getOtherParticipant(selectedConversation).id)
  ) : null

  const isValidationPending = selectedMatching?.status === "requested"

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border bg-card">
      {/* Conversation List - Hidden on mobile when chat is open */}
      <div
        className={`w-full border-r border-border md:w-80 md:block ${mobileShowChat ? "hidden" : "block"
          }`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          currentUserId={user?.uid || ""}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Chat Window - Hidden on mobile when list is shown */}
      <div className={`flex-1 ${mobileShowChat ? "block" : "hidden md:block"}`}>
        {selectedConversation ? (
          isValidationPending ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <Alert className="max-w-md border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 font-semibold">Contact en attente de validation</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {userProfile?.role === "student"
                    ? "Le tuteur n'a pas encore validé votre demande de contact. Vous pourrez discuter dès qu'il aura accepté."
                    : "Vous devez valider cette demande de contact depuis votre tableau de bord avant de pouvoir discuter avec l'étudiant."}
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="mt-4 md:hidden" onClick={handleBackToList}>
                Retour à la liste
              </Button>
            </div>
          ) : (
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              currentUserId={user?.uid || ""}
              otherParticipant={getOtherParticipant(selectedConversation)}
              onSendMessage={handleSendMessage}
              onBack={handleBackToList}
            />
          )
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Chat with your tutors and students</p>
      </div>

      <Suspense fallback={<Loading />}>
        <MessagesContent />
      </Suspense>
    </div>
  )
}
