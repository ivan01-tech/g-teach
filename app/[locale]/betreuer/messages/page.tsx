"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { EmptyChat } from "@/components/chat/empty-chat"
import { getConversations, type ConversationWithDetails } from "@/lib/chat-service"
import Loading from "./loading"

function BetreuerMessagesContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("conversation")
  
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadConversations = async () => {
      try {
        const data = await getConversations(user.uid)
        setConversations(data)
      } catch (error) {
        console.error("Error loading conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [user])

  const selectedConversation = conversations.find((c) => c.id === conversationId)

  if (loading) {
    return null
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* <ConversationList
        conversations={conversations}
        selectedId={conversationId}
        currentUserId={user?.uid || ""}
        basePath="/betreuer/messages"
      /> */}
      
      <div className="flex-1">
        {/* {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUserId={user?.uid || ""}
          />
        ) : (
          <EmptyChat message="Exchange with your students. Discuss their goals and offer personalized support." />
        )} */}
      </div>
    </div>
  )
}

export default function BetreuerMessagesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BetreuerMessagesContent />
    </Suspense>
  )
}
