"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { chatService } from "@/lib/services/chat-service"
import { ConversationList } from "@/components/chat/conversation-list"
import { EmptyChat } from "@/components/chat/empty-chat"
import type { Conversation, Message } from "@/lib/types"
import { Loader2 } from "lucide-react"
import Loading from "./loading"
import { useAuth } from "@/hooks/use-auth"

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

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return { name: "", photo: "" }
    const otherId = conversation.participants.find((p) => p !== user.uid) || ""
    return {
      id: otherId,
      name: conversation.participantNames[otherId] || "Unknown",
      photo: conversation.participantPhotos[otherId] || "",
    }
  }

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
        className={`w-full border-r border-border md:w-80 md:block ${
          mobileShowChat ? "hidden" : "block"
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
          // <ChatWindow
          //   conversation={selectedConversation}
          //   messages={messages}
          //   currentUserId={user?.uid || ""}
          //   otherParticipant={getOtherParticipant(selectedConversation)}
          //   onSendMessage={handleSendMessage}
          //   onBack={handleBackToList}
          // />
          <div></div>
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
