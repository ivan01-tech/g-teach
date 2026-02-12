"use client"

import { Suspense } from "react"
import { useAuth } from "@/hooks/use-auth"
import Loading from "./loading"
import { ConversationList } from "@/components/chat/conversation-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { EmptyChat } from "@/components/chat/empty-chat"
import { Loader2 } from "lucide-react"
import { useMessageTutors } from "./use-message-tutors"

function BetreuerMessagesContent() {
  const { user } = useAuth()
  const { conversations, selectedConversation, messages, loading, mobileShowChat, handleSelectConversation, handleBackToList, handleSendMessage, getOtherParticipant } = useMessageTutors()

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Discutez avec vos étudiants</p>
      </div>

      <div className="flex h-[calc(100vh-14rem)] overflow-hidden rounded-xl border border-border bg-card">
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
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              currentUserId={user?.uid || ""}
              otherParticipant={getOtherParticipant(selectedConversation)}
              onSendMessage={handleSendMessage}
              onBack={handleBackToList}
            />
          ) : (
            <EmptyChat />
          )}
        </div>
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
