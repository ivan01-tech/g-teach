"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/lib/types"
import { useState } from "react"

interface ConversationListProps {
  conversations: Conversation[]
  selectedId?: string
  currentUserId: string
  onSelect: (conversation: Conversation) => void
}

export function ConversationList({
  conversations,
  selectedId,
  currentUserId,
  onSelect,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) => {
    const otherId = conv.participants.find((p) => p !== currentUserId) || ""
    const otherName = conv.participantNames[otherId] || ""
    return otherName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatTime = (date?: Date) => {
    if (!date) return ""
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="mb-3 text-lg font-semibold text-card-foreground">Conversations</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <div>
              <p className="text-muted-foreground">
                {conversations.length === 0
                  ? "No conversations yet"
                  : "No conversations found"}
              </p>
              {conversations.length === 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Start a conversation by messaging a tutor
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => {
              const otherId = conversation.participants.find((p) => p !== currentUserId) || ""
              const otherName = conversation.participantNames[otherId] || "Unknown"
              const otherPhoto = conversation.participantPhotos[otherId] || ""
              const unreadCount = conversation.unreadCount[currentUserId] || 0

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelect(conversation)}
                  className={cn(
                    "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                    selectedId === conversation.id && "bg-muted"
                  )}
                >
                  <Avatar>
                    <AvatarImage src={otherPhoto || "/placeholder.svg"} alt={otherName} />
                    <AvatarFallback>{otherName[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium text-card-foreground">{otherName}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm text-muted-foreground">
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                      {unreadCount > 0 && (
                        <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
