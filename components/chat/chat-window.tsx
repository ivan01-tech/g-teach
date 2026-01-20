"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, MoreVertical, Phone, Video, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Conversation, Message } from "@/lib/types"

interface ChatWindowProps {
  conversation: Conversation
  messages: Message[]
  currentUserId: string
  otherParticipant: { id: string; name: string; photo: string }
  onSendMessage: (text: string) => void
  onBack: () => void
}

export function ChatWindow({
  conversation,
  messages,
  currentUserId,
  otherParticipant,
  onSendMessage,
  onBack,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    onSendMessage(inputValue.trim())
    setInputValue("")
    inputRef.current?.focus()
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDateDivider = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
    }
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = []
  let currentDate = ""

  messages.forEach((message) => {
    const messageDate = message.createdAt.toDateString()
    if (messageDate !== currentDate) {
      currentDate = messageDate
      groupedMessages.push({ date: messageDate, messages: [message] })
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message)
    }
  })

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src={otherParticipant.photo || "/placeholder.svg"} alt={otherParticipant.name} />
            <AvatarFallback>{otherParticipant.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-card-foreground">{otherParticipant.name}</h3>
            <p className="text-xs text-muted-foreground">
              <Link href={`/tutors/${otherParticipant.id}`} className="hover:underline">
                View Profile
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Info className="mr-2 h-4 w-4" />
                View Info
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {groupedMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground">No messages yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedMessages.map((group) => (
              <div key={group.date}>
                {/* Date Divider */}
                <div className="flex items-center justify-center">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {formatDateDivider(new Date(group.date))}
                  </span>
                </div>

                {/* Messages */}
                <div className="mt-4 space-y-3">
                  {group.messages.map((message) => {
                    const isOwn = message.senderId === currentUserId

                    return (
                      <div
                        key={message.id}
                        className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "flex max-w-[75%] gap-2",
                            isOwn ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          {!isOwn && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.senderPhoto || "/placeholder.svg"} alt={message.senderName} />
                              <AvatarFallback className="text-xs">
                                {message.senderName[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-2",
                                isOwn
                                  ? "rounded-br-md bg-primary text-primary-foreground"
                                  : "rounded-bl-md bg-muted text-foreground"
                              )}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                            <p
                              className={cn(
                                "mt-1 text-xs text-muted-foreground",
                                isOwn ? "text-right" : "text-left"
                              )}
                            >
                              {formatMessageTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
